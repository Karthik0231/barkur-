"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import {
  Star, Lightbulb, Sparkles, Building2, Moon, Sun,
  CalendarDays, ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

const festivals = [
  {
    key: "dasara",
    fallbackName: "Dasara",
    date: "October 22, 2026",
    startDate: "2026-10-22",
    gradient: "from-amber-400 to-orange-600",
    icon: Star,
  },
  {
    key: "deepavali",
    fallbackName: "Deepavali",
    date: "November 19, 2026",
    startDate: "2026-11-19",
    gradient: "from-yellow-400 to-amber-600",
    icon: Lightbulb,
  },
  {
    key: "ugadi",
    fallbackName: "Ugadi",
    date: "March 29, 2027",
    startDate: "2027-03-29",
    gradient: "from-rose-400 to-pink-600",
    icon: Sparkles,
  },
  {
    key: "annualBrahmotsava",
    fallbackName: "Annual Brahmotsava",
    date: "March 29 \u2013 April 13, 2027",
    startDate: "2027-03-29",
    gradient: "from-red-500 to-rose-700",
    icon: Building2,
  },
  {
    key: "navaratri",
    fallbackName: "Navaratri",
    date: "September 21 \u2013 October 2, 2026",
    startDate: "2026-09-21",
    gradient: "from-purple-400 to-violet-600",
    icon: Moon,
  },
  {
    key: "makaraSankranthi",
    fallbackName: "Makara Sankranthi",
    date: "January 14, 2027",
    startDate: "2027-01-14",
    gradient: "from-orange-400 to-red-500",
    icon: Sun,
  },
]

function getCountdown(targetDate: string): string {
  const target = new Date(targetDate)
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (days > 1) return `${days} days away`
  if (days === 1) return "1 day away"
  if (days === 0) return "Today!"
  return ""
}

export function FestivalsSection() {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section
      ref={ref}
      className="relative py-24 overflow-hidden bg-gradient-to-b from-warm-ivory to-gold-50/30"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(107,15,26,0.02)_0%,_transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-dark-slate">
            Upcoming {t("nav.festivals")}
          </h2>
          <div className="mt-4 h-0.5 w-20 rounded-full bg-gradient-to-r from-primary to-gold-500" />
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {festivals.map((festival, index) => {
            const Icon = festival.icon
            const countdown = getCountdown(festival.startDate)

            return (
              <motion.div
                key={festival.key}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group"
              >
                <div className="h-full overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                  <div
                    className={cn(
                      "relative flex h-[200px] items-center justify-center bg-gradient-to-br transition-all duration-500 group-hover:brightness-110",
                      festival.gradient,
                    )}
                  >
                    <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:opacity-0" />
                    <Icon className="relative h-14 w-14 text-white/80" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 text-sm text-dark-slate/50 mb-2">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>{festival.date}</span>
                    </div>
                    <h3 className="text-lg font-heading font-bold text-dark-slate">
                      {t(`festivals.${festival.key}`) || festival.fallbackName}
                    </h3>
                    {countdown && (
                      <p className="mt-1.5 text-sm font-medium text-primary">
                        {countdown}
                      </p>
                    )}
                    <div className="mt-4 pt-4 border-t border-border/30">
                      <Link
                        href="/events"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors"
                      >
                        {t("common.learnMore")}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
