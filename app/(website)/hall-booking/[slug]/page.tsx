"use client"

import { use } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Building2, Users, Clock, CalendarCheck, IndianRupee, CheckCircle, XCircle, ChevronRight, Shield, MapPin, BookOpen } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AvailabilityCalendar } from "@/components/hall-booking/availability-calendar"
import { formatPrice } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

interface HallData {
  slug: string
  name: string
  description: string
  longDescription: string
  capacity: {
    seating: number
    standing: number
    dining: number
  }
  amenities: { name: string; available: boolean }[]
  pricing: {
    basePrice: number
    pricePerHour: number
    pricePerDay: number
    securityDeposit: number
    overtimeRate: number
  }
  rules: string[]
  color: string
}

const hallData: Record<string, HallData> = {
  "kalikamba-sabha-bhavana": {
    slug: "kalikamba-sabha-bhavana",
    name: "Kalikamba Sabha Bhavana",
    description: "Our main auditorium with a spacious stage, ideal for weddings, conferences, and large gatherings.",
    longDescription: "Kalikamba Sabha Bhavana is our flagship venue, designed to host large-scale events with elegance and comfort. The hall features a spacious stage with traditional decor, excellent acoustics, and modern lighting systems. The adjoining green rooms provide convenience for performers and speakers. With a capacity of up to 500 guests, this hall is perfect for weddings, religious discourses, cultural programs, and corporate events. The traditional architecture combined with modern amenities creates an ambiance that is both sacred and functional.",
    capacity: { seating: 350, standing: 500, dining: 300 },
    amenities: [
      { name: "Air Conditioning", available: true },
      { name: "Stage with Curtains", available: true },
      { name: "Professional Sound System", available: true },
      { name: "LED Projector & Screen", available: true },
      { name: "Wireless Microphones", available: true },
      { name: "Green Room", available: true },
      { name: "Parking (50+ vehicles)", available: true },
      { name: "Wheelchair Access", available: true },
      { name: "Dining Area", available: true },
      { name: "Generator Backup", available: true },
    ],
    pricing: {
      basePrice: 15000,
      pricePerHour: 3000,
      pricePerDay: 15000,
      securityDeposit: 10000,
      overtimeRate: 5000,
    },
    rules: [
      "Event timings must be strictly adhered to as per the booking schedule.",
      "No alcoholic beverages or non-vegetarian food allowed on temple premises.",
      "Footwear must be removed before entering the main hall area.",
      "Decoration should not damage any temple property or walls.",
      "Sound levels must be maintained at reasonable levels.",
      "All garbage must be disposed of properly after the event.",
      "Temple management reserves the right to cancel bookings in special circumstances.",
      "Security deposit will be refunded within 7 working days post-event inspection.",
    ],
    color: "from-primary/20 to-primary-light/20",
  },
  "shri-madhava-hall": {
    slug: "shri-madhava-hall",
    name: "Shri Madhava Hall",
    description: "A mid-sized hall perfect for family functions, religious ceremonies, and community meetings.",
    longDescription: "Shri Madhava Hall offers a warm and intimate setting for mid-sized gatherings. The hall is elegantly designed with traditional decor elements that reflect the rich cultural heritage of our temple. It is ideal for family functions, upanayana ceremonies, wedding receptions, and community meetings. The attached dining area and kitchen access make it particularly suitable for events that involve food service. The hall's thoughtful layout ensures that every guest has a clear view of the proceedings.",
    capacity: { seating: 180, standing: 250, dining: 200 },
    amenities: [
      { name: "Air Conditioning", available: true },
      { name: "Sound System", available: true },
      { name: "Dining Area", available: true },
      { name: "Kitchen Access", available: true },
      { name: "Parking (30+ vehicles)", available: true },
      { name: "Wheelchair Access", available: true },
      { name: "Decoration Support", available: true },
      { name: "Catering Support", available: false },
    ],
    pricing: {
      basePrice: 8000,
      pricePerHour: 1500,
      pricePerDay: 8000,
      securityDeposit: 5000,
      overtimeRate: 2500,
    },
    rules: [
      "Booking includes standard setup and cleanup time.",
      "Outside catering allowed with prior approval.",
      "No religious ceremonies without prior coordination with temple priest.",
      "All temple rules regarding decorum must be followed.",
      "Security deposit refund subject to damage assessment.",
    ],
    color: "from-secondary/20 to-gold-400/20",
  },
  "annapurna-dining-hall": {
    slug: "annapurna-dining-hall",
    name: "Annapurna Dining Hall",
    description: "Dedicated dining hall for community feasts and events. Fully equipped kitchen and seating for large groups.",
    longDescription: "Annapurna Dining Hall is specially designed for community dining and feast events. The hall comes with a fully equipped kitchen that can handle large-scale cooking requirements. With seating capacity for 300 people, it is the perfect venue for wedding feasts, festival prasadam distribution, and community gatherings. The hall features proper ventilation, wash areas, and storage facilities to ensure hygienic food service. The adjoining serving counters are designed for efficient food distribution.",
    capacity: { seating: 300, standing: 0, dining: 300 },
    amenities: [
      { name: "Commercial Kitchen", available: true },
      { name: "Dining Tables", available: true },
      { name: "Utensils & Cookware", available: true },
      { name: "Water Facility", available: true },
      { name: "Wash Area", available: true },
      { name: "Storage Room", available: true },
      { name: "Parking (20+ vehicles)", available: true },
    ],
    pricing: {
      basePrice: 5000,
      pricePerHour: 1000,
      pricePerDay: 5000,
      securityDeposit: 3000,
      overtimeRate: 2000,
    },
    rules: [
      "Kitchen usage included in the booking price.",
      "All food must be vegetarian as per temple traditions.",
      "Cleaning of kitchen and hall after use is mandatory.",
      "Utensils must be returned in clean condition.",
      "Gas and electricity charges are included up to standard usage.",
    ],
    color: "from-orange-500/20 to-amber-500/20",
  },
  "veda-study-center": {
    slug: "veda-study-center",
    name: "Veda Study Center",
    description: "A serene hall for spiritual discourses, meditation sessions, and religious classes.",
    longDescription: "The Veda Study Center offers a tranquil environment for spiritual and educational activities. Surrounded by lush greenery, this hall provides the perfect setting for meditation sessions, Vedic classes, spiritual discourses, and yoga retreats. The hall is equipped with comfortable seating, audio systems for guided meditation, and a library of spiritual books. Large windows allow natural light to fill the space, creating a peaceful atmosphere conducive to learning and reflection.",
    capacity: { seating: 100, standing: 120, dining: 80 },
    amenities: [
      { name: "Air Conditioning", available: true },
      { name: "Library & Bookshelf", available: true },
      { name: "Meditation Mats", available: true },
      { name: "Sound System", available: true },
      { name: "Garden View", available: true },
      { name: "Whiteboard & Projector", available: true },
      { name: "Parking (15+ vehicles)", available: true },
    ],
    pricing: {
      basePrice: 3000,
      pricePerHour: 500,
      pricePerDay: 3000,
      securityDeposit: 2000,
      overtimeRate: 1000,
    },
    rules: [
      "Silence to be maintained in and around the study center.",
      "Mobile phones must be switched off or kept on silent mode.",
      "No food or drinks inside the main study hall.",
      "Books and materials must be handled with care.",
      "Regular group bookings eligible for special discounts.",
    ],
    color: "from-green-500/20 to-emerald-500/20",
  },
}

