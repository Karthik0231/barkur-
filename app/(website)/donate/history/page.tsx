"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, Download, Eye, Heart, ArrowLeft } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatDate } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

interface DonationRecord {
  id: string
  date: string
  campaign: string
  campaignSlug: string
  amount: number
  receiptNumber: string
  status: string
  isRecurring: boolean
}

const statusStyles: Record<string, "success" | "warning" | "destructive"> = {
  successful: "success",
  refunded: "warning",
  failed: "destructive",
}

export default function DonationHistoryPage() {
  const { t } = useTranslation()
  const [donations, setDonations] = useState<DonationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchDonations() {
      try {
        const res = await fetch("/api/donations?limit=100")
        const json = await res.json()
        if (!res.ok || !json?.success) {
          setError(json?.message || t("common.errorLoading"))
          setLoading(false)
          return
        }
        const mapped = (json.data?.donations || []).map((d: any) => ({
          id: d.id,
          date: d.createdAt,
          campaign: d.campaign?.name || t("donate.generalDonation"),
          campaignSlug: d.campaign?.slug || "general",
          amount: Number(d.amount),
          receiptNumber: d.receiptNumber || `RCP-${d.id.slice(0, 8)}`,
          status: d.status === "PAID" ? "successful" : d.status === "REFUNDED" ? "refunded" : "failed",
          isRecurring: d.isRecurring || false,
        }))
        setDonations(mapped)
        setLoading(false)
      } catch {
        setError(t("common.errorLoading"))
        setLoading(false)
      }
    }
    fetchDonations()
  }, [])

  const totalDonated = donations
    .filter((d) => d.status === "successful")
    .reduce((sum, d) => sum + d.amount, 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-bg-secondary/60 animate-pulse mb-4" />
          <p className="text-text-muted">Loading donation history...</p>
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
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/90 to-primary-dark/90">
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-warm-white leading-tight">
              Donation History
            </h1>
            <p className="text-warm-white/80 text-lg mt-4 max-w-xl mx-auto">
              Track all your contributions to Sri Kalikamba Temple
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
            <Link href="/donate" className="hover:text-secondary transition-colors">{t("nav.donate")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("donate.history")}</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            <Card variant="glass" className="p-5 text-center">
              <p className="text-2xl font-heading font-bold gradient-text">{donations.length}</p>
              <p className="text-xs text-text-muted mt-1">Total Donations</p>
            </Card>
            <Card variant="glass" className="p-5 text-center">
              <p className="text-2xl font-heading font-bold gradient-text">{formatPrice(totalDonated)}</p>
              <p className="text-xs text-text-muted mt-1">Total Donated</p>
            </Card>
            <Card variant="glass" className="p-5 text-center">
              <p className="text-2xl font-heading font-bold gradient-text">
                {donations.filter((d) => d.isRecurring).length}
              </p>
              <p className="text-xs text-text-muted mt-1">Active Recurring</p>
            </Card>
          </div>

          <AnimatedSection>
            <Card variant="elevated" className="overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-heading font-bold text-primary">Donation Records</h2>
                <Link href="/donate">
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4" />
                    New Donation
                  </Button>
                </Link>
              </div>

              {donations.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-text-muted mb-4">No donations found</p>
                  <Link href="/donate">
                    <Button variant="primary">{t("common.makeYourFirstDonation")}</Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-bg-secondary/50">
                        <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-6 py-4">Date</th>
                        <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-6 py-4">Campaign</th>
                        <th className="text-right text-xs font-semibold text-text-muted uppercase tracking-wider px-6 py-4">Amount</th>
                        <th className="text-center text-xs font-semibold text-text-muted uppercase tracking-wider px-6 py-4">Status</th>
                        <th className="text-right text-xs font-semibold text-text-muted uppercase tracking-wider px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.map((donation, idx) => (
                        <motion.tr
                          key={donation.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-border/50 hover:bg-bg-secondary/30 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-text-primary whitespace-nowrap">
                            {formatDate(new Date(donation.date))}
                            {donation.isRecurring && (
                              <Badge variant="secondary" size="xs" className="ml-2">Recurring</Badge>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <Link href={`/donate/${donation.campaignSlug}`} className="text-sm text-primary hover:text-primary-light font-medium transition-colors">
                              {donation.campaign}
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-sm text-text-primary font-semibold text-right whitespace-nowrap">
                            {formatPrice(donation.amount)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Badge variant={statusStyles[donation.status] || "secondary"} size="sm">
                              {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="xs">
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="xs">
                                <Download className="h-3.5 w-3.5" />
                              </Button>
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
    </div>
  )
}
