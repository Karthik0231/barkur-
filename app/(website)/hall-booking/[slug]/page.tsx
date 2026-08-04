"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Building2, Users, Clock, CalendarCheck, IndianRupee, CheckCircle, XCircle, ChevronRight, Shield, MapPin, BookOpen, AlertCircle } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AvailabilityCalendar } from "@/components/hall-booking/availability-calendar"
import { formatPrice } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

interface HallData {
  id: string
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

const colorPalettes = [
  "from-primary/20 to-primary-light/20",
  "from-secondary/20 to-gold-400/20",
  "from-orange-500/20 to-amber-500/20",
  "from-green-500/20 to-emerald-500/20",
  "from-blue-500/20 to-cyan-500/20",
  "from-purple-500/20 to-pink-500/20",
]

const defaultRules = [
  "Event timings must be strictly adhered to as per the booking schedule.",
  "No alcoholic beverages or non-vegetarian food allowed on temple premises.",
  "Footwear must be removed before entering the main hall area.",
  "Decoration should not damage any temple property or walls.",
  "Sound levels must be maintained at reasonable levels.",
  "All garbage must be disposed of properly after the event.",
]

function parseJSONField<T>(raw: unknown, fallback: T): T {
  if (raw === null || raw === undefined) return fallback
  if (Array.isArray(raw)) return raw as T
  if (typeof raw === "string") {
    try { return JSON.parse(raw) as T } catch { return fallback }
  }
  return fallback
}

function transformHallDetail(raw: any, index: number): HallData {
  const rawCapacity = Number(raw.capacity) || 0
  const amenitiesArr = parseJSONField<string[]>(raw.amenities, [])
  const rulesArr = parseJSONField<string[]>(raw.rules, defaultRules)
  const desc = raw.description || ""
  const seating = Math.round(rawCapacity * 0.7)
  const standing = rawCapacity
  const dining = Math.round(rawCapacity * 0.6)

  return {
    id: String(raw.id),
    slug: raw.slug || String(raw.id),
    name: raw.name || "Unnamed Hall",
    description: desc,
    longDescription: desc,
    capacity: { seating, standing, dining },
    amenities: amenitiesArr.length > 0
      ? amenitiesArr.map((a: string) => ({ name: a, available: true }))
      : [],
    pricing: {
      basePrice: Number(raw.basePrice) || 0,
      pricePerHour: Number(raw.pricePerHour) || 0,
      pricePerDay: Number(raw.pricePerDay) || 0,
      securityDeposit: Number(raw.securityDeposit) || Math.round((Number(raw.basePrice) || 0) * 0.5),
      overtimeRate: Number(raw.pricePerHour) ? Math.round(Number(raw.pricePerHour) * 1.5) : 0,
    },
    rules: rulesArr.length > 0 ? rulesArr : defaultRules,
    color: colorPalettes[index % colorPalettes.length],
  }
}

export default function HallDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { t } = useTranslation()
  const { slug } = use(params)
  const [hall, setHall] = useState<HallData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchHall() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("/api/halls?limit=100")
        const json = await res.json()
        if (!json?.success) throw new Error(json?.message || "Failed to load hall")
        const rawHalls: any[] = json?.data?.halls || []
        const matchIdx = rawHalls.findIndex((h: any) => (h.slug || String(h.id)) === slug)
        if (matchIdx === -1) {
          setHall(null)
        } else {
          setHall(transformHallDetail(rawHalls[matchIdx], matchIdx))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }
    fetchHall()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen">
        <section className="relative h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 to-primary-light/20">
          <div className="absolute inset-0 bg-black/20 z-10" />
          <div className="relative z-20 text-center px-4 max-w-4xl mx-auto animate-pulse">
            <div className="h-6 w-32 mx-auto bg-white/20 rounded-md mb-3" />
            <div className="h-12 md:h-16 w-3/4 mx-auto bg-white/20 rounded-md mb-4" />
            <div className="h-5 w-2/3 mx-auto bg-white/20 rounded-md" />
          </div>
        </section>
        <section className="py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
              <div className="lg:col-span-2 space-y-8">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Card key={i} variant="elevated" className="p-6 lg:p-8">
                    <div className="h-7 w-1/3 bg-bg-secondary/60 animate-pulse rounded-md mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-bg-secondary/60 animate-pulse rounded" />
                      <div className="h-4 w-5/6 bg-bg-secondary/60 animate-pulse rounded" />
                      <div className="h-4 w-4/5 bg-bg-secondary/60 animate-pulse rounded" />
                    </div>
                  </Card>
                ))}
              </div>
              <div className="lg:col-span-1">
                <Card variant="elevated" className="p-6 sticky top-6">
                  <div className="h-6 w-24 bg-bg-secondary/60 animate-pulse rounded-md mb-4" />
                  <div className="space-y-4">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex justify-between items-center pb-3 border-b border-border">
                        <div className="h-4 w-32 bg-bg-secondary/60 animate-pulse rounded" />
                        <div className="h-5 w-20 bg-bg-secondary/60 animate-pulse rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="h-12 w-full bg-bg-secondary/60 animate-pulse rounded-lg mt-6" />
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card variant="elevated" className="p-10 text-center max-w-md">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-primary mb-2">Error Loading Hall</h1>
          <p className="text-text-secondary mb-6">{error}</p>
          <Link href="/hall-booking">
            <Button variant="gradient">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Halls
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

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
