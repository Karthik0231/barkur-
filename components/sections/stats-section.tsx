"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { Landmark, Flower2, Users, CalendarDays } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

interface StatItem {
  icon: React.ElementType
  value: number
  suffix: string
  label: string
}

const defaultStats: StatItem[] = [
  { icon: Landmark, value: 800, suffix: "+", label: "stats.yearsOfHeritage" },
  { icon: Flower2, value: 250, suffix: "+", label: "stats.dailyPoojas" },
  { icon: Users, value: 10, suffix: "K+", label: "stats.divineBlessings" },
  { icon: CalendarDays, value: 500, suffix: "+", label: "stats.annualFestivals" },
]

function AnimatedCounter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const duration = 2000
    const step = Math.ceil(end / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, end])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      <motion.span
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {count}
      </motion.span>
      {suffix}
    </span>
  )
}

export function StatsSection() {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const [stats, setStats] = useState<StatItem[]>(defaultStats)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        const data = d.data || d
        if (data && typeof data === "object") {
          const mapped: StatItem[] = [
            { icon: Landmark, value: data.yearsOfHeritage ?? data.years ?? 800, suffix: "+", label: "stats.yearsOfHeritage" },
            { icon: Flower2, value: data.dailyPoojas ?? data.poojas ?? 250, suffix: "+", label: "stats.dailyPoojas" },
            { icon: Users, value: data.divineBlessings ?? data.devotees ?? 10, suffix: "K+", label: "stats.divineBlessings" },
            { icon: CalendarDays, value: data.annualFestivals ?? data.festivals ?? 500, suffix: "+", label: "stats.annualFestivals" },
          ]
          setStats(mapped)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden bg-primary">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(201,168,76,0.3) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(201,168,76,0.3) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(201,168,76,0.1) 0%, transparent 70%)
          `,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(201,168,76,0.5) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500/60 to-gold-500/60" />
            <div className="h-2.5 w-2.5 rotate-45 bg-gold-500 shadow-lg shadow-gold-500/30" />
            <div className="h-px w-16 bg-gradient-to-r from-gold-500/60 via-gold-500/60 to-transparent" />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-gold-400">
            {t("stats.templeAtAGlance")}
          </h2>
        </motion.div>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 w-full">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-gold-500/10 bg-white/5 backdrop-blur-sm p-6 sm:p-8">
                  <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-gold-500/10 animate-pulse" />
                  <div className="h-10 w-24 mx-auto rounded bg-gold-500/10 animate-pulse" />
                  <div className="mt-3 h-4 w-20 mx-auto rounded bg-gold-500/10 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        )}
        {!loading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-2xl border border-gold-500/10 bg-white/5 backdrop-blur-sm p-6 sm:p-8 text-center transition-all duration-500 hover:bg-white/[0.08] hover:border-gold-500/20 hover:shadow-xl hover:shadow-gold-500/10">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold-500/20 to-amber-600/20 border border-gold-500/20 shadow-lg shadow-gold-500/5">
                    <Icon className="h-7 w-7 text-gold-400" />
                  </div>

                  <div className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold bg-gradient-to-r from-gold-400 via-amber-400 to-gold-300 bg-clip-text text-transparent">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>

                  <div className="mt-2 text-sm sm:text-base font-medium text-gold-200/80">
                    {t(stat.label)}
                  </div>

                  <div className="mt-6 h-px w-16 mx-auto bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
                </div>
              </motion.div>
            )
          })}
        </div>
        )}
      </div>
    </section>
  )
}
