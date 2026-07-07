"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Shield, Infinity, Crosshair, Gem, Quote } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TEMPLE_NAME } from "@/lib/constants"

const significance = [
  {
    icon: Shield,
    title: "Protection from Evil",
    description: "Goddess Kalikamba shields her devotees from negative energies and malevolent forces, creating a spiritual armor of divine grace.",
  },
  {
    icon: Infinity,
    title: "Salvation (Moksha)",
    description: "Through sincere worship, the Goddess grants liberation from the cycle of birth and death, leading the soul to its ultimate destination.",
  },
  {
    icon: Crosshair,
    title: "Destruction of Ego",
    description: "The Divine Mother annihilates the ego (ahankara) of her devotees, helping them realize their true spiritual nature beyond the illusion of self.",
  },
  {
    icon: Gem,
    title: "Liberation",
    description: "She bestows final liberation (kaivalya) upon those who surrender completely, freeing them from all worldly attachments and suffering.",
  },
]

const shlokas = [
  {
    text: "Jayantii Manggalaa Kaalii Bhadrakaalii Kapaalini | Durgaa Kshamaa Shivaa Dhaatri Svaahaa Svadhaa Namo\u0027stu Te ||",
    translation: "Salutations to You, O Goddess, who are Jayanti, Mangala, Kali, Bhadrakali, Kapalini, Durga, Kshama, Shiva, Dhatri, Svaha, and Svadha. We bow to You.",
    meaning: "This sacred verse invokes the Goddess in her various divine forms, acknowledging her multifaceted nature as the supreme protector and nurturer of the universe.",
  },
  {
    text: "Om Maha Kalyai Ca Vidmahe | Smashana Vasinyai Ca Dhimahi | Tanno Kali Prachodayat ||",
    translation: "Om. Let us meditate on the Great Kali who resides in the cremation ground. May that Kali illuminate our minds and guide us on the path of righteousness.",
    meaning: "This powerful mantra from the Kalika Upanishad invokes the transformative power of the Goddess, helping devotees overcome the fear of death and realize the eternal nature of the soul.",
  },
]

const mantras = [
  { title: "Sri Kalikamba Ashtakam", description: "An eight-verse hymn praising the glory and attributes of Goddess Kalikamba.", type: "Stotra" },
  { title: "Kalika Sahasranama", description: "The thousand names of Goddess Kali, each name revealing a different aspect of her divine nature.", type: "Stotra" },
  { title: "Sri Kalikamba Kavacham", description: "A protective hymn that shields the devotee from all negative influences.", type: "Kavacham" },
  { title: "Kalika Gayatri Mantra", description: "The Gayatri mantra of Goddess Kali for meditation and spiritual advancement.", type: "Mantra" },
]

