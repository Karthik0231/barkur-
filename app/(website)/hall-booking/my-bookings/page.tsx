"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, Building2, CalendarDays, Clock, MapPin, XCircle, Eye, Download, AlertTriangle } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { formatPrice, formatDate } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

interface BookingRecord {
  id: string
  bookingId: string
  hallName: string
  hallSlug: string
  eventName: string
  eventDate: string
  startTime: string
  endTime: string
  amount: number
  status: string
  paymentStatus: string
}

const statusColors: Record<string, "success" | "warning" | "destructive" | "primary"> = {
  CONFIRMED: "success",
  PENDING: "warning",
  CANCELLED: "destructive",
  COMPLETED: "primary",
}

const paymentColors: Record<string, "success" | "warning" | "destructive"> = {
  PAID: "success",
  PENDING: "warning",
  REFUNDED: "destructive",
}

export default function MyBookingsPage() {
  const { t } = useTranslation()
  const [bookings, setBookings] = useState<BookingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [cancelDialog, setCancelDialog] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/hall-bookings?limit=100")
        const json = await res.json()
        if (!res.ok || !json?.success) {
          setError(json?.message || "Failed to load bookings")
          setLoading(false)
          return
        }
        const mapped = (json.data?.bookings || []).map((b: any) => ({
          id: b.id,
          bookingId: b.bookingId,
          hallName: b.hall?.name || "Unknown Hall",
          hallSlug: b.hall?.slug || String(b.hallId),
          eventName: b.eventName,
          eventDate: b.bookingDate,
          startTime: new Date(b.startTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
          endTime: new Date(b.endTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
          amount: Number(b.finalAmount),
          status: b.bookingStatus,
          paymentStatus: b.paymentStatus,
        }))
        setBookings(mapped)
        setLoading(false)
      } catch {
        setError("Failed to load bookings")
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const handleCancel = async (bookingId: string) => {
    setCancelling(true)
    try {
      const res = await fetch(`/api/hall-bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingStatus: "CANCELLED", cancellationReason: "Cancelled by user" }),
      })
      const json = await res.json()
      if (!res.ok || !json?.success) {
        setError(json?.message || "Failed to cancel booking")
        setCancelling(false)
        return
      }
      setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: "CANCELLED" } : b))
      setCancelDialog(null)
      setCancelling(false)
    } catch {
      setError("Network error. Please try again.")
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-bg-secondary/60 animate-pulse mb-4" />
          <p className="text-text-muted">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>{t("common.retry")}</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <section className="relative h-[35vh] min-h-[250px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/90 to-primary-dark/90">
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-warm-white leading-tight">
              My Bookings
            </h1>
            <p className="text-warm-white/80 text-lg mt-4 max-w-xl mx-auto">
              View and manage your hall bookings
            </p>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-20" />
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-8">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/hall-booking" className="hover:text-secondary transition-colors">{t("nav.hallBooking")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("myBookings.title")}</span>
          </div>

          <div className="grid sm:grid-cols-4 gap-4 mb-10">
            {[
              { label: t("myBookings.totalBookings"), value: bookings.length, color: "text-primary" },
              { label: t("myBookings.confirmed"), value: bookings.filter((b) => b.status === "CONFIRMED").length, color: "text-emerald-600" },
              { label: t("myBookings.pending"), value: bookings.filter((b) => b.status === "PENDING").length, color: "text-amber-600" },
              { label: t("myBookings.completed"), value: bookings.filter((b) => b.status === "COMPLETED").length, color: "text-blue-600" },
            ].map((stat, idx) => (
              <Card key={idx} variant="glass" className="p-4 text-center">
                <p className={`text-2xl font-heading font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
              </Card>
            ))}
          </div>

          <AnimatedSection>
            <Card variant="elevated" className="overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-heading font-bold text-primary">Booking Records</h2>
                <Link href="/hall-booking">
                  <Button variant="ghost" size="sm">
                    <Building2 className="h-4 w-4" />
                    Book New Hall
                  </Button>
                </Link>
              </div>

              {bookings.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-text-muted mb-4">{t("myBookings.noBookings")}</p>
                  <Link href="/hall-booking">
                    <Button variant="primary">{t("common.bookAHall")}</Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-bg-secondary/50">
                        <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-6 py-4">Booking ID</th>
                        <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-6 py-4">Event</th>
                        <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-6 py-4">Date & Time</th>
                        <th className="text-right text-xs font-semibold text-text-muted uppercase tracking-wider px-6 py-4">Amount</th>
                        <th className="text-center text-xs font-semibold text-text-muted uppercase tracking-wider px-6 py-4">Status</th>
                        <th className="text-center text-xs font-semibold text-text-muted uppercase tracking-wider px-6 py-4">Payment</th>
                        <th className="text-right text-xs font-semibold text-text-muted uppercase tracking-wider px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking, idx) => (
                        <motion.tr
                          key={booking.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-border/50 hover:bg-bg-secondary/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <span className="text-xs font-mono text-text-muted">{booking.bookingId}</span>
                          </td>
                          <td className="px-6 py-4">
                            <Link href={`/hall-booking/${booking.hallSlug}`} className="text-sm text-primary hover:text-primary-light font-medium transition-colors">
                              {booking.hallName}
                            </Link>
                            <p className="text-xs text-text-muted mt-0.5">{booking.eventName}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1 text-xs text-text-primary">
                              <CalendarDays className="h-3 w-3 text-text-muted" />
                              {formatDate(new Date(booking.eventDate))}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-text-muted mt-0.5">
                              <Clock className="h-3 w-3" />
                              {booking.startTime} - {booking.endTime}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-text-primary font-semibold text-right whitespace-nowrap">
                            {formatPrice(booking.amount)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Badge variant={statusColors[booking.status] || "secondary"} size="sm">
                              {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Badge variant={paymentColors[booking.paymentStatus] || "secondary"} size="xs">
                              {booking.paymentStatus.charAt(0) + booking.paymentStatus.slice(1).toLowerCase()}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link href={`/hall-booking/${booking.hallSlug}`}>
                                <Button variant="ghost" size="xs">
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                              </Link>
                              <Button variant="ghost" size="xs">
                                <Download className="h-3.5 w-3.5" />
                              </Button>
                              {(booking.status === "CONFIRMED" || booking.status === "PENDING") && (
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => setCancelDialog(booking.id)}
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </AnimatedSection>
        </div>
      </section>

      <Dialog open={!!cancelDialog} onOpenChange={() => setCancelDialog(null)}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Cancel Booking
              </span>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? Cancellation charges may apply as per the temple's cancellation policy.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button variant="ghost" onClick={() => setCancelDialog(null)}>
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              loading={cancelling}
              onClick={() => cancelDialog && handleCancel(cancelDialog)}
            >
              Yes, Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
