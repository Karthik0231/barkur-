"use client"

import { useRef, useMemo } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Church, BookOpen, Hammer, MapPin, Users, Star } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { PageBanner } from "@/components/PageBanner"
import { useTranslation } from "@/lib/i18n"

function TimelineCard({ event, index }: { event: { year: string; title: string; description: string; icon: any; details: string[] }; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const Icon = event.icon
  const isLeft = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="relative mb-12 last:mb-0"
    >
      <div className={`flex flex-col md:flex-row items-start gap-6 md:gap-10 ${isLeft ? "" : "md:flex-row-reverse"}`}>
        <div className={`hidden md:flex flex-1 ${isLeft ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-lg ${isLeft ? "text-right" : "text-left"}`}>
            <span className="inline-block text-sm font-bold text-secondary tracking-[0.2em] uppercase bg-secondary/10 px-4 py-1.5 rounded-full">
              {event.year}
            </span>
            <h3 className="text-2xl font-heading font-bold text-primary mt-3">{event.title}</h3>
            <p className="text-text-secondary mt-3 leading-relaxed">{event.description}</p>
            <ul className="mt-4 space-y-2">
              {event.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center shrink-0">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg z-10">
            <Icon className="h-6 w-6 text-warm-white" />
          </div>
          <div className="w-0.5 flex-1 bg-gradient-to-b from-secondary/40 via-secondary/20 to-transparent min-h-[100px]" />
        </div>

        <div className="md:hidden w-full">
          <Card variant="glass" className="p-6 border-l-4 border-secondary">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-xs font-bold text-secondary tracking-widest uppercase">{event.year}</span>
                <h3 className="text-lg font-heading font-bold text-primary">{event.title}</h3>
              </div>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">{event.description}</p>
            <ul className="mt-3 space-y-1.5">
              {event.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-text-muted">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-secondary shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="hidden md:flex flex-1" />
      </div>
    </motion.div>
  )
}

export default function HistoryPage() {
  const { t, language } = useTranslation()

  const timelineEvents = useMemo(() => [
    {
      year: "14th Century",
      title: language === "kn" ? "ದೇವಸ್ಥಾನ ಸ್ಥಾಪನೆ" : "Temple Establishment",
      description: language === "kn"
        ? "ಶ್ರೀ ಕಾಳಿಕಾಂಬಾ ದೇವಸ್ಥಾನವನ್ನು ಕುಶಲ ಕುಶಲಕರ್ಮಿಗಳ ಸಮುದಾಯವಾದ ವಿಶ್ವಕರ್ಮ ಬ್ರಾಹ್ಮಣರು ಸ್ಥಾಪಿಸಿದರು. ಅನೇಗೊಂದಿಯ ಪೂಜ್ಯ ಋಷಿಗಳ ದೈವಿಕ ದರ್ಶನ ಮತ್ತು ನಿರ್ದೇಶನಗಳಿಂದ ಮಾರ್ಗದರ್ಶಿಸಲ್ಪಟ್ಟು, ಅವರು ಬಾರ್ಕೂರನ್ನು ದೇವಸ್ಥಾನಕ್ಕಾಗಿ ಪವಿತ್ರ ಸ್ಥಳವಾಗಿ ಆಯ್ಕೆ ಮಾಡಿದರು."
        : "Sri Kalikamba Temple was established by the Vishwakarma Brahmins, a community of skilled artisans and architects. Guided by divine visions and the directions of the revered seer from Anegondi, they chose Barkur as the sacred site for the temple.",
      icon: Church,
      details: language === "kn"
        ? ["ಅನೇಗೊಂದಿ ಋಷಿಗಳ ದೈವಿಕ ಮಾರ್ಗದರ್ಶನ", "ವಿಶ್ವಕರ್ಮ ಬ್ರಾಹ್ಮಣರು ಸ್ಥಾಪಕ ವಾಸ್ತುಶಿಲ್ಪಿಗಳು", "ಆಧ್ಯಾತ್ಮಿಕ ಮಹತ್ವಕ್ಕಾಗಿ ಬಾರ್ಕೂರು ಆಯ್ಕೆ"]
        : ["Divine guidance from Anegondi seer", "Vishwakarma Brahmins as founding architects", "Barkur chosen for its spiritual significance"],
    },
    {
      year: "14th-20th Century",
      title: language === "kn" ? "ಶತಮಾನಗಳ ಭಕ್ತಿ" : "Centuries of Devotion",
      description: language === "kn"
        ? "ಸುಮಾರು 600 ವರ್ಷಗಳಿಂದ, ದೇವಸ್ಥಾನವು ಆಧ್ಯಾತ್ಮಿಕ ಚಟುವಟಿಕೆ ಮತ್ತು ಸಮುದಾಯ ಕೇಂದ್ರವಾಗಿದೆ. ತಲೆಮಾರುಗಳ ಭಕ್ತರು ಈ ಪವಿತ್ರ ಸ್ಥಳದಲ್ಲಿ ಪೂಜೆ ಸಲ್ಲಿಸಿದ್ದಾರೆ, ದೈನಂದಿನ ಆಚರಣೆಗಳು ಮತ್ತು ವಾರ್ಷಿಕ ಹಬ್ಬಗಳನ್ನು ಅಚಲ ಸಮರ್ಪಣೆಯಿಂದ ನಿರ್ವಹಿಸಿದ್ದಾರೆ."
        : "For over 600 years, the temple has been a center of spiritual activity and community gathering. Generations of devotees have worshipped at this sacred site, maintaining the daily rituals and annual festivals with unwavering dedication.",
      icon: Users,
      details: language === "kn"
        ? ["600 ವರ್ಷಗಳಿಗೂ ಹೆಚ್ಚು ಕಾಲ ನಿರಂತರ ದೈನಂದಿನ ಪೂಜೆ", "ಸಾಂಪ್ರದಾಯಿಕ ಆಚರಣೆಗಳ ಸಂರಕ್ಷಣೆ", "ಸಮುದಾಯ ಕೇಂದ್ರ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಕೇಂದ್ರ"]
        : ["Continuous daily worship for over 600 years", "Preservation of traditional rituals", "Community gathering and cultural center"],
    },
    {
      year: "1995",
      title: language === "kn" ? "ಪ್ರಮುಖ ನವೀಕರಣ" : "Major Renovation",
      description: language === "kn"
        ? "ದೇವಸ್ಥಾನದ ಅನನ್ಯ ವಾಸ್ತುಶಿಲ್ಪ ಪರಂಪರೆಯನ್ನು ಸಂರಕ್ಷಿಸುವ ಮೂಲಕ ಅದರ ಮೂಲ ವೈಭವವನ್ನು ಪುನಃಸ್ಥಾಪಿಸಲು ಸಮಗ್ರ ನವೀಕರಣ ಯೋಜನೆಯನ್ನು ಕೈಗೊಳ್ಳಲಾಯಿತು. ಮೂಲ ಕೇರಳ-ತುಳುನಾಡ ಶೈಲಿಯನ್ನು ಗೌರವಿಸಿ, ಇಳಿಜಾರಾದ ಟೆರಾಕೋಟಾ ಛಾವಣಿಗಳು, ಮರದ ಕೆತ್ತನೆಗಳು ಮತ್ತು ಗರ್ಭಗುಡಿಯನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಪುನಃಸ್ಥಾಪಿಸಲಾಯಿತು."
        : "A comprehensive renovation project was undertaken to restore the temple to its original grandeur while preserving its unique architectural heritage. The renovation respected the original Kerala-Tulunadu style, carefully restoring the sloping terracotta-tiled roofs, wooden carvings, and the sanctum sanctorum.",
      icon: Hammer,
      details: language === "kn"
        ? ["ಸಂಪೂರ್ಣ ರಚನಾತ್ಮಕ ಪುನಃಸ್ಥಾಪನೆ", "ಮೂಲ ವಾಸ್ತುಶಿಲ್ಪದ ಸಂರಕ್ಷಣೆ", "ವಿವೇಚನೆಯಿಂದ ಆಧುನಿಕ ಬಲವರ್ಧನೆಗಳನ್ನು ಸೇರಿಸಲಾಗಿದೆ"]
        : ["Complete structural restoration", "Preservation of original architecture", "Modern reinforcements added discreetly"],
    },
    {
      year: "1997",
      title: language === "kn" ? "ವಿಶ್ವ ಬ್ರಾಹ್ಮಣ ಸಂಸ್ಕೃತ ವಿದ್ಯಾಪೀಠ" : "Vishwa Brahmana Sanskrit Vidyapeetha",
      description: language === "kn"
        ? "ವೈದಿಕ ಶಿಕ್ಷಣ ಮತ್ತು ಸಂಸ್ಕೃತ ಕಲಿಕೆಯನ್ನು ಪ್ರಚಾರ ಮಾಡಲು ದೇವಸ್ಥಾನದ ಆಶ್ರಯದಲ್ಲಿ ವಿಶ್ವ ಬ್ರಾಹ್ಮಣ ಸಂಸ್ಕೃತ ವಿದ್ಯಾಪೀಠವನ್ನು ಸ್ಥಾಪಿಸಲಾಯಿತು. ಈ ಸಂಸ್ಥೆಯು ಸಾಂಪ್ರದಾಯಿಕ ವಿದ್ವಾಂಸರ ಕೇಂದ್ರವಾಗಿದೆ."
        : "The Vishwa Brahmana Sanskrit Vidyapeetha was established under the temple's auspices to promote Vedic education and Sanskrit learning. This institution has become a center for traditional scholarship.",
      icon: BookOpen,
      details: language === "kn"
        ? ["ವೈದಿಕ ಶಿಕ್ಷಣಕ್ಕಾಗಿ ಸ್ಥಾಪಿಸಲಾಗಿದೆ", "ಸಂಸ್ಕೃತ ಮತ್ತು ಹಿಂದೂ ತತ್ತ್ವಶಾಸ್ತ್ರದ ಕೋರ್ಸ್‌ಗಳು", "ಸಮುದಾಯಕ್ಕಾಗಿ ವಿದ್ವಾಂಸರನ್ನು ತಯಾರಿಸುವುದು"]
        : ["Established for Vedic education", "Courses in Sanskrit and Hindu philosophy", "Producing learned scholars for the community"],
    },
    {
      year: "Present Day",
      title: language === "kn" ? "ಪರಂಪರೆಯ ಮುಂದುವರಿಕೆ" : "Continuing the Legacy",
      description: language === "kn"
        ? "ಇಂದು, ಶ್ರೀ ಕಾಳಿಕಾಂಬಾ ದೇವಸ್ಥಾನವು ರೋಮಾಂಚಕ ಆಧ್ಯಾತ್ಮಿಕ ಕೇಂದ್ರವಾಗಿ ನಿಂತಿದೆ, ಸಾವಿರಾರು ಭಕ್ತರಿಗೆ ಸೇವೆ ಸಲ್ಲಿಸುತ್ತಿದೆ. ಸಂಪ್ರದಾಯಕ್ಕೆ ಕಟ್ಟುನಿಟ್ಟಾದ ಅನುಸರಣೆಯೊಂದಿಗೆ ದೈನಂದಿನ ಆಚರಣೆಗಳನ್ನು ನಡೆಸಲಾಗುತ್ತದೆ."
        : "Today, Sri Kalikamba Temple stands as a vibrant spiritual center, serving thousands of devotees. Daily rituals are performed with strict adherence to tradition, while festivals are celebrated with great pomp and devotion.",
      icon: Star,
      details: language === "kn"
        ? ["ಪ್ರತಿದಿನ ಸಾವಿರಾರು ಭಕ್ತರಿಗೆ ಸೇವೆ", "ಸಾಂಪ್ರದಾಯಿಕ ಆಚರಣೆಗಳು ಮತ್ತು ಭವ್ಯ ಹಬ್ಬಗಳು", "ಸಮುದಾಯ ಸೇವೆಗಳನ್ನು ವಿಸ್ತರಿಸುವುದು"]
        : ["Serving thousands of devotees daily", "Traditional rituals and grand festivals", "Expanding community services"],
    },
  ], [language])

  return (
    <div className="min-h-screen">
      <PageBanner
        title={t("pages.aboutHistory.title")}
        subtitle={t("pages.aboutHistory.subtitle")}
        eyebrow={t("pages.aboutHistory.eyebrow")}
      />

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-12">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/about" className="hover:text-secondary transition-colors">{t("nav.about")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.history")}</span>
          </div>

          <AnimatedSection>
            <SectionHeading
              title={t("sections.aboutHistoryS1Title")}
              subtitle={t("sections.aboutHistoryS1Sub")}
            />
          </AnimatedSection>

          <div className="mt-20 relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary/40 via-secondary/20 to-transparent -translate-x-1/2" />

            {timelineEvents.map((event, index) => (
              <TimelineCard key={event.year} event={event} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-bg-secondary/50 to-bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">
              {t("sections.aboutHistoryPreserveTitle")}
            </h2>
            <p className="text-text-secondary mt-4 text-lg leading-relaxed max-w-2xl mx-auto">
              {t("sections.aboutHistoryPreserveDesc")}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link href="/about/architecture">
                <span className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary-light transition-colors">
                  {t("common.viewArchitecture")} <ChevronRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
