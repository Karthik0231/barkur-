"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, Plus, Eye, Download, TrendingUp, IndianRupee, Users, HandHeart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatsCard } from "@/components/admin/stats-card"
import { DataTable, type Column } from "@/components/admin/data-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { formatPrice } from "@/lib/utils"

interface Donation {
  id: string
  donationId: string
  donorName: string
  donorEmail: string
  donorPhone: string
  amount: number
  category: string
  campaignName: string | null
  isAnonymous: boolean
  isRecurring: boolean
  status: string
  createdAt: string
}



export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("/api/donations")
      .then((r) => r.json())
      .then((d) => {
        setDonations(d.data?.donations || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0)
  const paidAmount = donations.filter((d) => d.status === "PAID").reduce((sum, d) => sum + d.amount, 0)
  const uniqueDonors = new Set(donations.filter((d) => !d.isAnonymous).map((d) => d.donorName)).size

  const filtered = donations.filter((d) =>
    !search || d.donorName.toLowerCase().includes(search.toLowerCase()) || d.donationId.toLowerCase().includes(search.toLowerCase()),
  )

  const columns: Column<Donation>[] = [
    {
      key: "donationId",
      header: "Donation ID",
      sortable: true,
      render: (item) => <span className="font-medium text-secondary">{item.donationId}</span>,
    },
    {
      key: "donorName",
      header: "Donor",
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-medium text-text-primary">{item.isAnonymous ? "Anonymous" : item.donorName}</p>
          {item.donorEmail && <p className="text-xs text-text-muted">{item.donorEmail}</p>}
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (item) => <span className="font-semibold text-text-primary">{formatPrice(item.amount)}</span>,
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (item) => <Badge variant="subtle" size="sm">{item.category.replace(/_/g, " ")}</Badge>,
      hideOnMobile: true,
    },
    {
      key: "campaignName",
      header: "Campaign",
      sortable: true,
      render: (item) => <span className="text-text-muted">{item.campaignName || "-"}</span>,
      hideOnMobile: true,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (item) => <StatusBadge status={item.status} variant="payment" size="sm" />,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Donations</h1>
          <p className="text-sm text-text-muted mt-1">Manage donations, view reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/donations/campaigns">
            <Button variant="outline" size="sm" iconLeft={<HandHeart className="h-4 w-4" />}>
              Campaigns
            </Button>
          </Link>
          <Link href="/admin/donations/reports">
            <Button variant="outline" size="sm" iconLeft={<TrendingUp className="h-4 w-4" />}>
              Reports
            </Button>
          </Link>
          <Button variant="primary" size="sm" iconLeft={<Download className="h-4 w-4" />}>
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard label="Total Donations" value={formatPrice(totalAmount)} icon={<IndianRupee className="h-5 w-5" />} variant="primary" />
        <StatsCard label="Collected" value={formatPrice(paidAmount)} icon={<HandHeart className="h-5 w-5" />} variant="success" />
        <StatsCard label="Unique Donors" value={uniqueDonors} icon={<Users className="h-5 w-5" />} />
      </div>

      <Card variant="elevated" padding="none">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(item) => item.id}
          searchable
          searchQuery={search}
          onSearch={setSearch}
          searchPlaceholder="Search by donor name or ID..."
          selectable
          loading={loading}
          emptyMessage="No donations found"
        />
      </Card>
    </div>
  )
}
