import { forwardRef, type HTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

const variantStyles = {
  default:
    "bg-bg-secondary text-text-primary border border-border shadow-sm",
  primary:
    "bg-primary text-warm-white shadow-sm",
  secondary:
    "bg-secondary text-dark-slate shadow-sm",
  success:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 shadow-sm",
  warning:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 shadow-sm",
  danger:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 shadow-sm",
  destructive:
    "bg-red-600 text-white shadow-sm",
  outline:
    "bg-transparent border-2 border-primary text-primary shadow-sm",
  ghost:
    "bg-primary/10 text-primary dark:bg-primary/20",
  subtle:
    "bg-primary/10 text-primary dark:bg-primary/20",
  gold:
    "bg-gold-100 text-gold-800 border border-gold-200/50 shadow-sm",
  maroon:
    "bg-maroon-100 text-maroon-800 border border-maroon-200/50 shadow-sm",
} as const

const sizeStyles = {
  xs: "text-[10px] px-1.5 py-0.5 gap-0.5",
  sm: "text-[11px] px-2 py-0.5 gap-1",
  md: "text-xs px-2.5 py-1 gap-1.5",
  lg: "text-sm px-3 py-1.5 gap-2",
} as const

const dotColors: Record<string, string> = {
  default: "bg-text-muted",
  primary: "bg-warm-white",
  secondary: "bg-dark-slate",
  success: "bg-emerald-600 dark:bg-emerald-400",
  warning: "bg-amber-600 dark:bg-amber-400",
  danger: "bg-red-600 dark:bg-red-400",
  destructive: "bg-warm-white",
  outline: "bg-primary",
  ghost: "bg-primary",
  subtle: "bg-primary",
  gold: "bg-gold-800",
  maroon: "bg-maroon-800",
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variantStyles
  size?: keyof typeof sizeStyles
  dot?: boolean
  pill?: boolean
  /** Show a remove (x) button. Fires onRemove when clicked. */
  removable?: boolean
  onRemove?: () => void
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "default",
      size = "sm",
      dot = false,
      pill = true,
      removable = false,
      onRemove,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium whitespace-nowrap select-none max-w-full",
          pill ? "rounded-full" : "rounded-md",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "rounded-full shrink-0",
              size === "xs" ? "h-1 w-1" : size === "sm" ? "h-1.5 w-1.5" : size === "lg" ? "h-2.5 w-2.5" : "h-2 w-2",
              dotColors[variant] || "bg-current",
            )}
            aria-hidden="true"
          />
        )}
        <span className="truncate">{children}</span>
        {removable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove?.()
            }}
            className="shrink-0 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors p-0.5 -mr-0.5"
            aria-label="Remove"
          >
            <X className={size === "lg" ? "h-3.5 w-3.5" : "h-3 w-3"} />
          </button>
        )}
      </span>
    )
  },
)

Badge.displayName = "Badge"
