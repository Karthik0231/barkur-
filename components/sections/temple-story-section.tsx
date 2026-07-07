"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { useTranslation } from "@/lib/i18n"

const milestones = [
  { year: "1200 CE", label: "Temple Establishment", description: "The sacred shrine of Sri Kalikamba Devi was consecrated on the banks of the Haladi River, becoming a beacon of spiritual solace for generations." },
  { year: "1500 CE", label: "Chola Renovations", description: "Under the patronage of the Chola dynasty, the temple saw its first major expansion with the addition of the ornate gopuram and pillared mandapa." },
  { year: "1800 CE", label: "Vijayanagara Patronage", description: "The Vijayanagara rulers enriched the temple with intricate carvings, a sprawling temple tank, and endowments that sustained daily rituals." },
  { year: "2024 CE", label: "Temple Restoration", description: "A comprehensive restoration revived the temple's ancient grandeur, preserving its architectural heritage for centuries to come." },
]

export function TempleStorySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const clipProgress = useTransform(scrollYProgress, [0, 0.3], [100, 0])
  const imageParallax = useTransform(scrollYProgress, [0, 1], [0, -60])
  const contentOpacity = useTransform(scrollYProgress, [0.1, 0.35], [0, 1])
  const contentX = useTransform(scrollYProgress, [0.1, 0.35], [60, 0])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-warm-ivory"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row min-h-[42rem]">
          <div className="relative w-full lg:w-1/2 min-h-[24rem] lg:min-h-[42rem] overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-maroon-950"
              style={{ clipPath: useTransform(clipProgress, (v) => `inset(0 ${v}% 0 0)`) }}
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(212,175,55,0.03) 2px, rgba(212,175,55,0.03) 4px),
                    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(212,175,55,0.03) 2px, rgba(212,175,55,0.03) 4px)
                  `,
                }}
              />
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage: `
                    radial-gradient(ellipse at 30% 20%, rgba(212,175,55,0.4) 0%, transparent 50%),
                    radial-gradient(ellipse at 70% 80%, rgba(212,175,55,0.2) 0%, transparent 50%),
                    radial-gradient(ellipse at 50% 50%, rgba(91,14,22,0.6) 0%, transparent 70%)
                  `,
                }}
              />
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: "60px 60px",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-primary/20" />
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                style={{ y: imageParallax }}
              >
                <div className="text-center px-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-gold-500/30 bg-gold-500/10 backdrop-blur-sm mb-8">
                    <svg viewBox="0 0 40 40" className="w-10 h-10 text-gold-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="20" cy="20" r="18" />
                      <circle cx="20" cy="20" r="12" />
                      <circle cx="20" cy="20" r="6" />
                      <line x1="2" y1="20" x2="38" y2="20" />
                      <line x1="20" y1="2" x2="20" y2="38" />
                    </svg>
                  </div>
                  <p className="text-gold-300/60 text-xs uppercase tracking-[0.25em] font-light">
                    Sri Kalikamba Temple
                  </p>
                </div>
              </motion.div>
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-warm-ivory via-warm-ivory/80 to-transparent lg:hidden" />
            </motion.div>
          </div>

          <motion.div
            className="w-full lg:w-1/2 px-6 sm:px-10 lg:px-14 py-16 lg:py-20 xl:py-24 flex flex-col justify-center"
            style={{ opacity: contentOpacity, x: contentX }}
          >
            <div className="max-w-lg">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-gold-500" />
                <span className="text-gold-600 text-xs uppercase tracking-[0.2em] font-semibold">
                  Our Heritage
                </span>
              </div>

              <h2 className="font-script text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-dark-slate leading-[1.1] mb-6">
                A Sacred Legacy
                <span className="block text-gold-600">Since 1200 CE</span>
              </h2>

              <p className="text-dark-slate/60 text-sm sm:text-base leading-relaxed mb-10 max-w-md font-light">
                Nestled in the historic town of Barkur, Sri Kalikamba Temple has stood as a testament to faith, artistry, and unbroken tradition for over eight centuries. Its hallowed walls echo with the prayers of countless devotees who have sought the goddess&apos;s divine grace.
              </p>

              <div className="relative pl-8">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-gold-500/40 via-gold-500/30 to-gold-500/10" />

                <div className="space-y-10">
                  {milestones.map((m, i) => (
                    <motion.div
                      key={m.year}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.5, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="relative group"
                    >
                      <motion.div
                        className="absolute -left-8 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-gold-500 bg-warm-ivory z-10"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2.5, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <div className="absolute inset-0.5 rounded-full bg-gold-500/30" />
                      </motion.div>
                      <span className="block text-xs font-bold text-gold-600 uppercase tracking-wider mb-1">
                        {m.year}
                      </span>
                      <h3 className="text-base sm:text-lg font-heading font-bold text-dark-slate mb-1">
                        {m.label}
                      </h3>
                      <p className="text-dark-slate/50 text-xs sm:text-sm leading-relaxed">
                        {m.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
