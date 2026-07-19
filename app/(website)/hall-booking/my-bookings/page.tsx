"use client"

import { useState } from "react"
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
  eventDate: Date
  startTime: string
  endTime: string
  amount: number
  status: "confirmed" | "pending" | "cancelled" | "completed"
  paymentStatus: "paid" | "pending" | "refunded"
}

const myBookings: BookingRecord[] = [
  {
    id: "1",
    bookingId: "HALL-2026-0001",
    hallName: "Kalikamba Sabha Bhavana",
    hallSlug: "kalikamba-sabha-bhavana",
    eventName: "Family Wedding Reception",
    eventDate: new Date(2026, 7, 15),
    startTime: "10:00 AM",
    endTime: "6:00 PM",
    amount: 35000,
    status: "confirmed",
    paymentStatus: "paid",
  },
  {
    id: "2",
    bookingId: "HALL-2026-0002",
    hallName: "Shri Madhava Hall",
    hallSlug: "shri-madhava-hall",
    eventName: "Community Meeting",
    eventDate: new Date(2026, 6, 28),
    startTime: "9:00 AM",
    endTime: "1:00 PM",
    amount: 12000,
    status: "pending",
    paymentStatus: "pending",
  },
  {
    id: "3",
    bookingId: "HALL-2026-0003",
    hallName: "Annapurna Dining Hall",
    hallSlug: "annapurna-dining-hall",
    eventName: "Festival Prasadam",
    eventDate: new Date(2026, 5, 10),
    startTime: "11:00 AM",
    endTime: "3:00 PM",
    amount: 8000,
    status: "completed",
    paymentStatus: "paid",
  },
  {
    id: "4",
    bookingId: "HALL-2026-0004",
    hallName: "Veda Study Center",
    hallSlug: "veda-study-center",
    eventName: "Meditation Retreat",
    eventDate: new Date(2026, 3, 5),
    startTime: "6:00 AM",
    endTime: "10:00 AM",
    amount: 5000,
    status: "cancelled",
    paymentStatus: "refunded",
  },
]

const statusColors: Record<string, "success" | "warning" | "destructive" | "primary"> = {
  confirmed: "success",
  pending: "warning",
  cancelled: "destructive",
  completed: "primary",
}

const paymentColors: Record<string, "success" | "warning" | "destructive"> = {
  paid: "success",
  pending: "warning",
  refunded: "destructive",
}

export default function MyBookingsPage() {
  const { t } = useTranslation()
  const [cancelDialog, setCancelDialog] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)

  const handleCancel = (bookingId: string) => {
    setCancelling(true)
    setTimeout(() => {
      setCancelling(false)
      setCancelDialog(null)
    }, 1500)
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
              { label: "Total Bookings", value: myBookings.length, color: "text-primary" },
              { label: "Confirmed", value: myBookings.filter((b) => b.status === "confirmed").length, color: "text-emerald-600" },
              { label: "Pending", value: myBookings.filter((b) => b.status === "pending").length, color: "text-amber-600" },
              { label: "Completed", value: myBookings.filter((b) => b.status === "completed").length, color: "text-blue-600" },
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
                    {myBookings.map((booking, idx) => (
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
                            {formatDate(booking.eventDate)}
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
                          <Badge variant={statusColors[booking.status]} size="sm">
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant={paymentColors[booking.paymentStatus]} size="xs">
                            {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/hall-booking/thank-you`}>
                              <Button variant="ghost" size="xs">
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="xs">
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                            {(booking.status === "confirmed" || booking.status === "pending") && (
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
