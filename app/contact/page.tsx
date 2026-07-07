"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, MapPin, Phone, Mail, Clock, Send, Globe, CheckCircle } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TEMPLE_NAME, TEMPLE_LOCATION, TEMPLE_PHONE, TEMPLE_EMAIL, TEMPLE_ADDRESS, TEMPLE_TIMINGS, SOCIAL_LINKS } from "@/lib/constants"

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen">
      <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/90 z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30 z-[1]" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <span className="inline-block text-secondary/80 text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium">
              Get in Touch
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight">
              Contact Us
            </h1>
            <p className="text-warm-white/80 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              We would love to hear from you. Reach out to us for any inquiries, feedback, or spiritual guidance.
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
            <span className="text-text-primary font-medium">Contact</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <AnimatedSection>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary leading-tight">
                  We Are Here to Help
                </h2>
                <p className="text-text-secondary mt-4 leading-relaxed">
                  Whether you have a question about our services, want to book a seva, or simply wish to share your thoughts, we are here for you.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.1} className="mt-10 space-y-6">
                <Card variant="glass" className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-primary">Address</h3>
                      <p className="text-text-secondary text-sm mt-1">{TEMPLE_ADDRESS}</p>
                      <p className="text-text-muted text-sm">{TEMPLE_LOCATION}</p>
                    </div>
                  </div>
                </Card>

                <Card variant="glass" className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-primary">Phone</h3>
                      <a href={`tel:${TEMPLE_PHONE}`} className="text-text-secondary text-sm mt-1 hover:text-secondary transition-colors block">{TEMPLE_PHONE}</a>
                    </div>
                  </div>
                </Card>

                <Card variant="glass" className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-primary">Email</h3>
                      <a href={`mailto:${TEMPLE_EMAIL}`} className="text-text-secondary text-sm mt-1 hover:text-secondary transition-colors block">{TEMPLE_EMAIL}</a>
                    </div>
                  </div>
                </Card>

                <Card variant="glass" className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-primary">Temple Timings</h3>
                      <p className="text-text-secondary text-sm mt-1">Morning: {TEMPLE_TIMINGS.morning}</p>
                      <p className="text-text-muted text-sm">Evening: {TEMPLE_TIMINGS.evening}</p>
                    </div>
                  </div>
                </Card>
              </AnimatedSection>

              <AnimatedSection delay={0.2} className="mt-8">
                <h3 className="font-heading font-bold text-primary mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                  >
                    <Globe className="h-5 w-5 text-primary" />
                  </a>
                </div>
              </AnimatedSection>
            </div>

            <div>
              <AnimatedSection delay={0.15}>
                {submitted ? (
                  <Card variant="elevated" className="p-8 lg:p-12 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-primary">Message Sent!</h3>
                    <p className="text-text-secondary mt-2">Thank you for contacting us. We will respond to your inquiry shortly.</p>
                    <Button variant="outline" className="mt-6" onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", phone: "", subject: "", message: "" }) }}>
                      Send Another Message
                    </Button>
                  </Card>
                ) : (
                  <Card variant="elevated" className="p-6 lg:p-8">
                    <h3 className="text-xl font-heading font-bold text-primary mb-6">Send Us a Message</h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Input label="Full Name" placeholder="Your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        <Input label="Email" type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Input label="Phone" type="tel" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        <Input label="Subject" placeholder="How can we help?" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
                      </div>
                      <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-sm font-medium text-text-primary">Message</label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={5}
                          className="w-full rounded-lg border border-border bg-warm-white dark:bg-bg-secondary p-4 text-sm focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-200 resize-none"
                          placeholder="Write your message here..."
                          required
                        />
                      </div>
                      <Button variant="primary" size="lg" className="w-full">
                        <Send className="h-4 w-4" />
                        Send Message
                      </Button>
                    </form>
                  </Card>
                )}
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-b from-bg-secondary/50 to-bg-primary">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <h2 className="text-2xl font-heading font-bold text-primary mb-6">Find Us</h2>
            <div className="aspect-[21/9] rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-10 w-10 text-secondary/40 mx-auto mb-2" />
                <p className="text-text-muted text-sm">{TEMPLE_NAME}</p>
                <p className="text-text-muted text-xs">{TEMPLE_ADDRESS}, {TEMPLE_LOCATION}</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
