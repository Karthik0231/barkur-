"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight, Clock, Star, CalendarDays, Moon, Sun,
  ChevronLeft, Sparkles, Download, Share2, Bell, Heart, Zap, Droplets, Wind,
  ArrowRight, Check, Copy,
} from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { PageBanner } from "@/components/PageBanner"
import { calculatePanchanga } from "@/lib/panchanga"
import { useTranslation } from "@/lib/i18n"
import { TEMPLE_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"

const VARA_NAMES = ["Ravivara", "Somavara", "Mangalavara", "Budhavara", "Guruvara", "Shukravara", "Shanivara"]
const VARA_SHORT = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const NAKSHATRA_RASHI: Record<string, string> = {
  "Ashwini": "Mesha",
  "Bharani": "Mesha",
  "Krittika": "Mesha",
  "Rohini": "Vrishabha",
  "Mrigashira": "Vrishabha",
  "Ardra": "Mithuna",
  "Punarvasu": "Mithuna",
  "Pushya": "Karka",
  "Ashlesha": "Karka",
  "Magha": "Simha",
  "Purva Phalguni": "Simha",
  "Uttara Phalguni": "Simha",
  "Hasta": "Kanya",
  "Chitra": "Kanya",
  "Swati": "Tula",
  "Vishakha": "Tula",
  "Anuradha": "Vrishchika",
  "Jyeshtha": "Vrishchika",
  "Mula": "Dhanu",
  "Purva Ashadha": "Dhanu",
  "Uttara Ashadha": "Dhanu",
  "Shravana": "Makara",
  "Dhanishtha": "Makara",
  "Shatabhisha": "Kumbha",
  "Purva Bhadrapada": "Kumbha",
  "Uttara Bhadrapada": "Meena",
  "Revati": "Meena"
}

const FESTIVAL_ICONS: Record<string, typeof Star> = {
  "Star": Star, "Sparkles": Sparkles, "Bell": Bell, "Moon": Moon, "Sun": Sun, "Heart": Heart, "Zap": Zap,
}

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
        )}
        />
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 drop-shadow-lg">
          <defs>
            <linearGradient id="tithiRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
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
          <circle cx="50" cy="50" r="42" fill="none" stroke="#E8DDD0" strokeWidth="4" opacity="0.4" />
          <motion.circle
            cx="50" cy="50" r="42" fill="none" stroke="url(#tithiRingGrad)" strokeWidth="4"
            strokeDasharray={`${progress * 264} 264`} strokeLinecap="round"
            initial={{ strokeDasharray: "0 264" }}
            animate={{ strokeDasharray: `${progress * 264} 264` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            filter="url(#glowFilter)"
          />
          {isShukla ? (
            <circle cx="50" cy="50" r="15" fill="#C9A84C" opacity="0.12" />
          ) : (
            <circle cx="50" cy="50" r="15" fill="#6B0F1A" opacity="0.1" />
          )}
          <text
            x="50" y="54" textAnchor="middle" fontSize="14"
            fontWeight="800" fill="currentColor" className="text-text-primary"
          >
            {tithiIndex + 1}
          </text>
          <text x="50" y="64" textAnchor="middle" fontSize="5" fill="currentColor" className="text-text-muted">/ 30</text>
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
      <div className="mt-4 text-center">
        <h4 className="text-lg font-heading font-bold text-primary">{getMoonPhaseName(tithi)}</h4>
        <p className="text-sm text-text-muted mt-1">
          {isShukla ? "Shukla Paksha" : "Krishna Paksha"} · {Math.round(illumination * 100)}% Illuminated
        </p>
      </div>
    </motion.div>
  )
}

