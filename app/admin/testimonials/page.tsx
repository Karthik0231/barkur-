"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, CheckCircle, XCircle, Star, Quote, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/admin/status-badge"
import { DataTable, type Column } from "@/components/admin/data-table"
import { formatDateTime } from "@/lib/utils"
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

const sampleData: Testimonial[] = [
  { id: "t1", name: "Ananya Sharma", email: "ananya@example.com", content: "The Rudra Abhishekam was a deeply spiritual experience. The priests were very knowledgeable and the entire ritual was conducted with utmost devotion. Truly blessed!", rating: 5, isApproved: true, isFeatured: true, role: "Devotee", createdAt: "2026-06-15T10:00:00Z" },
  { id: "t2", name: "Ravi Kumar", email: "ravi@example.com", content: "I have been visiting Sri Kalikamba Temple for years. The peace and divine energy here is unmatched. Highly recommended for spiritual seekers.", rating: 5, isApproved: true, isFeatured: true, role: "Regular Visitor", createdAt: "2026-06-10T08:00:00Z" },
  { id: "t3", name: "Priya Patel", email: "priya@example.com", content: "The online booking system made it very convenient to book sevas from abroad. The temple management is very responsive.", rating: 4, isApproved: true, isFeatured: false, role: "NRI Devotee", createdAt: "2026-05-20T14:00:00Z" },
  { id: "t4", name: "Venkatesh Rao", email: "venkatesh@example.com", content: "Excellent temple facilities and very well-organized festivals. The Annadana seva is a noble initiative feeding hundreds daily.", rating: 5, isApproved: false, isFeatured: false, role: null, createdAt: "2026-06-25T09:00:00Z" },
  { id: "t5", name: "Lakshmi Devi", email: "lakshmi@example.com", content: "Great atmosphere for meditation and prayer. The temple gopura is magnificent.", rating: 4, isApproved: false, isFeatured: false, role: "Devotee", createdAt: "2026-06-28T11:00:00Z" },
]

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(sampleData)
  const [search, setSearch] = useState("")

  const toggleApproval = (id: string) => {
    setTestimonials((prev) => prev.map((t) => t.id === id ? { ...t, isApproved: !t.isApproved } : t))
    const t = testimonials.find((x) => x.id === id)
    toast.success(`Testimonial ${t?.isApproved ? "unapproved" : "approved"}`)
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

function cn(...inputs: unknown[]) { return inputs.filter(Boolean).join(" ") }
