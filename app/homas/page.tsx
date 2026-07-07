"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Flame, ArrowRight, ChevronRight, Clock, IndianRupee, Star, Droplets, Shield, Zap, Sparkles } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { SectionHeading } from "@/components/section-heading"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn, formatPrice } from "@/lib/utils"

const homas = [
  {
    id: "chandi-homa",
    name: "Chandi Homa",
    description: "Powerful fire ritual invoking Goddess Durga for protection, victory, and spiritual growth.",
    longDescription: "Chandi Homa is the most powerful fire ritual performed to invoke the fierce and protective aspect of Goddess Durga. It eliminates negative energies and bestows courage.",
    price: 5001,
    duration: "120 min",
    gradient: "from-orange-700 to-red-800",
    image: "https://picsum.photos/seed/chandi-homa-list/800/600",
    icon: Flame,
    benefits: ["Victory over enemies", "Protection from negativity", "Spiritual elevation", "Courage and strength"],
  },
  {
    id: "maha-mrityunjaya-homa",
    name: "Maha Mrityunjaya Homa",
    description: "Sacred fire ritual for health, longevity, and protection from untimely death.",
    longDescription: "This powerful homa invokes Lord Shiva through the Maha Mrityunjaya mantra for healing, long life, and protection from fatal dangers.",
    price: 4001,
    duration: "90 min",
    gradient: "from-teal-600 to-cyan-700",
    image: "https://picsum.photos/seed/mrityunjaya-homa/800/600",
    icon: Shield,
    benefits: ["Health and healing", "Longevity", "Protection from accidents", "Peace of mind"],
  },
  {
    id: "ganapathi-homa",
    name: "Ganapathi Homa",
    description: "Invoke Lord Ganesha's blessings for removing obstacles and ensuring success.",
    longDescription: "Ganapathi Homa is performed at the beginning of any important venture to remove obstacles and seek the blessings of Lord Ganesha for success.",
    price: 2501,
    duration: "60 min",
    gradient: "from-red-600 to-rose-700",
    image: "https://picsum.photos/seed/ganapathi-homa/800/600",
    icon: Zap,
    benefits: ["Removes obstacles", "Success in endeavors", "Wisdom and intelligence", "Auspicious beginnings"],
  },
  {
    id: "suddha-homa",
    name: "Suddha Homa",
    description: "Purification fire ritual for cleansing negative energies from home and surroundings.",
    longDescription: "Suddha Homa is a purification ritual that cleanses the environment of negative energies and creates a positive, harmonious atmosphere.",
    price: 2001,
    duration: "45 min",
    gradient: "from-blue-600 to-indigo-700",
    image: "https://picsum.photos/seed/suddha-homa/800/600",
    icon: Droplets,
    benefits: ["Environmental purification", "Removes negativity", "Brings harmony", "Positive energy flow"],
  },
  {
    id: "navagraha-homa",
    name: "Navagraha Homa",
    description: "Pacify the nine planets and mitigate adverse astrological effects through fire offerings.",
    longDescription: "Navagraha Homa pacifies the nine celestial bodies, reducing the negative impact of planetary doshas and enhancing beneficial influences.",
    price: 6001,
    duration: "150 min",
    gradient: "from-purple-600 to-violet-700",
    image: "https://picsum.photos/seed/navagraha-homa/800/600",
    icon: Star,
    benefits: ["Planetary peace", "Dosha mitigation", "Astrological remedy", "Overall prosperity"],
  },
  {
    id: "sudarshana-homa",
    name: "Sudarshana Homa",
    description: "Invoke the divine disc of Lord Vishnu for protection from evil forces.",
    longDescription: "Sudarshana Homa invokes the Sudarshana Chakra of Lord Vishnu for divine protection against negative forces, black magic, and evil influences.",
    price: 4501,
    duration: "90 min",
    gradient: "from-amber-600 to-gold-700",
    image: "https://picsum.photos/seed/sudarshana-homa/800/600",
    icon: Sparkles,
    benefits: ["Divine protection", "Removes evil eye", "Spiritual security", "Victory over adversaries"],
  },
]

export default function HomasPage() {
  return (
    <div className="min-h-screen">
      <section className="relative h-[50vh] min-h-[380px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://picsum.photos/seed/homas-banner/1920/1080"
            alt="Sacred Homas"
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
              <Flame className="h-3.5 w-3.5 mr-1" />
              Sacred Fire Rituals
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight">
              Sacred <span className="gradient-text-gold">Homas</span>
            </h1>
            <p className="text-warm-white/80 text-lg md:text-xl mt-6 max-w-2xl mx-auto">
              Powerful fire rituals performed by qualified priests for specific spiritual and material benefits
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
            <span className="text-text-primary font-medium">Homas</span>
          </motion.div>

          <SectionHeading
            title="Our Sacred Fire Rituals"
            subtitle="Choose a homa that aligns with your spiritual needs"
            className="mb-12"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {homas.map((homa, idx) => {
              const Icon = homa.icon
              return (
                <motion.div
                  key={homa.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <Card variant="elevated" padding="none" hover className="group h-full overflow-hidden">
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={homa.image}
                        alt={homa.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" size="sm">
                          Homa
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-4">
                        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg", homa.gradient)}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-heading font-bold text-text-primary group-hover:text-primary transition-colors">
                        {homa.name}
                      </h3>
                      <p className="mt-1.5 text-sm text-text-secondary leading-relaxed line-clamp-2">
                        {homa.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {homa.benefits.slice(0, 2).map((b, bidx) => (
                          <span key={bidx} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-primary font-medium">
                            {b}
                          </span>
                        ))}
                        {homa.benefits.length > 2 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-bg-secondary text-text-muted">
                            +{homa.benefits.length - 2} more
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm font-semibold text-text-primary">
                          <IndianRupee className="h-3.5 w-3.5" />
                          <span>{homa.price.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-text-muted">
                          <Clock className="h-3 w-3" />
                          <span>{homa.duration}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-border/50">
                        <Link href={`/sevas/${homa.id}`}>
                          <Button variant="gradient" size="sm" className="w-full group/btn">
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
