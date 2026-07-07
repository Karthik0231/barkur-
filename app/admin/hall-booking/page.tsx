"use client"

import { useState } from "react"
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

const sampleBookings: HallBooking[] = [
  { id: "h1", bookingId: "HALL-2026-0012", hall: "Main Kalyana Mantapa", eventName: "Wedding Reception", organizer: "Suresh Shetty", date: "2026-07-15", startTime: "10:00", endTime: "14:00", amount: 25000, status: "PENDING", paymentStatus: "PENDING", approval: "PENDING", expectedGuests: 300 },
  { id: "h2", bookingId: "HALL-2026-0011", hall: "Mini Hall", eventName: "Birthday Party", organizer: "Priya Rao", date: "2026-07-10", startTime: "16:00", endTime: "20:00", amount: 8000, status: "CONFIRMED", paymentStatus: "PAID", approval: "APPROVED", expectedGuests: 80 },
  { id: "h3", bookingId: "HALL-2026-0010", hall: "Main Kalyana Mantapa", eventName: "Engagement Ceremony", organizer: "Ravi Kumar", date: "2026-07-20", startTime: "09:00", endTime: "13:00", amount: 20000, status: "CONFIRMED", paymentStatus: "PAID", approval: "APPROVED", expectedGuests: 200 },
  { id: "h4", bookingId: "HALL-2026-0009", hall: "Annadana Hall", eventName: "Community Feast", organizer: "Temple Trust", date: "2026-07-05", startTime: "11:00", endTime: "15:00", amount: 5000, status: "COMPLETED", paymentStatus: "PAID", approval: "APPROVED", expectedGuests: 150 },
  { id: "h5", bookingId: "HALL-2026-0008", hall: "Mini Hall", eventName: "Study Group", organizer: "Veda Class", date: "2026-06-30", startTime: "08:00", endTime: "10:00", amount: 2000, status: "CANCELLED", paymentStatus: "REFUNDED", approval: "REJECTED", expectedGuests: 20 },
]

export default function HallBookingPage() {
  const [bookings] = useState<HallBooking[]>(sampleBookings)
  const [search, setSearch] = useState("")
  const [view, setView] = useState<"list" | "calendar">("list")

  const filtered = bookings.filter((b) => !search || b.bookingId.toLowerCase().includes(search.toLowerCase()) || b.organizer.toLowerCase().includes(search.toLowerCase()) || b.eventName.toLowerCase().includes(search.toLowerCase()))

  const handleApprove = (id: string) => { toast.success(`Booking ${id} approved`) }
  const handleReject = (id: string) => { toast.success(`Booking ${id} rejected`) }

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
    </div>
  )
}

function cn(...inputs: unknown[]) { return inputs.filter(Boolean).join(" ") }
