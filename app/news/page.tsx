"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Search, Calendar, ChevronLeft, ChevronDown, Newspaper } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const categories = ["All", "Temple News", "Festivals", "Events", "Announcements", "Community"]

const newsItems = [
  { id: 1, date: "2026-06-15", title: "Annual Brahmotsava Scheduled for November", excerpt: "The temple committee has announced the dates for the annual Brahmotsava festival. Preparations are underway for the five-day grand celebration.", category: "Festivals", author: "Temple Committee" },
  { id: 2, date: "2026-06-10", title: "New Sanskrit Batch Starting August", excerpt: "Vishwa Brahmana Sanskrit Vidyapeetha is accepting applications for the new academic batch starting August 2026.", category: "Community", author: "Vidyapeetha Office" },
  { id: 3, date: "2026-06-05", title: "Temple Renovation Work Complete", excerpt: "The renovation of the temple premises including the new flooring and improved drainage system has been successfully completed.", category: "Temple News", author: "Administration" },
  { id: 4, date: "2026-05-28", title: "Navaratri Celebrations 2026", excerpt: "Detailed schedule for the upcoming Navaratri celebrations has been released. Nine days of special poojas and cultural programs planned.", category: "Festivals", author: "Events Team" },
  { id: 5, date: "2026-05-20", title: "Free Medical Camp Held at Temple", excerpt: "A free health checkup camp was organized at the temple premises in collaboration with local doctors. Over 200 devotees benefited.", category: "Events", author: "Community Service" },
  { id: 6, date: "2026-05-15", title: "Deepavali Celebrations Report", excerpt: "The Deepavali celebration at the temple was a grand success with thousands of lamps illuminating the entire complex.", category: "Festivals", author: "Events Team" },
  { id: 7, date: "2026-05-10", title: "Important: Temple Timings Update", excerpt: "Please note the revised summer timings effective from May 1st. Morning session will start at 6:00 AM.", category: "Announcements", author: "Administration" },
  { id: 8, date: "2026-05-05", title: "Donation Campaign for Temple Development", excerpt: "The temple trust has launched a new donation campaign for the development of additional facilities for devotees.", category: "Temple News", author: "Trust Board" },
]

const ITEMS_PER_PAGE = 4

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = newsItems.filter((item) => {
    const matchesCat = activeCategory === "All" || item.category === activeCategory
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen">
      <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/90 z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30 z-[1]" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <span className="inline-block text-secondary/80 text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium">
              Stay Updated
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight">
              News
            </h1>
            <p className="text-warm-white/80 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              Stay informed about the latest happenings, events, and announcements from Sri Kalikamba Temple.
            </p>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-20" />
      </section>

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-12">
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">News</span>
          </div>

          <AnimatedSection>
            <SectionHeading title="Latest News" subtitle="Updates and stories from Sri Kalikamba Temple." />
          </AnimatedSection>

          <div className="flex flex-col sm:flex-row gap-4 mt-12 mb-8">
            <div className="flex-1">
              <Input
                iconLeft={<Search className="h-4 w-4" />}
                placeholder="Search news..."
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
                  {cat}
                </button>
              ))}
            </div>
          </div>

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
                        <span className="text-xs text-text-muted">By {item.author}</span>
                        <span className="text-sm text-primary font-medium hover:text-primary-light transition-colors cursor-pointer">Read More →</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>

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
