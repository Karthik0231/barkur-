"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Mail, Phone, MessageSquare, CheckCircle, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/admin/status-badge"
import { DataTable, type Column } from "@/components/admin/data-table"
import { formatDateTime } from "@/lib/utils"
import toast from "react-hot-toast"

interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  isRead: boolean
  category: string | null
  createdAt: string
}



export default function ContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((d) => {
        setMessages(d.data?.contacts || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      })
      if (!res.ok) throw new Error()
      toast.success("Marked as read")
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, isRead: true } : m))
    } catch {
      toast.error("Failed to mark as read")
    }
  }

  const filtered = messages.filter((m) => !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()))

  const unread = messages.filter((m) => !m.isRead).length

  const columns: Column<ContactMessage>[] = [
    {
      key: "name",
      header: "From",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          {!item.isRead && <span className="h-2 w-2 rounded-full bg-secondary shrink-0" />}
          <div>
            <p className={cn("font-medium", item.isRead ? "text-text-primary" : "text-text-primary font-semibold")}>{item.name}</p>
            <p className="text-xs text-text-muted">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Subject",
      sortable: true,
      render: (item) => <p className={cn(item.isRead ? "text-text-muted" : "text-text-primary font-medium")}>{item.subject}</p>,
    },
    {
      key: "message",
      header: "Message",
      render: (item) => <p className="text-sm text-text-muted truncate max-w-[200px]">{item.message}</p>,
    },
    {
      key: "category",
      header: "Category",
      render: (item) => item.category ? <Badge variant="subtle" size="sm">{item.category}</Badge> : <span className="text-text-muted">-</span>,
      hideOnMobile: true,
    },
    {
      key: "createdAt",
      header: "Date",
      sortable: true,
      render: (item) => <span className="text-xs text-text-muted">{formatDateTime(new Date(item.createdAt))}</span>,
      hideOnMobile: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Contact Submissions</h1>
          <p className="text-sm text-text-muted mt-1">Manage contact form inquiries and feedback</p>
        </div>
        <Badge variant="warning" size="md" dot>{unread} unread</Badge>
      </div>

      <Card variant="elevated" padding="none">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(item) => item.id}
          onRowClick={(item) => setSelectedMessage(item)}
          searchable searchQuery={search} onSearch={setSearch}
          searchPlaceholder="Search by name, email, or subject..."
          selectable loading={loading} emptyMessage="No contact messages found"
          actions={(item) => (
            <div className="flex items-center gap-1">
              {!item.isRead && (
                <button onClick={() => markAsRead(item.id)} className="p-1.5 rounded-lg text-secondary hover:bg-secondary/10 transition-all">
                  <CheckCircle className="h-4 w-4" />
                </button>
              )}
              <button onClick={() => setSelectedMessage(item)} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-all">
                <Eye className="h-4 w-4" />
              </button>
            </div>
          )}
        />
      </Card>

      {selectedMessage && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedMessage(null)}>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-warm-white dark:bg-bg-secondary border border-border shadow-modal p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-text-primary">{selectedMessage.name}</h3>
                  <StatusBadge status={selectedMessage.isRead ? "READ" : "UNREAD"} variant="read" size="xs" />
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-text-muted">
                  <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{selectedMessage.email}</span>
                  {selectedMessage.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{selectedMessage.phone}</span>}
                </div>
                {selectedMessage.category && <Badge variant="subtle" size="sm" className="mt-2">{selectedMessage.category}</Badge>}
              </div>
              <button onClick={() => setSelectedMessage(null)} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-all">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-bg-secondary/50 border border-border/50 mb-4">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Subject</p>
              <p className="text-sm font-medium text-text-primary">{selectedMessage.subject}</p>
            </div>

            <div className="p-4 rounded-xl bg-bg-secondary/50 border border-border/50 mb-6">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Message</p>
              <p className="text-sm text-text-primary whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-text-muted">Received {formatDateTime(new Date(selectedMessage.createdAt))}</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" iconLeft={<Mail className="h-4 w-4" />}>Reply via Email</Button>
                {!selectedMessage.isRead && (
                  <Button variant="primary" size="sm" iconLeft={<CheckCircle className="h-4 w-4" />} onClick={() => { markAsRead(selectedMessage.id); setSelectedMessage(null) }}>
                    Mark as Read
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function cn(...inputs: unknown[]) { return inputs.filter(Boolean).join(" ") }
