"use client"

/**
 * HERO — Sri Kalikamba Devi Temple, Barkur
 * -----------------------------------------------------------------------
 * Rebuilt to match the approved reference composition:
 *   - Left rail: a live "Seva Timeline" ledger floating over the deity image
 *   - Center: eyebrow / headline / copy / a row of ribbon-cut CTAs
 *   - Right rail: two brass ribbon-headed cards (Darshana Hours, Panchanga)
 *   - A slim bottom dock for the four primary destinations
 *
 * Design tokens (unchanged from the temple system):
 * Ink stone     #2A0408   base ground
 * Deep maroon   #4A0E14   gradient depth
 * Dusk indigo   #150A12   far depth / frame background
 * Brass / gold  gold-200/300 (existing tokens) — rules, ribbons, kalasha
 * Warm white    warm-white (existing token) — body copy
 * Kumkum        #C1432B   single sharp ritual accent, used sparingly
 *
 * Signature elements:
 *   1. RibbonLabel — a brass banner clipped into a pennant, used for every
 *      "header" tag (Seva Timeline, Darshana Hours, Today's Panchanga) so
 *      the whole hero reads like it's hung with temple flags.
 *   2. RibbonButton — CTAs are cut the same way, tying action back to motif.
 *   3. Everything sits inside the existing threshold frame; the two rails
 *      are real flow children (not absolutely positioned), so they stack
 *      cleanly under the center column on mobile instead of colliding.
 * -----------------------------------------------------------------------
 */

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import {
  Calendar,
  Sun,
  Moon,
  Clock,
  ArrowRight,
  Flame,
  Heart,
  Home as HomeIcon,
  PartyPopper,
  Sparkles,
  PlayCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"
import bannerimage from "@/components/sections/image.png"
import type { DailySchedule } from "@prisma/client"

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
})

function CornerMark({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden>
      <path d="M0 14 L0 0 L14 0" fill="none" stroke="#E7C87A" strokeWidth="1" opacity="0.5" />
    </svg>
  )
}

/** A brass banner clipped into a pennant — the hero's recurring motif. */
function RibbonLabel({
  children,
  icon: Icon,
  className = "",
}: {
  children: React.ReactNode
  icon?: React.ElementType
  className?: string
}) {
  return (
    <div
      className={`relative inline-flex items-center gap-2 py-2 pl-4 pr-6 bg-gradient-to-b from-gold-200 to-gold-400 text-[#2A0408] ${className}`}
      style={{
        clipPath:
          "polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%, 8% 50%)",
      }}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      <span className="font-heading text-[11px] font-bold tracking-[0.14em] uppercase whitespace-nowrap">
        {children}
      </span>
    </div>
  )
}

/** Ribbon-cut CTA — same silhouette as RibbonLabel, sized for buttons. */
function RibbonButton({
  href,
  children,
  icon: Icon,
  tone = "solid",
  live = false,
}: {
  href: string
  children: React.ReactNode
  icon?: React.ElementType
  tone?: "solid" | "outline" | "ghost"
  live?: boolean
}) {
  const toneClasses =
    tone === "solid"
      ? "bg-gradient-to-b from-[#C1432B] to-[#8F2E1B] text-warm-white"
      : tone === "outline"
        ? "bg-gradient-to-b from-gold-200 to-gold-400 text-[#2A0408]"
        : "bg-[#2A0408]/70 text-warm-white border border-gold-300/30"

  return (
    <Link href={href} className="inline-flex">
      <span
        className={`relative inline-flex items-center gap-2 py-3 pl-5 pr-7 text-sm font-semibold tracking-wide shadow-lg shadow-black/30 transition-transform duration-200 hover:-translate-y-0.5 ${toneClasses}`}
        style={{
          clipPath: "polygon(0 0, 100% 0, 94% 50%, 100% 100%, 0 100%, 6% 50%)",
        }}
      >
        {live && (
          <span className="relative flex h-2 w-2 -ml-1">
            <span className="absolute inline-flex h-full w-full rounded-full bg-current opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
          </span>
        )}
        {Icon && !live && <Icon className="h-4 w-4 shrink-0" />}
        {children}
      </span>
    </Link>
  )
}

const DOCK_ITEMS = [
  { icon: HomeIcon, key: "nav.home", href: "/" },
  { icon: PartyPopper, key: "nav.festivals", href: "/festivals" },
  { icon: Calendar, key: "nav.panchanga", href: "/panchanga" },
  { icon: Sparkles, key: "nav.sevas", href: "/sevas" },
]

