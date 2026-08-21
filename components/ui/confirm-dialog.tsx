"use client"

import { type ReactNode } from "react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button, type ButtonVariant } from "@/components/ui/button"
import { AlertTriangle, Trash2, Info } from "lucide-react"

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  /** Visual variant affects icon and button color */
  variant?: "danger" | "warning" | "info"
  /** Primary action button text */
  confirmText?: string
  /** Cancel button text */
  cancelText?: string
  /** Callback when confirmed */
  onConfirm: () => void
  /** Show loading state on confirm button */
  loading?: boolean
  /** Extra content between description and footer */
  children?: ReactNode
}

const variantConfig = {
  danger: {
    icon: Trash2,
    iconBg: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600 dark:text-red-400",
    confirmVariant: "destructive" as ButtonVariant,
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    confirmVariant: "primary" as ButtonVariant,
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    confirmVariant: "primary" as ButtonVariant,
  },
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  variant = "danger",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  loading = false,
  children,
}: ConfirmDialogProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                config.iconBg
              )}
            >
              <Icon className={cn("h-5 w-5", config.iconColor)} />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription className="mt-1.5">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>
        {children && <div className="mt-2">{children}</div>}
        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={config.confirmVariant}
            size="sm"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
