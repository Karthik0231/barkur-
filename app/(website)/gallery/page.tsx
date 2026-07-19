"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ChevronRight, X, Search, Image as ImageIcon } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Badge } from "@/components/ui/badge"
import { PageBanner } from "@/components/PageBanner"
import { useTranslation } from "@/lib/i18n"

const categoryLabels: Record<string, string> = {
  POOJA: "Pooja",
  FESTIVAL: "Festivals",
  TEMPLE: "Temple",
  EVENT: "Events",
  OTHER: "Other",
}

const categories = ["All", "Temple", "Pooja", "Festivals", "Events", "Other"]

interface GalleryItem {
  id: number
  title: string
  image: string
  category: string
}

export default function GalleryPage() {
  const { t } = useTranslation()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then((res) => {
        const gallery: GalleryItem[] = (res.data.gallery || [])
          .filter((item: { type: string }) => item.type === "IMAGE")
          .map((item: { id: number; title: string; image: string; category: string }) => ({
            id: item.id,
            title: item.title,
            image: item.image,
            category: categoryLabels[item.category] || item.category,
          }))
        setItems(gallery)
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeCategory === "All" ? items : items.filter((item) => item.category === activeCategory)

  return (
    <div className="min-h-screen">
      <PageBanner 
        title={t("pages.gallery.title")} 
        eyebrow={t("pages.gallery.eyebrow")} 
        subtitle={t("pages.gallery.subtitle")}
      />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-12">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.gallery")}</span>
          </div>

          <AnimatedSection>
            <SectionHeading title={t("sections.galleryS1Title")} subtitle={t("sections.galleryS1Sub")} />
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
                {cat === "All" ? t("common.filterAll") : cat === "Temple" ? t("sections.filterTemple") : cat === "Pooja" ? t("sections.filterPooja") : cat === "Festivals" ? t("sections.filterFestivals") : cat === "Events" ? t("sections.filterEvents") : cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20 text-text-muted">Loading...</div>
          ) : (
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
          )}
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
