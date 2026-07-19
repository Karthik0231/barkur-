"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, Eye, Download, Filter, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/admin/status-badge"
import { DataTable, type Column } from "@/components/admin/data-table"
import { formatPrice, formatDate } from "@/lib/utils"

interface Booking {
  id: string
  bookingId: string
  devoteeName: string
  seva: string
  date: string
  amount: number
  bookingStatus: string
  paymentStatus: string
  adminApproval: string
  phone: string
  email: string
  quantity: number
  createdAt: string
}



export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("")

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((d) => {
        setBookings(d.data || d || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = bookings.filter((b) => {
    const matchSearch = !search || b.bookingId.toLowerCase().includes(search.toLowerCase()) || b.devoteeName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || b.bookingStatus === statusFilter
    const matchPayment = !paymentFilter || b.paymentStatus === paymentFilter
    return matchSearch && matchStatus && matchPayment
  })

  const columns: Column<Booking>[] = [
    {
      key: "bookingId",
      header: "Booking ID",
      sortable: true,
      render: (item) => (
        <Link href={`/admin/bookings/${item.id}`} className="font-medium text-secondary hover:text-secondary-light">
          {item.bookingId}
        </Link>
      ),
    },
    {
      key: "devoteeName",
      header: "Devotee",
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-medium text-text-primary">{item.devoteeName}</p>
          <p className="text-xs text-text-muted">{item.email}</p>
        </div>
      ),
    },
    {
      key: "seva",
      header: "Seva",
      sortable: true,
      render: (item) => <span className="text-text-primary">{item.seva}</span>,
      hideOnMobile: true,
    },
    {
      key: "date",
      header: "Date",
      sortable: true,
      render: (item) => <span className="text-text-muted">{item.date}</span>,
      hideOnMobile: true,
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (item) => <span className="font-medium text-text-primary">{formatPrice(item.amount)}</span>,
    },
    {
      key: "bookingStatus",
      header: "Status",
      sortable: true,
      render: (item) => <StatusBadge status={item.bookingStatus} size="sm" />,
    },
    {
      key: "paymentStatus",
      header: "Payment",
      sortable: true,
      render: (item) => <StatusBadge status={item.paymentStatus} variant="payment" size="sm" />,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">All Bookings</h1>
          <p className="text-sm text-text-muted mt-1">Manage seva, hall, and shashwatha bookings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" iconLeft={<Download className="h-4 w-4" />}>
            Export
          </Button>
        </div>
      </div>

      <Card variant="elevated" padding="none">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(item) => item.id}
          searchable
          searchQuery={search}
          onSearch={setSearch}
          searchPlaceholder="Search by booking ID or devotee name..."
          selectable
          loading={loading}
          emptyMessage="No bookings found"
          filters={
            <>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 px-3 text-sm rounded-lg border border-border bg-warm-white dark:bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20">
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="h-9 px-3 text-sm rounded-lg border border-border bg-warm-white dark:bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20">
                <option value="">All Payments</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="REFUNDED">Refunded</option>
                <option value="FAILED">Failed</option>
              </select>
            </>
          }
          actions={(item) => (
            <Link
              href={`/admin/bookings/${item.id}`}
              className="p-1.5 rounded-lg text-text-muted hover:text-secondary hover:bg-secondary/10 transition-all inline-flex"
            >
              <Eye className="h-4 w-4" />
            </Link>
          )}
        />
      </Card>
    </div>
  )
}
