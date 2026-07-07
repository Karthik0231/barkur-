"use client"

import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

export interface Tab {
  id: string
  label: string
  icon?: ReactNode
  content: ReactNode
  disabled?: boolean
}

export interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  onChange?: (id: string) => void
  className?: string
  variant?: "underline" | "pills" | "cards"
}

export function Tabs({ tabs, defaultTab, onChange, className, variant = "underline" }: TabsProps) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id)

  const handleClick = (id: string) => {
    setActive(id)
    onChange?.(id)
  }

  return (
    <div className={className}>
      <div className={cn("flex gap-1", variant === "underline" ? "border-b border-border" : "")}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleClick(tab.id)}
            disabled={tab.disabled}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200",
              variant === "underline" && "border-b-2 border-transparent -mb-px",
              variant === "pills" && "rounded-lg",
              variant === "cards" && "rounded-t-xl border border-border border-b-0 bg-bg-secondary/50",
              active === tab.id
                ? variant === "underline"
                  ? "text-primary border-primary"
                  : variant === "pills"
                    ? "bg-primary text-warm-white shadow-md"
                    : "bg-warm-white text-primary"
                : "text-text-muted hover:text-text-primary hover:bg-bg-secondary/50",
              tab.disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.find((t) => t.id === active)?.content}
      </div>
    </div>
  )
}
