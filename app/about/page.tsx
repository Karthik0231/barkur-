"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Heart, Shield, Sun, BookOpen, Clock, MapPin, ChevronDown } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TEMPLE_NAME, TEMPLE_LOCATION } from "@/lib/constants"

const highlights = [
  {
    icon: Sun,
    title: "Divine Presence",
    description: "The sanctum sanctorum houses Goddess Kalikamba in Her full divine glory, radiating peace and spiritual energy.",
  },
  {
    icon: Shield,
    title: "Spiritual Protection",
    description: "Devotees seek the Goddess's blessings for protection from negative forces and spiritual upliftment.",
  },
  {
    icon: Heart,
    title: "Community Service",
    description: "The temple actively serves the community through annadana, education, and cultural programs.",
  },
  {
    icon: BookOpen,
    title: "Vedic Learning",
    description: "Home to Vishwa Brahmana Sanskrit Vidyapeetha, preserving and promoting Vedic knowledge.",
  },
]

const missionVision = [
  {
    title: "Our Mission",
    items: [
      "Preserve and propagate the ancient Vedic traditions and rituals",
      "Provide a serene spiritual environment for devotees",
      "Serve the community through charitable activities",
      "Promote cultural and educational initiatives",
    ],
    gradient: "from-primary/10 to-primary/5",
    border: "border-primary/20",
  },
  {
    title: "Our Vision",
    items: [
      "Be a beacon of spiritual enlightenment for generations to come",
      "Create a world where ancient wisdom meets modern understanding",
      "Foster unity and harmony among all communities",
      "Establish a center for Vedic research and learning",
    ],
    gradient: "from-secondary/10 to-secondary/5",
    border: "border-secondary/20",
  },
]

const facts = [
  { year: "14th Century", event: "Temple Establishment", description: "Sri Kalikamba Temple was established by Vishwakarma Brahmins following divine instructions." },
  { year: "1995", event: "Major Renovation", description: "Comprehensive renovation restored the temple to its former glory while preserving original architecture." },
  { year: "1997", event: "Sanskrit Vidyapeetha", description: "Vishwa Brahmana Sanskrit Vidyapeetha was established to promote Vedic education." },
  { year: "Present", event: "Continuing Legacy", description: "The temple continues to serve thousands of devotees with daily rituals and festivals." },
]

function TimelineEntry({ year, event, description, index }: typeof facts[0] & { index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex gap-6 items-start"
    >
      <div className="hidden md:flex flex-col items-center">
        <div className="w-5 h-5 rounded-full bg-secondary border-4 border-warm-white shadow-md z-10" />
        <div className="w-0.5 flex-1 bg-gradient-to-b from-secondary to-primary/20" />
      </div>
      <Card variant="glass" className="flex-1 p-6 md:p-8">
        <span className="text-sm font-semibold text-secondary tracking-widest uppercase">{year}</span>
        <h3 className="text-xl font-heading font-bold text-primary mt-1">{event}</h3>
        <p className="text-text-secondary mt-2 leading-relaxed">{description}</p>
      </Card>
    </motion.div>
  )
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/70 to-primary/90 z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30 z-[1]" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block text-secondary/80 text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium">
              {TEMPLE_LOCATION}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight">
              About the Temple
            </h1>
            <p className="text-warm-white/80 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              A sacred sanctuary where ancient traditions meet divine grace — discover the rich spiritual heritage of {TEMPLE_NAME}.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-20" />
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-12">
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">About</span>
          </div>

          <AnimatedSection>
            <SectionHeading
              title="Our Sacred Abode"
              subtitle="For centuries, Sri Kalikamba Temple has stood as a beacon of faith, spirituality, and architectural brilliance in the heart of Barkur."
            />
          </AnimatedSection>

          <AnimatedSection delay={0.15} className="mt-16">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4">
                        <MapPin className="h-10 w-10 text-secondary" />
                      </div>
                      <p className="text-text-muted text-sm">Temple Exterior Image</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-5">
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-primary">A Legacy of Faith</h3>
                <p className="text-text-secondary leading-relaxed">
                  Nestled in the historic town of Barkur in Udupi district, {TEMPLE_NAME} stands as a testament to centuries of unwavering devotion. The temple's architecture reflects a unique blend of Kerala and Tulunadu styles, characterized by its sloping terracotta-tiled roofs and the absence of traditional gopurams.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  The sanctum sanctorum houses the majestic idol of Goddess Kalikamba, carved from rare Neelanjana granite. Seated in padmasana, the Goddess holds a trishula, damaru, khadga, and cup, symbolizing her multifaceted divine power.
                </p>
                <div className="flex gap-4 pt-2">
                  <Link href="/about/history">
                    <Button variant="primary">Explore History</Button>
                  </Link>
                  <Link href="/about/architecture">
                    <Button variant="outline">View Architecture</Button>
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-bg-secondary/50 to-bg-primary">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <SectionHeading
              title="Mission & Vision"
              subtitle="Guided by spiritual wisdom and a commitment to community service, we strive to preserve and propagate our sacred traditions."
            />
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            {missionVision.map((item, index) => (
              <AnimatedSection key={item.title} delay={index * 0.15}>
                <Card
                  variant="elevated"
                  className={`p-8 lg:p-10 h-full border-l-4 ${item.border}`}
                  hover
                >
                  <h3 className="text-2xl font-heading font-bold text-primary mb-6">{item.title}</h3>
                  <ul className="space-y-4">
                    {item.items.map((point, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-secondary shrink-0" />
                        <span className="text-text-secondary">{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <SectionHeading
              title="Temple Highlights"
              subtitle="Experience the divine through our sacred spaces, ancient rituals, and spiritual activities."
            />
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {highlights.map((item, index) => {
              const Icon = item.icon
              return (
                <AnimatedSection key={item.title} delay={index * 0.1}>
                  <Card variant="glass" className="p-6 lg:p-8 text-center h-full" hover>
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-5">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-heading font-bold text-primary mb-3">{item.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{item.description}</p>
                  </Card>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-bg-primary to-bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <SectionHeading
              title="Key Facts Timeline"
              subtitle="The journey of Sri Kalikamba Temple through the ages."
            />
          </AnimatedSection>

          <div className="mt-16 space-y-8 md:space-y-0 md:pl-8">
            {facts.map((fact, index) => (
              <TimelineEntry key={fact.year} {...fact} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">
              Visit Our Temple
            </h2>
            <p className="text-text-secondary mt-4 text-lg leading-relaxed max-w-xl mx-auto">
              Experience the divine presence of Goddess Kalikamba. All are welcome to seek blessings and find inner peace.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/timings">
                <Button variant="primary" size="lg">View Timings</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">Get Directions</Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
