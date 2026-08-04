"use client"

import { useEffect, useRef, type ReactNode, type HTMLAttributes, type ButtonHTMLAttributes } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export interface DialogProps {
  open: boolean
  onClose?: () => void
  onOpenChange?: (open: boolean) => void
  children: ReactNode
  className?: string
  /** Show a close (x) button in the top-right corner */
  showCloseButton?: boolean
  /** Close when the backdrop is clicked. Default true. */
  closeOnBackdropClick?: boolean
  /** Close when Escape is pressed. Default true. */
  closeOnEscape?: boolean
}

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
}

export function Dialog({
  open,
  onClose,
  onOpenChange,
  children,
  className,
  showCloseButton = false,
  closeOnBackdropClick = true,
  closeOnEscape = true,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  const handleClose = () => {
    onClose?.()
    onOpenChange?.(false)
  }

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  // Escape to close
  useEffect(() => {
    if (!open || !closeOnEscape) return
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, closeOnEscape])

  // Move focus into the dialog on open
  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeOnBackdropClick ? handleClose : undefined}
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.98, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 24 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "relative w-full bg-warm-white shadow-2xl border border-border overflow-hidden",
              "max-h-[92vh] sm:max-h-[85vh] flex flex-col",
              "rounded-t-2xl sm:rounded-2xl",
              "focus-visible:outline-none",
              className,
            )}
            role="dialog"
            aria-modal="true"
          >
            {/* mobile drag handle */}
            <div className="flex sm:hidden justify-center pt-2.5 pb-1 shrink-0">
              <span className="h-1 w-10 rounded-full bg-border" aria-hidden="true" />
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close dialog"
                className="absolute right-3 top-3 sm:right-4 sm:top-4 z-10 rounded-full p-1.5 text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
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

export function DialogContent({
  children,
  className,
  size = "md",
  ...props
}: HTMLAttributes<HTMLDivElement> & { size?: "sm" | "md" | "lg" | "xl" | "full" }) {
  return (
    <div className={cn("p-5 sm:p-6 flex flex-col overflow-y-auto", sizeStyles[size], className)} {...props}>
      {children}
    </div>
  )
}

export function DialogHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1.5 pr-8", className)} {...props}>
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
    <div className={cn("flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-4", className)} {...props}>
      {children}
    </div>
  )
}
