"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Church, BookOpen, Hammer, MapPin, Users, Star } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { TEMPLE_NAME } from "@/lib/constants"

const timelineEvents = [
  {
    year: "14th Century",
    title: "Temple Establishment",
    description:
      "Sri Kalikamba Temple was established by the Vishwakarma Brahmins, a community of skilled artisans and architects. Guided by divine visions and the directions of the revered seer from Anegondi, they chose Barkur as the sacred site for the temple. The location was selected for its spiritual vibrations and natural beauty, nestled in the heart of what was then a prominent trading center.",
    icon: Church,
    details: [
      "Divine guidance from Anegondi seer",
      "Vishwakarma Brahmins as founding architects",
      "Barkur chosen for its spiritual significance",
    ],
  },
  {
    year: "14th-20th Century",
    title: "Centuries of Devotion",
    description:
      "For over 600 years, the temple has been a center of spiritual activity and community gathering. Generations of devotees have worshipped at this sacred site, maintaining the daily rituals and annual festivals with unwavering dedication. The temple survived through various dynastic rules and societal changes, standing as a constant beacon of faith.",
    icon: Users,
    details: [
      "Continuous daily worship for over 600 years",
      "Preservation of traditional rituals",
      "Community gathering and cultural center",
    ],
  },
  {
    year: "1995",
    title: "Major Renovation",
    description:
      "A comprehensive renovation project was undertaken to restore the temple to its original grandeur while preserving its unique architectural heritage. The renovation respected the original Kerala-Tulunadu style, carefully restoring the sloping terracotta-tiled roofs, wooden carvings, and the sanctum sanctorum. Modern structural reinforcements were added discreetly to ensure longevity.",
    icon: Hammer,
    details: [
      "Complete structural restoration",
      "Preservation of original architecture",
      "Modern reinforcements added discreetly",
    ],
  },
  {
    year: "1997",
    title: "Vishwa Brahmana Sanskrit Vidyapeetha",
    description:
      "The Vishwa Brahmana Sanskrit Vidyapeetha was established under the temple's auspices to promote Vedic education and Sanskrit learning. This institution has become a center for traditional scholarship, offering courses in Vedic studies, Sanskrit grammar, and Hindu philosophy. It continues to produce learned scholars who serve the community.",
    icon: BookOpen,
    details: [
      "Established for Vedic education",
      "Courses in Sanskrit and Hindu philosophy",
      "Producing learned scholars for the community",
    ],
  },
  {
    year: "Present Day",
    title: "Continuing the Legacy",
    description:
      "Today, Sri Kalikamba Temple stands as a vibrant spiritual center, serving thousands of devotees. Daily rituals are performed with strict adherence to tradition, while festivals are celebrated with great pomp and devotion. The temple continues to expand its community services and spiritual programs.",
    icon: Star,
    details: [
      "Serving thousands of devotees daily",
      "Traditional rituals and grand festivals",
      "Expanding community services",
    ],
  },
]

function TimelineCard({ event, index }: { event: typeof timelineEvents[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const Icon = event.icon
  const isLeft = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="relative mb-12 last:mb-0"
    >
      <div className={`flex flex-col md:flex-row items-start gap-6 md:gap-10 ${isLeft ? "" : "md:flex-row-reverse"}`}>
        <div className={`hidden md:flex flex-1 ${isLeft ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-lg ${isLeft ? "text-right" : "text-left"}`}>
            <span className="inline-block text-sm font-bold text-secondary tracking-[0.2em] uppercase bg-secondary/10 px-4 py-1.5 rounded-full">
              {event.year}
            </span>
            <h3 className="text-2xl font-heading font-bold text-primary mt-3">{event.title}</h3>
            <p className="text-text-secondary mt-3 leading-relaxed">{event.description}</p>
            <ul className="mt-4 space-y-2">
              {event.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center shrink-0">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg z-10">
            <Icon className="h-6 w-6 text-warm-white" />
          </div>
          <div className="w-0.5 flex-1 bg-gradient-to-b from-secondary/40 via-secondary/20 to-transparent min-h-[100px]" />
        </div>

        <div className="md:hidden w-full">
          <Card variant="glass" className="p-6 border-l-4 border-secondary">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-xs font-bold text-secondary tracking-widest uppercase">{event.year}</span>
                <h3 className="text-lg font-heading font-bold text-primary">{event.title}</h3>
              </div>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">{event.description}</p>
            <ul className="mt-3 space-y-1.5">
              {event.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-text-muted">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-secondary shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="hidden md:flex flex-1" />
      </div>
    </motion.div>
  )
}

export default function HistoryPage() {
  return (
    <div className="min-h-screen">
      <section className="relative h-[60vh] min-h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/90 z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30 z-[1]" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block text-secondary/80 text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium">
              Our Journey Through Time
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight">
              History
            </h1>
            <p className="text-warm-white/80 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              From its divine inception in the 14th century to the present day — a story of unwavering faith and devotion spanning over 600 years.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-20" />
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-12">
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/about" className="hover:text-secondary transition-colors">About</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">History</span>
          </div>

          <AnimatedSection>
            <SectionHeading
              title="Historical Timeline"
              subtitle="Trace the sacred journey of Sri Kalikamba Temple through six centuries of devotion, resilience, and spiritual service."
            />
          </AnimatedSection>

          <div className="mt-20 relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary/40 via-secondary/20 to-transparent -translate-x-1/2" />

            {timelineEvents.map((event, index) => (
              <TimelineCard key={event.year} event={event} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-bg-secondary/50 to-bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">
              Preserving Sacred Traditions
            </h2>
            <p className="text-text-secondary mt-4 text-lg leading-relaxed max-w-2xl mx-auto">
              The history of {TEMPLE_NAME} is not just a record of past events — it is a living tradition that continues to inspire and guide us today. Every ritual performed, every festival celebrated, and every devotee who walks through our doors becomes part of this continuing legacy.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/about/architecture">
                <span className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-light transition-colors">
                  Explore Architecture <ChevronRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
