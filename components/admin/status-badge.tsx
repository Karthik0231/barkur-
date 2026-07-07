"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export type StatusType =
  | "PENDING"
  | "CONFIRMED"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "ACTIVE"
  | "INACTIVE"
  | "DRAFT"
  | "PUBLISHED"
  | "ARCHIVED"
  | "LOW"
  | "NORMAL"
  | "HIGH"
  | "URGENT"
  | "READ"
  | "UNREAD"
  | "RESOLVED"
  | "OPEN"

export interface StatusBadgeProps {
  status: StatusType | string
  variant?: "booking" | "payment" | "approval" | "active" | "priority" | "read" | "default"
  size?: "xs" | "sm" | "md" | "lg"
  dot?: boolean
  pulsate?: boolean
  className?: string
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  // Booking
  PENDING: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-800 dark:text-amber-400", dot: "bg-amber-500" },
  CONFIRMED: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-800 dark:text-blue-400", dot: "bg-blue-500" },
  CANCELLED: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-800 dark:text-red-400", dot: "bg-red-500" },
  COMPLETED: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-800 dark:text-emerald-400", dot: "bg-emerald-500" },
  // Approval
  APPROVED: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-800 dark:text-emerald-400", dot: "bg-emerald-500" },
  REJECTED: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-800 dark:text-red-400", dot: "bg-red-500" },
  // Payment
  PAID: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-800 dark:text-emerald-400", dot: "bg-emerald-500" },
  FAILED: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-800 dark:text-red-400", dot: "bg-red-500" },
  REFUNDED: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-800 dark:text-purple-400", dot: "bg-purple-500" },
  // Status
  ACTIVE: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-800 dark:text-emerald-400", dot: "bg-emerald-500" },
  INACTIVE: { bg: "bg-gray-100 dark:bg-gray-800/40", text: "text-gray-600 dark:text-gray-400", dot: "bg-gray-400" },
  DRAFT: { bg: "bg-gray-100 dark:bg-gray-800/40", text: "text-gray-600 dark:text-gray-400", dot: "bg-gray-400" },
  PUBLISHED: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-800 dark:text-emerald-400", dot: "bg-emerald-500" },
  ARCHIVED: { bg: "bg-gray-100 dark:bg-gray-800/40", text: "text-gray-600 dark:text-gray-400", dot: "bg-gray-400" },
  // Priority
  LOW: { bg: "bg-gray-100 dark:bg-gray-800/40", text: "text-gray-600 dark:text-gray-400", dot: "bg-gray-400" },
  NORMAL: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-800 dark:text-blue-400", dot: "bg-blue-500" },
  HIGH: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-800 dark:text-orange-400", dot: "bg-orange-500" },
  URGENT: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-800 dark:text-red-400", dot: "bg-red-500" },
  // Read
  READ: { bg: "bg-gray-100 dark:bg-gray-800/40", text: "text-gray-600 dark:text-gray-400", dot: "bg-gray-400" },
  UNREAD: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-800 dark:text-blue-400", dot: "bg-blue-500" },
  RESOLVED: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-800 dark:text-emerald-400", dot: "bg-emerald-500" },
  OPEN: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-800 dark:text-amber-400", dot: "bg-amber-500" },
}

const sizeStyles = {
  xs: "text-[9px] px-1 py-0.5 gap-0.5",
  sm: "text-[10px] px-1.5 py-0.5 gap-1",
  md: "text-xs px-2 py-1 gap-1.5",
  lg: "text-sm px-2.5 py-1.5 gap-1.5",
}

export function StatusBadge({
  status,
  variant = "default",
  size = "sm",
  dot = true,
  pulsate = false,
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.PENDING

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex items-center font-medium rounded-full whitespace-nowrap",
        config.bg,
        config.text,
        sizeStyles[size],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            config.dot,
            pulsate && "animate-pulse",
          )}
        />
      )}
      {status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, " ")}
    </motion.span>
  )
}
