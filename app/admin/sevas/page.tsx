"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Eye,
  EyeOff,
  Power,
  X,
  CheckSquare,
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

const PAGE_SIZE = 10

export default function SevasPage() {
  const [sevas, setSevas] = useState<Seva[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [bulkActionLoading, setBulkActionLoading] = useState(false)

  const fetchSevas = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set("page", String(page))
      params.set("limit", String(PAGE_SIZE))
      if (searchQuery) params.set("search", searchQuery)
      if (statusFilter) params.set("isActive", statusFilter === "active" ? "true" : "false")

      const res = await fetch(`/api/sevas?${params.toString()}`)
      const d = await res.json()
      const payload = d.data || d
      const sevaList = Array.isArray(payload) ? payload : payload.sevas || []
      const total = payload.total ?? sevaList.length
      const tp = payload.totalPages ?? Math.ceil(total / PAGE_SIZE)

      const mapped: Seva[] = sevaList.map((s: any) => ({ ...s }))

      setSevas(mapped)
      setTotalItems(total)
      setTotalPages(tp)
    } catch {
      setSevas([])
      setTotalItems(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }, [page, searchQuery, statusFilter])

  useEffect(() => {
    fetchSevas()
  }, [fetchSevas])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, statusFilter])

  useEffect(() => {
    setSelectedRows([])
  }, [sevas])

  const handleDelete = async (id: string) => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/sevas/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setSevas((prev) => prev.filter((s) => s.id !== id))
      setTotalItems((prev) => Math.max(0, prev - 1))
      toast.success("Seva deleted")
    } catch {
      toast.error("Failed to delete seva")
    } finally {
      setDeleteDialog(null)
      setDeleting(false)
    }
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
        prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
      )
      toast.success(`Seva ${target.isActive ? "deactivated" : "activated"}`)
    } catch {
      toast.error("Failed to update status")
    }
  }

  const handleBulkStatusToggle = async (activate: boolean) => {
    if (selectedRows.length === 0) return
    setBulkActionLoading(true)
    let successCount = 0
    let failCount = 0

    try {
      await Promise.all(
        selectedRows.map(async (id) => {
          try {
            const res = await fetch(`/api/sevas/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ isActive: activate }),
            })
            if (res.ok) {
              successCount++
            } else {
              failCount++
            }
          } catch {
            failCount++
          }
        })
      )

      setSevas((prev) =>
        prev.map((s) =>
          selectedRows.includes(s.id) ? { ...s, isActive: activate } : s
        )
      )

      if (failCount === 0) {
        toast.success(
          `${successCount} seva${successCount !== 1 ? "s" : ""} ${
            activate ? "activated" : "deactivated"
          }`
        )
      } else {
        toast.success(
          `${successCount} succeeded, ${failCount} failed`
        )
      }
    } catch {
      toast.error("Bulk action failed")
    } finally {
      setBulkActionLoading(false)
      setSelectedRows([])
    }
  }

  const columns: Column<Seva>[] = [
    {
      key: "name",
      header: "Seva Name",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary text-xs font-bold shrink-0">
            {item.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-text-primary truncate">{item.name}</p>
            <p className="text-xs text-text-muted truncate">{item.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-text-primary">
            ₹{item.price.toLocaleString()}
          </span>
          {item.originalPrice && item.originalPrice > item.price && (
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
        <div className="flex items-center gap-2">
          <StatusBadge
            status={item.isActive ? "ACTIVE" : "INACTIVE"}
            size="sm"
          />
          {item.isSpecial && (
            <Badge variant="secondary" size="xs">
              Special
            </Badge>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">
            Sevas
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Manage temple sevas, pujas, and homas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/sevas/new">
            <Button
              variant="primary"
              size="sm"
              iconLeft={<Plus className="h-4 w-4" />}
            >
              Add New Seva
            </Button>
          </Link>
        </div>
      </div>

      {selectedRows.length > 0 && (
        <Card
          variant="elevated"
          padding="sm"
          className="flex items-center justify-between gap-4 border-secondary/30 bg-secondary/5"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-secondary/15 flex items-center justify-center shrink-0">
              <CheckSquare className="h-4 w-4 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">
                {selectedRows.length} seva{selectedRows.length !== 1 ? "s" : ""}{" "}
                selected
              </p>
              <p className="text-xs text-text-muted">Apply bulk actions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatusToggle(true)}
              loading={bulkActionLoading}
              iconLeft={<Eye className="h-4 w-4" />}
            >
              Activate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkStatusToggle(false)}
              loading={bulkActionLoading}
              iconLeft={<EyeOff className="h-4 w-4" />}
            >
              Deactivate
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRows([])}
              iconLeft={<X className="h-4 w-4" />}
              disabled={bulkActionLoading}
            >
              Clear
            </Button>
          </div>
        </Card>
      )}

      <Card variant="elevated" padding="none">
        <DataTable
          columns={columns}
          data={sevas}
          keyExtractor={(item) => item.id}
          searchable
          searchPlaceholder="Search sevas by name or slug..."
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          selectable
          onSelectionChange={setSelectedRows}
          loading={loading}
          emptyMessage="No sevas found matching your criteria"
          currentPage={page}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          filters={
            <>
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
                title="Edit"
              >
                <Edit3 className="h-4 w-4" />
              </Link>
              <button
                onClick={() => handleToggleStatus(item.id)}
                className={
                  "p-1.5 rounded-lg transition-all " +
                  (item.isActive
                    ? "text-text-muted hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                    : "text-text-muted hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20")
                }
                title={item.isActive ? "Deactivate" : "Activate"}
              >
                <Power className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeleteDialog(item.id)}
                className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                title="Delete"
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
              Are you sure you want to delete this seva? This action cannot be
              undone and may affect existing bookings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteDialog(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteDialog && handleDelete(deleteDialog)}
              loading={deleting}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
