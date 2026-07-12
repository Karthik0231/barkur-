"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface TooltipProps {
  content: string
  children: ReactNode
  position?: "top" | "bottom" | "left" | "right"
  className?: string
  /** ms before the tooltip appears on hover/focus */
  delay?: number
  disabled?: boolean
}

const positionStyles = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
}

const arrowPositionStyles = {
  top: "top-full left-1/2 -translate-x-1/2 -mt-[3px] rotate-45",
  bottom: "bottom-full left-1/2 -translate-x-1/2 -mb-[3px] rotate-45",
  left: "left-full top-1/2 -translate-y-1/2 -ml-[3px] rotate-45",
  right: "right-full top-1/2 -translate-y-1/2 -mr-[3px] rotate-45",
}

const motionOffset = {
  top: { y: 4 },
  bottom: { y: -4 },
  left: { x: 4 },
  right: { x: -4 },
}

export function Tooltip({
  content,
  children,
  position = "top",
  className,
  delay = 200,
  disabled = false,
}: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    if (disabled) return
    timeoutRef.current = setTimeout(() => setVisible(true), delay)
  }
  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setVisible(false)
  }

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }, [])

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onTouchStart={() => setVisible((v) => !v)}
    >
      {children}
      <AnimatePresence>
        {visible && content && (
          <motion.div
            role="tooltip"
            initial={{ opacity: 0, ...motionOffset[position] }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, ...motionOffset[position] }}
            transition={{ duration: 0.12 }}
            className={cn(
              "absolute z-50 pointer-events-none max-w-[min(16rem,80vw)] text-center",
              "px-2.5 py-1.5 rounded-lg bg-dark-slate text-warm-white text-xs font-medium shadow-lg",
              positionStyles[position],
              className,
            )}
          >
            {content}
            <span
              className={cn("absolute h-1.5 w-1.5 bg-dark-slate", arrowPositionStyles[position])}
              aria-hidden="true"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
