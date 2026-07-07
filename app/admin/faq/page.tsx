"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Edit3, Trash2, Search, GripVertical, ChevronDown, ChevronUp } from "lucide-react"
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

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  isPublished: boolean
  sortOrder: number
}

const faqSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters").max(500),
  answer: z.string().min(10, "Answer must be at least 10 characters").max(5000),
  category: z.string().min(1),
  isPublished: z.boolean().optional(),
})

const sampleFAQs: FAQItem[] = [
  { id: "faq1", question: "What are the temple timings?", answer: "The temple is open from 6:00 AM to 1:30 PM in the morning and 4:00 PM to 7:30 PM in the evening.", category: "General", isPublished: true, sortOrder: 1 },
  { id: "faq2", question: "How can I book a seva online?", answer: "You can book sevas online through our website by visiting the Sevas page, selecting your preferred seva, and completing the booking form.", category: "Sevas", isPublished: true, sortOrder: 2 },
  { id: "faq3", question: "What is the cancellation policy for bookings?", answer: "Cancellations made 48 hours before the scheduled date are eligible for a full refund. Cancellations within 24 hours may incur a 25% fee.", category: "Bookings", isPublished: true, sortOrder: 3 },
  { id: "faq4", question: "Can I make donations online?", answer: "Yes, you can make donations online through our website. We accept UPI, Net Banking, and Credit/Debit cards.", category: "Donations", isPublished: true, sortOrder: 4 },
  { id: "faq5", question: "How do I reach the temple?", answer: "The temple is located in Barkur, Udupi District, Karnataka. It is about 15 km from Udupi city and well-connected by road.", category: "General", isPublished: true, sortOrder: 5 },
  { id: "faq6", question: "Is there accommodation available near the temple?", answer: "Yes, there are several guest houses and hotels available near the temple. Contact the temple office for recommendations.", category: "General", isPublished: false, sortOrder: 6 },
]

const categories = ["General", "Sevas", "Bookings", "Donations", "Hall Booking", "Temple"]

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>(sampleFAQs)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<FAQItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(faqSchema),
  })

  const openCreate = () => {
    setEditing(null)
    reset({ question: "", answer: "", category: "General", isPublished: true })
    setDialogOpen(true)
  }

  const openEdit = (faq: FAQItem) => {
    setEditing(faq)
    reset({ question: faq.question, answer: faq.answer, category: faq.category, isPublished: faq.isPublished })
    setDialogOpen(true)
  }

  const onSubmit = (data: any) => {
    if (editing) {
      setFaqs((prev) => prev.map((f) => f.id === editing.id ? { ...f, ...data } : f))
    } else {
      setFaqs((prev) => [...prev, { id: `faq${Date.now()}`, ...data, sortOrder: prev.length + 1 }])
    }
    setDialogOpen(false)
    setEditing(null)
  }

  const handleDelete = () => { if (deleteId) { setFaqs((prev) => prev.filter((f) => f.id !== deleteId)); setDeleteId(null) } }

  const filtered = faqs.filter((f) => {
    const matchSearch = !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase())
    const matchCategory = !categoryFilter || f.category === categoryFilter
    return matchSearch && matchCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">FAQ Management</h1>
          <p className="text-sm text-text-muted mt-1">Manage frequently asked questions</p>
        </div>
        <Button variant="primary" size="sm" iconLeft={<Plus className="h-4 w-4" />} onClick={openCreate}>Add FAQ</Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search FAQs..." className="w-full h-10 pl-10 pr-4 text-sm rounded-xl border border-border bg-warm-white dark:bg-bg-secondary text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="h-10 px-3 text-sm rounded-xl border border-border bg-warm-white dark:bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        {filtered.map((faq) => {
          const isExpanded = expanded === faq.id
          return (
            <motion.div key={faq.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border bg-warm-white dark:bg-bg-secondary overflow-hidden">
              <button onClick={() => setExpanded(isExpanded ? null : faq.id)} className="w-full flex items-center justify-between p-4 text-left hover:bg-bg-secondary/50 transition-all">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <GripVertical className="h-4 w-4 text-text-muted/40 shrink-0 cursor-grab" />
                  <StatusBadge status={faq.isPublished ? "ACTIVE" : "INACTIVE"} size="xs" />
                  <Badge variant="subtle" size="xs">{faq.category}</Badge>
                  <span className="font-medium text-text-primary truncate">{faq.question}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => openEdit(faq)} className="p-1.5 rounded-lg text-text-muted hover:text-secondary hover:bg-secondary/10 transition-all"><Edit3 className="h-4 w-4" /></button>
                  <button onClick={() => setDeleteId(faq.id)} className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="h-4 w-4" /></button>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-text-muted" /> : <ChevronDown className="h-4 w-4 text-text-muted" />}
                </div>
              </button>
              {isExpanded && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} className="px-4 pb-4 pt-2 border-t border-border">
                  <p className="text-sm text-text-secondary">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent size="md">
          <DialogHeader><DialogTitle>{editing ? "Edit FAQ" : "Add FAQ"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
            <Input label="Question" placeholder="Enter the question..." error={errors.question?.message as string} {...register("question")} />
            <Input label="Answer" placeholder="Enter the answer..." error={errors.answer?.message as string} {...register("answer")} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Category</label>
              <select {...register("category")} className="h-11 rounded-lg border border-border bg-warm-white dark:bg-bg-secondary px-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" {...register("isPublished")} className="h-4 w-4 rounded border-border text-secondary focus:ring-secondary" /><span className="text-sm text-text-primary">Published</span></label>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm">{editing ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent size="sm">
          <DialogHeader><DialogTitle>Delete FAQ</DialogTitle><DialogDescription>Are you sure?</DialogDescription></DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}




