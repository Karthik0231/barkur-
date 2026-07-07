"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronRight, CreditCard, CheckCircle, Shield, IndianRupee } from "lucide-react"
import { BookingWizard, type WizardStep } from "@/components/booking/booking-wizard"
import { BookingSummary } from "@/components/booking/booking-summary"
import { DateTimePicker } from "@/components/booking/date-time-picker"
import { DevoteeForm } from "@/components/booking/devotee-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTranslation } from "@/lib/i18n"
import { cn, formatPrice } from "@/lib/utils"

const sevaData: Record<string, { name: string; price: number; duration: string }> = {
  "nitya-pooja": { name: "Nitya Pooja", price: 501, duration: "30 min" },
  "abhishekam": { name: "Abhishekam", price: 1001, duration: "45 min" },
  "archana": { name: "Archana", price: 251, duration: "20 min" },
  "sahasranama-archana": { name: "Sahasranama Archana", price: 751, duration: "60 min" },
  "durga-saptashati": { name: "Durga Saptashati Parayana", price: 1501, duration: "90 min" },
  "panchamrita-abhishekam": { name: "Panchamrita Abhishekam", price: 2001, duration: "60 min" },
  "kumkumarchana": { name: "Kumkumarchana", price: 351, duration: "20 min" },
  "chandi-homa": { name: "Chandi Homa", price: 5001, duration: "120 min" },
}

const timeSlots = [
  { id: "6-7", label: "6:00 AM - 7:00 AM", available: true },
  { id: "7-8", label: "7:00 AM - 8:00 AM", available: true },
  { id: "8-9", label: "8:00 AM - 9:00 AM", available: false },
  { id: "9-10", label: "9:00 AM - 10:00 AM", available: true },
  { id: "10-11", label: "10:00 AM - 11:00 AM", available: true },
  { id: "11-12", label: "11:00 AM - 12:00 PM", available: false },
  { id: "4-5", label: "4:00 PM - 5:00 PM", available: true },
  { id: "5-6", label: "5:00 PM - 6:00 PM", available: true },
  { id: "6-7", label: "6:00 PM - 7:00 PM", available: false },
]

