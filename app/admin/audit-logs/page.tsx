"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Download, Filter, Calendar, User, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataTable, type Column } from "@/components/admin/data-table"
import { formatDateTime } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface AuditLog {
  id: string
  action: string
  entity: string
  entityId: string
  user: string
  userId: string
  metadata: string
  ipAddress: string
  createdAt: string
}

const sampleLogs: AuditLog[] = [
  { id: "log1", action: "CREATE", entity: "Booking", entityId: "SEVA-2026-0042", user: "Karthik Sharma", userId: "u1", metadata: "Created booking for Rudra Abhishekam", ipAddress: "192.168.1.100", createdAt: "2026-07-02T10:30:00Z" },
  { id: "log2", action: "UPDATE", entity: "Seva", entityId: "s1", user: "Priya Rao", userId: "u2", metadata: "Updated price for Rudra Abhishekam", ipAddress: "192.168.1.101", createdAt: "2026-07-02T09:15:00Z" },
  { id: "log3", action: "APPROVE", entity: "Booking", entityId: "SEVA-2026-0041", user: "Karthik Sharma", userId: "u1", metadata: "Approved booking for Ravi Kumar", ipAddress: "192.168.1.100", createdAt: "2026-07-01T14:20:00Z" },
  { id: "log4", action: "DELETE", entity: "Category", entityId: "cat_old", user: "Priya Rao", userId: "u2", metadata: "Deleted old category", ipAddress: "192.168.1.101", createdAt: "2026-07-01T11:00:00Z" },
  { id: "log5", action: "LOGIN", entity: "Session", entityId: "u3", user: "Suresh Bhat", userId: "u3", metadata: "User login", ipAddress: "192.168.1.200", createdAt: "2026-06-30T10:00:00Z" },
  { id: "log6", action: "CREATE", entity: "User", entityId: "u7", user: "Karthik Sharma", userId: "u1", metadata: "Created user Venkatesh Murthy", ipAddress: "192.168.1.100", createdAt: "2026-06-28T16:30:00Z" },
  { id: "log7", action: "UPDATE", entity: "Settings", entityId: "temple_name", user: "Priya Rao", userId: "u2", metadata: "Updated temple name", ipAddress: "192.168.1.101", createdAt: "2026-06-25T09:45:00Z" },
  { id: "log8", action: "PAYMENT", entity: "Payment", entityId: "pay_9xH8kM3n", user: "System", userId: "system", metadata: "Payment of ₹2500 received", ipAddress: "", createdAt: "2026-06-20T15:10:00Z" },
]

const actionColors: Record<string, string> = {
  CREATE: "emerald",
  UPDATE: "blue",
  DELETE: "red",
  APPROVE: "green",
  REJECT: "red",
  LOGIN: "gray",
  LOGOUT: "gray",
  PAYMENT: "purple",
}

export default function AuditLogsPage() {
  const [logs] = useState<AuditLog[]>(sampleLogs)
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState("")

  const filtered = logs.filter((log) => {
    const matchSearch = !search || log.user.toLowerCase().includes(search.toLowerCase()) || log.entity.toLowerCase().includes(search.toLowerCase()) || log.entityId.toLowerCase().includes(search.toLowerCase())
    const matchAction = !actionFilter || log.action === actionFilter
    return matchSearch && matchAction
  })

  const columns: Column<AuditLog>[] = [
    {
      key: "action",
      header: "Action",
      sortable: true,
      render: (item) => (
        <Badge variant={(actionColors[item.action] || "default") as any} size="sm">
          {item.action}
        </Badge>
      ),
    },
    {
      key: "entity",
      header: "Entity",
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-medium text-text-primary">{item.entity}</p>
          <p className="text-xs text-text-muted font-mono">{item.entityId}</p>
        </div>
      ),
    },
    {
      key: "user",
      header: "User",
      sortable: true,
      render: (item) => <span className="text-text-primary">{item.user}</span>,
    },
    {
      key: "metadata",
      header: "Description",
      render: (item) => <span className="text-text-muted text-sm">{item.metadata}</span>,
    },
    {
      key: "ipAddress",
      header: "IP",
      render: (item) => <span className="text-xs text-text-muted font-mono">{item.ipAddress || "-"}</span>,
      hideOnMobile: true,
    },
    {
      key: "createdAt",
      header: "Timestamp",
      sortable: true,
      render: (item) => (
        <span className="text-xs text-text-muted whitespace-nowrap">{formatDateTime(new Date(item.createdAt))}</span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Audit Logs</h1>
          <p className="text-sm text-text-muted mt-1">Track all admin actions and system events</p>
        </div>
        <Button variant="outline" size="sm" iconLeft={<Download className="h-4 w-4" />}>
          Export Logs
        </Button>
      </div>

      <Card variant="elevated" padding="none">
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(item) => item.id}
          searchable
          searchQuery={search}
          onSearch={setSearch}
          searchPlaceholder="Search by user, entity, or ID..."
          selectable
          emptyMessage="No audit logs found"
          filters={
            <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="h-9 px-3 text-sm rounded-lg border border-border bg-warm-white dark:bg-bg-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20">
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="APPROVE">Approve</option>
              <option value="REJECT">Reject</option>
              <option value="LOGIN">Login</option>
              <option value="PAYMENT">Payment</option>
            </select>
          }
        />
      </Card>
    </div>
  )
}
