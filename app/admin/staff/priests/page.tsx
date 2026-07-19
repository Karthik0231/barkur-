"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Edit3, Trash2, Search, Phone, Mail, Calendar, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/admin/status-badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@/lib/zod-resolver"
import { z } from "zod"
import toast from "react-hot-toast"

interface Priest {
  id: string
  name: string
  title: string
  specialization: string
  experience: number
  phone: string
  email: string
  biography: string
  qualifications: string
  joinedAt: string
  isActive: boolean
}

const priestSchema = z.object({
  name: z.string().min(2).max(100),
  title: z.string().min(2).max(100),
  specialization: z.string().min(2).max(200),
  experience: z.coerce.number().int().min(0),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/),
  email: z.string().email().optional().or(z.literal("")),
  biography: z.string().max(2000).optional(),
  qualifications: z.string().max(500).optional(),
  joinedAt: z.string().min(1),
  isActive: z.boolean().optional(),
})

export default function PriestsPage() {
  const [priests, setPriests] = useState<Priest[]>([])
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Priest | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/staff?type=PRIEST").then((r) => r.json()).then((json) => {
      setPriests(Array.isArray(json) ? json : (json.data ?? []))
    }).finally(() => setLoading(false))
  }, [])

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(priestSchema),
  })

  const openCreate = () => {
    setEditing(null)
    reset({ name: "", title: "", specialization: "", experience: 0, phone: "", email: "", biography: "", qualifications: "", joinedAt: "", isActive: true })
    setDialogOpen(true)
  }

  const openEdit = (p: Priest) => {
    setEditing(p)
    reset(p)
    setDialogOpen(true)
  }

  const onSubmit = async (data: any) => {
    try {
      if (editing) {
        await fetch(`/api/staff/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        setPriests((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...data } : p))
        toast.success("Priest updated")
      } else {
        const res = await fetch("/api/staff", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        const created = await res.json()
        setPriests((prev) => [...prev, created.data ?? created])
        toast.success("Priest created")
      }
      setDialogOpen(false)
      setEditing(null)
    } catch { toast.error("Operation failed") }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await fetch(`/api/staff/${deleteId}`, { method: "DELETE" })
      setPriests((prev) => prev.filter((p) => p.id !== deleteId))
      toast.success("Priest deleted")
      setDeleteId(null)
    } catch { toast.error("Delete failed") }
  }

  const filtered = priests.filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.specialization.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Priests</h1>
          <p className="text-sm text-text-muted mt-1">Dedicated priest management</p>
        </div>
        <Button variant="primary" size="sm" iconLeft={<Plus className="h-4 w-4" />} onClick={openCreate}>Add Priest</Button>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search priests..." className="w-full h-10 pl-10 pr-4 text-sm rounded-xl border border-border bg-warm-white dark:bg-bg-secondary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((priest) => (
          <motion.div key={priest.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-xl border border-border bg-warm-white dark:bg-bg-secondary hover:shadow-sm transition-all">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center text-amber-600 font-bold text-lg shrink-0">
                {priest.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-text-primary truncate">{priest.name}</h4>
                  <StatusBadge status={priest.isActive ? "ACTIVE" : "INACTIVE"} size="xs" />
                </div>
                <p className="text-sm font-medium text-secondary">{priest.title}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge variant="subtle" size="xs">{priest.experience} years exp.</Badge>
                  {priest.qualifications && <Badge variant="subtle" size="xs">{priest.qualifications}</Badge>}
                </div>
                <p className="text-xs text-text-muted mt-2 line-clamp-2">{priest.biography}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {priest.specialization.split(",").map((s, i) => <Badge key={i} variant="primary" size="xs">{s.trim()}</Badge>)}
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted mt-2">
                  {priest.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{priest.email}</span>}
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{priest.phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(priest)} className="p-1.5 rounded-lg text-text-muted hover:text-secondary hover:bg-secondary/10 transition-all"><Edit3 className="h-4 w-4" /></button>
                <button onClick={() => setDeleteId(priest.id)} className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent size="md">
          <DialogHeader><DialogTitle>{editing ? "Edit Priest" : "Add Priest"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Full Name" error={errors.name?.message as string} {...register("name")} />
              <Input label="Title" placeholder="e.g., Head Priest" error={errors.title?.message as string} {...register("title")} />
            </div>
            <Input label="Specialization" placeholder="e.g., Vedic Rituals, Homa" error={errors.specialization?.message as string} {...register("specialization")} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Experience (years)" type="number" error={errors.experience?.message as string} {...register("experience")} />
              <Input label="Phone" error={errors.phone?.message as string} {...register("phone")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Email" type="email" {...register("email")} />
              <Input label="Joined Date" type="date" error={errors.joinedAt?.message as string} {...register("joinedAt")} />
            </div>
            <Input label="Qualifications" {...register("qualifications")} />
            <Input label="Biography" {...register("biography")} />
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
          <DialogHeader><DialogTitle>Delete Priest</DialogTitle><DialogDescription>Are you sure?</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}




