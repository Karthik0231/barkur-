"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ChevronRight, Droplets, Flame, Music, Leaf, Gem, Bell, Wheat, Book, Star } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PageBanner } from "@/components/PageBanner"
import { useTranslation } from "@/lib/i18n"

const categories = ["All", "Pooja", "Arati", "Homa", "Seva", "Darshana", "Decoration"]

export default function RitualsPage() {
  const { t, language } = useTranslation()
  const [activeCategory, setActiveCategory] = useState("All")

  const rituals = useMemo(() => [
    {
      name: language === "kn" ? "ಅಭಿಷೇಕ" : "Abhisheka",
      category: "Pooja",
      description: language === "kn"
        ? "ದೇವರಿಗೆ ಹಾಲು, ಮೊಸರು, ಜೇನುತುಪ್ಪ, ತುಪ್ಪ, ಸಕ್ಕರೆ, ಗಂಧದ ಪೇಸ್ಟ್ ಮತ್ತು ಪವಿತ್ರ ಜಲ ಸೇರಿದಂತೆ ವಿವಿಧ ಶುಭ ದ್ರವ್ಯಗಳಿಂದ ಪವಿತ್ರ ಸ್ನಾನ ಮಾಡಿಸುವ ಆಚರಣೆ. ಪ್ರತಿಯೊಂದು ದ್ರವ್ಯವು ನಿರ್ದಿಷ್ಟ ಆಧ್ಯಾತ್ಮಿಕ ಮಹತ್ವವನ್ನು ಹೊಂದಿದೆ."
        : "The sacred bathing of the deity with various auspicious substances including milk, curd, honey, ghee, sugar, sandalwood paste, and holy water. Each substance has specific spiritual significance.",
      significance: language === "kn"
        ? "ಮನಸ್ಸು ಮತ್ತು ದೇಹವನ್ನು ಶುದ್ಧೀಕರಿಸುತ್ತದೆ, ನಕಾರಾತ್ಮಕ ಕರ್ಮವನ್ನು ನಿವಾರಿಸುತ್ತದೆ ಮತ್ತು ದೈವಿಕ ಆಶೀರ್ವಾದವನ್ನು ಆಹ್ವಾನಿಸುತ್ತದೆ."
        : "Purifies the mind and body, removes negative karma, and invokes divine blessings. The abhisheka is believed to activate the spiritual energy of the idol.",
      timing: "Daily 7:00 AM & 4:30 PM",
      duration: "45 mins",
      icon: Droplets,
    },
    {
      name: language === "kn" ? "ಮಂಗಳಾರತಿ" : "Mangalarati",
      category: "Arati",
      description: language === "kn"
        ? "ವೈದಿಕ ಮಂತ್ರಗಳು ಮತ್ತು ಭಕ್ತಿ ಗೀತೆಗಳೊಂದಿಗೆ ದೇವರ ಮುಂದೆ ದೀಪಗಳನ್ನು ಬೆಳಗಿಸುವ ಆಚರಣೆ. ಪಂಚ-ಆರತಿಯು ಪಂಚಭೂತಗಳನ್ನು ಪ್ರತಿನಿಧಿಸುತ್ತದೆ."
        : "The waving of lit lamps before the deity accompanied by Vedic chants and devotional songs. The arati is performed with a five-wick lamp (pancha-arati) representing the five elements.",
      significance: language === "kn"
        ? "ಕತ್ತಲೆ ಮತ್ತು ನಕಾರಾತ್ಮಕತೆಯನ್ನು ನಿವಾರಿಸುತ್ತದೆ, ಶುಭತೆಯನ್ನು ತರುತ್ತದೆ ಮತ್ತು ಶಕ್ತಿಯುತ ಆಧ್ಯಾತ್ಮಿಕ ವಾತಾವರಣವನ್ನು ಸೃಷ್ಟಿಸುತ್ತದೆ."
        : "Dispels darkness and negativity, brings auspiciousness, and creates a powerful spiritual atmosphere. The flame symbolizes the divine light of consciousness.",
      timing: "Daily 6:30 AM, 12:30 PM & 7:00 PM",
      duration: "20 mins",
      icon: Flame,
    },
    {
      name: language === "kn" ? "ಅಲಂಕಾರ" : "Alankara",
      category: "Decoration",
      description: language === "kn"
        ? "ದೇವರನ್ನು ರೇಷ್ಮೆ ವಸ್ತ್ರಗಳು, ಚಿನ್ನದ ಆಭರಣಗಳು ಮತ್ತು ತಾಜಾ ಹೂವಿನ ಮಾಲೆಗಳಿಂದ ಅಲಂಕರಿಸುವ ಆಚರಣೆ. ಹಬ್ಬದ ದಿನಗಳಂದು ವಿಶೇಷ ಅಲಂಕಾರಗಳನ್ನು ನಡೆಸಲಾಗುತ್ತದೆ."
        : "The elaborate decoration of the deity with silk garments, gold ornaments, and fresh flower garlands. Special alankaras are performed on festival days with unique themes.",
      significance: language === "kn"
        ? "ಸೌಂದರ್ಯ ಮತ್ತು ಕಲಾತ್ಮಕತೆಯ ಮೂಲಕ ಭಕ್ತಿಯನ್ನು ವ್ಯಕ್ತಪಡಿಸುತ್ತದೆ. ಪ್ರತಿಯೊಂದು ಆಭರಣ ಮತ್ತು ವಸ್ತ್ರವು ಸಾಂಕೇತಿಕ ಅರ್ಥವನ್ನು ಹೊಂದಿದೆ."
        : "Expresses devotion through beauty and artistry. Each ornament and garment has symbolic meaning and is offered with specific prayers.",
      timing: "Daily 8:00 AM",
      duration: "60 mins",
      icon: Gem,
    },
    {
      name: language === "kn" ? "ಮಹಾ ಪೂಜೆ" : "Maha Pooja",
      category: "Pooja",
      description: language === "kn"
        ? "ಷೋಡಶೋಪಚಾರ ಸಂಪ್ರದಾಯದಂತೆ ನಡೆಸಲಾಗುವ ಮಹಾ ಅರ್ಚನೆ. ಪವಿತ್ರ ಮಂತ್ರಗಳ ಪಠಣ, ಧೂಪ, ದೀಪ, ನೈವೇದ್ಯ ಮತ್ತು ಪುಷ್ಪಗಳ ಅರ್ಪಣೆ ಒಳಗೊಂಡಿದೆ."
        : "The grand worship ceremony following the Shodashopachara (sixteen offerings) tradition. Includes the chanting of sacred mantras, offering of incense, lamps, food, and flowers.",
      significance: language === "kn"
        ? "ಎಲ್ಲ ಇಂದ್ರಿಯಗಳನ್ನು ಭಕ್ತಿಯಲ್ಲಿ ತೊಡಗಿಸುವ ಅತ್ಯಂತ ಸಮಗ್ರ ಆರಾಧನೆ. ಇದು ಭಕ್ತನ ಸಂಪೂರ್ಣ ಶರಣಾಗತಿಯನ್ನು ಪ್ರತಿನಿಧಿಸುತ್ತದೆ."
        : "The most comprehensive worship ritual that engages all senses in devotion. It represents the complete surrender of the devotee to the divine.",
      timing: "Daily 9:00 AM",
      duration: "90 mins",
      icon: Music,
    },
    {
      name: language === "kn" ? "ದೀಪಾರಾಧನೆ" : "Deeparadhana",
      category: "Arati",
      description: language === "kn"
        ? "ನೂರಾರು ಎಣ್ಣೆ ದೀಪಗಳನ್ನು ಬೆಳಗಿಸಿ ದೇವರಿಗೆ ಅರ್ಪಿಸುವ ಸಂಜೆಯ ದೀಪಾರಾಧನೆ. ದೇವಸ್ಥಾನವು ದೀಪಗಳಿಂದ ಪ್ರಕಾಶಿಸಲ್ಪಟ್ಟು ಮೋಹಕ ಆಧ್ಯಾತ್ಮಿಕ ವಾತಾವರಣ ಸೃಷ್ಟಿಸುತ್ತದೆ."
        : "The evening lamp offering ceremony where hundreds of oil lamps are lit and offered to the deity. The temple is illuminated with lamps creating a mesmerizing spiritual ambiance.",
      significance: language === "kn"
        ? "ಕತ್ತಲೆಯ ಮೇಲೆ ಬೆಳಕಿನ ಮತ್ತು ಅಜ್ಞಾನದ ಮೇಲೆ ಜ್ಞಾನದ ವಿಜಯವನ್ನು ಸಂಕೇತಿಸುತ್ತದೆ."
        : "Symbolizes the victory of light over darkness and knowledge over ignorance. The evening deeparadhana is a deeply moving spiritual experience.",
      timing: "Daily 6:00 PM",
      duration: "30 mins",
      icon: Star,
    },
    {
      name: language === "kn" ? "ಅರ್ಚನೆ" : "Archana",
      category: "Pooja",
      description: language === "kn"
        ? "ಭಕ್ತರ ಹೆಸರು, ಗೋತ್ರ ಮತ್ತು ನಕ್ಷತ್ರವನ್ನು ಪಠಿಸುತ್ತಾ ಪವಿತ್ರ ವಸ್ತುಗಳನ್ನು ಅರ್ಪಿಸುವ ವೈಯಕ್ತಿಕ ಪೂಜೆ."
        : "Individual worship service where a devotee's name, gotra, and nakshatra are recited while offering sacred items to the deity. A personalized form of worship.",
      significance: language === "kn"
        ? "ಭಕ್ತ ಮತ್ತು ದೇವರ ನಡುವೆ ವೈಯಕ್ತಿಕ ಸಂಪರ್ಕವನ್ನು ಸೃಷ್ಟಿಸುತ್ತದೆ."
        : "Creates a personal connection between the devotee and the deity. The chanting of the devotee's name ensures specific blessings for their wellbeing.",
      timing: "Throughout the day",
      duration: "15 mins",
      icon: Book,
    },
    {
      name: language === "kn" ? "ಹೋಮ" : "Homam",
      category: "Homa",
      description: language === "kn"
        ? "ವೈದಿಕ ಮಂತ್ರಗಳ ಪಠಣದೊಂದಿಗೆ ಪವಿತ್ರ ಅಗ್ನಿಯಲ್ಲಿ ಆಹುತಿಗಳನ್ನು ಅರ್ಪಿಸುವ ಆಚರಣೆ. ನಿರ್ದಿಷ್ಟ ಉದ್ದೇಶಗಳಿಗಾಗಿ ವಿವಿಧ ಹೋಮಗಳನ್ನು ನಡೆಸಲಾಗುತ್ತದೆ."
        : "The sacred fire ceremony where offerings are made into the consecrated fire while chanting Vedic mantras. Different homams are performed for specific purposes.",
      significance: language === "kn"
        ? "ಅಗ್ನಿಯು ಅರ್ಪಣೆಗಳನ್ನು ಆಧ್ಯಾತ್ಮಿಕ ಶಕ್ತಿಯಾಗಿ ಪರಿವರ್ತಿಸಿ ಪರಿಸರವನ್ನು ಶುದ್ಧೀಕರಿಸುತ್ತದೆ ಮತ್ತು ಪ್ರಾರ್ಥನೆಗಳನ್ನು ದೈವಿಕ ಲೋಕಗಳಿಗೆ ಸಾಗಿಸುತ್ತದೆ."
        : "Fire transforms the offerings into spiritual energy that purifies the environment and carries prayers to the divine realms.",
      timing: "By appointment",
      duration: "60-180 mins",
      icon: Flame,
    },
    {
      name: language === "kn" ? "ಅನ್ನದಾನ" : "Annadana",
      category: "Seva",
      description: language === "kn"
        ? "ದೇವರಿಗೆ ನೈವೇದ್ಯ ಮಾಡಿದ ಆಹಾರವನ್ನು ಭಕ್ತರಿಗೆ ಪ್ರಸಾದವಾಗಿ ವಿತರಿಸುವ ಸೇವೆ. ಯಾವುದೇ ಭಕ್ತನು ದೇವಸ್ಥಾನದಲ್ಲಿ ಹಸಿದಿರಬಾರದು ಎಂಬ ಪವಿತ್ರ ಸಂಪ್ರದಾಯ."
        : "The offering of food to the deity which is later distributed as prasada to devotees. This sacred tradition ensures no devotee leaves the temple hungry.",
      significance: language === "kn"
        ? "ಅತ್ಯುನ್ನತ ದಾನಗಳಲ್ಲಿ ಒಂದೆಂದು ಪರಿಗಣಿಸಲಾಗಿದೆ. ಇತರರಿಗೆ ಆಹಾರ ನೀಡುವುದು ಅಪಾರ ಆಧ್ಯಾತ್ಮಿಕ ಪುಣ್ಯ ಮತ್ತು ದೈವಿಕ ಆಶೀರ್ವಾದವನ್ನು ತರುತ್ತದೆ."
        : "Considered one of the highest forms of charity. Feeding others is believed to bring immense spiritual merit and divine blessings.",
      timing: "Daily 12:00 PM",
      duration: "Ongoing",
      icon: Wheat,
    },
    {
      name: language === "kn" ? "ನಾದ ದರ್ಶನ" : "Nada Darshana",
      category: "Darshana",
      description: language === "kn"
        ? "ಗರ್ಭಗುಡಿಯನ್ನು ತೆರೆದ ದಿನದ ಮೊದಲ ದರ್ಶನ. ದೈನಂದಿನ ಆಚರಣೆಗಳು ಪ್ರಾರಂಭವಾಗುವ ಮೊದಲು ಭಕ್ತರು ದೇವಿಯನ್ನು ಅವರ ಮುಂಜಾನೆಯ ವೈಭವದಲ್ಲಿ ದರ್ಶಿಸಬಹುದು."
        : "The first darshana of the day when the sanctum sanctorum is opened. Devotees can witness the deity in Her morning splendor before the day's rituals begin.",
      significance: language === "kn"
        ? "ದಿನದ ಆಧ್ಯಾತ್ಮಿಕ ಸ್ವರವನ್ನು ಹೊಂದಿಸುವ ದೇವಿಯ ಮೊದಲ ನೋಟ. ಮುಂಜಾನೆಯ ದರ್ಶನವು ಅತ್ಯಂತ ಶುಭಕರವೆಂದು ಪರಿಗಣಿಸಲಾಗಿದೆ."
        : "The first glimpse of the deity sets the spiritual tone for the day. Early morning darshana is considered highly auspicious.",
      timing: "Daily 6:00 AM",
      duration: "15 mins",
      icon: Bell,
    },
    {
      name: language === "kn" ? "ರಾಜೋಪಚಾರ ಪೂಜೆ" : "Rajopachara Pooja",
      category: "Pooja",
      description: language === "kn"
        ? "ದೇವರನ್ನು ಸಾರ್ವಭೌಮ ದೊರೆಯಾಗಿ ಪೂಜಿಸುವ ರಾಜೋಪಚಾರ ಪೂಜೆ. ರಾಜಸ್ನಾನ, ವಸ್ತ್ರ, ಆಭರಣಗಳು ಮತ್ತು ಔತಣ ಸೇರಿದಂತೆ ಹದಿನಾರು ಭವ್ಯ ಅರ್ಪಣೆಗಳನ್ನು ಒಳಗೊಂಡಿದೆ."
        : "The royal worship ceremony treating the deity as a sovereign monarch. Includes sixteen grand offerings including royal bath, garments, ornaments, and feast.",
      significance: language === "kn"
        ? "ದೇವರನ್ನು ಬ್ರಹ್ಮಾಂಡದ ಸರ್ವೋಚ್ಚ ಆಡಳಿತಗಾರನಾಗಿ ಭಕ್ತನ ಗೌರವವನ್ನು ವ್ಯಕ್ತಪಡಿಸುತ್ತದೆ. ಇದು ಸಂಪೂರ್ಣ ಶರಣಾಗತಿ ಮತ್ತು ಭಕ್ತಿಯ ಕ್ರಿಯೆಯಾಗಿದೆ."
        : "Expresses the devotee's reverence for the divine as the supreme ruler of the universe. It is a complete act of surrender and devotion.",
      timing: "Daily 12:00 PM",
      duration: "60 mins",
      icon: Leaf,
    },
  ], [language])

  const filtered = activeCategory === "All" ? rituals : rituals.filter((r) => r.category === activeCategory)

  return (
    <div className="min-h-screen">
      <PageBanner 
        title={t("pages.rituals.title")} 
        eyebrow={t("pages.rituals.eyebrow")} 
        subtitle={t("pages.rituals.subtitle")}
      />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-12">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.rituals")}</span>
          </div>

          <AnimatedSection>
            <SectionHeading
              title={t("sections.ritualsS1Title")}
              subtitle={t("sections.ritualsS1Sub")}
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
                {cat === "All" ? t("common.filterAll") : cat === "Pooja" ? t("sections.filterPooja") : cat === "Arati" ? t("sections.filterArati") : cat === "Homa" ? t("sections.filterHoma") : cat === "Seva" ? t("sections.filterSeva") : cat === "Darshana" ? t("sections.filterDarshana") : t("sections.filterDecoration")}
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
                          <p className="text-sm font-medium text-primary">{t("sections.ritualsSignificanceLabel")}</p>
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
