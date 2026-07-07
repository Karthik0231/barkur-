"use client"

import { IndianRupee, Calendar, Clock, User, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingSummaryProps {
  sevaName: string
  date: string
  time: string
  quantity: number
  price: number
  className?: string
}

export function BookingSummary({ sevaName, date, time, quantity, price, className }: BookingSummaryProps) {
  const total = price * quantity
  const gst = Math.round(total * 0.18)
  const grandTotal = total + gst

  return (
    <div className={cn("sticky top-32", className)}>
      <div className="bg-warm-white rounded-2xl border border-gold-200/30 shadow-premium overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary-light px-5 py-4">
          <h3 className="text-warm-white font-heading font-bold text-sm">Booking Summary</h3>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Seva</p>
            <p className="text-sm font-semibold text-text-primary">{sevaName}</p>
          </div>
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
                <Clock className="h-3.5 w-3.5" />
                <span>Time</span>
              </div>
              <span className="font-medium text-text-primary">{time}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-text-muted">
                <User className="h-3.5 w-3.5" />
                <span>Quantity</span>
              </div>
              <span className="font-medium text-text-primary">{quantity}</span>
            </div>
          </div>
          <div className="h-px bg-border/50" />
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Price</span>
              <span className="text-text-primary">₹{price.toLocaleString("en-IN")}</span>
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
