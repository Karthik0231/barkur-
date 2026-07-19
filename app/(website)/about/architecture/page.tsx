"use client"

import { useRef, useState, useMemo } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Building, Image, Gem, Building2, Landmark, Search, X } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageBanner } from "@/components/PageBanner"
import { useTranslation } from "@/lib/i18n"

function ArchitectureHighlight({ feature, index }: { feature: { title: string; description: string; icon: any; highlight: string }; index: number }) {
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
  const { t, language } = useTranslation()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const features = useMemo(() => [
    {
      title: language === "kn" ? "ಇಳಿಜಾರಾದ ಟೆರಾಕೋಟಾ ಛಾವಣಿಗಳು" : "Sloping Terracotta-Tiled Roofs",
      description: language === "kn"
        ? "ಕೇರಳ ವಾಸ್ತುಶಿಲ್ಪದಿಂದ ಪ್ರಭಾವಿತವಾದ ವಿಶಿಷ್ಟ ಲಕ್ಷಣ, ಇಳಿಜಾರಾದ ಟೆರಾಕೋಟಾ ಛಾವಣಿಗಳು ಮಳೆಗಾಲದಲ್ಲಿ ಅತ್ಯುತ್ತಮ ಒಳಚರಂಡಿಯನ್ನು ಒದಗಿಸುತ್ತವೆ. ಟೆರಾಕೋಟಾ ಹೆಂಚುಗಳ ಬೆಚ್ಚಗಿನ ಮಣ್ಣಿನ ಟೋನ್‌ಗಳು ಸುತ್ತಲಿನ ಹಸಿರಿನೊಂದಿಗೆ ಸುಂದರವಾಗಿ ವ್ಯತಿರಿಕ್ತವಾಗಿವೆ."
        : "A distinctive feature influenced by Kerala architecture, the sloping terracotta-tiled roofs provide excellent drainage in the monsoon climate. The warm earth tones of the terracotta tiles contrast beautifully with the surrounding greenery.",
      icon: Building,
      highlight: language === "kn" ? "ಕೇರಳ ಪ್ರಭಾವ" : "Kerala Influence",
    },
    {
      title: language === "kn" ? "ಗೋಪುರಗಳಿಲ್ಲ" : "No Gopurams",
      description: language === "kn"
        ? "ಎತ್ತರದ ಗೋಪುರಗಳನ್ನು ಹೊಂದಿರುವ ಸಾಮಾನ್ಯ ದ್ರಾವಿಡ ಶೈಲಿಯ ದೇವಸ್ಥಾನಗಳಿಗಿಂತ ಭಿನ್ನವಾಗಿ, ಶ್ರೀ ಕಾಳಿಕಾಂಬಾ ದೇವಸ್ಥಾನವು ಸರಳ, ಹೆಚ್ಚು ಆಪ್ತ ಪ್ರವೇಶದ್ವಾರವನ್ನು ಹೊಂದಿದೆ. ಈ ವಾಸ್ತುಶಿಲ್ಪದ ಆಯ್ಕೆಯು ಕೇರಳ-ತುಳುನಾಡ ಶೈಲಿಯನ್ನು ಪ್ರತಿಬಿಂಬಿಸುತ್ತದೆ."
        : "Unlike typical Dravidian-style temples with towering gopurams, Sri Kalikamba Temple features a simpler, more intimate entrance. This architectural choice reflects the Kerala-Tulunadu style, emphasizing the sanctum rather than the entrance structure.",
      icon: Landmark,
      highlight: language === "kn" ? "ವಿಭಿನ್ನ ಶೈಲಿ" : "Distinctive Style",
    },
    {
      title: language === "kn" ? "ನೀಲಾಂಜನ ಗ್ರಾನೈಟ್ ವಿಗ್ರಹ" : "Neelanjana Granite Idol",
      description: language === "kn"
        ? "ದೇವಿ ಕಾಳಿಕಾಂಬಾ ಅವರ ಮುಖ್ಯ ವಿಗ್ರಹವನ್ನು ಅಪರೂಪದ ನೀಲಾಂಜನ ಗ್ರಾನೈಟ್‌ನಿಂದ ಕೆತ್ತಲಾಗಿದೆ, ಇದು ಅಸಾಧಾರಣ ಗಡಸುತನ ಮತ್ತು ನಯಗೊಳಿಸಿದ ಮುಕ್ತಾಯಕ್ಕೆ ಹೆಸರುವಾಸಿಯಾದ ಗಾಢ ನೀಲಿ-ಕಪ್ಪು ಕಲ್ಲಾಗಿದೆ. ದೇವಿಯು ಪದ್ಮಾಸನದಲ್ಲಿ ನಾಲ್ಕು ತೋಳುಗಳೊಂದಿಗೆ ವಿರಾಜಮಾನರಾಗಿದ್ದಾರೆ."
        : "The main idol of Goddess Kalikamba is carved from rare Neelanjana granite, a dark, almost blue-black stone known for its exceptional hardness and smooth finish. The idol depicts the Goddess seated in padmasana with four arms.",
      icon: Gem,
      highlight: language === "kn" ? "ಅಪರೂಪದ ವಸ್ತು" : "Rare Material",
    },
    {
      title: language === "kn" ? "ಒಂಟೆ ಚಿಹ್ನೆ (ಪಾಣಿ ಪೀಠ)" : "Camel Symbol (Pani Peetha)",
      description: language === "kn"
        ? "ವಿಗ್ರಹದ ತಳದಲ್ಲಿ, ಒಂಟೆ ಚಿಹ್ನೆಯನ್ನು (ಪಾಣಿ ಪೀಠ) ನಿಖರವಾದ ಕೆತ್ತನೆಯಿಂದ ಅಲಂಕರಿಸಲಾಗಿದೆ. ಈ ಅನನ್ಯ ಲಕ್ಷಣವು ವಿಶ್ವಕರ್ಮ ಕರಕುಶಲತೆಯ ಗುರುತಾಗಿದೆ ಮತ್ತು ದೇವಸ್ಥಾನದ ಪ್ರತಿಮಾಶಾಸ್ತ್ರದಲ್ಲಿ ಆಳವಾದ ಸಾಂಕೇತಿಕ ಅರ್ಥವನ್ನು ಹೊಂದಿದೆ."
        : "At the base of the idol, the camel symbol (Pani Peetha) is carved with intricate detail. This unique feature is a hallmark of Vishwakarma craftsmanship and holds deep symbolic meaning in the temple's iconography.",
      icon: Building2,
      highlight: language === "kn" ? "ವಿಶ್ವಕರ್ಮ ಕರಕುಶಲತೆ" : "Vishwakarma Craftsmanship",
    },
  ], [language])

  const galleryPlaceholders = useMemo(() => [
    { label: language === "kn" ? "ಮುಂಭಾಗದ ನೋಟ" : "Front View", category: language === "kn" ? "ಹೊರಭಾಗ" : "Exterior" },
    { label: language === "kn" ? "ಗರ್ಭಗುಡಿ" : "Sanctum Sanctorum", category: language === "kn" ? "ಒಳಭಾಗ" : "Interior" },
    { label: language === "kn" ? "ಛಾವಣಿಯ ವಾಸ್ತುಶಿಲ್ಪ" : "Roof Architecture", category: language === "kn" ? "ವಿವರಗಳು" : "Details" },
    { label: language === "kn" ? "ವಿಗ್ರಹದ ಸಮೀಪ ನೋಟ" : "Idol Close-up", category: language === "kn" ? "ವಿಗ್ರಹ" : "Idol" },
    { label: language === "kn" ? "ಪಾಣಿ ಪೀಠ" : "Pani Peetha", category: language === "kn" ? "ವಿವರಗಳು" : "Details" },
    { label: language === "kn" ? "ದೇವಸ್ಥಾನದ ಸುತ್ತಮುತ್ತ" : "Temple Surroundings", category: language === "kn" ? "ಹೊರಭಾಗ" : "Exterior" },
  ], [language])

  return (
    <div className="min-h-screen">
      <PageBanner
        title={t("pages.aboutArchitecture.title")}
        subtitle={t("pages.aboutArchitecture.subtitle")}
        eyebrow={t("pages.aboutArchitecture.eyebrow")}
      />

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-12">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/about" className="hover:text-secondary transition-colors">{t("nav.about")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.architecture")}</span>
          </div>

          <AnimatedSection>
            <SectionHeading
              title={t("sections.aboutArchS1Title")}
              subtitle={t("sections.aboutArchS1Sub")}
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
              title={t("sections.aboutArchGalleryTitle")}
              subtitle={t("sections.aboutArchGallerySub")}
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
                {t("sections.aboutArchExpTitle")}
              </h2>
              <p className="text-text-secondary mt-4 text-lg leading-relaxed max-w-2xl mx-auto">
                {t("sections.aboutArchExpDesc")}
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Link href="/about/deity">
                  <span className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-light transition-colors">
                    {t("common.learnAboutDeity")} <ChevronRight className="h-4 w-4" />
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
