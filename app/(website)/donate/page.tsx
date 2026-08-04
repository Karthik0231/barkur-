"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, ArrowRight, ChevronRight, Loader2 } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "@/components/donation/progress-bar"
import { formatPrice } from "@/lib/utils"
import { PageBanner } from "@/components/PageBanner"
import { useTranslation } from "@/lib/i18n"

const ICON_MAP: Record<string, React.ReactNode> = {}
const COLORS = [
  "from-orange-500/20 to-amber-500/20",
  "from-primary/20 to-primary-light/20",
  "from-purple-500/20 to-pink-500/20",
  "from-green-500/20 to-emerald-500/20",
  "from-blue-500/20 to-cyan-500/20",
  "from-secondary/20 to-gold-400/20",
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

export default function DonatePage() {
  const { t } = useTranslation()
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [now] = useState(() => Date.now())

  useEffect(() => {
    fetch("/api/donations/campaigns?limit=50")
      .then((r) => r.json())
      .then((res) => { if (res.success) setCampaigns(res.data.campaigns || res.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      <PageBanner 
        title={t("donate.title")} 
        eyebrow={t("donate.eyebrow")} 
        subtitle={t("donate.subtitle")}
      />

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-10">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.donate")}</span>
          </div>

          <SectionHeading
            title={t("donate.ourCampaigns")}
            subtitle={t("donate.campaignsSubtitle")}
          />

          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
          >
            {campaigns.map((campaign, idx) => {
              const title = campaign.title || campaign.name
              const goal = Number(campaign.goalAmount || campaign.goal || 0)
              const raised = Number(campaign.collectedAmount || campaign.raised || 0)
              const color = campaign.color || COLORS[idx % COLORS.length]
              const featured = campaign.isFeatured || campaign.featured
              const donors = Number(campaign.donorCount || campaign.donors || 0)
              const endDate = campaign.endDate ? new Date(campaign.endDate) : null
              const daysLeft = endDate ? Math.ceil((endDate.getTime() - now) / (1000 * 60 * 60 * 24)) : (campaign.daysLeft || 0)
              return (
              <motion.div
                key={campaign.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { delay: idx * 0.08 } },
                }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  variant="elevated"
                  className="h-full flex flex-col group cursor-pointer overflow-hidden"
                  hover
                >
                  <div className={`relative h-44 bg-gradient-to-br ${color} flex items-center justify-center overflow-hidden`}>
                    <div className="w-16 h-16 rounded-2xl bg-white/90 dark:bg-bg-secondary/90 flex items-center justify-center shadow-lg text-primary group-hover:scale-110 transition-transform duration-300">
                      <Heart className="h-6 w-6" />
                    </div>
                    {featured && (
                      <Badge variant="secondary" size="sm" className="absolute top-3 right-3">
                        {t("donate.featured")}
                      </Badge>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-xl font-heading font-bold text-primary group-hover:text-primary-light transition-colors">
                      {title}
                    </h3>
                    <p className="text-sm text-text-secondary mt-2 leading-relaxed flex-1">
                      {campaign.shortDescription || campaign.description}
                    </p>

                    <div className="mt-4">
                      <ProgressBar
                        raised={raised}
                        goal={goal}
                        size="sm"
                      />
                    </div>

                    <div className="flex items-center justify-between mt-4 text-xs text-text-muted">
                      <span>{donors} {t("donate.donors")}</span>
                      {daysLeft > 0 ? (
                        <span className="text-secondary font-medium">{daysLeft} {t("donate.daysLeft")}</span>
                      ) : (
                        <span className="text-emerald-600 font-medium">{t("donate.ongoing")}</span>
                      )}
                    </div>

                    <div className="flex gap-3 mt-5 pt-4 border-t border-border">
                      <Link href={`/donate/${campaign.slug}`} className="flex-1">
                        <Button variant="gradient" size="sm" className="w-full">
                          <Heart className="h-3.5 w-3.5" />
                          {t("donate.donateNow")}
                        </Button>
                      </Link>
                      <Link href={`/donate/${campaign.slug}`}>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )})}
          </motion.div>
          )}
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-bg-secondary/50 to-bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-6">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">
              {t("donate.everyContribution")}
            </h2>
            <p className="text-text-secondary mt-4 max-w-2xl mx-auto leading-relaxed">
              {t("donate.contributionSub")}
            </p>
            <div className="grid sm:grid-cols-3 gap-6 mt-10">
              {[
                { value: "10,000+", label: t("donate.statsDevotees") },
                { value: "1,000+", label: t("donate.statsDonors") },
                { value: "50+", label: t("donate.statsYears") },
              ].map((stat, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-warm-white dark:bg-bg-secondary border border-border shadow-card">
                  <p className="text-3xl font-heading font-bold gradient-text">{stat.value}</p>
                  <p className="text-sm text-text-muted mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
