"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight, Sunrise, Sunset, AlertTriangle, Clock, Star, CalendarDays, Ban, Moon, Sun,
  ChevronLeft, Sparkles, Download, Share2, Bell, Heart, Zap, CloudSun, Droplets, Wind, Eye,
  ArrowRight, Info, Check, Copy,
} from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { calculatePanchanga, fetchPanchanga, type PanchangaData } from "@/lib/panchanga"
import { TEMPLE_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"

// Adjust to match your actual fixed navbar height.
const NAVBAR_OFFSET = "pt-20 sm:pt-24"

const VARA_NAMES = ["Ravivara", "Somavara", "Mangalavara", "Budhavara", "Guruvara", "Shukravara", "Shanivara"]
const VARA_SHORT = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const NAKSHATRA_RASHI: Record<string, string> = {
  Ashwini: "Mesha", Bharani: "Mesha", Krittika: "Mesha",
  Rohini: "Vrishabha", Mrigashira: "Vrishabha",
  Ardra: "Mithuna", Punarvasu: "Mithuna",
  Pushya: "Karka", Ashlesha: "Karka",
  Magha: "Simha", "Purva Phalguni": "Simha", "Uttara Phalguni": "Simha",
  Hasta: "Kanya", Chitra: "Kanya",
  Swati: "Tula", Vishakha: "Tula",
  Anuradha: "Vrishchika", Jyeshtha: "Vrishchika",
  Mula: "Dhanu", "Purva Ashadha": "Dhanu", "Uttara Ashadha": "Dhanu",
  Shravana: "Makara", Dhanishtha: "Makara",
  Shatabhisha: "Kumbha", "Purva Bhadrapada": "Kumbha",
  "Uttara Bhadrapada": "Meena", Revati: "Meena",
}

const FESTIVAL_ICONS: Record<string, typeof Star> = {
  Star, Sparkles, Bell, Moon, Sun, Heart, Zap,
}

const FESTIVALS = [
  { date: "2026-07-09", name: "Guru Purnima", description: "Auspicious full moon day honoring spiritual gurus. Special pujas and discourses at the temple.", icon: "Star" as const, color: "from-amber-400 to-orange-500" },
  { date: "2026-07-15", name: "Shravana Somavara", description: "Sacred Monday of Shravana month. Special Rudrabhishekam and Shiva puja throughout the day.", icon: "Moon" as const, color: "from-blue-400 to-indigo-500" },
  { date: "2026-07-22", name: "Naga Panchami", description: "Worship of serpent deities. Traditional milk offerings and special abhishekam to the Naga idols.", icon: "Zap" as const, color: "from-emerald-400 to-green-600" },
  { date: "2026-07-28", name: "Shravana Purnima", description: "Full moon in Shravana month. Raksha Bandhan celebrated with sacred thread ceremonies.", icon: "Star" as const, color: "from-rose-400 to-pink-600" },
  { date: "2026-08-07", name: "Krishna Janmashtami", description: "Celebration of Lord Krishna's birth. Midnight abhishekam, bhajans, and cultural programs.", icon: "Heart" as const, color: "from-violet-400 to-purple-600" },
  { date: "2026-08-15", name: "Independence Day", description: "Special flag hoisting ceremony followed by patriotic bhajans and prasadam distribution.", icon: "Sun" as const, color: "from-saffron-400 to-orange-500" },
]

const TITHI_NAMES_FULL = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya",
]

function getTithiIndex(tithi: string): number {
  const idx = TITHI_NAMES_FULL.indexOf(tithi)
  return idx >= 0 ? idx : 0
}

function getMoonIllumination(tithi: string): number {
  const idx = getTithiIndex(tithi)
  if (idx <= 14) return idx / 14
  return (29 - idx) / 14
}

function getMoonPhaseName(tithi: string): string {
  const idx = getTithiIndex(tithi)
  if (idx === 14) return "Purnima (Full Moon)"
  if (idx === 29) return "Amavasya (New Moon)"
  if (idx === 0 || idx === 15) return "Pratipada (Waxing Crescent)"
  if (idx === 7) return "Shukla Ashtami (First Quarter)"
  if (idx === 21) return "Krishna Ashtami (Last Quarter)"
  if (idx < 7) return "Shukla Paksha (Waxing Crescent)"
  if (idx < 14) return "Shukla Paksha (Waxing Gibbous)"
  if (idx < 21) return "Krishna Paksha (Waning Gibbous)"
  return "Krishna Paksha (Waning Crescent)"
}

function getRashi(nakshatra: string): string {
  return NAKSHATRA_RASHI[nakshatra] || "—"
}

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr + "T00:00:00")
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}

// --- Small, dependency-free "make the buttons actually do something" helpers ---

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

function toICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
}