interface PanchangaData {
  tithi: string; nakshatra: string; yoga: string; karana: string
  sunrise: string; sunset: string; rahuKala: { start: string; end: string }
  yamaganda: { start: string; end: string }; gulika: { start: string; end: string }
}

export function HeroSection({ dailySchedules }: { dailySchedules: DailySchedule[] }) {
  const [panchanga, setPanchanga] = useState<PanchangaData | null>(null)
  const [todaySchedules, setTodaySchedules] = useState<DailySchedule[]>([])
  const [timings, setTimings] = useState({ morning: "6:00 AM - 1:30 PM", evening: "4:00 PM - 7:30 PM" })
  const { t } = useTranslation()

  useEffect(() => {
    fetch("/api/panchanga?today=true").then(r => r.json()).then(d => {
      const p = d.data?.panchanga || d.panchanga || d
      if (p.tithi) setPanchanga(p)
    }).catch(() => {})
    fetch("/api/settings?group=temple").then(r => r.json()).then(d => {
      const s = d.data?.settings || d.settings || []
      const morning = s.find((x: {key: string}) => x.key === "timings_morning")?.value
      const evening = s.find((x: {key: string}) => x.key === "timings_evening")?.value
      if (morning || evening) setTimings({ morning: morning || timings.morning, evening: evening || timings.evening })
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 is Sunday, 1 is Monday...
    const todaySched = dailySchedules.filter(s => s.dayOfWeek === dayOfWeek)
    if (todaySched.length === 0) {
      const defaultSched = dailySchedules.filter(s => s.dayOfWeek === 1) // Monday as fallback
      setTodaySchedules(defaultSched)
    } else {
      setTodaySchedules(todaySched)
    }
  }, [dailySchedules])

  const getIconForTitle = (title: string) => {
    const lower = title.toLowerCase()
    if (lower.includes("puja") || lower.includes("pooja")) return Flame
    if (lower.includes("alankara")) return Sparkles
    if (lower.includes("aarti") || lower.includes("arati")) return Heart
    return Sun
  }

  return (
    <section className="relative min-h-screen bg-[#150A12] pt-[44px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image src={bannerimage} alt="Temple Background" className="w-full h-full object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-br from-[#4A0E14]/70 via-[#2A0408]/55 to-[#150A12]/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#150A12] via-transparent to-[#150A12]/40" />
      </div>
      <div
        className="absolute right-0 top-0 h-full w-1/2 opacity-[0.22] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(closest-side, #E7C87A, transparent 70%)" }}
      />

      {/* Fine stone-grain texture */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none mix-blend-overlay" aria-hidden>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* Threshold frame */}
      <div className="absolute inset-x-4 sm:inset-x-8 lg:inset-x-10 top-[100px] bottom-6 border border-gold-300/10 pointer-events-none hidden md:block">
        <CornerMark className="absolute -top-px -left-px h-6 w-6" />
        <CornerMark className="absolute -top-px -right-px h-6 w-6 -scale-x-100" />
        <CornerMark className="absolute -bottom-px -left-px h-6 w-6 -scale-y-100" />
        <CornerMark className="absolute -bottom-px -right-px h-6 w-6 -scale-x-100 -scale-y-100" />
      </div>

      {/* Content grid: rail / center / rail */}
      <div className="relative z-10 container mx-auto min-h-[calc(100vh-44px)] px-4 sm:px-8 lg:px-12 py-10 sm:py-16 pb-24 lg:pb-16 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-[15rem_1fr_16rem] gap-8 lg:gap-6 w-full items-center">
          {/* LEFT RAIL — Seva Timeline */}
          <motion.aside {...fadeUp(0.1)} className="order-2 lg:order-1">
            <RibbonLabel icon={Clock}>{t("home.sevaTimeline")}</RibbonLabel>
            <div className="mt-3 bg-[#2A0408]/70 backdrop-blur-sm border border-gold-300/15 max-h-64 lg:max-h-[26rem] overflow-y-auto">
              <ul className="divide-y divide-gold-300/10">
                {todaySchedules.length > 0 ? (
                  todaySchedules.map((item, i) => {
                    const Icon = getIconForTitle(item.title)
                    return (
                      <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-300/30 text-gold-300">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs font-medium text-warm-white/85 truncate">
                            {item.title}
                          </span>
                          <span className="block text-[11px] text-gold-300/60 tabular-nums">
                            {item.startTime && item.endTime ? `${item.startTime} - ${item.endTime}` : item.startTime || item.endTime || ""}
                          </span>
                        </span>
                      </li>
                    )
                  })
                ) : (
                  <li className="px-4 py-8 text-center text-sm text-warm-white/50">
                    {t("home.noSevasToday")}
                  </li>
                )}
              </ul>
            </div>
          </motion.aside>

          {/* CENTER — editorial content */}
          <div className="order-1 lg:order-2 flex flex-col items-start lg:items-center text-left lg:text-center px-0 lg:px-4">
            <motion.div {...fadeUp(0)} className="flex items-center gap-2.5 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C1432B]" />
              <span className="text-[11px] sm:text-xs text-gold-300/60 font-medium tracking-[0.28em] uppercase">
                {t("common.barkurLocation")}
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.12)}
              className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight text-warm-white"
            >
              Shri Kalikamba Temple
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-300 to-[#E7C87A]">
                Barkur
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.26)}
              className="mt-6 max-w-md text-base text-warm-white/60 font-light leading-relaxed"
            >
              {t("home.heroSubtitle")}
            </motion.p>

            <motion.div
              {...fadeUp(0.4)}
              className="mt-8 flex flex-wrap items-center gap-3 justify-start lg:justify-center"
            >
              <RibbonButton href="/sevas" icon={Calendar} tone="solid">
                {t("hero.bookSeva")}
              </RibbonButton>
              <RibbonButton href="/donate" icon={Heart} tone="outline">
                {t("hero.donate")}
              </RibbonButton>
              <RibbonButton href="/sevas" tone="ghost" live>
                {t("hero.liveDarshana")}
              </RibbonButton>
              <RibbonButton href="/donate" icon={PlayCircle} tone="outline">
                {t("hero.donate")}
              </RibbonButton>
            </motion.div>
          </div>

          {/* RIGHT RAIL — Darshana Hours + Panchanga */}
          <motion.aside {...fadeUp(0.3)} className="order-3 space-y-4">
            <div>
              <RibbonLabel icon={Clock}>{t("home.darshanaHours")}</RibbonLabel>
              <div className="mt-3 border border-gold-300/15 bg-[#2A0408]/70 backdrop-blur-sm p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-gold-300/50 mb-1">
                      <Sun className="h-3 w-3" />
                      <span className="text-[10px] tracking-[0.1em] uppercase">{t("timings.morning")}</span>
                    </div>
                    <span className="font-heading text-sm text-warm-white/90 tabular-nums">
                      {timings.morning}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-gold-300/50 mb-1">
                      <Moon className="h-3 w-3" />
                      <span className="text-[10px] tracking-[0.1em] uppercase">{t("timings.evening")}</span>
                    </div>
                    <span className="font-heading text-sm text-warm-white/90 tabular-nums">
                      {timings.evening}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <RibbonLabel icon={Calendar}>{t("home.todaysPanchanga")}</RibbonLabel>
              <div className="mt-3 border border-gold-300/15 bg-[#2A0408]/70 backdrop-blur-sm p-5">
                {!panchanga ? (
                  <div className="space-y-2">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="h-3 bg-white/5 rounded-sm animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-warm-white/40">{t("home.tithi")}</span>
                      <span className="text-xs font-medium text-warm-white/85">{panchanga.tithi}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-warm-white/40">{t("home.nakshatra")}</span>
                      <span className="text-xs font-medium text-warm-white/85">{panchanga.nakshatra}</span>
                    </div>
                  </div>
                )}
                <Link
                  href="/panchanga"
                  className="inline-flex items-center gap-1.5 text-xs text-gold-300 hover:text-gold-200 transition-colors mt-4 group"
                >
                  {t("home.viewFullPanchanga")}
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* BOTTOM DOCK — quick destinations, fixed within the hero on all sizes */}
      <motion.nav
        {...fadeUp(0.5)}
        className="absolute bottom-0 inset-x-0 z-20 bg-[#150A12]/90 backdrop-blur-md border-t border-gold-300/15"
      >
        <ul className="container mx-auto flex items-stretch justify-around px-4">
          {DOCK_ITEMS.map((item) => (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className="flex flex-col items-center gap-1 py-3 text-warm-white/60 hover:text-gold-300 transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span className="text-[10px] tracking-[0.08em] uppercase">{t(item.key)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </motion.nav>
    </section>
  )
}
