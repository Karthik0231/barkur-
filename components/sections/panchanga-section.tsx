"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { Moon, Sun, Star, Sunrise, Clock, ArrowRight, Timer, Sparkles } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { TEMPLE_TIMINGS } from "@/lib/constants"
import { fetchPanchanga, type PanchangaData } from "@/lib/panchanga"

const panchangaItems = [
  { key: "tithi", icon: Timer, label: "Tithi" },
  { key: "nakshatra", icon: Star, label: "Nakshatra" },
  { key: "yoga", icon: Sun, label: "Yoga" },
  { key: "karana", icon: Sunrise, label: "Karana" },
]

function MoonPhase() {
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-24 sm:h-24">
      <defs>
        <radialGradient id="moonGlow" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#ECC85A" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ECC85A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.3" />
      <circle cx="50" cy="50" r="40" fill="#F9EFCB" />
      <circle cx="65" cy="45" r="32" fill="#F4EFE8" />
      <circle cx="68" cy="40" r="8" fill="#E0D0BC" opacity="0.3" />
      <circle cx="62" cy="55" r="5" fill="#E0D0BC" opacity="0.2" />
      <circle cx="70" cy="52" r="3" fill="#E0D0BC" opacity="0.15" />
      <circle cx="50" cy="50" r="46" fill="url(#moonGlow)" />
    </svg>
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

  const todayDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const todayShort = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  const containerVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
    }),
  }

  return (
    <section
      ref={ref}
      className="relative py-20 sm:py-28 overflow-hidden"
      style={{ backgroundColor: "#F4EFE8" }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(212,175,55,0.04)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(91,14,22,0.02)_0%,_transparent_50%)]" />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 400 400" fill="none" className="w-full h-full">
          <circle cx="200" cy="200" r="198" stroke="#D4AF37" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="160" stroke="#D4AF37" strokeWidth="0.4" strokeDasharray="6 6" />
          <circle cx="200" cy="200" r="120" stroke="#D4AF37" strokeWidth="0.3" />
          <circle cx="200" cy="200" r="80" stroke="#D4AF37" strokeWidth="0.4" strokeDasharray="4 6" />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30) * Math.PI / 180
            const x1 = 200 + Math.cos(angle) * 80
            const y1 = 200 + Math.sin(angle) * 80
            const x2 = 200 + Math.cos(angle) * 198
            const y2 = 200 + Math.sin(angle) * 198
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D4AF37" strokeWidth="0.2" opacity="0.5" />
            )
          })}
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-300/20 bg-white/60 text-gold-700 text-xs font-medium tracking-wide backdrop-blur-sm">
              <Sparkles className="h-3 w-3" />
              {todayShort}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-dark-slate"
          >
            Today&apos;s Panchanga
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 text-base text-dark-slate/50 max-w-lg font-script italic"
          >
            Celestial rhythms &mdash; aligned with the cosmos
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 h-px w-20 bg-gradient-to-r from-transparent via-gold-400 to-transparent"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-5xl"
        >
          <div className="absolute inset-0 rounded-3xl bg-white/40 backdrop-blur-xl border border-gold-300/40 shadow-[0_8px_40px_-8px_rgba(212,175,55,0.25),0_2px_8px_-2px_rgba(212,175,55,0.15)]" />

          <div className="relative grid lg:grid-cols-[1fr_2fr_1.2fr] gap-0 p-6 sm:p-8 lg:p-10">
            {/* Left: Moon + Date */}
            <div className="flex flex-col items-center lg:items-start justify-center text-center lg:text-left pb-6 lg:pb-0 lg:pr-8 border-b lg:border-b-0 lg:border-r border-gold-200/40">
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="mb-4"
              >
                <MoonPhase />
              </motion.div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-gold-600 font-medium">Today</p>
                <p className="text-sm sm:text-base font-heading font-semibold text-dark-slate mt-1 leading-snug">
                  {todayDate}
                </p>
              </div>
            </div>

            {/* Center: Panchanga 2-column grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 px-0 lg:px-8 py-6 lg:py-0 border-b lg:border-b-0 lg:border-r border-gold-200/40">
              {panchangaItems.map((item, i) => {
                const Icon = item.icon
                const value = panchanga ? (panchanga as unknown as Record<string, string>)[item.key] : null
                return (
                  <motion.div
                    key={item.key}
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-50 border border-gold-200/50 group-hover:border-gold-400/60 transition-colors duration-300">
                      <Icon className="h-4 w-4 text-gold-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.1em] text-dark-slate/40 font-medium">
                        {item.label}
                      </p>
                      <p className="text-sm font-medium text-dark-slate truncate">
                        {value ?? "—"}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Right: Timings + Link */}
            <div className="flex flex-col justify-between px-0 lg:pl-8 pt-6 lg:pt-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-gold-600" />
                  <span className="text-[10px] uppercase tracking-[0.12em] text-dark-slate/40 font-medium">
                    Inauspicious Timings
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-red-50/50 border border-red-200/20 text-center">
                    <p className="text-[9px] uppercase tracking-wider text-red-500 font-semibold">Rahu Kala</p>
                    <p className="text-xs font-medium text-dark-slate mt-0.5">
                      {panchanga ? `${panchanga.rahuKala.start} - ${panchanga.rahuKala.end}` : "—"}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-200/20 text-center">
                    <p className="text-[9px] uppercase tracking-wider text-amber-600 font-semibold">Yamaganda</p>
                    <p className="text-xs font-medium text-dark-slate mt-0.5">
                      {panchanga ? `${panchanga.yamaganda.start} - ${panchanga.yamaganda.end}` : "—"}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-4 pt-4 border-t border-gold-200/40"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="h-3.5 w-3.5 text-gold-600" />
                  <span className="text-[10px] uppercase tracking-[0.12em] text-dark-slate/40 font-medium">
                    Temple Timings
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-dark-slate/50">Morning</span>
                    <span className="font-medium text-dark-slate">{TEMPLE_TIMINGS.morning}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-dark-slate/50">Evening</span>
                    <span className="font-medium text-dark-slate">{TEMPLE_TIMINGS.evening}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="mt-4"
              >
                <Link
                  href="/panchanga"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-700 hover:text-gold-600 transition-colors duration-200 group/link"
                >
                  View Full Panchanga
                  <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover/link:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
