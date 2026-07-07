"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar, Clock, IndianRupee, ChevronRight, Search, Eye, MapPin,
  CheckCircle, XCircle, Clock3, ArrowRight, Filter
} from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn, formatPrice, formatDate } from "@/lib/utils"

type BookingTab = "upcoming" | "past" | "cancelled"

const sampleBookings = [
  {
    id: "SKT-B001-2026",
    seva: "Nitya Pooja",
    date: new Date(2026, 6, 15),
    time: "7:00 AM - 8:00 AM",
    amount: 501,
    status: "CONFIRMED",
    type: "upcoming",
    location: "Sri Kalikamba Temple, Barkur",
  },
  {
    id: "SKT-B002-2026",
    seva: "Abhishekam",
    date: new Date(2026, 6, 10),
    time: "9:00 AM - 10:00 AM",
    amount: 1001,
    status: "COMPLETED",
    type: "past",
    location: "Sri Kalikamba Temple, Barkur",
  },
  {
    id: "SKT-B003-2026",
    seva: "Archana",
    date: new Date(2026, 5, 28),
    time: "6:00 AM - 7:00 AM",
    amount: 251,
    status: "CANCELLED",
    type: "cancelled",
    location: "Sri Kalikamba Temple, Barkur",
  },
  {
    id: "SKT-B004-2026",
    seva: "Panchamrita Abhishekam",
    date: new Date(2026, 7, 5),
    time: "10:00 AM - 11:00 AM",
    amount: 2001,
    status: "CONFIRMED",
    type: "upcoming",
    location: "Sri Kalikamba Temple, Barkur",
  },
  {
    id: "SKT-B005-2026",
    seva: "Sahasranama Archana",
    date: new Date(2026, 6, 20),
    time: "8:00 AM - 9:00 AM",
    amount: 751,
    status: "PENDING",
    type: "upcoming",
    location: "Sri Kalikamba Temple, Barkur",
  },
  {
    id: "SKT-B006-2026",
    seva: "Kumkumarchana",
    date: new Date(2026, 5, 15),
    time: "6:00 AM - 7:00 AM",
    amount: 351,
    status: "COMPLETED",
    type: "past",
    location: "Sri Kalikamba Temple, Barkur",
  },
  {
    id: "SKT-B007-2026",
    seva: "Chandi Homa",
    date: new Date(2026, 4, 20),
    time: "9:00 AM - 11:00 AM",
    amount: 5001,
    status: "CANCELLED",
    type: "cancelled",
    location: "Sri Kalikamba Temple, Barkur",
  },
  {
    id: "SKT-B008-2026",
    seva: "Durga Saptashati Parayana",
    date: new Date(2026, 6, 25),
    time: "7:00 AM - 8:30 AM",
    amount: 1501,
    status: "CONFIRMED",
    type: "upcoming",
    location: "Sri Kalikamba Temple, Barkur",
  },
]

const statusConfig = {
  CONFIRMED: { label: "Confirmed", variant: "success" as const },
  COMPLETED: { label: "Completed", variant: "primary" as const },
  PENDING: { label: "Pending", variant: "warning" as const },
  CANCELLED: { label: "Cancelled", variant: "destructive" as const },
}

const tabs: { id: BookingTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "upcoming", label: "Upcoming", icon: Calendar },
  { id: "past", label: "Past", icon: Clock3 },
  { id: "cancelled", label: "Cancelled", icon: XCircle },
]

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingTab>("upcoming")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredBookings = sampleBookings.filter((b) => {
    const matchesTab = b.type === activeTab
    const matchesSearch = b.seva.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="min-h-screen">
      <section className="relative h-[40vh] min-h-[320px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-primary-dark/95" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='0.15'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="relative z-10 text-center px-4">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-warm-white">
              My Bookings
            </h1>
            <p className="text-warm-white/80 text-lg mt-4 max-w-xl mx-auto">
              View and manage all your seva bookings at Sri Kalikamba Temple
            </p>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-10" />
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-text-muted mb-8"
          >
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">My Bookings</span>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex gap-2">
              {tabs.map((tab) => {
                const TabIcon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                      activeTab === tab.id
                        ? "bg-primary text-warm-white shadow-md shadow-primary/20"
                        : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary border border-border",
                    )}
                  >
                    <TabIcon className="h-4 w-4" />
                    {tab.label}
                    <Badge variant={activeTab === tab.id ? "primary" : "default"} size="xs" className="ml-1">
                      {sampleBookings.filter((b) => b.type === tab.id).length}
                    </Badge>
                  </button>
                )
              })}
            </div>
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                iconLeft={<Search className="h-4 w-4" />}
                variant="filled"
                inputSize="sm"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {filteredBookings.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-bg-secondary flex items-center justify-center mb-4">
                  {activeTab === "cancelled" ? (
                    <XCircle className="h-8 w-8 text-text-muted" />
                  ) : (
                    <Calendar className="h-8 w-8 text-text-muted" />
                  )}
                </div>
                <h3 className="text-xl font-heading font-bold text-text-primary">No {activeTab} bookings</h3>
                {activeTab !== "cancelled" && (
                  <Link href="/sevas">
                    <Button variant="secondary" className="mt-4">
                      Book a Seva
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {filteredBookings.map((booking, idx) => {
                  const statusConf = statusConfig[booking.status as keyof typeof statusConfig]
                  return (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card variant="elevated" hover padding="md">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <div className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                                booking.status === "CONFIRMED" && "bg-emerald-100 text-emerald-600",
                                booking.status === "COMPLETED" && "bg-primary/10 text-primary",
                                booking.status === "PENDING" && "bg-amber-100 text-amber-600",
                                booking.status === "CANCELLED" && "bg-red-100 text-red-600",
                              )}>
                                {booking.status === "CANCELLED" ? (
                                  <XCircle className="h-5 w-5" />
                                ) : booking.status === "COMPLETED" ? (
                                  <CheckCircle className="h-5 w-5" />
                                ) : (
                                  <Calendar className="h-5 w-5" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-heading font-bold text-text-primary">{booking.seva}</h3>
                                  <Badge variant={statusConf.variant} size="xs">
                                    {statusConf.label}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-text-muted">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {formatDate(booking.date)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {booking.time}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <IndianRupee className="h-3.5 w-3.5" />
                                    {formatPrice(booking.amount)}
                                  </span>
                                </div>
                                <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {booking.location}
                                </p>
                              </div>
                            </div>
                          </div>
                          <Link href={`/bookings/${booking.id}`}>
                            <Button variant="ghost" size="sm">
                              View Details
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}
