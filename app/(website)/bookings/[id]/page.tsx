"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  ChevronRight, User, FileText, Loader2,
  Download, Printer, CheckCircle, XCircle, CreditCard,
  Phone, Mail, Home, Shield, AlertCircle
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatDate } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

export default function BookingDetailPage() {
  const { t } = useTranslation()
  const params = useParams()
  const id = params.id as string
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) return
    fetch(`/api/bookings/${id}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setBooking(res.data)
        else setError(res.message || t("common.errorLoading"))
      })
      .catch(() => setError(t("common.errorLoading")))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )

  if (error || !booking) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <AlertCircle className="h-12 w-12 text-text-muted" />
      <p className="text-text-muted">{error || t("bookingDetail.notFound")}</p>
      <Link href="/bookings"><Button variant="outline">{t("bookingDetail.backToBookings")}</Button></Link>
    </div>
  )

  const d = booking.devoteeDetails || {} as Record<string, string>
  const sevaName = booking.items?.[0]?.seva?.name || "Seva"
  const pay = booking.payments?.[0] || {}
  const paymentStatus = booking.paymentStatus || "PENDING"
  const isPaid = paymentStatus === "PAID"

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-secondary/30 to-bg-primary">
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-text-muted mb-6"
          >
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/bookings" className="hover:text-secondary transition-colors">{t("myBookings.title")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{id}</span>
          </motion.div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-text-primary">
                {t("bookingDetail.title")}
              </h1>
              <p className="text-text-muted mt-1">{t("bookingDetail.bookingId")}: {booking.bookingId}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Download className="h-4 w-4 mr-1" />
                {t("bookingDetail.receipt")}
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                <Printer className="h-4 w-4 mr-1" />
                {t("bookingDetail.print")}
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card variant="elevated" padding="lg">
                <h2 className="text-lg font-heading font-bold text-text-primary mb-4">
                  {t("bookingDetail.sevaInfo")}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1">{t("bookingDetail.sevaName")}</p>
                    <p className="font-semibold text-text-primary">{sevaName}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1">{t("bookingDetail.bookingDate")}</p>
                    <p className="font-semibold text-text-primary">{booking.preferredDate ? formatDate(new Date(booking.preferredDate)) : "-"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1">{t("bookingDetail.timeSlot")}</p>
                    <p className="font-semibold text-text-primary">{booking.preferredTime || "-"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1">{t("booking.quantity")}</p>
                    <p className="font-semibold text-text-primary">{booking.quantity}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1">{t("bookingDetail.amount")}</p>
                    <p className="font-semibold text-primary">{formatPrice(Number(booking.totalAmount))}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1">{t("bookingDetail.location")}</p>
                    <p className="font-semibold text-text-primary">{t("bookingDetail.locationValue")}</p>
                  </div>
                </div>
              </Card>

              <Card variant="elevated" padding="lg">
                <h2 className="text-lg font-heading font-bold text-text-primary mb-4">
                  {t("bookingDetail.devoteeDetails")}
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1 flex items-center gap-1">
                      <User className="h-3 w-3" /> {t("bookingDetail.fullName")}
                    </p>
                    <p className="font-semibold text-text-primary">{d.name || "-"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1">{t("bookingDetail.gotra")}</p>
                    <p className="font-semibold text-text-primary">{d.gotra || "-"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1">{t("booking.nakshatra")}</p>
                    <p className="font-semibold text-text-primary">{d.nakshatra || "-"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1">{t("booking.rashi")}</p>
                    <p className="font-semibold text-text-primary">{d.rashi || "-"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1 flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {t("booking.phone")}
                    </p>
                    <p className="font-semibold text-text-primary">{d.phone || "-"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1 flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {t("booking.email")}
                    </p>
                    <p className="font-semibold text-text-primary">{d.email || "-"}</p>
                  </div>
                  <div className="sm:col-span-2 p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1 flex items-center gap-1">
                      <Home className="h-3 w-3" /> {t("bookingDetail.address")}
                    </p>
                    <p className="font-semibold text-text-primary">
                      {[d.address, d.district, d.state].filter(Boolean).join(", ")}{d.pincode ? ` - ${d.pincode}` : ""}
                    </p>
                  </div>
                </div>
              </Card>

              {booking.specialInstructions && (
                <Card variant="elevated" padding="lg">
                  <h2 className="text-lg font-heading font-bold text-text-primary mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {t("bookingDetail.specialInstructions")}
                  </h2>
                  <p className="text-text-secondary leading-relaxed p-4 rounded-xl bg-bg-secondary">
                    "{booking.specialInstructions}"
                  </p>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card variant="elevated" padding="lg" className="sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="font-heading font-bold text-text-primary">{t("bookingDetail.bookingStatus")}</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary">
                    <span className="text-sm text-text-secondary">{t("bookingDetail.status")}</span>
                    <Badge variant={booking.bookingStatus === "CONFIRMED" ? "success" : booking.bookingStatus === "CANCELLED" ? "destructive" : booking.bookingStatus === "COMPLETED" ? "primary" : "warning"}>
                      {booking.bookingStatus === "CONFIRMED" ? t("myBookings.confirmed") : booking.bookingStatus === "CANCELLED" ? t("myBookings.cancelledStatus") : booking.bookingStatus === "COMPLETED" ? t("myBookings.completed") : t("myBookings.pending")}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary">
                    <span className="text-sm text-text-secondary">{t("bookingDetail.payment")}</span>
                    <div className="flex items-center gap-1.5">
                      {isPaid ? (
                        <><CheckCircle className="h-4 w-4 text-emerald-500" /><span className="text-sm font-semibold text-emerald-600">{t("bookingDetail.paid")}</span></>
                      ) : (
                        <><XCircle className="h-4 w-4 text-amber-500" /><span className="text-sm font-semibold text-amber-600">{paymentStatus}</span></>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary">
                    <span className="text-sm text-text-secondary">{t("bookingDetail.method")}</span>
                    <span className="text-sm font-semibold text-text-primary">
                      <CreditCard className="h-3.5 w-3.5 inline mr-1" />
                      {pay.method || "Razorpay"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary">
                    <span className="text-sm text-text-secondary">{t("bookingDetail.transaction")}</span>
                    <span className="text-xs font-mono text-text-muted">{pay.razorpayPaymentId || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary">
                    <span className="text-sm text-text-secondary">{t("bookingDetail.bookedOn")}</span>
                    <span className="text-sm font-semibold text-text-primary">
                      {booking.createdAt ? formatDate(new Date(booking.createdAt)) : "-"}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold font-heading text-primary">{t("bookingDetail.totalPaid")}</span>
                      <span className="text-xl font-bold font-heading text-primary">
                        {formatPrice(Number(booking.totalAmount))}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button variant="gradient" size="lg" className="w-full">
                    <Download className="h-4 w-4 mr-1" />
                    {t("bookingDetail.downloadReceipt")}
                  </Button>
                  <Link href="/sevas">
                    <Button variant="outline" size="lg" className="w-full">
                      {t("bookingDetail.bookAnotherSeva")}
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
