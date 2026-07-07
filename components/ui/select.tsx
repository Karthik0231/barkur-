"use client"

import { forwardRef, type SelectHTMLAttributes, useId } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id: externalId, ...props }, ref) => {
    const autoId = useId()
    const id = externalId ?? autoId
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label htmlFor={id} className="text-sm font-medium text-text-primary">{label}</label>}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              "w-full h-11 rounded-xl border bg-warm-white appearance-none cursor-pointer transition-all duration-200",
              "text-sm text-text-primary pl-4 pr-10 py-2",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/20 focus-visible:border-secondary",
              error ? "border-maroon-500" : "border-border hover:border-gold-300",
              className,
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
        </div>
        {error && <p className="text-xs text-maroon-500">{error}</p>}
      </div>
    )
  }
)
Select.displayName = "Select"
