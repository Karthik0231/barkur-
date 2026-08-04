"use client"

/**
 * ABOUT — Sri Kalikamba Devi Temple, Barkur
 * -----------------------------------------------------------------------
 * This replaces the old "Temple Story" section. It now shares the exact
 * token system used by Hero and Panchanga rather than an adjacent-but-
 * different set of values:
 *
 *   Parchment    #F4EFE8   ground — identical hex to Panchanga's ground,
 *                          not a Tailwind warm-ivory/gold-50 approximation
 *   Ink stone     #2A0408 / Deep maroon #4A0E14   year-tablet gradient —
 *                          the same stops as the Header medallion / Hero
 *   Brass         #B3872F, gold-300/400            rules, ribbons, plates
 *                          — one brass value used everywhere (the old file
 *                          mixed #B3872F here with #E7C87A in the Hero's
 *                          corner marks; now both read #B3872F)
 *   Ink maroon    #5B0E16   engraved rule lines — matches Panchanga
 *   Kumkum        #C1432B   single ritual accent — "Est." marker only
 *
 * Structural devices reused verbatim from the rest of the page, not
 * reinvented per-section:
 *   - RibbonLabel  (Hero / Panchanga's eyebrow banner)
 *   - CornerMark   (Hero's threshold-frame corner, Panchanga's dial ring)
 *   - RivetPlate   (Panchanga's riveted brass plaque) — used here to hold
 *     the "about" facts a temple's about section actually needs (founding
 *     era, deity, river, daily rite count) so the section has real
 *     grounding content, not just headline + timeline.
 *
 * SIGNATURE (kept, refined): the flame-trail milestone timeline — a
 * temple's history told as a lit path of brass year-tablets, each
 * carrying its own flicker. This is specific to the subject and stays;
 * only its palette now locks to the shared brass/maroon values above.
 * -----------------------------------------------------------------------
 */

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Landmark, Waves, Sparkles as SparklesIcon, Sunrise, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n"

interface MilestoneItem {
  year: string
  era: string
  label: string
  description: string
  lift: "high" | "low"
}

interface FactItem {
  icon: React.ElementType
  label: string
  value: string
  sub: string
}

const fallbackMilestones: MilestoneItem[] = [
  { year: "1200", era: "CE", label: "home.milestoneEstablishment", description: "home.milestoneEstablishmentDesc", lift: "high" },
  { year: "1500", era: "CE", label: "home.milestoneChola", description: "home.milestoneCholaDesc", lift: "low" },
  { year: "1800", era: "CE", label: "home.milestoneVijayanagara", description: "home.milestoneVijayanagaraDesc", lift: "high" },
  { year: "2024", era: "CE", label: "home.milestoneRestoration", description: "home.milestoneRestorationDesc", lift: "low" },
]

const fallbackFacts: FactItem[] = [
  { icon: Landmark, label: "foundedLabel", value: "home.factFoundedValue", sub: "home.factFoundedSub" },
  { icon: Waves, label: "siteLabel", value: "home.factSiteValue", sub: "home.factSiteSub" },
  { icon: SparklesIcon, label: "presidingDeityLabel", value: "home.factDeityValue", sub: "home.factDeitySub" },
  { icon: Sunrise, label: "dailyRitesLabel", value: "home.factRitesValue", sub: "home.factRitesSub" },
]

/** Brass banner clipped into a pennant — identical silhouette to Hero/Panchanga. */
function RibbonLabel({
  children,
  icon: Icon,
}: {
  children: React.ReactNode
  icon?: React.ElementType
}) {
  return (
    <div
      className="relative inline-flex items-center gap-2 py-2 pl-4 pr-6 bg-gradient-to-b from-gold-200 to-gold-400 text-[#2A0408] shadow-sm shadow-black/10"
      style={{ clipPath: "polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%, 8% 50%)" }}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      <span className="font-heading text-[11px] font-bold tracking-[0.14em] uppercase whitespace-nowrap">
        {children}
      </span>
    </div>
  )
}

