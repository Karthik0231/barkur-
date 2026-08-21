"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { Plus, Edit3, Trash2, Search, Clock, Sun, Moon } from "lucide-react"
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

interface ScheduleItem {
  id: string
  dayOfWeek: number
  title: string
  description: string
  startTime: string
  endTime: string
  location: string
  isActive: boolean
  sortOrder: number
}

const scheduleSchema = z.object({
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  title: z.string().min(2).max(200),
  description: z.string().max(500).optional(),
  startTime: z.string().min(1).regex(/^\d{2}:\d{2}$/),
  endTime: z.string().min(1).regex(/^\d{2}:\d{2}$/),
  location: z.string().max(200).optional(),
  isActive: z.boolean().optional(),
})

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default function DailySchedulePage() {
  const [items, setItems] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [dayFilter, setDayFilter] = useState<number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ScheduleItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchSchedule = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/daily-schedule")
      const json = await res.json()
      const data = json.data ?? json ?? []
      setItems(Array.isArray(data) ? data : [])
    } catch {
      toast.error("Failed to fetch schedule")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSchedule() }, [])

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(scheduleSchema),
  })

  const openCreate = () => {
    setEditing(null)
    reset({ dayOfWeek: 0, title: "", description: "", startTime: "06:00", endTime: "07:00", location: "", isActive: true })
    setDialogOpen(true)
  }

  const openEdit = (item: ScheduleItem) => {
    setEditing(item)
    reset({ dayOfWeek: item.dayOfWeek, title: item.title, description: item.description || "", startTime: item.startTime, endTime: item.endTime, location: item.location || "", isActive: item.isActive })
    setDialogOpen(true)
  }

  const onSubmit = async (data: any) => {
    try {
      const payload = { ...data, description: data.description || null, location: data.location || null }
      if (editing) {
        const res = await fetch(`/api/daily-schedule/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        const json = await res.json()
        if (!json.success) { toast.error(json.message); return }
        toast.success(json.message)
      } else {
        const res = await fetch("/api/daily-schedule", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        const json = await res.json()
        if (!json.success) { toast.error(json.message); return }
        toast.success(json.message)
      }
      fetchSchedule()
      setDialogOpen(false)
      setEditing(null)
    } catch { toast.error("Failed to save schedule") }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/daily-schedule/${deleteId}`, { method: "DELETE" })
      const json = await res.json()
      if (!json.success) { toast.error(json.message); return }
      toast.success(json.message)
      fetchSchedule()
    } catch { toast.error("Failed to delete schedule") }
    setDeleteId(null)
  }

  const filtered = items.filter((i) => {
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase())
    const matchDay = dayFilter === null || i.dayOfWeek === dayFilter
    return matchSearch && matchDay
  })

  const grouped = DAYS.map((day, idx) => ({
    day,
    dayIndex: idx,
    items: filtered.filter((i) => i.dayOfWeek === idx).sort((a, b) => a.sortOrder - b.sortOrder),
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Daily Schedule</h1>
          <p className="text-sm text-text-muted mt-1">Manage temple daily rituals and timings</p>
        </div>
        <Button variant="primary" size="sm" iconLeft={<Plus className="h-4 w-4" />} onClick={openCreate}>Add Schedule</Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search schedule..." className="w-full h-10 pl-10 pr-4 text-sm rounded-xl border border-border bg-warm-white dark:bg-bg-secondary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all" />
        </div>
        <select value={dayFilter ?? ""} onChange={(e) => setDayFilter(e.target.value ? Number(e.target.value) : null)} className="h-10 px-3 text-sm rounded-xl border border-border bg-warm-white dark:bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20">
          <option value="">All Days</option>
          {DAYS.map((day, idx) => <option key={idx} value={idx}>{day}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-muted">Loading...</div>
      ) : (
      <><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {grouped.map(({ day, dayIndex, items: dayItems }) =>
          dayItems.length > 0 && (
            <Card key={dayIndex} className="p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                {dayIndex === 0 ? <Sun className="h-4 w-4 text-amber-500" /> : <Clock className="h-4 w-4 text-secondary" />}
                <h4 className="font-semibold text-text-primary text-sm">{day}</h4>
                <Badge variant="subtle" size="xs">{dayItems.length}</Badge>
              </div>
              <div className="space-y-2">
                {dayItems.map((item) => (
                  <div key={item.id} className={cn("flex items-center justify-between p-2 rounded-lg transition-all", item.isActive ? "bg-bg-secondary/50" : "bg-bg-secondary/30 opacity-60")}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-mono font-medium text-secondary">{item.startTime} - {item.endTime}</span>
                        {!item.isActive && <StatusBadge status="INACTIVE" size="xs" />}
                      </div>
                      <p className="text-sm font-medium text-text-primary truncate">{item.title}</p>
                      {item.location && <p className="text-[10px] text-text-muted">{item.location}</p>}
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0 ml-1">
                      <button onClick={() => openEdit(item)} className="p-1 rounded text-text-muted hover:text-secondary transition-all"><Edit3 className="h-3 w-3" /></button>
                      <button onClick={() => setDeleteId(item.id)} className="p-1 rounded text-text-muted hover:text-red-500 transition-all"><Trash2 className="h-3 w-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ),
        )}
      </div>

      {filtered.length === 0 && <div className="text-center py-12 text-text-muted">No schedule items found</div>}
      </>)}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent size="md">
          <DialogHeader><DialogTitle>{editing ? "Edit Schedule" : "Add Schedule"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Title" placeholder="e.g., Suprabhata Seva" error={errors.title?.message as string} {...register("title")} />
            <Input label="Description" placeholder="Brief description..." {...register("description")} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Day</label>
                <select {...register("dayOfWeek")} className="h-11 rounded-lg border border-border bg-warm-white dark:bg-bg-secondary px-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20">
                  {DAYS.map((day, idx) => <option key={idx} value={idx}>{day}</option>)}
                </select>
              </div>
              <Input label="Start Time" type="time" placeholder="06:00" error={errors.startTime?.message as string} {...register("startTime")} />
              <Input label="End Time" type="time" placeholder="07:00" error={errors.endTime?.message as string} {...register("endTime")} />
              <Input label="Location" placeholder="e.g., Main Temple" {...register("location")} />
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
          <DialogHeader><DialogTitle>Delete Schedule</DialogTitle><DialogDescription>Are you sure?</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function cn(...inputs: unknown[]) { return inputs.filter(Boolean).join(" ") }




