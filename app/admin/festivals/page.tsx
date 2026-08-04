"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Edit3, Trash2, Search, Calendar, MapPin, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/admin/status-badge"
import { RichEditor } from "@/components/admin/rich-editor"
import toast from "react-hot-toast"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@/lib/zod-resolver"
import { z } from "zod"

interface Festival {
  id: string
  name: string
  slug: string
  description: string
  startDate: string
  endDate: string
  isMultiDay: boolean
  category: string
  isActive: boolean
  isFeatured: boolean
  rituals: string[]
  image: string
}

const festivalSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().min(20),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  category: z.string().min(1),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
})

export default function FestivalsPage() {
  const [festivals, setFestivals] = useState<Festival[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Festival | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/festivals")
        const data = await res.json()
        setFestivals(data.data?.festivals || [])
      } catch { toast.error("Failed to load festivals") }
      finally { setLoading(false) }
    })()
  }, [])

  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(festivalSchema),
  })

  const openCreate = () => {
    setEditing(null)
    reset({ name: "", slug: "", description: "", startDate: "", endDate: "", category: "MAJOR", isActive: true, isFeatured: false })
    setDialogOpen(true)
  }

  const openEdit = (f: Festival) => {
    setEditing(f)
    reset({ name: f.name, slug: f.slug, description: f.description, startDate: f.startDate, endDate: f.endDate, category: f.category, isActive: f.isActive, isFeatured: f.isFeatured })
    setDialogOpen(true)
  }

  const reload = async () => {
    try {
      const res = await fetch("/api/festivals")
      const data = await res.json()
      setFestivals(data.festivals || [])
    } catch { toast.error("Failed to load festivals") }
  }

  const onSubmit = async (data: any) => {
    try {
      const url = editing ? `/api/festivals/${editing.id}` : "/api/festivals"
      const method = editing ? "PUT" : "POST"
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      if (!res.ok) throw new Error()
      toast.success(editing ? "Festival updated" : "Festival created")
      setDialogOpen(false)
      setEditing(null)
      reload()
    } catch { toast.error("Failed to save festival") }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/festivals/${deleteId}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Festival deleted")
      setDeleteId(null)
      reload()
    } catch { toast.error("Failed to delete festival") }
  }

  const filtered = festivals.filter((f) => !search || f.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Festivals</h1>
          <p className="text-sm text-text-muted mt-1">Manage temple festivals and events</p>
        </div>
        <Button variant="primary" size="sm" iconLeft={<Plus className="h-4 w-4" />} onClick={openCreate}>Add Festival</Button>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search festivals..." className="w-full h-10 pl-10 pr-4 text-sm rounded-xl border border-border bg-warm-white dark:bg-bg-secondary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all" />
      </div>

      <div className="space-y-3">
        {filtered.map((festival) => {
          const isExpanded = expanded === festival.id
          return (
            <motion.div key={festival.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-warm-white dark:bg-bg-secondary overflow-hidden">
              <button onClick={() => setExpanded(isExpanded ? null : festival.id)} className="w-full flex items-center justify-between p-4 text-left hover:bg-bg-secondary/50 transition-all">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-warm-white font-bold text-sm shrink-0">
                    {festival.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-text-primary">{festival.name}</h4>
                      <StatusBadge status={festival.isActive ? "ACTIVE" : "INACTIVE"} size="xs" />
                      {festival.isFeatured && <Badge variant="primary" size="xs">Featured</Badge>}
                      {festival.isMultiDay && <Badge variant="secondary" size="xs">Multi-Day</Badge>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-muted mt-1">
                      <span>{festival.startDate}{festival.isMultiDay ? ` - ${festival.endDate}` : ""}</span>
                      <Badge variant="subtle" size="xs">{festival.category}</Badge>
                      <span>{festival.rituals.length} rituals</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => openEdit(festival)} className="p-1.5 rounded-lg text-text-muted hover:text-secondary hover:bg-secondary/10 transition-all"><Edit3 className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteId(festival.id)} className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="h-4 w-4" /></button>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-text-muted" /> : <ChevronDown className="h-4 w-4 text-text-muted" />}
                </div>
              </button>
              {isExpanded && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="px-4 pb-4 border-t border-border">
                  <p className="text-sm text-text-muted mt-3">{festival.description}</p>
                  {festival.rituals.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Rituals</p>
                      <div className="flex flex-wrap gap-2">
                        {festival.rituals.map((r, i) => <Badge key={i} variant="subtle" size="sm">{r}</Badge>)}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent size="md">
          <DialogHeader><DialogTitle>{editing ? "Edit Festival" : "Add Festival"}</DialogTitle><DialogDescription>Manage festival details</DialogDescription></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Festival Name" placeholder="e.g., Maha Shivaratri" error={errors.name?.message as string} {...register("name")} />
              <Input label="Slug" placeholder="maha-shivaratri" error={errors.slug?.message as string} {...register("slug")} />
            </div>
            <Input label="Description" placeholder="Describe the festival..." error={errors.description?.message as string} {...register("description")} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Input label="Start Date" type="date" error={errors.startDate?.message as string} {...register("startDate")} />
              <Input label="End Date" type="date" error={errors.endDate?.message as string} {...register("endDate")} />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Category</label>
                <select {...register("category")} className="h-11 rounded-lg border border-border bg-warm-white dark:bg-bg-secondary px-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20">
                  <option value="MAJOR">Major</option>
                  <option value="MINOR">Minor</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="BRAHMOTSAVA">Brahmotsava</option>
                  <option value="SPECIAL">Special</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" {...register("isActive")} className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary" /><span className="text-sm text-text-primary">Active</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" {...register("isFeatured")} className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary" /><span className="text-sm text-text-primary">Featured</span></label>
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
          <DialogHeader><DialogTitle>Delete Festival</DialogTitle><DialogDescription>Are you sure?</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}




