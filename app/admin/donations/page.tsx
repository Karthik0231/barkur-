"use client"

import { useState } from "react"
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

const sampleDonations: Donation[] = [
  { id: "1", donationId: "DON-2026-0101", donorName: "Ramesh Hegde", donorEmail: "ramesh@example.com", donorPhone: "+91 98765 43210", amount: 50000, category: "GENERAL", campaignName: "Temple Renovation", isAnonymous: false, isRecurring: true, status: "PAID", createdAt: "2026-07-01" },
  { id: "2", donationId: "DON-2026-0100", donorName: "Anonymous", donorEmail: "", donorPhone: "", amount: 25000, category: "ANNADANAM", campaignName: "Annadana Scheme", isAnonymous: true, isRecurring: false, status: "PAID", createdAt: "2026-06-30" },
  { id: "3", donationId: "DON-2026-0099", donorName: "Shankar Bhat", donorEmail: "shankar@example.com", donorPhone: "+91 87654 32109", amount: 10000, category: "RENOVATION", campaignName: "Temple Renovation", isAnonymous: false, isRecurring: false, status: "PAID", createdAt: "2026-06-28" },
  { id: "4", donationId: "DON-2026-0098", donorName: "Priya Shetty", donorEmail: "priya@example.com", donorPhone: "+91 76543 21098", amount: 5000, category: "FESTIVAL", campaignName: null, isAnonymous: false, isRecurring: false, status: "PAID", createdAt: "2026-06-25" },
  { id: "5", donationId: "DON-2026-0097", donorName: "Gururaj Pai", donorEmail: "guru@example.com", donorPhone: "+91 65432 10987", amount: 15000, category: "GO_SEVA", campaignName: "Gou Seva", isAnonymous: false, isRecurring: true, status: "PAID", createdAt: "2026-06-20" },
  { id: "6", donationId: "DON-2026-0096", donorName: "Latha Rao", donorEmail: "latha@example.com", donorPhone: "+91 54321 09876", amount: 2000, category: "EDUCATION", campaignName: null, isAnonymous: false, isRecurring: false, status: "PENDING", createdAt: "2026-06-18" },
  { id: "7", donationId: "DON-2026-0095", donorName: "Venkatesh Murthy", donorEmail: "venkat@example.com", donorPhone: "+91 43210 98765", amount: 75000, category: "GENERAL", campaignName: "Temple Renovation", isAnonymous: false, isRecurring: true, status: "PAID", createdAt: "2026-06-15" },
  { id: "8", donationId: "DON-2026-0094", donorName: "Anonymous", donorEmail: "", donorPhone: "", amount: 30000, category: "RENOVATION", campaignName: "Gopura Construction", isAnonymous: true, isRecurring: false, status: "PAID", createdAt: "2026-06-10" },
]

export default function DonationsPage() {
  const [donations] = useState<Donation[]>(sampleDonations)
  const [search, setSearch] = useState("")

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
          emptyMessage="No donations found"
        />
      </Card>
    </div>
  )
}
