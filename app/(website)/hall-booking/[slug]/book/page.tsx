"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { z } from "zod"
import { format } from "date-fns"
import { ArrowLeft, ChevronRight, CalendarDays, Clock, Building2, Users, User, Phone, Mail, MessageSquare, Check, Shield } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookingSteps } from "@/components/booking/booking-steps"
import { PaymentSummary } from "@/components/booking/payment-summary"
import { AvailabilityCalendar } from "@/components/hall-booking/availability-calendar"
import { formatPrice, cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

const timeSlots = [
  "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
  "6:00 PM", "7:00 PM", "8:00 PM",
]

const eventTypes = [
  { value: "wedding", label: "Wedding" },
  { value: "function", label: "Family Function" },
  { value: "meeting", label: "Community Meeting" },
  { value: "religious", label: "Religious Ceremony" },
  { value: "cultural", label: "Cultural Program" },
  { value: "other", label: "Other" },
]

const bookingFormSchema = z.object({
  eventDate: z.string().min(1, "Please select an event date"),
  startTime: z.string().min(1, "Please select start time"),
  endTime: z.string().min(1, "Please select end time"),
  eventName: z.string().min(3, "Event name must be at least 3 characters"),
  eventType: z.string().min(1, "Please select event type"),
  expectedGuests: z.string().min(1, "Please enter expected guests"),
  purpose: z.string().min(10, "Please describe the purpose (min 10 characters)"),
  organizerName: z.string().min(2, "Name must be at least 2 characters"),
  organizerPhone: z.string().regex(/^\+?[\d\s-]{10,15}$/, "Please enter a valid phone number"),
  organizerEmail: z.string().email("Please enter a valid email address"),
  specialRequests: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingFormSchema>

const steps = [
  { label: "Date & Time", description: "Select your preferred date" },
  { label: "Event Details", description: "Tell us about your event" },
  { label: "Contact Info", description: "Your contact details" },
  { label: "Review & Pay", description: "Confirm and pay" },
]

const hallPricing = {
  basePrice: 15000,
  pricePerHour: 3000,
  securityDeposit: 10000,
  tax: 18,
}

export default function BookHallPage({ params }: { params: Promise<{ slug: string }> }) {
  const { t } = useTranslation()
  const { slug } = use(params)
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedStartTime, setSelectedStartTime] = useState("")
  const [selectedEndTime, setSelectedEndTime] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      eventType: "",
      expectedGuests: "",
    },
  })

  const watchAll = watch()

  const handleNext = async () => {
    let fields: (keyof BookingFormData)[] = []
    if (currentStep === 0) fields = ["eventDate", "startTime", "endTime"]
    else if (currentStep === 1) fields = ["eventName", "eventType", "expectedGuests", "purpose"]
    else if (currentStep === 2) fields = ["organizerName", "organizerPhone", "organizerEmail"]

    const isValid = await trigger(fields)
    if (isValid) {
      if (currentStep < 3) {
        setCurrentStep((s) => s + 1)
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setValue("eventDate", format(date, "yyyy-MM-dd"), { shouldValidate: true })
  }

  const handlePayment = () => {
    console.log("Processing payment...")
  }

  const hallName = slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

  const lineItems = [
    { label: "Base Price", amount: hallPricing.basePrice, description: "Standard hall rental" },
    { label: "Hourly Charges", amount: hallPricing.pricePerHour * 4, description: "4 hours estimated" },
    { label: "Security Deposit", amount: hallPricing.securityDeposit, description: "Refundable" },
  ]

  const total = hallPricing.basePrice + hallPricing.pricePerHour * 4

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-secondary/30 to-bg-primary">
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/hall-booking" className="hover:text-secondary transition-colors">{t("nav.hallBooking")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={`/hall-booking/${slug}`} className="hover:text-secondary transition-colors">{hallName}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("booking.book")}</span>
          </div>

          <AnimatedSection>
            <div className="text-center mb-10">
              <Badge variant="secondary" size="md" className="mb-3">
                <Building2 className="h-3.5 w-3.5 mr-1" />
                {hallName}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary">
                Book Your Event
              </h1>
              <p className="text-text-secondary mt-2">Complete the steps below to reserve your hall</p>
            </div>
          </AnimatedSection>

          <div className="mb-10">
            <BookingSteps steps={steps} currentStep={currentStep} />
          </div>

          <form onSubmit={handleSubmit(handleNext)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && (
                  <Card variant="elevated" className="p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <CalendarDays className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-heading font-bold text-primary">Step 1: Select Date & Time</h2>
                        <p className="text-sm text-text-muted">Choose your preferred event date and time slot</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-sm font-semibold text-text-primary mb-3">Select Date</h3>
                        <AvailabilityCalendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
                        {errors.eventDate && (
                          <p className="text-xs text-red-500 mt-2">{errors.eventDate.message}</p>
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-text-primary mb-3">Select Time Slot</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-text-muted mb-1.5 block">Start Time</label>
                            <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
                              {timeSlots.map((time) => (
                                <button
                                  key={time}
                                  type="button"
                                  onClick={() => { setSelectedStartTime(time); setValue("startTime", time, { shouldValidate: true }); setSelectedEndTime("") }}
                                  className={cn(
                                    "py-2 px-3 rounded-lg border text-xs text-left transition-all",
                                    selectedStartTime === time
                                      ? "border-primary bg-primary/5 text-primary font-medium"
                                      : "border-border text-text-secondary hover:border-secondary/50",
                                  )}
                                >
                                  <Clock className="h-3 w-3 inline mr-1.5" />
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-xs text-text-muted mb-1.5 block">End Time</label>
                            <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
                              {timeSlots.filter((t) => !selectedStartTime || t > selectedStartTime).map((time) => (
                                <button
                                  key={time}
                                  type="button"
                                  onClick={() => setValue("endTime", time, { shouldValidate: true })}
                                  className={cn(
                                    "py-2 px-3 rounded-lg border text-xs text-left transition-all",
                                    watch("endTime") === time
                                      ? "border-primary bg-primary/5 text-primary font-medium"
                                      : "border-border text-text-secondary hover:border-secondary/50",
                                  )}
                                >
                                  <Clock className="h-3 w-3 inline mr-1.5" />
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        {errors.startTime && <p className="text-xs text-red-500 mt-2">{errors.startTime.message}</p>}
                        {errors.endTime && <p className="text-xs text-red-500 mt-2">{errors.endTime.message}</p>}
                      </div>
                    </div>

                    <div className="flex justify-end mt-8 pt-6 border-t border-border">
                      <Button variant="gradient" size="lg" type="button" onClick={handleNext}>
                        Next: Event Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </Card>
                )}

                {currentStep === 1 && (
                  <Card variant="elevated" className="p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-heading font-bold text-primary">Step 2: Event Details</h2>
                        <p className="text-sm text-text-muted">Tell us about your event</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <Input
                        label="Event Name *"
                        placeholder="e.g., Smitha's Wedding Reception"
                        iconLeft={<Building2 className="h-4 w-4" />}
                        error={errors.eventName?.message}
                        {...register("eventName")}
                      />

                      <div>
                        <label className="text-sm font-medium text-text-primary mb-2 block">Event Type *</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {eventTypes.map((type) => (
                            <button
                              key={type.value}
                              type="button"
                              onClick={() => setValue("eventType", type.value, { shouldValidate: true })}
                              className={cn(
                                "py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all",
                                watch("eventType") === type.value
                                  ? "border-primary bg-primary/5 text-primary"
                                  : "border-border text-text-secondary hover:border-secondary/50",
                              )}
                            >
                              {type.label}
                            </button>
                          ))}
                        </div>
                        {errors.eventType && <p className="text-xs text-red-500 mt-1">{errors.eventType.message}</p>}
                      </div>

                      <Input
                        label="Expected Guests *"
                        type="number"
                        placeholder="e.g., 200"
                        iconLeft={<Users className="h-4 w-4" />}
                        error={errors.expectedGuests?.message}
                        {...register("expectedGuests")}
                      />

                      <div>
                        <label className="text-sm font-medium text-text-primary mb-2 block">Purpose of Event *</label>
                        <textarea
                          {...register("purpose")}
                          rows={3}
                          placeholder="Describe the purpose and any specific requirements..."
                          className="w-full rounded-lg border border-border bg-warm-white dark:bg-bg-secondary p-4 text-sm focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all resize-none"
                        />
                        {errors.purpose && <p className="text-xs text-red-500 mt-1">{errors.purpose.message}</p>}
                      </div>
                    </div>

                    <div className="flex justify-between mt-8 pt-6 border-t border-border">
                      <Button variant="outline" size="lg" type="button" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back
                      </Button>
                      <Button variant="gradient" size="lg" type="button" onClick={handleNext}>
                        Next: Contact Info
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </Card>
                )}

                {currentStep === 2 && (
                  <Card variant="elevated" className="p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-heading font-bold text-primary">Step 3: Contact Details</h2>
                        <p className="text-sm text-text-muted">Your contact information</p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <Input
                        label="Organizer Name *"
                        placeholder="Full name"
                        iconLeft={<User className="h-4 w-4" />}
                        error={errors.organizerName?.message}
                        {...register("organizerName")}
                      />
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Input
                          label="Phone Number *"
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          iconLeft={<Phone className="h-4 w-4" />}
                          error={errors.organizerPhone?.message}
                          {...register("organizerPhone")}
                        />
                        <Input
                          label="Email *"
                          type="email"
                          placeholder="your@email.com"
                          iconLeft={<Mail className="h-4 w-4" />}
                          error={errors.organizerEmail?.message}
                          {...register("organizerEmail")}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-text-primary mb-2 block">Special Requests (Optional)</label>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-3.5 h-4 w-4 text-text-muted" />
                          <textarea
                            {...register("specialRequests")}
                            rows={3}
                            placeholder="Any special requirements or requests..."
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-warm-white dark:bg-bg-secondary text-sm focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-8 pt-6 border-t border-border">
                      <Button variant="outline" size="lg" type="button" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back
                      </Button>
                      <Button variant="gradient" size="lg" type="button" onClick={handleNext}>
                        Next: Review & Pay
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </Card>
                )}

                {currentStep === 3 && (
                  <div className="grid md:grid-cols-5 gap-8">
                    <div className="md:col-span-3">
                      <Card variant="elevated" className="p-6 lg:p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                            <Check className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h2 className="text-xl font-heading font-bold text-primary">Step 4: Review & Payment</h2>
                            <p className="text-sm text-text-muted">Review your booking details</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 rounded-xl bg-bg-secondary/50">
                            <h3 className="text-sm font-semibold text-primary mb-3">Booking Summary</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-text-muted">Hall</span>
                                <span className="text-text-primary font-medium">{hallName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-text-muted">Date</span>
                                <span className="text-text-primary">{watchAll.eventDate ? format(new Date(watchAll.eventDate), "dd MMM yyyy") : "-"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-text-muted">Time</span>
                                <span className="text-text-primary">{watchAll.startTime} - {watchAll.endTime}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-text-muted">Event</span>
                                <span className="text-text-primary">{watchAll.eventName || "-"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-text-muted">Type</span>
                                <span className="text-text-primary capitalize">{watchAll.eventType || "-"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-text-muted">Guests</span>
                                <span className="text-text-primary">{watchAll.expectedGuests || "-"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-text-muted">Organizer</span>
                                <span className="text-text-primary">{watchAll.organizerName || "-"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
                            <h3 className="text-sm font-semibold text-primary mb-2">Terms</h3>
                            <p className="text-xs text-text-secondary">
                              By proceeding with the payment, you agree to the temple's hall booking terms and conditions including the refund and cancellation policy.
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between mt-8 pt-6 border-t border-border">
                          <Button variant="outline" type="button" onClick={handleBack}>
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back
                          </Button>
                        </div>
                      </Card>
                    </div>

                    <div className="md:col-span-2">
                      <PaymentSummary
                        lineItems={lineItems}
                        tax={hallPricing.tax}
                        deposit={hallPricing.securityDeposit}
                        total={total}
                        onPayment={handlePayment}
                        paymentLabel={`Pay ${formatPrice(total + Math.round(total * hallPricing.tax / 100) + hallPricing.securityDeposit)}`}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </form>
        </div>
      </section>
    </div>
  )
}
