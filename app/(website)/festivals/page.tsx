"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, Calendar, Star } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageBanner } from "@/components/PageBanner"
import { useTranslation } from "@/lib/i18n"

function formatDate(dateStr: string) {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

export default function FestivalsPage() {
  const { t } = useTranslation()
  const [festivals, setFestivals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/festivals")
      .then((r) => r.json())
      .then((data) => {
        const items = data?.data?.festivals || data || []
        setFestivals(items.map((item: any) => {
          const highlights = typeof item.rituals === "string" ? JSON.parse(item.rituals) : (item.rituals || [])
          const desc = item.shortDescription || item.description || ""
          const duration = item.isMultiDay
            ? `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`
            : formatDate(item.date || item.startDate)
          return {
            id: item.id,
            name: item.name,
            season: item.category || "",
            duration,
            description: desc,
            significance: item.significance || "",
            highlights,
          }
        }))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return null
  return (
    <div className="min-h-screen">
      <PageBanner 
        title={t("pages.festivals.title")} 
        eyebrow={t("pages.festivals.eyebrow")} 
        subtitle={t("pages.festivals.subtitle")}
      />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-12">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.festivals")}</span>
          </div>

          <AnimatedSection>
            <SectionHeading
              title={t("sections.festivalsS1Title")}
              subtitle={t("sections.festivalsS1Sub")}
            />
          </AnimatedSection>

          <div className="space-y-8 mt-16">
            {festivals.map((festival, index) => {
              return (
                <AnimatedSection key={festival.id} delay={index * 0.05}>
                  <Card variant="elevated" className="p-6 lg:p-8 overflow-hidden relative" hover>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-secondary/5 to-transparent rounded-bl-full" />
                    <div className="flex flex-col lg:flex-row gap-6 relative z-10">
                      <div className="lg:w-64 shrink-0">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0">
                            <Star className="h-7 w-7 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl lg:text-2xl font-heading font-bold text-primary">{festival.name}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="secondary" size="xs">
                                <Calendar className="h-3 w-3 mr-1" />
                                {festival.season}
                              </Badge>
                              <Badge variant="default" size="xs">{festival.duration}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-text-secondary leading-relaxed">{festival.description}</p>
                        <div className="mt-4 p-4 bg-bg-secondary/50 rounded-xl">
                          <p className="text-sm font-medium text-primary mb-2">{t("sections.festivalsSignificanceLabel")}</p>
                          <p className="text-sm text-text-muted">{festival.significance}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {festival.highlights.map((h: string) => (
                            <Badge key={h} variant="subtle" size="sm">{h}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
