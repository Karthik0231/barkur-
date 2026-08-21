"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Calendar, MapPin, Sparkles, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

interface EventItem {
  title: string
  month: string
  description: string
  icon?: React.ElementType
}

const fallbackIcons = [Sparkles, Calendar, MapPin, Calendar] as const

export function EventsSection() {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/festivals?isActive=true&limit=4")
      .then((r) => r.json())
      .then((d) => {
        const list = d.data?.festivals || d.data || d || []
        const mapped = Array.isArray(list)
          ? list.map((f) => ({
              title: f.name,
              month: f.startDate
                ? new Date(f.startDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
                : "",
              description: f.shortDescription || f.description || "",
            }))
          : []
        setEvents(mapped)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section ref={ref} className="relative py-24 overflow-hidden bg-gradient-to-b from-gold-50/20 to-warm-ivory">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(201,168,76,0.04)_0%,_transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-dark-slate">
            {t("events.upcomingEvents")}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-dark-slate/50 max-w-xl">
            {t("events.upcomingEventsSub")}
          </p>
          <div className="mt-4 h-0.5 w-20 rounded-full bg-gradient-to-r from-primary to-gold-500" />
        </motion.div>

        {loading && (
          <div className="flex justify-center py-16">
            <span className="text-sm text-dark-slate/60">{t("common.loading")}</span>
          </div>
        )}
        {!loading && events.length === 0 && (
          <div className="flex justify-center py-16">
            <span className="text-sm text-dark-slate/60">{t("common.noResults")}</span>
          </div>
        )}
        {!loading && events.length > 0 && (
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-gold-300/50 via-gold-500 to-gold-300/50" />

          {events.map((event, i) => {
            const isLeft = i % 2 === 0
            const Icon = event.icon || fallbackIcons[i % fallbackIcons.length]

            return (
              <div key={event.title} className="relative flex items-start mb-16 last:mb-0">
                <div className="md:hidden absolute left-4 -translate-x-1/2 top-0 w-3 h-3 rounded-full bg-gold-500 border-2 border-warm-ivory z-10" />
                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 w-4 h-4 rounded-full bg-gold-500 border-4 border-warm-ivory shadow-md z-10" />

                <motion.div
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "w-full md:w-[calc(50%-2.5rem)] pl-10 md:pl-0",
                    isLeft ? "md:mr-auto" : "md:ml-auto",
                  )}
                >
                  <div className={cn(
                    "rounded-2xl bg-white border border-border p-6 shadow-premium transition-shadow hover:shadow-xl",
                    isLeft && "md:text-right",
                  )}>
                    <div className={cn(
                      "flex items-center gap-3 mb-3",
                      isLeft && "md:flex-row-reverse",
                    )}>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-amber-600 shadow-md">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gold-600">{event.month}</span>
                    </div>
                    <h3 className="text-lg font-heading font-bold text-dark-slate">{event.title}</h3>
                    <p className="mt-2 text-sm text-dark-slate/60 leading-relaxed">{event.description}</p>
                    <div className="mt-4 pt-4 border-t border-border/30">
                      <Link
                        href="/festivals"
                        className={cn(
                          "inline-flex items-center gap-1.5 text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors group",
                          isLeft && "md:flex-row-reverse",
                        )}
                      >
                        <span>{t("common.learnMore")}</span>
                        <ArrowRight className={cn(
                          "h-3.5 w-3.5 transition-transform",
                          isLeft ? "group-hover:-translate-x-1" : "group-hover:translate-x-1",
                        )} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>
        )}
      </div>
    </section>
  )
}
