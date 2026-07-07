"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ChevronRight, X, Search, Image as ImageIcon } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Badge } from "@/components/ui/badge"

const categories = ["All", "Temple", "Pooja", "Festivals", "Events"]

const galleryItems = [
  { id: 1, title: "Temple Front View", category: "Temple" },
  { id: 2, title: "Sanctum Sanctorum", category: "Temple" },
  { id: 3, title: "Morning Abhisheka", category: "Pooja" },
  { id: 4, title: "Deeparadhana", category: "Pooja" },
  { id: 5, title: "Navaratri Celebrations", category: "Festivals" },
  { id: 6, title: "Deepavali Lights", category: "Festivals" },
  { id: 7, title: "Annual Function 2025", category: "Events" },
  { id: 8, title: "Temple Roof Architecture", category: "Temple" },
  { id: 9, title: "Mangalarati", category: "Pooja" },
  { id: 10, title: "Yugadi Celebration", category: "Festivals" },
  { id: 11, title: "Community Service Event", category: "Events" },
  { id: 12, title: "Temple Gopura Side View", category: "Temple" },
  { id: 13, title: "Alankara Decoration", category: "Pooja" },
  { id: 14, title: "Ganesha Chaturthi", category: "Festivals" },
  { id: 15, title: "Sanskrit Class", category: "Events" },
]

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedImage, setSelectedImage] = useState<(typeof galleryItems)[0] | null>(null)

  const filtered = activeCategory === "All" ? galleryItems : galleryItems.filter((item) => item.category === activeCategory)

  return (
    <div className="min-h-screen">
      <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/90 z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30 z-[1]" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <span className="inline-block text-secondary/80 text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium">
              Visual Journey
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight">
              Gallery
            </h1>
            <p className="text-warm-white/80 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              Explore the beauty of Sri Kalikamba Temple through our photo collection — from architectural marvels to spiritual moments.
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
            <span className="text-text-primary font-medium">Gallery</span>
          </div>

          <AnimatedSection>
            <SectionHeading title="Photo Gallery" subtitle="Moments of divinity captured through the lens." />
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

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
            >
              {filtered.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.03, duration: 0.4 }}
                  onClick={() => setSelectedImage(item)}
                  className="break-inside-avoid cursor-pointer group relative rounded-xl overflow-hidden border border-border bg-gradient-to-br from-primary/5 to-secondary/5"
                >
                  <div className="aspect-[4/3] flex items-center justify-center">
                    <div className="text-center p-6">
                      <ImageIcon className="h-10 w-10 mx-auto text-secondary/40 mb-2" />
                      <p className="text-sm text-text-primary font-medium">{item.title}</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Search className="h-8 w-8 text-warm-white" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge variant="primary" size="xs">{item.category}</Badge>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-3xl w-full rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="h-16 w-16 mx-auto text-secondary/40 mb-3" />
                  <h3 className="text-xl font-heading font-bold text-warm-white">{selectedImage.title}</h3>
                  <Badge variant="secondary" size="sm" className="mt-2">{selectedImage.category}</Badge>
                </div>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
