"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { Plus, Edit3, Trash2, Search, Target, Calendar, IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/admin/status-badge"
import { formatPrice, cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@/lib/zod-resolver"
import { campaignSchema, type CampaignInput } from "@/lib/validations"

interface Campaign {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  goalAmount: number
  collectedAmount: number
  startDate: string
  endDate: string | null
  category: string
  isActive: boolean
  isFeatured: boolean
  banner: string
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Campaign | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/donations/campaigns?limit=100")
      .then((r) => r.json())
      .then((d) => {
        const payload = d.data || d
        const items = Array.isArray(payload.campaigns) ? payload.campaigns : Array.isArray(payload) ? payload : []
        setCampaigns(items)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CampaignInput>({
    resolver: zodResolver(campaignSchema),
  })

  const openCreate = () => {
    setEditing(null)
    reset({ name: "", slug: "", description: "", shortDescription: "", goalAmount: undefined, startDate: "", endDate: "", category: "GENERAL", isActive: true, isFeatured: false, banner: "" })
    setDialogOpen(true)
  }

  const openEdit = (c: Campaign) => {
    setEditing(c)
    reset({ name: c.name, slug: c.slug, description: c.description, shortDescription: c.shortDescription || "", goalAmount: c.goalAmount, startDate: c.startDate, endDate: c.endDate || "", category: c.category, isActive: c.isActive, isFeatured: c.isFeatured, banner: c.banner || "" })
    setDialogOpen(true)
  }

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
        shortDescription: data.shortDescription || "",
        banner: data.banner || "",
      }
      if (editing) {
        const res = await fetch(`/api/donations/campaigns/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error()
        const updated = await res.json()
        toast.success("Campaign updated")
        setCampaigns((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...payload, endDate: payload.endDate || null } : c))
      } else {
        const res = await fetch("/api/donations/campaigns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error()
        const created = await res.json()
        toast.success("Campaign created")
        setCampaigns((prev) => [...prev, created.data || created])
      }
      setDialogOpen(false)
      setEditing(null)
    } catch {
      toast.error("Failed to save campaign")
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/donations/campaigns/${deleteId}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Campaign deleted")
      setCampaigns((prev) => prev.filter((c) => c.id !== deleteId))
      setDeleteId(null)
    } catch {
      toast.error("Failed to delete campaign")
    }
  }

  const filtered = campaigns.filter((c) => !search || c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Donation Campaigns</h1>
          <p className="text-sm text-text-muted mt-1">Manage fundraising campaigns and track goals</p>
        </div>
        <Button variant="primary" size="sm" iconLeft={<Plus className="h-4 w-4" />} onClick={openCreate}>
          New Campaign
        </Button>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search campaigns..." className="w-full h-10 pl-10 pr-4 text-sm rounded-xl border border-border bg-warm-white dark:bg-bg-secondary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((campaign) => {
          const progress = Math.min(100, Math.round((campaign.collectedAmount / campaign.goalAmount) * 100))
          return (
            <motion.div key={campaign.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-xl border border-border bg-warm-white dark:bg-bg-secondary hover:shadow-sm transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-text-primary truncate">{campaign.name}</h4>
                    {campaign.isFeatured && <Badge variant="primary" size="xs">Featured</Badge>}
                    <StatusBadge status={campaign.isActive ? "ACTIVE" : "INACTIVE"} size="xs" />
                  </div>
                  <p className="text-sm text-text-muted mt-1 line-clamp-2">{campaign.description}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button onClick={() => openEdit(campaign)} className="p-1.5 rounded-lg text-text-muted hover:text-secondary hover:bg-secondary/10 transition-all"><Edit3 className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteId(campaign.id)} className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-text-muted mb-3">
                <span className="flex items-center gap-1"><Target className="h-3.5 w-3.5" />Goal: {formatPrice(campaign.goalAmount)}</span>
                <span className="flex items-center gap-1"><IndianRupee className="h-3.5 w-3.5" />Raised: {formatPrice(campaign.collectedAmount)}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{campaign.startDate}{campaign.endDate ? ` - ${campaign.endDate}` : ""}</span>
              </div>

              <div className="relative h-2.5 rounded-full bg-bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full",
                    progress >= 100 ? "bg-emerald-500" : progress >= 50 ? "bg-secondary" : "bg-amber-500",
                  )}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-xs font-medium text-text-primary">{progress}% funded</span>
                <span className="text-xs text-text-muted">{formatPrice(campaign.goalAmount - campaign.collectedAmount)} remaining</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Campaign" : "Create Campaign"}</DialogTitle>
            <DialogDescription>Set up a new donation campaign</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input variant="filled" label="Campaign Name" placeholder="e.g., Temple Renovation" error={errors.name?.message as string} {...register("name")} />
              <Input variant="filled" label="Slug" placeholder="temple-renovation" error={errors.slug?.message as string} {...register("slug")} />
            </div>
            <Input variant="filled" label="Short Description" placeholder="Brief summary shown on campaign cards..." error={errors.shortDescription?.message as string} {...register("shortDescription")} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Description</label>
              <textarea {...register("description")} placeholder="Describe the campaign purpose..." rows={4} className="w-full rounded-xl border border-border bg-warm-white dark:bg-bg-secondary p-4 text-sm text-text-primary placeholder:text-text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus-visible:outline-none transition-all resize-none" />
              {errors.description && <span className="text-xs text-red-500">{errors.description.message as string}</span>}
            </div>
            <Input variant="filled" label="Banner Image URL" placeholder="https://example.com/banner.jpg" error={errors.banner?.message as string} {...register("banner")} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Input variant="filled" label="Goal Amount (₹)" type="number" placeholder="1000000" error={errors.goalAmount?.message as string} {...register("goalAmount")} />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary">Category</label>
                <select {...register("category")} className="h-11 rounded-lg border border-border bg-warm-white dark:bg-bg-secondary px-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20">
                  <option value="GENERAL">General</option>
                  <option value="ANNADANAM">Annadanam</option>
                  <option value="RENOVATION">Renovation</option>
                  <option value="FESTIVAL">Festival</option>
                  <option value="GO_SEVA">Go Seva</option>
                  <option value="EDUCATION">Education</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <Input variant="filled" label="Start Date" type="date" error={errors.startDate?.message as string} {...register("startDate")} />
              <Input variant="filled" label="End Date" type="date" {...register("endDate")} />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register("isActive")} className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary" />
                <span className="text-sm text-text-primary">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register("isFeatured")} className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary" />
                <span className="text-sm text-text-primary">Featured</span>
              </label>
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
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription>Are you sure? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}





