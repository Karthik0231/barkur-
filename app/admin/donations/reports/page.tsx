"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Download, TrendingUp, Calendar, IndianRupee, PieChart as PieChartIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { StatsCard } from "@/components/admin/stats-card"
import { formatPrice } from "@/lib/utils"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts"

const COLORS = ["#D4A843", "#7B1A2C", "#C4A882", "#2D2D2D", "#4A90D9"]

export default function DonationReportsPage() {
  const [monthlyData, setMonthlyData] = useState<{ month: string; amount: number; count: number }[]>([])
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/donations/reports")
      .then((r) => r.json())
      .then((d) => {
        const data = d.data || d
        setMonthlyData(data.monthly || data.monthlyData || [])
        setCategoryData(data.categories || data.categoryData || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const totalRaised = monthlyData.reduce((s, m) => s + m.amount, 0)
  const totalDonations = monthlyData.reduce((s, m) => s + m.count, 0)
  const avgDonation = totalDonations > 0 ? Math.round(totalRaised / totalDonations) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Donation Reports</h1>
          <p className="text-sm text-text-muted mt-1">Analytics and insights for donation activities</p>
        </div>
        <Button variant="primary" size="sm" iconLeft={<Download className="h-4 w-4" />}>
          Download Report
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total Raised (YTD)" value={formatPrice(totalRaised)} icon={<IndianRupee className="h-5 w-5" />} variant="primary" trend={{ value: 28, isPositive: true, label: "vs last year" }} />
        <StatsCard label="Total Donations" value={totalDonations} icon={<TrendingUp className="h-5 w-5" />} variant="success" />
        <StatsCard label="Avg Donation" value={formatPrice(avgDonation)} icon={<IndianRupee className="h-5 w-5" />} />
        <StatsCard label="This Month" value={formatPrice(monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].amount : 0)} icon={<Calendar className="h-5 w-5" />} variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold font-heading text-text-primary mb-6">Monthly Donations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--color-text-muted)", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "var(--color-warm-white)", border: "1px solid var(--color-border)", borderRadius: "12px" }} formatter={((val: number) => [formatPrice(val), "Amount"]) as any} />
              <Bar dataKey="amount" fill="var(--color-secondary)" radius={[6, 6, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold font-heading text-text-primary mb-6">Donations by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4} dataKey="value" label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {categoryData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold font-heading text-text-primary mb-4">Monthly Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-text-muted uppercase tracking-wider">
                <th className="pb-3 font-semibold">Month</th>
                <th className="pb-3 font-semibold text-right">Donations</th>
                <th className="pb-3 font-semibold text-right">Amount</th>
                <th className="pb-3 font-semibold text-right">Avg Donation</th>
                <th className="pb-3 font-semibold text-right">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {monthlyData.map((m, i) => {
                const growth = i > 0 ? ((m.amount - monthlyData[i - 1].amount) / monthlyData[i - 1].amount * 100).toFixed(1) : null
                return (
                  <tr key={m.month} className="hover:bg-bg-secondary/50 transition-colors">
                    <td className="py-3 font-medium text-text-primary">{m.month}</td>
                    <td className="py-3 text-right text-text-primary">{m.count}</td>
                    <td className="py-3 text-right font-medium text-text-primary">{formatPrice(m.amount)}</td>
                    <td className="py-3 text-right text-text-muted">{formatPrice(Math.round(m.amount / m.count))}</td>
                    <td className="py-3 text-right">
                      {growth && (
                        <span className={cn("text-xs font-medium", Number(growth) >= 0 ? "text-emerald-600" : "text-red-600")}>
                          {Number(growth) >= 0 ? "+" : ""}{growth}%
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function cn(...inputs: unknown[]) {
  return inputs.filter(Boolean).join(" ")
}
