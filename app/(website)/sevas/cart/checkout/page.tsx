"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ChevronRight, CreditCard, CheckCircle, Shield, IndianRupee,
  Loader2, ShoppingCart, ArrowLeft, Calendar, Users,
} from "lucide-react"
import { BookingWizard, type WizardStep } from "@/components/booking/booking-wizard"
import { BookingSummary } from "@/components/booking/booking-summary"
import { DateTimePicker } from "@/components/booking/date-time-picker"
import { DevoteeListForm, type DevoteeListGroup, type DevoteeEntry } from "@/components/booking/devotee-list-form"
import { RazorpayButton } from "@/components/booking/razorpay-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/lib/i18n"
import { cn, formatPrice } from "@/lib/utils"
import { getCart, clearCart, getCartTotal, syncCartDevotees, type CartItem } from "@/lib/seva-cart"

export default function CartCheckoutPage() {
  const router = useRouter()
  const { t } = useTranslation()

  const [cart, setCart] = useState<CartItem[]>([])
  const [loadingCart, setLoadingCart] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [devoteeGroups, setDevoteeGroups] = useState<DevoteeListGroup[]>([])
  const [contactName, setContactName] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactAddress, setContactAddress] = useState("")
  const [contactState, setContactState] = useState("")
  const [contactDistrict, setContactDistrict] = useState("")
  const [contactPincode, setContactPincode] = useState("")
  const [payLoading, setPayLoading] = useState(false)
  const [payError, setPayError] = useState("")
  const [paymentDialog, setPaymentDialog] = useState(false)
  const [razorpayOrder, setRazorpayOrder] = useState<any>(null)
  const [createdBookingId, setCreatedBookingId] = useState("")

  useEffect(() => {
    const loaded = getCart()
    setCart(loaded)
    // Initialize devotee groups from cart
    const groups: DevoteeListGroup[] = loaded.map((item) => ({
      sevaId: item.sevaId,
      sevaName: item.name,
      quantity: item.quantity,
      devotees: item.devotees || Array.from({ length: item.quantity }, () => ({
        name: "", gotra: "", nakshatra: "", rashi: "",
      })),
    }))
    setDevoteeGroups(groups)
    setLoadingCart(false)
  }, [])

  // Sync devotee counts when cart changes
  useEffect(() => {
    if (cart.length === 0) return
    const newGroups: DevoteeListGroup[] = cart.map((item) => {
      const existing = devoteeGroups.find((g) => g.sevaId === item.sevaId)
      const devotees = existing?.devotees || []
      // Ensure correct count
      const synced: DevoteeEntry[] = []
      for (let i = 0; i < item.quantity; i++) {
        synced.push(devotees[i] || { name: "", gotra: "", nakshatra: "", rashi: "" })
      }
      return { sevaId: item.sevaId, sevaName: item.name, quantity: item.quantity, devotees: synced }
    })
    setDevoteeGroups(newGroups)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.length])

  const cartTotal = getCartTotal(cart)
  const grandTotal = cartTotal + Math.round(cartTotal * 0.18)
  const totalPersons = cart.reduce((s, i) => s + i.quantity, 0)

  const allDevoteesFilled = useMemo(() => {
    return devoteeGroups.every((g) =>
      g.devotees.every((d) => d.name.trim().length > 0)
    )
  }, [devoteeGroups])

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

  const handleDevoteeGroupsChange = (newGroups: DevoteeListGroup[]) => {
    setDevoteeGroups(newGroups)
    // Persist devotees to cart
    for (const group of newGroups) {
      syncCartDevotees(group.sevaId, group.quantity)
      // Update individual devotees
      const updated = getCart()
      const idx = updated.findIndex((c) => c.sevaId === group.sevaId)
      if (idx >= 0) {
        updated[idx].devotees = group.devotees
      }
      const { saveCart } = require("@/lib/seva-cart")
      saveCart(updated)
    }
  }

  const handleCreateOrder = async () => {
    setPayLoading(true)
    setPayError("")
    try {
      const items = cart.map((it) => {
        const group = devoteeGroups.find((g) => g.sevaId === it.sevaId)
        const devotees = group?.devotees || []
        return {
          sevaId: it.sevaId,
          quantity: it.quantity,
          unitPrice: it.price,
          devotees: devotees.map((d) => ({
            name: d.name,
            gotra: d.gotra || undefined,
            nakshatra: d.nakshatra || undefined,
            rashi: d.rashi || undefined,
          })),
          // Legacy fallback: use first devotee name
          devoteeName: devotees[0]?.name || "",
          gotra: devotees[0]?.gotra || undefined,
          nakshatra: devotees[0]?.nakshatra || undefined,
          rashi: devotees[0]?.rashi || undefined,
        }
      })

      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          preferredDate: selectedDate?.toISOString(),
          phone: contactPhone,
          email: contactEmail,
          address: contactAddress,
          state: contactState,
          district: contactDistrict,
          pincode: contactPincode,
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

  const contactFieldsFilled = Boolean(
    contactName && contactPhone && contactEmail && contactAddress && contactState && contactDistrict && contactPincode
  )

  const stepCanProceed = [
    // Step 0: Date + cart not empty
    Boolean(cart.length > 0 && selectedDate),
    // Step 1: All devotee details filled
    allDevoteesFilled,
    // Step 2: Contact details
    contactFieldsFilled,
    // Step 3: Review
    true,
  ]

  const steps: WizardStep[] = [
    {
      id: "datetime",
      title: t("booking.selectDate"),
      content: (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-primary/10"><Calendar className="h-5 w-5 text-primary" /></div>
            <div>
              <h2 className="text-lg font-heading font-bold text-text-primary">{t("booking.selectDate")}</h2>
              <p className="text-sm text-text-muted">{t("booking.selectDateDesc")}</p>
            </div>
          </div>
          <DateTimePicker
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            minDate={new Date()}
            quantity={totalPersons}
            onQuantityChange={() => {}}
            price={cart[0]?.price || 0}
          />
          {/* Cart items summary */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
              {t("sevas.cartItems")} ({cart.length})
            </h3>
            {cart.map((it) => (
              <Card key={it.sevaId} variant="bordered" padding="md" className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-text-primary truncate">{it.name}</h4>
                  <p className="text-xs text-text-muted">
                    ₹{it.price.toLocaleString("en-IN")} × {it.quantity} = <span className="font-semibold text-text-primary">₹{(it.price * it.quantity).toLocaleString("en-IN")}</span>
                  </p>
                </div>
                <Badge variant="secondary" size="sm">{it.quantity} ×</Badge>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "devotees",
      title: t("booking.personDetails"),
      content: (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
            <div>
              <h2 className="text-lg font-heading font-bold text-text-primary">{t("booking.perPersonDetails")}</h2>
              <p className="text-sm text-text-muted">
                {totalPersons} {t("booking.persons")} — {t("booking.fullName")} *
              </p>
            </div>
          </div>
          <DevoteeListForm
            groups={devoteeGroups}
            onChange={handleDevoteeGroupsChange}
          />
        </div>
      ),
    },
    {
      id: "contact",
      title: t("booking.contactDetails"),
      content: (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-primary/10"><CheckCircle className="h-5 w-5 text-primary" /></div>
            <div>
              <h2 className="text-lg font-heading font-bold text-text-primary">{t("booking.contactPersonDetails")}</h2>
              <p className="text-sm text-text-muted">{t("booking.devoteeDetailsDesc")}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                variant="premium"
                label={t("booking.fullName")}
                placeholder={t("booking.fullNamePlaceholder")}
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
              <Input
                variant="premium"
                label={t("booking.phone")}
                type="tel"
                placeholder={t("booking.phonePlaceholder")}
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>
            <Input
              variant="premium"
              label={t("booking.email")}
              type="email"
              placeholder={t("booking.emailPlaceholder")}
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
            <textarea
              value={contactAddress}
              onChange={(e) => setContactAddress(e.target.value)}
              placeholder={t("booking.addressPlaceholder")}
              rows={3}
              className="w-full rounded-xl border-2 border-gold-200/30 bg-warm-white p-4 text-sm text-text-primary placeholder:text-text-muted focus:border-gold-500 focus:ring-2 focus:ring-gold-500/10 focus-visible:outline-none transition-all resize-none shadow-premium"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Input
                variant="premium"
                label={t("booking.state")}
                placeholder={t("booking.statePlaceholder")}
                value={contactState}
                onChange={(e) => setContactState(e.target.value)}
              />
              <Input
                variant="premium"
                label={t("booking.district")}
                placeholder={t("booking.districtPlaceholder")}
                value={contactDistrict}
                onChange={(e) => setContactDistrict(e.target.value)}
              />
              <Input
                variant="premium"
                label={t("booking.pincode")}
                placeholder={t("booking.pincodePlaceholder")}
                value={contactPincode}
                onChange={(e) => setContactPincode(e.target.value)}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "review",
      title: t("booking.reviewPay"),
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-primary/10"><CreditCard className="h-5 w-5 text-primary" /></div>
            <h2 className="text-lg font-heading font-bold text-text-primary">{t("booking.reviewLabel")}</h2>
          </div>

          {/* Date + Contact */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-bg-secondary border border-border/50">
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{t("booking.dateLabel")}</p>
              <p className="font-semibold text-text-primary text-sm">{dateStr}</p>
            </div>
            <div className="p-4 rounded-xl bg-bg-secondary border border-border/50">
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{t("booking.contactPersonDetails")}</p>
              <p className="font-semibold text-text-primary text-sm truncate">{contactName}</p>
              <p className="text-xs text-text-secondary">{contactPhone} · {contactEmail}</p>
            </div>
          </div>

          {/* Seva breakdown with persons */}
          <div className="space-y-2">
            <p className="text-[10px] text-text-muted uppercase tracking-wider px-1">{t("sevas.sevaBreakdown")}</p>
            {cart.map((it) => {
              const group = devoteeGroups.find((g) => g.sevaId === it.sevaId)
              return (
                <div key={it.sevaId} className="p-4 rounded-xl bg-bg-secondary border border-border/50 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-semibold text-sm text-text-primary">{it.name}</h4>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-text-muted">₹{it.price.toLocaleString("en-IN")} × {it.quantity}</p>
                      <p className="font-bold text-sm text-text-primary">₹{(it.price * it.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                  {group && group.devotees.length > 0 && (
                    <div className="space-y-1">
                      {group.devotees.map((d, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-text-muted">
                          <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                            {i + 1}
                          </span>
                          <span className="truncate">{d.name}</span>
                          {d.rashi && <span className="text-text-secondary">· {d.rashi}</span>}
                          {d.nakshatra && <span className="text-text-secondary">· {d.nakshatra}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Pay button */}
          <div className="pt-4">
            <Button
              variant="premium"
              size="xl"
              className="w-full"
              onClick={() => setPaymentDialog(true)}
              iconRight={<IndianRupee className="h-4 w-4" />}
            >
              {t("booking.payNow")} {grandTotal.toLocaleString("en-IN")}
            </Button>
            <div className="mt-4 p-3 rounded-xl bg-bg-secondary flex items-start gap-3">
              <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-[10px] text-text-muted leading-relaxed">{t("booking.securePaymentNote")}</p>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-secondary/30 to-bg-primary">
      <section className="py-8 sm:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-sm text-text-muted mb-6 flex-wrap">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/sevas" className="hover:text-secondary transition-colors">{t("nav.sevas")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("booking.cartCheckout")}</span>
          </motion.div>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-premium shadow-glow-gold/20">
                <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7 text-warm-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-heading font-bold text-text-primary">
                  {t("booking.cartCheckout")}
                </h1>
                <p className="text-sm text-text-muted">
                  {formatPrice(cartTotal)} · {totalPersons} {t("booking.persons")}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Main grid */}
          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            <div className="bg-warm-white rounded-2xl border border-gold-200/20 shadow-premium p-4 sm:p-6 lg:p-8">
              <BookingWizard
                steps={steps}
                onComplete={() => setPaymentDialog(true)}
                canProceed={stepCanProceed}
              />
            </div>
            {/* Sidebar summary — hidden on mobile */}
            <div className="hidden lg:block">
              <BookingSummary
                items={summaryItems}
                date={selectedDate ? formatSevaDate(selectedDate) : t("booking.notSelected")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Payment Dialog */}
      <Dialog open={paymentDialog} onClose={() => { if (!payLoading) { setPaymentDialog(false); setRazorpayOrder(null); setPayError("") } }}>
        <DialogContent size="md" className="p-4 sm:p-6">
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
                orderId={razorpayOrder.order.id}
                name="Sri Kalikamba Temple"
                description={`${cart.length} seva(s) — ${totalPersons} person(s)`}
                prefill={{ name: contactName, email: contactEmail, contact: contactPhone }}
                onSuccess={handlePaySuccess}
                onError={() => { setRazorpayOrder(null); setPayError("Payment was cancelled or failed. Please try again.") }}
              />
            ) : (
              <Button variant="premium" size="lg" className="w-full" onClick={handleCreateOrder} loading={payLoading}>
                {payLoading ? t("booking.creatingBooking") : `${t("booking.payNow")} ${grandTotal.toLocaleString("en-IN")}`}
              </Button>
            )}

            {payError && <p className="text-sm text-red-500 text-center">{payError}</p>}
            <div className="flex items-center gap-2 text-xs text-text-muted justify-center">
              <Shield className="h-3 w-3" /> {t("booking.securedBy")}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