function ShlokaCard({ shloka, index }: { shloka: typeof shlokas[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card variant="elevated" className="p-6 lg:p-8 border-l-4 border-secondary">
        <div className="flex gap-3 mb-4">
          <Quote className="h-6 w-6 text-secondary shrink-0 mt-1" />
          <p className="text-lg font-heading text-primary italic leading-relaxed sanskrit">
            {shloka.text}
          </p>
        </div>
        <div className="pl-9 space-y-4">
          <div>
            <Badge variant="subtle" size="sm">Translation</Badge>
            <p className="text-text-secondary mt-2 leading-relaxed">{shloka.translation}</p>
          </div>
          <div>
            <Badge variant="subtle" size="sm">Meaning</Badge>
            <p className="text-text-muted mt-2 text-sm leading-relaxed">{shloka.meaning}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default function DeityPage() {
  return (
    <div className="min-h-screen">
      <section className="relative h-[65vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-primary/95 z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30 z-[1]" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block text-secondary/80 text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium">
              The Presiding Deity
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight">
              Goddess Kalikamba
            </h1>
            <p className="text-warm-white/80 text-lg md:text-xl mt-6 max-w-3xl mx-auto leading-relaxed">
              The Divine Mother, seated in grace upon her sacred throne — a magnificent embodiment of power, compassion, and spiritual liberation.
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
            <span className="text-text-primary font-medium">Deity</span>
          </div>

          <AnimatedSection>
            <SectionHeading
              title="The Divine Form"
              subtitle="Goddess Kalikamba is worshipped in her magnificent form, carved from rare Neelanjana granite, seated in padmasana with four arms holding divine symbols."
            />
          </AnimatedSection>

          <AnimatedSection delay={0.15} className="mt-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="aspect-square max-w-md mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-border overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center p-8">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-secondary/30 flex items-center justify-center mb-4">
                        <span className="text-4xl">🕉</span>
                      </div>
                      <p className="text-text-muted text-sm">Divine Idol of Goddess Kalikamba</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-heading font-bold text-primary">The Sacred Idol</h3>
                  <p className="text-text-secondary mt-3 leading-relaxed">
                    The main idol of Goddess Kalikamba is a masterpiece of spiritual artistry. Carved from rare <strong>Neelanjana granite</strong>, a dark blue-black stone known for its exceptional quality, the idol radiates a profound divine presence that captivates all who behold it.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-heading font-bold text-primary flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-secondary" />
                    Seated in Padmasana
                  </h4>
                  <p className="text-text-secondary leading-relaxed pl-5">
                    The Goddess is seated in the lotus pose (padmasana), symbolizing purity, spiritual perfection, and transcendence above worldly concerns. The lotus seat represents detachment from material existence while remaining rooted in divine consciousness.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-heading font-bold text-primary flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-secondary" />
                    Four Arms of Divine Power
                  </h4>
                  <p className="text-text-secondary leading-relaxed pl-5">
                    The Goddess holds four symbolic objects in her hands, each representing a unique aspect of her divine power:
                  </p>
                  <div className="grid grid-cols-2 gap-3 pl-5 mt-3">
                    {[
                      { name: "Trishula (Trident)", meaning: "Power over the three gunas" },
                      { name: "Damaru (Drum)", meaning: "The cosmic sound of creation" },
                      { name: "Khadga (Sword)", meaning: "Destruction of ignorance" },
                      { name: "Cup (Paanapatra)", meaning: "Bestower of blessings" },
                    ].map((item) => (
                      <div key={item.name} className="bg-bg-secondary/50 rounded-lg p-3">
                        <p className="text-sm font-semibold text-primary">{item.name}</p>
                        <p className="text-xs text-text-muted mt-0.5">{item.meaning}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-heading font-bold text-primary flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-secondary" />
                    Camel Symbol (Pani Peetha)
                  </h4>
                  <p className="text-text-secondary leading-relaxed pl-5">
                    At the base of the idol, the camel symbol (Pani Peetha) is carved with intricate detail. This unique iconographic element is a hallmark of Vishwakarma craftsmanship and represents the vehicle (vahana) of the Goddess in this form.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-bg-secondary/50 to-bg-primary">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <SectionHeading
              title="Divine Significance"
              subtitle="Goddess Kalikamba bestows four supreme blessings upon her devoted worshippers."
            />
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {significance.map((item, index) => {
              const Icon = item.icon
              return (
                <AnimatedSection key={item.title} delay={index * 0.1}>
                  <Card variant="glass" className="p-6 lg:p-8 text-center h-full" hover>
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-5">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-primary mb-3">{item.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{item.description}</p>
                  </Card>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <SectionHeading
              title="Sacred Shlokas"
              subtitle="Powerful verses dedicated to Goddess Kalikamba, with translations and meanings."
            />
          </AnimatedSection>

          <div className="mt-16 space-y-6">
            {shlokas.map((shloka, index) => (
              <ShlokaCard key={index} shloka={shloka} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-bg-secondary/50 to-bg-primary">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <SectionHeading
              title="Mantras & Stotras"
              subtitle="Sacred hymns and protective chants dedicated to the Divine Mother."
            />
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 gap-6 mt-16">
            {mantras.map((mantra, index) => (
              <AnimatedSection key={mantra.title} delay={index * 0.1}>
                <Card variant="elevated" className="p-6 lg:p-8 h-full" hover>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-heading font-bold text-primary">{mantra.title}</h3>
                    <Badge variant="secondary" size="xs">{mantra.type}</Badge>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">{mantra.description}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">
              Offer Your Prayers
            </h2>
            <p className="text-text-secondary mt-4 text-lg leading-relaxed max-w-xl mx-auto">
              Visit the temple to offer your prayers to Goddess Kalikamba and experience her divine grace. All devotees are welcome to participate in the daily rituals and seek the Mother's blessings.
            </p>
            <Link href="/timings">
              <span className="inline-flex items-center gap-2 mt-6 text-primary font-medium hover:text-primary-light transition-colors">
                View Temple Timings <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
