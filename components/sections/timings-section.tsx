"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Clock, Sun, Moon, Sunrise, Sunset, Timer, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

interface PanchangaData {
  tithi: string; nakshatra: string; yoga: string; karana: string
  sunrise: string; sunset: string; moonrise: string; moonset: string
  rahuKala: { start: string; end: string }
  yamaganda: { start: string; end: string }
  gulika: { start: string; end: string }
  amritaKala: { start: string; end: string }
  abhijitMuhurta: { start: string; end: string }
  isEkadashi: boolean; isAmavasya: boolean; isPournami: boolean
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border/30 last:border-0">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-50 shrink-0">
        <Icon className="h-4 w-4 text-gold-500" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-xs text-dark-slate/50 block">{label}</span>
        <span className="text-sm font-medium text-dark-slate">{value}</span>
      </div>
    </div>
  )
}

export function TimingsSection() {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const [panchanga, setPanchanga] = useState<PanchangaData | null>(null)
  const [timings, setTimings] = useState({ morning: "6:00 AM - 1:30 PM", evening: "4:00 PM - 7:30 PM" })

  useEffect(() => {
    fetch("/api/panchanga?today=true").then(r => r.json()).then(d => {
      if (d.data?.panchanga) setPanchanga(d.data.panchanga)
    }).catch(() => { })
    fetch("/api/settings?group=temple").then(r => r.json()).then(d => {
      const s = d.data?.settings || d.settings || []
      const morning = s.find((x: { key: string }) => x.key === "timings_morning")?.value
      const evening = s.find((x: { key: string }) => x.key === "timings_evening")?.value
      if (morning || evening) setTimings({ morning: morning || timings.morning, evening: evening || timings.evening })
    }).catch(() => { })
  }, [])

  const todayName = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })

  const specialDay = panchanga?.isEkadashi
    ? "Ekadashi"
    : panchanga?.isAmavasya
      ? "Amavasya"
      : panchanga?.isPournami
        ? "Pournami"
        : null

  return (
    <section ref={ref} className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-warm-ivory to-gold-50/20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(107,15,26,0.02)_0%,_transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-dark-slate">
            {t("timings.templeTimings")} & {t("timings.todayPanchanga")}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-dark-slate/50 max-w-xl">
            {t("timings.scheduleSubtitle")}
          </p>
          <div className="mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-primary to-gold-500" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-premium">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-gold-200/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-500 to-amber-400 shadow-lg shadow-gold-500/20">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold text-dark-slate">{t("timings.todaySchedule")}</h3>
                    <p className="text-xs text-dark-slate/50">{todayName}</p>
                  </div>
                </div>

                <div className="space-y-0">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-amber-50/70 border border-amber-200/30">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shrink-0">
                      <Sun className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-dark-slate/50 font-medium uppercase tracking-wider">{t("timings.morning")}</p>
                      <p className="text-lg font-heading font-bold text-dark-slate">{timings.morning}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-maroon-50/50 border border-maroon-200/20 mt-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-dark-slate to-maroon-900 shadow-lg shrink-0">
                      <Moon className="h-6 w-6 text-gold-300" />
                    </div>
                    <div>
                      <p className="text-xs text-dark-slate/50 font-medium uppercase tracking-wider">{t("timings.evening")}</p>
                      <p className="text-lg font-heading font-bold text-dark-slate">{timings.evening}</p>
                    </div>
                  </div>
                </div>

                {specialDay && (
                  <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-gold-100/50 to-amber-50/50 border border-gold-200/40 text-center">
                    <div className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-700">
                      <Calendar className="h-3.5 w-3.5" />
                      {t("timings.todayIs")} {specialDay}{t("timings.specialPoojas")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-premium">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-maroon-100/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-maroon-700 shadow-lg shadow-primary/20">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold text-dark-slate">{t("timings.todayPanchanga")}</h3>
                    <p className="text-xs text-dark-slate/50">{t("timings.calendarDetails")}</p>
                  </div>
                </div>

                <div className="divide-y divide-border/30">
                  <InfoRow icon={Timer} label={t("timings.tithi")} value={panchanga?.tithi ?? "—"} />
                  <InfoRow icon={Sunrise} label={t("timings.nakshatra")} value={panchanga?.nakshatra ?? "—"} />
                  <InfoRow icon={Sunrise} label={t("timings.yoga")} value={panchanga?.yoga ?? "—"} />
                  <InfoRow icon={Timer} label={t("timings.karana")} value={panchanga?.karana ?? "—"} />
                  <InfoRow icon={Sunrise} label={t("timings.sunrise")} value={panchanga?.sunrise ?? "—"} />
                  <InfoRow icon={Sunset} label={t("timings.sunset")} value={panchanga?.sunset ?? "—"} />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-lg bg-red-50/70 border border-red-200/30 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-red-500 font-semibold">{t("timings.rahuKala")}</p>
                    <p className="text-xs font-medium text-dark-slate">{panchanga?.rahuKala.start ?? "—"} - {panchanga?.rahuKala.end ?? "—"}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/30 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-amber-600 font-semibold">{t("timings.yamaganda")}</p>
                    <p className="text-xs font-medium text-dark-slate">{panchanga?.yamaganda.start ?? "—"} - {panchanga?.yamaganda.end ?? "—"}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-maroon-50/50 border border-maroon-200/20 text-center">
                    <p className="text-[10px] uppercase tracking-wider text-dark-slate/50 font-semibold">{t("timings.gulika")}</p>
                    <p className="text-xs font-medium text-dark-slate">{panchanga?.gulika.start ?? "—"} - {panchanga?.gulika.end ?? "—"}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
