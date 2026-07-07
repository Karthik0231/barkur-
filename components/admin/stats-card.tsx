"use client"

import { type ReactNode } from "react"
import { motion } from "framer-motion"
import { cn, formatPrice } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

export interface StatsCardProps {
  label: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    isPositive: boolean
    label?: string
  }
  prefix?: string
  suffix?: string
  variant?: "default" | "primary" | "success" | "warning" | "destructive"
  onClick?: () => void
  className?: string
  loading?: boolean
}

const variantStyles = {
  default:
    "bg-warm-white dark:bg-bg-secondary border border-border",
  primary:
    "bg-primary text-warm-white border border-primary/20",
  success:
    "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30",
  warning:
    "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30",
  destructive:
    "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30",
}

const iconVariantStyles = {
  default:
    "bg-secondary/10 text-secondary",
  primary:
    "bg-warm-white/20 text-warm-white",
  success:
    "bg-emerald-100 dark:bg-emerald-800/30 text-emerald-600 dark:text-emerald-400",
  warning:
    "bg-amber-100 dark:bg-amber-800/30 text-amber-600 dark:text-amber-400",
  destructive:
    "bg-red-100 dark:bg-red-800/30 text-red-600 dark:text-red-400",
}

export function StatsCard({
  label,
  value,
  icon,
  trend,
  prefix,
  suffix,
  variant = "default",
  onClick,
  className,
  loading = false,
}: StatsCardProps) {
  if (loading) {
    return (
      <div
        className={cn(
          "rounded-xl p-5 border",
          variantStyles[variant],
          className,
        )}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-4 shimmer-skeleton rounded w-24" />
            <div className="h-8 shimmer-skeleton rounded w-32" />
          </div>
          <div className="h-10 w-10 shimmer-skeleton rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={onClick ? { scale: 1.02, y: -2 } : undefined}
      onClick={onClick}
      className={cn(
        "rounded-xl p-5 transition-all duration-300",
        variantStyles[variant],
        onClick && "cursor-pointer hover:shadow-elevated",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1 min-w-0">
          <p
            className={cn(
              "text-sm font-medium truncate",
              variant === "default"
                ? "text-text-muted"
                : "text-warm-white/80",
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              "text-2xl font-bold font-heading tracking-tight",
              variant === "default"
                ? "text-text-primary"
                : "text-warm-white",
            )}
          >
            {prefix}
            {value}
            {suffix}
          </p>
          {trend && (
            <div className="flex items-center gap-1.5 pt-1">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 text-xs font-medium",
                  trend.isPositive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400",
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(trend.value)}%
              </span>
              {trend.label && (
                <span
                  className={cn(
                    "text-xs",
                    variant === "default"
                      ? "text-text-muted"
                      : "text-warm-white/60",
                  )}
                >
                  {trend.label}
                </span>
              )}
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center",
            iconVariantStyles[variant],
          )}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  )
}
