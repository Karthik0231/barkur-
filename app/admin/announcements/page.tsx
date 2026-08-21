"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Edit3, Trash2, Search, Calendar, Bell, ExternalLink, Megaphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { StatusBadge } from "@/components/admin/status-badge"
import { FormSection, FormGrid } from "@/components/ui/form-section"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { formatDateTime } from "@/lib/utils"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
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

const typeOptions = [
  { value: "INFO", label: "Informational" },
  { value: "WARNING", label: "Warning" },
  { value: "URGENT", label: "Urgent" },
  { value: "EVENT", label: "Event" },
]

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Announcement | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/announcements")
        const data = await res.json()
        setItems(data.data?.announcements || [])
      } catch { toast.error("Failed to load announcements") }
      finally { setLoading(false) }
    })()
  }, [])

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(announcementSchema),
  })

  const watchedIsActive = watch("isActive")
  const watchedIsPopup = watch("isPopup")

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
      setItems(data.data?.announcements || [])
    } catch { toast.error("Failed to load announcements") }
  }

  const onSubmit = async (data: any) => {
    setSubmitting(true)
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
    finally { setSubmitting(false) }
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
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Announcement" : "New Announcement"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormSection title="Announcement Details" description="Basic information about the announcement" icon={<Megaphone className="h-4 w-4" />}>
              <Input label="Title" placeholder="e.g. Maha Shivaratri Special Pooja" helperText="A short, descriptive title for the announcement" error={errors.title?.message as string} {...register("title")} />
              <Textarea label="Content" placeholder="Describe the announcement details, schedule, and any instructions for devotees..." helperText="Supports plain text. Keep it concise and informative." showCharCount maxLength={2000} error={errors.content?.message as string} {...register("content")} />
              <Select label="Type" placeholder="Select announcement type" helperText="Determines the visual style and priority level" options={typeOptions} error={errors.type?.message as string} {...register("type")} />
            </FormSection>
            <FormSection title="Schedule" description="Set date range for the announcement to be visible" icon={<Calendar className="h-4 w-4" />} divider>
              <FormGrid columns={2}>
                <Input label="Start Date" type="date" helperText="When should this announcement start showing?" {...register("startDate")} />
                <Input label="End Date" type="date" helperText="Leave empty for no end date" {...register("endDate")} />
              </FormGrid>
            </FormSection>
            <FormSection title="External Link" description="Optionally link to a page with more information" icon={<ExternalLink className="h-4 w-4" />} divider>
              <FormGrid columns={2}>
                <Input label="Link URL" placeholder="https://example.com/event-details" helperText="Full URL including https://" {...register("link")} />
                <Input label="Link Text" placeholder="e.g. Learn More, Register Now" helperText="Text to display on the link button" {...register("linkText")} />
              </FormGrid>
            </FormSection>
            <FormSection title="Settings" description="Control visibility and display behavior" icon={<Bell className="h-4 w-4" />} divider>
              <div className="flex flex-col gap-4">
                <Switch label="Active" description="Active announcements are visible on the website" checked={watchedIsActive} onChange={(e) => setValue("isActive", e.target.checked)} />
                <Switch label="Show as Popup" description="Display as a popup modal when visitors load the page" checked={watchedIsPopup} onChange={(e) => setValue("isPopup", e.target.checked)} />
              </div>
            </FormSection>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setDialogOpen(false)} disabled={submitting}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm" loading={submitting} loadingText={editing ? "Updating..." : "Creating..."}>{editing ? "Update Announcement" : "Create Announcement"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} title="Delete Announcement" description="This will permanently remove the announcement. This action cannot be undone." variant="danger" confirmText="Delete" onConfirm={handleDelete} />
    </div>
  )
}




