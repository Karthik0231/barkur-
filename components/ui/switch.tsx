"use client"

import { forwardRef, useId, type InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string
  description?: string
  error?: string
  size?: "sm" | "md" | "lg"
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      label,
      description,
      error,
      size = "md",
      id: externalId,
      disabled,
      ...props
    },
    ref
  ) => {
    const autoId = useId()
    const id = externalId ?? autoId
    const errorId = `${id}-error`
    const descId = `${id}-desc`

    const trackSizes = {
      sm: "h-5 w-9",
      md: "h-6 w-11",
      lg: "h-7 w-14",
    }
    const thumbSizes = {
      sm: "h-3.5 w-3.5 translate-x-0.5",
      md: "h-4.5 w-4.5 translate-x-0.5",
      lg: "h-5.5 w-5.5 translate-x-0.5",
    }
    const thumbChecked = {
      sm: "translate-x-4",
      md: "translate-x-5",
      lg: "translate-x-7",
    }

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={id}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="relative inline-flex shrink-0">
            <input
              ref={ref}
              id={id}
              type="checkbox"
              className="peer sr-only"
              disabled={disabled}
              aria-invalid={!!error}
              aria-describedby={
                error ? errorId : description ? descId : undefined
              }
              {...props}
            />
            <div
              className={cn(
                "rounded-full transition-all duration-200 ease-in-out",
                "bg-gray-300 peer-checked:bg-secondary",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-secondary/30 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-warm-white",
                "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
                trackSizes[size]
              )}
            />
            <div
              className={cn(
                "absolute top-0.5 left-0 rounded-full bg-white shadow-sm transition-all duration-200 ease-in-out",
                "peer-checked:translate-x-full",
                thumbSizes[size],
                thumbChecked[size]
              )}
            />
          </div>
          {(label || description) && (
            <div className="flex flex-col">
              {label && (
                <span
                  className={cn(
                    "text-sm font-medium text-text-primary",
                    disabled && "opacity-50"
                  )}
                >
                  {label}
                </span>
              )}
              {description && (
                <span id={descId} className="text-xs text-text-muted leading-tight mt-0.5">
                  {description}
                </span>
              )}
            </div>
          )}
        </label>
        {error && (
          <p id={errorId} className="text-xs text-maroon-500 ml-12" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Switch.displayName = "Switch"