/** Threshold-frame corner mark — same stroke value (#B3872F) as every other section's brass. */
function CornerMark({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden>
      <path d="M0 14 L0 0 L14 0" fill="none" stroke="#B3872F" strokeWidth="1" opacity="0.45" />
    </svg>
  )
}

/** Riveted brass plaque — reused verbatim from Panchanga so fact-cards read as one family. */
function RivetPlate({
  icon: Icon,
  label,
  value,
  sub,
  delay,
  isInView,
}: {
  icon: React.ElementType
  label: string
  value: string
  sub: string
  delay: number
  isInView: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-md bg-white/70 backdrop-blur-sm border border-gold-300/40 px-4 py-3.5 sm:px-5 sm:py-4"
    >
      <span className="absolute top-1.5 left-1.5 h-1 w-1 rounded-full bg-gold-400/60" />
      <span className="absolute top-1.5 right-1.5 h-1 w-1 rounded-full bg-gold-400/60" />
      <span className="absolute bottom-1.5 left-1.5 h-1 w-1 rounded-full bg-gold-400/60" />
      <span className="absolute bottom-1.5 right-1.5 h-1 w-1 rounded-full bg-gold-400/60" />
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className="h-3.5 w-3.5 text-gold-600" />
        <span className="text-[9px] uppercase tracking-[0.14em] text-dark-slate/45 font-semibold">
          {label}
        </span>
      </div>
      <p className="font-heading text-sm sm:text-[15px] font-bold text-dark-slate leading-tight">
        {value}
      </p>
      <p className="text-[10.5px] text-dark-slate/45 mt-0.5">{sub}</p>
    </motion.div>
  )
}

