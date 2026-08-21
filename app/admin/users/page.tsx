"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Edit3, Trash2, Search, Shield, Ban, CheckCircle, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/admin/status-badge"
import { DataTable, type Column } from "@/components/admin/data-table"
import { formatDateTime } from "@/lib/utils"
import toast from "react-hot-toast"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@/lib/zod-resolver"
import { z } from "zod"

interface AdminUser {
  id: string
  name: string
  email: string
  phone: string
  role: string
  isActive: boolean
  lastLogin: string | null
  createdAt: string
}

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Valid email required"),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, "Valid phone required"),
  role: z.string().min(1, "Role is required"),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
})



const ROLES = ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER", "ACCOUNTANT", "RECEPTION", "VOLUNTEER"]



export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<AdminUser | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/users").then((r) => r.json()).then((json) => {
      setUsers(Array.isArray(json) ? json : (json.data?.users ?? []))
    }).finally(() => setLoading(false))
  }, [])

  const { register, handleSubmit, reset, formState: { errors } } = useForm<any>({
    resolver: zodResolver(userSchema),
  })

  const openCreate = () => {
    setEditing(null)
    reset({ name: "", email: "", phone: "", role: "VOLUNTEER", password: "" })
    setDialogOpen(true)
  }

  const openEdit = (user: AdminUser) => {
    setEditing(user)
    reset({ name: user.name, email: user.email, phone: user.phone, role: user.role, password: "" })
    setDialogOpen(true)
  }

  const onSubmit = async (data: any) => {
    try {
      if (editing) {
        const { password, ...rest } = data
        const body = password ? data : rest
        await fetch(`/api/users/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        setUsers((prev) => prev.map((u) => u.id === editing.id ? { ...u, ...body } : u))
        toast.success("User updated")
      } else {
        const res = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
        const created = await res.json()
        setUsers((prev) => [...prev, created.data ?? created])
        toast.success("User created")
      }
      setDialogOpen(false)
      setEditing(null)
    } catch { toast.error("Operation failed") }
  }

  const toggleActive = async (id: string) => {
    const user = users.find((u) => u.id === id)
    if (!user) return
    try {
      await fetch(`/api/users/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !user.isActive }) })
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, isActive: !u.isActive } : u))
      toast.success(`User ${user.isActive ? "deactivated" : "activated"}`)
    } catch { toast.error("Failed to toggle status") }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await fetch(`/api/users/${deleteId}`, { method: "DELETE" })
      setUsers((prev) => prev.filter((u) => u.id !== deleteId))
      toast.success("User deleted")
      setDeleteId(null)
    } catch { toast.error("Delete failed") }
  }

  const filtered = users.filter((u) => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  const columns: Column<AdminUser>[] = [
    {
      key: "name",
      header: "User",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-xs font-bold">
            {item.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-text-primary">{item.name}</p>
            <p className="text-xs text-text-muted">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      render: (item) => (
        <Badge variant={item.role === "SUPER_ADMIN" ? "primary" : item.role === "ADMIN" ? "secondary" : "subtle"} size="sm">
          {item.role.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      render: (item) => <span className="text-text-muted">{item.phone}</span>,
      hideOnMobile: true,
    },
    {
      key: "isActive",
      header: "Status",
      sortable: true,
      render: (item) => <StatusBadge status={item.isActive ? "ACTIVE" : "INACTIVE"} size="sm" />,
    },
    {
      key: "lastLogin",
      header: "Last Login",
      sortable: true,
      render: (item) => <span className="text-text-muted text-xs">{item.lastLogin ? formatDateTime(new Date(item.lastLogin)) : "Never"}</span>,
      hideOnMobile: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Users</h1>
          <p className="text-sm text-text-muted mt-1">Manage admin users, roles, and permissions</p>
        </div>
        <Button variant="primary" size="sm" iconLeft={<Plus className="h-4 w-4" />} onClick={openCreate}>
          Add User
        </Button>
      </div>

      <Card variant="elevated" padding="none">
        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          keyExtractor={(item) => item.id}
          searchable
          searchQuery={search}
          onSearch={setSearch}
          searchPlaceholder="Search users by name or email..."
          selectable
          emptyMessage="No users found"
          actions={(item) => (
            <div className="flex items-center justify-end gap-1">
              <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-text-muted hover:text-secondary hover:bg-secondary/10 transition-all">
                <Edit3 className="h-4 w-4" />
              </button>
              <button onClick={() => toggleActive(item.id)} className="p-1.5 rounded-lg text-text-muted hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all">
                {item.isActive ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              </button>
              <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        />
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit User" : "Create User"}</DialogTitle>
            <DialogDescription>{editing ? "Update user details and role" : "Add a new admin user"}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input variant="filled" label="Full Name *" placeholder="John Doe" error={errors.name?.message as string} {...register("name")} />
              <Input variant="filled" label="Email *" type="email" placeholder="john@temple.org" error={errors.email?.message as string} {...register("email")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input variant="filled" label="Phone *" placeholder="+91 98765 43210" error={errors.phone?.message as string} {...register("phone")} />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-primary uppercase tracking-wider">Role *</label>
                <select {...register("role")} className="h-11 rounded-xl border-transparent bg-bg-secondary px-4 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all cursor-pointer">
                  {ROLES.map((r) => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
                </select>
              </div>
            </div>
            <Input variant="filled" label={editing ? "New Password (leave blank to keep)" : "Password *"} type="password" placeholder="Min 8 characters" error={errors.password?.message as string} {...register("password")} />
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" size="sm" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" size="sm">{editing ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
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




