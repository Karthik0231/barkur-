"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, Play, Film, Loader2 } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageBanner } from "@/components/PageBanner"
import { useTranslation } from "@/lib/i18n"

const categories = ["All", "Rituals", "Festivals", "Temple Tours", "Spiritual Talks", "Events"]

const categoryLabel: Record<string, string> = {
  POOJA: "Rituals",
  FESTIVAL: "Festivals",
  TEMPLE: "Temple Tours",
  EVENT: "Events",
  OTHER: "Spiritual Talks",
}

export default function VideosPage() {
  const { t } = useTranslation()
  const [activeCategory, setActiveCategory] = useState("All")
  const [videos, setVideos] = useState<{ id: string; title: string; category: string; videoUrl?: string | null; image?: string | null }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/gallery?type=VIDEO")
      .then((r) => r.json())
      .then((res) => {
        const items = (res.data?.gallery || []).map((d: any) => ({
          id: d.id,
          title: d.title,
          category: categoryLabel[d.category] || "Spiritual Talks",
          videoUrl: d.videoUrl,
          image: d.image,
        }))
        setVideos(items)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeCategory === "All" ? videos : videos.filter((v) => v.category === activeCategory)

  return (
    <div className="min-h-screen">
      <PageBanner 
        title={t("pages.videos.title")} 
        eyebrow={t("pages.videos.eyebrow")} 
        subtitle={t("pages.videos.subtitle")}
      />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-12">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.videos")}</span>
          </div>

          <AnimatedSection>
            <SectionHeading title={t("sections.videosS1Title")} subtitle={t("sections.videosS1Sub")} />
          </AnimatedSection>

          <div className="flex flex-wrap gap-3 justify-center mt-12 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary text-warm-white shadow-md"
                    : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
                }`}
              >
                {cat === "All" ? t("common.filterAll") : cat === "Rituals" ? t("sections.filterRituals") : cat === "Festivals" ? t("sections.filterFestivals") : cat === "Temple Tours" ? t("sections.filterTempleTours") : cat === "Spiritual Talks" ? t("sections.filterSpiritualTalks") : t("sections.filterEvents")}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-secondary" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-text-muted py-20">{t("common.noResults")}</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((video, index) => (
                <AnimatedSection key={video.id} delay={index * 0.05}>
                  <Card variant="elevated" className="overflow-hidden h-full" hover>
                    <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group cursor-pointer">
                      <Film className="h-12 w-12 text-secondary/40 group-hover:hidden transition-all" />
                      <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-secondary/90 flex items-center justify-center shadow-lg">
                          <Play className="h-7 w-7 text-primary ml-0.5" />
                        </div>
                      </div>
                      <Badge variant="primary" size="xs" className="absolute top-3 left-3">{video.category}</Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-heading font-bold text-primary">{video.title}</h3>
                    </div>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
