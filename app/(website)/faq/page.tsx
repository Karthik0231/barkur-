"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Search, Plus, Minus } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PageBanner } from "@/components/PageBanner"
import { useTranslation } from "@/lib/i18n"

const categories = ["All", "Visiting", "Sevas & Poojas", "Donations", "Festivals", "General"]

type FAQItem = {
  id: number
  q: string
  a: string
  category: string
}

function AccordionItem({ faq, index }: { faq: FAQItem; index: number }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.03 }}
    >
      <Card
        variant="glass"
        className={`overflow-hidden transition-all duration-300 ${open ? "shadow-md" : ""}`}
      >
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between p-5 lg:p-6 text-left"
        >
          <span className="text-base lg:text-lg font-heading font-bold text-primary pr-4">{faq.q}</span>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${open ? "bg-primary text-warm-white" : "bg-bg-secondary text-text-muted"}`}>
            {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </div>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-5 lg:px-6 pb-5 lg:pb-6">
                <div className="w-12 h-0.5 bg-secondary mb-4" />
                <p className="text-text-secondary leading-relaxed">{faq.a}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

export default function FAQPage() {
  const { t } = useTranslation()
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetch("/api/faq")
      .then((r) => r.json())
      .then((data) => {
        setFaqs(data.map((item: any) => ({
          id: item.id,
          q: item.question,
          a: item.answer,
          category: item.category,
        })))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return null

  const filtered = faqs.filter((faq) => {
    const matchesCat = activeCategory === "All" || faq.category === activeCategory
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="min-h-screen">
      <PageBanner 
        title={t("pages.faq.title")} 
        eyebrow={t("pages.faq.eyebrow")} 
        subtitle={t("pages.faq.subtitle")}
      />

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-12">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.faq")}</span>
          </div>

          <AnimatedSection>
            <SectionHeading title={t("sections.faqS1Title")} subtitle={t("sections.faqS1Sub")} />
          </AnimatedSection>

          <div className="mt-12 mb-8">
            <Input
              iconLeft={<Search className="h-4 w-4" />}
              placeholder={t("common.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary text-warm-white shadow-md"
                    : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
                }`}
              >
                {cat === "All" ? t("common.filterAll") : cat === "Visiting" ? t("sections.filterVisiting") : cat === "Sevas & Poojas" ? t("sections.filterSevas") : cat === "Donations" ? t("sections.filterDonations") : cat === "Festivals" ? t("sections.filterFestivals") : t("sections.filterGeneral")}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((faq, index) => (
              <AccordionItem key={faq.id} faq={faq} index={index} />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-text-muted text-lg">{t("common.noResults")}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
