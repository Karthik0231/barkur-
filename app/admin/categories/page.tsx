"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { Plus, Edit3, Trash2, Search, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { useForm } from "react-hook-form"
import { z } from "zod"

interface CategoryItem {
  id: string; name: string; slug: string; description: string; type: string
  sortOrder: number; isActive: boolean; sevasCount: number; createdAt: string
}

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  type: z.string().min(1, "Type is required"),
})





const types = ["SEVA", "BLOG", "GALLERY", "FAQ"]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        setCategories(d.data || d || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const form = useForm({ defaultValues: { name: "", slug: "", description: "", type: "SEVA" } as any })
  const { register, handleSubmit, reset, formState: { errors } } = form
  const { setValue, watch } = form

  const openCreate = () => {
    setEditing(null)
    reset({ name: "", slug: "", description: "", type: "SEVA" } as any)
    setDialogOpen(true)
  }

  const openEdit = (cat: any) => {
    setEditing(cat)
    reset({ name: cat.name, slug: cat.slug, description: cat.description || "", type: cat.type })
    setDialogOpen(true)
  }

  const onSubmit = async (data: any) => {
    try {
      if (editing) {
        const res = await fetch(`/api/categories/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error()
        toast.success("Category updated")
        setCategories((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...data, description: data.description || "" } : c))
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error()
        const created = await res.json()
        toast.success("Category created")
        setCategories((prev) => [...prev, created.data || created])
      }
      setDialogOpen(false)
      setEditing(null)
    } catch {
      toast.error("Failed to save category")
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/categories/${deleteId}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Category deleted")
      setCategories((prev) => prev.filter((c) => c.id !== deleteId))
      setDeleteId(null)
    } catch {
      toast.error("Failed to delete category")
    }
  }

  const filtered = categories.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Categories</h1>
          <p className="text-sm text-text-muted mt-1">Manage seva categories and types</p>
        </div>
        <Button variant="primary" size="sm" iconLeft={<Plus className="h-4 w-4" />} onClick={openCreate}>
          Add Category
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search categories..." className="w-full h-10 pl-10 pr-4 text-sm rounded-xl border border-border bg-warm-white dark:bg-bg-secondary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all" />
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map((cat) => (
          <motion.div
            key={cat.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 rounded-xl border border-border bg-warm-white dark:bg-bg-secondary hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary font-bold shrink-0">
                {cat.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-text-primary">{cat.name}</h4>
                  <StatusBadge status={cat.isActive ? "ACTIVE" : "INACTIVE"} size="xs" />
                  <Badge variant="subtle" size="xs">{cat.type}</Badge>
                </div>
                <p className="text-sm text-text-muted truncate mt-0.5">{cat.description || "No description"}</p>
                <p className="text-xs text-text-muted/60 mt-0.5">/{cat.slug} - {cat.sevasCount} sevas</p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => openEdit(cat)} className="p-2 rounded-lg text-text-muted hover:text-secondary hover:bg-secondary/10 transition-all">
                <Edit3 className="h-4 w-4" />
              </button>
              <button onClick={() => setDeleteId(cat.id)} className="p-2 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted">No categories found</div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Category" : "Create Category"}</DialogTitle>
            <DialogDescription>{editing ? "Update the category details" : "Add a new category for sevas"}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Name" placeholder="Category name" error={errors.name?.message as string} {...register("name")} onChange={(e) => {
                register("name").onChange(e)
                if (!editing && (!watch("slug") || watch("slug") === editing?.slug)) {
                  setValue("slug", e.target.value.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, ""))
                }
              }} />
              <Input label="Slug" placeholder="category-slug" error={errors.slug?.message as string} {...register("slug")} />
            </div>
            <Input label="Description" placeholder="Brief description" error={errors.description?.message as string} {...register("description")} />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Type</label>
                <select {...register("type")} className="h-11 rounded-lg border border-border bg-warm-white dark:bg-bg-secondary px-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary">
                  {types.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.type && <p className="text-xs text-red-500">{errors.type.message as string}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm">{editing ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>Are you sure? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}




