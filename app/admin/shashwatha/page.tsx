"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Eye, CheckCircle, XCircle, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/admin/status-badge"
import { DataTable, type Column } from "@/components/admin/data-table"
import { formatPrice } from "@/lib/utils"

interface ShashwathaBooking {
  id: string
  bookingId: string
  devotee: string
  type: string
  seva: string
  startDate: string
  amount: number
  status: string
  approval: string
  isLifetime: boolean
}

const types = ["NITYA_POOJA", "NAVARATRI", "SONARATHI"]

const sampleData: ShashwathaBooking[] = [
  { id: "sb1", bookingId: "SHA-2026-0021", devotee: "Ramesh Hegde", type: "NITYA_POOJA", seva: "Nitya Pooja", startDate: "2026-01-01", amount: 50000, status: "ACTIVE", approval: "APPROVED", isLifetime: false },
  { id: "sb2", bookingId: "SHA-2026-0020", devotee: "Lakshmi Devi", type: "NAVARATRI", seva: "Navaratri Special", startDate: "2026-09-25", amount: 25000, status: "PENDING", approval: "PENDING", isLifetime: false },
  { id: "sb3", bookingId: "SHA-2026-0019", devotee: "Venkatesh Rao", type: "SONARATHI", seva: "Sonarathi Seva", startDate: "2026-07-10", amount: 15000, status: "ACTIVE", approval: "APPROVED", isLifetime: true },
  { id: "sb4", bookingId: "SHA-2026-0018", devotee: "Priya Shetty", type: "NITYA_POOJA", seva: "Nitya Pooja", startDate: "2026-03-15", amount: 50000, status: "ACTIVE", approval: "APPROVED", isLifetime: false },
  { id: "sb5", bookingId: "SHA-2026-0017", devotee: "Ganesh Pai", type: "NAVARATRI", seva: "Navaratri Special", startDate: "2025-09-20", amount: 25000, status: "COMPLETED", approval: "APPROVED", isLifetime: false },
]

export default function ShashwathaPage() {
  const [bookings] = useState<ShashwathaBooking[]>(sampleData)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("")

  const filtered = bookings.filter((b) => {
    const matchSearch = !search || b.bookingId.toLowerCase().includes(search.toLowerCase()) || b.devotee.toLowerCase().includes(search.toLowerCase())
    const matchType = !typeFilter || b.type === typeFilter
    return matchSearch && matchType
  })

  const columns: Column<ShashwathaBooking>[] = [
    { key: "bookingId", header: "Booking ID", sortable: true, render: (item) => <span className="font-medium text-secondary">{item.bookingId}</span> },
    { key: "devotee", header: "Devotee", sortable: true, render: (item) => <span className="text-text-primary">{item.devotee}</span> },
    { key: "type", header: "Type", sortable: true, render: (item) => <Badge variant="subtle" size="sm">{item.type.replace(/_/g, " ")}</Badge> },
    { key: "seva", header: "Seva", sortable: true, render: (item) => <span className="text-text-muted">{item.seva}</span>, hideOnMobile: true },
    { key: "amount", header: "Amount", sortable: true, render: (item) => <span className="font-medium">{formatPrice(item.amount)}</span> },
    { key: "approval", header: "Approval", sortable: true, render: (item) => <StatusBadge status={item.approval} variant="approval" size="sm" /> },
    { key: "status", header: "Status", sortable: true, render: (item) => <StatusBadge status={item.status} size="sm" /> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Shashwatha Bookings</h1>
          <p className="text-sm text-text-muted mt-1">Manage recurring and lifetime bookings</p>
        </div>
      </div>

      <Card variant="elevated" padding="none">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(item) => item.id}
          searchable searchQuery={search} onSearch={setSearch}
          searchPlaceholder="Search by ID or devotee..."
          selectable emptyMessage="No shashwatha bookings found"
          filters={
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="h-9 px-3 text-sm rounded-lg border border-border bg-warm-white dark:bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20">
              <option value="">All Types</option>
              {types.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
            </select>
          }
          actions={(item) => (
            <div className="flex items-center gap-1">
              {item.approval === "PENDING" && (
                <>
                  <button className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-all"><CheckCircle className="h-4 w-4" /></button>
                  <button className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-all"><XCircle className="h-4 w-4" /></button>
                </>
              )}
              <button className="p-1.5 rounded-lg text-text-muted hover:text-secondary hover:bg-secondary/10 transition-all"><Eye className="h-4 w-4" /></button>
            </div>
          )}
        />
      </Card>
    </div>
  )
}
