"use client"

import { type ReactNode, type HTMLAttributes, type ButtonHTMLAttributes } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export interface DialogProps {
  open: boolean
  onClose?: () => void
  onOpenChange?: (open: boolean) => void
  children: ReactNode
  className?: string
}

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
}

export function Dialog({ open, onClose, onOpenChange, children, className }: DialogProps) {
  const handleClose = () => {
    onClose?.()
    onOpenChange?.(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "relative w-full bg-warm-white rounded-2xl shadow-2xl border border-border overflow-hidden",
              className,
            )}
            role="dialog"
            aria-modal="true"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function DialogTrigger({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn("", className)} {...props}>
      {children}
    </button>
  )
}

export function DialogClose({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn("", className)} {...props}>
      {children}
    </button>
  )
}

export function DialogContent({ children, className, size = "md", ...props }: HTMLAttributes<HTMLDivElement> & { size?: "sm" | "md" | "lg" | "xl" | "full" }) {
  return (
    <div className={cn(sizeStyles[size], className)} {...props}>
      {children}
    </div>
  )
}

export function DialogHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      {children}
    </div>
  )
}

export function DialogTitle({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-lg font-heading font-bold text-text-primary", className)} {...props}>
      {children}
    </h2>
  )
}

export function DialogDescription({ children, className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-text-muted", className)} {...props}>
      {children}
    </p>
  )
}

export function DialogFooter({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center justify-end gap-3 pt-4", className)} {...props}>
      {children}
    </div>
  )
}
