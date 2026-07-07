"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Play, Film } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const categories = ["All", "Rituals", "Festivals", "Temple Tours", "Spiritual Talks", "Events"]

const videos = [
  { id: 1, title: "Morning Abhisheka Ceremony", category: "Rituals", duration: "15:30" },
  { id: 2, title: "Navaratri Celebrations 2025", category: "Festivals", duration: "45:00" },
  { id: 3, title: "Temple Architecture Tour", category: "Temple Tours", duration: "22:15" },
  { id: 4, title: "Deeparadhana Evening Aarti", category: "Rituals", duration: "18:45" },
  { id: 5, title: "Discourse on Devi Mahatmya", category: "Spiritual Talks", duration: "60:00" },
  { id: 6, title: "Deepavali Celebrations", category: "Festivals", duration: "35:20" },
  { id: 7, title: "Vishwa Brahmana Sanskrit Vidyapeetha", category: "Temple Tours", duration: "12:30" },
  { id: 8, title: "Annual Brahmotsava Highlights", category: "Events", duration: "28:00" },
  { id: 9, title: "Maha Mangalarati", category: "Rituals", duration: "20:00" },
]

export default function VideosPage() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filtered = activeCategory === "All" ? videos : videos.filter((v) => v.category === activeCategory)

  return (
    <div className="min-h-screen">
      <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/90 z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30 z-[1]" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <span className="inline-block text-secondary/80 text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium">
              Watch & Spiritually Connect
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight">
              Videos
            </h1>
            <p className="text-warm-white/80 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              Experience the divine through our video collection — rituals, festivals, tours, and spiritual discourses.
            </p>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-20" />
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-12">
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">Videos</span>
          </div>

          <AnimatedSection>
            <SectionHeading title="Video Gallery" subtitle="Sacred moments captured on film for your spiritual enrichment." />
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
                {cat}
              </button>
            ))}
          </div>

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
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
                      {video.duration}
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
        </div>
      </section>
    </div>
  )
}
