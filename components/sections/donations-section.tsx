"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Heart, ArrowRight, Landmark } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CampaignItem {
  id: string
  name: string
  description: string | null
  shortDescription?: string | null
  goalAmount: number
  collectedAmount: number
  slug?: string
}

const campaignIcons = [Landmark, Heart, Heart]

function formatInLakhs(amount: number) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
  return `₹${amount}`
}

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
    <div className="relative h-2 w-full bg-sand-200 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: `${percentage}%` } : {}}
        transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary-light to-secondary rounded-full"
      />
    </div>
  )
}

function CauseCard({
  cause,
  index,
  large,
}: {
  cause: CampaignItem
  index: number
  large?: boolean
}) {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const percentage = Math.min((cause.collectedAmount / cause.goalAmount) * 100, 100)
  const Icon = campaignIcons[index % campaignIcons.length]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.4 } }}
      className={cn(
        "group relative bg-warm-white border border-border rounded-2xl shadow-card hover:shadow-elevated transition-all duration-500 overflow-hidden",
        large ? "col-span-2" : "",
      )}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary" />

      <div className={cn("p-8", large ? "md:p-12" : "")}>
        <div className="flex items-start gap-6">
          <div className="shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center border border-border group-hover:border-secondary/30 transition-all duration-300">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
              <h3
                className={cn(
                  "font-heading text-text-primary leading-tight",
                  large ? "text-2xl md:text-3xl" : "text-xl md:text-2xl",
                )}
              >
                {cause.name}
              </h3>
              <p className="mt-3 text-text-muted leading-relaxed">
                {cause.shortDescription || cause.description || ""}
              </p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-end justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl text-primary tracking-tight">
                {formatInLakhs(cause.collectedAmount)}
              </span>
              <span className="text-sm text-text-muted">{t("donate.raised")}</span>
            </div>
            <span className="text-sm font-medium text-primary">
              {percentage.toFixed(0)}%
            </span>
          </div>
          <AnimatedProgressBar
            collected={cause.collectedAmount}
            goal={cause.goalAmount}
            isInView={isInView}
          />
          <div className="mt-3 flex items-center justify-between text-sm text-text-muted">
            <span>{t("donate.goal")}: {formatInLakhs(cause.goalAmount)}</span>
            {percentage < 100 && (
              <span>{t("donate.remaining")} ₹{(cause.goalAmount - cause.collectedAmount).toLocaleString("en-IN")}</span>
            )}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-light transition-colors group/link"
          >
            {t("donate.donateNow")}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link href={"/donate/" + (cause.name || "").toLowerCase().replace(/\s+/g, "-")}>
              {t("common.learnMore")}
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export function DonationsSection() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })
  const [causes, setCauses] = useState<CampaignItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch("/api/donations/campaigns?isActive=true&limit=3")
      .then((r) => r.json())
      .then((d) => {
        const list = d.data?.campaigns || d.campaigns || d || []
        setCauses(Array.isArray(list) ? list : [])
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden bg-sand-50"
    >
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, var(--color-dark-slate) 1px, transparent 0)",
        backgroundSize: "40px 40px"
      }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-16 sm:mb-20"
        >
          <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
            {t("donate.supportTemple")}
          </span>
          <h2 className="section-heading text-text-primary mt-3">
            {t("donate.supportTemple")}
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-text-muted">
            {t("home.supportTempleSub")}
          </p>
        </motion.div>

        {loading && (
          <div className="flex justify-center py-16">
            <span className="text-sm text-text-muted">{t("common.loading")}</span>
          </div>
        )}
        {error && (
          <div className="flex justify-center py-16">
            <span className="text-sm text-text-muted">{t("common.error")}</span>
          </div>
        )}
        {!loading && !error && causes.length === 0 && (
          <div className="flex justify-center py-16">
            <span className="text-sm text-text-muted">{t("common.noResults")}</span>
          </div>
        )}
        {!loading && !error && causes.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CauseCard cause={causes[0]} index={0} large />
            </div>
            <div className="flex flex-col gap-8">
              {causes.slice(1).map((cause, index) => (
                <CauseCard key={cause.id} cause={cause} index={index + 1} />
              ))}
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Button variant="primary" size="lg" asChild>
            <Link href="/donate">
              {t("home.viewAllCampaigns")}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}


