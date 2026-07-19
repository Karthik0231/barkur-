"use client"

/**
 * TEMPLE BULLETIN v4 - Sri Kalikamba Devi Temple, Barkur
 * -----------------------------------------------------------------------
 * "Utsava Patrika" - matches the approved reference layout:
 *   - Centered month tabs, a small floral divider row
 *   - Two plain columns side by side: "Upcoming Sacred Events" and
 *     "Latest Updates", each a stack of simple bordered cards
 *   - No search bar, no category filter chips
 * Each column is capped at a fixed height with its own scroll, so a
 * long list of festivals or notices never grows the section itself —
 * that's the only "large data" handling kept from earlier passes.
 * -----------------------------------------------------------------------
 */

import { useMemo, useRef, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Flower2, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"
import type { Festival, Announcement } from "@prisma/client"

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatShortDate(date: Date) {
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

function useMonthGroups(festivals: Festival[]) {
  return useMemo(() => {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const upcoming = festivals
      .filter((e) => {
        const end = e.endDate ?? e.startDate ?? e.date
        if (!end) return false
        return new Date(end) >= startOfToday
      })
      .sort((a, b) => {
        const aDate = a.startDate ?? a.date
        const bDate = b.startDate ?? b.date
        if (!aDate && !bDate) return 0
        if (!aDate) return 1
        if (!bDate) return -1
        return new Date(aDate).getTime() - new Date(bDate).getTime()
      })

    const map = new Map<string, { label: string; items: Festival[] }>()
    upcoming.forEach((e) => {
      const date = e.startDate ?? e.date
      if (!date) return
      const d = new Date(date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      const label = d.toLocaleDateString("en-IN", { month: "long", year: "numeric" })
      if (!map.has(key)) map.set(key, { label, items: [] })
      map.get(key)!.items.push(e)
    })
    return Array.from(map.entries()).map(([key, v]) => ({ key, ...v }))
  }, [festivals])
}

/* ------------------------------------------------------------------ */
/* Small shared pieces                                                 */
/* ------------------------------------------------------------------ */

function FloralDivider() {
  return (
    <div className="mb-10 flex items-center justify-center gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Flower2 key={i} className="h-3 w-3 text-gold-400/70" />
      ))}
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gold-300/40 py-12 text-center">
      <p className="text-sm text-dark-slate/40">{text}</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* LEFT - Upcoming Sacred Events                                       */
/* ------------------------------------------------------------------ */

function EventsColumn({
  festivals,
  activeMonthKey,
}: {
  festivals: Festival[]
  activeMonthKey: string | undefined
}) {
  const { t } = useTranslation()
  const groups = useMonthGroups(festivals)
  const active = groups.find((g) => g.key === activeMonthKey) ?? groups[0]

  return (
    <div>
      <h3 className="mb-5 text-center font-heading text-2xl font-bold text-dark-slate">
        {t("home.upcomingEvents")}
      </h3>

      {!active?.items.length ? (
        <EmptyState text={t("bulletin.noFestivals")} />
      ) : (
        <div className="max-h-[520px] space-y-4 overflow-y-auto pr-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              {active.items.map((event) => {
                const startDate = event.startDate ?? event.date
                return (
                  <div
                    key={event.id}
                    className="rounded-xl border border-gold-300/40 bg-[#FFFDF8] p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    {startDate && (
                      <span className="inline-block rounded-full bg-gradient-to-r from-gold-300 to-gold-500 px-3 py-1 text-[11px] font-semibold text-[#3D0910]">
                        {formatShortDate(new Date(startDate))}
                        {event.endDate ? ` – ${formatShortDate(new Date(event.endDate))}` : ""}
                      </span>
                    )}
                    <h4 className="mt-3 font-heading text-lg font-bold text-dark-slate">{event.name}</h4>
                    {event.shortDescription && (
                      <p className="mt-1 text-sm text-dark-slate/60">{event.shortDescription}</p>
                    )}
                    {event.description && (
                      <p className="text-sm text-dark-slate/60">{event.description}</p>
                    )}
                    <div className="mt-3 flex justify-end">
                      <Link
                        href="/festivals"
                        className="text-sm font-medium text-primary transition-colors hover:text-[#3D0910]"
                      >
                        {t("bulletin.readMore")}
                      </Link>
                    </div>
                  </div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* RIGHT - Latest Updates                                              */
/* ------------------------------------------------------------------ */

function NoticesColumn({ announcements }: { announcements: Announcement[] }) {
  const { t } = useTranslation()
  const sorted = useMemo(
    () => [...announcements].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    [announcements],
  )
  const latestId = sorted[0]?.id

  return (
    <div>
      <h3 className="mb-5 text-center font-heading text-2xl font-bold text-dark-slate">
        {t("home.latestUpdates")}
      </h3>

      {!sorted.length ? (
        <EmptyState text={t("bulletin.noAnnouncements")} />
      ) : (
        <div className="max-h-[520px] space-y-4 overflow-y-auto pr-1">
          {sorted.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-gold-300/40 bg-[#FFFDF8] p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                {item.id === latestId && (
                  <span className="rounded-full bg-[#3D0910] px-2 py-0.5 font-bold uppercase tracking-wide text-warm-ivory">
                    {t("bulletin.latest")}
                  </span>
                )}
                <span className="text-dark-slate/40">
                  {formatShortDate(new Date(item.createdAt))} &middot; {item.type}
                </span>
              </div>
              <h4 className="mt-2 font-heading text-base font-bold text-dark-slate">{item.title}</h4>
              {item.content && (
                <p className="mt-1 text-sm text-dark-slate/60 line-clamp-2">{item.content}</p>
              )}
              <div className="mt-3 flex justify-end">
                <Link
                  href="/announcements"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-300/50 text-gold-600 transition-colors hover:bg-gold-100"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Center seam                                                         */
/* ------------------------------------------------------------------ */

function DesktopSeam() {
  return (
    <div className="hidden lg:flex lg:flex-col lg:items-center lg:px-8">
      <span className="w-px flex-1 bg-gradient-to-b from-transparent via-gold-300/40 to-gold-300/50" />
      <span className="my-4 h-2.5 w-2.5 shrink-0 rounded-full bg-gold-400" />
      <span className="w-px flex-1 bg-gradient-to-t from-transparent via-gold-300/40 to-gold-300/50" />
    </div>
  )
}

function MobileSeam() {
  return (
    <div className="my-2 flex items-center gap-3 lg:hidden">
      <span className="h-px flex-1 bg-gold-300/30" />
      <span className="h-2 w-2 rounded-full bg-gold-400" />
      <span className="h-px flex-1 bg-gold-300/30" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export function TempleBulletinSection({
  festivals,
  announcements,
}: {
  festivals: Festival[]
  announcements: Announcement[]
}) {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })

  const groups = useMonthGroups(festivals)
  const [activeMonthKey, setActiveMonthKey] = useState(groups[0]?.key)

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-gradient-to-b from-warm-ivory to-gold-50/20 py-20 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.05)_0%,_transparent_55%)]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex flex-col items-center text-center"
        >
          <h2 className="font-heading text-3xl font-bold text-dark-slate sm:text-4xl lg:text-5xl">
            Utsava Patrika
          </h2>
          <p className="mt-3 max-w-md font-script text-sm italic text-dark-slate/50 sm:text-base">
            {t("bulletin.subtitle")}
          </p>
          <div className="mt-4 h-0.5 w-20 rounded-full bg-gradient-to-r from-primary to-gold-500" />
        </motion.div>

        {groups.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 flex flex-wrap justify-center gap-2.5"
          >
            {groups.map((g) => {
              const isActive = g.key === activeMonthKey
              return (
                <button
                  key={g.key}
                  onClick={() => setActiveMonthKey(g.key)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300",
                    isActive
                      ? "border-transparent bg-gradient-to-r from-gold-300 to-gold-500 text-[#3D0910] shadow-sm"
                      : "border-gold-300/40 bg-white/50 text-dark-slate/55 hover:border-gold-300/70 hover:text-dark-slate/80",
                  )}
                >
                  {g.label}
                </button>
              )
            })}
          </motion.div>
        )}

        <FloralDivider />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-2 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch"
        >
          <EventsColumn festivals={festivals} activeMonthKey={activeMonthKey} />
          <MobileSeam />
          <DesktopSeam />
          <NoticesColumn announcements={announcements} />
        </motion.div>
      </div>
    </section>
  )
}