/** Slender brass flame marker, flicker driven by framer-motion. */
function FlameMarker({ delay }: { delay: number }) {
  return (
    <motion.svg
      width="14"
      height="22"
      viewBox="0 0 14 22"
      className="mb-2"
      style={{ transformOrigin: "50% 100%" }}
      animate={{ scaleY: [1, 1.05, 1], scaleX: [1, 0.97, 1], opacity: [0.95, 1, 0.95] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <defs>
        <linearGradient id={`about-flame-grad-${delay}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#B3872F" />
          <stop offset="55%" stopColor="#DDB25C" />
          <stop offset="100%" stopColor="#F6E2A0" />
        </linearGradient>
      </defs>
      <path d="M7 0c0 5-4 6.5-4 11.5a4 4 0 008 0C11 6.5 7 5 7 0z" fill={`url(#about-flame-grad-${delay})`} />
      <circle cx="7" cy="19" r="2.5" fill="none" stroke="#B3872F" strokeWidth="1" opacity="0.5" />
    </motion.svg>
  )
}

export function TempleStorySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })
  const { t } = useTranslation()
  const [milestones, setMilestones] = useState<MilestoneItem[]>(fallbackMilestones)
  const [facts, setFacts] = useState<FactItem[]>(fallbackFacts)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/page-content?page=about&section=history")
      .then((r) => r.json())
      .then((d) => {
        const data = d.data || d
        if (data?.milestones) {
          setMilestones(Array.isArray(data.milestones) ? data.milestones : fallbackMilestones)
        }
        if (data?.facts) {
          setFacts(Array.isArray(data.facts) ? data.facts : fallbackFacts)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 sm:py-24"
      style={{ backgroundColor: "#F4EFE8" }}
    >
      {/* radial wash — same construction as Panchanga's, so the seam between sections is invisible */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(179,135,47,0.05)_0%,_transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(91,14,22,0.02)_0%,_transparent_50%)] pointer-events-none" />

      {/* stone lattice texture — kept, it fits the subject */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='84' height='84' viewBox='0 0 84 84'%3E%3Cg fill='none' stroke='%235B0E16' stroke-width='1'%3E%3Cpath d='M42 0 L84 42 L42 84 L0 42 Z'/%3E%3Ccircle cx='42' cy='42' r='6'/%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "84px 84px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <RibbonLabel icon={Landmark}>{t("home.ourHeritage")}</RibbonLabel>

          <div className="flex items-start gap-4 sm:gap-6 mt-5 mb-5">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.05] text-dark-slate">
              {t("home.sacredLegacy")}
              <br />
              {t("home.sacredLegacyLine2")}
            </h2>

            {/* since-date marker — the section's one kumkum accent, matching Panchanga's single-accent rule */}
            <div className="hidden sm:flex flex-col items-center pt-1.5 shrink-0">
              <span className="text-[10px] tracking-[0.3em] uppercase whitespace-nowrap text-gold-600 font-semibold">
                {t("home.established")}
              </span>
              <span className="w-1.5 h-1.5 rotate-45 my-1.5 bg-[#C1432B]" />
              <span className="font-heading text-sm tracking-wide whitespace-nowrap text-[#5B0E16]">
                1200 CE
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base leading-relaxed font-light text-dark-slate/60">
            {t("home.templeHistory")}
          </p>
        </motion.div>

        {loading && (
          <div className="flex justify-center py-16">
            <span className="text-sm text-dark-slate/60">{t("common.loading")}</span>
          </div>
        )}
        {!loading && (
        <>
        <div className="mt-8 sm:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {facts.map((f, i) => (
            <RivetPlate
              key={f.label}
              icon={fallbackFacts[i % fallbackFacts.length].icon}
              label={t(`home.${f.label}`)}
              value={t(f.value)}
              sub={t(f.sub)}
              delay={0.15 + i * 0.08}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Flame-trail timeline */}
        <div className="relative mt-16 sm:mt-20">
          {/* connecting path — desktop only */}
          <svg
            className="hidden lg:block absolute left-0 right-0 top-[52px] w-full"
            height="120"
            viewBox="0 0 1000 120"
            preserveAspectRatio="none"
            fill="none"
          >
            <motion.path
              d="M40,20 C160,20 190,95 320,95 S 480,20 560,20 S 720,95 850,95 S 940,20 960,20"
              stroke="#B3872F"
              strokeWidth="2"
              strokeDasharray="3 7"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 0.5 } : {}}
              transition={{ duration: 1.4, ease: "easeInOut", delay: 0.5 }}
            />
          </svg>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className={`flex flex-col items-center text-center ${
                  m.lift === "high" ? "lg:-translate-y-3" : "lg:translate-y-6"
                }`}
              >
                <FlameMarker delay={i * 0.5} />

                {/* year tablet — same ink-stone gradient as the Header medallion / Hero */}
                <div
                  className="w-[86px] py-2.5 mb-3 flex flex-col items-center justify-center shadow-md shadow-black/20 border border-gold-300/30"
                  style={{
                    background: "linear-gradient(160deg, #4A0E14, #2A0408)",
                    clipPath:
                      "polygon(8% 0%, 92% 0%, 100% 18%, 100% 82%, 92% 100%, 8% 100%, 0% 82%, 0% 18%)",
                  }}
                >
                  <span className="font-heading text-base leading-none text-gold-200">{m.year}</span>
                  <span className="text-[9px] tracking-[0.25em] uppercase mt-0.5 text-gold-300/70">
                    {m.era}
                  </span>
                </div>

                {/* content card */}
                <div className="relative rounded-sm border-t-2 border-gold-400/50 bg-white/60 backdrop-blur-sm px-4 py-4 max-w-[230px] shadow-sm shadow-black/5">
                  <CornerMark className="absolute -top-px -left-px h-4 w-4" />
                  <CornerMark className="absolute -bottom-px -right-px h-4 w-4 -scale-x-100 -scale-y-100" />
                  <h3 className="font-heading text-sm sm:text-[15px] font-bold mb-1.5 text-dark-slate">
                    {t(m.label)}
                  </h3>
                  <p className="text-[11.5px] leading-relaxed text-dark-slate/55">
                    {t(m.description)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        </>
        )}
        {/* Closing link — same construction as Panchanga's "View Full Panchanga" line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="mt-10 sm:mt-12 flex justify-center"
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-700 hover:text-gold-600 transition-colors duration-200 group/link"
          >
            {t("home.readFullHistory")}
            <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover/link:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}