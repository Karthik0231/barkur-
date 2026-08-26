"use client"

import { useState, useEffect } from "react"
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
  Sparkles,
} from "lucide-react"
import { BookingWizard, type WizardStep } from "@/components/booking/booking-wizard"
import { BookingSummary } from "@/components/booking/booking-summary"
import { DateTimePicker } from "@/components/booking/date-time-picker"
import { DevoteeForm, type DevoteeFormData } from "@/components/booking/devotee-form"
import { RazorpayButton } from "@/components/booking/razorpay-button"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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

export default function CartCheckoutPage() {
  const router = useRouter()
  const { t } = useTranslation()

  const [cart, setCart] = useState<CartItem[]>([])
  const [loadingCart, setLoadingCart] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [sharedDevotee, setSharedDevotee] = useState<DevoteeFormData>({
    name: "", gotra: "", nakshatra: "", rashi: "",
    phone: "", email: "", address: "", state: "", district: "", pincode: "",
  })
  const [payLoading, setPayLoading] = useState(false)
  const [payError, setPayError] = useState("")
  const [paymentDialog, setPaymentDialog] = useState(false)
  const [razorpayOrder, setRazorpayOrder] = useState<any>(null)
  const [createdBookingId, setCreatedBookingId] = useState("")

  useEffect(() => {
    const loaded = getCart()
    setCart(loaded)
    setLoadingCart(false)
  }, [])

  const cartTotal = getCartTotal(cart)
  const grandTotal = cartTotal + Math.round(cartTotal * 0.18)

  const canProceed = Boolean(
    cart.length > 0 &&
    selectedDate &&
    sharedDevotee.name &&
    sharedDevotee.phone &&
    sharedDevotee.email &&
    sharedDevotee.address &&
    sharedDevotee.state &&
    sharedDevotee.district &&
    sharedDevotee.pincode,
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
          <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">{t("sevas.cartEmpty")}</h1>
          <p className="text-text-muted mb-6">{t("sevas.cartEmptyDesc")}</p>
          <Link href="/sevas">
            <Button variant="outline" iconLeft={<ArrowLeft className="h-4 w-4" />}>{t("sevas.backToSevas")}</Button>
          </Link>
        </div>
      </div>
    )
  }

  const dateStr = selectedDate
    ? selectedDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : t("booking.notSelected")

  const handleCreateOrder = async () => {
    setPayLoading(true)
    setPayError("")
    try {
      const items = cart.map((it) => ({
        sevaId: it.sevaId,
        quantity: it.quantity,
        unitPrice: it.price,
        devoteeName: sharedDevotee.name,
        gotra: sharedDevotee.gotra || undefined,
        nakshatra: sharedDevotee.nakshatra || undefined,
        rashi: sharedDevotee.rashi || undefined,
      }))

      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          preferredDate: selectedDate?.toISOString(),
          phone: sharedDevotee.phone,
          email: sharedDevotee.email,
          address: sharedDevotee.address,
          state: sharedDevotee.state,
          district: sharedDevotee.district,
          pincode: sharedDevotee.pincode,
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

  const summaryItems = cart.map((it) => ({
    sevaName: it.name,
    quantity: it.quantity,
    price: it.price,
  }))

  const formatSevaDate = (d: Date) =>
    d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })

  const sharedQty = cart.reduce((s, i) => s + i.quantity, 0)
  const sharedPrice = cart.length > 0 ? cart[0].price : 0

  const steps: WizardStep[] = [
    {
      id: "datetime",
      title: t("booking.selectDate"),
      content: (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-primary/10"><CheckCircle className="h-5 w-5 text-primary" /></div>
            <div>
              <h2 className="text-lg font-heading font-bold text-text-primary">{t("booking.selectDate")}</h2>
              <p className="text-sm text-text-muted">{t("booking.selectDateDesc")}</p>
            </div>
          </div>
          <DateTimePicker
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            minDate={new Date()}
            quantity={sharedQty}
            onQuantityChange={() => {}}
            price={sharedPrice}
          />
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">{t("sevas.cartItems")} ({cart.length})</h3>
            {cart.map((it) => (
              <Card key={it.sevaId} variant="bordered" padding="md" className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-text-primary">{it.name}</h4>
                  <p className="text-xs text-text-muted">
                    ₹{it.price.toLocaleString("en-IN")} × {it.quantity} = <span className="font-semibold text-text-primary">₹{(it.price * it.quantity).toLocaleString("en-IN")}</span>
                  </p>
                </div>
                <Badge variant="secondary" size="sm">Qty {it.quantity}</Badge>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "devotee",
      title: t("booking.devoteeDetails"),
      content: (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-primary/10"><CheckCircle className="h-5 w-5 text-primary" /></div>
            <div>
              <h2 className="text-lg font-heading font-bold text-text-primary">{t("booking.devoteeDetails")}</h2>
              <p className="text-sm text-text-muted">{t("booking.devoteeDetailsDesc")}</p>
            </div>
          </div>
          <DevoteeForm data={sharedDevotee} onChange={setSharedDevotee} />
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
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{t("booking.dateLabel")}</p>
                <p className="font-semibold text-text-primary">{dateStr}</p>
              </div>
              <div className="p-4 rounded-xl bg-bg-secondary border border-border/50">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{t("booking.devotee")}</p>
                <p className="font-semibold text-text-primary truncate">{sharedDevotee.name}</p>
                <p className="text-xs text-text-secondary">{sharedDevotee.phone} &middot; {sharedDevotee.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] text-text-muted uppercase tracking-wider px-1">{t("sevas.sevaBreakdown")}</p>
              {cart.map((it) => (
                <div key={it.sevaId} className="p-4 rounded-xl bg-bg-secondary border border-border/50">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-semibold text-sm text-text-primary">{it.name}</h4>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-text-muted">₹{it.price.toLocaleString("en-IN")} × {it.quantity}</p>
                      <p className="font-bold text-sm text-text-primary">₹{(it.price * it.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                </div>
              ))}
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
            <span className="text-text-primary font-medium">{t("booking.cartCheckout")}</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-premium shadow-glow-gold/20">
                <ShoppingCart className="h-7 w-7 text-warm-white" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-text-primary">{t("booking.cartCheckout")} — {cart.length} {t("nav.sevas")}</h1>
                <p className="text-sm text-text-muted">{formatPrice(cartTotal)} · {sharedQty} {t("sevas.items")}</p>
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
                onError={() => { setRazorpayOrder(null); setPayError("Payment was cancelled or failed. Please try again.") }}
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
