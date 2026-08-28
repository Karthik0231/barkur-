"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronRight, Calendar, Clock, IndianRupee, Shield, Loader2, CheckCircle, Moon, Star } from "lucide-react"
import { PageBanner } from "@/components/PageBanner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTranslation } from "@/lib/i18n"
import { cn, formatPrice } from "@/lib/utils"
import { RazorpayButton } from "@/components/booking/razorpay-button"
import { nakshatraOptions, rashiOptions } from "@/lib/nakshatra-data"

// Approximate Hunnime (Full Moon) dates for 2025-2026
const HUNNIME_DATES: Record<string, string> = {
  "2025-01": "2025-01-13",
  "2025-02": "2025-02-12",
  "2025-03": "2025-03-14",
  "2025-04": "2025-04-12",
  "2025-05": "2025-05-12",
  "2025-06": "2025-06-11",
  "2025-07": "2025-07-10",
  "2025-08": "2025-08-09",
  "2025-09": "2025-09-07",
  "2025-10": "2025-10-07",
  "2025-11": "2025-11-05",
  "2025-12": "2025-12-04",
  "2026-01": "2026-01-03",
  "2026-02": "2026-02-01",
  "2026-03": "2026-03-03",
  "2026-04": "2026-04-01",
  "2026-05": "2026-05-01",
  "2026-06": "2026-05-30",
  "2026-07": "2026-06-29",
  "2026-08": "2026-07-28",
  "2026-09": "2026-08-27",
  "2026-10": "2026-09-25",
  "2026-11": "2026-10-25",
  "2026-12": "2026-11-23",
}

const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const MONTHS_KN = ["ಜನವರಿ", "ಫೆಬ್ರವರಿ", "ಮಾರ್ಚ್", "ಏಪ್ರಿಲ್", "ಮೇ", "ಜೂನ್", "ಜುಲೈ", "ಆಗಸ್ಟ್", "ಸೆಪ್ಟೆಂಬರ್", "ಅಕ್ಟೋಬರ್", "ನವೆಂಬರ್", "ಡಿಸೆಂಬರ್"]

function getNextHunnimes(count = 6, lang: "kn" | "en" = "kn") {
  const now = new Date()
  const results: { date: Date; label: string; monthKey: string; isPast: boolean }[] = []
  const year = now.getFullYear()
  const month = now.getMonth()
  const months = lang === "kn" ? MONTHS_KN : MONTHS_EN

  for (let i = 0; i < 12; i++) {
    const m = (month + i) % 12
    const y = year + Math.floor((month + i) / 12)
    const key = `${y}-${String(m + 1).padStart(2, "0")}`
    const dateStr = HUNNIME_DATES[key]
    if (!dateStr) continue
    const date = new Date(dateStr + "T00:00:00")
    const isPast = date < now
    if (!isPast || i === 0) {
      results.push({
        date,
        label: `${months[m]} ${date.getDate()}`,
        monthKey: key,
        isPast,
      })
    }
    if (results.length >= count) break
  }
  return results
}

