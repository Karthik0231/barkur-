"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Calendar, MapPin, Sparkles, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const events = [
  {
    title: "Navaratri Special Pooja",
    month: "Sep 2026",
    description: "Nine nights of divine celebrations with special alankaras, homas, and cultural performances dedicated to the divine mother.",
    icon: Sparkles,
  },
  {
    title: "Deepotsava",
    month: "Oct 2026",
    description: "Grand lamp festival illuminating the temple with thousands of diyas, accompanied by vedic chants and special rituals.",
    icon: Calendar,
  },
  {
    title: "Annual Brahmotsava",
    month: "Nov 2026",
    description: "The most significant annual festival featuring chariot processions, vedic recitations, and traditional performing arts.",
    icon: MapPin,
  },
  {
    title: "Makara Sankranthi",
    month: "Jan 2027",
    description: "Harvest festival celebrated with special poojas, traditional offerings, and community feasting at the temple premises.",
    icon: Calendar,
  },
]

export function EventsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="relative py-24 overflow-hidden bg-gradient-to-b from-gold-50/20 to-warm-ivory">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(201,168,76,0.04)_0%,_transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-dark-slate">
            Upcoming Events
          </h2>
          <p className="mt-3 text-base sm:text-lg text-dark-slate/50 max-w-xl">
            Mark your calendar for divine occasions
          </p>
          <div className="mt-4 h-0.5 w-20 rounded-full bg-gradient-to-r from-primary to-gold-500" />
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-gold-300/50 via-gold-500 to-gold-300/50" />

          {events.map((event, i) => {
            const isLeft = i % 2 === 0
            const Icon = event.icon

            return (
              <div key={event.title} className="relative flex items-start mb-16 last:mb-0">
                <div className="md:hidden absolute left-4 -translate-x-1/2 top-0 w-3 h-3 rounded-full bg-gold-500 border-2 border-warm-ivory z-10" />
                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 w-4 h-4 rounded-full bg-gold-500 border-4 border-warm-ivory shadow-md z-10" />

                <motion.div
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "w-full md:w-[calc(50%-2.5rem)] pl-10 md:pl-0",
                    isLeft ? "md:mr-auto" : "md:ml-auto",
                  )}
                >
                  <div className={cn(
                    "rounded-2xl bg-white border border-border p-6 shadow-premium transition-shadow hover:shadow-xl",
                    isLeft && "md:text-right",
                  )}>
                    <div className={cn(
                      "flex items-center gap-3 mb-3",
                      isLeft && "md:flex-row-reverse",
                    )}>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-amber-600 shadow-md">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gold-600">{event.month}</span>
                    </div>
                    <h3 className="text-lg font-heading font-bold text-dark-slate">{event.title}</h3>
                    <p className="mt-2 text-sm text-dark-slate/60 leading-relaxed">{event.description}</p>
                    <div className="mt-4 pt-4 border-t border-border/30">
                      <Link
                        href="/events"
                        className={cn(
                          "inline-flex items-center gap-1.5 text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors group",
                          isLeft && "md:flex-row-reverse",
                        )}
                      >
                        <span>Learn More</span>
                        <ArrowRight className={cn(
                          "h-3.5 w-3.5 transition-transform",
                          isLeft ? "group-hover:-translate-x-1" : "group-hover:translate-x-1",
                        )} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
