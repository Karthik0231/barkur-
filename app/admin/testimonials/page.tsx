"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, CheckCircle, XCircle, Star, Quote, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/admin/status-badge"
import { DataTable, type Column } from "@/components/admin/data-table"
import { cn, formatDateTime } from "@/lib/utils"
import toast from "react-hot-toast"

interface Testimonial {
  id: string
  name: string
  email: string
  content: string
  rating: number
  isApproved: boolean
  isFeatured: boolean
  role: string | null
  createdAt: string
}



export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/testimonials").then((r) => r.json()).then((json) => {
      setTestimonials(Array.isArray(json) ? json : (json.data?.testimonials ?? []))
    }).finally(() => setLoading(false))
  }, [])

  const toggleApproval = async (id: string) => {
    const t = testimonials.find((x) => x.id === id)
    if (!t) return
    try {
      await fetch(`/api/testimonials/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isApproved: !t.isApproved }) })
      setTestimonials((prev) => prev.map((x) => x.id === id ? { ...x, isApproved: !x.isApproved } : x))
      toast.success(`Testimonial ${t.isApproved ? "unapproved" : "approved"}`)
    } catch { toast.error("Failed to toggle approval") }
  }

  const filtered = testimonials.filter((t) => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.content.toLowerCase().includes(search.toLowerCase()))

  const columns: Column<Testimonial>[] = [
    {
      key: "name",
      header: "Devotee",
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-medium text-text-primary">{item.name}</p>
          <p className="text-xs text-text-muted">{item.email}</p>
        </div>
      ),
    },
    {
      key: "content",
      header: "Testimonial",
      render: (item) => (
        <div className="flex items-start gap-2">
          <Quote className="h-4 w-4 text-secondary/40 shrink-0 mt-0.5" />
          <p className="text-sm text-text-muted line-clamp-2">{item.content}</p>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn("h-3.5 w-3.5", i < item.rating ? "text-amber-400 fill-amber-400" : "text-text-muted/30")} />
          ))}
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (item) => <span className="text-text-muted">{item.role || "-"}</span>,
      hideOnMobile: true,
    },
    {
      key: "isApproved",
      header: "Status",
      sortable: true,
      render: (item) => <StatusBadge status={item.isApproved ? "APPROVED" : "PENDING"} variant="approval" size="sm" />,
    },
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      render: (item) => <span className="text-xs text-text-muted">{formatDateTime(new Date(item.createdAt))}</span>,
      hideOnMobile: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Testimonials</h1>
          <p className="text-sm text-text-muted mt-1">Manage devotee testimonials and reviews</p>
        </div>
      </div>

      <Card variant="elevated" padding="none">
        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          keyExtractor={(item) => item.id}
          searchable searchQuery={search} onSearch={setSearch}
          searchPlaceholder="Search by name or content..."
          selectable emptyMessage="No testimonials found"
          actions={(item) => (
            <div className="flex items-center gap-1">
              <button onClick={() => toggleApproval(item.id)} className="p-1.5 rounded-lg transition-all">
                {item.isApproved ? <XCircle className="h-4 w-4 text-red-500" /> : <CheckCircle className="h-4 w-4 text-emerald-500" />}
              </button>
            </div>
          )}
        />
      </Card>
    </div>
  )
}


