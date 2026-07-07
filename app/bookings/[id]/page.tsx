"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  ChevronRight, Calendar, Clock, IndianRupee, User, MapPin, FileText,
  Download, Printer, ArrowLeft, CheckCircle, XCircle, CreditCard,
  Phone, Mail, Home, Shield
} from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn, formatPrice, formatDate } from "@/lib/utils"

const bookingData = {
  id: "SKT-B001-2026",
  seva: "Nitya Pooja",
  date: new Date(2026, 6, 15),
  time: "7:00 AM - 8:00 AM",
  amount: 501,
  quantity: 1,
  status: "CONFIRMED",
  paymentStatus: "PAID",
  paymentMethod: "Razorpay",
  transactionId: "txn_8f7h3k2m9q",
  devotee: {
    name: "Karthik Sharma",
    gotra: "Bharadwaja",
    nakshatra: "Uttara Phalguni",
    rashi: "Simha",
    phone: "+91 98765 43210",
    email: "karthik@example.com",
    address: "123, Temple Street, Barkur",
    state: "Karnataka",
    district: "Udupi",
    pincode: "576101",
  },
  instructions: "Please perform the pooja for the well-being of my family. Kindly include our family gotra in the sankalpa.",
  createdAt: new Date(2026, 6, 1),
  location: "Sri Kalikamba Temple, Barkur, Udupi",
}

export default function BookingDetailPage() {
  const params = useParams()
  const id = params.id as string
  const booking = bookingData

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-secondary/30 to-bg-primary">
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-text-muted mb-6"
          >
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/bookings" className="hover:text-secondary transition-colors">My Bookings</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{id}</span>
          </motion.div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-text-primary">
                Booking Details
              </h1>
              <p className="text-text-muted mt-1">ID: {booking.id}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Receipt
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card variant="elevated" padding="lg">
                <h2 className="text-lg font-heading font-bold text-text-primary mb-4">
                  Seva Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1">Seva Name</p>
                    <p className="font-semibold text-text-primary">{booking.seva}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1">Booking Date</p>
                    <p className="font-semibold text-text-primary">{formatDate(booking.date)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1">Time Slot</p>
                    <p className="font-semibold text-text-primary">{booking.time}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1">Quantity</p>
                    <p className="font-semibold text-text-primary">{booking.quantity}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1">Amount</p>
                    <p className="font-semibold text-primary">{formatPrice(booking.amount)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1">Location</p>
                    <p className="font-semibold text-text-primary">{booking.location}</p>
                  </div>
                </div>
              </Card>

              <Card variant="elevated" padding="lg">
                <h2 className="text-lg font-heading font-bold text-text-primary mb-4">
                  Devotee Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1 flex items-center gap-1">
                      <User className="h-3 w-3" /> Full Name
                    </p>
                    <p className="font-semibold text-text-primary">{booking.devotee.name}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1">Gotra</p>
                    <p className="font-semibold text-text-primary">{booking.devotee.gotra}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1">Nakshatra</p>
                    <p className="font-semibold text-text-primary">{booking.devotee.nakshatra}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1">Rashi</p>
                    <p className="font-semibold text-text-primary">{booking.devotee.rashi}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1 flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone
                    </p>
                    <p className="font-semibold text-text-primary">{booking.devotee.phone}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1 flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email
                    </p>
                    <p className="font-semibold text-text-primary">{booking.devotee.email}</p>
                  </div>
                  <div className="sm:col-span-2 p-4 rounded-xl bg-bg-secondary">
                    <p className="text-xs text-text-muted mb-1 flex items-center gap-1">
                      <Home className="h-3 w-3" /> Address
                    </p>
                    <p className="font-semibold text-text-primary">
                      {booking.devotee.address}, {booking.devotee.district}, {booking.devotee.state} - {booking.devotee.pincode}
                    </p>
                  </div>
                </div>
              </Card>

              {booking.instructions && (
                <Card variant="elevated" padding="lg">
                  <h2 className="text-lg font-heading font-bold text-text-primary mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Special Instructions
                  </h2>
                  <p className="text-text-secondary leading-relaxed p-4 rounded-xl bg-bg-secondary">
                    "{booking.instructions}"
                  </p>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card variant="elevated" padding="lg" className="sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <h3 className="font-heading font-bold text-text-primary">Booking Status</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary">
                    <span className="text-sm text-text-secondary">Status</span>
                    <Badge variant="success">Confirmed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary">
                    <span className="text-sm text-text-secondary">Payment</span>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm font-semibold text-emerald-600">Paid</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary">
                    <span className="text-sm text-text-secondary">Method</span>
                    <span className="text-sm font-semibold text-text-primary">
                      <CreditCard className="h-3.5 w-3.5 inline mr-1" />
                      {booking.paymentMethod}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary">
                    <span className="text-sm text-text-secondary">Transaction</span>
                    <span className="text-xs font-mono text-text-muted">{booking.transactionId}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary">
                    <span className="text-sm text-text-secondary">Booked On</span>
                    <span className="text-sm font-semibold text-text-primary">
                      {formatDate(booking.createdAt)}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold font-heading text-primary">Total Paid</span>
                      <span className="text-xl font-bold font-heading text-primary">
                        {formatPrice(booking.amount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button variant="gradient" size="lg" className="w-full">
                    <Download className="h-4 w-4 mr-1" />
                    Download Receipt
                  </Button>
                  <Link href="/sevas">
                    <Button variant="outline" size="lg" className="w-full">
                      Book Another Seva
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
