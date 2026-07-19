"use client"

import { use } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, Heart, ChevronRight, Users, CalendarDays, Target, CheckCircle } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "@/components/donation/progress-bar"
import { DonationForm } from "@/components/donation/donation-form"
import { formatPrice } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

interface CampaignData {
  slug: string
  title: string
  fullDescription: string
  goal: number
  raised: number
  donors: number
  daysLeft: number
  color: string
  imageBg: string
  impact: string[]
}

const campaignData: Record<string, CampaignData> = {
  annadanam: {
    slug: "annadanam",
    title: "Annadanam",
    fullDescription: "Annadanam, the sacred offering of food, is one of the most cherished traditions at Sri Kalikamba Temple. Every day, hundreds of devotees partake in the免费 meals served at the temple. Your donation helps us provide nutritious, freshly prepared meals to all visitors regardless of their background or financial status. The tradition of Annadanam is considered the highest form of charity in Sanatana Dharma, as it nourishes both the body and soul. By supporting this cause, you become a part of this sacred tradition and earn immense spiritual merit.",
    goal: 1500000,
    raised: 987500,
    donors: 342,
    daysLeft: 45,
    color: "from-orange-500 to-amber-500",
    imageBg: "from-orange-500/10 to-amber-500/10",
    impact: [
      "Provides meals to 300+ devotees daily",
      "Supports kitchen staff and raw materials",
      "Maintains hygiene and quality standards",
      "Covers festival special feasts",
    ],
  },
  "temple-renovation": {
    slug: "temple-renovation",
    title: "Temple Renovation",
    fullDescription: "Sri Kalikamba Temple, with its rich history spanning centuries, requires ongoing maintenance and renovation to preserve its architectural grandeur and spiritual sanctity. Our renovation project encompasses structural reinforcements, restoration of ancient carvings and murals, upgrading facilities for devotees, and beautification of the temple premises. Your contribution helps us ensure that this sacred space continues to inspire devotion and peace for generations to come.",
    goal: 2500000,
    raised: 1250000,
    donors: 521,
    daysLeft: 90,
    color: "from-primary to-primary-light",
    imageBg: "from-primary/10 to-primary-light/10",
    impact: [
      "Structural reinforcement of ancient walls",
      "Restoration of traditional carvings",
      "Upgraded devotee facilities",
      "Landscaping and beautification",
    ],
  },
  "festival-sponsorship": {
    slug: "festival-sponsorship",
    title: "Festival Sponsorship",
    fullDescription: "The festivals at Sri Kalikamba Temple are grand celebrations that bring together the entire community in devotion and joy. From the magnificent Navaratri celebrations to the annual Rathotsava (chariot festival), each event requires substantial resources for decorations, rituals, prasadam, cultural programs, and arrangements for thousands of devotees. Your sponsorship helps us conduct these festivals with the grandeur they deserve, preserving our cultural heritage and spiritual traditions.",
    goal: 800000,
    raised: 450000,
    donors: 189,
    daysLeft: 60,
    color: "from-purple-500 to-pink-500",
    imageBg: "from-purple-500/10 to-pink-500/10",
    impact: [
      "Grand Navaratri celebrations",
      "Annual Rathotsava (chariot festival)",
      "Cultural programs and performances",
      "Prasadam for thousands of devotees",
    ],
  },
  "go-seva": {
    slug: "go-seva",
    title: "Go Seva",
    fullDescription: "Cows hold a sacred place in Sanatana Dharma, and at Sri Kalikamba Temple, we maintain a goshala (cow shelter) to protect and care for these gentle beings. Your donations go towards providing nutritious food, clean water,舒适的 shelter, and regular medical check-ups for the cows. By supporting Go Seva, you participate in the noble service of protecting and nurturing these sacred animals, which is considered one of the highest forms of service in our tradition.",
    goal: 500000,
    raised: 320000,
    donors: 267,
    daysLeft: 30,
    color: "from-green-500 to-emerald-500",
    imageBg: "from-green-500/10 to-emerald-500/10",
    impact: [
      "Daily feed and nutrition for 25+ cows",
      "Regular veterinary care",
      "Clean and spacious shelter maintenance",
      "Support for goshala staff",
    ],
  },
  "education-fund": {
    slug: "education-fund",
    title: "Education Fund",
    fullDescription: "Education is the cornerstone of a bright future. Through our Education Fund, we provide scholarships, school supplies, and educational support to underprivileged children in the Barkur region. Your donation helps bright young minds access quality education, breaking the cycle of poverty and creating opportunities for a better life. We focus on supporting children from economically disadvantaged families, helping them with school fees, books, uniforms, and tutoring.",
    goal: 600000,
    raised: 280000,
    donors: 156,
    daysLeft: 75,
    color: "from-blue-500 to-cyan-500",
    imageBg: "from-blue-500/10 to-cyan-500/10",
    impact: [
      "Scholarships for 50+ students",
      "School supplies and uniforms",
      "After-school tutoring programs",
      "Digital learning resources",
    ],
  },
  "general-donation": {
    slug: "general-donation",
    title: "General Donation",
    fullDescription: "Your general donation supports the daily operations and maintenance of Sri Kalikamba Temple. From utility bills and staff salaries to regular puja materials and temple upkeep, every aspect of temple management requires resources. By making a general donation, you help us maintain the temple's daily rhythm of worship and service, ensuring that the divine atmosphere remains undisturbed and welcoming to all devotees who seek solace and blessings.",
    goal: 1000000,
    raised: 650000,
    donors: 892,
    daysLeft: 0,
    color: "from-secondary to-gold-400",
    imageBg: "from-secondary/10 to-gold-400/10",
    impact: [
      "Daily puja materials and offerings",
      "Temple utility and maintenance costs",
      "Staff salaries and welfare",
      "Community service programs",
    ],
  },
}

