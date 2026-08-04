"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ChevronRight,
  CreditCard,
  CheckCircle,
  Shield,
  IndianRupee,
  Loader2,
  ShoppingCart,
  ArrowLeft,
  User,
  Sparkles,
} from "lucide-react"
import { BookingWizard, type WizardStep } from "@/components/booking/booking-wizard"
import { BookingSummary } from "@/components/booking/booking-summary"
import { DateTimePicker } from "@/components/booking/date-time-picker"
import { DevoteeForm, type DevoteeFormData } from "@/components/booking/devotee-form"
import { RazorpayButton } from "@/components/booking/razorpay-button"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/lib/i18n"
import { cn, formatPrice } from "@/lib/utils"
import {
  getCart,
  clearCart,
  getCartTotal,
  type CartItem,
} from "@/lib/seva-cart"
import { nakshatraOptions, rashiOptions } from "@/lib/nakshatra-data"

interface PerSevaDevotee {
  name: string
  nakshatra: string
  rashi: string
  gothra: string
  notes: string
}

export default function CartCheckoutPage() {
  const router = useRouter()
  const { t } = useTranslation()

  const [cart, setCart] = useState<CartItem[]>([])
  const [loadingCart, setLoadingCart] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState("")
  const [sharedDevotee, setSharedDevotee] = useState<DevoteeFormData>({
    name: "", gotra: "", nakshatra: "", rashi: "",
    phone: "", email: "", address: "", state: "", district: "", pincode: "",
  })
  const [perSevaDevotee, setPerSevaDevotee] = useState<Record<string, PerSevaDevotee>>({})
  const [payLoading, setPayLoading] = useState(false)
  const [payError, setPayError] = useState("")
  const [paymentDialog, setPaymentDialog] = useState(false)
  const [razorpayOrder, setRazorpayOrder] = useState<any>(null)
  const [createdBookingId, setCreatedBookingId] = useState("")

  useEffect(() => {
    const loaded = getCart()
    setCart(loaded)
    const init: Record<string, PerSevaDevotee> = {}
    for (const it of loaded) {
      init[it.sevaId] = it.devoteeDetails ?? { name: "", nakshatra: "", rashi: "", gothra: "", notes: "" }
    }
    setPerSevaDevotee(init)
    setLoadingCart(false)
  }, [])

  const cartTotal = getCartTotal(cart)
  const grandTotal = cartTotal + Math.round(cartTotal * 0.18)

  const allItemsHaveDevotee = useMemo(() => {
    return cart.every((it) => {
      const d = perSevaDevotee[it.sevaId]
      return d && d.name.trim().length > 0
    })
  }, [cart, perSevaDevotee])

  const canProceed = Boolean(
    cart.length > 0 &&
    selectedDate &&
    selectedTime &&
    sharedDevotee.name &&
    sharedDevotee.phone &&
    sharedDevotee.email &&
    sharedDevotee.address &&
    sharedDevotee.state &&
    sharedDevotee.district &&
    sharedDevotee.pincode &&
    allItemsHaveDevotee,
  )

  if (loadingCart) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg-secondary/30 to-bg-primary py-20 px-4">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-bg-secondary flex items-center justify-center mb-6">
            <ShoppingCart className="h-12 w-12 text-text-muted" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">Your cart is empty</h1>
          <p className="text-text-muted mb-6">Add some sevas to your cart before checking out.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/sevas">
              <Button variant="outline" iconLeft={<ArrowLeft className="h-4 w-4" />}>Back to Sevas</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const updatePerSeva = (sevaId: string, field: keyof PerSevaDevotee, value: string) => {
    setPerSevaDevotee((prev) => {
      const cur = prev[sevaId] ?? { name: "", nakshatra: "", rashi: "", gothra: "", notes: "" }
      return { ...prev, [sevaId]: { ...cur, [field]: value } }
    })
  }

  const applySharedNameToAll = () => {
    if (!sharedDevotee.name) return
    setPerSevaDevotee((prev) => {
      const next = { ...prev }
      for (const it of cart) {
        next[it.sevaId] = {
          name: sharedDevotee.name,
          nakshatra: sharedDevotee.nakshatra || next[it.sevaId]?.nakshatra || "",
          rashi: sharedDevotee.rashi || next[it.sevaId]?.rashi || "",
          gothra: sharedDevotee.gotra || next[it.sevaId]?.gothra || "",
          notes: next[it.sevaId]?.notes || "",
        }
      }
      return next
    })
  }

  const dateStr = selectedDate
    ? selectedDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : t("booking.notSelected")
  const timeStr = selectedTime || t("booking.notSelected")

  const handleCreateOrder = async () => {
    setPayLoading(true)
    setPayError("")
    try {
      const items = cart.map((it) => {
        const d = perSevaDevotee[it.sevaId] ?? { name: "", nakshatra: "", rashi: "", gothra: "", notes: "" }
        return {
          sevaId: it.sevaId,
          quantity: it.quantity,
          unitPrice: it.price,
          devoteeName: d.name,
          gotra: d.gothra || undefined,
          nakshatra: d.nakshatra || undefined,
          rashi: d.rashi || undefined,
          specialInstructions: d.notes || undefined,
        }
      })

      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          preferredDate: selectedDate?.toISOString(),
          preferredTime: selectedTime,
          phone: sharedDevotee.phone,
          email: sharedDevotee.email,
          address: sharedDevotee.address,
          state: sharedDevotee.state,
          district: sharedDevotee.district,
          pincode: sharedDevotee.pincode,
          remarks: Object.values(perSevaDevotee).map((d) => d.notes).filter(Boolean).join(" | ") || undefined,
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
      body: JSON.stringify({ action: "verify", ...res }),
    })
    setPaymentDialog(false)
    clearCart()
    router.push(`/sevas/cart/checkout/success?bookingId=${createdBookingId}`)
  }

  const handlePayError = () => {
    setRazorpayOrder(null)
    setPayError("Payment was cancelled or failed. Please try again.")
  }

  const summaryItems = cart.map((it) => ({
    sevaName: it.name,
    quantity: it.quantity,
    price: it.price,
    devoteeName: perSevaDevotee[it.sevaId]?.name,
  }))

  const formatSevaDate = (d: Date) =>
    d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })

  const sharedPrice = cart.length > 0 ? cart[0].price : 0
  const sharedQty = cart.reduce((s, i) => s + i.quantity, 0)

  const steps: WizardStep[] = [
    {
      id: "datetime",
      title: "Date & Time",
      content: (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-primary/10"><CheckCircle className="h-5 w-5 text-primary" /></div>
            <div>
              <h2 className="text-lg font-heading font-bold text-text-primary">Schedule &amp; Cart</h2>
              <p className="text-sm text-text-muted">Select preferred date and time for all sevas</p>
            </div>
          </div>
          <DateTimePicker
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
            minDate={new Date()}
            quantity={sharedQty}
            onQuantityChange={() => {}}
            price={sharedPrice}
          />
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Cart Items ({cart.length})</h3>
            {cart.map((it) => {
              const d = perSevaDevotee[it.sevaId]
              return (
                <Card key={it.sevaId} variant="bordered" padding="md" className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-text-primary">{it.name}</h4>
                      <Badge variant="secondary" size="sm">Qty {it.quantity}</Badge>
                    </div>
                    <p className="text-xs text-text-muted">
                      ₹{it.price.toLocaleString("en-IN")} × {it.quantity} = <span className="font-semibold text-text-primary">₹{(it.price * it.quantity).toLocaleString("en-IN")}</span>
                    </p>
                    {d?.name && <p className="text-xs text-text-secondary mt-1 flex items-center gap-1"><User className="h-3 w-3" />Devotee: {d.name}</p>}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      ),
    },
    {
      id: "devotee",
      title: "Contact Details",
      content: (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-primary/10"><CheckCircle className="h-5 w-5 text-primary" /></div>
            <div>
              <h2 className="text-lg font-heading font-bold text-text-primary">Contact Information</h2>
              <p className="text-sm text-text-muted">This information is used for booking confirmation</p>
            </div>
          </div>
          <DevoteeForm data={sharedDevotee} onChange={setSharedDevotee} />
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={applySharedNameToAll}
              iconLeft={<Sparkles className="h-4 w-4" />}
              disabled={!sharedDevotee.name}
            >
              Apply shared name &amp; details to all sevas
            </Button>
          </div>
        </div>
      ),
    },
    {
      id: "per-seva",
      title: "Seva Devotees",
      content: (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-primary/10"><User className="h-5 w-5 text-primary" /></div>
            <div>
              <h2 className="text-lg font-heading font-bold text-text-primary">Devotee per Seva</h2>
              <p className="text-sm text-text-muted">Each seva must have its own devotee information</p>
            </div>
          </div>
          <div className="space-y-5">
            {cart.map((it, idx) => {
              const d = perSevaDevotee[it.sevaId] ?? { name: "", nakshatra: "", rashi: "", gothra: "", notes: "" }
              const complete = d.name.trim().length > 0
              return (
                <motion.div
                  key={it.sevaId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card variant="elevated" padding="lg" className={cn("transition-all", !complete && "ring-2 ring-maroon-200/50")}>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{idx + 1}</span>
                          <h4 className="font-heading font-bold text-text-primary">{it.name}</h4>
                          <Badge variant="secondary" size="sm">Qty {it.quantity}</Badge>
                        </div>
                        <p className="text-xs text-text-muted mt-1">₹{it.price.toLocaleString("en-IN")} each</p>
                      </div>
                      {complete ? (
                        <Badge variant="success" size="sm"><CheckCircle className="h-3 w-3 mr-1" />Complete</Badge>
                      ) : (
                        <Badge variant="secondary" size="sm">Devotee name required</Badge>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input
                        label="Devotee Full Name *"
                        placeholder="Enter devotee name"
                        inputSize="sm"
                        value={d.name}
                        onChange={(e) => updatePerSeva(it.sevaId, "name", e.target.value)}
                      />
                      <Input
                        label="Gothra"
                        placeholder="e.g. Bharadwaja"
                        inputSize="sm"
                        value={d.gothra}
                        onChange={(e) => updatePerSeva(it.sevaId, "gothra", e.target.value)}
                      />
                      <Select
                        label="Nakshatra"
                        size="sm"
                        options={nakshatraOptions}
                        value={d.nakshatra}
                        onChange={(e) => updatePerSeva(it.sevaId, "nakshatra", e.target.value)}
                        placeholder="Select nakshatra"
                      />
                      <Select
                        label="Rashi"
                        size="sm"
                        options={rashiOptions}
                        value={d.rashi}
                        onChange={(e) => updatePerSeva(it.sevaId, "rashi", e.target.value)}
                        placeholder="Select rashi"
                      />
                    </div>
                    <textarea
                      value={d.notes}
                      onChange={(e) => updatePerSeva(it.sevaId, "notes", e.target.value)}
                      placeholder="Special notes, sankalpa details, or instructions for this seva..."
                      rows={2}
                      maxLength={500}
                      className="w-full mt-3 rounded-xl border border-border bg-bg-secondary p-3 text-sm text-text-primary placeholder:text-text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus-visible:outline-none transition-all resize-none"
                    />
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      ),
    },
    {
      id: "review",
      title: "Review &amp; Pay",
      content: (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-primary/10"><CreditCard className="h-5 w-5 text-primary" /></div>
            <h2 className="text-lg font-heading font-bold text-text-primary">Review &amp; Payment</h2>
          </div>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-bg-secondary border border-border/50">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Date</p>
                <p className="font-semibold text-text-primary">{dateStr}</p>
              </div>
              <div className="p-4 rounded-xl bg-bg-secondary border border-border/50">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Time</p>
                <p className="font-semibold text-text-primary">{timeStr}</p>
              </div>
              <div className="p-4 rounded-xl bg-bg-secondary border border-border/50">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Contact</p>
                <p className="font-semibold text-text-primary truncate">{sharedDevotee.name}</p>
                <p className="text-xs text-text-secondary">{sharedDevotee.phone} &middot; {sharedDevotee.email}</p>
              </div>
              <div className="p-4 rounded-xl bg-bg-secondary border border-border/50">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Sevas</p>
                <p className="font-semibold text-text-primary">{cart.length} seva{cart.length > 1 ? "s" : ""} &middot; {cart.reduce((s, i) => s + i.quantity, 0)} total</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] text-text-muted uppercase tracking-wider px-1">Seva Breakdown</p>
              {cart.map((it) => {
                const d = perSevaDevotee[it.sevaId]
                return (
                  <div key={it.sevaId} className="p-4 rounded-xl bg-bg-secondary border border-border/50">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-text-primary">{it.name}</h4>
                        {d?.name && <p className="text-xs text-text-secondary mt-0.5">Devotee: {d.name}{d.nakshatra ? ` · ${d.nakshatra}` : ""}{d.rashi ? ` · ${d.rashi}` : ""}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-text-muted">₹{it.price.toLocaleString("en-IN")} × {it.quantity}</p>
                        <p className="font-bold text-sm text-text-primary">₹{(it.price * it.quantity).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-secondary/30 to-bg-primary">
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-sm text-text-muted mb-6 flex-wrap">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/sevas" className="hover:text-secondary transition-colors">{t("nav.sevas")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">Cart Checkout</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-premium shadow-glow-gold/20">
                <ShoppingCart className="h-7 w-7 text-warm-white" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-text-primary">Cart Checkout — {cart.length} Seva{cart.length > 1 ? "s" : ""}</h1>
                <p className="text-sm text-text-muted">Total {formatPrice(cartTotal)} · {cart.reduce((s, i) => s + i.quantity, 0)} items</p>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            <div className="bg-warm-white rounded-2xl border border-gold-200/20 shadow-premium p-6 sm:p-8">
              <BookingWizard steps={steps} onComplete={() => setPaymentDialog(true)} canProceed={canProceed} />
            </div>
            <div className="hidden lg:block">
              <BookingSummary
                items={summaryItems}
                date={selectedDate ? formatSevaDate(selectedDate) : t("booking.notSelected")}
                time={timeStr}
              />
            </div>
          </div>
        </div>
      </section>

      <Dialog open={paymentDialog} onClose={() => { if (!payLoading) { setPaymentDialog(false); setRazorpayOrder(null); setPayError("") } }}>
        <DialogContent size="md" className="p-6">
          <DialogHeader className="mb-4"><DialogTitle>{t("booking.confirmPayment")}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-bg-secondary space-y-2">
              {cart.map((it) => (
                <div key={it.sevaId} className="flex justify-between text-sm gap-2">
                  <span className="text-text-muted truncate">{it.name} × {it.quantity}</span>
                  <span className="font-medium text-text-primary shrink-0">₹{(it.price * it.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">{t("booking.dateLabel")}</span>
                <span className="font-medium text-text-primary">{selectedDate ? formatSevaDate(selectedDate) : "-"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">{t("booking.timeLabel")}</span>
                <span className="font-medium text-text-primary">{timeStr}</span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-bold text-text-primary">{t("booking.total")}</span>
                  <span className="font-bold text-primary text-lg">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {razorpayOrder ? (
              <RazorpayButton
                amount={grandTotal}
                orderId={razorpayOrder.razorpayOrderId}
                name="Sri Kalikamba Temple"
                description={`${cart.length} seva(s) booking`}
                prefill={{ name: sharedDevotee.name, email: sharedDevotee.email, contact: sharedDevotee.phone }}
                onSuccess={handlePaySuccess}
                onError={handlePayError}
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
