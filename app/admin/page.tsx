"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  CalendarCheck,
  IndianRupee,
  Flower2,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  ArrowRight,
  Calendar,
  Bell,
  Activity,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { StatsCard } from "@/components/admin/stats-card"
import { StatusBadge } from "@/components/admin/status-badge"
import toast from "react-hot-toast"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const quickActions = [
  { label: "New Seva", href: "/admin/sevas/new", icon: Plus, color: "bg-primary text-warm-white" },
  { label: "New User", href: "/admin/users", icon: Users, color: "bg-secondary text-dark-slate" },
  { label: "Add Category", href: "/admin/categories", icon: Flower2, color: "bg-emerald-500 text-white" },
  { label: "View Donations", href: "/admin/donations", icon: IndianRupee, color: "bg-amber-500 text-white" },
]

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalBookings: 0, revenue: 0, activeSevas: 0, pendingApprovalsCount: 0, todayVisitors: 0 })
  const [revenueData, setRevenueData] = useState<{ day: string; revenue: number; bookings: number }[]>([])
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [upcomingFestivals, setUpcomingFestivals] = useState<any[]>([])
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([])

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    ;(async () => {
      try {
        const [statsRes, bookingsRes, festivalsRes, pendingRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/bookings?limit=5"),
          fetch("/api/festivals?upcoming=true"),
          fetch("/api/bookings?status=PENDING"),
        ])

        const sj = await statsRes.json()
        const s = sj.data || sj
        setStats({
          totalBookings: s.totalBookings ?? 0,
          revenue: s.revenue ?? 0,
          activeSevas: s.activeSevas ?? 0,
          pendingApprovalsCount: s.pendingApprovalsCount ?? s.pendingApprovals ?? 0,
          todayVisitors: s.todayVisitors ?? 0,
        })
        if (s.revenueChart) setRevenueData(s.revenueChart)

        const bj = await bookingsRes.json()
        const bd = bj.data || bj
        setRecentBookings(Array.isArray(bd) ? bd : bd.bookings || [])

        const fj = await festivalsRes.json()
        const fd = fj.data || fj
        setUpcomingFestivals(Array.isArray(fd) ? fd : fd.festivals || [])

        const pj = await pendingRes.json()
        const pd = pj.data || pj
        setPendingApprovals(Array.isArray(pd) ? pd : pd.bookings || [])
      } catch {
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">
            Dashboard
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Welcome back! Here is your temple overview for today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" iconLeft={<Calendar className="h-4 w-4" />}>
            Jul 2, 2026
          </Button>
          <Button variant="primary" size="sm" iconLeft={<Bell className="h-4 w-4" />}>
            Notifications
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatsCard
          label="Total Bookings"
          value={stats.totalBookings.toLocaleString("en-IN")}
          icon={<CalendarCheck className="h-5 w-5" />}
          trend={{ value: 12.5, isPositive: true, label: "vs last month" }}
        />
        <StatsCard
          label="Revenue (₹)"
          value={stats.revenue.toLocaleString("en-IN")}
          icon={<IndianRupee className="h-5 w-5" />}
          trend={{ value: 8.2, isPositive: true, label: "vs last month" }}
          variant="primary"
        />
        <StatsCard
          label="Active Sevas"
          value={String(stats.activeSevas)}
          icon={<Flower2 className="h-5 w-5" />}
          trend={{ value: 4, isPositive: true, label: "this month" }}
          variant="success"
        />
        <StatsCard
          label="Pending Approvals"
          value={String(stats.pendingApprovalsCount)}
          icon={<Clock className="h-5 w-5" />}
          trend={{ value: 2, isPositive: false, label: "overdue" }}
          variant="warning"
        />
        <StatsCard
          label="Today's Visitors"
          value={String(stats.todayVisitors)}
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 23, isPositive: true, label: "vs yesterday" }}
          variant="default"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold font-heading text-text-primary">
                Revenue Overview
              </h3>
              <p className="text-sm text-text-muted">Last 7 days</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-secondary" />
                <span className="text-text-muted">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm bg-secondary/30" />
                <span className="text-text-muted">Bookings</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "var(--color-warm-white)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey="revenue" fill="var(--color-secondary)" radius={[6, 6, 0, 0]} maxBarSize={40} />
              <Bar dataKey="bookings" fill="var(--color-secondary)" fillOpacity={0.2} radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold font-heading text-text-primary">
              Quick Actions
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-border hover:border-secondary/30 hover:bg-bg-secondary/50 transition-all text-center"
              >
                <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center", action.color)}>
                  <action.icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-text-primary">{action.label}</span>
              </Link>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-secondary" />
              Upcoming Festivals
            </h3>
            <div className="space-y-3">
              {upcomingFestivals.map((festival) => (
                <div
                  key={festival.name}
                  className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-text-primary">{festival.name}</p>
                    <p className="text-xs text-text-muted">{festival.date}</p>
                  </div>
                  <Badge variant="primary" size="xs">
                    {festival.daysLeft}d
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold font-heading text-text-primary">
              Recent Bookings
            </h3>
            <Link
              href="/admin/bookings"
              className="text-sm text-secondary hover:text-secondary-light font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-text-muted uppercase tracking-wider">
                  <th className="pb-2 font-semibold">Booking ID</th>
                  <th className="pb-2 font-semibold">Devotee</th>
                  <th className="pb-2 font-semibold hidden md:table-cell">Seva</th>
                  <th className="pb-2 font-semibold hidden sm:table-cell">Date</th>
                  <th className="pb-2 font-semibold text-right">Amount</th>
                  <th className="pb-2 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-bg-secondary/50 transition-colors">
                    <td className="py-3 pr-4 font-medium text-text-primary">{booking.id}</td>
                    <td className="py-3 pr-4 text-text-primary">{booking.devotee}</td>
                    <td className="py-3 pr-4 text-text-muted hidden md:table-cell">{booking.seva}</td>
                    <td className="py-3 pr-4 text-text-muted hidden sm:table-cell">{booking.date}</td>
                    <td className="py-3 pr-4 text-right font-medium text-text-primary">₹{booking.amount.toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <StatusBadge status={booking.status} size="xs" />
                        <StatusBadge status={booking.payment} variant="payment" size="xs" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold font-heading text-text-primary">
              Pending Approvals
            </h3>
            <Badge variant="warning" size="sm" dot>
              {pendingApprovals.length} pending
            </Badge>
          </div>
          <div className="space-y-3">
            {pendingApprovals.map((approval) => (
              <div
                key={approval.id}
                className="flex items-start justify-between p-3 rounded-xl bg-bg-secondary/50 border border-border/50"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">{approval.id}</span>
                    <Badge variant="warning" size="xs">{approval.requestedBy}</Badge>
                  </div>
                  <p className="text-sm text-text-muted mt-0.5">{approval.devotee} - {approval.seva}</p>
                  <p className="text-xs text-text-muted/60 mt-0.5">{approval.date}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all">
                    <CheckCircle className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                    <XCircle className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-all">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}


