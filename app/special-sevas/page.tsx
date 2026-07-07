"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, ChevronRight, Clock, IndianRupee, Star, Heart, Droplets, Flame, Sun, Moon } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn, formatPrice } from "@/lib/utils"

const specialSevas = [
  {
    id: "satyanarayana-vrata",
    name: "Satyanarayana Vrata",
    description: "Sacred vow to Lord Satyanarayana for prosperity, peace, and fulfillment of wishes.",
    longDescription: "The Satyanarayana Vrata is a powerful ritual performed to seek the blessings of Lord Vishnu. This pooja is especially recommended for achieving peace, prosperity, and overcoming obstacles in life.",
    price: 2001,
    duration: "60 min",
    gradient: "from-blue-600 to-indigo-700",
    image: "https://picsum.photos/seed/satyanarayana/800/600",
    icon: Star,
    timing: "Any Auspicious Day",
  },
  {
    id: "rudrabhishekam",
    name: "Rudrabhishekam",
    description: "Powerful abhishekam to Lord Shiva with vedic chants for spiritual upliftment.",
    longDescription: "Rudrabhishekam is one of the most powerful rituals dedicated to Lord Shiva. The chanting of Sri Rudram while performing abhishekam with various sacred substances brings immense spiritual benefits.",
    price: 3001,
    duration: "90 min",
    gradient: "from-slate-700 to-gray-900",
    image: "https://picsum.photos/seed/rudrabhishekam/800/600",
    icon: Moon,
    timing: "Mondays / Pradosham",
  },
  {
    id: "ayush-homam",
    name: "Ayush Homam",
    description: "Fire ritual performed for long life, health, and protection from ailments.",
    longDescription: "Ayush Homam is a powerful fire ritual performed for longevity and good health. It is especially recommended for newborns, elderly, and those recovering from illnesses.",
    price: 3501,
    duration: "90 min",
    gradient: "from-green-600 to-emerald-700",
    image: "https://picsum.photos/seed/ayush-homam/800/600",
    icon: Flame,
    timing: "By Appointment",
  },
  {
    id: "maha-lakshmi-pooja",
    name: "Maha Lakshmi Pooja",
    description: "Elaborate worship of Goddess Lakshmi for wealth, abundance, and prosperity.",
    longDescription: "Maha Lakshmi Pooja is performed to invoke the grace of Goddess Lakshmi, the deity of wealth and prosperity. This ritual is especially powerful during Diwali and on Fridays.",
    price: 2501,
    duration: "60 min",
    gradient: "from-gold-500 to-amber-600",
    image: "https://picsum.photos/seed/lakshmi-pooja/800/600",
    icon: Heart,
    timing: "Fridays / Diwali",
  },
  {
    id: "saraswati-pooja",
    name: "Saraswati Pooja",
    description: "Worship of Goddess Saraswati for knowledge, wisdom, and academic success.",
    longDescription: "Saraswati Pooja is performed to seek the blessings of Goddess Saraswati for academic excellence, creativity, and spiritual knowledge. Ideal for students and professionals.",
    price: 1501,
    duration: "45 min",
    gradient: "from-pink-500 to-rose-600",
    image: "https://picsum.photos/seed/saraswati-pooja/800/600",
    icon: Star,
    timing: "Vasant Panchami / Navaratri",
  },
  {
    id: "graha-shanti",
    name: "Graha Shanti",
    description: "Planetary pacification rituals to mitigate negative astrological influences.",
    longDescription: "Graha Shanti homas are performed to pacify the nine planets and mitigate the negative effects of doshas in one's horoscope. Each graha has specific mantras and offerings.",
    price: 5001,
    duration: "120 min",
    gradient: "from-purple-600 to-violet-700",
    image: "https://picsum.photos/seed/graha-shanti/800/600",
    icon: Sun,
    timing: "By Astrological Recommendation",
  },
]

export default function SpecialSevasPage() {
  return (
    <div className="min-h-screen">
      <section className="relative h-[50vh] min-h-[380px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://picsum.photos/seed/special-sevas/1920/1080"
            alt="Special Sevas"
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
              Divine Grace
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight">
              Special <span className="gradient-text-gold">Sevas</span>
            </h1>
            <p className="text-warm-white/80 text-lg md:text-xl mt-6 max-w-2xl mx-auto">
              Specialized rituals for specific needs and divine blessings
            </p>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-10" />
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-text-muted mb-10"
          >
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">Special Sevas</span>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialSevas.map((seva, idx) => {
              const Icon = seva.icon
              return (
                <motion.div
                  key={seva.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <Card variant="elevated" padding="none" hover className="group h-full overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={seva.image}
                        alt={seva.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className={cn("absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent")} />
                      <div className="absolute bottom-3 left-4">
                        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg", seva.gradient)}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-heading font-bold text-text-primary group-hover:text-primary transition-colors">
                        {seva.name}
                      </h3>
                      <p className="mt-1.5 text-sm text-text-secondary leading-relaxed line-clamp-2">
                        {seva.description}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-bg-secondary text-text-muted">
                          <Clock className="h-3 w-3" />
                          {seva.duration}
                        </span>
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-bg-secondary text-text-muted">
                          <Star className="h-3 w-3" />
                          {seva.timing}
                        </span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                        <span className="flex items-center gap-1 text-lg font-bold font-heading text-primary">
                          <IndianRupee className="h-4 w-4" />
                          {seva.price.toLocaleString("en-IN")}
                        </span>
                        <Link href={`/sevas/${seva.id}`}>
                          <Button variant="gradient" size="sm" className="group/btn">
                            Book Now
                            <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
