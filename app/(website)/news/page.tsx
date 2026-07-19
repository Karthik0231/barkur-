"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, Search, Calendar, ChevronLeft, ChevronDown, Newspaper } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PageBanner } from "@/components/PageBanner"
import { useTranslation } from "@/lib/i18n"

const categories = ["All", "Temple News", "Festivals", "Events", "Announcements", "Community"]

interface NewsItem {
  id: number
  title: string
  excerpt: string
  date: string
  category: string
  author: string
}

const ITEMS_PER_PAGE = 4

export default function NewsPage() {
  const { t } = useTranslation()
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((res) => {
        const news: NewsItem[] = (res.data.news || []).map(
          (item: { id: number; title: string; excerpt: string; category: string; publishedAt: string; createdAt: string }) => ({
            id: item.id,
            title: item.title,
            excerpt: item.excerpt || "",
            date: item.publishedAt || item.createdAt,
            category: item.category || "General",
            author: "Admin",
          })
        )
        setItems(news)
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = items.filter((item) => {
    const matchesCat = activeCategory === "All" || item.category === activeCategory
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen">
      <PageBanner 
        title={t("pages.news.title")} 
        eyebrow={t("pages.news.eyebrow")} 
        subtitle={t("pages.news.subtitle")}
      />

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-12">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.news")}</span>
          </div>

          <AnimatedSection>
            <SectionHeading title={t("sections.newsS1Title")} subtitle={t("sections.newsS1Sub")} />
          </AnimatedSection>

          <div className="flex flex-col sm:flex-row gap-4 mt-12 mb-8">
            <div className="flex-1">
              <Input
                iconLeft={<Search className="h-4 w-4" />}
                placeholder={t("common.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setCurrentPage(1) }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-primary text-warm-white shadow-md"
                      : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
                  }`}
                >
                  {cat === "All" ? t("common.filterAll") : cat === "Festivals" ? t("sections.filterFestivals") : cat === "Events" ? t("sections.filterEvents") : cat === "Community" ? t("sections.filterCommunity") : cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 text-text-muted">Loading...</div>
          ) : (
            <div className="space-y-6">
              {paginated.map((item, index) => (
                <AnimatedSection key={item.id} delay={index * 0.05}>
                  <Card variant="elevated" className="p-6 lg:p-8" hover>
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="w-full sm:w-56 h-36 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border flex items-center justify-center shrink-0 overflow-hidden">
                        <Newspaper className="h-10 w-10 text-secondary/30" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <div className="flex items-center gap-1.5 text-xs text-text-muted">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(item.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                          </div>
                          <Badge variant="primary" size="xs">{item.category}</Badge>
                        </div>
                        <h3 className="text-xl font-heading font-bold text-primary">{item.title}</h3>
                        <p className="text-text-secondary mt-2 leading-relaxed">{item.excerpt}</p>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                          <span className="text-xs text-text-muted">{t("common.byAuthor")}{item.author}</span>
                          <span className="text-sm text-primary font-medium hover:text-primary-light transition-colors cursor-pointer">{t("common.readMore")} →</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    currentPage === i + 1 ? "bg-primary text-warm-white shadow-md" : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
