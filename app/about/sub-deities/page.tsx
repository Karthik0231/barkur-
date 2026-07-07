"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const subDeities = [
  {
    name: "Lord Ganesha",
    title: "Vighnaharta",
    description: "The remover of obstacles, Lord Ganesha is worshipped first in all Hindu rituals. His shrine is located at the entrance of the temple, blessing all who enter.",
    significance: "God of wisdom, prosperity, and good fortune",
    symbol: "Elephant-headed deity",
  },
  {
    name: "Lord Shiva",
    title: "Mahadeva",
    description: "The destroyer of evil and the transformer within the Hindu trinity. Lord Shiva's presence in the temple complex adds to its spiritual potency.",
    significance: "Destroyer of evil, cosmic dancer",
    symbol: "Lingam & trishula",
  },
  {
    name: "Lord Vishnu",
    title: "Palaka",
    description: "The preserver and protector of the universe, Lord Vishnu is revered for his compassion and his incarnations that restore cosmic order.",
    significance: "Preserver of the universe",
    symbol: "Shankha, chakra, gada",
  },
  {
    name: "Goddess Saraswati",
    title: "Vidyadayini",
    description: "The goddess of knowledge, music, arts, and learning. Her presence blesses the Vishwa Brahmana Sanskrit Vidyapeetha and all students.",
    significance: "Goddess of knowledge and arts",
    symbol: "Veena, book, rosary",
  },
  {
    name: "Goddess Lakshmi",
    title: "Aishwaryadayini",
    description: "The goddess of wealth, fortune, and prosperity. Devotees seek her blessings for material and spiritual abundance.",
    significance: "Goddess of wealth and prosperity",
    symbol: "Lotus, gold coins",
  },
  {
    name: "Lord Hanuman",
    title: "Bajrangbali",
    description: "The embodiment of devotion, strength, and selfless service. Lord Hanuman's presence inspires devotees with courage and faith.",
    significance: "Symbol of devotion and strength",
    symbol: "Mace, mountain",
  },
  {
    name: "Navagrahas",
    title: "The Nine Planets",
    description: "The nine celestial deities who influence human destiny. Their shrine helps devotees mitigate planetary afflictions and seek cosmic harmony.",
    significance: "Celestial deities governing destiny",
    symbol: "Nine planetary forms",
  },
  {
    name: "Bhairava",
    title: "Kshyetrapala",
    description: "The fierce form of Lord Shiva, Bhairava is the guardian of the temple and protects it from negative forces. He ensures the sanctity of the sacred space.",
    significance: "Guardian deity of the temple",
    symbol: "Dog vahana, trident",
  },
]

export default function SubDeitiesPage() {
  return (
    <div className="min-h-screen">
      <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/90 z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30 z-[1]" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <span className="inline-block text-secondary/80 text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium">
              Divine Companions
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight">
              Sub-Deities
            </h1>
            <p className="text-warm-white/80 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              The temple complex houses several shrines dedicated to various deities, each contributing to the spiritual ecosystem of this sacred space.
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
            <Link href="/about" className="hover:text-secondary transition-colors">About</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">Sub-Deities</span>
          </div>

          <AnimatedSection>
            <SectionHeading
              title="Associated Deities"
              subtitle="The temple is home to numerous deities, each with their unique significance and blessings."
            />
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-16">
            {subDeities.map((deity, index) => (
              <AnimatedSection key={deity.name} delay={index * 0.05}>
                <Card variant="elevated" className="p-6 lg:p-8 h-full text-center" hover>
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-secondary/20 flex items-center justify-center mb-4">
                    <span className="text-3xl text-secondary">◇</span>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-primary">{deity.name}</h3>
                  <p className="text-xs text-secondary font-semibold tracking-wider uppercase mt-1">{deity.title}</p>
                  <p className="text-text-secondary text-sm mt-3 leading-relaxed">{deity.description}</p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-text-muted">
                      <span className="font-semibold text-text-primary">Significance:</span> {deity.significance}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      <span className="font-semibold text-text-primary">Symbol:</span> {deity.symbol}
                    </p>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
