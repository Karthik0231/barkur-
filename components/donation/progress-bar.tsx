"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  raised: number
  goal: number
  className?: string
  size?: "sm" | "md" | "lg"
  showLabels?: boolean
  animated?: boolean
}

export function ProgressBar({
  raised,
  goal,
  className,
  size = "md",
  showLabels = true,
  animated = true,
}: ProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })
  const [width, setWidth] = useState(0)
  const percentage = Math.min(Math.round((raised / goal) * 100), 100)

  useEffect(() => {
    if (animated && isInView) {
      const timer = setTimeout(() => setWidth(percentage), 100)
      return () => clearTimeout(timer)
    }
    if (!animated) setWidth(percentage)
  }, [animated, isInView, percentage])

  const heightMap = { sm: "h-2", md: "h-3", lg: "h-4" }

  return (
    <div ref={ref} className={cn("w-full", className)}>
      {showLabels && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs sm:text-sm font-medium text-text-secondary">
            Raised: <span className="text-primary font-semibold">₹{raised.toLocaleString("en-IN")}</span>
          </span>
          <span className="text-xs sm:text-sm font-medium text-text-secondary">
            Goal: <span className="text-text-primary font-semibold">₹{goal.toLocaleString("en-IN")}</span>
          </span>
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full bg-bg-tertiary overflow-hidden",
          heightMap[size],
        )}
      >
        <motion.div
          className={cn(
            "h-full rounded-full bg-gradient-to-r from-primary to-secondary",
            "relative overflow-hidden",
          )}
          initial={{ width: 0 }}
          animate={isInView || !animated ? { width: `${width}%` } : { width: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </motion.div>
      </div>
      {showLabels && (
        <div className="flex justify-end mt-1">
          <span className="text-xs font-bold text-primary">{percentage}%</span>
        </div>
      )}
    </div>
  )
}
