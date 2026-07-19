"use client"

import { useRef, useMemo } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Shield, Infinity, Crosshair, Gem, Quote } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageBanner } from "@/components/PageBanner"
import { useTranslation } from "@/lib/i18n"

function ShlokaCard({ shloka, index }: { shloka: { text: string; translation: string; meaning: string }; index: number }) {
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
  const { t, language } = useTranslation()

  const significance = useMemo(() => [
    {
      icon: Shield,
      title: language === "kn" ? "ಕೆಡುಕಿನಿಂದ ರಕ್ಷಣೆ" : "Protection from Evil",
      description: language === "kn"
        ? "ದೇವಿ ಕಾಳಿಕಾಂಬಾ ತಮ್ಮ ಭಕ್ತರನ್ನು ನಕಾರಾತ್ಮಕ ಶಕ್ತಿಗಳು ಮತ್ತು ದುಷ್ಟ ಶಕ್ತಿಗಳಿಂದ ರಕ್ಷಿಸುತ್ತಾರೆ, ದೈವಿಕ ಅನುಗ್ರಹದ ಆಧ್ಯಾತ್ಮಿಕ ಕವಚವನ್ನು ಸೃಷ್ಟಿಸುತ್ತಾರೆ."
        : "Goddess Kalikamba shields her devotees from negative energies and malevolent forces, creating a spiritual armor of divine grace.",
    },
    {
      icon: Infinity,
      title: language === "kn" ? "ಮೋಕ್ಷ" : "Salvation (Moksha)",
      description: language === "kn"
        ? "ಪ್ರಾಮಾಣಿಕ ಆರಾಧನೆಯ ಮೂಲಕ, ದೇವಿಯು ಜನ್ಮ ಮತ್ತು ಮರಣದ ಚಕ್ರದಿಂದ ವಿಮೋಚನೆಯನ್ನು ನೀಡುತ್ತಾಳೆ, ಆತ್ಮವನ್ನು ಅದರ ಅಂತಿಮ ಗಮ್ಯಸ್ಥಾನಕ್ಕೆ ಕರೆದೊಯ್ಯುತ್ತಾಳೆ."
        : "Through sincere worship, the Goddess grants liberation from the cycle of birth and death, leading the soul to its ultimate destination.",
    },
    {
      icon: Crosshair,
      title: language === "kn" ? "ಅಹಂಕಾರ ನಾಶ" : "Destruction of Ego",
      description: language === "kn"
        ? "ದಿವ್ಯ ಮಾತೆಯು ತನ್ನ ಭಕ್ತರ ಅಹಂಕಾರವನ್ನು ನಾಶಪಡಿಸುತ್ತಾಳೆ, ಸ್ವಯಂ ಭ್ರಮೆಯನ್ನು ಮೀರಿ ಅವರ ನಿಜವಾದ ಆಧ್ಯಾತ್ಮಿಕ ಸ್ವರೂಪವನ್ನು ಅರಿತುಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತಾಳೆ."
        : "The Divine Mother annihilates the ego (ahankara) of her devotees, helping them realize their true spiritual nature beyond the illusion of self.",
    },
    {
      icon: Gem,
      title: language === "kn" ? "ಕೈವಲ್ಯ" : "Liberation",
      description: language === "kn"
        ? "ಸಂಪೂರ್ಣವಾಗಿ ಶರಣಾಗತರಾದವರಿಗೆ ಅಂತಿಮ ವಿಮೋಚನೆಯನ್ನು (ಕೈವಲ್ಯ) ನೀಡುತ್ತಾಳೆ, ಎಲ್ಲಾ ಲೌಕಿಕ ಆಸಕ್ತಿಗಳು ಮತ್ತು ಸಂಕಟಗಳಿಂದ ಮುಕ್ತಗೊಳಿಸುತ್ತಾಳೆ."
        : "She bestows final liberation (kaivalya) upon those who surrender completely, freeing them from all worldly attachments and suffering.",
    },
  ], [language])

  const shlokas = useMemo(() => [
    {
      text: "Jayantii Manggalaa Kaalii Bhadrakaalii Kapaalini | Durgaa Kshamaa Shivaa Dhaatri Svaahaa Svadhaa Namo\u0027stu Te ||",
      translation: language === "kn"
        ? "ಓ ದೇವಿ, ನೀವು ಜಯಂತಿ, ಮಂಗಳಾ, ಕಾಳಿ, ಭದ್ರಕಾಳಿ, ಕಪಾಲಿನಿ, ದುರ್ಗಾ, ಕ್ಷಮಾ, ಶಿವಾ, ಧಾತ್ರಿ, ಸ್ವಾಹಾ ಮತ್ತು ಸ್ವಧಾ — ಎಲ್ಲ ರೂಪಗಳಿಗೆ ನಮಸ್ಕಾರಗಳು."
        : "Salutations to You, O Goddess, who are Jayanti, Mangala, Kali, Bhadrakali, Kapalini, Durga, Kshama, Shiva, Dhatri, Svaha, and Svadha. We bow to You.",
      meaning: language === "kn"
        ? "ಈ ಪವಿತ್ರ ಶ್ಲೋಕವು ದೇವಿಯನ್ನು ಅವಳ ವಿವಿಧ ದಿವ್ಯ ರೂಪಗಳಲ್ಲಿ ಆವಾಹಿಸುತ್ತದೆ, ಬ್ರಹ್ಮಾಂಡದ ಪರಮ ರಕ್ಷಕ ಮತ್ತು ಪೋಷಕಳಾಗಿ ಅವಳ ಬಹುಮುಖ ಸ್ವಭಾವವನ್ನು ಗುರುತಿಸುತ್ತದೆ."
        : "This sacred verse invokes the Goddess in her various divine forms, acknowledging her multifaceted nature as the supreme protector and nurturer of the universe.",
    },
    {
      text: "Om Maha Kalyai Ca Vidmahe | Smashana Vasinyai Ca Dhimahi | Tanno Kali Prachodayat ||",
      translation: language === "kn"
        ? "ಓಂ. ಶ್ಮಶಾನ ವಾಸಿನಿಯಾದ ಮಹಾ ಕಾಳಿಯನ್ನು ನಾವು ಧ್ಯಾನಿಸುತ್ತೇವೆ. ಆ ಕಾಳಿಯು ನಮ್ಮ ಮನಸ್ಸನ್ನು ಬೆಳಗಿಸಲಿ ಮತ್ತು ಸದ್ಮಾರ್ಗದಲ್ಲಿ ಮಾರ್ಗದರ್ಶಿಸಲಿ."
        : "Om. Let us meditate on the Great Kali who resides in the cremation ground. May that Kali illuminate our minds and guide us on the path of righteousness.",
      meaning: language === "kn"
        ? "ಕಾಳಿಕಾ ಉಪನಿಷತ್ತಿನ ಈ ಶಕ್ತಿಯುತ ಮಂತ್ರವು ದೇವಿಯ ಪರಿವರ್ತನ ಶಕ್ತಿಯನ್ನು ಆವಾಹಿಸುತ್ತದೆ, ಭಕ್ತರು ಮರಣದ ಭಯವನ್ನು ನಿವಾರಿಸಿಕೊಳ್ಳಲು ಮತ್ತು ಆತ್ಮದ ಶಾಶ್ವತ ಸ್ವರೂಪವನ್ನು ಅರಿತುಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ."
        : "This powerful mantra from the Kalika Upanishad invokes the transformative power of the Goddess, helping devotees overcome the fear of death and realize the eternal nature of the soul.",
    },
  ], [language])

  const mantras = useMemo(() => [
    { title: language === "kn" ? "ಶ್ರೀ ಕಾಳಿಕಾಂಬಾ ಅಷ್ಟಕಂ" : "Sri Kalikamba Ashtakam", description: language === "kn" ? "ದೇವಿ ಕಾಳಿಕಾಂಬಾ ಅವರ ಮಹಿಮೆ ಮತ್ತು ಗುಣಗಳನ್ನು ಸ್ತುತಿಸುವ ಎಂಟು ಶ್ಲೋಕಗಳ ಸ್ತೋತ್ರ." : "An eight-verse hymn praising the glory and attributes of Goddess Kalikamba.", type: "Stotra" },
    { title: language === "kn" ? "ಕಾಳಿಕಾ ಸಹಸ್ರನಾಮ" : "Kalika Sahasranama", description: language === "kn" ? "ದೇವಿ ಕಾಳಿಯ ಸಾವಿರ ನಾಮಗಳು, ಪ್ರತಿಯೊಂದು ನಾಮವು ಅವಳ ದೈವಿಕ ಸ್ವಭಾವದ ವಿಭಿನ್ನ ಅಂಶವನ್ನು ಪ್ರಕಟಿಸುತ್ತದೆ." : "The thousand names of Goddess Kali, each name revealing a different aspect of her divine nature.", type: "Stotra" },
    { title: language === "kn" ? "ಶ್ರೀ ಕಾಳಿಕಾಂಬಾ ಕವಚಂ" : "Sri Kalikamba Kavacham", description: language === "kn" ? "ಭಕ್ತರನ್ನು ಎಲ್ಲಾ ನಕಾರಾತ್ಮಕ ಪ್ರಭಾವಗಳಿಂದ ರಕ್ಷಿಸುವ ರಕ್ಷಾಸ್ತೋತ್ರ." : "A protective hymn that shields the devotee from all negative influences.", type: "Kavacham" },
    { title: language === "kn" ? "ಕಾಳಿಕಾ ಗಾಯತ್ರಿ ಮಂತ್ರ" : "Kalika Gayatri Mantra", description: language === "kn" ? "ಧ್ಯಾನ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಪ್ರಗತಿಗಾಗಿ ದೇವಿ ಕಾಳಿಯ ಗಾಯತ್ರಿ ಮಂತ್ರ." : "The Gayatri mantra of Goddess Kali for meditation and spiritual advancement.", type: "Mantra" },
  ], [language])

  return (
    <div className="min-h-screen">
      <PageBanner
        title={t("pages.aboutDeity.title")}
        subtitle={t("pages.aboutDeity.subtitle")}
        eyebrow={t("pages.aboutDeity.eyebrow")}
      />

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-12">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/about" className="hover:text-secondary transition-colors">{t("nav.about")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.deity")}</span>
          </div>

          <AnimatedSection>
            <SectionHeading
              title={t("sections.aboutDeityS1Title")}
              subtitle={t("sections.aboutDeityS1Sub")}
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
                      <p className="text-text-muted text-sm">{language === "kn" ? "ದೇವಿ ಕಾಳಿಕಾಂಬಾ ಅವರ ದಿವ್ಯ ವಿಗ್ರಹ" : "Divine Idol of Goddess Kalikamba"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-heading font-bold text-primary">
                    {language === "kn" ? "ಪವಿತ್ರ ವಿಗ್ರಹ" : "The Sacred Idol"}
                  </h3>
                  {language === "kn" ? (
                    <p className="text-text-secondary mt-3 leading-relaxed">
                      ದೇವಿ ಕಾಳಿಕಾಂಬಾ ಅವರ ಮುಖ್ಯ ವಿಗ್ರಹವು ಆಧ್ಯಾತ್ಮಿಕ ಕಲಾತ್ಮಕತೆಯ ಮೇರುಕೃತಿಯಾಗಿದೆ. ಅಪರೂಪದ <strong>ನೀಲಾಂಜನ ಗ್ರಾನೈಟ್</strong> ನಿಂದ ಕೆತ್ತಲಾಗಿದೆ, ಗಾಢ ನೀಲಿ-ಕಪ್ಪು ಕಲ್ಲು ಅದರ ಅಸಾಧಾರಣ ಗುಣಮಟ್ಟಕ್ಕೆ ಹೆಸರುವಾಸಿಯಾಗಿದೆ, ಈ ವಿಗ್ರಹವು ನೋಡುಗರನ್ನು ಮಂತ್ರಮುಗ್ಧಗೊಳಿಸುವ ಆಳವಾದ ದೈವಿಕ ಸಾನ್ನಿಧ್ಯವನ್ನು ಪ್ರಸರಿಸುತ್ತದೆ.
                    </p>
                  ) : (
                    <p className="text-text-secondary mt-3 leading-relaxed">
                      The main idol of Goddess Kalikamba is a masterpiece of spiritual artistry. Carved from rare <strong>Neelanjana granite</strong>, a dark blue-black stone known for its exceptional quality, the idol radiates a profound divine presence that captivates all who behold it.
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-heading font-bold text-primary flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-secondary" />
                    {language === "kn" ? "ಪದ್ಮಾಸನದಲ್ಲಿ ವಿರಾಜಮಾನರು" : "Seated in Padmasana"}
                  </h4>
                  <p className="text-text-secondary leading-relaxed pl-5">
                    {language === "kn"
                      ? "ದೇವಿಯು ಪದ್ಮಾಸನದಲ್ಲಿ ವಿರಾಜಮಾನರಾಗಿದ್ದಾರೆ, ಇದು ಶುದ್ಧತೆ, ಆಧ್ಯಾತ್ಮಿಕ ಪರಿಪೂರ್ಣತೆ ಮತ್ತು ಲೌಕಿಕ ಚಿಂತೆಗಳನ್ನು ಮೀರಿದ ಸ್ಥಿತಿಯನ್ನು ಸಂಕೇತಿಸುತ್ತದೆ. ಕಮಲದ ಆಸನವು ದೈವಿಕ ಪ್ರಜ್ಞೆಯಲ್ಲಿ ಬೇರೂರಿರುವಾಗ ಭೌತಿಕ ಅಸ್ತಿತ್ವದಿಂದ ವಿಮುಕ್ತಿಯನ್ನು ಪ್ರತಿನಿಧಿಸುತ್ತದೆ."
                      : "The Goddess is seated in the lotus pose (padmasana), symbolizing purity, spiritual perfection, and transcendence above worldly concerns. The lotus seat represents detachment from material existence while remaining rooted in divine consciousness."}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-heading font-bold text-primary flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-secondary" />
                    {language === "kn" ? "ದಿವ್ಯ ಶಕ್ತಿಯ ನಾಲ್ಕು ಭುಜಗಳು" : "Four Arms of Divine Power"}
                  </h4>
                  <p className="text-text-secondary leading-relaxed pl-5">
                    {language === "kn"
                      ? "ದೇವಿಯು ತನ್ನ ಕೈಗಳಲ್ಲಿ ನಾಲ್ಕು ಸಾಂಕೇತಿಕ ವಸ್ತುಗಳನ್ನು ಹಿಡಿದಿದ್ದಾಳೆ, ಪ್ರತಿಯೊಂದೂ ಅವಳ ದಿವ್ಯ ಶಕ್ತಿಯ ಒಂದು ವಿಶಿಷ್ಟ ಅಂಶವನ್ನು ಪ್ರತಿನಿಧಿಸುತ್ತದೆ:"
                      : "The Goddess holds four symbolic objects in her hands, each representing a unique aspect of her divine power:"}
                  </p>
                  <div className="grid grid-cols-2 gap-3 pl-5 mt-3">
                    {[
                      { name: "Trishula (Trident)", meaning: language === "kn" ? "ಮೂರು ಗುಣಗಳ ಮೇಲಿನ ಅಧಿಕಾರ" : "Power over the three gunas" },
                      { name: "Damaru (Drum)", meaning: language === "kn" ? "ಸೃಷ್ಟಿಯ ಬ್ರಹ್ಮಾಂಡೀಯ ಧ್ವನಿ" : "The cosmic sound of creation" },
                      { name: "Khadga (Sword)", meaning: language === "kn" ? "ಅಜ್ಞಾನದ ನಾಶ" : "Destruction of ignorance" },
                      { name: "Cup (Paanapatra)", meaning: language === "kn" ? "ಆಶೀರ್ವಾದ ನೀಡುಗ" : "Bestower of blessings" },
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
                    {language === "kn" ? "ಒಂಟೆ ಚಿಹ್ನೆ (ಪಾಣಿ ಪೀಠ)" : "Camel Symbol (Pani Peetha)"}
                  </h4>
                  <p className="text-text-secondary leading-relaxed pl-5">
                    {language === "kn"
                      ? "ವಿಗ್ರಹದ ತಳದಲ್ಲಿ, ಒಂಟೆ ಚಿಹ್ನೆಯನ್ನು (ಪಾಣಿ ಪೀಠ) ನಿಖರವಾದ ಕೆತ್ತನೆಯಿಂದ ಅಲಂಕರಿಸಲಾಗಿದೆ. ಈ ಅನನ್ಯ ಪ್ರತಿಮಾಶಾಸ್ತ್ರದ ಅಂಶವು ವಿಶ್ವಕರ್ಮ ಕರಕುಶಲತೆಯ ಗುರುತಾಗಿದೆ ಮತ್ತು ಈ ರೂಪದಲ್ಲಿ ದೇವಿಯ ವಾಹನವನ್ನು ಪ್ರತಿನಿಧಿಸುತ್ತದೆ."
                      : "At the base of the idol, the camel symbol (Pani Peetha) is carved with intricate detail. This unique iconographic element is a hallmark of Vishwakarma craftsmanship and represents the vehicle (vahana) of the Goddess in this form."}
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
              title={t("sections.aboutDeityS2Title")}
              subtitle={t("sections.aboutDeityS2Sub")}
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
              title={t("sections.aboutDeityS3Title")}
              subtitle={t("sections.aboutDeityS3Sub")}
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
              title={t("sections.aboutDeityS4Title")}
              subtitle={t("sections.aboutDeityS4Sub")}
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
              {t("sections.aboutDeityPrayerTitle")}
            </h2>
            <p className="text-text-secondary mt-4 text-lg leading-relaxed max-w-xl mx-auto">
              {t("sections.aboutDeityPrayerDesc")}
            </p>
            <Link href="/timings">
              <span className="inline-flex items-center gap-2 mt-6 text-primary font-medium hover:text-primary-light transition-colors">
                {t("common.viewTimings")} <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
