"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Bell, Info, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"

const announcements: {
  title: string
  date: string
  urgency: "high" | "medium" | "low"
  description: string
}[] = [
  {
    title: "Navaratri Mahotsava 2026 Schedule Released",
    date: "2 days ago",
    urgency: "high",
    description: "Full schedule for the upcoming Navaratri celebrations is now available. Book your sevas early.",
  },
  {
    title: "Temple Renovation Phase II Complete",
    date: "1 week ago",
    urgency: "medium",
    description: "The second phase of temple renovation including gopuram restoration has been completed.",
  },
  {
    title: "Daily Abhishekam Timings Updated",
    date: "2 weeks ago",
    urgency: "low",
    description: "Morning abhishekam timings have been updated to 7:00 AM during the winter season.",
  },
  {
    title: "Annual Dasara Celebration Details",
    date: "3 weeks ago",
    urgency: "medium",
    description: "Special arrangements for Dasara celebration including cultural programs and prasadam.",
  },
  {
    title: "New Annadanam Scheme Launched",
    date: "1 month ago",
    urgency: "low",
    description: "Sponsor daily annadanam for devotees. Check our donation campaigns for more details.",
  },
]

const newsItems = [
  {
    title: "Temple Wins Heritage Award",
    excerpt: "Sri Kalikamba Temple has been recognized for outstanding preservation of traditional architecture and cultural heritage.",
    date: "Mar 15, 2026",
    image: "from-emerald-400 to-teal-500",
    category: "Award",
  },
  {
    title: "Digital Seva Booking Launched",
    excerpt: "Devotees can now book sevas online through the new temple website. Hassle-free and instant confirmation.",
    date: "Feb 28, 2026",
    image: "from-blue-400 to-indigo-500",
    category: "Technology",
  },
  {
    title: "Annual Rathotsava a Grand Success",
    excerpt: "Thousands of devotees participated in the annual chariot festival with great devotion and enthusiasm.",
    date: "Feb 10, 2026",
    image: "from-amber-400 to-orange-500",
    category: "Festival",
  },
  {
    title: "New Veda Patashala Inaugurated",
    excerpt: "Temple trust inaugurates a new Vedic school to preserve and promote traditional Vedic education.",
    date: "Jan 20, 2026",
    image: "from-rose-400 to-pink-500",
    category: "Education",
  },
]

const urgencyColors: Record<"high" | "medium" | "low", string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-blue-500",
}

export function NewsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-gold-50/20 to-warm-ivory">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-dark-slate">
            Latest News & Announcements
          </h2>
          <p className="mt-3 text-base sm:text-lg text-dark-slate/50 max-w-xl">
            Stay informed with temple updates and spiritual insights
          </p>
          <div className="mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-primary to-gold-500" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Bell className="h-5 w-5 text-gold-500" />
              <h3 className="text-lg font-heading font-bold text-dark-slate">Announcements</h3>
            </div>
            <div className="space-y-3">
              {announcements.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.06 }}
                >
                  <div className="group rounded-xl border border-border bg-white p-4 transition-all duration-300 hover:shadow-md hover:border-gold-200/50">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1 pt-0.5">
                        <span className={cn("h-2.5 w-2.5 rounded-full", urgencyColors[item.urgency])} />
                        <span className="w-px flex-1 bg-border/30" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-semibold text-dark-slate group-hover:text-primary transition-colors">
                            {item.title}
                          </h4>
                          <span className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider",
                            item.urgency === "high" ? "bg-red-50 text-red-600 border border-red-200/50" :
                            item.urgency === "medium" ? "bg-amber-50 text-amber-600 border border-amber-200/50" :
                            "bg-blue-50 text-blue-600 border border-blue-200/50"
                          )}>
                            {item.urgency}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-dark-slate/50 line-clamp-2">{item.description}</p>
                        <span className="mt-1.5 inline-block text-[10px] text-dark-slate/40">{item.date}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4">
              <Link
                href="/announcements"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors"
              >
                View All Announcements
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Info className="h-5 w-5 text-gold-500" />
              <h3 className="text-lg font-heading font-bold text-dark-slate">News</h3>
            </div>
            <div className="space-y-4">
              {newsItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
                >
                  <div className="group flex gap-4 rounded-xl border border-border bg-white p-3 transition-all duration-300 hover:shadow-md hover:border-gold-200/50">
                    <div className={cn(
                      "relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-xl overflow-hidden bg-gradient-to-br",
                      item.image
                    )}>
                      <div className="absolute inset-0 bg-black/5" />
                      <div className="absolute bottom-1.5 left-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/80 text-dark-slate/70 border border-white/50">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 py-0.5">
                      <h4 className="text-sm font-semibold text-dark-slate group-hover:text-primary transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="mt-1 text-xs text-dark-slate/60 leading-relaxed line-clamp-2">
                        {item.excerpt}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-dark-slate/40">
                        <CalendarDays className="h-3 w-3" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4">
              <Link
                href="/news"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors"
              >
                View All News
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
