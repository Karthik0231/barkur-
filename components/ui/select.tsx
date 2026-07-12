"use client"

import { forwardRef, type SelectHTMLAttributes, useId } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, AlertCircle } from "lucide-react"

const sizeStyles = {
  sm: "h-9 text-sm pl-3 pr-9",
  md: "h-11 text-sm pl-4 pr-10",
  lg: "h-12 sm:h-13 text-base pl-4 sm:pl-5 pr-10 sm:pr-11",
} as const

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string
  helperText?: string
  error?: string
  size?: keyof typeof sizeStyles
  options: { value: string; label: string; disabled?: boolean }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, error, size = "md", options, placeholder, id: externalId, ...props }, ref) => {
    const autoId = useId()
    const id = externalId ?? autoId
    const errorId = `${id}-error`
    const helperId = `${id}-helper`

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              "w-full rounded-xl border bg-warm-white dark:bg-bg-secondary appearance-none cursor-pointer transition-all duration-200",
              "text-text-primary py-2",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/20 focus-visible:border-secondary",
              "disabled:cursor-not-allowed disabled:opacity-50",
              sizeStyles[size],
              error
                ? "border-maroon-500 focus-visible:ring-maroon-500/20 focus-visible:border-maroon-500"
                : "border-border hover:border-gold-300",
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled={props.required}>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
            {error && <AlertCircle className="h-4 w-4 text-maroon-500" aria-hidden="true" />}
            <ChevronDown className="h-4 w-4 text-text-muted" />
          </div>
        </div>
        {error && (
          <p id={errorId} className="flex items-center gap-1 text-xs text-maroon-500" role="alert">
            <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-xs text-text-muted">
            {helperText}
          </p>
        )}
      </div>
    )
  },
)
Select.displayName = "Select"
