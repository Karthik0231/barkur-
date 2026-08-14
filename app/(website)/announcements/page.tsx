"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, Bell, AlertTriangle, Info, Calendar, Megaphone } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageBanner } from "@/components/PageBanner"
import { useTranslation } from "@/lib/i18n"

const types = ["All", "Urgent", "Important", "General"]

const typeDisplayMap: Record<string, string> = {
  URGENT: "Urgent",
  WARNING: "Important",
  INFO: "General",
  EVENT: "General",
}

const typePriorityMap: Record<string, string> = {
  URGENT: "high",
  WARNING: "normal",
  INFO: "normal",
  EVENT: "normal",
}

export default function AnnouncementsPage() {
  const { t } = useTranslation()
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeType, setActiveType] = useState("All")

  useEffect(() => {
    fetch("/api/announcements")
      .then((r) => r.json())
      .then((data) => {
        const items = data?.data?.announcements || data || []
        setAnnouncements(items.map((item: any) => ({
          id: item.id,
          title: item.title,
          message: item.content,
          type: typeDisplayMap[item.type] || "General",
          priority: typePriorityMap[item.type] || "normal",
          date: item.createdAt,
        })))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return null

  const filtered = activeType === "All" ? announcements : announcements.filter((a) => a.type === activeType)

  return (
    <div className="min-h-screen">
      <PageBanner 
        title={t("pages.announcements.title")} 
        eyebrow={t("pages.announcements.eyebrow")} 
        subtitle={t("pages.announcements.subtitle")}
      />

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-12">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.announcements")}</span>
          </div>

          <AnimatedSection>
            <SectionHeading title={t("sections.announcementsS1Title")} subtitle={t("sections.announcementsS1Sub")} />
          </AnimatedSection>

          <div className="flex flex-wrap gap-3 justify-center mt-12 mb-10">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeType === type
                    ? "bg-primary text-warm-white shadow-md"
                    : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
                }`}
              >
                {type === "All" ? t("common.filterAll") : type === "Urgent" ? t("common.urgent") : type === "Important" ? t("common.important") : t("common.general")}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.map((item, index) => (
              <AnimatedSection key={item.id} delay={index * 0.03}>
                <Card
                  variant="elevated"
                  className={`p-6 border-l-4 ${
                    item.priority === "high" ? "border-l-red-500" : item.type === "Important" ? "border-l-amber-500" : "border-l-secondary"
                  }`}
                  hover
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      item.priority === "high" ? "bg-red-50" : item.type === "Important" ? "bg-amber-50" : "bg-primary/5"
                    }`}>
                      {item.priority === "high" ? (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      ) : item.type === "Important" ? (
                        <Info className="h-5 w-5 text-amber-600" />
                      ) : (
                        <Bell className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="text-lg font-heading font-bold text-primary">{item.title}</h3>
                        <Badge
                          variant={item.priority === "high" ? "destructive" : item.type === "Important" ? "warning" : "default"}
                          size="xs"
                        >
                          {item.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-text-muted mb-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed">{item.message}</p>
                    </div>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <Megaphone className="h-12 w-12 mx-auto text-text-muted mb-3" />
                <p className="text-text-muted">{t("common.noData")}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
