"use client"

import { forwardRef, type ElementType, type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

const variantStyles = {
  default:
    "bg-warm-white dark:bg-bg-secondary border border-border shadow-card hover:shadow-elevated",
  glass:
    "glass shadow-card hover:shadow-elevated",
  elevated:
    "bg-warm-white dark:bg-bg-secondary border border-border shadow-elevated hover:shadow-premium",
  bordered:
    "bg-warm-white dark:bg-bg-secondary border-2 border-border hover:border-secondary shadow-sm",
  gradient:
    "gradient-bg text-warm-white shadow-elevated",
  premium:
    "bg-warm-white border border-gold-200/30 shadow-premium hover:shadow-xl",
  "glass-elevated":
    "glass shadow-premium hover:shadow-xl",
} as const

const paddingStyles = {
  none: "p-0",
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-6",
  lg: "p-6 sm:p-8",
} as const

export type CardVariant = keyof typeof variantStyles
export type CardPadding = keyof typeof paddingStyles

export interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: CardVariant
  padding?: CardPadding
  hover?: boolean
  as?: ElementType
}

const CardRoot = forwardRef<HTMLElement, CardProps>(
  (
    {
      className,
      variant = "default",
      padding = "md",
      hover = false,
      as: Component = "div",
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "rounded-xl transition-all duration-300 flex flex-col",
          variantStyles[variant],
          paddingStyles[padding],
          hover && "hover:-translate-y-0.5 hover:shadow-elevated hover:border-gold-300/50 cursor-pointer",
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    )
  },
)

CardRoot.displayName = "Card"

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-1.5 mb-4",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)

CardHeader.displayName = "CardHeader"

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-base sm:text-lg font-heading font-semibold text-text-primary leading-snug", className)}
      {...props}
    >
      {children}
    </h3>
  ),
)
CardTitle.displayName = "CardTitle"

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-text-muted leading-relaxed", className)} {...props}>
      {children}
    </p>
  ),
)
CardDescription.displayName = "CardDescription"

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding
}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex-1 min-w-0", className)}
        {...props}
      >
        {children}
      </div>
    )
  },
)

CardContent.displayName = "CardContent"

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap items-center gap-3 pt-4 mt-auto border-t border-border/50",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)

CardFooter.displayName = "CardFooter"

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
})
