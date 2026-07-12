"use client"

/**
 * PANCHANGA — Sri Kalikamba Devi Temple, Barkur
 * -----------------------------------------------------------------------
 * SIGNATURE: The Pancha-Anga Dial.
 *
 * "Panchanga" literally means the five limbs (pancha = five, anga = limb)
 * of the Hindu day: Vara, Tithi, Nakshatra, Yoga, Karana. That's not a
 * generic four-stat card grid waiting to happen — it's a five-spoke
 * instrument, so this section is built as one: a brass astrolabe dial
 * with today's date at the hub and the five anga arranged radially
 * around it, the way a physical panchanga plate or an observatory
 * instrument would present them.
 *
 * Palette (distinct from, but coordinated with, the site):
 *   Parchment    #F4EFE8   ground (unchanged from the rest of the page)
 *   Night indigo #1B2438   the dial's face — the one saturated risk color,
 *                          used once, for the hub only (day becomes night
 *                          at the center of the instrument)
 *   Antique brass #B3872F / gold-300/400   rings, ticks, spokes, plates
 *   Ink maroon   #5B0E16   engraved rule lines
 *   Kumkum       #C1432B   single ritual accent — Rahu Kala plate only
 *
 * Everything below the dial (inauspicious timings, darshana hours) is
 * drawn as riveted brass plaques rather than rounded cards, to carry the
 * "physical instrument" idea all the way down the section.
 * -----------------------------------------------------------------------
 */

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { Sun, Moon, Star, Sparkles, Sunrise, Clock, ArrowRight } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { TEMPLE_TIMINGS } from "@/lib/constants"
import { fetchPanchanga, type PanchangaData } from "@/lib/panchanga"

const VARA_NAMES = [
  "Ravivara",
  "Somavara",
  "Mangalavara",
  "Budhavara",
  "Guruvara",
  "Shukravara",
  "Shanivara",
]

const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

/** Polar → cartesian helper, working in a 0–100 viewBox / percentage space. */
function polar(angleDeg: number, radius: number, cx = 50, cy = 50) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
}

function RivetPlate({
  accent,
  label,
  icon: Icon,
  children,
}: {
  accent: "brass" | "kumkum"
  label: string
  icon: React.ElementType
  children: React.ReactNode
}) {
  const border = accent === "kumkum" ? "border-[#C1432B]/30" : "border-gold-300/40"
  const rivet = accent === "kumkum" ? "bg-[#C1432B]/50" : "bg-gold-400/60"
  const iconColor = accent === "kumkum" ? "text-[#C1432B]" : "text-gold-600"

  return (
    <div className={`relative rounded-md bg-white/70 backdrop-blur-sm border ${border} px-4 py-3.5 sm:px-5 sm:py-4`}>
      <span className={`absolute top-1.5 left-1.5 h-1 w-1 rounded-full ${rivet}`} />
      <span className={`absolute top-1.5 right-1.5 h-1 w-1 rounded-full ${rivet}`} />
      <span className={`absolute bottom-1.5 left-1.5 h-1 w-1 rounded-full ${rivet}`} />
      <span className={`absolute bottom-1.5 right-1.5 h-1 w-1 rounded-full ${rivet}`} />
      <div className="flex items-center gap-1.5 mb-2.5">
        <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
        <span className="text-[10px] uppercase tracking-[0.14em] text-dark-slate/45 font-semibold">
          {label}
        </span>
      </div>
      {children}
    </div>
  )
}