function downloadICS(title: string, description: string, dateStr: string) {
  const start = new Date(dateStr + "T00:00:00")
  const end = new Date(start.getTime() + 86400000)
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//" + TEMPLE_NAME + "//Panchanga//EN",
    "BEGIN:VEVENT",
    `UID:${slugify(title)}-${dateStr}@panchanga`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART;VALUE=DATE:${dateStr.replace(/-/g, "")}`,
    `DTEND;VALUE=DATE:${end.toISOString().split("T")[0].replace(/-/g, "")}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${slugify(title)}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

async function shareContent(title: string, text: string, url: string): Promise<"shared" | "copied" | "failed"> {
  if (typeof navigator !== "undefined" && "share" in navigator) {
    try {
      await (navigator as Navigator & { share: (data: ShareData) => Promise<void> }).share({ title, text, url })
      return "shared"
    } catch {
      // user cancelled or share failed — fall through to clipboard
    }
  }
  try {
    await navigator.clipboard.writeText(`${text} ${url}`)
    return "copied"
  } catch {
    return "failed"
  }
}

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("shimmer-skeleton", className)} />
}

function MoonPhaseSVG({ tithi }: { tithi: string }) {
  const illumination = getMoonIllumination(tithi)
  const idx = getTithiIndex(tithi)
  const isWaxing = idx <= 14

  const clipX = 50 - illumination * 50 * (isWaxing ? 1 : -1)

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
      <defs>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF8E7" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="moonSurface" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5F0E8" />
          <stop offset="100%" stopColor="#E8DDD0" />
        </linearGradient>
        <linearGradient id="moonShadow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D2D2D" />
          <stop offset="100%" stopColor="#5A5A5A" />
        </linearGradient>
        <clipPath id="moonClip">
          <rect x={isWaxing ? 0 : clipX} y="0" width={isWaxing ? clipX : 100 - clipX} height="100" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="42" fill="url(#moonShadow)" opacity="0.6" />
      <circle cx="50" cy="50" r="42" fill="url(#moonSurface)" clipPath="url(#moonClip)" />
      {illumination > 0.05 && illumination < 0.95 && (
        <ellipse cx={isWaxing ? 50 - 12 : 50 + 12} cy="50" rx="8" ry="18" fill="#E0D8C8" opacity="0.15" clipPath="url(#moonClip)" />
      )}
      <circle cx="50" cy="50" r="46" fill="url(#moonGlow)" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="#C9A84C" strokeWidth="1.5" opacity="0.3" />
    </svg>
  )
}

