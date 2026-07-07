"use client"

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const variantStyles = {
  primary:
    "bg-primary text-warm-white hover:bg-primary-light shadow-sm hover:shadow-premium hover:shadow-glow-gold/20 active:shadow-sm",
  secondary:
    "bg-warm-white text-primary border-2 border-primary hover:bg-primary hover:text-warm-white shadow-sm hover:shadow-md",
  ghost:
    "bg-bg-secondary/50 text-text-primary border border-transparent hover:bg-bg-secondary hover:border-border active:bg-bg-tertiary",
  outline:
    "border-2 border-border bg-warm-white/80 text-text-primary hover:border-primary hover:text-primary hover:bg-primary/5",
  link:
    "bg-transparent text-primary underline-offset-4 hover:underline hover:text-primary-light p-0 h-auto",
  destructive:
    "bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md",
  gradient:
    "bg-gradient-to-r from-primary to-primary-light text-warm-white shadow-sm hover:shadow-elevated hover:shadow-glow-gold/20",
  brand:
    "bg-gradient-to-r from-secondary to-secondary-light text-dark-slate hover:from-secondary-light hover:to-secondary shadow-sm hover:shadow-premium hover:shadow-glow-gold/30 font-semibold",
  premium:
    "bg-gradient-to-r from-primary via-primary-light to-primary text-warm-white shadow-md hover:shadow-premium hover:shadow-glow-maroon/40 font-semibold",
}

const sizeStyles = {
  xs: "h-7 px-2.5 text-xs gap-1 rounded-md",
  sm: "h-9 px-3.5 text-sm gap-1.5 rounded-lg",
  md: "h-10 px-5 text-sm gap-2 rounded-xl",
  lg: "h-12 px-7 text-base gap-2 rounded-xl",
  xl: "h-14 px-9 text-lg gap-2.5 rounded-xl",
}

export type ButtonVariant = keyof typeof variantStyles
export type ButtonSize = keyof typeof sizeStyles

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

export const buttonVariants = ({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
} = {}) =>
  cn(
    "inline-flex items-center justify-center font-medium whitespace-nowrap transition-all duration-300 ease-out select-none",
    "hover:scale-[1.02] active:scale-[0.98]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
    "disabled:pointer-events-none disabled:opacity-50",
    variantStyles[variant],
    sizeStyles[size],
    className,
  )

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      iconLeft,
      iconRight,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
        ) : iconLeft ? (
          <span className="shrink-0 flex items-center" aria-hidden="true">
            {iconLeft}
          </span>
        ) : null}
        {children && <span className="truncate">{children}</span>}
        {!loading && iconRight && (
          <span className="shrink-0 flex items-center" aria-hidden="true">
            {iconRight}
          </span>
        )}
      </button>
    )
  },
)

Button.displayName = "Button"