export default function CampaignPage({ params }: { params: Promise<{ campaign: string }> }) {
  const { t } = useTranslation()
  const { campaign: campaignSlug } = use(params)
  const campaign = campaignData[campaignSlug]

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-heading font-bold text-primary">Campaign Not Found</h1>
          <p className="text-text-secondary mt-2">The campaign you are looking for does not exist.</p>
          <Link href="/donate">
            <Button variant="primary" className="mt-6">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Donations
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const percentage = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100)

  return (
    <div className="min-h-screen">
      <section className={`relative h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden bg-gradient-to-br ${campaign.color}`}>
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="absolute inset-0 opacity-10 z-[1]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-warm-white leading-tight">
              {campaign.title}
            </h1>
            <p className="text-warm-white/80 text-lg mt-4 max-w-2xl mx-auto">
              Support this sacred cause and earn divine blessings
            </p>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-20" />
      </section>

      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-8">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/donate" className="hover:text-secondary transition-colors">{t("nav.donate")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{campaign.title}</span>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-3 space-y-8">
              <AnimatedSection>
                <Card variant="elevated" className="p-6 lg:p-8">
                  <h2 className="text-2xl font-heading font-bold text-primary mb-4">
                    About This Campaign
                  </h2>
                  <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                    {campaign.fullDescription}
                  </p>
                </Card>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <Card variant="elevated" className="p-6 lg:p-8">
                  <h2 className="text-xl font-heading font-bold text-primary mb-4">
                    Your Impact
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {campaign.impact.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-bg-secondary/50">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </AnimatedSection>

              <AnimatedSection delay={0.15}>
                <Card variant="elevated" className="p-6 lg:p-8">
                  <h2 className="text-xl font-heading font-bold text-primary mb-6">
                    Campaign Progress
                  </h2>
                  <ProgressBar raised={campaign.raised} goal={campaign.goal} size="lg" />
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-4 rounded-xl bg-bg-secondary/50">
                      <Target className="h-5 w-5 text-primary mx-auto mb-1" />
                      <p className="text-lg font-bold text-primary font-heading">{percentage}%</p>
                      <p className="text-xs text-text-muted">Funded</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-bg-secondary/50">
                      <Users className="h-5 w-5 text-primary mx-auto mb-1" />
                      <p className="text-lg font-bold text-primary font-heading">{campaign.donors}</p>
                      <p className="text-xs text-text-muted">Donors</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-bg-secondary/50">
                      <CalendarDays className="h-5 w-5 text-primary mx-auto mb-1" />
                      <p className="text-lg font-bold text-primary font-heading">
                        {campaign.daysLeft > 0 ? campaign.daysLeft : "∞"}
                      </p>
                      <p className="text-xs text-text-muted">Days Left</p>
                    </div>
                  </div>
                </Card>
              </AnimatedSection>
            </div>

            <div className="lg:col-span-2">
              <AnimatedSection delay={0.1} className="sticky top-6">
                <div className="text-center mb-6 p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border">
                  <p className="text-sm text-text-muted">Support</p>
                  <h3 className="text-2xl font-heading font-bold text-primary">{campaign.title}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold gradient-text">{formatPrice(campaign.raised)}</span>
                    <span className="text-text-muted text-sm"> / {formatPrice(campaign.goal)}</span>
                  </div>
                </div>
                <DonationForm campaignName={campaign.title} onSubmit={(data) => console.log("Donation data:", data)} />
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
