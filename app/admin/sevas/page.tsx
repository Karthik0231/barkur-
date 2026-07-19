"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Eye,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable, type Column } from "@/components/admin/data-table"
import { StatusBadge } from "@/components/admin/status-badge"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import toast from "react-hot-toast"

interface Seva {
  id: string
  name: string
  slug: string
  category: string
  categoryId: string
  price: number
  originalPrice: number | null
  duration: number | null
  maxDevotees: number | null
  minDevotees: number | null
  isActive: boolean
  isSpecial: boolean
  isShashwatha: boolean
  requiresApproval: boolean
  bookingNotice: number | null
  sortOrder: number
  createdAt: string
}



export default function SevasPage() {
  const [sevas, setSevas] = useState<Seva[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/sevas")
      .then((r) => r.json())
      .then((d) => {
        setSevas(d.data || d || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const categories = [...new Set(sevas.map((s) => s.category))]

  const filtered = sevas.filter((s) => {
    const matchesSearch =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !categoryFilter || s.category === categoryFilter
    const matchesStatus =
      !statusFilter ||
      (statusFilter === "active" && s.isActive) ||
      (statusFilter === "inactive" && !s.isActive)
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/sevas/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setSevas((prev) => prev.filter((s) => s.id !== id))
      toast.success("Seva deleted")
    } catch {
      toast.error("Failed to delete seva")
    }
    setDeleteDialog(null)
  }

  const handleToggleStatus = async (id: string) => {
    const target = sevas.find((s) => s.id === id)
    if (!target) return
    try {
      const res = await fetch(`/api/sevas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !target.isActive }),
      })
      if (!res.ok) throw new Error()
      setSevas((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)),
      )
      toast.success(`Seva ${target.isActive ? "deactivated" : "activated"}`)
    } catch {
      toast.error("Failed to update status")
    }
  }

  const columns: Column<Seva>[] = [
    {
      key: "name",
      header: "Seva Name",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary text-xs font-bold">
            {item.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-text-primary">{item.name}</p>
            <p className="text-xs text-text-muted">{item.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (item) => (
        <Badge variant="subtle" size="sm">{item.category}</Badge>
      ),
    },
    {
      key: "price",
      header: "Price",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-text-primary">₹{item.price.toLocaleString()}</span>
          {item.originalPrice && (
            <span className="text-xs text-text-muted line-through">
              ₹{item.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "maxDevotees",
      header: "Max Devotees",
      sortable: true,
      render: (item) => (
        <span className="text-text-muted">
          {item.minDevotees && item.minDevotees > 1 ? `${item.minDevotees}-` : ""}
          {item.maxDevotees || "∞"}
        </span>
      ),
      hideOnMobile: true,
    },
    {
      key: "bookingNotice",
      header: "Notice (hrs)",
      sortable: true,
      render: (item) => (
        <span className="text-text-muted">{item.bookingNotice || 0}h</span>
      ),
      hideOnMobile: true,
    },
    {
      key: "isActive",
      header: "Status",
      sortable: true,
      render: (item) => (
        <StatusBadge status={item.isActive ? "ACTIVE" : "INACTIVE"} size="sm" />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Sevas</h1>
          <p className="text-sm text-text-muted mt-1">
            Manage temple sevas, pujas, and homas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            iconLeft={<Filter className="h-4 w-4" />}
          >
            Filter
          </Button>
          <Link href="/admin/sevas/new">
            <Button variant="primary" size="sm" iconLeft={<Plus className="h-4 w-4" />}>
              Add New Seva
            </Button>
          </Link>
        </div>
      </div>

      <Card variant="elevated" padding="none">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(item) => item.id}
          searchable
          searchPlaceholder="Search sevas by name or slug..."
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          selectable
          loading={loading}
          exportable
          onExport={() => console.log("Export sevas")}
          emptyMessage="No sevas found matching your criteria"
          filters={
            <>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-9 px-3 text-sm rounded-lg border border-border bg-warm-white dark:bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 text-sm rounded-lg border border-border bg-warm-white dark:bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </>
          }
          actions={(item) => (
            <div className="flex items-center justify-end gap-1">
              <Link
                href={`/admin/sevas/${item.id}/edit`}
                className="p-1.5 rounded-lg text-text-muted hover:text-secondary hover:bg-secondary/10 transition-all"
              >
                <Edit3 className="h-4 w-4" />
              </Link>
              <button
                onClick={() => handleToggleStatus(item.id)}
                className="p-1.5 rounded-lg text-text-muted hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeleteDialog(item.id)}
                className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        />
      </Card>

      <Dialog open={!!deleteDialog} onOpenChange={(o) => !o && setDeleteDialog(null)}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Delete Seva</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this seva? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteDialog(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteDialog && handleDelete(deleteDialog)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