function MonthCalendar({
  month, year, days, onChangeMonth, onDayClick, locale, t: translate
}: {
  month: number;
  year: number;
  days: { day: number; tithi: string; nakshatra: string; isSpecial: boolean; isEkadashi: boolean; isAmavasya: boolean; isPournami: boolean }[];
  onChangeMonth: (dir: number) => void;
  onDayClick?: (date: Date) => void;
  locale: string;
  t: (key: string) => string
}) {
  const firstDay = new Date(year, month, 1).getDay()
  const today = new Date()

  const dayNames = Array.from({ length: 7 }, (_, i) => new Date(2024, 0, i + 1).toLocaleDateString(locale, { weekday: "long" }))
  const dayNamesShort = Array.from({ length: 7 }, (_, i) => new Date(2024, 0, i + 1).toLocaleDateString(locale, { weekday: "narrow" }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChangeMonth(-1)}
          aria-label={translate("panchanga.previousMonth")}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-warm-white border border-border/60 flex items-center justify-center text-text-secondary hover:text-primary hover:border-secondary hover:shadow-md transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>
        <motion.h3
          key={`${month}-${year}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-heading font-bold text-primary text-center"
        >
          {new Date(year, month).toLocaleDateString(locale, { month: "long", year: "numeric" })}
        </motion.h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChangeMonth(1)}
          aria-label={translate("panchanga.nextMonth")}
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
                onClick={() => onDayClick?.(new Date(year, month, d.day))}
                className={cn(
                  "relative min-h-[64px] sm:min-h-[100px] p-1.5 sm:p-3 transition-all duration-200 group cursor-pointer",
                  isToday
                    ? "bg-gradient-to-br from-gold-50/90 to-amber-50/90 ring-2 ring-secondary/50 shadow-glow-gold z-10"
                    : "bg-warm-white hover:bg-bg-secondary/40",
                )}
              >
                <div className="flex items-start justify-between">
                  <span className={cn(
                    "text-xs sm:text-sm font-bold leading-none",
                    isToday ? "text-primary" : "text-text-primary",
                  )}
                  >
                    {d.day}
                  </span>
                  {(d.isEkadashi || d.isAmavasya || d.isPournami) && (
                    <span className={cn(
                      "text-[6px] sm:text-[7px] font-bold px-1 py-0.5 rounded-full uppercase tracking-wider",
                      d.isEkadashi && "bg-emerald-100 text-emerald-700",
                      d.isAmavasya && "bg-maroon-100 text-maroon-700",
                      d.isPournami && "bg-gold-100 text-gold-700",
                    )}
                    >
                      {d.isEkadashi ? "Ekadashi" : d.isAmavasya ? "Amavasya" : "Pournami"}
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

function FestivalCard({ festival, index, locale, t }: { festival: any, index: number; locale: string; t: (key: string) => string }) {
  const IconComponent = FESTIVAL_ICONS["Star"] || Star
  const dateStr = festival.startDate ? festival.startDate.toISOString().split('T')[0] :
    festival.date ? festival.date.toISOString().split('T')[0] : "2026-01-01"
  const days = daysUntil(dateStr)
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
        <div className="h-2 w-full bg-gradient-to-r from-amber-400 to-orange-500 shrink-0" />

        <div className="p-5 sm:p-6 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-sm">
              <IconComponent className="h-5 w-5 text-white" />
            </div>
            {isToday ? (
              <Badge variant="primary" size="sm" dot>{t("panchanga.today")}</Badge>
            ) : isSoon ? (
              <Badge variant="secondary" size="sm">{t("panchanga.inDays").replace("{days}", String(days))}</Badge>
            ) : !isPast ? (
              <Badge variant="default" size="sm">
                {new Date(dateStr).toLocaleDateString(locale, { day: "numeric", month: "short" })}
              </Badge>
            ) : (
              <Badge variant="default" size="sm">{t("panchanga.past")}</Badge>
            )}
          </div>

          <h4 className="text-lg font-heading font-bold text-primary leading-snug">{festival.name}</h4>
          {festival.startDate && (
            <p className="text-xs text-text-muted font-medium mt-1">
              {new Date(festival.startDate).toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
          <p className="text-sm text-text-secondary mt-3 leading-relaxed flex-1">{festival.description || festival.shortDescription || ""}</p>

          <div className="flex items-center gap-2 mt-5 pt-4 border-t border-border/50">
            <Link href={`/sevas?event=${slugify(festival.name)}`} className="flex-1">
              <Button variant="secondary" size="sm" className="w-full" iconRight={<ArrowRight className="h-3.5 w-3.5" />}
              >
                Book Seva
              </Button>
            </Link>
            <button
              onClick={() => downloadICS(festival.name, festival.description || festival.shortDescription || "", dateStr)}
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

interface PanchangaData {
  tithi: string; nakshatra: string; nakshatraPada: number; yoga: string; karana: string
  masa: string; paksha: string
  sunrise: string; sunset: string; moonrise: string; moonset: string
  rahuKala: { start: string; end: string }; yamaganda: { start: string; end: string }
  gulika: { start: string; end: string }; amritaKala: { start: string; end: string }
  abhijitMuhurta: { start: string; end: string }
  isEkadashi: boolean; isAmavasya: boolean; isPournami: boolean
}

export default function PanchangaClient({ festivals }: { festivals: any[] }) {
  const { t, language } = useTranslation()
  const locale = language === "kn" ? "kn-IN" : "en-IN"
  const [panchanga, setPanchanga] = useState<PanchangaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())
  const [shareStatus, setShareStatus] = useState<"idle" | "shared" | "copied" | "failed">("idle")
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch("/api/panchanga?today=true").then(r => r.json()).then(d => {
      const raw = d.data?.panchanga || d.panchanga || d
      if (raw && raw.tithi) {
        const p: PanchangaData = {
          tithi: raw.tithi,
          nakshatra: raw.nakshatra,
          nakshatraPada: raw.nakshatraPada ?? 0,
          yoga: raw.yoga,
          karana: raw.karana,
          masa: raw.masa || "—",
          paksha: raw.paksha || "—",
          sunrise: raw.sunrise || "—",
          sunset: raw.sunset || "—",
          moonrise: raw.moonrise || "—",
          moonset: raw.moonset || "—",
          rahuKala: raw.rahuKala && raw.rahuKala.start ? raw.rahuKala : { start: raw.rahuKalaStart || "—", end: raw.rahuKalaEnd || "—" },
          yamaganda: raw.yamaganda && raw.yamaganda.start ? raw.yamaganda : { start: raw.yamagandaStart || "—", end: raw.yamagandaEnd || "—" },
          gulika: raw.gulika && raw.gulika.start ? raw.gulika : { start: raw.gulikaStart || "—", end: raw.gulikaEnd || "—" },
          amritaKala: raw.amritaKala && raw.amritaKala.start ? raw.amritaKala : { start: raw.amritaKalaStart || "—", end: raw.amritaKalaEnd || "—" },
          abhijitMuhurta: raw.abhijitMuhurta && raw.abhijitMuhurta.start ? raw.abhijitMuhurta : { start: raw.abhijitMuhurtaStart || "—", end: raw.abhijitMuhurtaEnd || "—" },
          isEkadashi: !!raw.isEkadashi,
          isAmavasya: !!raw.isAmavasya,
          isPournami: !!raw.isPournami,
        }
        setPanchanga(p)
      }
      setLoading(false)
    }).catch(() => setLoading(false))
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

  const selectedDayPanchanga = selectedDay ? calculatePanchanga(selectedDay) : null

  const handleDayClick = useCallback((date: Date) => {
    setSelectedDay(date)
  }, [])

  const handleAddToCalendar = useCallback(() => {
    if (!panchanga) return
    const dateStr = today.toISOString().split('T')[0]
    const description = `Tithi: ${panchanga.tithi}\nNakshatra: ${panchanga.nakshatra}\nYoga: ${panchanga.yoga}\nKarana: ${panchanga.karana}`
    downloadICS(`Panchanga — ${panchanga.tithi}`, description, dateStr)
  }, [panchanga, today])

  const handleDownloadPdf = useCallback(() => {
    if (typeof window !== "undefined") window.print()
  }, [])

  const todayCards = useMemo(() => {
    if (!panchanga) return []
    return [
      { label: t("panchanga.tithi"), value: panchanga.tithi, icon: Moon },
      { label: t("panchanga.nakshatra"), value: `${panchanga.nakshatra} (Pada ${panchanga.nakshatraPada})`, icon: Star },
      { label: t("panchanga.yoga"), value: panchanga.yoga, icon: Zap },
      { label: t("panchanga.karana"), value: panchanga.karana, icon: Clock },
      { label: t("panchanga.masa"), value: panchanga.masa, icon: CalendarDays },
      { label: t("panchanga.paksha"), value: panchanga.paksha, icon: Sun },
      { label: t("panchanga.sunrise"), value: panchanga.sunrise, icon: Sun },
      { label: t("panchanga.sunset"), value: panchanga.sunset, icon: Sun },
      { label: t("panchanga.moonrise"), value: panchanga.moonrise, icon: Moon },
      { label: t("panchanga.moonset"), value: panchanga.moonset, icon: Moon },
      { label: t("panchanga.rahuKala"), value: `${panchanga.rahuKala.start} – ${panchanga.rahuKala.end}`, icon: Clock },
      { label: t("panchanga.yamaganda"), value: `${panchanga.yamaganda.start} – ${panchanga.yamaganda.end}`, icon: Clock },
      { label: t("panchanga.gulika"), value: `${panchanga.gulika.start} – ${panchanga.gulika.end}`, icon: Clock },
      { label: t("panchanga.amritaKala"), value: `${panchanga.amritaKala.start} – ${panchanga.amritaKala.end}`, icon: Sparkles, sparkle: true },
      { label: t("panchanga.abhijit"), value: `${panchanga.abhijitMuhurta.start} – ${panchanga.abhijitMuhurta.end}`, icon: Sparkles, sparkle: true },
    ]
  }, [panchanga, t])

  const tithiIndex = panchanga ? getTithiIndex(panchanga.tithi) : 0
  const isShukla = panchanga?.paksha === "Shukla Paksha"
  const moonIllumination = panchanga ? getMoonIllumination(panchanga.tithi) : 0
  const moonPhaseName = panchanga ? getMoonPhaseName(panchanga.tithi) : ""
  const rashi = panchanga ? getRashi(panchanga.nakshatra) : "—"

  const upcomingFestivals = useMemo(() => {
    return [...festivals].sort((a, b) => {
      const aDate = a.startDate || a.date ? new Date(a.startDate || a.date).getTime() : 0;
      const bDate = b.startDate || b.date ? new Date(b.startDate || b.date).getTime() : 0;
      return aDate - bDate;
    })
  }, [festivals])

  return (
    <div className="min-h-screen bg-bg-primary">
      <PageBanner
        title={t("pages.panchanga.title")}
        eyebrow={t("pages.panchanga.eyebrow")}
        subtitle={`${t("pages.panchanga.subtitle")} ${TEMPLE_NAME}.`}
      />

      <section className="relative z-10 -mt-12 px-4 pb-8 max-w-7xl mx-auto">
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-8 px-2">
          <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-text-primary font-medium">{t("panchanga.title")}</span>
        </nav>

        <AnimatedSection>
          <SectionHeading
            title={t("panchanga.todaysPanchanga")}
            subtitle={today.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          />
        </AnimatedSection>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
          {loading
            ? Array.from({ length: 15 }).map((_, i) => (
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
                      {card.sparkle && (
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
            <div className="mt-8">
              <Card variant="glass" padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-heading font-bold text-primary">{t("panchanga.panchangaDetails")}</h3>
                    <p className="text-xs text-text-muted mt-1">{t("panchanga.masa")}: {panchanga.masa} · {t("panchanga.paksha")}: {panchanga.paksha}</p>
                  </div>
                  <div className="hidden sm:block">
                    <TithiCircle tithi={panchanga.tithi} nakshatra={panchanga.nakshatra} masa={panchanga.masa} paksha={panchanga.paksha} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: t("panchanga.tithi"), value: panchanga.tithi, icon: Moon },
                    { label: t("panchanga.nakshatra"), value: `${panchanga.nakshatra} (Pada ${panchanga.nakshatraPada})`, icon: Star },
                    { label: t("panchanga.yoga"), value: panchanga.yoga, icon: Zap },
                    { label: t("panchanga.karana"), value: panchanga.karana, icon: Clock },
                    { label: t("panchanga.masa"), value: panchanga.masa, icon: CalendarDays },
                    { label: t("panchanga.paksha"), value: panchanga.paksha, icon: Sun },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.label} className="flex items-center gap-3 p-4 rounded-2xl bg-bg-secondary/60 border border-border/40 hover:bg-bg-secondary/80 transition-all group">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-secondary/10 to-gold-400/10 group-hover:from-secondary/20 group-hover:to-gold-400/20 transition-all">
                          <Icon className="h-5 w-5 text-secondary" />
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
              </Card>
              <div className="sm:hidden flex justify-center mt-6">
                {panchanga && (
                  <TithiCircle tithi={panchanga.tithi} nakshatra={panchanga.nakshatra} masa={panchanga.masa} paksha={panchanga.paksha} />
                )}
              </div>
            </div>
          )}
        </motion.div>
      </section>

      <section className="py-16 sm:py-20 px-4 bg-gradient-to-b from-bg-secondary/40 to-bg-primary">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <SectionHeading
              title={t("sections.panchangaCalendarTitle")}
              subtitle={t("sections.panchangaCalendarSub")}
            />
          </AnimatedSection>

          <div className="mt-10 sm:mt-12">
            <Card variant="elevated" padding="lg" className="shadow-premium overflow-hidden">
              <MonthCalendar
                month={month}
                year={year}
                days={calendarDays}
                locale={locale}
                t={t}
                onDayClick={handleDayClick}
                onChangeMonth={d => { setMonth((prev: number) => { const next = prev + d; if (next < 0) { setYear((y: number) => y - 1); return 11; } if (next > 11) { setYear((y: number) => y + 1); return 0; } return next; }); }}
              />
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Festivals */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <SectionHeading
              title={t("sections.panchangaFestivalsTitle")}
              subtitle={t("sections.panchangaFestivalsSub")}
            />
          </AnimatedSection>

          <div className="mt-10 sm:mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {upcomingFestivals.map((festival, i) => (
              <FestivalCard key={festival.id} festival={festival} index={i} locale={locale} t={t} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 px-4 bg-gradient-to-b from-bg-primary to-bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <SectionHeading
              title={t("sections.panchangaMoonTitle")}
              subtitle={t("sections.panchangaMoonSub")}
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
                {t("panchanga.basedOnNakshatra")}: {panchanga?.nakshatra || "—"}
              </p>
            </Card>
          </div>
        </div>
      </section>

      <Dialog open={!!selectedDay} onClose={() => setSelectedDay(null)} className="max-w-lg">
        {selectedDayPanchanga && (
          <div className="p-6">
            <div className="text-center mb-6">
              <p className="text-sm text-text-muted">{selectedDay?.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
              <h3 className="text-2xl font-heading font-bold text-primary mt-1">{t("panchanga.panchangaDetails")}</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: t("panchanga.tithi"), value: selectedDayPanchanga.tithi, icon: Moon },
                { label: t("panchanga.nakshatra"), value: `${selectedDayPanchanga.nakshatra} (Pada ${selectedDayPanchanga.nakshatraPada})`, icon: Star },
                { label: t("panchanga.yoga"), value: selectedDayPanchanga.yoga, icon: Zap },
                { label: t("panchanga.karana"), value: selectedDayPanchanga.karana, icon: Clock },
                { label: t("panchanga.masa"), value: selectedDayPanchanga.masa, icon: CalendarDays },
                { label: t("panchanga.paksha"), value: selectedDayPanchanga.paksha, icon: Sun },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-bg-secondary/60 border border-border/40">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-secondary/10 to-gold-400/10">
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
            {selectedDayPanchanga.nakshatra && (
              <div className="mt-4 text-center">
                <p className="text-xs text-text-muted">{t("panchanga.basedOnNakshatra")}: {selectedDayPanchanga.nakshatra}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {selectedDayPanchanga.isEkadashi && <Badge variant="primary" size="md" dot>Ekadashi</Badge>}
              {selectedDayPanchanga.isAmavasya && <Badge variant="warning" size="md" dot>Amavasya</Badge>}
              {selectedDayPanchanga.isPournami && <Badge variant="secondary" size="md" dot>Pournami</Badge>}
            </div>
          </div>
        )}
      </Dialog>

      <div className="sticky bottom-4 sm:bottom-6 z-50 px-4 print:hidden">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto"
        >
          <div className="glass rounded-2xl px-3 py-3 sm:px-6 sm:py-4 shadow-premium border border-gold-400/20 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            <Link href="/sevas?event=today" className="shrink-0">
              <Button variant="primary" size="sm" iconLeft={<Sparkles className="h-4 w-4" />}>
                <span className="hidden sm:inline">{t("panchanga.bookTodaysSeva")}</span>
                <span className="sm:hidden">{t("panchanga.bookSeva")}</span>
              </Button>
            </Link>
            <Button variant="ghost" size="sm" iconLeft={<Download className="h-4 w-4" />} className="shrink-0" onClick={handleDownloadPdf}>
              <span className="hidden sm:inline">{t("panchanga.downloadPdf")}</span>
              <span className="sm:hidden">{t("panchanga.pdf")}</span>
            </Button>
            <Button variant="ghost" size="sm" className="shrink-0" onClick={handleShare} iconLeft={
              shareStatus === "shared" || shareStatus === "copied" ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />
            }>
              {shareStatus === "shared" ? t("panchanga.shared") : shareStatus === "copied" ? t("panchanga.linkCopied") : t("panchanga.share")}
            </Button>
            <Button variant="ghost" size="sm" iconLeft={<CalendarDays className="h-4 w-4" />} className="shrink-0" onClick={handleAddToCalendar}>
              <span className="hidden sm:inline">{t("panchanga.addToCalendar")}</span>
              <span className="sm:hidden">{t("panchanga.calendar")}</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
