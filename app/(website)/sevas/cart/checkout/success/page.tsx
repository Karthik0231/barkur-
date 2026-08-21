"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Download, Printer, Share2, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

export default function CartCheckoutSuccessPage() {
  const { t } = useTranslation()
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null
  const bid = searchParams?.get("bookingId") || ""
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!bid) { setLoading(false); return }
    fetch(`/api/bookings/${bid}`)
      .then((r) => r.json())
      .then((res) => { if (res.success) setBooking(res.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [bid])

  return (
    <AnimatePresence mode="wait">
      <div className="min-h-screen bg-gradient-to-b from-bg-secondary/30 to-bg-primary flex items-center justify-center px-4 py-16">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="max-w-lg w-full">
            <Card variant="elevated" padding="lg" className="text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Check className="h-10 w-10 text-white" />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Badge variant="success" size="md" className="mt-6 mb-3">{t("bookingSuccess.bookingConfirmed")}</Badge>
                <h1 className="text-3xl font-heading font-bold text-text-primary">{t("bookingSuccess.thankYou")}</h1>
                <p className="text-text-secondary mt-2">{t("bookingSuccess.subtitle")}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{t("booking.bookingId")}</p>
                <p className="text-xl font-bold font-heading text-primary tracking-wider">{booking?.bookingId || bid}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-6 space-y-3 text-left">
                <div className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary">
                  <span className="text-sm text-text-secondary">{t("bookingSuccess.bookingDate")}</span>
                  <span className="text-sm font-semibold text-text-primary">
                    {booking?.createdAt ? new Date(booking.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary">
                  <span className="text-sm text-text-secondary">{t("bookingSuccess.amountPaid")}</span>
                  <span className="text-sm font-semibold text-primary">{formatPrice(Number(booking?.totalAmount || 0))}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-bg-secondary">
                  <span className="text-sm text-text-secondary">{t("bookingSuccess.paymentStatus")}</span>
                  <Badge variant={booking?.paymentStatus === "PAID" ? "success" : "warning"} size="sm">
                    {booking?.paymentStatus === "PAID" ? t("bookingSuccess.paid") : t("bookingSuccess.pending")}
                  </Badge>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
                <Link href="/sevas" className="flex-1">
                  <Button variant="gradient" size="lg" className="w-full">
                    {t("bookingSuccess.bookAnotherSeva")}
                  </Button>
                </Link>
                <Link href="/" className="flex-1">
                  <Button variant="outline" size="lg" className="w-full">
                    Back to Home
                  </Button>
                </Link>
              </motion.div>
            </Card>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="text-center text-xs text-text-muted mt-6">
              {t("bookingSuccess.templeTrust")}
            </motion.p>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  )
}
