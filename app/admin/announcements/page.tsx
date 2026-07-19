"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Edit3, Trash2, Search, Calendar, Bell, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/admin/status-badge"
import { formatDateTime } from "@/lib/utils"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@/lib/zod-resolver"
import { z } from "zod"
import toast from "react-hot-toast"

interface Announcement {
  id: string
  title: string
  content: string
  type: string
  isActive: boolean
  isPopup: boolean
  startDate: string | null
  endDate: string | null
  link: string | null
  linkText: string | null
  createdAt: string
}

const announcementSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(10).max(2000),
  type: z.string().min(1),
  isActive: z.boolean().optional(),
  isPopup: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  link: z.string().optional(),
  linkText: z.string().optional(),
})

const types = ["INFO", "WARNING", "URGENT", "EVENT"]

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Announcement | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/announcements")
        const data = await res.json()
        setItems(data.announcements || [])
      } catch { toast.error("Failed to load announcements") }
      finally { setLoading(false) }
    })()
  }, [])

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(announcementSchema),
  })

  const openCreate = () => {
    setEditing(null)
    reset({ title: "", content: "", type: "INFO", isActive: true, isPopup: false, startDate: "", endDate: "", link: "", linkText: "" })
    setDialogOpen(true)
  }

  const openEdit = (item: Announcement) => {
    setEditing(item)
    reset({ title: item.title, content: item.content, type: item.type, isActive: item.isActive, isPopup: item.isPopup, startDate: item.startDate || "", endDate: item.endDate || "", link: item.link || "", linkText: item.linkText || "" })
    setDialogOpen(true)
  }

  const reload = async () => {
    try {
      const res = await fetch("/api/announcements")
      const data = await res.json()
      setItems(data.announcements || [])
    } catch { toast.error("Failed to load announcements") }
  }

  const onSubmit = async (data: any) => {
    try {
      const processed = { ...data, startDate: data.startDate || null, endDate: data.endDate || null, link: data.link || null, linkText: data.linkText || null }
      const url = editing ? `/api/announcements/${editing.id}` : "/api/announcements"
      const method = editing ? "PUT" : "POST"
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(processed) })
      if (!res.ok) throw new Error()
      toast.success(editing ? "Announcement updated" : "Announcement created")
      setDialogOpen(false)
      setEditing(null)
      reload()
    } catch { toast.error("Failed to save announcement") }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/announcements/${deleteId}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Announcement deleted")
      setDeleteId(null)
      reload()
    } catch { toast.error("Failed to delete announcement") }
  }

  const filtered = items.filter((a) => !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Announcements</h1>
          <p className="text-sm text-text-muted mt-1">Manage temple announcements and notifications</p>
        </div>
        <Button variant="primary" size="sm" iconLeft={<Plus className="h-4 w-4" />} onClick={openCreate}>Add Announcement</Button>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search announcements..." className="w-full h-10 pl-10 pr-4 text-sm rounded-xl border border-border bg-warm-white dark:bg-bg-secondary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all" />
      </div>

      <div className="space-y-3">
        {filtered.map((item) => (
          <motion.div key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl border border-border bg-warm-white dark:bg-bg-secondary hover:shadow-sm transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status={item.type as any} variant="priority" size="xs" />
                  <StatusBadge status={item.isActive ? "ACTIVE" : "INACTIVE"} size="xs" />
                  {item.isPopup && <Badge variant="secondary" size="xs">Popup</Badge>}
                </div>
                <h4 className="font-semibold text-text-primary">{item.title}</h4>
                <p className="text-sm text-text-muted mt-1 line-clamp-2">{item.content}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted mt-2">
                  {item.startDate && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{item.startDate} - {item.endDate || "Ongoing"}</span>}
                  {item.link && <span className="flex items-center gap-1"><ExternalLink className="h-3 w-3" />{item.link}</span>}
                  <span>{formatDateTime(new Date(item.createdAt))}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-text-muted hover:text-secondary hover:bg-secondary/10 transition-all"><Edit3 className="h-4 w-4" /></button>
                <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-text-muted">No announcements found</div>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent size="md">
          <DialogHeader><DialogTitle>{editing ? "Edit Announcement" : "Add Announcement"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
            <Input label="Title" error={errors.title?.message as string} {...register("title")} />
            <Input label="Content" placeholder="Announcement content..." error={errors.content?.message as string} {...register("content")} />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Type</label>
                <select {...register("type")} className="h-11 rounded-lg border border-border bg-warm-white dark:bg-bg-secondary px-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20">
                  {types.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Start Date" type="date" {...register("startDate")} />
              <Input label="End Date" type="date" {...register("endDate")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Link URL" placeholder="https://..." {...register("link")} />
              <Input label="Link Text" placeholder="Learn More" {...register("linkText")} />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" {...register("isActive")} className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary" /><span className="text-sm text-text-primary">Active</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" {...register("isPopup")} className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary" /><span className="text-sm text-text-primary">Show as Popup</span></label>
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
          <DialogHeader><DialogTitle>Delete Announcement</DialogTitle><DialogDescription>Are you sure?</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}




