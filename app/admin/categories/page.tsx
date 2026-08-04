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
import { ImageUpload, type ImageItem } from "@/components/admin/image-upload"
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
import { zodResolver } from "@/lib/zod-resolver"
import { categorySchema, type CategoryInput } from "@/lib/validations"

interface CategoryItem {
  id: string
  name: string
  slug: string
  description: string | null
  type: string
  sortOrder: number
  isActive: boolean
  sevasCount: number
  imageUrl: string | null
  createdAt: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<CategoryItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [image, setImage] = useState<ImageItem[]>([])

  const form = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      type: "SEVA",
      sortOrder: 0,
      isActive: true,
      imageUrl: "",
    },
  })
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = form

  useEffect(() => {
    fetch("/api/categories?limit=200")
      .then((r) => r.json())
      .then((d) => {
        const cats = d.data?.categories || d.data || d || []
        setCategories(
          (Array.isArray(cats) ? cats : []).map((c: any) => ({
            ...c,
            sevasCount: c._count?.sevas || c.sevasCount || 0,
          }))
        )
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const openCreate = () => {
    setEditing(null)
    setImage([])
    reset({
      name: "",
      slug: "",
      description: "",
      type: "SEVA",
      sortOrder: 0,
      isActive: true,
      imageUrl: "",
    })
    setDialogOpen(true)
  }

  const openEdit = (cat: CategoryItem) => {
    setEditing(cat)
    setImage(
      cat.imageUrl ? [{ id: `existing-${cat.id}`, url: cat.imageUrl, alt: cat.name }] : []
    )
    reset({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      type: cat.type,
      sortOrder: cat.sortOrder ?? 0,
      isActive: cat.isActive ?? true,
      imageUrl: cat.imageUrl || "",
    })
    setDialogOpen(true)
  }

  const generateSlug = (val: string) => {
    setValue(
      "slug",
      val
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_]+/g, "-")
        .replace(/^-+|-+$/g, "")
    )
  }

  const onSubmit = async (data: CategoryInput) => {
    setSaving(true)
    try {
      const imageUrl = image.length > 0 ? image[0].url : data.imageUrl || ""
      const payload = { ...data, imageUrl }

      if (editing) {
        const res = await fetch(`/api/categories/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => null)
          throw new Error(err?.message || "Failed to update category")
        }
        toast.success("Category updated")
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editing.id
              ? {
                  ...c,
                  name: payload.name,
                  slug: payload.slug,
                  description: payload.description || "",
                  type: payload.type,
                  sortOrder: (payload.sortOrder as number) ?? c.sortOrder,
                  isActive: payload.isActive ?? c.isActive,
                  imageUrl: imageUrl || null,
                } as CategoryItem
              : c
          )
        )
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => null)
          throw new Error(err?.message || "Failed to create category")
        }
        const created = await res.json()
        const newCat = (created.data || created) as CategoryItem
        toast.success("Category created")
        setCategories((prev) => [
          ...prev,
          { ...newCat, sevasCount: 0, imageUrl: imageUrl || null },
        ])
      }
      setDialogOpen(false)
      setEditing(null)
      setImage([])
    } catch (err: any) {
      toast.error(err?.message || "Failed to save category")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/categories/${deleteId}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Category deleted")
      setCategories((prev) => prev.filter((c) => c.id !== deleteId))
      setDeleteId(null)
    } catch {
      toast.error("Failed to delete category")
    } finally {
      setDeleting(false)
    }
  }

  const filtered = categories.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-48 shimmer-skeleton rounded-xl" />
        <div className="h-10 w-72 shimmer-skeleton rounded-xl" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 shimmer-skeleton rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">
            Categories
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Manage seva categories and types
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          iconLeft={<Plus className="h-4 w-4" />}
          onClick={openCreate}
        >
          Add Category
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full h-10 pl-10 pr-4 text-sm rounded-xl border border-border bg-warm-white dark:bg-bg-secondary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
          />
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
              <div className="h-12 w-12 rounded-lg overflow-hidden bg-secondary/10 shrink-0">
                {cat.imageUrl ? (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-secondary font-bold text-sm">
                    {cat.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-medium text-text-primary">{cat.name}</h4>
                  <StatusBadge
                    status={cat.isActive ? "ACTIVE" : "INACTIVE"}
                    size="xs"
                  />
                  <Badge variant="subtle" size="xs">
                    {cat.type}
                  </Badge>
                  {cat.sortOrder != null && cat.sortOrder !== 0 && (
                    <Badge variant="outline" size="xs">
                      Order: {cat.sortOrder}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-text-muted truncate mt-0.5">
                  {cat.description || "No description"}
                </p>
                <p className="text-xs text-text-muted/60 mt-0.5">
                  /{cat.slug} - {cat.sevasCount} sevas
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => openEdit(cat)}
                className="p-2 rounded-lg text-text-muted hover:text-secondary hover:bg-secondary/10 transition-all"
                title="Edit"
              >
                <Edit3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDeleteId(cat.id)}
                className="p-2 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            No categories found
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Category" : "Create Category"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the category details"
                : "Add a new category for sevas"}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 px-6 py-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Name *"
                placeholder="Category name"
                error={errors.name?.message as string}
                {...register("name")}
                onChange={(e) => {
                  register("name").onChange(e)
                  if (!editing) {
                    generateSlug(e.target.value)
                  }
                }}
              />
              <Input
                label="Slug *"
                placeholder="category-slug"
                error={errors.slug?.message as string}
                {...register("slug")}
              />
            </div>

            <Input
              label="Description"
              placeholder="Brief description"
              error={errors.description?.message as string}
              {...register("description")}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">
                  Type *
                </label>
                <select
                  {...register("type")}
                  className="h-11 rounded-lg border border-border bg-warm-white dark:bg-bg-secondary px-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                >
                  {["SEVA", "BLOG", "GALLERY", "FAQ"].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <p className="text-xs text-red-500">
                    {errors.type.message as string}
                  </p>
                )}
              </div>
              <Input
                label="Sort Order"
                type="number"
                placeholder="0"
                error={errors.sortOrder?.message as string}
                {...register("sortOrder")}
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer pt-1">
              <input
                type="checkbox"
                {...register("isActive")}
                className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary"
              />
              <div>
                <p className="text-sm font-medium text-text-primary">Active</p>
                <p className="text-xs text-text-muted">
                  Make this category visible on the site
                </p>
              </div>
            </label>

            <Card padding="sm" variant="bordered">
              <ImageUpload
                images={image}
                onChange={setImage}
                maxImages={1}
                label="Category Image"
                helperText="Recommended size: 400x400px"
                aspectRatio="1/1"
              />
            </Card>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setDialogOpen(false)
                  setEditing(null)
                  setImage([])
                }}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                iconLeft={<Save className="h-4 w-4" />}
                loading={saving}
              >
                {editing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure? This action cannot be undone. Sevin in this category
              will not be deleted but will no longer have a category assigned.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteId(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
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