export default function BookSevaPage() {
  const params = useParams()
  const router = useRouter()
  const { t } = useTranslation()
  const slug = params.slug as string
  const seva = sevaData[slug]

  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [devoteeData, setDevoteeData] = useState({
    name: "",
    gotra: "",
    nakshatra: "",
    rashi: "",
    phone: "",
    email: "",
    address: "",
    state: "",
    district: "",
    pincode: "",
  })
  const [instructions, setInstructions] = useState("")
  const [loading, setLoading] = useState(false)
  const [paymentDialog, setPaymentDialog] = useState(false)

  if (!seva) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-primary">Seva not found</h1>
          <Link href="/sevas">
            <Button variant="secondary" className="mt-4">Back to Sevas</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handlePayment = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    setPaymentDialog(false)
    router.push(`/sevas/book/${slug}/success`)
  }

  const dateStr = selectedDate
    ? selectedDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "Not selected"

  const timeStr = timeSlots.find((t) => t.id === selectedTime)?.label || "Not selected"

  const canProceed = useMemo(() => {
    if (!selectedDate || !selectedTime || quantity < 1) return false
    if (!devoteeData.name || !devoteeData.phone || !devoteeData.email) return false
    return true
  }, [selectedDate, selectedTime, quantity, devoteeData])

  const grandTotal = seva.price * quantity + Math.round(seva.price * quantity * 0.18)

  const instructionCharCount = instructions.length

  const steps: WizardStep[] = [
    {
      id: "date-time",
      title: "Date & Time",
      content: (
        <DateTimePicker
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
          minDate={new Date()}
          quantity={quantity}
          onQuantityChange={setQuantity}
          price={seva.price}
        />
      ),
    },
    {
      id: "devotee",
      title: "Devotee Details",
      content: (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-heading font-bold text-text-primary">Devotee Details</h2>
          </div>
          <DevoteeForm data={devoteeData} onChange={setDevoteeData} />
        </div>
      ),
    },
    {
      id: "instructions",
      title: "Instructions",
      content: (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-heading font-bold text-text-primary">Special Instructions</h2>
          </div>
          <div className="space-y-3">
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Any special requests or instructions for the temple priests..."
              rows={6}
              maxLength={500}
              className="w-full rounded-xl border border-gold-200/30 bg-warm-white p-4 text-sm text-text-primary placeholder:text-text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus-visible:outline-none transition-all resize-none shadow-premium"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-text-muted">
                Share any specific requirements, health concerns, or preferences for the ritual.
              </p>
              <span className={cn(
                "text-xs font-medium tabular-nums",
                instructionCharCount > 450 ? "text-maroon-500" : "text-text-muted",
              )}>
                {instructionCharCount}/500
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "review",
      title: "Review & Pay",
      content: (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-heading font-bold text-text-primary">Review & Payment</h2>
          </div>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-bg-secondary border border-border/50">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Seva</p>
                <p className="font-semibold text-text-primary">{seva.name}</p>
              </div>
              <div className="p-4 rounded-xl bg-bg-secondary border border-border/50">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Date</p>
                <p className="font-semibold text-text-primary">{dateStr}</p>
              </div>
              <div className="p-4 rounded-xl bg-bg-secondary border border-border/50">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Time</p>
                <p className="font-semibold text-text-primary">{timeStr}</p>
              </div>
              <div className="p-4 rounded-xl bg-bg-secondary border border-border/50">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Quantity</p>
                <p className="font-semibold text-text-primary">{quantity}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-bg-secondary border border-border/50">
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Devotee</p>
              <p className="font-semibold text-text-primary">{devoteeData.name}</p>
              <p className="text-sm text-text-secondary">{devoteeData.phone} &middot; {devoteeData.email}</p>
            </div>

            {devoteeData.gotra && (
              <div className="p-4 rounded-xl bg-bg-secondary border border-border/50">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Gotra / Nakshatra / Rashi</p>
                <p className="font-semibold text-text-primary">
                  {[devoteeData.gotra, devoteeData.nakshatra, devoteeData.rashi].filter(Boolean).join(" | ")}
                </p>
              </div>
            )}

            {instructions && (
              <div className="p-4 rounded-xl bg-bg-secondary border border-border/50">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Special Instructions</p>
                <p className="text-sm text-text-secondary">{instructions}</p>
              </div>
            )}

            <div className="pt-4">
              <Button
                variant="premium"
                size="xl"
                className="w-full"
                onClick={() => setPaymentDialog(true)}
                iconRight={<IndianRupee className="h-4 w-4" />}
              >
                Pay ₹{grandTotal.toLocaleString("en-IN")} Now
              </Button>

              <div className="mt-4 p-3 rounded-xl bg-bg-secondary flex items-start gap-3">
                <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-[10px] text-text-muted leading-relaxed">
                  Your payment is processed securely via Razorpay. We do not store your card or UPI details.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const formatSevaDate = (d: Date) =>
    d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-secondary/30 to-bg-primary">
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-text-muted mb-6"
          >
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/sevas" className="hover:text-secondary transition-colors">Sevas</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={`/sevas/${slug}`} className="hover:text-secondary transition-colors">{seva.name}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">Book</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-premium shadow-glow-gold/20">
                <CreditCard className="h-7 w-7 text-warm-white" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-text-primary">
                  Book {seva.name}
                </h1>
                <p className="text-sm text-text-muted">
                  {formatPrice(seva.price)} &middot; {seva.duration}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            <div className="bg-warm-white rounded-2xl border border-gold-200/20 shadow-premium p-6 sm:p-8">
              <BookingWizard
                steps={steps}
                onComplete={() => setPaymentDialog(true)}
                canProceed={canProceed}
              />
            </div>

            <div className="hidden lg:block">
              <BookingSummary
                sevaName={seva.name}
                date={selectedDate ? formatSevaDate(selectedDate) : "Not selected"}
                time={timeStr}
                quantity={quantity}
                price={seva.price}
              />
            </div>
          </div>
        </div>
      </section>

      <Dialog open={paymentDialog} onClose={() => setPaymentDialog(false)}>
        <DialogContent size="md" className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle>Confirm Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
          <div className="p-4 rounded-xl bg-bg-secondary space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Seva</span>
              <span className="font-medium text-text-primary">{seva.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Date</span>
              <span className="font-medium text-text-primary">{selectedDate ? formatSevaDate(selectedDate) : "-"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Time</span>
              <span className="font-medium text-text-primary">{timeStr}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Quantity</span>
              <span className="font-medium text-text-primary">{quantity}</span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-bold text-text-primary">Total</span>
                <span className="font-bold text-primary text-lg">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <Button
            variant="premium"
            size="lg"
            className="w-full"
            onClick={handlePayment}
            loading={loading}
          >
            Pay ₹{grandTotal.toLocaleString("en-IN")} Now
          </Button>

          <div className="flex items-center gap-2 text-xs text-text-muted justify-center">
            <Shield className="h-3 w-3" />
            Secured by Razorpay
          </div>
        </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
