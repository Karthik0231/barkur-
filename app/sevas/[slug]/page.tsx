"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  Clock, IndianRupee, ChevronRight, Check, Shield, BookOpen, Info, Sparkles,
  ArrowLeft, Sun, Droplets, Heart, Star, Flame, Moon, Calendar, Users, AlertCircle
} from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn, formatPrice } from "@/lib/utils"

const sevasData: Record<string, {
  name: string
  description: string
  longDescription: string
  price: number
  duration: string
  category: string
  gradient: string
  image: string
  icon: React.ComponentType<{ className?: string }>
  rules: string[]
  includes: string[]
  related: string[]
}> = {
  "nitya-pooja": {
    name: "Nitya Pooja",
    description: "Daily morning worship to the presiding deity Sri Kalikamba Devi with traditional vedic rituals.",
    longDescription: "The Nitya Pooja is the daily sacred ritual performed at the temple to honor Sri Kalikamba Devi. This ancient tradition involves the offering of flowers, incense, lamps, and naivedya (food offering) accompanied by the chanting of powerful vedic mantras. Daily worship ensures the continuous flow of positive energy and divine blessings upon devotees.",
    price: 501,
    duration: "30 min",
    category: "Daily Pooja",
    gradient: "from-amber-600 to-orange-700",
    image: "https://picsum.photos/seed/nitya-pooja-detail/1200/600",
    icon: Sun,
    rules: [
      "Devotees should be present 15 minutes before the scheduled time",
      "Traditional attire recommended (dhoti for men, saree for women)",
      "Mobile phones must be switched off inside the temple premises",
      "Follow the instructions of the temple priests",
      "Photography is not allowed during the pooja",
    ],
    includes: [
      "Flower offerings to the deity",
      "Vedic mantra chanting",
      "Naivedya (food offering)",
      "Aarti and blessing",
      "Prasad distribution",
    ],
    related: ["archana", "kumkumarchana", "sahasranama-archana"],
  },
  "abhishekam": {
    name: "Abhishekam",
    description: "Sacred bathing ceremony of the deity with milk, curd, honey, ghee, and holy waters.",
    longDescription: "Abhishekam is the sacred bathing ritual performed to the deity with various holy substances including milk, curd, honey, ghee, sugar, and panchamrita. Each substance has spiritual significance and devotees believe that participating in or witnessing Abhishekam brings immense blessings, purification, and fulfillment of desires.",
    price: 1001,
    duration: "45 min",
    category: "Abhishekam",
    gradient: "from-blue-600 to-cyan-700",
    image: "https://picsum.photos/seed/abhishekam-detail/1200/600",
    icon: Droplets,
    rules: [
      "Devotees should arrive 20 minutes early for preparation",
      "White or light-colored traditional attire preferred",
      "Abhishekam items are provided by the temple",
      "Participants may be asked to sit in designated areas",
      "Children must be accompanied by adults",
    ],
    includes: [
      "Panchamrita Abhishekam (milk, curd, honey, ghee, sugar)",
      "Sandalwood paste application",
      "Garland offering",
      "Vedic mantra chanting",
      "Aarti and prasad",
    ],
    related: ["panchamrita-abhishekam", "nitya-pooja", "chandi-homa"],
  },
  "archana": {
    name: "Archana",
    description: "Offering of flowers and chanting of 108 sacred names of the Goddess for blessings.",
    longDescription: "Archana is a heartfelt offering where the priest chants 108 sacred names of Sri Kalikamba Devi while offering fresh flowers. Each name reveals a different aspect of the Divine Mother's grace and power. Devotees can offer their Archana with specific intentions for peace, prosperity, health, or spiritual growth.",
    price: 251,
    duration: "20 min",
    category: "Archana",
    gradient: "from-rose-600 to-pink-700",
    image: "https://picsum.photos/seed/archana-detail/1200/600",
    icon: Heart,
    rules: [
      "Provide the names of family members for the Archana",
      "Traditional attire is appreciated",
      "Present at the temple 10 minutes before",
      "Maintain silence during the chanting",
      "Follow the priest's instructions",
    ],
    includes: [
      "108 namavali chanting with flowers",
      "Individual names mentioned in the prayer",
      "Kumkum offering",
      "Aarti and blessing",
      "Sacred prasad",
    ],
    related: ["sahasranama-archana", "kumkumarchana", "nitya-pooja"],
  },
  "sahasranama-archana": {
    name: "Sahasranama Archana",
    description: "Recitation of thousand sacred names of the Divine Mother with elaborate offerings.",
    longDescription: "Sahasranama Archana is an elaborate ritual involving the chanting of 1000 sacred names of the Divine Mother. This powerful ceremony is believed to invoke the complete grace of Sri Kalikamba Devi, removing all obstacles and bestowing abundant blessings upon the devotee and their family.",
    price: 751,
    duration: "60 min",
    category: "Archana",
    gradient: "from-purple-600 to-violet-700",
    image: "https://picsum.photos/seed/sahasranama-detail/1200/600",
    icon: Star,
    rules: [
      "Prior registration is mandatory",
      "Provide full family details for the sankalpa",
      "Traditional attire required",
      "Full participation in the chanting is encouraged",
      "Duration may extend up to 75 minutes",
    ],
    includes: [
      "Sankalpa (sacred vow) with family details",
      "1000 namavali chanting",
      "Elaborate flower offerings",
      "Special aarti",
      "Mahaprasad",
    ],
    related: ["archana", "kumkumarchana", "durga-saptashati"],
  },
  "durga-saptashati": {
    name: "Durga Saptashati Parayana",
    description: "Sacred recitation of the 700-verse Durga Saptashati for divine blessings and protection.",
    longDescription: "Durga Saptashati Parayana is the powerful recitation of the 700-verse scripture from the Markandeya Purana that glorifies Goddess Durga's divine acts. This parayana is performed for overcoming major obstacles, seeking protection from negative forces, and invoking the mother's boundless grace.",
    price: 1501,
    duration: "90 min",
    category: "Special",
    gradient: "from-red-600 to-rose-700",
    image: "https://picsum.photos/seed/durga-saptashati-detail/1200/600",
    icon: Sparkles,
    rules: [
      "Book at least 3 days in advance",
      "Fasting is recommended on the day of parayana",
      "White or red traditional attire",
      "Maintain complete silence during recitation",
      "Accommodation for multiple family members available",
    ],
    includes: [
      "Complete Durga Saptashati recitation",
      "Sankalpa with family gotra",
      "Special offerings to the deity",
      "Kumkum and chandan prasad",
      "Blessed protective thread",
    ],
    related: ["chandi-homa", "sahasranama-archana", "abhishekam"],
  },
  "panchamrita-abhishekam": {
    name: "Panchamrita Abhishekam",
    description: "Five nectar bath ceremony using milk, curd, honey, ghee, and sugar for supreme blessings.",
    longDescription: "Panchamrita Abhishekam is the most sacred bathing ritual where the deity is bathed with five nectars - milk (for purity), curd (for prosperity), honey (for sweetness in life), ghee (for strength), and sugar (for joy). This ritual is believed to bestow the highest spiritual benefits and material abundance.",
    price: 2001,
    duration: "60 min",
    category: "Abhishekam",
    gradient: "from-teal-600 to-emerald-700",
    image: "https://picsum.photos/seed/panchamrita-detail/1200/600",
    icon: Moon,
    rules: [
      "Advanced booking recommended",
      "Available on specific auspicious days",
      "Traditional attire mandatory",
      "Offerings are included in the package",
      "Family members can witness from close quarters",
    ],
    includes: [
      "Panchamrita preparation and offering",
      "Milk, curd, honey, ghee, sugar bath",
      "Sacred thread ceremony",
      "Gold or silver vessel offering",
      "Special prasad and gifts",
    ],
    related: ["abhishekam", "chandi-homa", "nitya-pooja"],
  },
  "kumkumarchana": {
    name: "Kumkumarchana",
    description: "Offering of sacred kumkum with vedic chants for marital bliss and well-being.",
    longDescription: "Kumkumarchana is a special ritual where sacred kumkum (vermilion) is offered to the Goddess while chanting powerful mantras. This ritual is particularly significant for married women seeking marital harmony, prosperity, and the well-being of their families. The blessed kumkum is distributed among devotees.",
    price: 351,
    duration: "20 min",
    category: "Daily Pooja",
    gradient: "from-pink-600 to-rose-700",
    image: "https://picsum.photos/seed/kumkum-detail/1200/600",
    icon: Sparkles,
    rules: [
      "Suitable for couples and families",
      "Provide gotra details for sankalpa",
      "Traditional attire recommended",
      "Kumkum will be provided by the temple",
      "Present 10 minutes before the ritual",
    ],
    includes: [
      "Kumkum offering with mantras",
      "Family sankalpa",
      "Blessed kumkum prasad",
      "Aarti and blessings",
      "Sacred ash (vibhuti)",
    ],
    related: ["archana", "nitya-pooja", "sahasranama-archana"],
  },
  "chandi-homa": {
    name: "Chandi Homa",
    description: "Powerful sacred fire ritual invoking Goddess Durga for protection, prosperity, and spiritual growth.",
    longDescription: "Chandi Homa is the most powerful fire ritual performed to invoke the fierce and protective aspect of Goddess Durga. This elaborate homa involves offerings of ghee, herbs, grains, and sacred materials into the consecrated fire while chanting the Durga Saptashati mantras. It is performed for attaining victory over enemies, curing chronic illnesses, and achieving spiritual elevation.",
    price: 5001,
    duration: "120 min",
    category: "Homa",
    gradient: "from-orange-700 to-red-800",
    image: "https://picsum.photos/seed/chandi-homa-detail/1200/600",
    icon: Flame,
    rules: [
      "Book at least one week in advance",
      "Fasting from sunrise recommended",
      "Specific seating arrangement for participants",
      "Full traditional attire (dhoti/saree) mandatory",
      "Duration may extend up to 3 hours",
      "Accompanying family members welcome as witnesses",
    ],
    includes: [
      "Ganapathi Pooja (beginning ritual)",
      "Kalasha Sthapana (holy pot installation)",
      "Sankalpa with complete family details",
      "Complete Chandi Homa with 108 offerings",
      "Purnahuti (final offering)",
      "Mahaprasad and blessed items",
    ],
    related: ["durga-saptashati", "abhishekam", "panchamrita-abhishekam"],
  },
}

