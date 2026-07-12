"use client"

/**
 * TEMPLE BULLETIN v4 — Sri Kalikamba Devi Temple, Barkur
 * -----------------------------------------------------------------------
 * "Utsava Patrika" — matches the approved reference layout:
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

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

interface EventItem {
  id: string
  title: string
  date: string // ISO yyyy-mm-dd, start date
  endDate?: string
  location: string
  description: string
}

interface Notice {
  id: string
  title: string
  text: string
  date: string // ISO yyyy-mm-dd
  category: string
}

const EVENTS: EventItem[] = [
  { id: "e1", title: "Naga Panchami Pooja", date: "2026-08-05", location: "Naga Bana Shrine", description: "Sacred serpent worship for family protection and prosperity." },
  { id: "e2", title: "Varamahalakshmi Vrata", date: "2026-08-14", location: "Devi Sannidhi", description: "A vow observed by women for marital happiness and wellbeing." },
  { id: "e3", title: "Krishna Janmashtami", date: "2026-09-04", location: "Main Mandapa", description: "Midnight celebration marking the birth of Lord Krishna." },
  { id: "e4", title: "Ganesha Chaturthi", date: "2026-09-14", location: "Temple Courtyard", description: "Invoking Lord Ganesha's blessings for a new beginning." },
  { id: "e5", title: "Navaratri & Dasara Utsava", date: "2026-10-11", endDate: "2026-10-20", location: "Main Shrine & Mandapa", description: "Nine nights honouring the Devi in her many forms." },
  { id: "e6", title: "Deepavali Lakshmi Pooja", date: "2026-11-08", location: "Main Shrine", description: "Lighting lamps to invite prosperity into every home." },
  { id: "e7", title: "Laksha Deepotsava", date: "2026-11-27", location: "Temple Premises", description: "A hundred thousand lamps lit in devotion and gratitude." },
  { id: "e8", title: "Kartika Somavara Pooja", date: "2026-11-30", location: "Devi Sannidhi", description: "Monday worship dedicated to Lord Shiva through Kartika month." },
  { id: "e9", title: "Makara Sankranti", date: "2027-01-14", location: "Temple Courtyard", description: "Marking the sun's turn northward with harvest offerings." },
  { id: "e10", title: "Ratha Saptami", date: "2027-01-24", location: "Temple Premises", description: "Sun worship marking the start of Uttarayana." },
  { id: "e11", title: "Maha Shivaratri Special Alankara", date: "2027-02-15", location: "Main Shrine", description: "A night-long vigil and special adornment for Lord Shiva." },
  { id: "e12", title: "Annual Brahmotsava", date: "2027-03-20", endDate: "2027-03-28", location: "Temple Complex", description: "The temple's grandest festival, with processions and rites." },
]

const ANNOUNCEMENTS: Notice[] = [
  { id: "n1", title: "Ganesha Chaturthi Seva Bookings Open", text: "Sevas for Ganesha Chaturthi can now be reserved online, with slots released a week ahead of the festival.", date: "2026-07-10", category: "Seva" },
  { id: "n2", title: "Navaratri Pooja Schedule Announced", text: "The full schedule for Navaratri 2026 is ready — nine nights of special alankaras, homas and cultural performances for devotees to plan around.", date: "2026-07-05", category: "Festival" },
  { id: "n3", title: "Temple Renovation Phase II Complete", text: "The gopuram restoration is complete. The newly finished structure stands as a tribute to the craftsmen who carried the work through.", date: "2026-06-20", category: "Renovation" },
  { id: "n4", title: "Online Seva Booking Now Live", text: "Sevas can now be booked through the temple portal, with instant confirmation and no need to queue at the counter.", date: "2026-06-02", category: "Seva" },
  { id: "n5", title: "Annadanam Sponsorship Open", text: "Sponsor a day of annadanam for visiting devotees — a simple, blessed way to serve the temple community.", date: "2026-05-18", category: "General" },
  { id: "n6", title: "New Parking Facility Opened", text: "A new parking area near the east gate is open, easing congestion on festival days and weekends.", date: "2026-05-02", category: "General" },
  { id: "n7", title: "Temple Website Multilingual Support Added", text: "The temple website now reads in Kannada and Hindi alongside English, so more devotees can follow along in their own language.", date: "2026-04-22", category: "General" },
  { id: "n8", title: "Gopuram Kalasha Consecration Date Fixed", text: "The kalasha atop the restored gopuram will be consecrated in a dedicated ceremony; devotees are welcome to attend.", date: "2026-04-10", category: "Renovation" },
  { id: "n9", title: "Free Wi-Fi for Devotees in Queue Complex", text: "Devotees waiting in the queue complex can now stay connected with free Wi-Fi through the visit.", date: "2026-03-15", category: "General" },
]

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatShortDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

function useMonthGroups(events: EventItem[]) {
  return useMemo(() => {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const upcoming = events
      .filter((e) => new Date(`${e.endDate ?? e.date}T00:00:00`) >= startOfToday)
      .sort((a, b) => a.date.localeCompare(b.date))

    const map = new Map<string, { label: string; items: EventItem[] }>()
    upcoming.forEach((e) => {
      const d = new Date(`${e.date}T00:00:00`)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
      const label = d.toLocaleDateString("en-IN", { month: "long", year: "numeric" })
      if (!map.has(key)) map.set(key, { label, items: [] })
      map.get(key)!.items.push(e)
    })
    return Array.from(map.entries()).map(([key, v]) => ({ key, ...v }))
  }, [events])
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
/* LEFT — Upcoming Sacred Events                                       */
/* ------------------------------------------------------------------ */

