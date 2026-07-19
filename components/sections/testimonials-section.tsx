"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Quote } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface TestimonialItem {
  id: string
  name: string
  content: string
  location?: string | null
  rating?: number | null
  isFeatured?: boolean
}

const gradients = [
  "from-maroon-800 to-primary",
  "from-gold-700 to-secondary",
  "from-primary-dark to-maroon-900",
  "from-sand-700 to-sand-600",
]

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -200 : 200,
    opacity: 0,
  }),
}

export function TestimonialsSection() {
  const { t } = useTranslation()
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetch("/api/testimonials?isApproved=true&limit=6")
      .then((r) => r.json())
      .then((d) => {
        const list = d.data?.testimonials || d.testimonials || d || []
        setTestimonials(Array.isArray(list) ? list : [])
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }, [current])

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % (testimonials.length || 1))
  }, [testimonials.length])

  useEffect(() => {
    if (paused || testimonials.length === 0) return
    intervalRef.current = setInterval(next, 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [paused, next, testimonials.length])

  const tData = testimonials[current]

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-gradient-to-b from-[#FDF8F0] via-[#FCF6E8] to-[#FDF8F0]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.04)_0%,_transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-script font-semibold text-dark-slate leading-tight">
            {t("home.devoteesSpeak")}
          </h2>
          <div className="mt-4 h-0.5 w-16 rounded-full bg-gradient-to-r from-gold-400 to-gold-600" />
        </motion.div>

        <div
          className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="min-h-[400px] sm:min-h-[420px] flex items-center">
            {loading && (
              <div className="w-full text-center">
                <span className="text-sm text-dark-slate/60">{t("common.loading")}</span>
              </div>
            )}
            {error && (
              <div className="w-full text-center">
                <span className="text-sm text-dark-slate/60">{t("common.error")}</span>
              </div>
            )}
            {!loading && !error && (!tData || testimonials.length === 0) && (
              <div className="w-full text-center">
                <span className="text-sm text-dark-slate/60">{t("common.noResults")}</span>
              </div>
            )}
            {!loading && !error && tData && (
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full"
                >
                  <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
                    <div className="shrink-0">
                      <div className={`relative w-52 h-52 sm:w-60 sm:h-60 lg:w-72 lg:h-72 rounded-full bg-gradient-to-br ${gradients[current % gradients.length]} shadow-2xl`}>
                        <div className="absolute inset-2 rounded-full bg-white/10 backdrop-blur-[2px]" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-white/80 text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center">
                              <span className="text-2xl sm:text-3xl font-script font-semibold">
                                {(tData.name || "").split(" ").map((n) => n[0]).join("")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 relative">
                      <Quote
                        className="absolute -top-8 -left-4 text-gold-400/15"
                        size={120}
                        strokeWidth={1}
                      />
                      <blockquote className="relative z-10">
                        <p className="text-xl sm:text-2xl lg:text-3xl font-script leading-relaxed text-dark-slate/85">
                          &ldquo;{tData.content || ""}&rdquo;
                        </p>
                      </blockquote>
                      <div className="mt-6 flex items-center gap-3">
                        <div className="h-px w-8 bg-gold-400/40" />
                        <div>
                          <p className="text-base font-medium text-dark-slate">{tData.name}</p>
                          {tData.location && (
                            <p className="text-sm text-dark-slate/50">{tData.location}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          <div className="flex justify-center gap-3 mt-10">
            {!loading && !error && testimonials.length > 0 && testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="group relative flex items-center justify-center"
                aria-label={`${t("common.goTo")} ${i + 1}`}
              >
                <motion.div
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-8 h-2.5 bg-gradient-to-r from-gold-500 to-gold-400"
                      : "w-2.5 h-2.5 bg-dark-slate/20 hover:bg-dark-slate/40"
                  }`}
                  layout
                  layoutId="activeDot"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
