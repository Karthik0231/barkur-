import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface TooltipProps {
  content: string
  children: ReactNode
  position?: "top" | "bottom" | "left" | "right"
  className?: string
}

export function Tooltip({ content, children, position = "top", className }: TooltipProps) {
  const positionStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }

  return (
    <div className="relative group inline-flex">
      {children}
      <div className={cn(
        "absolute z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap",
        "px-2.5 py-1.5 rounded-lg bg-dark-slate text-warm-white text-xs font-medium shadow-lg",
        positionStyles[position],
        className,
      )}>
        {content}
      </div>
    </div>
  )
}