export function PanchangaSection() {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const [panchanga, setPanchanga] = useState<PanchangaData | null>(null)

  useEffect(() => {
    fetchPanchanga().then(setPanchanga)
  }, [])

  const now = useMemo(() => new Date(), [])
  const vara = VARA_NAMES[now.getDay()]
  const dayNum = now.getDate()
  const monthShort = MONTH_SHORT[now.getMonth()]
  const todayShort = now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  const todayDate = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  // The five anga, arranged 72° apart starting at the top and running clockwise.
  const ANGA = [
    { key: "vara", label: "Vara", icon: Sun, value: vara },
    { key: "tithi", label: "Tithi", icon: Moon, value: panchanga?.tithi },
    { key: "nakshatra", label: "Nakshatra", icon: Star, value: panchanga?.nakshatra },
    { key: "yoga", label: "Yoga", icon: Sparkles, value: panchanga?.yoga },
    { key: "karana", label: "Karana", icon: Sunrise, value: panchanga?.karana },
  ].map((item, i) => ({ ...item, angle: -90 + i * 72 }))

  // Fine ticks around the rim, every 6°, sixty of them — an instrument's calibration marks.
  const ticks = Array.from({ length: 60 }, (_, i) => i * 6)

  return (
    <section ref={ref} className="relative py-20 sm:py-28 overflow-hidden" style={{ backgroundColor: "#F4EFE8" }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.05)_0%,_transparent_55%)]" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#5B0E16]/50 font-semibold"
          >
            <span className="h-px w-6 bg-[#5B0E16]/25" />
            {todayShort}
            <span className="h-px w-6 bg-[#5B0E16]/25" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-dark-slate"
          >
            The Pancha&#8209;Anga
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-sm sm:text-base text-dark-slate/50 max-w-md font-script italic"
          >
            Five limbs of the day, read from the sky
          </motion.p>
        </div>

        {/* THE DIAL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto aspect-square w-[280px] xs:w-[320px] sm:w-[400px] lg:w-[480px]"
        >
          {/* rings, ticks, spokes */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
            <circle cx="50" cy="50" r="44" fill="none" stroke="#B3872F" strokeWidth="0.4" opacity="0.35" />
            <circle cx="50" cy="50" r="37.5" fill="none" stroke="#B3872F" strokeWidth="0.3" strokeDasharray="1.2 1.6" opacity="0.3" />
            {ticks.map((deg) => {
              const isAnchor = deg % 72 === 0
              const p1 = polar(deg - 90, isAnchor ? 40 : 42.5)
              const p2 = polar(deg - 90, 44)
              return (
                <line
                  key={deg}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#B3872F"
                  strokeWidth={isAnchor ? 0.5 : 0.25}
                  opacity={isAnchor ? 0.55 : 0.25}
                />
              )
            })}
            {ANGA.map((a) => {
              const p = polar(a.angle, 37.5)
              const c = polar(a.angle, 12.5)
              return (
                <line
                  key={a.key}
                  x1={c.x}
                  y1={c.y}
                  x2={p.x}
                  y2={p.y}
                  stroke="#B3872F"
                  strokeWidth="0.3"
                  opacity="0.4"
                />
              )
            })}
          </svg>

          {/* hub — night indigo, the dial's one bold color */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[26%] w-[26%] rounded-full flex flex-col items-center justify-center shadow-lg shadow-black/20 border-2 border-gold-300/50"
            style={{ background: "radial-gradient(circle at 35% 30%, #2A3654, #1B2438 70%)" }}
          >
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.12em] text-gold-300/70 font-semibold">
              {vara.slice(0, 3)}
            </span>
            <span className="font-heading text-xl sm:text-2xl font-bold text-gold-200 leading-none mt-0.5 tabular-nums">
              {dayNum}
            </span>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.12em] text-gold-300/70 font-semibold mt-0.5">
              {monthShort}
            </span>
          </div>

          {/* five anga nodes */}
          {ANGA.map((a, i) => {
            const pos = polar(a.angle, 44)
            return (
              <motion.div
                key={a.key}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center w-[22%] sm:w-[20%]"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <span className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-b from-gold-200 to-gold-400 border border-gold-300/60 shadow-sm shadow-black/10">
                  <a.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2A0408]" />
                </span>
                <span className="mt-1.5 text-[8px] sm:text-[9px] uppercase tracking-[0.1em] text-dark-slate/45 font-semibold">
                  {a.label}
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-dark-slate leading-tight mt-0.5 line-clamp-2">
                  {a.value ?? "—"}
                </span>
              </motion.div>
            )
          })}
        </motion.div>

        {/* PLAQUES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 sm:mt-16 grid sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto"
        >
          <RivetPlate accent="kumkum" label="Inauspicious Timings" icon={Clock}>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center">
                <p className="text-[9px] uppercase tracking-wider text-[#C1432B]/80 font-semibold">Rahu Kala</p>
                <p className="text-xs font-medium text-dark-slate mt-0.5 tabular-nums">
                  {panchanga ? `${panchanga.rahuKala.start} – ${panchanga.rahuKala.end}` : "—"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[9px] uppercase tracking-wider text-[#C1432B]/80 font-semibold">Yamaganda</p>
                <p className="text-xs font-medium text-dark-slate mt-0.5 tabular-nums">
                  {panchanga ? `${panchanga.yamaganda.start} – ${panchanga.yamaganda.end}` : "—"}
                </p>
              </div>
            </div>
          </RivetPlate>

          <RivetPlate accent="brass" label="Darshana Hours" icon={Sun}>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center">
                <p className="text-[9px] uppercase tracking-wider text-gold-700/80 font-semibold">Morning</p>
                <p className="text-xs font-medium text-dark-slate mt-0.5 tabular-nums">{TEMPLE_TIMINGS.morning}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] uppercase tracking-wider text-gold-700/80 font-semibold">Evening</p>
                <p className="text-xs font-medium text-dark-slate mt-0.5 tabular-nums">{TEMPLE_TIMINGS.evening}</p>
              </div>
            </div>
          </RivetPlate>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-8 flex justify-center"
        >
          <Link
            href="/panchanga"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-700 hover:text-gold-600 transition-colors duration-200 group/link"
          >
            {todayDate} &middot; View Full Panchanga
            <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover/link:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}