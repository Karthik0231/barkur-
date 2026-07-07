"use client"

import Link from "next/link"
import { ChevronRight, Calendar, Star, Moon, Sun, Sparkles, Flower2, Trees } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TEMPLE_NAME } from "@/lib/constants"

const festivals = [
  {
    name: "Navaratri",
    season: "September-October",
    duration: "9 Days",
    description: "The most important festival at Sri Kalikamba Temple, Navaratri celebrates the nine divine forms of Goddess Durga. Each day is dedicated to a different aspect of the Divine Mother, with special rituals, alankaras, and cultural programs.",
    significance: "Celebrates the victory of good over evil. Goddess Durga's nine forms are worshipped with great devotion. The temple is beautifully decorated and special homams are performed daily.",
    highlights: ["Daily special alankara", "Cultural programs & music", "Kumari Pooja", "Sahasranama Archana", "Vijayadashami celebration"],
    icon: Star,
  },
  {
    name: "Deepavali",
    season: "October-November",
    duration: "3-5 Days",
    description: "The festival of lights celebrated with great enthusiasm at the temple. The entire temple complex is illuminated with thousands of oil lamps, creating a breathtaking spectacle of light and devotion.",
    significance: "Symbolizes the victory of light over darkness. Special Lakshmi pooja is performed for prosperity and abundance. The temple glows with the warmth of countless diyas.",
    highlights: ["Thousands of oil lamps", "Lakshmi Pooja", "Special abhisheka", "Prasada distribution"],
    icon: Sun,
  },
  {
    name: "Yugadi",
    season: "March-April",
    duration: "1 Day",
    description: "The Kannada New Year celebration marking the beginning of a new lunar calendar year. The temple hosts special poojas and the preparation of Yugadi Pachadi, a traditional dish symbolizing the varied experiences of life.",
    significance: "Marks new beginnings and the cyclical nature of time. The Yugadi Pachadi teaches acceptance of life's diverse experiences — sweet, sour, bitter, and spicy.",
    highlights: ["Panchanga Shravana", "Yugadi Pachadi preparation", "Special poojas", "New year blessings"],
    icon: Sparkles,
  },
  {
    name: "Maha Shivaratri",
    season: "February-March",
    duration: "1 Day",
    description: "The great night of Lord Shiva celebrated with night-long vigils, abhisheka, and chanting. Devotees stay awake through the night offering prayers and singing bhajans.",
    significance: "The night when Lord Shiva performed the cosmic dance. Staying awake and in prayer is believed to bring spiritual awakening and liberation.",
    highlights: ["Night-long vigil", "Rudra Abhisheka", "Bhajan sessions", "Special offerings"],
    icon: Moon,
  },
  {
    name: "Ganesha Chaturthi",
    season: "August-September",
    duration: "1-3 Days",
    description: "The birthday of Lord Ganesha celebrated with eco-friendly idols and traditional rituals. Special poojas and offerings are made to the elephant-headed deity.",
    significance: "Invokes Lord Ganesha's blessings for wisdom, prosperity, and removal of obstacles. The festival promotes environmental awareness through eco-friendly celebrations.",
    highlights: ["Eco-friendly celebration", "Special Ganesha pooja", "Modak offering", "Cultural events"],
    icon: Flower2,
  },
  {
    name: "Annual Brahmotsava",
    season: "Varies",
    duration: "5 Days",
    description: "The annual grand festival of Sri Kalikamba Temple featuring special rituals, processions, and cultural performances. The temple celebrates with great pomp and devotion.",
    significance: "The most important annual festival that brings the community together. Special homams, abhishekams, and processions mark this auspicious occasion.",
    highlights: ["Grand processions", "Special homams", "Cultural programs", "Feast for devotees"],
    icon: Trees,
  },
  {
    name: "Krishna Janmashtami",
    season: "August-September",
    duration: "1 Day",
    description: "The birth anniversary of Lord Krishna celebrated with devotional songs, dance, and the famous Dahi Handi event. The temple comes alive with the spirit of divine love.",
    significance: "Celebrates the incarnation of divine love and wisdom. Lord Krishna's teachings through the Bhagavad Gita are remembered and honored.",
    highlights: ["Midnight celebration", "Dahi Handi", "Bhajan & kirtan", "Prasada distribution"],
    icon: Flower2,
  },
  {
    name: "Ratha Saptami",
    season: "January-February",
    duration: "1 Day",
    description: "The festival celebrating the Sun God's northward journey (Uttarayana). Special Surya pooja is performed and the deity is given a special abhisheka with akshata.",
    significance: "Marks the beginning of the auspicious Uttarayana period. The Sun God is worshipped for health, vitality, and spiritual illumination.",
    highlights: ["Surya Namaskara", "Special abhisheka", "Akshata offering", "Health blessings"],
    icon: Sun,
  },
]

export default function FestivalsPage() {
  return (
    <div className="min-h-screen">
      <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/90 z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30 z-[1]" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <span className="inline-block text-secondary/80 text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium">
              Celebrations of Faith
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight">
              Festivals
            </h1>
            <p className="text-warm-white/80 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              Throughout the year, {TEMPLE_NAME} celebrates numerous festivals with traditional grandeur, bringing the community together in devotion and joy.
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
            <span className="text-text-primary font-medium">Festivals</span>
          </div>

          <AnimatedSection>
            <SectionHeading
              title="Festivals Celebrated"
              subtitle="Our temple celebrates all major Hindu festivals with traditional rituals, cultural programs, and community participation."
            />
          </AnimatedSection>

          <div className="space-y-8 mt-16">
            {festivals.map((festival, index) => {
              const Icon = festival.icon
              return (
                <AnimatedSection key={festival.name} delay={index * 0.05}>
                  <Card variant="elevated" className="p-6 lg:p-8 overflow-hidden relative" hover>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-secondary/5 to-transparent rounded-bl-full" />
                    <div className="flex flex-col lg:flex-row gap-6 relative z-10">
                      <div className="lg:w-64 shrink-0">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0">
                            <Icon className="h-7 w-7 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl lg:text-2xl font-heading font-bold text-primary">{festival.name}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="secondary" size="xs">
                                <Calendar className="h-3 w-3 mr-1" />
                                {festival.season}
                              </Badge>
                              <Badge variant="default" size="xs">{festival.duration}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-text-secondary leading-relaxed">{festival.description}</p>
                        <div className="mt-4 p-4 bg-bg-secondary/50 rounded-xl">
                          <p className="text-sm font-medium text-primary mb-2">Significance</p>
                          <p className="text-sm text-text-muted">{festival.significance}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {festival.highlights.map((h) => (
                            <Badge key={h} variant="subtle" size="sm">{h}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