function EventsColumn({ activeMonthKey }: { activeMonthKey: string | undefined }) {
  const groups = useMonthGroups(EVENTS)
  const active = groups.find((g) => g.key === activeMonthKey) ?? groups[0]

  return (
    <div>
      <h3 className="mb-5 text-center font-heading text-2xl font-bold text-dark-slate">
        Upcoming Sacred Events
      </h3>

      {!active ? (
        <EmptyState text="No upcoming festivals scheduled right now." />
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
              {active.items.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-gold-300/40 bg-[#FFFDF8] p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="inline-block rounded-full bg-gradient-to-r from-gold-300 to-gold-500 px-3 py-1 text-[11px] font-semibold text-[#3D0910]">
                    {formatShortDate(event.date)}
                    {event.endDate ? ` – ${formatShortDate(event.endDate)}` : ""}
                  </span>
                  <h4 className="mt-3 font-heading text-lg font-bold text-dark-slate">{event.title}</h4>
                  <p className="mt-1 text-sm text-dark-slate/60">Location: {event.location}.</p>
                  <p className="text-sm text-dark-slate/60">{event.description}</p>
                  <div className="mt-3 flex justify-end">
                    <Link
                      href="/festivals"
                      className="text-sm font-medium text-primary transition-colors hover:text-[#3D0910]"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* RIGHT — Latest Updates                                              */
/* ------------------------------------------------------------------ */

function NoticesColumn() {
  const sorted = useMemo(() => [...ANNOUNCEMENTS].sort((a, b) => b.date.localeCompare(a.date)), [])
  const latestId = sorted[0]?.id

  return (
    <div>
      <h3 className="mb-5 text-center font-heading text-2xl font-bold text-dark-slate">Latest Updates</h3>

      {!sorted.length ? (
        <EmptyState text="No announcements yet." />
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
                    Latest
                  </span>
                )}
                <span className="text-dark-slate/40">
                  {formatShortDate(item.date)} &middot; {item.category}
                </span>
              </div>
              <h4 className="mt-2 font-heading text-base font-bold text-dark-slate">{item.title}</h4>
              <p className="mt-1 text-sm text-dark-slate/60 line-clamp-2">{item.text}</p>
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

export function TempleBulletinSection() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })

  const groups = useMonthGroups(EVENTS)
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
            Festivals ahead, and news as it happens
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
          <EventsColumn activeMonthKey={activeMonthKey} />
          <MobileSeam />
          <DesktopSeam />
          <NoticesColumn />
        </motion.div>
      </div>
    </section>
  )
}