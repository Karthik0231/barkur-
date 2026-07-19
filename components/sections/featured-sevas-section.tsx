"use client"

/**
 * FEATURED SEVAS — Sri Kalikamba Devi Temple, Barkur (Home)
 * -----------------------------------------------------------------------
 * SIGNATURE: The Seva Ticket.
 *
 * The old version used stock-photo-style colour blocks with a hover
 * overlay button — a generic "product card" pattern with no connection
 * to what booking a seva actually feels like. In practice, a booked seva
 * gets a printed token: a serial number, a price, a time, torn at a
 * perforation. This section is built as three of those tickets — a
 * security-print guilloché texture, a dashed perforation with punched
 * notches, a serial code, and a rotated wax-stamp CTA instead of a
 * hover button.
 *
 * Palette:
 *   Ticket stock   #FBF3DF   warm cream paper (distinct from the page's
 *                            warm-ivory, so the tickets read as objects
 *                            sitting on the page, not the page itself)
 *   Ink maroon     #5B0E16   printed title ink
 *   Brass          gold-400/500   perforation, rule, serial code
 *   Kumkum seal    #C1432B   the stamp only — one accent, one place
 * -----------------------------------------------------------------------
 */

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Clock, ArrowRight, IndianRupee, Stamp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

interface SevaItem {
  id: string
  name: string
  description: string | null
  shortDescription?: string | null
  price: number
  duration?: number | null
  slug?: string
  category?: { name: string } | null
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
}

// Approximate match to the section's own background so the punched
// notches read as true cutouts rather than a mismatched patch.
const NOTCH_BG = "#F5EEDA"

function Notch({ position }: { position: "top" | "bottom" }) {
  return (
    <span
      className={cn(
        "absolute left-0 -translate-x-1/2 h-4 w-4 rounded-full border border-gold-400/25 z-10",
        position === "top" ? "-top-2" : "-bottom-2"
      )}
      style={{ backgroundColor: NOTCH_BG }}
    />
  )
}

/** Faint security-print texture, the way ticket / currency stock is engraved. */
function Guilloche({ seed }: { seed: number }) {
  const rows = Array.from({ length: 5 })
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none" aria-hidden preserveAspectRatio="none">
      {rows.map((_, i) => (
        <path
          key={i}
          d={`M -20 ${20 + i * 26 + seed} C 80 ${-10 + i * 26 + seed}, 160 ${50 + i * 26 + seed}, 260 ${10 + i * 26 + seed} S 420 ${50 + i * 26 + seed}, 520 ${10 + i * 26 + seed}`}
          fill="none"
          stroke="#5B0E16"
          strokeWidth="0.6"
        />
      ))}
    </svg>
  )
}

