"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, Building2, Download, Share2, Home, ArrowRight, CalendarDays, Clock, MapPin, IndianRupee, ChevronRight, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/lib/i18n"

export default function BookingThankYouPage() {
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const bid = searchParams.get("bookingId") || ""
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(!!bid)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (bid) {
      fetch(`/api/hall-bookings/${bid}`)
        .then(r => r.json())
        .then(res => { if (res.success) setBooking(res.data) })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [bid])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

  const b = booking || {}
  const hallName = b.hall?.name || "Hall"
  const eventDate = b.bookingDate ? new Date(b.bookingDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""
  const startStr = b.startTime ? new Date(b.startTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : ""
  const endStr = b.endTime ? new Date(b.endTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : ""

  const handleDownloadInvoice = () => {
    const text = `INVOICE\n\nBooking ID: ${b.bookingId}\nHall: ${hallName}\nEvent: ${b.eventName}\nDate: ${eventDate}\nTime: ${startStr} - ${endStr}\nAmount: ₹${Number(b.totalAmount).toLocaleString("en-IN")}\n\nThank you for booking with Sri Kalikamba Temple!`
    const element = document.createElement("a")
    element.href = `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`
    element.download = `invoice-${b.bookingId}.txt`
    element.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-bg-primary dark:from-emerald-950/10">
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-8 justify-center">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/hall-booking" className="hover:text-secondary transition-colors">{t("nav.hallBooking")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("bookingSuccess.bookingConfirmed")}</span>
          </div>

          <motion.div initial={{ scale: 0 }} animate={mounted ? { scale: 1 } : {}} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}>
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.4 }}>
            <Badge variant="success" size="md" className="mt-4 mb-3">Booking Confirmed</Badge>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary">Booking Successful!</h1>
            <p className="text-lg text-text-secondary mt-4 max-w-xl mx-auto leading-relaxed">Your hall booking has been confirmed. We look forward to hosting your event at Sri Kalikamba Temple.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.6 }} className="mt-8">
            <Card variant="elevated" className="p-6 max-w-lg mx-auto text-left">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-primary text-lg">{hallName}</h3>
                  <p className="text-sm text-text-muted mb-3">{b.eventName || ""}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-text-muted" /><span className="text-text-primary">{eventDate}</span></div>
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-text-muted" /><span className="text-text-primary">{startStr} - {endStr}</span></div>
                    <div className="flex items-center gap-2"><IndianRupee className="h-4 w-4 text-text-muted" /><span className="text-text-primary font-semibold">₹{Number(b.totalAmount || 0).toLocaleString("en-IN")}</span></div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Booking ID</span>
                      <span className="text-text-primary font-mono text-xs">{b.bookingId || bid}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.8 }} className="mt-8">
            <Button variant="primary" size="lg" onClick={handleDownloadInvoice}><Download className="h-4 w-4" />Download Invoice</Button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 1.0 }} className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/hall-booking/my-bookings"><Button variant="outline"><ArrowRight className="h-4 w-4" />View My Bookings</Button></Link>
            <Link href="/hall-booking"><Button variant="ghost"><Building2 className="h-4 w-4" />Book Another Hall</Button></Link>
            <Link href="/"><Button variant="ghost"><Home className="h-4 w-4" />Back to Home</Button></Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
