"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Droplets, Flame, Music, Leaf, Gem, Bell, Wheat, Book, Star } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TEMPLE_NAME } from "@/lib/constants"

const rituals = [
  {
    name: "Abhisheka",
    category: "Pooja",
    description: "The sacred bathing of the deity with various auspicious substances including milk, curd, honey, ghee, sugar, sandalwood paste, and holy water. Each substance has specific spiritual significance.",
    significance: "Purifies the mind and body, removes negative karma, and invokes divine blessings. The abhisheka is believed to activate the spiritual energy of the idol.",
    timing: "Daily 7:00 AM & 4:30 PM",
    duration: "45 mins",
    icon: Droplets,
  },
  {
    name: "Mangalarati",
    category: "Arati",
    description: "The waving of lit lamps before the deity accompanied by Vedic chants and devotional songs. The arati is performed with a five-wick lamp (pancha-arati) representing the five elements.",
    significance: "Dispels darkness and negativity, brings auspiciousness, and creates a powerful spiritual atmosphere. The flame symbolizes the divine light of consciousness.",
    timing: "Daily 6:30 AM, 12:30 PM & 7:00 PM",
    duration: "20 mins",
    icon: Flame,
  },
  {
    name: "Alankara",
    category: "Decoration",
    description: "The elaborate decoration of the deity with silk garments, gold ornaments, and fresh flower garlands. Special alankaras are performed on festival days with unique themes.",
    significance: "Expresses devotion through beauty and artistry. Each ornament and garment has symbolic meaning and is offered with specific prayers.",
    timing: "Daily 8:00 AM",
    duration: "60 mins",
    icon: Gem,
  },
  {
    name: "Maha Pooja",
    category: "Pooja",
    description: "The grand worship ceremony following the Shodashopachara (sixteen offerings) tradition. Includes the chanting of sacred mantras, offering of incense, lamps, food, and flowers.",
    significance: "The most comprehensive worship ritual that engages all senses in devotion. It represents the complete surrender of the devotee to the divine.",
    timing: "Daily 9:00 AM",
    duration: "90 mins",
    icon: Music,
  },
  {
    name: "Deeparadhana",
    category: "Arati",
    description: "The evening lamp offering ceremony where hundreds of oil lamps are lit and offered to the deity. The temple is illuminated with lamps creating a mesmerizing spiritual ambiance.",
    significance: "Symbolizes the victory of light over darkness and knowledge over ignorance. The evening deeparadhana is a deeply moving spiritual experience.",
    timing: "Daily 6:00 PM",
    duration: "30 mins",
    icon: Star,
  },
  {
    name: "Archana",
    category: "Pooja",
    description: "Individual worship service where a devotee's name, gotra, and nakshatra are recited while offering sacred items to the deity. A personalized form of worship.",
    significance: "Creates a personal connection between the devotee and the deity. The chanting of the devotee's name ensures specific blessings for their wellbeing.",
    timing: "Throughout the day",
    duration: "15 mins",
    icon: Book,
  },
  {
    name: "Homam",
    category: "Homa",
    description: "The sacred fire ceremony where offerings are made into the consecrated fire while chanting Vedic mantras. Different homams are performed for specific purposes.",
    significance: "Fire transforms the offerings into spiritual energy that purifies the environment and carries prayers to the divine realms.",
    timing: "By appointment",
    duration: "60-180 mins",
    icon: Flame,
  },
  {
    name: "Annadana",
    category: "Seva",
    description: "The offering of food to the deity which is later distributed as prasada to devotees. This sacred tradition ensures no devotee leaves the temple hungry.",
    significance: "Considered one of the highest forms of charity. Feeding others is believed to bring immense spiritual merit and divine blessings.",
    timing: "Daily 12:00 PM",
    duration: "Ongoing",
    icon: Wheat,
  },
  {
    name: "Nada Darshana",
    category: "Darshana",
    description: "The first darshana of the day when the sanctum sanctorum is opened. Devotees can witness the deity in Her morning splendor before the day's rituals begin.",
    significance: "The first glimpse of the deity sets the spiritual tone for the day. Early morning darshana is considered highly auspicious.",
    timing: "Daily 6:00 AM",
    duration: "15 mins",
    icon: Bell,
  },
  {
    name: "Rajopachara Pooja",
    category: "Pooja",
    description: "The royal worship ceremony treating the deity as a sovereign monarch. Includes sixteen grand offerings including royal bath, garments, ornaments, and feast.",
    significance: "Expresses the devotee's reverence for the divine as the supreme ruler of the universe. It is a complete act of surrender and devotion.",
    timing: "Daily 12:00 PM",
    duration: "60 mins",
    icon: Leaf,
  },
]

const categories = ["All", "Pooja", "Arati", "Homa", "Seva", "Darshana", "Decoration"]

export default function RitualsPage() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filtered = activeCategory === "All" ? rituals : rituals.filter((r) => r.category === activeCategory)

  return (
    <div className="min-h-screen">
      <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/90 z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30 z-[1]" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <span className="inline-block text-secondary/80 text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium">
              Sacred Traditions
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight">
              Rituals
            </h1>
            <p className="text-warm-white/80 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              Discover the rich tapestry of rituals and ceremonies performed at {TEMPLE_NAME}, each with deep spiritual significance and ancient origins.
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
            <span className="text-text-primary font-medium">Rituals</span>
          </div>

          <AnimatedSection>
            <SectionHeading
              title="Temple Rituals"
              subtitle="Each ritual at our temple is performed with meticulous attention to tradition and spiritual precision."
            />
          </AnimatedSection>

          <div className="flex flex-wrap gap-3 justify-center mt-12 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary text-warm-white shadow-md"
                    : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {filtered.map((ritual, index) => {
              const Icon = ritual.icon
              return (
                <AnimatedSection key={ritual.name} delay={index * 0.03}>
                  <Card variant="elevated" className="p-6 lg:p-8" hover>
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                          <div>
                            <h3 className="text-xl font-heading font-bold text-primary">{ritual.name}</h3>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <Badge variant="primary" size="xs">{ritual.category}</Badge>
                              <Badge variant="default" size="xs">{ritual.timing}</Badge>
                              <Badge variant="subtle" size="xs">{ritual.duration}</Badge>
                            </div>
                          </div>
                        </div>
                        <p className="text-text-secondary mt-3 leading-relaxed">{ritual.description}</p>
                        <div className="mt-3 p-4 bg-bg-secondary/50 rounded-xl">
                          <p className="text-sm font-medium text-primary">Significance</p>
                          <p className="text-sm text-text-muted mt-1">{ritual.significance}</p>
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