const tabs = ["Description", "Includes", "Rules"]

export default function SevaDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [activeTab, setActiveTab] = useState(0)

  const seva = sevasData[slug]

  if (!seva) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-primary">Seva not found</h1>
          <Link href="/sevas">
            <Button variant="secondary" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Sevas
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const Icon = seva.icon
  const relatedSevas = seva.related.map((rel) => sevasData[rel]).filter(Boolean)

  return (
    <div className="min-h-screen">
      <section className="relative h-[50vh] min-h-[380px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={seva.image}
            alt={seva.name}
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
              {seva.category}
            </Badge>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight"
            >
              {seva.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-warm-white/80 text-lg md:text-xl mt-4 max-w-2xl mx-auto"
            >
              {seva.description}
            </motion.p>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-10" />
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-text-muted mb-8"
          >
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/sevas" className="hover:text-secondary transition-colors">Sevas</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{seva.name}</span>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card variant="elevated" padding="lg">
                <div className="flex items-start gap-4 mb-6">
                  <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg", seva.gradient)}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-text-primary">{seva.name}</h2>
                    <p className="text-text-secondary mt-1">{seva.category}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-secondary">
                    <IndianRupee className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-text-muted">Price</p>
                      <p className="text-sm font-bold text-primary">{formatPrice(seva.price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-secondary">
                    <Clock className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-text-muted">Duration</p>
                      <p className="text-sm font-bold text-primary">{seva.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-secondary">
                    <Users className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-text-muted">Availability</p>
                      <p className="text-sm font-bold text-primary">Daily</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 mb-6 border-b border-border">
                  {tabs.map((tab, idx) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(idx)}
                      className={cn(
                        "px-4 py-3 text-sm font-medium transition-all relative",
                        activeTab === idx
                          ? "text-primary"
                          : "text-text-muted hover:text-text-primary",
                      )}
                    >
                      {tab}
                      {activeTab === idx && (
                        <motion.div
                          layoutId="tab-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                        />
                      )}
                    </button>
                  ))}
                </div>

                <div className="min-h-[200px]">
                  {activeTab === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="text-text-secondary leading-relaxed">{seva.longDescription}</p>
                    </motion.div>
                  )}
                  {activeTab === 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      {seva.includes.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Check className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <span className="text-text-secondary">{item}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                  {activeTab === 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      {seva.rules.map((rule, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100">
                            <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                          </div>
                          <span className="text-text-secondary">{rule}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card variant="elevated" padding="lg" className="sticky top-24">
                <div className="text-center">
                  <p className="text-3xl font-heading font-bold text-primary">
                    {formatPrice(seva.price)}
                  </p>
                  <p className="text-sm text-text-muted mt-1">{seva.duration}</p>
                </div>
                <div className="mt-6 space-y-3">
                  <Link href={`/sevas/book/${slug}`}>
                    <Button variant="gradient" size="lg" className="w-full">
                      <Calendar className="h-4 w-4 mr-1" />
                      Book Now
                    </Button>
                  </Link>
                  <Link href="/sevas">
                    <Button variant="outline" size="lg" className="w-full">
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back to Sevas
                    </Button>
                  </Link>
                </div>
                <div className="mt-6 p-4 rounded-xl bg-bg-secondary">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-text-primary">Secure Booking</p>
                      <p className="text-xs text-text-muted mt-1">Your booking is protected with secure payment gateway</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {relatedSevas.length > 0 && (
            <section className="mt-16">
              <AnimatedSection>
                <h2 className="text-2xl font-heading font-bold text-text-primary mb-8">
                  Related Sevas
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedSevas.map((related, idx) => {
                    const RelIcon = related.icon
                    return (
                      <motion.div
                        key={related.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Link href={`/sevas/${related.name.toLowerCase().replace(/\s+/g, "-")}`}>
                          <Card variant="elevated" hover padding="md" className="h-full">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br", related.gradient)}>
                                <RelIcon className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-heading font-bold text-text-primary">{related.name}</h3>
                                <p className="text-xs text-text-muted">{related.category}</p>
                              </div>
                            </div>
                            <p className="text-sm text-text-secondary line-clamp-2">{related.description}</p>
                            <div className="mt-3 flex items-center gap-3 text-sm">
                              <span className="font-semibold text-primary">{formatPrice(related.price)}</span>
                              <span className="text-text-muted">{related.duration}</span>
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              </AnimatedSection>
            </section>
          )}
        </div>
      </section>
    </div>
  )
}
