"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { Sparkles, Heart, Play, Calendar, ArrowRight } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

const MandalaDeco = ({ color }: { color: string }) => (
  <svg viewBox="0 0 80 80" className="absolute top-2 right-2 w-24 h-24 opacity-[0.07]" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="38" stroke={color} strokeWidth="0.5" />
    <circle cx="40" cy="40" r="30" stroke={color} strokeWidth="0.4" />
    <circle cx="40" cy="40" r="22" stroke={color} strokeWidth="0.3" strokeDasharray="4 3" />
    <circle cx="40" cy="40" r="14" stroke={color} strokeWidth="0.4" />
    <circle cx="40" cy="40" r="6" stroke={color} strokeWidth="0.6" />
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * 45 * Math.PI) / 180
      return (
        <line
          key={i}
          x1={40 + Math.cos(angle) * 6}
          y1={40 + Math.sin(angle) * 6}
          x2={40 + Math.cos(angle) * 38}
          y2={40 + Math.sin(angle) * 38}
          stroke={color}
          strokeWidth="0.3"
        />
      )
    })}
  </svg>
)

const GoldDivider = () => (
  <div className="flex items-center gap-2.5 my-5">
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
    <div className="w-2 h-2 rotate-45 bg-gold-400/40 shrink-0" />
    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
  </div>
)

const DotPattern = ({ color }: { color: string }) => (
  <div
    className="absolute inset-0 opacity-[0.04] pointer-events-none"
    style={{
      backgroundImage: `radial-gradient(circle at 12px 12px, ${color} 1px, transparent 1px)`,
      backgroundSize: "24px 24px",
    }}
  />
)

export function QuickActionsSection() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-warm-ivory py-[80px] md:py-[120px] lg:py-[160px]"
    >
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(42,27,21,0.03) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(91,14,22,0.02)_0%,_transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(212,175,55,0.02)_0%,_transparent_50%)] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-dark-slate">
            Quick Actions
          </h2>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500/60 to-gold-500/60" />
            <div className="h-2.5 w-2.5 rotate-45 bg-gold-500 shadow-lg shadow-gold-500/30" />
            <div className="h-px w-16 bg-gradient-to-r from-gold-500/60 via-gold-500/60 to-transparent" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
          {/* ── Book Seva ── Large, primary-focused block ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, scale: 1.008 }}
            className="md:col-span-2 lg:col-span-2 lg:row-span-2 group"
          >
            <Link href="/sevas" className="block h-full">
              <div className="relative h-full overflow-hidden rounded-2xl bg-stone-beige border border-maroon-800/10 transition-shadow duration-500 group-hover:shadow-[0_16px_48px_-12px_rgba(91,14,22,0.18)]">
                <MandalaDeco color="#5B0E16" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-maroon-800/[0.04] pointer-events-none" />

                <div className="relative h-full flex flex-col p-8 md:p-10 lg:p-12">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-maroon-800 to-maroon-700 flex items-center justify-center shadow-lg shadow-maroon-800/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2">
                      <Sparkles className="h-8 w-8 text-gold-300" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.15em] font-medium text-maroon-800/40">
                      Featured
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-maroon-800 leading-tight">
                    {t("hero.bookSeva")}
                  </h3>

                  <p className="mt-3 text-sm md:text-base text-maroon-800/60 leading-relaxed max-w-lg">
                    Reserve your participation in sacred rituals, poojas, and homas at Sri Kalikamba Temple. Choose from daily sevas, shashwatha offerings, and more.
                  </p>

                  <div className="mt-auto pt-8 flex items-center gap-2 text-maroon-800 font-medium text-sm group/link">
                    <span className="relative">
                      {t("sevas.bookNow")}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-maroon-800/40 transition-all duration-300 group-hover/link:w-full" />
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* ── Live Darshana ── Video/tech-focused block ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, scale: 1.008 }}
            className="group"
          >
            <Link href="/live" className="block h-full">
              <div className="relative h-full overflow-hidden rounded-2xl bg-stone-beige border border-dark-slate/10 transition-shadow duration-500 group-hover:shadow-[0_16px_48px_-12px_rgba(42,27,15,0.15)]">
                <DotPattern color="#2A1B15" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-slate/[0.03] pointer-events-none" />

                <div className="relative h-full flex flex-col p-6 md:p-7">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-dark-slate to-dark-slate/80 flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110">
                      <Play className="h-6 w-6 text-white ml-0.5" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 text-[9px] font-semibold uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Live
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-heading font-bold text-dark-slate leading-tight">
                    Live Darshana
                  </h3>

                  <p className="mt-2 text-sm text-dark-slate/55 leading-relaxed flex-1">
                    Experience the divine presence from anywhere with our live temple streaming.
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-dark-slate font-medium text-xs group/link">
                    <span className="relative">
                      Watch Live
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-dark-slate/40 transition-all duration-300 group-hover/link:w-full" />
                    </span>
                    <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* ── Temple Calendar ── Date-focused block ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, scale: 1.008 }}
            className="group"
          >
            <Link href="/calendar" className="block h-full">
              <div className="relative h-full overflow-hidden rounded-2xl bg-stone-beige border border-sand-400/20 transition-shadow duration-500 group-hover:shadow-[0_16px_48px_-12px_rgba(212,165,116,0.18)]">
                <DotPattern color="#D4A574" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-sand-400/[0.06] to-transparent pointer-events-none rounded-tl-full" />

                <div className="relative h-full flex flex-col p-6 md:p-7">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sand-400 to-sand-500 flex items-center justify-center shadow-md transition-transform duration-500 group-hover:scale-110">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className="text-2xl font-heading font-bold text-dark-slate">
                          {new Date().getDate()}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-dark-slate/40">
                          {new Date().toLocaleDateString("en-US", { month: "short" })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl font-heading font-bold text-dark-slate leading-tight">
                    Temple Calendar
                  </h3>

                  <p className="mt-2 text-sm text-dark-slate/55 leading-relaxed flex-1">
                    Stay informed about festivals, special poojas, and temple events throughout the year.
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-dark-slate font-medium text-xs group/link">
                    <span className="relative">
                      View Events
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-dark-slate/40 transition-all duration-300 group-hover/link:w-full" />
                    </span>
                    <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* ── Donate ── Warm, emotional block ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, scale: 1.008 }}
            className="md:col-span-2 lg:col-span-3 group"
          >
            <Link href="/donate" className="block h-full">
              <div className="relative overflow-hidden rounded-2xl bg-stone-beige border border-gold-500/15 transition-shadow duration-500 group-hover:shadow-[0_16px_48px_-12px_rgba(212,175,55,0.18)]">
                <div className="absolute inset-0 bg-gradient-to-r from-gold-500/[0.03] via-transparent to-gold-500/[0.03] pointer-events-none" />
                <div className="absolute top-0 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent pointer-events-none" />

                <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 p-8 md:p-10 lg:p-12">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500 to-amber-600 flex items-center justify-center shadow-lg shadow-gold-500/20 shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-2">
                    <Heart className="h-8 w-8 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <GoldDivider />
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-gold-800 leading-tight">
                      {t("donate.supportTemple")}
                    </h3>
                    <p className="mt-3 text-sm md:text-base text-dark-slate/55 leading-relaxed max-w-2xl">
                      Your generosity helps preserve our ancient heritage, supports daily rituals, and serves the community through annadanam and festivals.
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-gold-700 font-medium text-sm group/link">
                      <span className="relative">
                        {t("donate.donateNow")}
                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold-600/50 transition-all duration-300 group-hover/link:w-full" />
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
