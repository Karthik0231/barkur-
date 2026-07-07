"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, UtensilsCrossed, Building2, PartyPopper, Beef, GraduationCap, Gift, ArrowRight, ChevronRight } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "@/components/donation/progress-bar"
import { formatPrice } from "@/lib/utils"

interface Campaign {
  id: string
  slug: string
  title: string
  description: string
  shortDescription: string
  goal: number
  raised: number
  icon: React.ReactNode
  color: string
  donors: number
  daysLeft: number
  featured?: boolean
}

const campaigns: Campaign[] = [
  {
    id: "1",
    slug: "annadanam",
    title: "Annadanam",
    description: "Support the sacred tradition of providing free meals to devotees visiting the temple. Your contribution helps us serve nutritious meals to hundreds of devotees daily.",
    shortDescription: "Provide free meals to devotees visiting the temple",
    goal: 1500000,
    raised: 987500,
    icon: <UtensilsCrossed className="h-6 w-6" />,
    color: "from-orange-500/20 to-amber-500/20",
    donors: 342,
    daysLeft: 45,
    featured: true,
  },
  {
    id: "2",
    slug: "temple-renovation",
    title: "Temple Renovation",
    description: "Help us preserve and restore the ancient architecture of Sri Kalikamba Temple. Your donations will go towards structural repairs, painting, and restoration of the temple premises.",
    shortDescription: "Help restore and preserve the temple infrastructure",
    goal: 2500000,
    raised: 1250000,
    icon: <Building2 className="h-6 w-6" />,
    color: "from-primary/20 to-primary-light/20",
    donors: 521,
    daysLeft: 90,
    featured: true,
  },
  {
    id: "3",
    slug: "festival-sponsorship",
    title: "Festival Sponsorship",
    description: "Sponsor our grand festivals including Navaratri, Rathotsava, and annual brahmotsava. Your support helps us conduct these sacred events with proper rituals and grandeur.",
    shortDescription: "Sponsor grand temple festivals and celebrations",
    goal: 800000,
    raised: 450000,
    icon: <PartyPopper className="h-6 w-6" />,
    color: "from-purple-500/20 to-pink-500/20",
    donors: 189,
    daysLeft: 60,
  },
  {
    id: "4",
    slug: "go-seva",
    title: "Go Seva",
    description: "Support the care and maintenance of cows at the temple goshala. Your donations provide food, shelter, and medical care for our sacred cows.",
    shortDescription: "Support cow protection and care at the temple",
    goal: 500000,
    raised: 320000,
    icon: <Beef className="h-6 w-6" />,
    color: "from-green-500/20 to-emerald-500/20",
    donors: 267,
    daysLeft: 30,
  },
  {
    id: "5",
    slug: "education-fund",
    title: "Education Fund",
    description: "Support the education of underprivileged children in Barkur. Your donation helps provide scholarships, books, and educational resources to deserving students.",
    shortDescription: "Support education for underprivileged children",
    goal: 600000,
    raised: 280000,
    icon: <GraduationCap className="h-6 w-6" />,
    color: "from-blue-500/20 to-cyan-500/20",
    donors: 156,
    daysLeft: 75,
  },
  {
    id: "6",
    slug: "general-donation",
    title: "General Donation",
    description: "Make a general donation to support the temple's daily operations, maintenance, and various spiritual activities. Every contribution makes a difference.",
    shortDescription: "Support the temple's daily operations and activities",
    goal: 1000000,
    raised: 650000,
    icon: <Gift className="h-6 w-6" />,
    color: "from-secondary/20 to-gold-400/20",
    donors: 892,
    daysLeft: 0,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

export default function DonatePage() {
  return (
    <div className="min-h-screen">
      <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/85 to-primary-dark/90 z-10" />
        <div className="absolute inset-0 opacity-10 z-[1]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='0.15'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <Badge variant="secondary" size="md" className="mb-4">
              <Heart className="h-3.5 w-3.5 mr-1" />
              Make a Difference
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight">
              Support Sri Kalikamba Temple
            </h1>
            <p className="text-warm-white/80 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              Your generous donations help us preserve our sacred traditions and serve the community. Every contribution brings us closer to our mission.
            </p>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-20" />
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-10">
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">Donate</span>
          </div>

          <SectionHeading
            title="Our Campaigns"
            subtitle="Choose a cause close to your heart and join us in our mission to serve the divine and the community."
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
          >
            {campaigns.map((campaign, idx) => (
              <motion.div
                key={campaign.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { delay: idx * 0.08 } },
                }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  variant="elevated"
                  className="h-full flex flex-col group cursor-pointer overflow-hidden"
                  hover
                >
                  <div className={`relative h-44 bg-gradient-to-br ${campaign.color} flex items-center justify-center overflow-hidden`}>
                    <div className="w-16 h-16 rounded-2xl bg-white/90 dark:bg-bg-secondary/90 flex items-center justify-center shadow-lg text-primary group-hover:scale-110 transition-transform duration-300">
                      {campaign.icon}
                    </div>
                    {campaign.featured && (
                      <Badge variant="secondary" size="sm" className="absolute top-3 right-3">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-xl font-heading font-bold text-primary group-hover:text-primary-light transition-colors">
                      {campaign.title}
                    </h3>
                    <p className="text-sm text-text-secondary mt-2 leading-relaxed flex-1">
                      {campaign.shortDescription}
                    </p>

                    <div className="mt-4">
                      <ProgressBar
                        raised={campaign.raised}
                        goal={campaign.goal}
                        size="sm"
                      />
                    </div>

                    <div className="flex items-center justify-between mt-4 text-xs text-text-muted">
                      <span>{campaign.donors} donors</span>
                      {campaign.daysLeft > 0 ? (
                        <span className="text-secondary font-medium">{campaign.daysLeft} days left</span>
                      ) : (
                        <span className="text-emerald-600 font-medium">Ongoing</span>
                      )}
                    </div>

                    <div className="flex gap-3 mt-5 pt-4 border-t border-border">
                      <Link href={`/donate/${campaign.slug}`} className="flex-1">
                        <Button variant="gradient" size="sm" className="w-full">
                          <Heart className="h-3.5 w-3.5" />
                          Donate Now
                        </Button>
                      </Link>
                      <Link href={`/donate/${campaign.slug}`}>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-bg-secondary/50 to-bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-6">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">
              Every Contribution Matters
            </h2>
            <p className="text-text-secondary mt-4 max-w-2xl mx-auto leading-relaxed">
              No donation is too small. Your support, whether big or small, helps us continue our spiritual and community services.
              All donations are eligible for tax exemption under 80G.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 mt-10">
              {[
                { value: "10,000+", label: "Devotees Served Daily" },
                { value: "1,000+", label: "Active Donors" },
                { value: "50+", label: "Years of Service" },
              ].map((stat, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-warm-white dark:bg-bg-secondary border border-border shadow-card">
                  <p className="text-3xl font-heading font-bold gradient-text">{stat.value}</p>
                  <p className="text-sm text-text-muted mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