export default function HallDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { t } = useTranslation()
  const { slug } = use(params)
  const hall = hallData[slug]

  if (!hall) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-heading font-bold text-primary">Hall Not Found</h1>
          <p className="text-text-secondary mt-2">The hall you are looking for does not exist.</p>
          <Link href="/hall-booking">
            <Button variant="primary" className="mt-6">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Halls
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <section className={`relative h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden bg-gradient-to-br ${hall.color}`}>
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="absolute inset-0 opacity-10 z-[1]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <Badge variant="secondary" size="md" className="mb-3">
              <Building2 className="h-3.5 w-3.5 mr-1" />
              Temple Hall
            </Badge>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-warm-white leading-tight">
              {hall.name}
            </h1>
            <p className="text-warm-white/80 text-lg mt-4 max-w-2xl mx-auto">
              {hall.description}
            </p>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-20" />
      </section>

      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-8">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/hall-booking" className="hover:text-secondary transition-colors">{t("nav.hallBooking")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{hall.name}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
            <div className="lg:col-span-2 space-y-8">
              <AnimatedSection>
                <Card variant="elevated" className="p-6 lg:p-8">
                  <h2 className="text-2xl font-heading font-bold text-primary mb-4">About This Hall</h2>
                  <p className="text-text-secondary leading-relaxed">{hall.longDescription}</p>
                </Card>
              </AnimatedSection>

              <AnimatedSection delay={0.05}>
                <Card variant="elevated" className="p-6 lg:p-8">
                  <h2 className="text-xl font-heading font-bold text-primary mb-5">Capacity Details</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Seating", value: hall.capacity.seating, icon: <Users className="h-5 w-5" /> },
                      { label: "Standing", value: hall.capacity.standing, icon: <Users className="h-5 w-5" /> },
                      { label: "Dining", value: hall.capacity.dining, icon: <Users className="h-5 w-5" /> },
                    ].map((item, idx) => (
                      <div key={idx} className="text-center p-5 rounded-xl bg-bg-secondary/50">
                        <div className="w-10 h-10 mx-auto rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary mb-2">
                          {item.icon}
                        </div>
                        <p className="text-2xl font-bold text-primary font-heading">{item.value}</p>
                        <p className="text-xs text-text-muted mt-0.5">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </AnimatedSection>

              <AnimatedSection delay={0.08}>
                <Card variant="elevated" className="p-6 lg:p-8">
                  <h2 className="text-xl font-heading font-bold text-primary mb-5">Amenities</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {hall.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-bg-secondary/50">
                        {amenity.available ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-400 shrink-0" />
                        )}
                        <span className={`text-sm ${amenity.available ? "text-text-primary" : "text-text-muted line-through"}`}>
                          {amenity.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <Card variant="elevated" className="p-6 lg:p-8">
                  <h2 className="text-xl font-heading font-bold text-primary mb-5">Rules & Regulations</h2>
                  <div className="space-y-3">
                    {hall.rules.map((rule, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-sm text-text-secondary">{rule}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </AnimatedSection>

              <AnimatedSection delay={0.12}>
                <Card variant="elevated" className="p-6 lg:p-8">
                  <h2 className="text-xl font-heading font-bold text-primary mb-5">Availability Calendar</h2>
                  <AvailabilityCalendar />
                </Card>
              </AnimatedSection>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                <AnimatedSection delay={0.05}>
                  <Card variant="elevated" className="p-6">
                    <h3 className="text-lg font-heading font-bold text-primary mb-4">Pricing</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-border">
                        <span className="text-sm text-text-secondary">Base Price</span>
                        <span className="text-lg font-bold text-primary font-heading">{formatPrice(hall.pricing.basePrice)}</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-border">
                        <span className="text-sm text-text-secondary">Per Hour</span>
                        <span className="text-base font-semibold text-text-primary">{formatPrice(hall.pricing.pricePerHour)}</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-border">
                        <span className="text-sm text-text-secondary">Per Day</span>
                        <span className="text-base font-semibold text-text-primary">{formatPrice(hall.pricing.pricePerDay)}</span>
                      </div>
                      <div className="flex justify-between items-center pb-3 border-b border-border">
                        <span className="text-sm text-text-secondary">Security Deposit</span>
                        <span className="text-base font-semibold text-text-primary">{formatPrice(hall.pricing.securityDeposit)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-text-secondary">Overtime Rate</span>
                        <span className="text-base font-semibold text-text-primary">{formatPrice(hall.pricing.overtimeRate)}/hr</span>
                      </div>
                    </div>

                    <Link href={`/hall-booking/${hall.slug}/book`}>
                      <Button variant="gradient" size="lg" className="w-full mt-6">
                        <CalendarCheck className="h-4 w-4" />
                        Book This Hall
                      </Button>
                    </Link>
                    <p className="text-xs text-text-muted text-center mt-3 flex items-center justify-center gap-1">
                      <Shield className="h-3 w-3 text-secondary" />
                      Secure booking with secured payment
                    </p>
                  </Card>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
