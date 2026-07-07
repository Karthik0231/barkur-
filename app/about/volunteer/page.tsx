"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Heart, Users, Calendar, Phone, Mail, CheckCircle, Clock, BookOpen, Hand } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TEMPLE_NAME, TEMPLE_EMAIL, TEMPLE_PHONE } from "@/lib/constants"

const opportunities = [
  {
    icon: Hand,
    title: "Event Support",
    description: "Help organize and manage temple festivals, cultural events, and special ceremonies.",
    commitment: "Flexible",
  },
  {
    icon: BookOpen,
    title: "Educational Programs",
    description: "Assist with Vedic classes, Sanskrit teaching, and educational initiatives at the Vidyapeetha.",
    commitment: "Weekly",
  },
  {
    icon: Heart,
    title: "Annadana Service",
    description: "Participate in the preparation and distribution of prasada and community meals.",
    commitment: "Daily/Weekly",
  },
  {
    icon: Calendar,
    title: "Festival Volunteers",
    description: "Join us during major festivals like Navaratri, Deepavali, and annual celebrations.",
    commitment: "Seasonal",
  },
  {
    icon: Users,
    title: "Community Outreach",
    description: "Help with devotee services, guided tours, and community engagement programs.",
    commitment: "Flexible",
  },
  {
    icon: Clock,
    title: "Temple Maintenance",
    description: "Assist with cleaning, gardening, and maintaining the temple premises.",
    commitment: "Weekly",
  },
]

const interests = [
  "Pooja & Rituals Assistance",
  "Educational Programs",
  "Annadana (Kitchen)",
  "Event Management",
  "Gardening & Maintenance",
  "Community Outreach",
  "Cultural Programs",
  "Administrative Support",
]

const availabilities = ["Daily", "Weekly", "Weekends", "Festival Days", "Monthly", "Flexible"]

export default function VolunteerPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
    availability: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen">
      <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/90 z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30 z-[1]" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <span className="inline-block text-secondary/80 text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium">
              Serve with Devotion
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight">
              Volunteer
            </h1>
            <p className="text-warm-white/80 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              Join us in serving the divine. Your time and skills can make a difference in preserving and promoting our sacred traditions.
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
            <Link href="/about" className="hover:text-secondary transition-colors">About</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">Volunteer</span>
          </div>

          <AnimatedSection>
            <SectionHeading
              title="Volunteer Opportunities"
              subtitle="There are many ways you can contribute your time and talents to the temple."
            />
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {opportunities.map((opp, index) => {
              const Icon = opp.icon
              return (
                <AnimatedSection key={opp.title} delay={index * 0.05}>
                  <Card variant="elevated" className="p-6 lg:p-8 h-full" hover>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-heading font-bold text-primary mb-2">{opp.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{opp.description}</p>
                    <div className="mt-4 pt-3 border-t border-border">
                      <Badge variant="secondary" size="xs">{opp.commitment}</Badge>
                    </div>
                  </Card>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-bg-secondary/50 to-bg-primary">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-2">
              <AnimatedSection>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary leading-tight">
                  Register Your Interest
                </h2>
                <p className="text-text-secondary mt-4 leading-relaxed">
                  Fill in the form and our volunteer coordinator will get in touch with you to discuss how you can contribute to {TEMPLE_NAME}.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <Phone className="h-4 w-4 text-secondary shrink-0" />
                    <span>{TEMPLE_PHONE}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-secondary">
                    <Mail className="h-4 w-4 text-secondary shrink-0" />
                    <span>{TEMPLE_EMAIL}</span>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            <div className="lg:col-span-3">
              <AnimatedSection delay={0.15}>
                {submitted ? (
                  <Card variant="elevated" className="p-8 lg:p-12 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-primary">Thank You!</h3>
                    <p className="text-text-secondary mt-2">Your volunteer registration has been received. We will contact you soon.</p>
                    <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
                      Submit Another Response
                    </Button>
                  </Card>
                ) : (
                  <Card variant="elevated" className="p-6 lg:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Input
                          label="Full Name"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                        <Input
                          label="Email Address"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Input
                          label="Phone Number"
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                        <div className="flex flex-col gap-1.5 w-full">
                          <label className="text-sm font-medium text-text-primary">Area of Interest</label>
                          <select
                            value={formData.interest}
                            onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                            className="w-full h-11 text-base px-4 py-2 rounded-lg bg-warm-white dark:bg-bg-secondary border border-border focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-200"
                            required
                          >
                            <option value="">Select an area</option>
                            {interests.map((i) => (
                              <option key={i} value={i}>{i}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-sm font-medium text-text-primary">Availability</label>
                        <select
                          value={formData.availability}
                          onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                          className="w-full h-11 text-base px-4 py-2 rounded-lg bg-warm-white dark:bg-bg-secondary border border-border focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-200"
                          required
                        >
                          <option value="">Select availability</option>
                          {availabilities.map((a) => (
                            <option key={a} value={a}>{a}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-sm font-medium text-text-primary">Additional Message (Optional)</label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={3}
                          className="w-full rounded-lg border border-border bg-warm-white dark:bg-bg-secondary p-4 text-sm focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-200 resize-none"
                          placeholder="Any specific skills or preferences..."
                        />
                      </div>
                      <Button variant="primary" size="lg" className="w-full">
                        Submit Registration
                      </Button>
                    </form>
                  </Card>
                )}
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
