"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Edit3, Trash2, Search, Church, MapPin, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/admin/status-badge"
import { RichEditor } from "@/components/admin/rich-editor"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@/lib/zod-resolver"
import { z } from "zod"
import toast from "react-hot-toast"

interface SubDeity {
  id: string
  name: string
  sanskritName: string
  description: string
  significance: string
  image: string
  templeLocation: string
  isActive: boolean
  sortOrder: number
}

const deitySchema = z.object({
  name: z.string().min(2).max(200),
  sanskritName: z.string().optional(),
  description: z.string().min(20).max(3000),
  significance: z.string().max(2000).optional(),
  templeLocation: z.string().max(200).optional(),
  isActive: z.boolean().optional(),
})

export default function SubDeitiesPage() {
  const [deities, setDeities] = useState<SubDeity[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<SubDeity | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editorContent, setEditorContent] = useState("")

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/sub-deities")
        const data = await res.json()
        setDeities(data.data?.deities || data.deities || data.subDeities || [])
      } catch { toast.error("Failed to load sub-deities") }
      finally { setLoading(false) }
    })()
  }, [])

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(deitySchema),
  })

  const openCreate = () => {
    setEditing(null)
    reset({ name: "", sanskritName: "", description: "", significance: "", templeLocation: "", isActive: true })
    setEditorContent("")
    setDialogOpen(true)
  }

  const openEdit = (d: SubDeity) => {
    setEditing(d)
    reset({ name: d.name, sanskritName: d.sanskritName, description: d.description, significance: d.significance || "", templeLocation: d.templeLocation || "", isActive: d.isActive })
    setEditorContent(d.description)
    setDialogOpen(true)
  }

  const reload = async () => {
    try {
      const res = await fetch("/api/sub-deities")
      const data = await res.json()
      setDeities(data.data?.deities || data.deities || data.subDeities || [])
    } catch { toast.error("Failed to load sub-deities") }
  }

  const onSubmit = async (data: any) => {
    try {
      const processed = { ...data, description: editorContent }
      const url = editing ? `/api/sub-deities/${editing.id}` : "/api/sub-deities"
      const method = editing ? "PUT" : "POST"
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(processed) })
      if (!res.ok) throw new Error()
      toast.success(editing ? "Sub-deity updated" : "Sub-deity created")
      setDialogOpen(false)
      setEditing(null)
      reload()
    } catch { toast.error("Failed to save sub-deity") }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/sub-deities/${deleteId}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Sub-deity deleted")
      setDeleteId(null)
      reload()
    } catch { toast.error("Failed to delete sub-deity") }
  }

  const filtered = deities.filter((d) => !search || d.name.toLowerCase().includes(search.toLowerCase()) || (d.sanskritName && d.sanskritName.includes(search)))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Sub Deities</h1>
          <p className="text-sm text-text-muted mt-1">Manage temple sub-deities and shrines</p>
        </div>
        <Button variant="primary" size="sm" iconLeft={<Plus className="h-4 w-4" />} onClick={openCreate}>Add Deity</Button>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search deities..." className="w-full h-10 pl-10 pr-4 text-sm rounded-xl border border-border bg-warm-white dark:bg-bg-secondary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((deity) => (
          <motion.div key={deity.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-xl border border-border bg-warm-white dark:bg-bg-secondary hover:shadow-sm transition-all">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center text-amber-600 shrink-0">
                <Church className="h-7 w-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-text-primary">{deity.name}</h4>
                  {deity.sanskritName && <span className="text-sm text-text-muted">{deity.sanskritName}</span>}
                  <StatusBadge status={deity.isActive ? "ACTIVE" : "INACTIVE"} size="xs" />
                </div>
                <p className="text-sm text-text-muted mt-1 line-clamp-3">{deity.description}</p>
                {deity.significance && (
                  <div className="flex items-start gap-1 mt-2 text-xs text-text-muted">
                    <BookOpen className="h-3 w-3 mt-0.5 shrink-0" />
                    <span>{deity.significance}</span>
                  </div>
                )}
                {deity.templeLocation && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-text-muted">
                    <MapPin className="h-3 w-3" />
                    <span>{deity.templeLocation}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(deity)} className="p-1.5 rounded-lg text-text-muted hover:text-secondary hover:bg-secondary/10 transition-all"><Edit3 className="h-4 w-4" /></button>
                <button onClick={() => setDeleteId(deity.id)} className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent size="md">
          <DialogHeader><DialogTitle>{editing ? "Edit Deity" : "Add Deity"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Deity Name" error={errors.name?.message as string} {...register("name")} />
              <Input label="Sanskrit Name" placeholder="देवता नाम" {...register("sanskritName")} />
            </div>
            <RichEditor label="Description" value={editorContent} onChange={setEditorContent} minHeight="150px" />
            <Input label="Significance" placeholder="Spiritual significance..." {...register("significance")} />
            <Input label="Temple Location" placeholder="e.g., North side shrine" {...register("templeLocation")} />
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" {...register("isActive")} className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary" /><span className="text-sm text-text-primary">Active</span></label>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm">{editing ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent size="sm">
          <DialogHeader><DialogTitle>Delete Deity</DialogTitle><DialogDescription>Are you sure?</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}




