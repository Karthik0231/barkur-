"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

const events = [
  {
    title: "Laksha Deepotsava",
    date: "Dec 2024",
    description:
      "The temple radiates with the glow of a hundred thousand lamps, each diya a silent prayer offered by devotees during this spectacular festival of light.",
    location: "Main Temple Premises",
  },
  {
    title: "Annual Brahmotsava",
    date: "Mar 2025",
    description:
      "The grandest of annual celebrations featuring sacred chariot processions, vedic recitations, and traditional performing arts that echo through the temple halls.",
    location: "Temple Complex",
  },
  {
    title: "Dasara Celebrations",
    date: "Oct 2025",
    description:
      "Nine nights of divine splendor with special alankaras, homas, and cultural performances dedicated to the divine mother in her resplendent forms.",
    location: "Main Shrine & Mandapa",
  },
  {
    title: "Ugadi Festival",
    date: "Mar 2025",
    description:
      "Welcoming the new year with traditional rituals, special poojas, and the preparation of panchanga — a sacred blend of six tastes symbolizing life's essence.",
    location: "Temple Courtyard",
  },
]

export function UpcomingEventsSection() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-gradient-to-b from-gold-50/20 to-warm-ivory"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.04)_0%,_transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-dark-slate">
            Upcoming Sacred Events
          </h2>
          <p className="mt-3 text-base sm:text-lg text-dark-slate/50 max-w-xl">
            Mark your calendar for divine occasions
          </p>
          <div className="mt-4 h-0.5 w-20 rounded-full bg-gradient-to-r from-primary to-gold-500" />
        </motion.div>

        <div className="relative">
          <TimelineLine isActive={isInView} />

          {events.map((event, i) => (
            <TimelineNode key={event.title} event={event} index={i} isInView={isInView} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mt-16"
        >
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-primary to-maroon-700 text-warm-ivory font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group"
          >
            <span>View All Events</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function TimelineLine({ isActive }: { isActive: boolean }) {
  return (
    <motion.div
      initial={{ scaleY: 0 }}
      animate={isActive ? { scaleY: 1 } : {}}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 origin-top bg-gradient-to-b from-gold-300/40 via-gold-500 to-gold-300/40"
      style={{ backgroundColor: "#D4AF37" }}
    />
  )
}

function TimelineNode({
  event,
  index,
  isInView,
}: {
  event: (typeof events)[number]
  index: number
  isInView: boolean
}) {
  const isLeft = index % 2 === 0
  const nodeRef = useRef<HTMLDivElement>(null)
  const nodeInView = useInView(nodeRef, { once: true, margin: "-60px" })
  const show = isInView && nodeInView

  return (
    <div ref={nodeRef} className="relative flex items-start mb-16 last:mb-0 group">
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-6 z-20">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={show ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <motion.div
            animate={show ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-4 h-4 rounded-full shadow-md cursor-pointer"
            style={{ backgroundColor: "#D4AF37" }}
          />
          <div
            className="absolute inset-0 w-4 h-4 rounded-full opacity-30"
            style={{ backgroundColor: "#D4AF37" }}
          />
        </motion.div>
      </div>

      <div className="md:hidden absolute left-6 -translate-x-1/2 top-6 z-20">
        <motion.div
          initial={{ scale: 0 }}
          animate={show ? { scale: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: "#D4AF37" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, x: isLeft ? -40 : 40, y: 20 }}
        animate={show ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "w-full md:w-[calc(50%-2.5rem)] pl-14 md:pl-0",
          isLeft ? "md:mr-auto md:pr-8" : "md:ml-auto md:pl-8",
        )}
      >
        <div
          className={cn(
            "rounded-2xl border border-border/40 p-6 transition-all duration-500 hover:shadow-xl",
            "shadow-premium",
            isLeft ? "md:text-right" : "",
          )}
          style={{ backgroundColor: "#FAF7F1" }}
        >
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide mb-3",
              "shadow-sm",
              isLeft ? "md:float-right md:ml-auto" : "",
            )}
            style={{
              backgroundColor: "#5B0E16",
              color: "#FAF7F1",
            }}
          >
            <Calendar className="h-3 w-3" />
            {event.date}
          </div>
          <div className={cn("clear-both", isLeft ? "md:text-right" : "")}>
            <h3 className="text-lg font-heading font-bold text-dark-slate mt-2">
              {event.title}
            </h3>
            <p className="mt-2 text-sm text-dark-slate/60 leading-relaxed">
              {event.description}
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-dark-slate/40">
              <MapPin className="h-3 w-3" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
