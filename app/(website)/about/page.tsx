"use client"

import { useRef, useMemo } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Heart, Shield, Sun, BookOpen, Clock, MapPin, ChevronDown } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageBanner } from "@/components/PageBanner"
import { TEMPLE_NAME } from "@/lib/constants"
import { useTranslation } from "@/lib/i18n"

function TimelineEntry({ year, event, description, index }: { year: string; event: string; description: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex gap-6 items-start"
    >
      <div className="hidden md:flex flex-col items-center">
        <div className="w-5 h-5 rounded-full bg-secondary border-4 border-warm-white shadow-md z-10" />
        <div className="w-0.5 flex-1 bg-gradient-to-b from-secondary to-primary/20" />
      </div>
      <Card variant="glass" className="flex-1 p-6 md:p-8">
        <span className="text-sm font-semibold text-secondary tracking-widest uppercase">{year}</span>
        <h3 className="text-xl font-heading font-bold text-primary mt-1">{event}</h3>
        <p className="text-text-secondary mt-2 leading-relaxed">{description}</p>
      </Card>
    </motion.div>
  )
}

export default function AboutPage() {
  const { t, language } = useTranslation()

  const highlights = useMemo(() => [
    {
      icon: Sun,
      title: language === "kn" ? "ದಿವ್ಯ ಸಾನ್ನಿಧ್ಯ" : "Divine Presence",
      description: language === "kn"
        ? "ಗರ್ಭಗುಡಿಯಲ್ಲಿ ದೇವಿ ಕಾಳಿಕಾಂಬಾ ತಮ್ಮ ಪೂರ್ಣ ದಿವ್ಯ ವೈಭವದಲ್ಲಿ ವಿರಾಜಮಾನರಾಗಿ ಶಾಂತಿ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಶಕ್ತಿಯನ್ನು ಪ್ರಸರಿಸುತ್ತಿದ್ದಾರೆ."
        : "The sanctum sanctorum houses Goddess Kalikamba in Her full divine glory, radiating peace and spiritual energy.",
    },
    {
      icon: Shield,
      title: language === "kn" ? "ಆಧ್ಯಾತ್ಮಿಕ ರಕ್ಷಣೆ" : "Spiritual Protection",
      description: language === "kn"
        ? "ಭಕ್ತರು ನಕಾರಾತ್ಮಕ ಶಕ್ತಿಗಳಿಂದ ರಕ್ಷಣೆ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಉನ್ನತಿಗಾಗಿ ದೇವಿಯ ಆಶೀರ್ವಾದವನ್ನು ಬಯಸುತ್ತಾರೆ."
        : "Devotees seek the Goddess's blessings for protection from negative forces and spiritual upliftment.",
    },
    {
      icon: Heart,
      title: language === "kn" ? "ಸಮುದಾಯ ಸೇವೆ" : "Community Service",
      description: language === "kn"
        ? "ದೇವಸ್ಥಾನವು ಅನ್ನದಾನ, ಶಿಕ್ಷಣ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮಗಳ ಮೂಲಕ ಸಮುದಾಯಕ್ಕೆ ಸಕ್ರಿಯವಾಗಿ ಸೇವೆ ಸಲ್ಲಿಸುತ್ತದೆ."
        : "The temple actively serves the community through annadana, education, and cultural programs.",
    },
    {
      icon: BookOpen,
      title: language === "kn" ? "ವೈದಿಕ ಶಿಕ್ಷಣ" : "Vedic Learning",
      description: language === "kn"
        ? "ವಿಶ್ವ ಬ್ರಾಹ್ಮಣ ಸಂಸ್ಕೃತ ವಿದ್ಯಾಪೀಠದ ಮೂಲಕ ವೈದಿಕ ಜ್ಞಾನವನ್ನು ಸಂರಕ್ಷಿಸಿ ಪ್ರಚಾರ ಮಾಡುತ್ತಿದೆ."
        : "Home to Vishwa Brahmana Sanskrit Vidyapeetha, preserving and promoting Vedic knowledge.",
    },
  ], [language])

  const missionVision = useMemo(() => [
    {
      title: language === "kn" ? "ನಮ್ಮ ಧ್ಯೇಯ" : "Our Mission",
      items: language === "kn"
        ? ["ಪ್ರಾಚೀನ ವೈದಿಕ ಸಂಪ್ರದಾಯಗಳು ಮತ್ತು ಆಚರಣೆಗಳನ್ನು ಸಂರಕ್ಷಿಸಿ ಪ್ರಚಾರ ಮಾಡುವುದು", "ಭಕ್ತರಿಗೆ ಶಾಂತಿಯುತ ಆಧ್ಯಾತ್ಮಿಕ ವಾತಾವರಣವನ್ನು ಒದಗಿಸುವುದು", "ಪರೋಪಕಾರಿ ಚಟುವಟಿಕೆಗಳ ಮೂಲಕ ಸಮುದಾಯಕ್ಕೆ ಸೇವೆ ಸಲ್ಲಿಸುವುದು", "ಸಾಂಸ್ಕೃತಿಕ ಮತ್ತು ಶೈಕ್ಷಣಿಕ ಉಪಕ್ರಮಗಳನ್ನು ಪ್ರೋತ್ಸಾಹಿಸುವುದು"]
        : ["Preserve and propagate the ancient Vedic traditions and rituals", "Provide a serene spiritual environment for devotees", "Serve the community through charitable activities", "Promote cultural and educational initiatives"],
      gradient: "from-primary/10 to-primary/5",
      border: "border-primary/20",
    },
    {
      title: language === "kn" ? "ನಮ್ಮ ದೃಷ್ಟಿ" : "Our Vision",
      items: language === "kn"
        ? ["ಮುಂದಿನ ಪೀಳಿಗೆಗೆ ಆಧ್ಯಾತ್ಮಿಕ ಜ್ಞಾನದ ದೀಪಸ್ತಂಭವಾಗಿ ಪ್ರಕಾಶಿಸುವುದು", "ಪ್ರಾಚೀನ ಜ್ಞಾನವು ಆಧುನಿಕ ತಿಳುವಳಿಕೆಯನ್ನು ಪೂರೈಸುವ ಜಗತ್ತನ್ನು ಸೃಷ್ಟಿಸುವುದು", "ಎಲ್ಲ ಸಮುದಾಯಗಳ ನಡುವೆ ಏಕತೆ ಮತ್ತು ಸೌಹಾರ್ದತೆಯನ್ನು ಬೆಳೆಸುವುದು", "ವೈದಿಕ ಸಂಶೋಧನೆ ಮತ್ತು ಕಲಿಕೆಗಾಗಿ ಕೇಂದ್ರವನ್ನು ಸ್ಥಾಪಿಸುವುದು"]
        : ["Be a beacon of spiritual enlightenment for generations to come", "Create a world where ancient wisdom meets modern understanding", "Foster unity and harmony among all communities", "Establish a center for Vedic research and learning"],
      gradient: "from-secondary/10 to-secondary/5",
      border: "border-secondary/20",
    },
  ], [language])

  const facts = useMemo(() => [
    { year: "14th Century", event: language === "kn" ? "ದೇವಸ್ಥಾನ ಸ್ಥಾಪನೆ" : "Temple Establishment", description: language === "kn" ? "ಶ್ರೀ ಕಾಳಿಕಾಂಬಾ ದೇವಸ್ಥಾನವನ್ನು ವಿಶ್ವಕರ್ಮ ಬ್ರಾಹ್ಮಣರು ದೈವಿಕ ನಿರ್ದೇಶನದಂತೆ ಸ್ಥಾಪಿಸಿದರು." : "Sri Kalikamba Temple was established by Vishwakarma Brahmins following divine instructions." },
    { year: "1995", event: language === "kn" ? "ಪ್ರಮುಖ ನವೀಕರಣ" : "Major Renovation", description: language === "kn" ? "ಮೂಲ ವಾಸ್ತುಶಿಲ್ಪವನ್ನು ಸಂರಕ್ಷಿಸಿ ದೇವಸ್ಥಾನವನ್ನು ಅದರ ಹಿಂದಿನ ವೈಭವಕ್ಕೆ ಪುನಃಸ್ಥಾಪಿಸಲಾಯಿತು." : "Comprehensive renovation restored the temple to its former glory while preserving original architecture." },
    { year: "1997", event: language === "kn" ? "ಸಂಸ್ಕೃತ ವಿದ್ಯಾಪೀಠ" : "Sanskrit Vidyapeetha", description: language === "kn" ? "ವೈದಿಕ ಶಿಕ್ಷಣವನ್ನು ಪ್ರಚಾರ ಮಾಡಲು ವಿಶ್ವ ಬ್ರಾಹ್ಮಣ ಸಂಸ್ಕೃತ ವಿದ್ಯಾಪೀಠವನ್ನು ಸ್ಥಾಪಿಸಲಾಯಿತು." : "Vishwa Brahmana Sanskrit Vidyapeetha was established to promote Vedic education." },
    { year: "Present", event: language === "kn" ? "ಪರಂಪರೆಯ ಮುಂದುವರಿಕೆ" : "Continuing Legacy", description: language === "kn" ? "ದೇವಸ್ಥಾನವು ದೈನಂದಿನ ಆಚರಣೆಗಳು ಮತ್ತು ಹಬ್ಬಗಳೊಂದಿಗೆ ಸಾವಿರಾರು ಭಕ್ತರಿಗೆ ಸೇವೆ ಸಲ್ಲಿಸುತ್ತಲೇ ಇದೆ." : "The temple continues to serve thousands of devotees with daily rituals and festivals." },
  ], [language])

  return (
    <div className="min-h-screen">
      <PageBanner 
        title={t("pages.about.title")} 
        eyebrow={t("nav.sriKalikambaTemple")} 
        subtitle={t("pages.about.subtitle")}
      />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-12">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.about")}</span>
          </div>

          <AnimatedSection>
            <SectionHeading
              title={t("sections.aboutS1Title")}
              subtitle={t("sections.aboutS1Sub")}
            />
          </AnimatedSection>

          <AnimatedSection delay={0.15} className="mt-16">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4">
                        <MapPin className="h-10 w-10 text-secondary" />
                      </div>
                      <p className="text-text-muted text-sm">Temple Exterior Image</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-5">
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-primary">
                  {language === "kn" ? "ಶ್ರದ್ಧೆಯ ಪರಂಪರೆ" : "A Legacy of Faith"}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {language === "kn"
                    ? `ಉಡುಪಿ ಜಿಲ್ಲೆಯ ಐತಿಹಾಸಿಕ ಬಾರ್ಕೂರು ಪಟ್ಟಣದಲ್ಲಿ ನೆಲೆಗೊಂಡಿರುವ ${TEMPLE_NAME}, ಶತಮಾನಗಳ ಅಚಲ ಭಕ್ತಿಗೆ ಸಾಕ್ಷಿಯಾಗಿ ನಿಂತಿದೆ. ದೇವಸ್ಥಾನದ ವಾಸ್ತುಶಿಲ್ಪವು ಕೇರಳ ಮತ್ತು ತುಳುನಾಡ ಶೈಲಿಗಳ ಅನನ್ಯ ಸಮ್ಮಿಳನವನ್ನು ಪ್ರತಿಬಿಂಬಿಸುತ್ತದೆ, ಇಳಿಜಾರಾದ ಟೆರಾಕೋಟಾ ಛಾವಣಿಗಳು ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ಗೋಪುರಗಳ ಅನುಪಸ್ಥಿತಿಯಿಂದ ನಿರೂಪಿಸಲ್ಪಟ್ಟಿದೆ.`
                    : `Nestled in the historic town of Barkur in Udupi district, ${TEMPLE_NAME} stands as a testament to centuries of unwavering devotion. The temple's architecture reflects a unique blend of Kerala and Tulunadu styles, characterized by its sloping terracotta-tiled roofs and the absence of traditional gopurams.`}
                </p>
                <p className="text-text-secondary leading-relaxed">
                  {language === "kn"
                    ? "ಗರ್ಭಗುಡಿಯಲ್ಲಿ ಅಪರೂಪದ ನೀಲಾಂಜನ ಗ್ರಾನೈಟ್‌ನಿಂದ ಕೆತ್ತಲಾದ ದೇವಿ ಕಾಳಿಕಾಂಬಾ ಅವರ ಭವ್ಯ ವಿಗ್ರಹವಿದೆ. ಪದ್ಮಾಸನದಲ್ಲಿ ವಿರಾಜಮಾನರಾಗಿ, ದೇವಿಯು ತ್ರಿಶೂಲ, ಡಮರು, ಖಡ್ಗ ಮತ್ತು ಪಾನಪಾತ್ರೆಯನ್ನು ಧರಿಸಿ, ತಮ್ಮ ಬಹುಮುಖಿ ದೈವಿಕ ಶಕ್ತಿಯನ್ನು ಸಂಕೇತಿಸುತ್ತಾರೆ."
                    : "The sanctum sanctorum houses the majestic idol of Goddess Kalikamba, carved from rare Neelanjana granite. Seated in padmasana, the Goddess holds a trishula, damaru, khadga, and cup, symbolizing her multifaceted divine power."}
                </p>
                <div className="flex gap-4 pt-2">
                  <Link href="/about/history">
                    <Button variant="primary">{t("common.exploreHistory")}</Button>
                  </Link>
                  <Link href="/about/architecture">
                    <Button variant="outline">{t("common.viewArchitecture")}</Button>
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-bg-secondary/50 to-bg-primary">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <SectionHeading
              title={t("sections.aboutS2Title")}
              subtitle={t("sections.aboutS2Sub")}
            />
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            {missionVision.map((item, index) => (
              <AnimatedSection key={item.title} delay={index * 0.15}>
                <Card
                  variant="elevated"
                  className={`p-8 lg:p-10 h-full border-l-4 ${item.border}`}
                  hover
                >
                  <h3 className="text-2xl font-heading font-bold text-primary mb-6">{item.title}</h3>
                  <ul className="space-y-4">
                    {item.items.map((point, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-secondary shrink-0" />
                        <span className="text-text-secondary">{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <SectionHeading
              title={t("sections.aboutS3Title")}
              subtitle={t("sections.aboutS3Sub")}
            />
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {highlights.map((item, index) => {
              const Icon = item.icon
              return (
                <AnimatedSection key={item.title} delay={index * 0.1}>
                  <Card variant="glass" className="p-6 lg:p-8 text-center h-full" hover>
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-5">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-heading font-bold text-primary mb-3">{item.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{item.description}</p>
                  </Card>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-bg-primary to-bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <SectionHeading
              title={t("sections.aboutS4Title")}
              subtitle={t("sections.aboutS4Sub")}
            />
          </AnimatedSection>

          <div className="mt-16 space-y-8 md:space-y-0 md:pl-8">
            {facts.map((fact, index) => (
              <TimelineEntry key={fact.year} {...fact} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">
              {t("sections.aboutVisitTitle")}
            </h2>
            <p className="text-text-secondary mt-4 text-lg leading-relaxed max-w-xl mx-auto">
              {t("sections.aboutVisitDesc")}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/timings">
                <Button variant="primary" size="lg">{t("common.viewTimings")}</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">{t("common.getDirections")}</Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