function formatDuration(minutes: number | null | undefined): string {
  if (!minutes) return ""
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}h ${m}m` : `${h} hours`
}

function SevaTicket({
  seva,
  index,
  featured,
  t: translate,
}: {
  seva: SevaItem
  index: number
  featured?: boolean
  t: (key: string) => string
}) {
  const serial = `SEVA · ${String(index + 1).padStart(3, "0")}`

  return (
    <motion.div variants={cardVariants} className={featured ? "sm:col-span-2" : ""}>
      <div className="group relative overflow-hidden rounded-lg bg-[#FBF3DF] border border-gold-400/30 shadow-elevated hover:shadow-xl hover:shadow-gold-500/15 hover:-translate-y-0.5 transition-all duration-500">
        <Guilloche seed={index * 7} />

        <div className="relative flex flex-col sm:flex-row">
          {/* STUB */}
          <div
            className={cn(
              "relative flex sm:flex-col items-center sm:items-start justify-between sm:justify-center gap-2 px-5 py-4 sm:py-6 border-dashed border-gold-500/40 shrink-0",
              featured ? "sm:w-44 border-b sm:border-b-0 sm:border-r" : "sm:w-36 border-b sm:border-b-0 sm:border-r"
            )}
          >
            <Notch position="top" />
            <Notch position="bottom" />

            <span className="font-mono text-[9px] tracking-[0.15em] text-[#5B0E16]/45 uppercase">
              {serial}
            </span>
            <div>
              <div className="flex items-baseline gap-0.5 text-[#5B0E16]">
                <IndianRupee className="h-3.5 w-3.5 relative top-[-2px]" />
                <span className="font-heading text-2xl font-bold tabular-nums leading-none">
                  {seva.price.toLocaleString("en-IN")}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] text-[#5B0E16]/50 uppercase tracking-wide">
                <Clock className="h-3 w-3" />
                {formatDuration(seva.duration)}
              </span>
            </div>
          </div>

          {/* MAIN */}
          <div className="flex-1 p-5 sm:p-6 flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-[0.14em] text-gold-700/70 font-semibold mb-1.5">
              {seva.category?.name || translate("sevas.ourSevas")}
            </span>
            <h3 className="font-script text-2xl sm:text-3xl text-[#5B0E16] leading-none">
              {seva.name}
            </h3>
            <p className="mt-3 text-sm text-dark-slate/60 leading-relaxed max-w-md">
              {seva.shortDescription || seva.description || ""}
            </p>

            <div className="mt-5 flex items-center gap-4">
              <Link
                href="/sevas"
                className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#C1432B]/70 text-[#C1432B] rotate-[-8deg] group-hover:rotate-0 transition-transform duration-500"
                aria-label={translate("home.bookThisSeva")}
              >
                <span className="absolute inset-1 rounded-full border border-dashed border-[#C1432B]/40" />
                <Stamp className="h-5 w-5" />
              </Link>
              <Link
                href="/sevas"
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-gold-700 hover:text-gold-800 transition-colors group/link"
              >
                {translate("home.bookThisSeva")}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function FeaturedSevasSection() {
  const { t } = useTranslation()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const [sevas, setSevas] = useState<SevaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch("/api/sevas?isFeatured=true&limit=3")
      .then((r) => r.json())
      .then((d) => {
        const list = d.data?.sevas || d.sevas || d || []
        setSevas(Array.isArray(list) ? list : [])
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section
      ref={ref}
      className="relative py-16 sm:py-20 overflow-hidden"
      style={{ backgroundColor: NOTCH_BG }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,168,67,0.05)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(91,14,22,0.03)_0%,_transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-12 sm:mb-14"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-gold-600 font-semibold mb-2">
            {t("sevas.ourSevas")}
          </span>
          <h2 className="section-heading font-script text-dark-slate leading-none">
            {t("home.sacredRituals")}
          </h2>
          <div className="mt-3 h-px w-20 bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
          <p className="mt-4 text-sm sm:text-base text-dark-slate/60 max-w-lg font-light leading-relaxed">
            {t("home.sacredRitualsSub")}
          </p>
        </motion.div>

        {loading && (
          <div className="flex justify-center py-16">
            <span className="text-sm text-dark-slate/60">{t("common.loading")}</span>
          </div>
        )}
        {error && (
          <div className="flex justify-center py-16">
            <span className="text-sm text-dark-slate/60">{t("common.error")}</span>
          </div>
        )}
        {!loading && !error && sevas.length === 0 && (
          <div className="flex justify-center py-16">
            <span className="text-sm text-dark-slate/60">{t("common.noResults")}</span>
          </div>
        )}
        {!loading && !error && sevas.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
          >
            <SevaTicket seva={sevas[0]} index={0} featured t={t} />
            {sevas[1] && <SevaTicket seva={sevas[1]} index={1} t={t} />}
            {sevas[2] && <SevaTicket seva={sevas[2]} index={2} t={t} />}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 text-center"
        >
          <Link
            href="/sevas"
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-light transition-colors"
          >
            {t("home.viewAllSacredServices")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}