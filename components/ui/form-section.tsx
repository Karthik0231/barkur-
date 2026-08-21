"use client"

import { forwardRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Info } from "lucide-react"
import { Tooltip } from "@/components/ui/tooltip"

export interface FormSectionProps {
  title: string
  description?: string
  tooltip?: string
  icon?: ReactNode
  children: ReactNode
  className?: string
  /** Add a subtle divider above this section when true (for stacked sections) */
  divider?: boolean
  /** Compact mode reduces padding */
  compact?: boolean
}

export function FormSection({
  title,
  description,
  tooltip,
  icon,
  children,
  className,
  divider = false,
  compact = false,
}: FormSectionProps) {
  return (
    <div
      className={cn(
        divider && "pt-6 border-t border-border",
        compact ? "pb-2" : "pb-1",
        className
      )}
    >
      <div className="flex items-start gap-3 mb-4">
        {icon && (
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
            {tooltip && (
              <Tooltip content={tooltip} position="top">
                <button
                  type="button"
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </Tooltip>
            )}
          </div>
          {description && (
            <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

export interface FormGridProps {
  children: ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

const gridCols = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
}

export function FormGrid({
  children,
  columns = 2,
  className,
}: FormGridProps) {
  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {children}
    </div>
  )
}
