"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { format } from "date-fns"
import {
  Building2,
  Users,
  Check,
  ChevronRight,
  CalendarCheck,
  User,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  AlertCircle,
  ArrowRight,
  Star,
} from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PageBanner } from "@/components/PageBanner"
import { AvailabilityCalendar } from "@/components/hall-booking/availability-calendar"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

interface HallInfo {
  id: string
  slug: string
  name: string
  description: string
  basePrice: number
  pricePerHour: number
}

export default function HallBookingPage() {
  const { t } = useTranslation()

  const [selectedHall, setSelectedHall] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [eventName, setEventName] = useState("")
  const [expectedGuests, setExpectedGuests] = useState("")
  const [organizerName, setOrganizerName] = useState("")
  const [organizerPhone, setOrganizerPhone] = useState("")
  const [organizerEmail, setOrganizerEmail] = useState("")
  const [address, setAddress] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [halls, setHalls] = useState<HallInfo[]>([])

  useEffect(() => {
    fetch("/api/halls?limit=100")
      .then((r) => r.json())
      .then((json) => {
        const raw = json?.data?.halls || []
        setHalls(raw.map((h: any) => ({
          id: String(h.id),
          slug: h.slug || String(h.id),
          name: h.name || "",
          description: h.description || "",
          basePrice: Number(h.basePrice) || 0,
          pricePerHour: Number(h.pricePerHour) || 0,
        })))
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async () => {
    if (!selectedHall || !selectedDate || !eventName || !organizerName || !organizerPhone || !organizerEmail || !address) {
      setSubmitError(t("hallBooking.hallBookingFillRequired"))
      return
    }
    setSubmitting(true)
    setSubmitError(null)
    try {
      const payload = {
        hallName: selectedHall,
        eventType: eventName,
        eventDate: format(selectedDate, "yyyy-MM-dd"),
        startTime: "All Day",
        endTime: "All Day",
        organizerName,
        organizerPhone,
        organizerEmail,
        address,
        expectedGuests: Number(expectedGuests) || 1,
        remarks: specialRequests || undefined,
      }
      const res = await fetch("/api/hall-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!json?.success) throw new Error(json?.message || "Failed to create booking")
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t("hallBooking.hallBookingSubmitError"))
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setSelectedHall("")
    setSelectedDate(undefined)
    setEventName("")
    setExpectedGuests("")
    setOrganizerName("")
    setOrganizerPhone("")
    setOrganizerEmail("")
    setAddress("")
    setSpecialRequests("")
    setSubmitted(false)
    setSubmitError(null)
  }

  if (submitted) {
    return (
      <div className="min-h-screen">
        <PageBanner
          title={t("nav.hallBooking")}
          eyebrow={t("hero.templeName")}
          subtitle={t("hallBooking.hallBookingFormSub")}
        />
        <section className="py-20 px-4">
          <div className="max-w-lg mx-auto text-center">
            <AnimatedSection>
              <div className="w-20 h-20 mx-auto rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                <Check className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-heading font-bold text-primary mb-3">{t("hallBooking.hallBookingSubmitted")}</h2>
              <p className="text-text-secondary mb-8 leading-relaxed">{t("hallBooking.hallBookingSubmittedDesc")}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/hall-booking/my-bookings">
                  <Button variant="gradient" size="lg">{t("hallBooking.hallBookingViewBookings")}</Button>
                </Link>
                <Button variant="outline" size="lg" onClick={resetForm}>{t("hallBooking.hallBookingBookAnother")}</Button>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <PageBanner
        title={t("nav.hallBooking")}
        eyebrow={t("hero.templeName")}
        subtitle={t("hallBooking.hallBookingFormSub")}
      />

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-10">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.hallBooking")}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
            {/* Left: Calendar + Hall Images */}
            <div className="space-y-8">
              <AnimatedSection>
                <Card variant="elevated" className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <CalendarCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-heading font-bold text-primary">{t("hallBooking.hallBookingSelectDate")}</h2>
                      <p className="text-sm text-text-muted">{t("hallBooking.hallBookingSelectDateDesc")}</p>
                    </div>
                  </div>
                  <AvailabilityCalendar
                    onDateSelect={setSelectedDate}
                    selectedDate={selectedDate}
                    hallSlug={selectedHall || undefined}
                  />
                </Card>
              </AnimatedSection>

              {/* Hall Images */}
              <AnimatedSection delay={0.1}>
                <div className="grid grid-cols-2 gap-4">
                  <Card variant="elevated" className="overflow-hidden">
                    <div className="h-40 bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center">
                      <div className="text-center">
                        <Building2 className="h-10 w-10 text-primary mx-auto mb-2" />
                        <p className="text-sm font-heading font-bold text-primary">{t("hallBooking.hallBookingFrontHall")}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-text-muted">{t("hallBooking.hallBookingFrontHallDesc")}</p>
                    </div>
                  </Card>
                  <Card variant="elevated" className="overflow-hidden">
                    <div className="h-40 bg-gradient-to-br from-secondary/20 to-gold-400/20 flex items-center justify-center">
                      <div className="text-center">
                        <Building2 className="h-10 w-10 text-secondary mx-auto mb-2" />
                        <p className="text-sm font-heading font-bold text-primary">{t("hallBooking.hallBookingBackHall")}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-text-muted">{t("hallBooking.hallBookingBackHallDesc")}</p>
                    </div>
                  </Card>
                </div>
              </AnimatedSection>
            </div>

            {/* Right: Booking Form */}
            <div>
              <AnimatedSection delay={0.05}>
                <Card variant="elevated" className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-heading font-bold text-primary">{t("hallBooking.hallBookingFormTitle")}</h2>
                      <p className="text-sm text-text-muted">{t("hallBooking.hallBookingFormSub")}</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Hall Selection */}
                    <div>
                      <label className="text-sm font-medium text-text-primary mb-3 block">{t("hallBooking.hallBookingSelectHall")} *</label>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          { slug: "front-hall", label: t("hallBooking.hallBookingFrontHall"), desc: t("hallBooking.hallBookingFrontHallDesc"), icon: <Star className="h-5 w-5" /> },
                          { slug: "back-hall", label: t("hallBooking.hallBookingBackHall"), desc: t("hallBooking.hallBookingBackHallDesc"), icon: <Building2 className="h-5 w-5" /> },
                        ].map((hall) => (
                          <button
                            key={hall.slug}
                            type="button"
                            onClick={() => setSelectedHall(hall.slug)}
                            className={cn(
                              "flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all",
                              selectedHall === hall.slug
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-secondary/50"
                            )}
                          >
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                              selectedHall === hall.slug
                                ? "bg-primary text-warm-white"
                                : "bg-bg-secondary text-text-muted"
                            )}>
                              {hall.icon}
                            </div>
                            <div>
                              <p className={cn("text-sm font-semibold", selectedHall === hall.slug ? "text-primary" : "text-text-primary")}>{hall.label}</p>
                              <p className="text-xs text-text-muted mt-0.5">{hall.desc}</p>
                            </div>
                            {selectedHall === hall.slug && <Check className="h-5 w-5 text-primary ml-auto shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Event Name */}
                    <Input
                      label={`${t("hallBooking.hallBookingEventName")} *`}
                      placeholder={t("hallBooking.hallBookingEventNamePlaceholder")}
                      iconLeft={<Building2 className="h-4 w-4" />}
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                    />

                    {/* Date display */}
                    {selectedDate && (
                      <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                        <p className="text-sm font-medium text-primary">
                          {t("hallBooking.hallBookingSelectDate")}: <span className="font-bold">{format(selectedDate, "dd MMMM yyyy")}</span>
                        </p>
                      </div>
                    )}

                    {/* Guests */}
                    <Input
                      label={`${t("hallBooking.hallBookingGuests")} *`}
                      type="number"
                      placeholder={t("hallBooking.hallBookingGuestsPlaceholder")}
                      iconLeft={<Users className="h-4 w-4" />}
                      value={expectedGuests}
                      onChange={(e) => setExpectedGuests(e.target.value)}
                    />

                    {/* Contact Info */}
                    <Input
                      label={`${t("hallBooking.hallBookingYourName")} *`}
                      placeholder={t("hallBooking.hallBookingYourName")}
                      iconLeft={<User className="h-4 w-4" />}
                      value={organizerName}
                      onChange={(e) => setOrganizerName(e.target.value)}
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label={`${t("hallBooking.hallBookingPhone")} *`}
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        iconLeft={<Phone className="h-4 w-4" />}
                        value={organizerPhone}
                        onChange={(e) => setOrganizerPhone(e.target.value)}
                      />
                      <Input
                        label={`${t("hallBooking.hallBookingEmail")} *`}
                        type="email"
                        placeholder="your@email.com"
                        iconLeft={<Mail className="h-4 w-4" />}
                        value={organizerEmail}
                        onChange={(e) => setOrganizerEmail(e.target.value)}
                      />
                    </div>

                    <Input
                      label={`${t("hallBooking.hallBookingAddress")} *`}
                      placeholder={t("hallBooking.hallBookingAddress")}
                      iconLeft={<MapPin className="h-4 w-4" />}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />

                    {/* Special Requests */}
                    <div>
                      <label className="text-sm font-medium text-text-primary mb-2 block">{t("hallBooking.hallBookingSpecialRequests")}</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3.5 h-4 w-4 text-text-muted" />
                        <textarea
                          rows={3}
                          placeholder={t("hallBooking.hallBookingSpecialRequestsPlaceholder")}
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-warm-white dark:bg-bg-secondary text-sm focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all resize-none"
                        />
                      </div>
                    </div>

                    {/* Error */}
                    {submitError && (
                      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        {submitError}
                      </div>
                    )}

                    {/* Submit */}
                    <Button
                      variant="gradient"
                      size="lg"
                      className="w-full"
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>{t("hallBooking.hallBookingSubmitting")}</>
                      ) : (
                        <>
                          {t("hallBooking.hallBookingSubmit")}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Why Book With Us */}
      <section className="py-20 px-4 bg-gradient-to-b from-bg-secondary/50 to-bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <SectionHeading
              title={t("sections.hallBookingS1Title")}
              subtitle={t("sections.hallBookingS1Sub")}
            />
            <div className="grid sm:grid-cols-3 gap-6 mt-12">
              {[
                { icon: <MapPin className="h-8 w-8" />, title: t("hallBooking.hallBookingSacredVenue"), desc: t("hallBooking.hallBookingSacredVenueDesc") },
                { icon: <Building2 className="h-8 w-8" />, title: t("hallBooking.hallBookingWellMaintained"), desc: t("hallBooking.hallBookingWellMaintainedDesc") },
                { icon: <Users className="h-8 w-8" />, title: t("hallBooking.hallBookingCommunityEvents"), desc: t("hallBooking.hallBookingCommunityEventsDesc") },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 rounded-2xl bg-warm-white dark:bg-bg-secondary border border-border shadow-card hover:shadow-elevated transition-shadow"
                >
                  <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-primary mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-heading font-bold text-primary">{item.title}</h3>
                  <p className="text-sm text-text-muted mt-2">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
