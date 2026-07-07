"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Check, Download, Printer, Share2, ChevronRight, Calendar, IndianRupee, Clock, ArrowLeft, Heart } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"

const bookingId = "SKT-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase()

export default function BookingSuccessPage() {
  const params = useParams()
  const slug = params.slug as string
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-secondary/30 to-bg-primary flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={mounted ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Card variant="elevated" padding="lg" className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={mounted ? { scale: 1 } : {}}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
            >
              <Check className="h-10 w-10 text-white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              <Badge variant="success" size="md" className="mt-6 mb-3">
                Booking Confirmed
              </Badge>
              <h1 className="text-3xl font-heading font-bold text-text-primary">
                Thank You!
              </h1>
              <p className="text-text-secondary mt-2">
                Your seva booking has been received successfully. A confirmation will be sent to your registered email.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border"
            >
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Booking ID</p>
              <p className="text-xl font-bold font-heading text-primary tracking-wider">{bookingId}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="mt-6 space-y-3 text-left"
            >
              <div className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary">
                <span className="text-sm text-text-secondary">Booking Date</span>
                <span className="text-sm font-semibold text-text-primary">
                  {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary">
                <span className="text-sm text-text-secondary">Amount Paid</span>
                <span className="text-sm font-semibold text-primary">{formatPrice(0)}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary">
                <span className="text-sm text-text-secondary">Payment Status</span>
                <Badge variant="warning" size="sm">Pending</Badge>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <Button variant="gradient" size="lg" className="flex-1">
                <Download className="h-4 w-4 mr-1" />
                Download Receipt
              </Button>
              <Button variant="outline" size="lg" className="flex-1">
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={mounted ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="mt-6 flex items-center justify-center gap-2 text-sm text-text-muted"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share this booking</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.9 }}
              className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row gap-3"
            >
              <Link href="/bookings" className="flex-1">
                <Button variant="secondary" size="lg" className="w-full">
                  View My Bookings
                </Button>
              </Link>
              <Link href="/sevas" className="flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  Book Another Seva
                </Button>
              </Link>
            </motion.div>
          </Card>

          <motion.p
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            transition={{ delay: 1 }}
            className="text-center text-xs text-text-muted mt-6"
          >
            Sri Kalikamba Temple Trust &middot; Barkur, Udupi
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