export default function SriChakraPoojaPage() {
  const { t, language } = useTranslation()
  const router = useRouter()

  const hunnimes = useMemo(() => getNextHunnimes(6, language), [language])
  const [selectedHunnime, setSelectedHunnime] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: "", phone: "", email: "", address: "",
    state: "", district: "", pincode: "",
    gotra: "", nakshatra: "", rashi: "", notes: "",
  })
  const [payLoading, setPayLoading] = useState(false)
  const [payError, setPayError] = useState("")
  const [paymentDialog, setPaymentDialog] = useState(false)
  const [razorpayOrder, setRazorpayOrder] = useState<any>(null)
  const [createdBookingId, setCreatedBookingId] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const price = 1100
  const gst = Math.round(price * 0.18)
  const total = price + gst

  const canSubmit = Boolean(
    selectedHunnime && form.name && form.phone && form.email && form.address
    && form.state && form.district && form.pincode
  )

  const handleSubmit = async () => {
    setPayLoading(true)
    setPayError("")
    try {
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sevaId: "sri-chakra-pooja",
          sevaName: "Sri Chakra Pooja",
          sevaPrice: price,
          quantity: 1,
          preferredDate: selectedHunnime,
          preferredTime: "06:00",
          devoteeName: form.name,
          gotra: form.gotra || undefined,
          nakshatra: form.nakshatra || undefined,
          rashi: form.rashi || undefined,
          phone: form.phone,
          email: form.email,
          address: form.address,
          state: form.state,
          district: form.district,
          pincode: form.pincode,
          specialInstructions: form.notes || undefined,
        }),
      })
      const bookingData = await bookingRes.json()
      if (!bookingData.success) throw new Error(bookingData.message || "Failed to create booking")
      setCreatedBookingId(bookingData.data.id)

      const payRes = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: bookingData.data.id, amount: total }),
      })
      const payData = await payRes.json()
      if (!payData.success) throw new Error(payData.message || "Failed to create payment order")
      setRazorpayOrder(payData.data)
    } catch (err) {
      setPayError(err instanceof Error ? err.message : t("sriChakraPooja.paymentFailed"))
    } finally {
      setPayLoading(false)
    }
  }

  const handlePaySuccess = async (res: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
    await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "verify", ...res }),
    })
    setPaymentDialog(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-success/10 flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">
            {t("sriChakraPooja.bookingConfirmed")}
          </h1>
          <p className="text-text-secondary mb-6">
            {t("sriChakraPooja.bookingConfirmedDesc")}
          </p>
          <Button variant="gradient" onClick={() => router.push("/sri-chakra-pooja")}>
            {t("sriChakraPooja.bookAnother")}
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <PageBanner
        title={t("sriChakraPooja.title")}
        eyebrow={t("sriChakraPooja.eyebrow")}
        subtitle={t("sriChakraPooja.subtitle")}
      />

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-sm text-text-muted mb-10">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("sriChakraPooja.title")}</span>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_380px] gap-8">
            {/* Main Content */}
            <div className="space-y-8">
              {/* About */}
              <Card variant="elevated" padding="lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600">
                    <Moon className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-heading font-bold text-text-primary">
                    {t("sriChakraPooja.aboutTitle")}
                  </h2>
                </div>
                <p className="text-text-secondary leading-relaxed">
                  {t("sriChakraPooja.aboutDesc")}
                </p>
                <div className="grid sm:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-bg-secondary text-center">
                    <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-sm font-semibold text-text-primary">{t("sriChakraPooja.monthlyPooja")}</p>
                    <p className="text-xs text-text-muted mt-1">{t("sriChakraPooja.hunnimeDay")}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary text-center">
                    <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-sm font-semibold text-text-primary">{t("sriChakraPooja.poojaTimeValue")}</p>
                    <p className="text-xs text-text-muted mt-1">{t("sriChakraPooja.poojaTime")}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary text-center">
                    <Star className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="text-sm font-semibold text-text-primary">{formatPrice(price)}</p>
                    <p className="text-xs text-text-muted mt-1">{t("sriChakraPooja.poojaFee")}</p>
                  </div>
                </div>
              </Card>

              {/* Select Hunnime Date */}
              <Card variant="elevated" padding="lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold text-text-primary">
                      {t("sriChakraPooja.selectHunnime")}
                    </h3>
                    <p className="text-sm text-text-muted">
                      {t("sriChakraPooja.selectHunnimeSubtext")}
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {hunnimes.map((h) => (
                    <button
                      key={h.monthKey}
                      onClick={() => !h.isPast && setSelectedHunnime(h.monthKey)}
                      disabled={h.isPast}
                      className={cn(
                        "p-4 rounded-xl border-2 text-left transition-all",
                        h.isPast && "opacity-40 cursor-not-allowed border-border bg-bg-secondary/50",
                        selectedHunnime === h.monthKey
                          ? "border-primary bg-primary/5 shadow-md"
                          : !h.isPast && "border-border hover:border-primary/50 hover:bg-bg-secondary/50",
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Moon className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-text-primary">{h.label}</span>
                      </div>
                      <p className="text-xs text-text-muted">
                        {h.date.toLocaleDateString(language === "kn" ? "kn-IN" : "en-IN", { weekday: "long" })}
                      </p>
                      {selectedHunnime === h.monthKey && (
                        <div className="mt-2">
                          <Badge variant="success" size="sm">
                            {t("sriChakraPooja.selected")}
                          </Badge>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Devotee Form */}
              <Card variant="elevated" padding="lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-heading font-bold text-text-primary">
                    {t("sriChakraPooja.devoteeDetails")}
                  </h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input label={t("sriChakraPooja.fullName")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t("sriChakraPooja.enterName")} />
                  <Input label={t("sriChakraPooja.phone")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder={t("sriChakraPooja.phonePlaceholder")} />
                  <Input label={t("sriChakraPooja.emailLabel")} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" type="email" />
                  <Input label={t("sriChakraPooja.address")} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder={t("sriChakraPooja.addressPlaceholder")} />
                  <Input label={t("sriChakraPooja.stateLabel")} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder={t("sriChakraPooja.statePlaceholder")} />
                  <Input label={t("sriChakraPooja.districtLabel")} value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} placeholder={t("sriChakraPooja.districtPlaceholder")} />
                  <Input label={t("sriChakraPooja.pincodeLabel")} value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} placeholder={t("sriChakraPooja.pincodePlaceholder")} />
                  <Input label={t("sriChakraPooja.gotra")} value={form.gotra} onChange={(e) => setForm({ ...form, gotra: e.target.value })} placeholder={t("sriChakraPooja.gotraPlaceholder")} />
                  <select value={form.nakshatra} onChange={(e) => setForm({ ...form, nakshatra: e.target.value })} className="h-10 px-3 text-sm rounded-xl border border-border bg-warm-white text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20">
                    <option value="">{t("sriChakraPooja.nakshatra")}</option>
                    {nakshatraOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <select value={form.rashi} onChange={(e) => setForm({ ...form, rashi: e.target.value })} className="h-10 px-3 text-sm rounded-xl border border-border bg-warm-white text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20">
                    <option value="">{t("sriChakraPooja.rashi")}</option>
                    {rashiOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                <div className="mt-4">
                  <label className="text-sm font-medium text-text-primary mb-1.5 block">
                    {t("sriChakraPooja.specialInstructions")}
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder={t("sriChakraPooja.specialInstructionsPlaceholder")}
                    rows={3}
                    className="w-full rounded-xl border border-border bg-warm-white p-3 text-sm text-text-primary placeholder:text-text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus-visible:outline-none transition-all resize-none"
                  />
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-24 space-y-4 lg:self-start">
              <Card variant="elevated" padding="lg">
                <h3 className="text-lg font-heading font-bold text-text-primary mb-4">
                  {t("sriChakraPooja.bookingSummary")}
                </h3>

                {selectedHunnime && (
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 mb-4">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-primary">
                        {hunnimes.find((h) => h.monthKey === selectedHunnime)?.label}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">{t("sriChakraPooja.poojaFee")}</span>
                    <span className="font-medium text-text-primary">{formatPrice(price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">GST (18%)</span>
                    <span className="font-medium text-text-primary">{formatPrice(gst)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="font-bold text-text-primary">{t("sriChakraPooja.total")}</span>
                    <span className="font-heading font-bold text-lg text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  variant="premium"
                  size="lg"
                  className="w-full mt-6"
                  disabled={!canSubmit || payLoading}
                  loading={payLoading}
                  onClick={() => setPaymentDialog(true)}
                  iconRight={<IndianRupee className="h-4 w-4" />}
                >
                  {payLoading
                    ? t("common.submitting")
                    : `${t("sriChakraPooja.payNow")} ${formatPrice(total)}`}
                </Button>

                <div className="mt-4 p-3 rounded-xl bg-bg-secondary flex items-start gap-3">
                  <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-[10px] text-text-muted leading-relaxed">
                    {t("sriChakraPooja.securePayment")}
                  </p>
                </div>

                {payError && <p className="text-sm text-red-500 text-center mt-3">{payError}</p>}
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Dialog */}
      <Dialog open={paymentDialog} onClose={() => { if (!payLoading) { setPaymentDialog(false); setRazorpayOrder(null); setPayError("") } }}>
        <DialogContent size="md" className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle>{t("sriChakraPooja.confirmPayment")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-bg-secondary space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">{t("sriChakraPooja.pooja")}</span>
                <span className="font-medium text-text-primary">Sri Chakra Pooja</span>
              </div>
              {selectedHunnime && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">{t("sriChakraPooja.date")}</span>
                  <span className="font-medium text-text-primary">{hunnimes.find((h) => h.monthKey === selectedHunnime)?.label}</span>
                </div>
              )}
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-bold text-text-primary">{t("sriChakraPooja.total")}</span>
                  <span className="font-bold text-primary text-lg">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {razorpayOrder ? (
              <RazorpayButton
                amount={total}
                orderId={razorpayOrder.order.id}
                name="Sri Kalikamba Temple"
                description="Sri Chakra Pooja Booking"
                prefill={{ name: form.name, email: form.email, contact: form.phone }}
                onSuccess={handlePaySuccess}
                onError={() => { setRazorpayOrder(null); setPayError(t("sriChakraPooja.paymentFailed")) }}
              />
            ) : (
              <Button variant="premium" size="lg" className="w-full" onClick={handleSubmit} loading={payLoading}>
                {payLoading
                  ? t("common.submitting")
                  : `${t("sriChakraPooja.payNow")} ${formatPrice(total)}`}
              </Button>
            )}

            <div className="flex items-center gap-2 text-xs text-text-muted justify-center">
              <Shield className="h-3 w-3" /> Razorpay
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
