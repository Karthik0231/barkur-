"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Bell, ArrowRight, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

const announcements = [
  {
    title: "Navaratri Pooja Schedule Announced",
    text: "The full schedule for Navaratri 2026 celebrations is now available. Nine days of sacred rituals, special alankaras, and cultural performances await devotees.",
    date: "Sep 10, 2026",
    featured: true,
  },
  {
    title: "Temple Renovation Phase II Complete",
    text: "The gopuram restoration has been completed successfully. The newly renovated structure stands as a testament to timeless craftsmanship.",
    date: "Aug 28, 2026",
  },
  {
    title: "Online Seva Booking Now Live",
    text: "Book your sevas online through the new temple portal with instant confirmation and seamless scheduling.",
    date: "Aug 15, 2026",
  },
  {
    title: "Annadanam Sponsorship Open",
    text: "Sponsor daily annadanam for devotees visiting the temple premises. A blessed opportunity to serve.",
    date: "Aug 1, 2026",
  },
]

const featured = announcements.find((a) => a.featured)!
const small = announcements.filter((a) => !a.featured)

export function AnnouncementsSection() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })
  const featuredRef = useRef<HTMLDivElement>(null)
  const featuredInView = useInView(featuredRef, { once: true, margin: "-60px" })

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-gradient-to-b from-warm-ivory to-gold-50/20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(201,168,76,0.04)_0%,_transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-100 text-gold-700 text-xs font-semibold tracking-wide mb-4 border border-gold-200/50">
            <Bell className="h-3.5 w-3.5" />
            Temple Announcements
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-dark-slate">
            Latest Updates
          </h2>
          <p className="mt-3 text-base sm:text-lg text-dark-slate/50 max-w-xl">
            Stay informed with the latest temple updates
          </p>
          <div className="mt-4 h-0.5 w-20 rounded-full bg-gradient-to-r from-primary to-gold-500" />
        </motion.div>

        <div ref={featuredRef}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={featuredInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-2xl mb-10 group cursor-pointer"
            style={{ backgroundColor: "#FAF7F1" }}
          >
            <div
              className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
              style={{
                background: "linear-gradient(to bottom, #D4AF37, #C19F30, #B8942E)",
              }}
            />
            <div className="pl-8 pr-8 py-7">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: "#5B0E16", color: "#FAF7F1" }}
                >
                  <Calendar className="h-3 w-3" />
                  {featured.date}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-100 text-gold-700 border border-gold-200">
                  Featured
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-dark-slate mb-2">
                {featured.title}
              </h3>
              <p className="text-sm sm:text-base text-dark-slate/60 leading-relaxed max-w-2xl">
                {featured.text}
              </p>
              <div className="mt-4 pt-4 border-t border-border/20">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors group/link cursor-pointer">
                  Read Full Announcement
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {small.map((item, i) => (
            <SmallCard key={item.title} item={item} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SmallCard({
  item,
  index,
  isInView,
}: {
  item: (typeof small)[number]
  index: number
  isInView: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const cardInView = useInView(cardRef, { once: true, margin: "-40px" })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={cardInView && isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="shrink-0 w-[280px] snap-start group cursor-pointer"
    >
      <div
        className="rounded-xl border border-border/30 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        style={{ backgroundColor: "#FAF7F1" }}
      >
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium mb-3"
          style={{ backgroundColor: "#5B0E16", color: "#FAF7F1" }}
        >
          <Calendar className="h-2.5 w-2.5" />
          {item.date}
        </span>
        <h3 className="text-sm font-heading font-bold text-dark-slate mb-1.5 group-hover:text-primary transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-dark-slate/60 leading-relaxed line-clamp-2">
          {item.text}
        </p>
      </div>
    </motion.div>
  )
}
