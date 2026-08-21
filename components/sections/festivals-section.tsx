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
import type { Festival } from "@/lib/types"

function getIconForFestival(name: string) {
  const lower = name.toLowerCase()
  if (lower.includes("dasara")) return Star
  if (lower.includes("deepavali") || lower.includes("diwali")) return Lightbulb
  if (lower.includes("ugadi") || lower.includes("new")) return Sparkles
  if (lower.includes("brahmotsava")) return Building2
  if (lower.includes("navaratri")) return Moon
  if (lower.includes("makara") || lower.includes("sankranthi")) return Sun
  return Star
}

function getGradientForFestival(name: string) {
  const lower = name.toLowerCase()
  if (lower.includes("dasara")) return "from-amber-400 to-orange-600"
  if (lower.includes("deepavali") || lower.includes("diwali")) return "from-yellow-400 to-amber-600"
  if (lower.includes("ugadi") || lower.includes("new")) return "from-rose-400 to-pink-600"
  if (lower.includes("brahmotsava")) return "from-red-500 to-rose-700"
  if (lower.includes("navaratri")) return "from-purple-400 to-violet-600"
  if (lower.includes("makara") || lower.includes("sankranthi")) return "from-orange-400 to-red-500"
  return "from-blue-400 to-indigo-600"
}

function getCountdown(targetDate?: Date | string | null): string {
  if (!targetDate) return ""
  const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  if (diff <= 0) return ""
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return `${days}d`
}

function formatFestivalDate(festival: Festival): string {
  const start = festival.startDate || festival.date
  const end = festival.endDate
  if (!start) return ""
  const startDate = new Date(start)
  const startStr = startDate.toLocaleDateString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric"
  })
  if (!end) return startStr
  const endDate = new Date(end)
  const endStr = endDate.toLocaleDateString("en-IN", {
    month: startDate.getMonth() === endDate.getMonth() ? undefined : "long",
    day: "numeric",
    year: startDate.getFullYear() === endDate.getFullYear() ? undefined : "numeric"
  }).trim()
  return `${startStr} – ${endStr ? endStr : ""}`.replace(" –  –", " –")
}

export function FestivalsSection({ festivals }: { festivals: Festival[] }) {
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
            {t("festivals.upcomingFestivals")}            
          </h2>
          <div className="mt-4 h-0.5 w-20 rounded-full bg-gradient-to-r from-primary to-gold-500" />
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {festivals.map((festival, index) => {
            const Icon = getIconForFestival(festival.name)
            const targetDate = festival.startDate || festival.date
            const countdown = getCountdown(targetDate)

            return (
              <motion.div
                key={festival.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group"
              >
                <div className="h-full overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
                  <div
                    className={cn(
                      "relative flex h-[200px] items-center justify-center bg-gradient-to-br transition-all duration-500 group-hover:brightness-110",
                      getGradientForFestival(festival.name),
                    )}
                  >
                    <div className="absolute inset-0 bg-black/10 transition-opacity duration-500 group-hover:opacity-0" />
                    <Icon className="relative h-14 w-14 text-white/80" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 text-sm text-dark-slate/50 mb-2">
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>{formatFestivalDate(festival)}</span>
                    </div>
                    <h3 className="text-lg font-heading font-bold text-dark-slate">
                      {festival.name}
                    </h3>
                    {countdown && (
                      <p className="mt-1.5 text-sm font-medium text-primary">
                        {countdown}
                      </p>
                    )}
                    <div className="mt-4 pt-4 border-t border-border/30">
                      <Link
                        href="/festivals"
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
