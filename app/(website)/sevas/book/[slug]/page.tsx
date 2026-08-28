"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronRight, CreditCard, CheckCircle, Shield, IndianRupee } from "lucide-react"
import { BookingWizard, type WizardStep } from "@/components/booking/booking-wizard"
import { BookingSummary } from "@/components/booking/booking-summary"
import { DateTimePicker } from "@/components/booking/date-time-picker"
import { DevoteeForm } from "@/components/booking/devotee-form"
import { RazorpayButton } from "@/components/booking/razorpay-button"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTranslation } from "@/lib/i18n"
import { cn, formatPrice } from "@/lib/utils"
import { findSevaBySlug } from "@/lib/data/sevas"

export default function BookSevaPage() {
  const params = useParams()
  const router = useRouter()
  const { t, language } = useTranslation()
  const slug = params.slug as string

  const sevaData = findSevaBySlug(slug)
  const seva = sevaData ? {
    ...sevaData,
    id: sevaData.id,
    name: typeof sevaData.name === "object" ? sevaData.name[language as "kn" | "en"] || sevaData.name.en : sevaData.name,
    description: typeof sevaData.description === "object" ? sevaData.description[language as "kn" | "en"] || sevaData.description.en : sevaData.description,
  } : null

  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [quantity, setQuantity] = useState(1)
  const [devoteeData, setDevoteeData] = useState({
    name: "", gotra: "", nakshatra: "", rashi: "",
    phone: "", email: "", address: "", state: "", district: "", pincode: "",
  })
  const [instructions, setInstructions] = useState("")
  const [payLoading, setPayLoading] = useState(false)
  const [payError, setPayError] = useState("")
  const [paymentDialog, setPaymentDialog] = useState(false)
  const [razorpayOrder, setRazorpayOrder] = useState<any>(null)
  const [createdBookingId, setCreatedBookingId] = useState("")

  if (!seva) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-heading font-bold text-primary">{t("sevas.notFound")}</h1>
        <Link href="/sevas"><Button variant="secondary" className="mt-4">{t("sevas.backToSevas")}</Button></Link>
      </div>
    </div>
  )

  const handleCreateOrder = async () => {
    setPayLoading(true)
    setPayError("")
    try {
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sevaId: seva.id,
          quantity,
          preferredDate: selectedDate?.toISOString(),
          devoteeName: devoteeData.name,
          gotra: devoteeData.gotra || undefined,
          nakshatra: devoteeData.nakshatra || undefined,
          rashi: devoteeData.rashi || undefined,
          phone: devoteeData.phone,
          email: devoteeData.email,
          address: devoteeData.address,
          state: devoteeData.state,
          district: devoteeData.district,
          pincode: devoteeData.pincode,
          specialInstructions: instructions || undefined,
        }),
      })
      const bookingData = await bookingRes.json()
      if (!bookingData.success) throw new Error(bookingData.message || "Failed to create booking")
      setCreatedBookingId(bookingData.data.id)

      const payRes = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: bookingData.data.id, amount: grandTotal }),
      })
      const payData = await payRes.json()
      if (!payData.success) throw new Error(payData.message || "Failed to create payment order")
      setRazorpayOrder(payData.data)
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Payment failed")
    } finally {
      setPayLoading(false)
    }
  }

  const handlePaySuccess = async (res: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
    await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify",
        orderId: res.razorpay_order_id,
        paymentId: res.razorpay_payment_id,
        signature: res.razorpay_signature,
      }),
    })
    setPaymentDialog(false)
    router.push(`/sevas/book/${slug}/success?bookingId=${createdBookingId}`)
  }

  const dateStr = selectedDate
    ? selectedDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : t("booking.notSelected")

  const stepCanProceed = [
    // Step 0: Date + Quantity
    Boolean(selectedDate && quantity >= 1),
    // Step 1: Devotee details (required fields)
    Boolean(devoteeData.name && devoteeData.phone && devoteeData.email &&
      devoteeData.address && devoteeData.state && devoteeData.district && devoteeData.pincode),
    // Step 2: Instructions (optional)
    true,
    // Step 3: Review
    true,
  ]

  const price = Number(seva.price)
  const grandTotal = price * quantity + Math.round(price * quantity * 0.18)

  const steps: WizardStep[] = [
    {
      id: "date-time",
      title: t("booking.selectDate"),
      content: (
        <DateTimePicker
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          minDate={new Date()}
          quantity={quantity}
          onQuantityChange={setQuantity}
          price={price}
        />
      ),
    },
    {
      id: "devotee",
      title: t("booking.devoteeDetails"),
      content: (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-primary/10"><CheckCircle className="h-5 w-5 text-primary" /></div>
            <h2 className="text-lg font-heading font-bold text-text-primary">{t("booking.devoteeDetails")}</h2>
          </div>
          <DevoteeForm data={devoteeData} onChange={setDevoteeData} />
        </div>
      ),
    },
    {
      id: "instructions",
      title: t("booking.instructions"),
      content: (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-primary/10"><CheckCircle className="h-5 w-5 text-primary" /></div>
            <h2 className="text-lg font-heading font-bold text-text-primary">{t("booking.specialInstructions")}</h2>
          </div>
          <div className="space-y-3">
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={t("booking.instructionsPlaceholder")}
              rows={6} maxLength={500}
              className="w-full rounded-xl border border-gold-200/30 bg-warm-white p-4 text-sm text-text-primary placeholder:text-text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus-visible:outline-none transition-all resize-none shadow-premium"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-text-muted">{t("booking.instructionsHint")}</p>
              <span className={cn("text-xs font-medium tabular-nums", instructions.length > 450 ? "text-maroon-500" : "text-text-muted")}>{instructions.length}/500</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "review",
      title: t("booking.reviewPay"),
      content: (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-primary/10"><CreditCard className="h-5 w-5 text-primary" /></div>
            <h2 className="text-lg font-heading font-bold text-text-primary">{t("booking.reviewLabel")}</h2>
          </div>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-bg-secondary border border-border/50">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{t("booking.seva")}</p>
                <p className="font-semibold text-text-primary">{seva.name}</p>
              </div>
              <div className="p-4 rounded-xl bg-bg-secondary border border-border/50">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{t("booking.dateLabel")}</p>
                <p className="font-semibold text-text-primary">{dateStr}</p>
              </div>
              <div className="p-4 rounded-xl bg-bg-secondary border border-border/50">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{t("booking.quantityLabel")}</p>
                <p className="font-semibold text-text-primary">{quantity}</p>
              </div>
              <div className="p-4 rounded-xl bg-bg-secondary border border-border/50">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{t("booking.total")}</p>
                <p className="font-semibold text-primary">₹{grandTotal.toLocaleString("en-IN")}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-bg-secondary border border-border/50">
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{t("booking.devotee")}</p>
              <p className="font-semibold text-text-primary">{devoteeData.name}</p>
              <p className="text-sm text-text-secondary">{devoteeData.phone} &middot; {devoteeData.email}</p>
            </div>
            <div className="pt-4">
              <Button variant="premium" size="xl" className="w-full" onClick={() => setPaymentDialog(true)} iconRight={<IndianRupee className="h-4 w-4" />}>
                {t("booking.payNow")} {grandTotal.toLocaleString("en-IN")}
              </Button>
              <div className="mt-4 p-3 rounded-xl bg-bg-secondary flex items-start gap-3">
                <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-[10px] text-text-muted leading-relaxed">{t("booking.securePaymentNote")}</p>
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
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-sm text-text-muted mb-6">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/sevas" className="hover:text-secondary transition-colors">{t("nav.sevas")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href={`/sevas/${slug}`} className="hover:text-secondary transition-colors">{seva.name}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("booking.book")}</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-premium shadow-glow-gold/20">
                <CreditCard className="h-7 w-7 text-warm-white" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-text-primary">{t("booking.bookingTitle")} {seva.name}</h1>
                <p className="text-sm text-text-muted">{formatPrice(price)} &middot; {seva.duration ? `${seva.duration} min` : ""}</p>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            <div className="bg-warm-white rounded-2xl border border-gold-200/20 shadow-premium p-6 sm:p-8">
              <BookingWizard steps={steps} onComplete={() => setPaymentDialog(true)} canProceed={stepCanProceed} />
            </div>
            <div className="hidden lg:block">
              <BookingSummary sevaName={seva.name} date={selectedDate ? formatSevaDate(selectedDate) : t("booking.notSelected")} quantity={quantity} price={price} />
            </div>
          </div>
        </div>
      </section>

      <Dialog open={paymentDialog} onClose={() => { if (!payLoading) { setPaymentDialog(false); setRazorpayOrder(null); setPayError("") } }}>
        <DialogContent size="md" className="p-6">
          <DialogHeader className="mb-4"><DialogTitle>{t("booking.confirmPayment")}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-bg-secondary space-y-2">
              <div className="flex justify-between text-sm"><span className="text-text-muted">{t("booking.seva")}</span><span className="font-medium text-text-primary">{seva.name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-muted">{t("booking.dateLabel")}</span><span className="font-medium text-text-primary">{selectedDate ? formatSevaDate(selectedDate) : "-"}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-muted">{t("booking.quantityLabel")}</span><span className="font-medium text-text-primary">{quantity}</span></div>
              <div className="border-t border-border pt-2 mt-2"><div className="flex justify-between"><span className="font-bold text-text-primary">{t("booking.total")}</span><span className="font-bold text-primary text-lg">₹{grandTotal.toLocaleString("en-IN")}</span></div></div>
            </div>

            {razorpayOrder ? (
              <RazorpayButton
                amount={grandTotal}
                orderId={razorpayOrder.order.id}
                name="Sri Kalikamba Temple"
                description={seva.name}
                prefill={{ name: devoteeData.name, email: devoteeData.email, contact: devoteeData.phone }}
                onSuccess={handlePaySuccess}
                onError={() => { setRazorpayOrder(null); setPayError("Payment failed. Please try again.") }}
              />
            ) : (
              <Button variant="premium" size="lg" className="w-full" onClick={handleCreateOrder} loading={payLoading}>
                {payLoading ? t("booking.creatingBooking") : `${t("booking.payNow")} ${grandTotal.toLocaleString("en-IN")}`}
              </Button>
            )}

            {payError && <p className="text-sm text-red-500 text-center">{payError}</p>}
            <div className="flex items-center gap-2 text-xs text-text-muted justify-center"><Shield className="h-3 w-3" /> {t("booking.securedBy")}</div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
