"use client"

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export interface Tab {
  id: string
  label: string
  icon?: ReactNode
  content: ReactNode
  disabled?: boolean
  badge?: ReactNode
}

export interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  onChange?: (id: string) => void
  className?: string
  variant?: "underline" | "pills" | "cards"
  /** Animate content transitions between tabs */
  animated?: boolean
}

export function Tabs({
  tabs,
  defaultTab,
  onChange,
  className,
  variant = "underline",
  animated = true,
}: TabsProps) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const enabledTabs = tabs.filter((t) => !t.disabled)

  const handleSelect = (id: string) => {
    setActive(id)
    onChange?.(id)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null
    if (e.key === "ArrowRight" || e.key === "ArrowDown") nextIndex = (index + 1) % tabs.length
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length
    else if (e.key === "Home") nextIndex = 0
    else if (e.key === "End") nextIndex = tabs.length - 1

    if (nextIndex === null) return
    e.preventDefault()

    // skip disabled tabs
    let attempts = 0
    while (tabs[nextIndex]?.disabled && attempts < tabs.length) {
      nextIndex = (nextIndex + 1) % tabs.length
      attempts++
    }
    const nextTab = tabs[nextIndex]
    if (nextTab && !nextTab.disabled) {
      tabRefs.current[nextTab.id]?.focus()
      handleSelect(nextTab.id)
    }
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        className={cn(
          "flex gap-1 overflow-x-auto scrollbar-none -mx-1 px-1",
          variant === "underline" ? "border-b border-border" : "",
        )}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el
            }}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onClick={() => handleSelect(tab.id)}
            disabled={tab.disabled}
            className={cn(
              "relative flex shrink-0 items-center gap-2 px-3.5 sm:px-4 py-2.5 text-sm font-medium transition-colors duration-200 whitespace-nowrap",
              variant === "underline" && "-mb-px",
              variant === "pills" && "rounded-lg",
              variant === "cards" && "rounded-t-xl border border-border border-b-0 bg-bg-secondary/50",
              active === tab.id
                ? variant === "underline"
                  ? "text-primary"
                  : variant === "pills"
                    ? "text-warm-white"
                    : "bg-warm-white text-primary"
                : "text-text-muted hover:text-text-primary hover:bg-bg-secondary/50",
              tab.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-text-muted",
            )}
          >
            {variant === "pills" && active === tab.id && (
              <motion.span
                layoutId="tabs-pill-bg"
                className="absolute inset-0 bg-primary rounded-lg shadow-md -z-10"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            {tab.icon}
            {tab.label}
            {tab.badge}
            {variant === "underline" && active === tab.id && (
              <motion.span
                layoutId="tabs-underline"
                className="absolute left-0 right-0 -bottom-px h-0.5 bg-primary rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {animated ? (
          <AnimatePresence mode="wait">
            {tabs
              .filter((t) => t.id === active)
              .map((tab) => (
                <motion.div
                  key={tab.id}
                  id={`tabpanel-${tab.id}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${tab.id}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  {tab.content}
                </motion.div>
              ))}
          </AnimatePresence>
        ) : (
          <div id={`tabpanel-${active}`} role="tabpanel" aria-labelledby={`tab-${active}`}>
            {tabs.find((t) => t.id === active)?.content}
          </div>
        )}
      </div>
    </div>
  )
}
