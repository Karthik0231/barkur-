"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Eye, CheckCircle, XCircle, Filter } from "lucide-react"
import toast from "react-hot-toast"
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



export default function ShashwathaPage() {
  const [bookings, setBookings] = useState<ShashwathaBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("")

  useEffect(() => {
    fetch("/api/shashwatha")
      .then((r) => r.json())
      .then((d) => {
        setBookings(d.data?.bookings || d.data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleApproval = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/shashwatha/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminApproval: status }),
      })
      if (!res.ok) throw new Error()
      toast.success(`Booking ${status.toLowerCase()}`)
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, approval: status } : b))
    } catch {
      toast.error("Failed to update approval")
    }
  }

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
          selectable loading={loading} emptyMessage="No shashwatha bookings found"
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
                  <button onClick={() => handleApproval(item.id, "APPROVED")} className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-all"><CheckCircle className="h-4 w-4" /></button>
                  <button onClick={() => handleApproval(item.id, "REJECTED")} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-all"><XCircle className="h-4 w-4" /></button>
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
