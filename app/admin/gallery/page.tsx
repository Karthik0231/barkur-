"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit3, Trash2, Search, Star, StarOff, GripVertical, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/admin/status-badge"
import { ImageUpload, type ImageItem } from "@/components/admin/image-upload"
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

const sampleGallery: GalleryItem[] = [
  { id: "g1", title: "Temple Main Entrance", image: "/placeholder.svg", category: "TEMPLE", isFeatured: true, isPublished: true, sortOrder: 1, createdAt: "2026-06-01" },
  { id: "g2", title: "Maha Shivaratri Celebration", image: "/placeholder.svg", category: "FESTIVAL", isFeatured: true, isPublished: true, sortOrder: 2, createdAt: "2026-06-05" },
  { id: "g3", title: "Daily Pooja Rituals", image: "/placeholder.svg", category: "POOJA", isFeatured: false, isPublished: true, sortOrder: 3, createdAt: "2026-06-10" },
  { id: "g4", title: "Temple Gopura", image: "/placeholder.svg", category: "TEMPLE", isFeatured: false, isPublished: true, sortOrder: 4, createdAt: "2026-06-15" },
  { id: "g5", title: "Navaratri Celebrations", image: "/placeholder.svg", category: "FESTIVAL", isFeatured: false, isPublished: false, sortOrder: 5, createdAt: "2026-06-20" },
  { id: "g6", title: "Annadanam Seva", image: "/placeholder.svg", category: "EVENT", isFeatured: false, isPublished: true, sortOrder: 6, createdAt: "2026-06-25" },
]

const categories = ["TEMPLE", "FESTIVAL", "EVENT", "POOJA", "OTHER"]

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(sampleGallery)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<GalleryItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [uploadImages, setUploadImages] = useState<ImageItem[]>([])

  const filtered = items.filter((item) => {
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase())
    const matchCategory = !categoryFilter || item.category === categoryFilter
    return matchSearch && matchCategory
  })

  const toggleFeatured = (id: string) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, isFeatured: !item.isFeatured } : item))
  }

  const togglePublished = (id: string) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, isPublished: !item.isPublished } : item))
  }

  const handleDelete = () => {
    if (deleteId) {
      setItems((prev) => prev.filter((item) => item.id !== deleteId))
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Gallery</h1>
          <p className="text-sm text-text-muted mt-1">Manage temple photos and media</p>
        </div>
        <Button variant="primary" size="sm" iconLeft={<Plus className="h-4 w-4" />}>
          Add Images
        </Button>
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
