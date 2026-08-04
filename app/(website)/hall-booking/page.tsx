"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Building2, Users, IndianRupee, CheckCircle, ArrowRight, ChevronRight, CalendarCheck, Clock, MapPin, AlertCircle, Loader2 } from "lucide-react"
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

const colorPalettes = [
  "from-primary/20 to-primary-light/20",
  "from-secondary/20 to-gold-400/20",
  "from-orange-500/20 to-amber-500/20",
  "from-green-500/20 to-emerald-500/20",
  "from-blue-500/20 to-cyan-500/20",
  "from-purple-500/20 to-pink-500/20",
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

function transformHall(raw: any, index: number): Hall {
  const amenitiesArr = Array.isArray(raw.amenities)
    ? raw.amenities
    : typeof raw.amenities === "string"
    ? JSON.parse(raw.amenities || "[]")
    : []
  return {
    id: String(raw.id),
    slug: raw.slug || String(raw.id),
    name: raw.name || "Unnamed Hall",
    description: raw.description || "",
    capacity: Number(raw.capacity) || 0,
    basePrice: Number(raw.basePrice) || 0,
    pricePerHour: Number(raw.pricePerHour) || 0,
    pricePerDay: Number(raw.pricePerDay) || 0,
    amenities: amenitiesArr,
    images: Array.isArray(raw.images) ? raw.images : [],
    color: colorPalettes[index % colorPalettes.length],
  }
}

export default function HallBookingPage() {
  const { t } = useTranslation()
  const [halls, setHalls] = useState<Hall[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchHalls() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/halls?limit=100")
        const json = await res.json()
        if (!json?.success) throw new Error(json?.message || "Failed to load halls")
        const rawHalls = json?.data?.halls || []
        const transformed: Hall[] = rawHalls.map((h: any, i: number) => transformHall(h, i))
        setHalls(transformed)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }
    fetchHalls()
  }, [])

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

          <div className="mt-12">
            {loading && (
              <div className="grid md:grid-cols-2 gap-6">
                {[0, 1, 2, 3].map((i) => (
                  <Card key={i} variant="elevated" className="h-full overflow-hidden">
                    <div className="h-48 bg-bg-secondary/60 animate-pulse" />
                    <div className="p-6 space-y-4">
                      <div className="h-7 w-3/4 bg-bg-secondary/60 animate-pulse rounded-md" />
                      <div className="space-y-2">
                        <div className="h-4 bg-bg-secondary/60 animate-pulse rounded" />
                        <div className="h-4 w-5/6 bg-bg-secondary/60 animate-pulse rounded" />
                        <div className="h-4 w-2/3 bg-bg-secondary/60 animate-pulse rounded" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[0, 1, 2].map((j) => (
                          <div key={j} className="h-6 w-24 bg-bg-secondary/60 animate-pulse rounded-full" />
                        ))}
                      </div>
                      <div className="pt-4 border-t border-border flex items-center justify-between">
                        <div className="h-10 w-28 bg-bg-secondary/60 animate-pulse rounded" />
                        <div className="space-y-1">
                          <div className="h-3 w-20 bg-bg-secondary/60 animate-pulse rounded" />
                          <div className="h-3 w-20 bg-bg-secondary/60 animate-pulse rounded" />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="h-10 flex-1 bg-bg-secondary/60 animate-pulse rounded-lg" />
                        <div className="h-10 flex-[1.5] bg-bg-secondary/60 animate-pulse rounded-lg" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {error && (
              <Card variant="elevated" className="p-10 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-heading font-bold text-primary mb-2">Failed to Load Halls</h3>
                <p className="text-text-secondary mb-6">{error}</p>
                <Button
                  variant="gradient"
                  onClick={() => {
                    setLoading(true)
                    setError(null)
                    fetch("/api/halls?limit=100")
                      .then((r) => r.json())
                      .then((json) => {
                        if (!json?.success) throw new Error(json?.message || "Failed to load halls")
                        const rawHalls = json?.data?.halls || []
                        setHalls(rawHalls.map((h: any, i: number) => transformHall(h, i)))
                      })
                      .catch((e) => setError(e instanceof Error ? e.message : "Retry failed"))
                      .finally(() => setLoading(false))
                  }}
                >
                  Try Again
                </Button>
              </Card>
            )}

            {!loading && !error && halls.length === 0 && (
              <Card variant="elevated" className="p-10 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-bg-secondary/50 flex items-center justify-center text-text-muted mb-4">
                  <Building2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-heading font-bold text-primary mb-2">No Halls Available</h3>
                <p className="text-text-secondary">Please check back later for available halls.</p>
              </Card>
            )}

            {!loading && !error && halls.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 gap-6"
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
            )}
          </div>
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
