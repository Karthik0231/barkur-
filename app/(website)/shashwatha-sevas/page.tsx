"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, ChevronRight, Infinity, Crown, Star } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { SectionHeading } from "@/components/section-heading"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn, formatPrice } from "@/lib/utils"
import { PageBanner } from "@/components/PageBanner"
import { useTranslation } from "@/lib/i18n"

const planMeta: Record<string, { icon: any; gradient: string; color: string; featured: boolean; duration: string }> = {
  NITYA_POOJA: { icon: Infinity, gradient: "from-amber-600 to-orange-700", color: "amber", featured: false, duration: "12 Months" },
  NAVARATRI: { icon: Crown, gradient: "from-purple-600 to-violet-700", color: "purple", featured: true, duration: "9 Days" },
  SONARATHI: { icon: Star, gradient: "from-gold-500 to-amber-600", color: "gold", featured: false, duration: "Per Year" },
}

export default function ShashwathaSevasPage() {
  const { t } = useTranslation()
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/sevas?limit=50&isShashwatha=true")
      .then(res => res.json())
      .then(data => {
        const mapped = (data.sevas || []).map((s: any) => {
          const type = s.shashwathaType || "NITYA_POOJA"
          const meta = planMeta[type] || planMeta.NITYA_POOJA
          return { ...s, ...meta, shashwathaType: type }
        })
        setPlans(mapped)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      <PageBanner 
        title={t("pages.shashwathaSevas.title")} 
        eyebrow={t("pages.shashwathaSevas.eyebrow")} 
        subtitle={t("pages.shashwathaSevas.subtitle")}
      />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-text-muted mb-10"
          >
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.shashwathaSevas")}</span>
          </motion.div>

          <SectionHeading
            title={t("sections.shashwathaS1Title")}
            subtitle={t("sections.shashwathaS1Sub")}
            className="mb-16"
          />

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 lg:gap-6 items-start">
              {plans.map((plan, idx) => {
                const PlanIcon = plan.icon
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.12, duration: 0.5 }}
                    className="relative"
                  >
                    {plan.featured && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                        <Badge variant="secondary" size="md" className="px-4 py-1 shadow-lg">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <Card
                      variant={plan.featured ? "elevated" : "default"}
                      padding="none"
                      className={cn(
                        "h-full overflow-hidden transition-all duration-300",
                        plan.featured && "ring-2 ring-secondary shadow-xl scale-105 md:scale-110",
                      )}
                    >
                      <div className={cn(
                        "relative h-40 bg-gradient-to-br flex items-center justify-center overflow-hidden",
                        plan.gradient,
                      )}>
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="relative z-10 text-center">
                          <PlanIcon className="h-10 w-10 text-white mx-auto mb-2" />
                          <h3 className="text-2xl font-heading font-bold text-white">{plan.name}</h3>
                          <p className="text-white/80 text-sm">{plan.shortDescription || plan.description}</p>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="text-center mb-6">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-3xl font-heading font-bold text-primary">
                              {formatPrice(Number(plan.price))}
                            </span>
                            {plan.originalPrice && (
                              <span className="text-sm text-text-muted line-through">
                                {formatPrice(Number(plan.originalPrice))}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-text-muted mt-1">for {plan.duration}</p>
                        </div>

                        <p className="text-sm text-text-secondary text-center mb-6 leading-relaxed">
                          {plan.description}
                        </p>

                        <Link href={`/shashwatha-sevas/${plan.slug}`}>
                          <Button
                            variant={plan.featured ? "gradient" : "secondary"}
                            size="lg"
                            className="w-full group/btn"
                          >
                            {t("common.subscribeNow")}
                            <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-b from-bg-secondary/50 to-bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-heading font-bold text-text-primary mb-4">
              {t("sections.shashwathaWhyTitle")}
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed">
              {t("sections.shashwathaWhyDesc")}
            </p>
            <div className="grid sm:grid-cols-3 gap-6 mt-10">
              {[
                { icon: Infinity, title: t("sections.shashwathaFeature1Title"), desc: t("sections.shashwathaFeature1Desc") },
                { icon: Crown, title: t("sections.shashwathaFeature2Title"), desc: t("sections.shashwathaFeature2Desc") },
                { icon: Star, title: t("sections.shashwathaFeature3Title"), desc: t("sections.shashwathaFeature3Desc") },
              ].map((item, idx) => {
                const ItemIcon = item.icon
                return (
                  <div key={idx} className="p-6 rounded-2xl bg-warm-white dark:bg-bg-secondary border border-border shadow-card">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4">
                      <ItemIcon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-text-primary">{item.title}</h3>
                    <p className="text-sm text-text-muted mt-2">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
