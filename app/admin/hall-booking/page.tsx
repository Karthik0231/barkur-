"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Eye, CheckCircle, XCircle, Calendar, MapPin, Users, IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/admin/status-badge"
import { DataTable, type Column } from "@/components/admin/data-table"
import { Calendar as CalendarView } from "@/components/ui/calendar"
import { formatPrice } from "@/lib/utils"
import toast from "react-hot-toast"

interface HallBooking {
  id: string
  bookingId: string
  hall: string
  eventName: string
  organizer: string
  date: string
  startTime: string
  endTime: string
  amount: number
  status: string
  paymentStatus: string
  approval: string
  expectedGuests: number
}

export default function HallBookingPage() {
  const [bookings, setBookings] = useState<HallBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [view, setView] = useState<"list" | "calendar">("list")

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/hall-bookings")
      const json = await res.json()
      const data = json.data?.bookings ?? []
      setBookings(Array.isArray(data) ? data : [])
    } catch {
      toast.error("Failed to fetch bookings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [])

  const filtered = bookings.filter((b) => !search || b.bookingId.toLowerCase().includes(search.toLowerCase()) || b.organizer.toLowerCase().includes(search.toLowerCase()) || b.eventName.toLowerCase().includes(search.toLowerCase()))

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/hall-bookings/${id}/approve`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ approved: true }) })
      const json = await res.json()
      if (!json.success) { toast.error(json.message); return }
      toast.success(json.message)
      fetchBookings()
    } catch { toast.error("Failed to approve booking") }
  }

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/hall-bookings/${id}/approve`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ approved: false }) })
      const json = await res.json()
      if (!json.success) { toast.error(json.message); return }
      toast.success(json.message)
      fetchBookings()
    } catch { toast.error("Failed to reject booking") }
  }

  const columns: Column<HallBooking>[] = [
    { key: "bookingId", header: "Booking ID", sortable: true, render: (item) => <span className="font-medium text-secondary">{item.bookingId}</span> },
    { key: "eventName", header: "Event", sortable: true, render: (item) => <div><p className="font-medium text-text-primary">{item.eventName}</p><p className="text-xs text-text-muted">{item.hall}</p></div> },
    { key: "organizer", header: "Organizer", sortable: true, render: (item) => <span className="text-text-primary">{item.organizer}</span> },
    { key: "date", header: "Date", sortable: true, render: (item) => <span className="text-text-muted">{item.date}</span>, hideOnMobile: true },
    { key: "amount", header: "Amount", sortable: true, render: (item) => <span className="font-medium">{formatPrice(item.amount)}</span> },
    { key: "approval", header: "Approval", sortable: true, render: (item) => <StatusBadge status={item.approval} variant="approval" size="sm" /> },
    { key: "status", header: "Status", sortable: true, render: (item) => <StatusBadge status={item.status} size="sm" /> },
  ]

  const bookedDates = bookings.filter((b) => b.status === "CONFIRMED" || b.status === "PENDING").map((b) => new Date(b.date))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Hall Bookings</h1>
          <p className="text-sm text-text-muted mt-1">Manage temple hall and auditorium bookings</p>
        </div>
        <div className="flex items-center gap-2 bg-bg-secondary rounded-xl p-1">
          <button onClick={() => setView("list")} className={cn("px-3 py-1.5 text-sm font-medium rounded-lg transition-all", view === "list" ? "bg-warm-white dark:bg-bg-primary shadow-sm text-text-primary" : "text-text-muted hover:text-text-primary")}>List</button>
          <button onClick={() => setView("calendar")} className={cn("px-3 py-1.5 text-sm font-medium rounded-lg transition-all", view === "calendar" ? "bg-warm-white dark:bg-bg-primary shadow-sm text-text-primary" : "text-text-muted hover:text-text-primary")}>Calendar</button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-muted">Loading...</div>
      ) : (<>
      {view === "calendar" ? (
        <Card className="p-6">
          <h3 className="text-lg font-semibold font-heading text-text-primary mb-4">Booking Calendar</h3>
          <CalendarView
            selected={new Date()}
            bookedDates={bookedDates}
            highlightDates={bookedDates}
          />
          <div className="mt-4 space-y-2">
            {bookings.filter((b) => b.status === "CONFIRMED" || b.status === "PENDING").map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-bg-secondary/50 text-sm">
                <div><span className="font-medium text-text-primary">{b.bookingId}</span> - {b.eventName} ({b.date})</div>
                <StatusBadge status={b.approval} variant="approval" size="xs" />
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card variant="elevated" padding="none">
          <DataTable
            columns={columns}
            data={filtered}
            keyExtractor={(item) => item.id}
            searchable searchQuery={search} onSearch={setSearch}
            searchPlaceholder="Search by ID, event, or organizer..."
            selectable emptyMessage="No hall bookings found"
            actions={(item) => (
              <div className="flex items-center gap-1">
                {item.approval === "PENDING" && (
                  <>
                    <button onClick={() => handleApprove(item.id)} className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-all"><CheckCircle className="h-4 w-4" /></button>
                    <button onClick={() => handleReject(item.id)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-all"><XCircle className="h-4 w-4" /></button>
                  </>
                )}
                <button className="p-1.5 rounded-lg text-text-muted hover:text-secondary hover:bg-secondary/10 transition-all"><Eye className="h-4 w-4" /></button>
              </div>
            )}
          />
        </Card>
      )}
      </>)}
    </div>
  )
}

function cn(...inputs: unknown[]) { return inputs.filter(Boolean).join(" ") }
