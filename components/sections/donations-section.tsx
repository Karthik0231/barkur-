"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Heart, ArrowRight } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"

function formatInLakhs(amount: number) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
  return `₹${amount}`
}

const causes = [
  {
    title: "Temple Renovation",
    gradient: "from-[#1A0205] via-[#5B0E16] to-[#3A0A10]",
    goldAccent: "from-gold-500 to-gold-300",
    borderColor: "border-gold-500/20",
    hoverGlow: "group-hover:shadow-[0_0_40px_-8px_rgba(212,175,55,0.2)]",
    goal: 10000000,
    collected: 5200000,
  },
  {
    title: "Daily Anna Dana",
    gradient: "from-[#1E1105] via-[#75572A] to-[#3A2812]",
    goldAccent: "from-gold-400 to-gold-200",
    borderColor: "border-gold-400/20",
    hoverGlow: "group-hover:shadow-[0_0_40px_-8px_rgba(212,175,55,0.15)]",
    goal: 2500000,
    collected: 1800000,
  },
  {
    title: "Festival Sponsorship",
    gradient: "from-[#140A05] via-[#7D5332] to-[#3A1E0E]",
    goldAccent: "from-gold-300 to-gold-100",
    borderColor: "border-gold-300/15",
    hoverGlow: "group-hover:shadow-[0_0_40px_-8px_rgba(212,175,55,0.12)]",
    goal: 5000000,
    collected: 2150000,
  },
]

function AnimatedProgressBar({
  collected,
  goal,
  isInView,
}: {
  collected: number
  goal: number
  isInView: boolean
}) {
  const percentage = Math.min((collected / goal) * 100, 100)

  return (
    <div className="relative h-[2px] w-full bg-white/10">
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: `${percentage}%` } : {}}
        transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-500 to-gold-300"
      />
    </div>
  )
}

function CauseCard({
  cause,
  index,
  large,
}: {
  cause: (typeof causes)[number]
  index: number
  large?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const { t } = useTranslation()
  const percentage = Math.min((cause.collected / cause.goal) * 100, 100)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.015, transition: { duration: 0.3 } }}
      className={cn(
        "group relative overflow-hidden border transition-all duration-500",
        cause.borderColor,
        cause.hoverGlow,
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br", cause.gradient)} />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(212,175,55,0.5) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          "bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_60%)]",
        )}
      />
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r opacity-60",
          cause.goldAccent,
        )}
      />

      <div className={cn("relative flex flex-col", large ? "p-10 md:p-12 min-h-[420px]" : "p-8")}>
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gold-400/70 border border-gold-400/20 font-medium">
              {t("donate.cause")}
            </span>
            <h3
              className={cn(
                "font-script text-gold-400 mt-3 leading-tight",
                large ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl",
              )}
            >
              {cause.title}
            </h3>
          </div>
          <div
            className={cn(
              "shrink-0 w-10 h-10 rounded-full border border-gold-500/20 flex items-center justify-center",
              "bg-gradient-to-br from-gold-500/10 to-transparent",
            )}
          >
            <Heart className="w-4 h-4 text-gold-400/70" />
          </div>
        </div>

        <p
          className={cn(
            "text-gold-200/50 font-light leading-relaxed mt-3",
            large ? "text-base max-w-lg" : "text-sm",
          )}
        >
          Your support keeps the sacred flame alive
        </p>

        <div className={cn("mt-auto", large ? "mt-10" : "mt-6")}>
          <div className="flex items-end justify-between mb-2">
            <span className="font-heading text-gold-400 text-lg tracking-tight">
              {formatInLakhs(cause.collected)}
            </span>
            <span className="text-[11px] text-gold-200/40 uppercase tracking-wider">
              raised of {formatInLakhs(cause.goal)}
            </span>
          </div>
          <AnimatedProgressBar
            collected={cause.collected}
            goal={cause.goal}
            isInView={isInView}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-gold-200/30 font-mono tabular-nums">
              {percentage.toFixed(0)}%
            </span>
            {percentage < 100 && (
              <span className="text-[11px] text-gold-200/30">
                ₹{(cause.goal - cause.collected).toLocaleString("en-IN")} remaining
              </span>
            )}
          </div>
        </div>

        <div className={cn("mt-auto", large ? "mt-8" : "mt-6")}>
          <Link
            href={"/donate/" + cause.title.toLowerCase().replace(/\s+/g, "-")}
            className="inline-flex items-center gap-2.5 text-sm font-medium text-gold-400 hover:text-gold-300 transition-colors group/link"
          >
            {t("donate.donateNow")}
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
          <div className="mt-3 h-px w-12 bg-gradient-to-r from-gold-500/30 to-transparent" />
        </div>
      </div>
    </motion.div>
  )
}

export function DonationsSection() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden bg-[#0D0605]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.03)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(91,14,22,0.05)_0%,transparent_50%)]" />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(212,175,55,0.3) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-16 sm:mb-20"
        >
          <h2 className="section-heading text-gold-400">
            {t("donate.supportTemple")}
          </h2>
          <div className="mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <CauseCard cause={causes[0]} index={0} large />
          </div>
          <div className="flex flex-col gap-6 lg:gap-8">
            {causes.slice(1).map((cause, index) => (
              <CauseCard key={cause.title} cause={cause} index={index + 1} />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Link
            href="/donate"
            className="group inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.2em] text-gold-500/50 hover:text-gold-400 transition-colors font-medium"
          >
            {t("donate.viewAll") || "View All Campaigns"}
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}


