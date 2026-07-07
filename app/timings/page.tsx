"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Clock, Sun, Moon, Sunrise, Sunset, Calendar, Bell } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TEMPLE_NAME, TEMPLE_TIMINGS } from "@/lib/constants"

const dailyPoojas = [
  { time: "6:00 AM", name: "Nada Darshana", description: "Opening of the sanctum sanctorum and first darshana of the day" },
  { time: "6:30 AM", name: "Mangalarati", description: "Morning auspicious arati with lamps and chanting" },
  { time: "7:00 AM", name: "Abhisheka", description: "Sacred bathing of the deity with milk, curd, honey, and holy water" },
  { time: "8:00 AM", name: "Alankara", description: "Decorating the deity with flowers, ornaments, and silk garments" },
  { time: "9:00 AM", name: "Maha Pooja", description: "Grand worship ceremony with offerings and mantra chanting" },
  { time: "12:00 PM", name: "Rajopachara Pooja", description: "Royal worship service with sixteen forms of offerings" },
  { time: "12:30 PM", name: "Madhyahna Arati", description: "Midday arati before the temple closes for the afternoon" },
  { time: "1:00 PM", name: "Temple Closes (Afternoon)", description: "Temple closes for the midday break" },
  { time: "4:00 PM", name: "Temple Reopens", description: "Evening session begins" },
  { time: "4:30 PM", name: "Evening Abhisheka", description: "Evening sacred bath of the deity" },
  { time: "6:00 PM", name: "Deeparadhana", description: "Evening lamp offering with camphor and lamps" },
  { time: "7:00 PM", name: "Maha Mangalarati", description: "Grand closing arati with bhajans and devotional singing" },
  { time: "7:30 PM", name: "Temple Closes", description: "Temple closes for the day" },
]

const weeklySchedule = [
  { day: "Monday", special: "Somavara Vrata", description: "Special abhisheka and offerings to Lord Shiva" },
  { day: "Tuesday", special: "Mangalavara Pooja", description: "Special poojas for Goddess Kalikamba" },
  { day: "Wednesday", special: "Sukravar Pooja", description: "Saraswati pooja and educational blessings" },
  { day: "Thursday", special: "Guruvar Pooja", description: "Special poojas for spiritual teachers and guidance" },
  { day: "Friday", special: "Shukravar Maha Pooja", description: "Grand pooja for prosperity and wealth" },
  { day: "Saturday", special: "Shanivar Pooja", description: "Special offerings to Shani and Navagrahas" },
  { day: "Sunday", special: "Bhanuvar Pooja", description: "Surya namaskara and special Sunday poojas" },
]

const specialDays = [
  { name: "Purnima (Full Moon)", timings: "6:00 AM - 8:00 PM", description: "Extended timings on full moon days" },
  { name: "Amavasya (New Moon)", timings: "6:00 AM - 7:30 PM", description: "Special rituals for ancestors on new moon" },
  { name: "Ekadashi", timings: "5:30 AM - 7:30 PM", description: "Early opening on Ekadashi days" },
  { name: "Festival Days", timings: "5:00 AM - 9:00 PM", description: "Extended hours during major festivals" },
  { name: "Navaratri", timings: "5:00 AM - 10:00 PM", description: "Special extended schedule during Navaratri" },
]

function PoojaCard({ pooja, index }: { pooja: typeof dailyPoojas[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start gap-4 p-4 rounded-xl hover:bg-bg-secondary/50 transition-colors group"
    >
      <div className="w-20 shrink-0 text-right">
        <span className="text-sm font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-lg group-hover:bg-primary/10 transition-colors">
          {pooja.time}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-heading font-bold text-primary">{pooja.name}</h4>
        <p className="text-sm text-text-muted mt-0.5">{pooja.description}</p>
      </div>
    </motion.div>
  )
}

export default function TimingsPage() {
  return (
    <div className="min-h-screen">
      <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/90 z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30 z-[1]" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <span className="inline-block text-secondary/80 text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium">
              Plan Your Visit
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight">
              Temple Timings
            </h1>
            <p className="text-warm-white/80 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              Plan your visit to {TEMPLE_NAME}. The temple welcomes devotees twice daily with a complete schedule of sacred rituals.
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
            <span className="text-text-primary font-medium">Timings</span>
          </div>

          <AnimatedSection>
            <SectionHeading
              title="Daily Schedule"
              subtitle="The temple follows a traditional daily schedule with two sessions — morning and evening."
            />
          </AnimatedSection>

          <div className="grid lg:grid-cols-5 gap-8 mt-16">
            <div className="lg:col-span-3">
              <Card variant="elevated" className="p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-primary">Daily Pooja Schedule</h3>
                </div>
                <div className="space-y-0.5">
                  {dailyPoojas.map((pooja, index) => (
                    <PoojaCard key={pooja.name} pooja={pooja} index={index} />
                  ))}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card variant="glass" className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <Sun className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold text-primary">Morning Session</h3>
                    <p className="text-sm text-text-muted">{TEMPLE_TIMINGS.morning}</p>
                  </div>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  The temple opens early morning for the first darshana. Morning rituals include abhisheka, alankara, and mahapooja.
                </p>
              </Card>

              <Card variant="glass" className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <Moon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold text-primary">Evening Session</h3>
                    <p className="text-sm text-text-muted">{TEMPLE_TIMINGS.evening}</p>
                  </div>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  The evening session features deeparadhana, bhajans, and the grand maha mangalarati before closing.
                </p>
              </Card>

              <Card variant="glass" className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <Sunrise className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold text-primary">Important Note</h3>
                  </div>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Timings may vary during festivals, special occasions, and maintenance days. Please check our announcements for any changes.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-bg-secondary/50 to-bg-primary">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <SectionHeading
              title="Weekly Schedule"
              subtitle="Special poojas and rituals observed on each day of the week."
            />
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-16">
            {weeklySchedule.map((day, index) => (
              <AnimatedSection key={day.day} delay={index * 0.05}>
                <Card variant="glass" className="p-5 h-full" hover>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-heading font-bold text-primary">{day.day}</h3>
                    <Calendar className="h-4 w-4 text-secondary" />
                  </div>
                  <p className="text-sm font-medium text-secondary">{day.special}</p>
                  <p className="text-xs text-text-muted mt-1">{day.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <SectionHeading
              title="Special Day Timings"
              subtitle="Extended and special schedules on auspicious days and festivals."
            />
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {specialDays.map((day, index) => (
              <AnimatedSection key={day.name} delay={index * 0.1}>
                <Card variant="elevated" className="p-6 h-full" hover>
                  <Badge variant="secondary" size="sm" className="mb-3">{day.timings}</Badge>
                  <h3 className="text-lg font-heading font-bold text-primary">{day.name}</h3>
                  <p className="text-text-secondary text-sm mt-2 leading-relaxed">{day.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
