"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar, Clock, IndianRupee, ChevronRight, Search, Eye, MapPin,
  CheckCircle, XCircle, Clock3, ArrowRight, Filter, Loader2
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn, formatPrice, formatDate } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"
import { AnimatedSection } from "@/components/animated-section"

type BookingTab = "upcoming" | "past" | "cancelled"

export default function BookingsPage() {
  const { t } = useTranslation()

  const tabs: { id: BookingTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "upcoming", label: t("myBookings.upcoming"), icon: Calendar },
    { id: "past", label: t("myBookings.past"), icon: Clock3 },
    { id: "cancelled", label: t("myBookings.cancelled"), icon: XCircle },
  ]

  const statusConfig: Record<string, { label: string; variant: "success" | "primary" | "warning" | "destructive" }> = {
    CONFIRMED: { label: t("myBookings.confirmed"), variant: "success" },
    COMPLETED: { label: t("myBookings.completed"), variant: "primary" },
    PENDING: { label: t("myBookings.pending"), variant: "warning" },
    CANCELLED: { label: t("myBookings.cancelledStatus"), variant: "destructive" },
  }
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<BookingTab>("upcoming")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetch("/api/bookings?limit=100")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setBookings(res.data.bookings)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const normalized = useMemo(() =>
    bookings.map((b) => {
      const date = b.preferredDate ? new Date(b.preferredDate) : new Date()
      const now = new Date()
      const type: BookingTab =
        b.bookingStatus === "CANCELLED" ? "cancelled"
        : date >= now ? "upcoming"
        : "past"
      const sevaName = b.items?.[0]?.seva?.name || "Seva"
      return { ...b, seva: sevaName, date, type, amount: Number(b.totalAmount) }
    }),
    [bookings]
  )

  const filteredBookings = useMemo(() =>
    normalized.filter((b) => {
      const matchesTab = b.type === activeTab
      const matchesSearch = b.seva.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.bookingId || b.id).toLowerCase().includes(searchQuery.toLowerCase())
      return matchesTab && matchesSearch
    }),
    [activeTab, searchQuery, normalized]
  )

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
                {t("myBookings.title")}
              </h1>
              <p className="text-warm-white/80 text-lg mt-4 max-w-xl mx-auto">
                {t("myBookings.subtitle")}
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
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("myBookings.title")}</span>
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
                      {normalized.filter((b) => b.type === tab.id).length}
                    </Badge>
                  </button>
                )
              })}
            </div>
            <div className="w-full sm:w-64">
              <Input
                placeholder={t("myBookings.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                iconLeft={<Search className="h-4 w-4" />}
                variant="filled"
                inputSize="sm"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </motion.div>
            ) : filteredBookings.length === 0 ? (
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
                <h3 className="text-xl font-heading font-bold text-text-primary">{t("myBookings.noBookings").replace("{tab}", t(`myBookings.${activeTab}`))}</h3>
                {activeTab !== "cancelled" && (
                  <Link href="/sevas">
                    <Button variant="secondary" className="mt-4">
                      {t("myBookings.bookSeva")}
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
                  const statusConf = statusConfig[booking.bookingStatus as keyof typeof statusConfig]
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
                                    {booking.preferredTime}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <IndianRupee className="h-3.5 w-3.5" />
                                    {formatPrice(booking.amount)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Link href={`/bookings/${booking.id}`}>
                            <Button variant="ghost" size="sm">
                              {t("myBookings.viewDetails")}
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
