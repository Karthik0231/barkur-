"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, MapPin, Phone, Mail, Clock, Send, Globe, CheckCircle } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageBanner } from "@/components/PageBanner"
import { TEMPLE_NAME, TEMPLE_LOCATION, TEMPLE_PHONE, TEMPLE_EMAIL, TEMPLE_ADDRESS, TEMPLE_TIMINGS, SOCIAL_LINKS } from "@/lib/constants"
import { useTranslation } from "@/lib/i18n"

export default function ContactPage() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen">
      <PageBanner 
        title={t("contact.visitConnect")} 
        eyebrow={t("contact.getInTouch")} 
        subtitle={t("contact.subtitle")}
      />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-12">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.contact")}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <AnimatedSection>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary leading-tight">
                  {t("contact.visitConnect")}
                </h2>
                <p className="text-text-secondary mt-4 leading-relaxed">
                  {t("contact.subtitle")}
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.1} className="mt-10 space-y-6">
                <Card variant="glass" className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-primary">{t("contact.templeAddress")}</h3>
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
                      <h3 className="font-heading font-bold text-primary">{t("contact.phone")}</h3>
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
                      <h3 className="font-heading font-bold text-primary">{t("contact.email")}</h3>
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
                      <h3 className="font-heading font-bold text-primary">{t("contact.timings")}</h3>
                      <p className="text-text-secondary text-sm mt-1">{t("contact.morning")}: {TEMPLE_TIMINGS.morning}</p>
                      <p className="text-text-muted text-sm">{t("contact.evening")}: {TEMPLE_TIMINGS.evening}</p>
                    </div>
                  </div>
                </Card>
              </AnimatedSection>

              <AnimatedSection delay={0.2} className="mt-8">
                <h3 className="font-heading font-bold text-primary mb-4">{t("contact.followUs")}</h3>
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
                    <h3 className="text-2xl font-heading font-bold text-primary">{t("contact.messageSent")}</h3>
                    <p className="text-text-secondary mt-2">{t("contact.messageSentDesc")}</p>
                    <Button variant="outline" className="mt-6" onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", phone: "", subject: "", message: "" }) }}>
                      {t("contact.sendAnother")}
                    </Button>
                  </Card>
                ) : (
                  <Card variant="elevated" className="p-6 lg:p-8">
                    <h3 className="text-xl font-heading font-bold text-primary mb-6">{t("contact.sendMessage")}</h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Input label={t("contact.yourName")} placeholder={t("contact.namePlaceholder")} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        <Input label={t("contact.emailAddress")} type="email" placeholder={t("contact.emailPlaceholder")} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Input label={t("contact.phone")} type="tel" placeholder={t("contact.phonePlaceholder")} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        <Input label={t("contact.subject")} placeholder={t("contact.subjectPlaceholder")} value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
                      </div>
                      <div className="flex flex-col gap-1.5 w-full">
                        <label className="text-sm font-medium text-text-primary">{t("contact.messageLabel")}</label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={5}
                          className="w-full rounded-lg border border-border bg-warm-white dark:bg-bg-secondary p-4 text-sm focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all duration-200 resize-none"
                          placeholder={t("contact.messagePlaceholderLong")}
                          required
                        />
                      </div>
                      <Button variant="primary" size="lg" className="w-full">
                        <Send className="h-4 w-4" />
                        {t("contact.send")}
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
            <h2 className="text-2xl font-heading font-bold text-primary mb-6">{t("contact.findUs")}</h2>
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
