"use client"

import { IndianRupee, Calendar, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface SummaryItem {
  sevaName: string
  quantity: number
  price: number
  devoteeName?: string
}

interface BookingSummaryProps {
  items?: SummaryItem[]
  sevaName?: string
  date: string
  quantity?: number
  price?: number
  className?: string
}

export function BookingSummary({ items, sevaName, date, quantity, price, className }: BookingSummaryProps) {
  const displayItems: SummaryItem[] = items && items.length > 0
    ? items
    : sevaName !== undefined && quantity !== undefined && price !== undefined
      ? [{ sevaName, quantity, price }]
      : []

  const total = displayItems.reduce((s, i) => s + i.price * i.quantity, 0)
  const gst = Math.round(total * 0.18)
  const grandTotal = total + gst
  const totalQty = displayItems.reduce((s, i) => s + i.quantity, 0)

  return (
    <div className={cn("sticky top-32", className)}>
      <div className="bg-warm-white rounded-2xl border border-gold-200/30 shadow-premium overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary-light px-5 py-4">
          <h3 className="text-warm-white font-heading font-bold text-sm">Booking Summary</h3>
        </div>
        <div className="p-5 space-y-4">
          {displayItems.length > 0 && (
            <div className="space-y-3">
              {displayItems.map((it, idx) => (
                <div key={idx} className={cn(idx > 0 && "pt-3 border-t border-border/50")}>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Seva {idx + 1}</p>
                  <p className="text-sm font-semibold text-text-primary">{it.sevaName}</p>
                  {it.devoteeName && (
                    <p className="text-xs text-text-secondary mt-0.5">Devotee: {it.devoteeName}</p>
                  )}
                  <div className="flex items-center justify-between mt-1.5 text-xs text-text-muted">
                    <span>Qty {it.quantity} × ₹{it.price.toLocaleString("en-IN")}</span>
                    <span className="font-semibold text-text-primary">₹{(it.price * it.quantity).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="h-px bg-border/50" />
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-text-muted">
                <Calendar className="h-3.5 w-3.5" />
                <span>Date</span>
              </div>
              <span className="font-medium text-text-primary">{date}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-text-muted">
                <User className="h-3.5 w-3.5" />
                <span>Total Quantity</span>
              </div>
              <span className="font-medium text-text-primary">{totalQty}</span>
            </div>
          </div>
          <div className="h-px bg-border/50" />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Subtotal</span>
              <span className="text-text-primary">₹{total.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">GST (18%)</span>
              <span className="text-text-primary">₹{gst.toLocaleString("en-IN")}</span>
            </div>
            <div className="h-px bg-border/50" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-text-primary">Total</span>
              <span className="text-lg font-bold text-primary">₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
