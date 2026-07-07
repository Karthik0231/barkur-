import { forwardRef, type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "card" | "circle"
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "shimmer-skeleton",
          variant === "circle" ? "rounded-full" : "rounded-lg",
          className,
        )}
        aria-hidden="true"
        {...props}
      />
    )
  },
)

Skeleton.displayName = "Skeleton"

export function TextSkeleton({
  lines = 3,
  className,
  lastLineWidth = "w-3/4",
}: {
  lines?: number
  className?: string
  lastLineWidth?: string
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i === lines - 1 ? lastLineWidth : "w-full")}
        />
      ))}
    </div>
  )
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-warm-white dark:bg-bg-secondary p-6 shadow-card",
        className,
      )}
      aria-hidden="true"
    >
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="circle" className="h-12 w-12" />
        <div className="flex-1">
          <Skeleton className="h-5 w-1/2 mb-2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <TextSkeleton lines={3} />
      <div className="flex gap-3 mt-5 pt-4 border-t border-border">
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  )
}

export function TableSkeleton({
  rows = 5,
  cols = 4,
  className,
}: {
  rows?: number
  cols?: number
  className?: string
}) {
  return (
    <div className={cn("flex flex-col", className)} aria-hidden="true">
      <div className="flex gap-4 p-4 border-b border-border bg-bg-secondary/50">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-5 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex gap-4 p-4 border-b border-border/50"
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={cn(
                "h-4 flex-1",
                colIndex === 0 && "w-1/4 flex-[0.25]",
                colIndex === cols - 1 && "w-1/6 flex-[0.15]",
              )}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function PageSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("max-w-4xl mx-auto p-8", className)} aria-hidden="true">
      <Skeleton className="h-10 w-1/2 mb-2" />
      <Skeleton className="h-5 w-2/3 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  )
}
