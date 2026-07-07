"use client"

import { useState } from "react"
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



const sampleCategories: CategoryItem[] = [
  { id: "cat1", name: "Abhishekam", slug: "abhishekam", description: "Sacred bathing rituals", type: "SEVA", sortOrder: 1, isActive: true, sevasCount: 4, createdAt: "2026-01-15" },
  { id: "cat2", name: "Homa", slug: "homa", description: "Fire offerings", type: "SEVA", sortOrder: 2, isActive: true, sevasCount: 6, createdAt: "2026-01-15" },
  { id: "cat3", name: "Vrata", slug: "vrata", description: "Vows and observances", type: "SEVA", sortOrder: 3, isActive: true, sevasCount: 3, createdAt: "2026-01-20" },
  { id: "cat4", name: "Nitya Pooja", slug: "nitya-pooja", description: "Daily worship rituals", type: "SEVA", sortOrder: 4, isActive: true, sevasCount: 2, createdAt: "2026-02-01" },
  { id: "cat5", name: "Special Events", slug: "special-events", description: "Special occasion rituals", type: "SEVA", sortOrder: 5, isActive: true, sevasCount: 8, createdAt: "2026-02-10" },
  { id: "cat6", name: "Annadanam", slug: "annadanam", description: "Food offerings", type: "SEVA", sortOrder: 6, isActive: false, sevasCount: 1, createdAt: "2026-03-01" },
]

const types = ["SEVA", "BLOG", "GALLERY", "FAQ"]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>(sampleCategories)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

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

  const onSubmit = (data: any) => {
    if (editing) {
      setCategories((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...data, description: data.description || "" } : c))
    } else {
      const newCat: any = {
        id: `cat${Date.now()}`,
        sevasCount: 0,
        isActive: true,
        createdAt: new Date().toISOString().split("T")[0],
        name: data.name,
        slug: data.slug,
        type: data.type,
        description: data.description || "",
        sortOrder: 0,
      }
      setCategories((prev) => [...prev, newCat])
    }
    setDialogOpen(false)
    setEditing(null)
  }

  const handleDelete = () => {
    if (deleteId) {
      setCategories((prev) => prev.filter((c) => c.id !== deleteId))
      setDeleteId(null)
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




