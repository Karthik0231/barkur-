"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageBanner } from "@/components/PageBanner"
import { useState, useEffect } from "react"
import { useTranslation } from "@/lib/i18n"

export default function SubDeitiesPage() {
  const [subDeities, setSubDeities] = useState<{ name: string; title: string; description: string; significance: string }[]>([])
  useEffect(() => {
    fetch("/api/sub-deities")
      .then((r) => r.json())
      .then((data) =>
        setSubDeities(
          data.map((d: any) => ({
            name: d.name,
            title: d.templeLocation,
            description: d.description,
            significance: d.significance,
          }))
        )
      )
  }, [])

  const { t } = useTranslation()
  return (
    <div className="min-h-screen">
      <PageBanner
        title={t("pages.aboutSubDeities.title")}
        subtitle={t("pages.aboutSubDeities.subtitle")}
        eyebrow={t("pages.aboutSubDeities.eyebrow")}
      />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-12">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/about" className="hover:text-secondary transition-colors">{t("nav.about")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.subDeities")}</span>
          </div>

          <AnimatedSection>
            <SectionHeading
              title={t("sections.aboutSubDeitiesS1Title")}
              subtitle={t("sections.aboutSubDeitiesS1Sub")}
            />
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-16">
            {subDeities.map((deity, index) => (
              <AnimatedSection key={deity.name} delay={index * 0.05}>
                <Card variant="elevated" className="p-6 lg:p-8 h-full text-center" hover>
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-secondary/20 flex items-center justify-center mb-4">
                    <span className="text-3xl text-secondary">◇</span>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-primary">{deity.name}</h3>
                  <p className="text-xs text-secondary font-semibold tracking-wider uppercase mt-1">{deity.title}</p>
                  <p className="text-text-secondary text-sm mt-3 leading-relaxed">{deity.description}</p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-text-muted">
                      <span className="font-semibold text-text-primary">Significance:</span> {deity.significance}
                    </p>

                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
