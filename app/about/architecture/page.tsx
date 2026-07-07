"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Building, Image, Gem, Building2, Landmark, Search, X } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TEMPLE_NAME } from "@/lib/constants"

const features = [
  {
    title: "Sloping Terracotta-Tiled Roofs",
    description: "A distinctive feature influenced by Kerala architecture, the sloping terracotta-tiled roofs provide excellent drainage in the monsoon climate. The warm earth tones of the terracotta tiles contrast beautifully with the surrounding greenery, creating a picturesque silhouette against the sky.",
    icon: Building,
    highlight: "Kerala Influence",
  },
  {
    title: "No Gopurams",
    description: "Unlike typical Dravidian-style temples with towering gopurams, Sri Kalikamba Temple features a simpler, more intimate entrance. This architectural choice reflects the Kerala-Tulunadu style, emphasizing the sanctum rather than the entrance structure.",
    icon: Landmark,
    highlight: "Distinctive Style",
  },
  {
    title: "Neelanjana Granite Idol",
    description: "The main idol of Goddess Kalikamba is carved from rare Neelanjana granite, a dark, almost blue-black stone known for its exceptional hardness and smooth finish. The idol depicts the Goddess seated in padmasana with four arms, each holding symbolic objects.",
    icon: Gem,
    highlight: "Rare Material",
  },
  {
    title: "Camel Symbol (Pani Peetha)",
    description: "At the base of the idol, the camel symbol (Pani Peetha) is carved with intricate detail. This unique feature is a hallmark of Vishwakarma craftsmanship and holds deep symbolic meaning in the temple's iconography.",
    icon: Building2,
    highlight: "Vishwakarma Craftsmanship",
  },
]

const galleryPlaceholders = [
  { label: "Front View", category: "Exterior" },
  { label: "Sanctum Sanctorum", category: "Interior" },
  { label: "Roof Architecture", category: "Details" },
  { label: "Idol Close-up", category: "Idol" },
  { label: "Pani Peetha", category: "Details" },
  { label: "Temple Surroundings", category: "Exterior" },
]

function ArchitectureHighlight({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const Icon = feature.icon
  const isReversed = index % 2 !== 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col ${isReversed ? "md:flex-row-reverse" : "md:flex-row"} gap-8 lg:gap-16 items-center mb-20 last:mb-0`}
    >
      <div className="flex-1 w-full">
        <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border overflow-hidden relative group cursor-pointer">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center p-8">
              <Icon className="h-16 w-16 mx-auto text-primary/30 mb-3" />
              <p className="text-text-muted text-sm">{feature.highlight}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4">
        <Badge variant="secondary" size="sm">{feature.highlight}</Badge>
        <h3 className="text-2xl md:text-3xl font-heading font-bold text-primary">{feature.title}</h3>
        <p className="text-text-secondary leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  )
}

export default function ArchitecturePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <div className="min-h-screen">
      <section className="relative h-[60vh] min-h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/90 z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30 z-[1]" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block text-secondary/80 text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium">
              Sacred Architecture
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight">
              Architecture
            </h1>
            <p className="text-warm-white/80 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              A unique blend of Kerala and Tulunadu architectural styles — characterized by sloping terracotta-tiled roofs, exquisite granite craftsmanship, and profound symbolic design.
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-20" />
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-12">
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/about" className="hover:text-secondary transition-colors">About</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">Architecture</span>
          </div>

          <AnimatedSection>
            <SectionHeading
              title="Unique Architectural Heritage"
              subtitle="The architecture of Sri Kalikamba Temple stands as a testament to the skill and devotion of the Vishwakarma artisans who built it."
            />
          </AnimatedSection>

          <div className="mt-20">
            {features.map((feature, index) => (
              <ArchitectureHighlight key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-bg-secondary/50 to-bg-primary">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <SectionHeading
              title="Image Gallery"
              subtitle="Explore the architectural beauty of Sri Kalikamba Temple through our curated collection."
            />
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-16">
            {galleryPlaceholders.map((item, index) => (
              <AnimatedSection key={item.label} delay={index * 0.05}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedImage(item.label)}
                  className="aspect-[4/3] rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border overflow-hidden cursor-pointer relative group"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-3">
                        <Search className="h-6 w-6 text-secondary" />
                      </div>
                      <p className="text-text-primary font-medium text-sm">{item.label}</p>
                      <p className="text-text-muted text-xs mt-1">{item.category}</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Search className="h-8 w-8 text-warm-white" />
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <Card variant="elevated" className="p-8 lg:p-12 text-center">
              <h2 className="text-3xl font-heading font-bold text-primary">
                Experience the Architecture
              </h2>
              <p className="text-text-secondary mt-4 text-lg leading-relaxed max-w-2xl mx-auto">
                Visit the temple to experience its architectural splendor firsthand. The interplay of light and shadow, the texture of ancient stone, and the peaceful ambiance create an atmosphere of timeless spirituality.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Link href="/about/deity">
                  <span className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-light transition-colors">
                    Learn About the Deity <ChevronRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </Card>
          </AnimatedSection>
        </div>
      </section>

      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-3xl w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/20 overflow-hidden"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-white/60 text-lg">{selectedImage}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
