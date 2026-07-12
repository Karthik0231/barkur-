"use client"

import * as React from "react"
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
} as const

const sizeStyles = {
  xs: "h-7 px-2.5 text-xs gap-1 rounded-md",
  sm: "h-9 px-3 sm:px-3.5 text-sm gap-1.5 rounded-lg",
  md: "h-10 px-4 sm:px-5 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 sm:px-7 text-base gap-2 rounded-xl",
  xl: "h-14 px-7 sm:px-9 text-base sm:text-lg gap-2.5 rounded-xl",
  icon: "h-10 w-10 p-0 rounded-xl shrink-0",
} as const

const iconOnlySquare = {
  xs: "h-7 w-7 p-0",
  sm: "h-9 w-9 p-0",
  md: "h-10 w-10 p-0",
  lg: "h-12 w-12 p-0",
  xl: "h-14 w-14 p-0",
  icon: "h-10 w-10 p-0",
} as const

export type ButtonVariant = keyof typeof variantStyles
export type ButtonSize = keyof typeof sizeStyles

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  loadingText?: string
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  iconOnly?: boolean
  fullWidth?: boolean
  asChild?: boolean
}

export const buttonVariants = ({
  variant = "primary",
  size = "md",
  className,
  iconOnly = false,
  fullWidth = false,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  iconOnly?: boolean
  fullWidth?: boolean
} = {}) =>
  cn(
    "inline-flex items-center justify-center font-medium whitespace-nowrap transition-all duration-300 ease-out select-none",
    "hover:scale-[1.02] active:scale-[0.98]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary",
    "disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100",
    variantStyles[variant],
    iconOnly ? iconOnlySquare[size] : sizeStyles[size],
    fullWidth && "w-full",
    className,
  )

export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  loadingText,
  disabled,
  iconLeft,
  iconRight,
  iconOnly = false,
  fullWidth = false,
  asChild = false,
  children,
  "aria-label": ariaLabel,
  ...props
}, ref) => {
  const buttonClasses = buttonVariants({ variant, size, className, iconOnly, fullWidth })
  const buttonContent = (
    <>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
      ) : iconLeft ? (
        <span className="shrink-0 flex items-center" aria-hidden="true">
          {iconLeft}
        </span>
      ) : null}
      {!iconOnly && children && (
        <span className="truncate">{loading && loadingText ? loadingText : children}</span>
      )}
      {!loading && iconRight && !iconOnly && (
        <span className="shrink-0 flex items-center" aria-hidden="true">
          {iconRight}
        </span>
      )}
    </>
  )

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ref,
      className: cn(buttonClasses, (children as React.ReactElement<any>).props.className),
      disabled: disabled || loading,
      "aria-disabled": disabled || loading,
      "aria-busy": loading,
      "aria-label": iconOnly ? ariaLabel : undefined,
      ...props,
      ...(children as React.ReactElement<any>).props,
      children: buttonContent,
    })
  }

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      aria-label={iconOnly ? ariaLabel : undefined}
      {...props}
    >
      {buttonContent}
    </button>
  )
})

Button.displayName = "Button"
