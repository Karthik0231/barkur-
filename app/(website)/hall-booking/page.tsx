"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Building2, Users, IndianRupee, CheckCircle, ArrowRight, ChevronRight, CalendarCheck, Clock, MapPin } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

interface Hall {
  id: string
  slug: string
  name: string
  description: string
  capacity: number
  basePrice: number
  pricePerHour: number
  pricePerDay: number
  amenities: string[]
  images: string[]
  color: string
}

const halls: Hall[] = [
  {
    id: "1",
    slug: "kalikamba-sabha-bhavana",
    name: "Kalikamba Sabha Bhavana",
    description: "Our main auditorium with a spacious stage, ideal for weddings, conferences, and large gatherings. Features excellent acoustics and traditional ambiance.",
    capacity: 500,
    basePrice: 15000,
    pricePerHour: 3000,
    pricePerDay: 15000,
    amenities: ["Air Conditioning", "Stage with Curtains", "Sound System", "LED Projector", "Green Room", "Parking"],
    images: [],
    color: "from-primary/20 to-primary-light/20",
  },
  {
    id: "2",
    slug: "shri-madhava-hall",
    name: "Shri Madhava Hall",
    description: "A mid-sized hall perfect for family functions, religious ceremonies, and community meetings. Elegantly designed with traditional decor.",
    capacity: 250,
    basePrice: 8000,
    pricePerHour: 1500,
    pricePerDay: 8000,
    amenities: ["Air Conditioning", "Sound System", "Dining Area", "Kitchen Access", "Parking"],
    images: [],
    color: "from-secondary/20 to-gold-400/20",
  },
  {
    id: "3",
    slug: "annapurna-dining-hall",
    name: "Annapurna Dining Hall",
    description: "Dedicated dining hall for community feasts and events. Fully equipped kitchen and seating for large groups.",
    capacity: 300,
    basePrice: 5000,
    pricePerHour: 1000,
    pricePerDay: 5000,
    amenities: ["Kitchen", "Dining Tables", "Utensils", "Water Facility", "Wash Area"],
    images: [],
    color: "from-orange-500/20 to-amber-500/20",
  },
  {
    id: "4",
    slug: "veda-study-center",
    name: "Veda Study Center",
    description: "A serene hall for spiritual discourses, meditation sessions, and religious classes. Peaceful atmosphere conducive for learning.",
    capacity: 100,
    basePrice: 3000,
    pricePerHour: 500,
    pricePerDay: 3000,
    amenities: ["Air Conditioning", "Bookshelf", "Meditation Mats", "Sound System", "Garden View"],
    images: [],
    color: "from-green-500/20 to-emerald-500/20",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

export default function HallBookingPage() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen">
      <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/85 to-primary-dark/90 z-10" />
        <div className="absolute inset-0 opacity-10 z-[1]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='0.15'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <Badge variant="secondary" size="md" className="mb-4">
              <Building2 className="h-3.5 w-3.5 mr-1" />
              Temple Facilities
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight">
              Book Temple Halls
            </h1>
            <p className="text-warm-white/80 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              Host your events in the sacred premises of Sri Kalikamba Temple. Choose from our range of well-maintained halls for weddings, functions, and gatherings.
            </p>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-20" />
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-10">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.hallBooking")}</span>
          </div>

          <SectionHeading
            title={t("sections.hallBookingS1Title")}
            subtitle={t("sections.hallBookingS1Sub")}
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-6 mt-12"
          >
            {halls.map((hall, idx) => (
              <motion.div
                key={hall.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { delay: idx * 0.08 } },
                }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <Card variant="elevated" className="h-full flex flex-col group overflow-hidden" hover>
                  <div className={`relative h-48 bg-gradient-to-br ${hall.color} flex items-center justify-center overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/5" />
                    <div className="w-20 h-20 rounded-2xl bg-white/90 dark:bg-bg-secondary/90 flex items-center justify-center shadow-lg text-primary">
                      <Building2 className="h-10 w-10" />
                    </div>
                    <Badge variant="primary" size="sm" className="absolute top-3 right-3">
                      <Users className="h-3 w-3 mr-1" />
                      Up to {hall.capacity}
                    </Badge>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-heading font-bold text-primary group-hover:text-primary-light transition-colors">
                      {hall.name}
                    </h3>
                    <p className="text-sm text-text-secondary mt-2 leading-relaxed flex-1">
                      {hall.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {hall.amenities.slice(0, 4).map((amenity, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-xs text-text-muted bg-bg-secondary px-2.5 py-1 rounded-full">
                          <CheckCircle className="h-3 w-3 text-emerald-500" />
                          {amenity}
                        </span>
                      ))}
                      {hall.amenities.length > 4 && (
                        <span className="text-xs text-text-muted bg-bg-secondary px-2.5 py-1 rounded-full">
                          +{hall.amenities.length - 4} more
                        </span>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-text-muted">Starting from</span>
                          <p className="text-xl font-bold text-primary font-heading">{formatPrice(hall.basePrice)}</p>
                        </div>
                        <div className="text-right text-xs text-text-muted">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatPrice(hall.pricePerHour)}/hr
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarCheck className="h-3 w-3" />
                            {formatPrice(hall.pricePerDay)}/day
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-5">
                      <Link href={`/hall-booking/${hall.slug}`} className="flex-[2]">
                        <Button variant="outline" size="sm" className="w-full">
                          <CalendarCheck className="h-3.5 w-3.5" />
                          Check Availability
                        </Button>
                      </Link>
                      <Link href={`/hall-booking/${hall.slug}/book`} className="flex-[3]">
                        <Button variant="gradient" size="sm" className="w-full">
                          Book Now
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-bg-secondary/50 to-bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">Why Book With Us?</h2>
            <div className="grid sm:grid-cols-3 gap-6 mt-10">
              {[
                { icon: <MapPin className="h-8 w-8" />, title: "Sacred Venue", desc: "Host your events in the divine premises of the historic temple" },
                { icon: <Building2 className="h-8 w-8" />, title: "Well Maintained", desc: "All halls are regularly maintained with modern amenities" },
                { icon: <IndianRupee className="h-8 w-8" />, title: "Affordable Rates", desc: "Competitive pricing with special discounts for temple events" },
              ].map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-warm-white dark:bg-bg-secondary border border-border shadow-card hover:shadow-elevated transition-shadow">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-heading font-bold text-primary">{item.title}</h3>
                  <p className="text-sm text-text-muted mt-2">{item.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
