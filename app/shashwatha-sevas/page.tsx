"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Sparkles, Check, ArrowRight, ChevronRight, Infinity, Crown, Star } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { SectionHeading } from "@/components/section-heading"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn, formatPrice } from "@/lib/utils"

const plans = [
  {
    id: "nitya-pooja",
    name: "Nitya Pooja",
    subtitle: "Daily Worship",
    description: "Daily worship of Sri Kalikamba Devi with vedic rituals for a year",
    longDescription: "Sponsor the daily morning pooja for an entire year. This perpetual seva ensures continuous prayers and offerings to the Goddess on behalf of you and your family.",
    price: 36000,
    originalPrice: 54000,
    duration: "12 Months",
    icon: Infinity,
    gradient: "from-amber-600 to-orange-700",
    features: [
      "Daily Nitya Pooja for 365 days",
      "Your name included in daily sankalpa",
      "Monthly Pushya Nakshatra pooja",
      "Special aarti on your birthday",
      "Annual report and prasad delivery",
      "Tax exemption under 80G",
    ],
    color: "amber",
  },
  {
    id: "navaratri-pooja",
    name: "Navaratri Pooja",
    subtitle: "Nine Nights Worship",
    description: "Special worship during the sacred nine nights of Navaratri",
    longDescription: "Participate in the grand Navaratri celebrations with special poojas each night. This package includes all nine days of elaborate worship, cultural programs, and the grand Vijayadashami celebration.",
    price: 25000,
    originalPrice: 35000,
    duration: "9 Days",
    icon: Crown,
    gradient: "from-purple-600 to-violet-700",
    featured: true,
    features: [
      "Pooja for all 9 nights of Navaratri",
      "Kumkumarchana on all days",
      "Durga Saptashati Parayana",
      "Participation in cultural events",
      "Special prasad for each day",
      "Preferred seating during events",
    ],
    color: "purple",
  },
  {
    id: "sonarathi-pooja",
    name: "Sonarathi Pooja",
    subtitle: "Simha Masa Worship",
    description: "Sacred offerings during the holy month of Simha Masa",
    longDescription: "The Sonarathi Pooja is a special worship performed during the auspicious Simha Masa (Leo month). This ancient tradition involves elaborate rituals and offerings to seek divine blessings for prosperity and well-being.",
    price: 15000,
    originalPrice: 22000,
    duration: "Per Year",
    icon: Star,
    gradient: "from-gold-500 to-amber-600",
    features: [
      "Special pooja during Simha Masa",
      "Abhishekam on selected day",
      "Homa and havan offerings",
      "Blessed gold-plated idol",
      "Certificate of participation",
      "Lifetime membership benefits",
    ],
    color: "gold",
  },
]

export default function ShashwathaSevasPage() {
  return (
    <div className="min-h-screen">
      <section className="relative h-[50vh] min-h-[380px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://picsum.photos/seed/shashwatha-sevas/1920/1080"
            alt="Shashwatha Sevas"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-primary-dark/95" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='0.15'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <Badge variant="secondary" size="md" className="mb-4">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Perpetual Blessings
            </Badge>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight"
            >
              Shashwatha <span className="gradient-text-gold">Sevas</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-warm-white/80 text-lg md:text-xl mt-6 max-w-2xl mx-auto"
            >
              Perpetual offerings that ensure continuous prayers and divine blessings for you and your family
            </motion.p>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-10" />
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-text-muted mb-10"
          >
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">Shashwatha Sevas</span>
          </motion.div>

          <SectionHeading
            title="Choose Your Perpetual Seva"
            subtitle="Select a shashwatha seva that resonates with your spiritual aspirations"
            className="mb-16"
          />

          <div className="grid md:grid-cols-3 gap-8 lg:gap-6 items-start">
            {plans.map((plan, idx) => {
              const PlanIcon = plan.icon
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.12, duration: 0.5 }}
                  className="relative"
                >
                  {plan.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                      <Badge variant="secondary" size="md" className="px-4 py-1 shadow-lg">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <Card
                    variant={plan.featured ? "elevated" : "default"}
                    padding="none"
                    className={cn(
                      "h-full overflow-hidden transition-all duration-300",
                      plan.featured && "ring-2 ring-secondary shadow-xl scale-105 md:scale-110",
                    )}
                  >
                    <div className={cn(
                      "relative h-40 bg-gradient-to-br flex items-center justify-center overflow-hidden",
                      plan.gradient,
                    )}>
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="relative z-10 text-center">
                        <PlanIcon className="h-10 w-10 text-white mx-auto mb-2" />
                        <h3 className="text-2xl font-heading font-bold text-white">{plan.name}</h3>
                        <p className="text-white/80 text-sm">{plan.subtitle}</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-3xl font-heading font-bold text-primary">
                            {formatPrice(plan.price)}
                          </span>
                          <span className="text-sm text-text-muted line-through">
                            {formatPrice(plan.originalPrice)}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted mt-1">for {plan.duration}</p>
                      </div>

                      <p className="text-sm text-text-secondary text-center mb-6 leading-relaxed">
                        {plan.longDescription}
                      </p>

                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, fidx) => (
                          <li key={fidx} className="flex items-start gap-3">
                            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                              <Check className="h-3 w-3 text-primary" />
                            </div>
                            <span className="text-sm text-text-secondary">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Link href={`/shashwatha-sevas/${plan.id}`}>
                        <Button
                          variant={plan.featured ? "gradient" : "secondary"}
                          size="lg"
                          className="w-full group/btn"
                        >
                          Subscribe Now
                          <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-b from-bg-secondary/50 to-bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-heading font-bold text-text-primary mb-4">
              Why Choose Shashwatha Sevas?
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Shashwatha (perpetual) sevas ensure that prayers and offerings are made on your behalf continuously,
              creating an unbroken chain of divine grace flowing to you and your loved ones.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 mt-10">
              {[
                { icon: Infinity, title: "Continuous Blessings", desc: "Prayers offered daily without interruption" },
                { icon: Crown, title: "Special Recognition", desc: "Your name mentioned in all rituals" },
                { icon: Star, title: "Premium Benefits", desc: "Exclusive access to temple events" },
              ].map((item, idx) => {
                const ItemIcon = item.icon
                return (
                  <div key={idx} className="p-6 rounded-2xl bg-warm-white dark:bg-bg-secondary border border-border shadow-card">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4">
                      <ItemIcon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-text-primary">{item.title}</h3>
                    <p className="text-sm text-text-muted mt-2">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