function DayTimeline({ data }: { data: PanchangaData }) {
  const periods: { label: string; start: string; end: string; type: "auspicious" | "inauspicious" | "neutral"; icon: typeof Star }[] = [
    { label: "Abhijit", start: data.abhijitMuhurta.start, end: data.abhijitMuhurta.end, type: "auspicious", icon: Sparkles },
    { label: "Amrita Kala", start: data.amritaKala.start, end: data.amritaKala.end, type: "auspicious", icon: Heart },
    { label: "Rahu Kala", start: data.rahuKala.start, end: data.rahuKala.end, type: "inauspicious", icon: AlertTriangle },
    { label: "Yamaganda", start: data.yamaganda.start, end: data.yamaganda.end, type: "inauspicious", icon: Ban },
    { label: "Gulika", start: data.gulika.start, end: data.gulika.end, type: "inauspicious", icon: Eye },
  ]

  const parseH = (s: string) => {
    if (!s || s === "—") return null
    const [h, m] = s.replace(/\s*[AP]M/, "").split(":").map(Number)
    const isPM = s.includes("PM")
    return (h % 12) + (isPM ? 12 : 0) + m / 60
  }

  return (
    <div className="relative">
      {/* <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
        <Clock className="h-4 w-4 text-secondary" />
        Day Timeline
      </h4> */}

      {/* Desktop / tablet: horizontal timeline */}
      {/* <div className="relative h-20 bg-gradient-to-r from-bg-secondary/80 via-bg-secondary/40 to-bg-secondary/80 rounded-2xl overflow-hidden border border-border/50 premium-shadow hidden sm:block">
        <div className="absolute inset-0 pattern-dots-subtle" />
        <div className="absolute inset-0 flex">
          {periods.map((p, i) => {
            const startH = parseH(p.start)
            const endH = parseH(p.end)
            if (startH === null || endH === null) return null
            const dayStart = 5
            const dayEnd = 20
            const range = dayEnd - dayStart
            const left = ((startH - dayStart) / range) * 100
            const width = Math.max(2, ((endH - startH) / range) * 100)
            return (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "absolute top-2 bottom-2 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:z-10",
                  p.type === "auspicious" && "bg-gradient-to-b from-emerald-400/40 to-emerald-400/20 border border-emerald-400/30 shadow-sm shadow-emerald-400/10",
                  p.type === "inauspicious" && "bg-gradient-to-b from-red-400/30 to-red-400/15 border border-red-400/20 shadow-sm shadow-red-400/10",
                )}
                style={{ left: `${left}%`, width: `${width}%` }}
                title={`${p.label}: ${p.start} - ${p.end}`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={cn(
                    "text-[10px] font-semibold whitespace-nowrap px-2 py-0.5 rounded-full backdrop-blur-sm",
                    p.type === "auspicious" && "bg-emerald-900/20 text-emerald-700",
                    p.type === "inauspicious" && "bg-red-900/20 text-red-600",
                  )}>
                    {p.label}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-5 flex items-end px-3 pb-0.5">
          <div className="w-full flex justify-between">
            {[6, 8, 10, 12, 14, 16, 18, 20].map(h => (
              <span key={h} className="text-[9px] font-medium text-text-muted/60">{h > 12 ? `${h - 12}PM` : `${h}AM`}</span>
            ))}
          </div>
        </div>
      </div> */}

      {/* Mobile: stacked list — the horizontal timeline's labels overlap below ~640px */}
      <div className="sm:hidden space-y-2">
        {periods.map((p, i) => {
          const Icon = p.icon
          return (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 border",
                p.type === "auspicious" && "bg-emerald-50/80 border-emerald-200/60",
                p.type === "inauspicious" && "bg-red-50/80 border-red-200/60",
              )}
            >
              <div className={cn(
                "p-1.5 rounded-lg shrink-0",
                p.type === "auspicious" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500",
              )}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span className={cn("text-xs font-semibold flex-1", p.type === "auspicious" ? "text-emerald-800" : "text-red-800")}>
                {p.label}
              </span>
              <span className={cn("text-[11px] font-medium", p.type === "auspicious" ? "text-emerald-600" : "text-red-600")}>
                {p.start} – {p.end}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function TithiCircle({ tithi, nakshatra, masa, paksha }: { tithi: string; nakshatra: string; masa: string; paksha: string }) {
  const tithiIndex = getTithiIndex(tithi)
  const progress = tithiIndex / 30
  const isShukla = paksha === "Shukla Paksha"
  const illumination = getMoonIllumination(tithi)

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative w-28 h-28 sm:w-32 sm:h-32">
        <div className={cn(
          "absolute inset-0 rounded-full blur-xl opacity-30 animate-pulse-soft",
          isShukla ? "bg-gold-400" : "bg-maroon-400",
        )} />
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 drop-shadow-lg">
          <defs>
            <linearGradient id="tithiGradNew" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isShukla ? "#C9A84C" : "#6B0F1A"} />
              <stop offset="50%" stopColor={isShukla ? "#DFC06A" : "#8B1A2B"} />
              <stop offset="100%" stopColor={isShukla ? "#C9A84C" : "#6B0F1A"} />
            </linearGradient>
            <filter id="glowFilter">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle cx="50" cy="50" r="42" fill="none" stroke="#E8DDD0" strokeWidth="4" opacity="0.5" />
          <motion.circle
            cx="50" cy="50" r="42" fill="none" stroke="url(#tithiGradNew)" strokeWidth="4"
            strokeDasharray={`${progress * 264} 264`} strokeLinecap="round"
            initial={{ strokeDasharray: "0 264" }}
            animate={{ strokeDasharray: `${progress * 264} 264` }}
            transition={{ duration: 1, ease: "easeOut" }}
            filter="url(#glowFilter)"
          />
          {isShukla ? (
            <circle cx="50" cy="50" r="15" fill="#C9A84C" opacity="0.12" />
          ) : (
            <circle cx="50" cy="50" r="15" fill="#6B0F1A" opacity="0.1" />
          )}
          <text
            x="50" y="56" textAnchor="middle" fontSize="16"
            fontWeight="700" fill="currentColor" className={cn(isShukla ? "text-gold-500" : "text-maroon-600")}
          >
            {tithi === "Purnima" ? "🌕" : tithi === "Amavasya" ? "🌑" : isShukla ? "☀" : "🌙"}
          </text>
        </svg>
        <motion.div
          className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-secondary to-gold-300 flex items-center justify-center shadow-glow-gold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-[10px] font-bold text-dark-slate">{Math.round(illumination * 100)}%</span>
        </motion.div>
      </div>
      <div className="mt-3 text-center">
        <p className="text-xs font-bold text-primary tracking-wide">{masa}</p>
        <p className="text-[10px] text-text-muted font-medium">
          {paksha?.replace(" Paksha", "")} · {nakshatra}
        </p>
      </div>
    </motion.div>
  )
}

function MonthCalendar({
  month, year, days, onChangeMonth,
}: {
  month: number
  year: number
  days: { day: number; tithi: string; nakshatra: string; isSpecial: boolean; isEkadashi: boolean; isAmavasya: boolean; isPournami: boolean }[]
  onChangeMonth: (dir: number) => void
}) {
  const firstDay = new Date(year, month, 1).getDay()
  const today = new Date()

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const dayNamesShort = ["S", "M", "T", "W", "T", "F", "S"]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChangeMonth(-1)}
          aria-label="Previous month"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-warm-white border border-border/60 flex items-center justify-center text-text-secondary hover:text-primary hover:border-secondary hover:shadow-md transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>
        <motion.h3
          key={`${month}-${year}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg sm:text-xl font-heading font-bold text-primary text-center"
        >
          {new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </motion.h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChangeMonth(1)}
          aria-label="Next month"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-warm-white border border-border/60 flex items-center justify-center text-text-secondary hover:text-primary hover:border-secondary hover:shadow-md transition-all"
        >
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      </div>
      <div className="grid grid-cols-7 gap-px bg-border/50 rounded-2xl overflow-hidden border border-border/50">
        {dayNames.map((d, i) => (
          <div key={d} className="bg-bg-secondary/80 px-1 sm:px-2 py-2.5 sm:py-3 text-center">
            <span className="text-[10px] sm:text-[11px] font-bold text-text-muted uppercase tracking-wider">
              <span className="sm:hidden">{dayNamesShort[i]}</span>
              <span className="hidden sm:inline">{d}</span>
            </span>
          </div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-warm-white/50 min-h-[64px] sm:min-h-[100px]" />
        ))}
        <AnimatePresence mode="popLayout">
          {days.map((d) => {
            const isToday = today.getDate() === d.day && today.getMonth() === month && today.getFullYear() === year
            return (
              <motion.div
                key={d.day}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "relative min-h-[64px] sm:min-h-[100px] p-1.5 sm:p-3 transition-all duration-200 group cursor-default",
                  isToday
                    ? "bg-gradient-to-br from-gold-50/90 to-amber-50/90 ring-2 ring-secondary/50 shadow-glow-gold z-10"
                    : "bg-warm-white hover:bg-bg-secondary/40",
                )}
              >
                <div className="flex items-start justify-between">
                  <span className={cn(
                    "text-xs sm:text-sm font-bold leading-none",
                    isToday ? "text-primary" : "text-text-primary",
                  )}>
                    {d.day}
                  </span>
                  {(d.isEkadashi || d.isAmavasya || d.isPournami) && (
                    <span className={cn(
                      "text-[6px] sm:text-[7px] font-bold px-1 py-0.5 rounded-full uppercase tracking-wider",
                      d.isEkadashi && "bg-emerald-100 text-emerald-700",
                      d.isAmavasya && "bg-maroon-100 text-maroon-700",
                      d.isPournami && "bg-gold-100 text-gold-700",
                    )}>
                      {d.isEkadashi ? "Eka" : d.isAmavasya ? "Ama" : "Pour"}
                    </span>
                  )}
                </div>
                <div className="mt-1 hidden xs:block sm:block">
                  <p className="text-[8px] sm:text-[9px] font-semibold text-text-secondary leading-tight truncate">{d.tithi}</p>
                  <p className="text-[7px] text-text-muted leading-tight truncate mt-0.5 hidden sm:block">{d.nakshatra}</p>
                </div>
                {isToday && (
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-secondary/30 pointer-events-none" />
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

function FestivalCard({ festival, index }: { festival: (typeof FESTIVALS)[number]; index: number }) {
  const IconComponent = FESTIVAL_ICONS[festival.icon] || Star
  const days = daysUntil(festival.date)
  const isPast = days < 0
  const isToday = days === 0
  const isSoon = days > 0 && days <= 7

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card
        variant="glass"
        padding="none"
        className={cn(
          "relative overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-premium group",
          isPast && "opacity-60",
        )}
      >
        <div className={cn("h-2 w-full bg-gradient-to-r shrink-0", festival.color)} />

        <div className="p-5 sm:p-6 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className={cn(
              "w-11 h-11 rounded-2xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-sm",
              festival.color,
            )}>
              <IconComponent className="h-5 w-5 text-white" />
            </div>
            {isToday ? (
              <Badge variant="primary" size="sm" dot>Today</Badge>
            ) : isSoon ? (
              <Badge variant="secondary" size="sm">In {days} day{days === 1 ? "" : "s"}</Badge>
            ) : !isPast ? (
              <Badge variant="default" size="sm">
                {new Date(festival.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </Badge>
            ) : (
              <Badge variant="default" size="sm">Past</Badge>
            )}
          </div>

          <h4 className="text-lg font-heading font-bold text-primary leading-snug">{festival.name}</h4>
          <p className="text-xs text-text-muted font-medium mt-1">
            {new Date(festival.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
          <p className="text-sm text-text-secondary mt-3 leading-relaxed flex-1">{festival.description}</p>

          <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border/50">
            <Button variant="secondary" size="sm" className="flex-1" iconRight={<ArrowRight className="h-3.5 w-3.5" />} asChild>
              <Link href={`/seva?event=${slugify(festival.name)}`}>Book Seva</Link>
            </Button>
            <button
              onClick={() => downloadICS(festival.name, festival.description, festival.date)}
              aria-label={`Add ${festival.name} to calendar`}
              className="w-9 h-9 shrink-0 rounded-lg border border-border/60 flex items-center justify-center text-text-muted hover:text-secondary hover:border-secondary transition-colors"
            >
              <CalendarDays className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default function PanchangaPage() {
  const [panchanga, setPanchanga] = useState<PanchangaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [shareStatus, setShareStatus] = useState<"idle" | "shared" | "copied" | "failed">("idle")

  useEffect(() => {
    setLoading(true)
    fetchPanchanga().then((data) => {
      setPanchanga(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (shareStatus === "idle") return
    const t = setTimeout(() => setShareStatus("idle"), 2500)
    return () => clearTimeout(t)
  }, [shareStatus])

  const today = new Date()
  const vara = VARA_NAMES[today.getDay()]
  const varaShort = VARA_SHORT[today.getDay()]

  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1
      const date = new Date(year, month, day)
      const p = calculatePanchanga(date)
      return {
        day,
        tithi: p.tithi,
        nakshatra: p.nakshatra,
        isSpecial: p.isEkadashi || p.isAmavasya || p.isPournami,
        isEkadashi: p.isEkadashi,
        isAmavasya: p.isAmavasya,
        isPournami: p.isPournami,
      }
    })
  }, [month, year])

  const handleMonthChange = useCallback((dir: number) => {
    if (dir > 0) {
      if (month === 11) { setMonth(0); setYear(y => y + 1) }
      else setMonth(m => m + 1)
    } else {
      if (month === 0) { setMonth(11); setYear(y => y - 1) }
      else setMonth(m => m - 1)
    }
  }, [month])

  const handleShare = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    const text = panchanga
      ? `Today's Panchanga at ${TEMPLE_NAME}: ${panchanga.tithi} tithi, ${panchanga.nakshatra} nakshatra.`
      : `Today's Panchanga at ${TEMPLE_NAME}.`
    const status = await shareContent(`${TEMPLE_NAME} Panchanga`, text, url)
    setShareStatus(status)
  }, [panchanga])

  const handleAddToCalendar = useCallback(() => {
    if (!panchanga) return
    const dateStr = today.toISOString().split("T")[0]
    const description = `Tithi: ${panchanga.tithi}\\nNakshatra: ${panchanga.nakshatra}\\nAbhijit Muhurta: ${panchanga.abhijitMuhurta.start} - ${panchanga.abhijitMuhurta.end}\\nRahu Kala: ${panchanga.rahuKala.start} - ${panchanga.rahuKala.end}`
    downloadICS(`Panchanga — ${panchanga.tithi}`, description, dateStr)
  }, [panchanga, today])

  const handleDownloadPdf = useCallback(() => {
    if (typeof window !== "undefined") window.print()
  }, [])

  const todayCards = useMemo(() => {
    if (!panchanga) return []
    return [
      { label: "Tithi", value: panchanga.tithi, icon: Moon },
      { label: "Nakshatra", value: `${panchanga.nakshatra} · Pada ${panchanga.nakshatraPada}`, icon: Star },
      { label: "Yoga", value: panchanga.yoga, icon: Zap },
      { label: "Karana", value: panchanga.karana, icon: Clock },
      { label: "Vara", value: `${vara} (${varaShort})`, icon: CalendarDays },
      { label: "Sunrise", value: panchanga.sunrise, icon: Sunrise },
      { label: "Sunset", value: panchanga.sunset, icon: Sunset },
      { label: "Moonrise", value: panchanga.moonrise, icon: Moon },
      { label: "Moonset", value: panchanga.moonset, icon: CloudSun },
      { label: "Rahu Kala", value: `${panchanga.rahuKala.start} – ${panchanga.rahuKala.end}`, icon: AlertTriangle },
      { label: "Yamaganda", value: `${panchanga.yamaganda.start} – ${panchanga.yamaganda.end}`, icon: Ban },
      { label: "Gulika Kala", value: `${panchanga.gulika.start} – ${panchanga.gulika.end}`, icon: Eye },
      { label: "Abhijit Muhurta", value: `${panchanga.abhijitMuhurta.start} – ${panchanga.abhijitMuhurta.end}`, icon: Sparkles },
      { label: "Amrita Kala", value: `${panchanga.amritaKala.start} – ${panchanga.amritaKala.end}`, icon: Heart },
    ]
  }, [panchanga, vara, varaShort])

  const tithiIndex = panchanga ? getTithiIndex(panchanga.tithi) : 0
  const isShukla = panchanga?.paksha === "Shukla Paksha"
  const moonIllumination = panchanga ? getMoonIllumination(panchanga.tithi) : 0
  const moonPhaseName = panchanga ? getMoonPhaseName(panchanga.tithi) : ""
  const rashi = panchanga ? getRashi(panchanga.nakshatra) : "—"

  const upcomingFestivals = useMemo(
    () => [...FESTIVALS].sort((a, b) => daysUntil(a.date) - daysUntil(b.date)),
    [],
  )

  return (
    <div className={cn("min-h-screen bg-bg-primary", NAVBAR_OFFSET)}>
      <section className="relative min-h-[42vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-maroon-800 via-maroon-700 to-gold-700 z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/40 via-transparent to-gold-500/20 z-[1]" />
        <div className="absolute inset-0 pattern-mandala opacity-20 z-[2]" />
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-gold-400/10 to-transparent z-[3]" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg-primary to-transparent z-[4]" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-14 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block text-gold-300/90 text-xs sm:text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium"
            >
              <Sun className="inline-block h-4 w-4 mr-2 text-gold-300" />
              Astrological Calendar
              <Sun className="inline-block h-4 w-4 ml-2 text-gold-300" />
            </motion.span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-warm-white leading-tight drop-shadow-lg">
              Panchanga
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-gold-400 to-gold-300 rounded-full mx-auto mt-6 mb-6" />
            <p className="text-warm-white/80 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-sans px-2">
              The sacred Hindu almanac — today&apos;s tithi, nakshatra, yoga, karana, and auspicious timings for {TEMPLE_NAME}.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 -mt-12 px-4 pb-8 max-w-7xl mx-auto">
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-8 px-2">
          <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-text-primary font-medium">Panchanga</span>
        </nav>

        <AnimatedSection>
          <SectionHeading
            title="Today&apos;s Panchanga"
            subtitle={today.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          />
        </AnimatedSection>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
          {loading
            ? Array.from({ length: 14 }).map((_, i) => (
                <Card key={i} variant="glass" className="p-4 min-h-[100px]">
                  <Skeleton className="h-4 w-4 rounded-full mb-3" />
                  <Skeleton className="h-3 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </Card>
              ))
            : todayCards.map((card, i) => {
                const Icon = card.icon
                return (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Card
                      variant="glass"
                      className="p-4 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-premium hover:border-secondary/30 group cursor-default"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-secondary/10 to-gold-400/10 group-hover:from-secondary/20 group-hover:to-gold-400/20 transition-all">
                          <Icon className="h-4 w-4 text-secondary" />
                        </div>
                        {(card.label === "Abhijit Muhurta" || card.label === "Amrita Kala") && (
                          <Sparkles className="h-3 w-3 text-gold-400 animate-pulse-soft" />
                        )}
                      </div>
                      <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-0.5">{card.label}</p>
                      <p className="text-sm font-bold text-text-primary leading-tight">{card.value}</p>
                    </Card>
                  </motion.div>
                )
              })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: panchanga ? 1 : 0, y: panchanga ? 0 : 30 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {panchanga && (
            <div className="mt-8 grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <Card variant="glass" padding="lg" className="h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-heading font-bold text-primary">Panchanga Details</h3>
                      <p className="text-xs text-text-muted mt-1">Masa: {panchanga.masa} · Paksha: {panchanga.paksha}</p>
                    </div>
                    <div className="hidden sm:block">
                      <TithiCircle tithi={panchanga.tithi} nakshatra={panchanga.nakshatra} masa={panchanga.masa} paksha={panchanga.paksha} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { label: "Tithi", value: panchanga.tithi, icon: Moon },
                      { label: "Nakshatra", value: `${panchanga.nakshatra} (Pada ${panchanga.nakshatraPada})`, icon: Star },
                      { label: "Yoga", value: panchanga.yoga, icon: Zap },
                      { label: "Karana", value: panchanga.karana, icon: Clock },
                      { label: "Masa", value: panchanga.masa, icon: CalendarDays },
                      { label: "Paksha", value: panchanga.paksha, icon: Sun },
                      { label: "Sunrise", value: panchanga.sunrise, icon: Sunrise },
                      { label: "Sunset", value: panchanga.sunset, icon: Sunset },
                    ].map((item) => {
                      const Icon = item.icon
                      return (
                        <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-bg-secondary/60 border border-border/40 hover:bg-bg-secondary/80 transition-all group">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-secondary/10 to-gold-400/10 group-hover:from-secondary/20 group-hover:to-gold-400/20 transition-all">
                            <Icon className="h-4 w-4 text-secondary" />
                          </div>
                          <div>
                            <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">{item.label}</p>
                            <p className="text-sm font-bold text-text-primary">{item.value}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border/60">
                    {panchanga.isEkadashi && <Badge variant="primary" size="md" dot>Ekadashi Today</Badge>}
                    {panchanga.isAmavasya && <Badge variant="warning" size="md" dot>Amavasya Today</Badge>}
                    {panchanga.isPournami && <Badge variant="secondary" size="md" dot>Pournami Today</Badge>}
                  </div>
                  <div className="mt-8 pt-6 border-t border-border/60">
                    <DayTimeline data={panchanga} />
                  </div>
                </Card>
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="sm:hidden flex justify-center">
                  {panchanga && (
                    <TithiCircle tithi={panchanga.tithi} nakshatra={panchanga.nakshatra} masa={panchanga.masa} paksha={panchanga.paksha} />
                  )}
                </div>
                <Card variant="glass" padding="lg" className="overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-400/5 to-transparent rounded-full" />
                  <h3 className="text-lg font-heading font-bold text-primary mb-5 flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-100/60">
                      <Star className="h-4 w-4 text-emerald-600" />
                    </div>
                    Auspicious Timings
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: "Abhijit Muhurta", start: panchanga?.abhijitMuhurta.start ?? "—", end: panchanga?.abhijitMuhurta.end ?? "—", icon: Sparkles },
                      { label: "Amrita Kala", start: panchanga?.amritaKala.start ?? "—", end: panchanga?.amritaKala.end ?? "—", icon: Heart },
                    ].map((timing) => {
                      const Icon = timing.icon
                      return (
                        <motion.div
                          key={timing.label}
                          whileHover={{ x: 4 }}
                          className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-emerald-50/30 border border-emerald-200/50"
                        >
                          <div className="p-2 rounded-xl bg-emerald-100/80">
                            <Icon className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-emerald-800 text-sm">{timing.label}</p>
                            <p className="text-xs text-emerald-600 font-medium">{timing.start} – {timing.end}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-emerald-400" />
                        </motion.div>
                      )
                    })}
                  </div>
                </Card>
                <Card variant="glass" padding="lg" className="overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-400/5 to-transparent rounded-full" />
                  <h3 className="text-lg font-heading font-bold text-primary mb-5 flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-red-100/60">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </div>
                    Inauspicious Timings
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: "Rahu Kala", start: panchanga?.rahuKala.start ?? "—", end: panchanga?.rahuKala.end ?? "—", icon: AlertTriangle },
                      { label: "Yamaganda", start: panchanga?.yamaganda.start ?? "—", end: panchanga?.yamaganda.end ?? "—", icon: Ban },
                      { label: "Gulika Kala", start: panchanga?.gulika.start ?? "—", end: panchanga?.gulika.end ?? "—", icon: Eye },
                    ].map((timing) => {
                      const Icon = timing.icon
                      return (
                        <motion.div
                          key={timing.label}
                          whileHover={{ x: 4 }}
                          className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-red-50/80 to-red-50/30 border border-red-200/50"
                        >
                          <div className="p-2 rounded-xl bg-red-100/80">
                            <Icon className="h-4 w-4 text-red-500" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-red-800 text-sm">{timing.label}</p>
                            <p className="text-xs text-red-600 font-medium">{timing.start} – {timing.end}</p>
                          </div>
                          <Info className="h-4 w-4 text-red-400" />
                        </motion.div>
                      )
                    })}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </motion.div>
      </section>

      <section className="py-16 sm:py-20 px-4 bg-gradient-to-b from-bg-secondary/40 to-bg-primary">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <SectionHeading
              title="Monthly Calendar"
              subtitle="Navigate through the Hindu calendar months. Each day shows tithi and nakshatra."
            />
          </AnimatedSection>

          <div className="mt-10 sm:mt-12">
            <Card variant="elevated" padding="lg" className="shadow-premium overflow-hidden">
              <MonthCalendar
                month={month}
                year={year}
                days={calendarDays}
                onChangeMonth={handleMonthChange}
              />
            </Card>
          </div>
        </div>
      </section>

      {/* --- Upcoming Festivals: redesigned as a responsive card grid --- */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <SectionHeading
              title="Upcoming Festivals"
              subtitle="Mark your calendar with these sacred occasions at the temple."
            />
          </AnimatedSection>

          <div className="mt-10 sm:mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {upcomingFestivals.map((festival, i) => (
              <FestivalCard key={festival.name} festival={festival} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 px-4 bg-gradient-to-b from-bg-primary to-bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <SectionHeading
              title="Moon Phase"
              subtitle="Current lunar phase, tithi progress, and zodiac position."
            />
          </AnimatedSection>

          <div className="mt-10 sm:mt-12 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Card variant="glass" padding="lg" className="flex flex-col items-center text-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44">
                {panchanga ? (
                  <MoonPhaseSVG tithi={panchanga.tithi} />
                ) : (
                  <Skeleton className="w-full h-full rounded-full" />
                )}
              </div>
              <h4 className="text-lg font-heading font-bold text-primary mt-4">{moonPhaseName}</h4>
              <p className="text-sm text-text-muted mt-1">
                {isShukla ? "Shukla Paksha" : "Krishna Paksha"} · {Math.round(moonIllumination * 100)}% Illuminated
              </p>
            </Card>

            <Card variant="glass" padding="lg" className="flex flex-col items-center text-center">
              <h4 className="text-lg font-heading font-bold text-primary mb-6">Tithi Progress</h4>
              <div className="relative w-36 h-36 sm:w-40 sm:h-40">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <defs>
                    <linearGradient id="tithiRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#C9A84C" />
                      <stop offset="50%" stopColor="#DFC06A" />
                      <stop offset="100%" stopColor="#C9A84C" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#E8DDD0" strokeWidth="6" opacity="0.4" />
                  <motion.circle
                    cx="50" cy="50" r="42" fill="none" stroke="url(#tithiRingGrad)" strokeWidth="6"
                    strokeDasharray={`${(tithiIndex / 30) * 264} 264`} strokeLinecap="round"
                    initial={{ strokeDasharray: "0 264" }}
                    animate={{ strokeDasharray: `${(tithiIndex / 30) * 264} 264` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  <text x="50" y="54" textAnchor="middle" fontSize="14" fontWeight="800" fill="currentColor" className="text-text-primary">
                    {tithiIndex + 1}
                  </text>
                  <text x="50" y="64" textAnchor="middle" fontSize="5" fill="currentColor" className="text-text-muted">/ 30</text>
                </svg>
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-sm font-semibold text-text-primary">
                  {panchanga?.tithi || "—"}
                </p>
                <p className="text-xs text-text-muted">
                  {isShukla ? "Waxing · Light half" : "Waning · Dark half"}
                </p>
              </div>
            </Card>

            <Card variant="glass" padding="lg" className="flex flex-col items-center text-center sm:col-span-2 md:col-span-1">
              <h4 className="text-lg font-heading font-bold text-primary mb-6">Zodiac (Rashi)</h4>
              <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-secondary/20 to-gold-400/10 border-2 border-secondary/30 flex items-center justify-center shadow-premium">
                <div className="text-center">
                  <Sun className="h-8 w-8 text-secondary mx-auto mb-1" />
                  <p className="text-2xl font-bold font-heading text-primary">{rashi}</p>
                  {panchanga && (
                    <p className="text-[10px] text-text-muted font-medium mt-0.5">{panchanga.nakshatra}</p>
                  )}
                </div>
              </div>
              <p className="text-sm text-text-muted mt-4">
                Moon is currently in <span className="font-bold text-primary">{rashi}</span> rashi
              </p>
              <p className="text-xs text-text-muted/70 mt-1">
                Based on nakshatra: {panchanga?.nakshatra || "—"}
              </p>
            </Card>
          </div>
        </div>
      </section>

      <div className="sticky bottom-4 sm:bottom-6 z-50 px-4 print:hidden">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto"
        >
          <div className="glass rounded-2xl px-3 py-3 sm:px-6 sm:py-4 shadow-premium border border-gold-400/20 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <Button variant="primary" size="sm" iconLeft={<Sparkles className="h-4 w-4" />} className="shrink-0" asChild>
              <Link href="/seva?event=today">
                <span className="hidden sm:inline">Book Today&apos;s Seva</span>
                <span className="sm:hidden">Book Seva</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" iconLeft={<Download className="h-4 w-4" />} className="shrink-0" onClick={handleDownloadPdf}>
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">PDF</span>
            </Button>
            <Button variant="ghost" size="sm" className="shrink-0" onClick={handleShare} iconLeft={
              shareStatus === "shared" || shareStatus === "copied" ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />
            }>
              {shareStatus === "shared" ? "Shared" : shareStatus === "copied" ? "Link copied" : "Share"}
            </Button>
            <Button variant="ghost" size="sm" iconLeft={<CalendarDays className="h-4 w-4" />} className="shrink-0" onClick={handleAddToCalendar}>
              <span className="hidden sm:inline">Add to Calendar</span>
              <span className="sm:hidden">Calendar</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}