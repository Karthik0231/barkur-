"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit3, Trash2, Search, Phone, Mail, Calendar } from "lucide-react"
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

interface CommitteeMember {
  id: string
  name: string
  role: string
  type: string
  photo: string
  biography: string
  email: string
  phone: string
  tenureStart: string
  tenureEnd: string | null
  isActive: boolean
  sortOrder: number
}

const memberSchema = z.object({
  name: z.string().min(2).max(100),
  role: z.string().min(2).max(100),
  type: z.string().min(1),
  biography: z.string().max(2000).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/),
  tenureStart: z.string().min(1),
  tenureEnd: z.string().optional(),
  isActive: z.boolean().optional(),
})

const memberTypes = ["TRUSTEE", "MEMBER", "PRIEST", "STAFF", "VOLUNTEER"]

const sampleMembers: CommitteeMember[] = [
  { id: "cm1", name: "Sri Ramachandra Hegde", role: "President", type: "TRUSTEE", photo: "", biography: "Serving as the president of the temple trust for over 10 years.", email: "ramachandra@temple.org", phone: "+91 98765 43201", tenureStart: "2020-01-01", tenureEnd: "2025-12-31", isActive: true, sortOrder: 1 },
  { id: "cm2", name: "Smt. Lakshmi Devi Shetty", role: "Vice President", type: "TRUSTEE", photo: "", biography: "Active member of the temple committee since 2015.", email: "lakshmi@temple.org", phone: "+91 98765 43202", tenureStart: "2020-01-01", tenureEnd: "2025-12-31", isActive: true, sortOrder: 2 },
  { id: "cm3", name: "Sri Ganesh Pai", role: "Treasurer", type: "MEMBER", photo: "", biography: "Managing temple finances and donations.", email: "ganesh@temple.org", phone: "+91 98765 43203", tenureStart: "2021-01-01", tenureEnd: "2026-12-31", isActive: true, sortOrder: 3 },
  { id: "cm4", name: "Sri Venkatesh Acharya", role: "Secretary", type: "MEMBER", photo: "", biography: "Handling day-to-day operations and administration.", email: "venkatesh@temple.org", phone: "+91 98765 43204", tenureStart: "2021-06-01", tenureEnd: null, isActive: true, sortOrder: 4 },
  { id: "cm5", name: "Sri Madhava Bhat", role: "Member", type: "MEMBER", photo: "", biography: "Trust member since 2018.", email: "madhava@temple.org", phone: "+91 98765 43205", tenureStart: "2018-01-01", tenureEnd: "2024-12-31", isActive: false, sortOrder: 5 },
]

export default function CommitteePage() {
  const [members, setMembers] = useState<CommitteeMember[]>(sampleMembers)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<CommitteeMember | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(memberSchema),
  })

  const openCreate = () => {
    setEditing(null)
    reset({ name: "", role: "", type: "MEMBER", biography: "", email: "", phone: "", tenureStart: "", tenureEnd: "", isActive: true })
    setDialogOpen(true)
  }

  const openEdit = (m: CommitteeMember) => {
    setEditing(m)
    reset({ name: m.name, role: m.role, type: m.type, biography: m.biography, email: m.email, phone: m.phone, tenureStart: m.tenureStart, tenureEnd: m.tenureEnd || "", isActive: m.isActive })
    setDialogOpen(true)
  }

  const onSubmit = (data: any) => {
    if (editing) {
      setMembers((prev) => prev.map((m) => m.id === editing.id ? { ...m, ...data, tenureEnd: data.tenureEnd || null } : m))
    } else {
      setMembers((prev) => [...prev, { id: `cm${Date.now()}`, ...data, tenureEnd: data.tenureEnd || null, photo: "", sortOrder: prev.length + 1 }])
    }
    setDialogOpen(false)
    setEditing(null)
  }

  const handleDelete = () => { if (deleteId) { setMembers((prev) => prev.filter((m) => m.id !== deleteId)); setDeleteId(null) } }

  const filtered = members.filter((m) => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase())
    const matchType = !typeFilter || m.type === typeFilter
    return matchSearch && matchType
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Committee Members</h1>
          <p className="text-sm text-text-muted mt-1">Manage temple trust committee and governing body</p>
        </div>
        <Button variant="primary" size="sm" iconLeft={<Plus className="h-4 w-4" />} onClick={openCreate}>Add Member</Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search members..." className="w-full h-10 pl-10 pr-4 text-sm rounded-xl border border-border bg-warm-white dark:bg-bg-secondary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all" />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="h-10 px-3 text-sm rounded-xl border border-border bg-warm-white dark:bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20">
          <option value="">All Types</option>
          {memberTypes.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((member) => (
          <motion.div key={member.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-xl border border-border bg-warm-white dark:bg-bg-secondary hover:shadow-sm transition-all">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center text-secondary font-bold text-lg shrink-0">
                {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-text-primary truncate">{member.name}</h4>
                  <StatusBadge status={member.isActive ? "ACTIVE" : "INACTIVE"} size="xs" />
                </div>
                <p className="text-sm text-text-muted">{member.role}</p>
                <Badge variant="subtle" size="xs" className="mt-1">{member.type.replace(/_/g, " ")}</Badge>
                <div className="flex flex-col gap-1 mt-3 text-xs text-text-muted">
                  {member.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{member.email}</span>}
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{member.phone}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{member.tenureStart}{member.tenureEnd ? ` - ${member.tenureEnd}` : " - Present"}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => openEdit(member)} className="p-1.5 rounded-lg text-text-muted hover:text-secondary hover:bg-secondary/10 transition-all"><Edit3 className="h-4 w-4" /></button>
                <button onClick={() => setDeleteId(member.id)} className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent size="md">
          <DialogHeader><DialogTitle>{editing ? "Edit Member" : "Add Member"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Full Name" placeholder="Member name" error={errors.name?.message as string} {...register("name")} />
              <Input label="Designation/Role" placeholder="e.g., President" error={errors.role?.message as string} {...register("role")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Email" type="email" placeholder="email@temple.org" {...register("email")} />
              <Input label="Phone" placeholder="+91 98765 43210" error={errors.phone?.message as string} {...register("phone")} />
            </div>
            <Input label="Biography" placeholder="Brief biography..." {...register("biography")} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Type</label>
                <select {...register("type")} className="h-11 rounded-lg border border-border bg-warm-white dark:bg-bg-secondary px-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20">
                  {memberTypes.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                </select>
              </div>
              <Input label="Tenure Start" type="date" error={errors.tenureStart?.message as string} {...register("tenureStart")} />
              <Input label="Tenure End" type="date" {...register("tenureEnd")} />
            </div>
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
          <DialogHeader><DialogTitle>Delete Member</DialogTitle><DialogDescription>Are you sure?</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}




