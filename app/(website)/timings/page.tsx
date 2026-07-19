"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Clock, Sun, Moon, Sunrise, Calendar } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageBanner } from "@/components/PageBanner"
import { useTranslation } from "@/lib/i18n"
import { TEMPLE_TIMINGS } from "@/lib/constants"

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const specialDays = [
  { name: "Purnima (Full Moon)", timings: "6:00 AM - 8:00 PM", description: "Extended timings on full moon days" },
  { name: "Amavasya (New Moon)", timings: "6:00 AM - 7:30 PM", description: "Special rituals for ancestors on new moon" },
  { name: "Ekadashi", timings: "5:30 AM - 7:30 PM", description: "Early opening on Ekadashi days" },
  { name: "Festival Days", timings: "5:00 AM - 9:00 PM", description: "Extended hours during major festivals" },
  { name: "Navaratri", timings: "5:00 AM - 10:00 PM", description: "Special extended schedule during Navaratri" },
]

interface PoojaItem {
  name: string
  time: string
  description: string
}

interface WeeklyItem {
  day: string
  special: string
  description: string
}

function PoojaCard({ pooja, index }: { pooja: PoojaItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start gap-4 p-4 rounded-xl hover:bg-bg-secondary/50 transition-colors group"
    >
      <div className="w-20 shrink-0 text-right">
        <span className="text-sm font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-lg group-hover:bg-primary/10 transition-colors">
          {pooja.time}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-heading font-bold text-primary">{pooja.name}</h4>
        <p className="text-sm text-text-muted mt-0.5">{pooja.description}</p>
      </div>
    </motion.div>
  )
}

export default function TimingsPage() {
  const { t } = useTranslation()
  const [dailyPoojas, setDailyPoojas] = useState<PoojaItem[]>([])
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklyItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/daily-schedule")
      .then((r) => r.json())
      .then((res) => {
        const schedules = res.data.schedules || []

        const poojas = schedules
          .filter((s: { dayOfWeek: number }) => s.dayOfWeek === 0)
          .sort((a: { sortOrder: number }, b: { sortOrder: number }) => a.sortOrder - b.sortOrder)
          .map((s: { title: string; startTime: string; endTime: string; description: string }) => ({
            name: s.title,
            time: s.startTime + (s.endTime ? ` - ${s.endTime}` : ""),
            description: s.description || "",
          }))
        setDailyPoojas(poojas)

        const byDay: Record<number, { title: string; description: string }> = {}
        for (const s of schedules) {
          if (!(s.dayOfWeek in byDay)) {
            byDay[s.dayOfWeek] = { title: s.title, description: s.description || "" }
          }
        }
        const weekly = Object.entries(byDay)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([day, item]) => ({
            day: dayNames[Number(day)],
            special: item.title,
            description: item.description,
          }))
        setWeeklySchedule(weekly)
      })
      .catch(() => { setDailyPoojas([]); setWeeklySchedule([]) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      <PageBanner 
        title={t("pages.timings.title")} 
        eyebrow={t("pages.timings.eyebrow")} 
        subtitle={t("pages.timings.subtitle")}
      />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-12">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.timings")}</span>
          </div>

          <AnimatedSection>
            <SectionHeading
              title={t("sections.timingsS1Title")}
              subtitle={t("sections.timingsS1Sub")}
            />
          </AnimatedSection>

          {loading ? (
            <div className="text-center py-20 text-text-muted">Loading...</div>
          ) : (
            <div className="grid lg:grid-cols-5 gap-8 mt-16">
              <div className="lg:col-span-3">
                <Card variant="elevated" className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-primary">{t("sections.timingsScheduleTitle")}</h3>
                  </div>
                  <div className="space-y-0.5">
                    {dailyPoojas.map((pooja, index) => (
                      <PoojaCard key={pooja.name} pooja={pooja} index={index} />
                    ))}
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <Card variant="glass" className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <Sun className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-bold text-primary">{t("sections.timingsMorningTitle")}</h3>
                      <p className="text-sm text-text-muted">{TEMPLE_TIMINGS.morning}</p>
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {t("sections.timingsMorningDesc")}
                  </p>
                </Card>

                <Card variant="glass" className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <Moon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-bold text-primary">{t("sections.timingsEveningTitle")}</h3>
                      <p className="text-sm text-text-muted">{TEMPLE_TIMINGS.evening}</p>
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {t("sections.timingsEveningDesc")}
                  </p>
                </Card>

                <Card variant="glass" className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <Sunrise className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-heading font-bold text-primary">{t("sections.timingsNoteTitle")}</h3>
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {t("sections.timingsNoteDesc")}
                  </p>
                </Card>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-bg-secondary/50 to-bg-primary">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <SectionHeading
              title={t("sections.timingsWeeklyTitle")}
              subtitle={t("sections.timingsWeeklySub")}
            />
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-16">
            {weeklySchedule.map((day, index) => (
              <AnimatedSection key={day.day} delay={index * 0.05}>
                <Card variant="glass" className="p-5 h-full" hover>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-heading font-bold text-primary">{day.day}</h3>
                    <Calendar className="h-4 w-4 text-secondary" />
                  </div>
                  <p className="text-sm font-medium text-secondary">{day.special}</p>
                  <p className="text-xs text-text-muted mt-1">{day.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <SectionHeading
              title={t("sections.timingsSpecialTitle")}
              subtitle={t("sections.timingsSpecialSub")}
            />
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {specialDays.map((day, index) => (
              <AnimatedSection key={day.name} delay={index * 0.1}>
                <Card variant="elevated" className="p-6 h-full" hover>
                  <Badge variant="secondary" size="sm" className="mb-3">{day.timings}</Badge>
                  <h3 className="text-lg font-heading font-bold text-primary">{day.name}</h3>
                  <p className="text-text-secondary text-sm mt-2 leading-relaxed">{day.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
