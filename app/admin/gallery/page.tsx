"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit3, Trash2, Search, Star, StarOff, GripVertical, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/admin/status-badge"
import { ImageUpload, type ImageItem } from "@/components/admin/image-upload"
import toast from "react-hot-toast"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface GalleryItem {
  id: string
  title: string
  image: string
  category: string
  isFeatured: boolean
  isPublished: boolean
  sortOrder: number
  createdAt: string
}

const categories = ["TEMPLE", "FESTIVAL", "EVENT", "POOJA", "OTHER"]

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<GalleryItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchGallery = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/gallery")
      const json = await res.json()
      const data = json.data?.gallery ?? []
      setItems(Array.isArray(data) ? data : [])
    } catch {
      toast.error("Failed to fetch gallery")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchGallery() }, [])

  const filtered = items.filter((item) => {
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase())
    const matchCategory = !categoryFilter || item.category === categoryFilter
    return matchSearch && matchCategory
  })

  const toggleFeatured = async (id: string) => {
    try {
      const item = items.find((i) => i.id === id)
      if (!item) return
      const res = await fetch(`/api/gallery/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isFeatured: !item.isFeatured }) })
      const json = await res.json()
      if (!json.success) { toast.error(json.message); return }
      toast.success(json.message)
      fetchGallery()
    } catch { toast.error("Failed to update") }
  }

  const togglePublished = async (id: string) => {
    try {
      const item = items.find((i) => i.id === id)
      if (!item) return
      const res = await fetch(`/api/gallery/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isPublished: !item.isPublished }) })
      const json = await res.json()
      if (!json.success) { toast.error(json.message); return }
      toast.success(json.message)
      fetchGallery()
    } catch { toast.error("Failed to update") }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/gallery/${deleteId}`, { method: "DELETE" })
      const json = await res.json()
      if (!json.success) { toast.error(json.message); return }
      toast.success(json.message)
      fetchGallery()
    } catch { toast.error("Failed to delete") }
    setDeleteId(null)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const formData = new FormData()
      Array.from(files).forEach((f) => formData.append("images", f))
      formData.append("metadata", JSON.stringify({
        title: "Uploaded Image",
        category: categoryFilter || "OTHER",
        type: "IMAGE",
        isFeatured: false,
        isPublished: true,
        sortOrder: 0,
      }))
      const res = await fetch("/api/gallery", { method: "POST", body: formData })
      const json = await res.json()
      if (!json.success) { toast.error(json.message); return }
      toast.success(json.message)
      fetchGallery()
    } catch { toast.error("Failed to upload") }
    finally { setUploading(false) }
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Gallery</h1>
          <p className="text-sm text-text-muted mt-1">Manage temple photos and media</p>
        </div>
        <Button variant="primary" size="sm" iconLeft={<Plus className="h-4 w-4" />} onClick={() => fileInputRef.current?.click()} loading={uploading}>
          Add Images
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search gallery..." className="w-full h-10 pl-10 pr-4 text-sm rounded-xl border border-border bg-warm-white dark:bg-bg-secondary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="h-10 px-3 text-sm rounded-xl border border-border bg-warm-white dark:bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20">
          <option value="">All Categories</option>
          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-muted">Loading...</div>
      ) : (
      <><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <AnimatePresence>
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative rounded-xl overflow-hidden border border-border bg-bg-secondary aspect-[4/3]"
            >
              <div className="w-full h-full bg-gradient-to-br from-secondary/5 to-secondary/10 flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-text-muted/30" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-3">
                <p className="text-white text-sm font-medium truncate">{item.title}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="primary" size="xs">{item.category}</Badge>
                  {item.isFeatured && <Badge variant="secondary" size="xs">Featured</Badge>}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <button onClick={() => toggleFeatured(item.id)} className="p-1 rounded bg-white/20 hover:bg-white/40 transition-all">
                    {item.isFeatured ? <Star className="h-3 w-3 text-amber-400" /> : <StarOff className="h-3 w-3 text-white" />}
                  </button>
                  <button onClick={() => togglePublished(item.id)} className="p-1 rounded bg-white/20 hover:bg-white/40 transition-all">
                    <StatusBadge status={item.isPublished ? "PUBLISHED" : "DRAFT"} size="xs" />
                  </button>
                  <button onClick={() => setDeleteId(item.id)} className="p-1 rounded bg-white/20 hover:bg-red-500/60 transition-all ml-auto">
                    <Trash2 className="h-3 w-3 text-white" />
                  </button>
                </div>
              </div>
              {item.isFeatured && (
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-secondary text-dark-slate text-[10px] font-semibold">
                  Featured
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <ImageIcon className="h-16 w-16 text-text-muted/30 mx-auto mb-4" />
          <p className="text-text-muted font-medium">No gallery items found</p>
          <p className="text-sm text-text-muted/60 mt-1">Upload images to get started</p>
        </div>
      )}
      </>)}

      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent size="sm">
          <DialogHeader><DialogTitle>Delete Image</DialogTitle><DialogDescription>Are you sure? This action cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
