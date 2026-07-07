"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Search, Plus, Minus, ChevronDown } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const categories = ["All", "Visiting", "Sevas & Poojas", "Donations", "Festivals", "General"]

const faqs = [
  {
    q: "What are the temple timings?",
    a: "The temple is open from 6:00 AM to 1:30 PM in the morning and 4:00 PM to 7:30 PM in the evening. Special extended timings apply on festival days and auspicious occasions.",
    category: "Visiting",
  },
  {
    q: "Is there an entry fee for the temple?",
    a: "No, there is no entry fee. The temple is open to all devotees free of charge. Donations are welcome and can be made at the temple office or online.",
    category: "Visiting",
  },
  {
    q: "What is the dress code for visiting the temple?",
    a: "Traditional Indian attire is preferred. Men are requested to wear dhoti or pants with a shirt. Women are requested to wear saree, salwar kameez, or churidar with dupatta. Shorts and sleeveless tops are not permitted.",
    category: "Visiting",
  },
  {
    q: "Can I book a seva or pooja online?",
    a: "Yes, you can book various sevas and poojas through our website. Visit the Sevas page to view available options and make a booking online.",
    category: "Sevas & Poojas",
  },
  {
    q: "What types of sevas are available?",
    a: "We offer various sevas including Abhisheka, Archana, Homam, Sahasranama Archana, and special poojas on festival days. Each seva has specific timings and offerings.",
    category: "Sevas & Poojas",
  },
  {
    q: "How can I make a donation to the temple?",
    a: "Donations can be made online through our website, via bank transfer, or in person at the temple office. We accept donations for general purposes, temple development, annadana, education, and specific causes.",
    category: "Donations",
  },
  {
    q: "Are donations tax-exempt?",
    a: "Donations to Sri Kalikamba Temple are eligible for tax exemption under Section 80G of the Income Tax Act. You will receive a receipt for your donation.",
    category: "Donations",
  },
  {
    q: "What are the major festivals celebrated at the temple?",
    a: "Major festivals include Navaratri, Deepavali, Yugadi, Maha Shivaratri, Ganesha Chaturthi, and the annual Brahmotsava. Each festival is celebrated with special rituals and cultural programs.",
    category: "Festivals",
  },
  {
    q: "Can I volunteer at the temple?",
    a: "Yes, we welcome volunteers! Visit our Volunteer page to register your interest. We have opportunities in event support, educational programs, annadana service, and more.",
    category: "General",
  },
  {
    q: "Is photography allowed inside the temple?",
    a: "Photography inside the sanctum sanctorum is not permitted. Photography of the temple architecture and surroundings is allowed. Please be respectful and avoid disturbing devotees during worship.",
    category: "Visiting",
  },
  {
    q: "How can I reach the temple?",
    a: "The temple is located in Barkur, about 18 km from Udupi. Regular bus services and taxis are available from Udupi and surrounding areas. The nearest railway station is Udupi, and the nearest airport is Mangalore International Airport.",
    category: "Visiting",
  },
  {
    q: "Is accommodation available near the temple?",
    a: "The temple does not have its own accommodation facilities. However, there are several hotels and guest houses available in Barkur and nearby Udupi town for devotees.",
    category: "Visiting",
  },
]

function AccordionItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
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
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = faqs.filter((faq) => {
    const matchesCat = activeCategory === "All" || faq.category === activeCategory
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="min-h-screen">
      <section className="relative h-[45vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/90 z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30 z-[1]" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <span className="inline-block text-secondary/80 text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium">
              Have Questions?
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight">
              FAQ
            </h1>
            <p className="text-warm-white/80 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              Find answers to commonly asked questions about visiting the temple, sevas, donations, festivals, and more.
            </p>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-20" />
      </section>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-12">
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">FAQ</span>
          </div>

          <AnimatedSection>
            <SectionHeading title="Frequently Asked Questions" subtitle="Everything you need to know about Sri Kalikamba Temple." />
          </AnimatedSection>

          <div className="mt-12 mb-8">
            <Input
              iconLeft={<Search className="h-4 w-4" />}
              placeholder="Search questions..."
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
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((faq, index) => (
              <AccordionItem key={faq.q} faq={faq} index={index} />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-text-muted text-lg">No questions found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
