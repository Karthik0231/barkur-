"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { Plus, Edit3, Trash2, Search, Eye, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/admin/status-badge"
import { RichEditor } from "@/components/admin/rich-editor"
import { formatDateTime } from "@/lib/utils"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@/lib/zod-resolver"
import { z } from "zod"

interface NewsItem {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  isPublished: boolean
  isUrgent: boolean
  publishedAt: string | null
  createdAt: string
  author: string
}

const newsSchema = z.object({
  title: z.string().min(5).max(200),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(300).optional(),
  category: z.string().min(1),
  isPublished: z.boolean().optional(),
  isUrgent: z.boolean().optional(),
})

const categories = ["Events", "Updates", "Announcements", "Spiritual", "General"]

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<NewsItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editorContent, setEditorContent] = useState("")

  const fetchNews = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/news")
      const json = await res.json()
      if (json.success) {
        const data = json.data
        setNews(data.news ?? (Array.isArray(data) ? data : []))
      } else {
        toast.error(json.message || "Failed to fetch news")
      }
    } catch {
      toast.error("Failed to fetch news")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchNews() }, [])

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(newsSchema),
  })

  const openCreate = () => {
    setEditing(null)
    reset({ title: "", slug: "", excerpt: "", category: "General", isPublished: false, isUrgent: false })
    setEditorContent("")
    setDialogOpen(true)
  }

  const openEdit = (item: NewsItem) => {
    setEditing(item)
    reset({ title: item.title, slug: item.slug, excerpt: item.excerpt, category: item.category, isPublished: item.isPublished, isUrgent: item.isUrgent })
    setEditorContent(item.content)
    setDialogOpen(true)
  }

  const onSubmit = async (data: any) => {
    try {
      const payload = { ...data, content: editorContent }
      if (editing) {
        const res = await fetch(`/api/news/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        const json = await res.json()
        if (!json.success) { toast.error(json.message); return }
        toast.success(json.message)
      } else {
        const res = await fetch("/api/news", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        const json = await res.json()
        if (!json.success) { toast.error(json.message); return }
        toast.success(json.message)
      }
      fetchNews()
      setDialogOpen(false)
      setEditing(null)
    } catch { toast.error("Failed to save news") }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/news/${deleteId}`, { method: "DELETE" })
      const json = await res.json()
      if (!json.success) { toast.error(json.message); return }
      toast.success(json.message)
      fetchNews()
    } catch { toast.error("Failed to delete news") }
    setDeleteId(null)
  }

  const filtered = news.filter((n) => {
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase())
    const matchCategory = !categoryFilter || n.category === categoryFilter
    return matchSearch && matchCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">News & Updates</h1>
          <p className="text-sm text-text-muted mt-1">Manage temple news, announcements, and updates</p>
        </div>
        <Button variant="primary" size="sm" iconLeft={<Plus className="h-4 w-4" />} onClick={openCreate}>Add News</Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search news..." className="w-full h-10 pl-10 pr-4 text-sm rounded-xl border border-border bg-warm-white dark:bg-bg-secondary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="h-10 px-3 text-sm rounded-xl border border-border bg-warm-white dark:bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-muted">Loading...</div>
      ) : (
      <div className="space-y-3">
        {filtered.map((item) => (
          <motion.div key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-4 p-4 rounded-xl border border-border bg-warm-white dark:bg-bg-secondary hover:shadow-sm transition-all">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {item.isUrgent && <Badge variant="destructive" size="xs" dot>Urgent</Badge>}
                <StatusBadge status={item.isPublished ? "PUBLISHED" : "DRAFT"} size="xs" />
                <Badge variant="subtle" size="xs">{item.category}</Badge>
              </div>
              <h4 className="font-semibold text-text-primary">{item.title}</h4>
              <p className="text-sm text-text-muted mt-1 line-clamp-2">{item.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-text-muted mt-2">
                <span className="flex items-center gap-1"><User className="h-3 w-3" />{item.author}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDateTime(new Date(item.createdAt))}</span>
                {item.publishedAt && <span>Published: {formatDateTime(new Date(item.publishedAt))}</span>}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-text-muted hover:text-secondary hover:bg-secondary/10 transition-all"><Edit3 className="h-4 w-4" /></button>
              <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="h-4 w-4" /></button>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-text-muted">No news articles found</div>}
      </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent size="xl">
          <DialogHeader><DialogTitle>{editing ? "Edit News" : "Add News"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Title" placeholder="News title" error={errors.title?.message as string} {...register("title")} />
              <Input label="Slug" placeholder="news-slug" error={errors.slug?.message as string} {...register("slug")} />
            </div>
            <Input label="Excerpt" placeholder="Brief excerpt" error={errors.excerpt?.message as string} {...register("excerpt")} />
            <RichEditor label="Content" value={editorContent} onChange={setEditorContent} minHeight="200px" />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Category</label>
                <select {...register("category")} className="h-11 rounded-lg border border-border bg-warm-white dark:bg-bg-secondary px-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" {...register("isPublished")} className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary" /><span className="text-sm text-text-primary">Published</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" {...register("isUrgent")} className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary" /><span className="text-sm text-text-primary">Urgent</span></label>
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
          <DialogHeader><DialogTitle>Delete News</DialogTitle><DialogDescription>Are you sure?</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}




