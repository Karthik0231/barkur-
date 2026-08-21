"use client"

import { forwardRef, useId, useState, type TextareaHTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helperText?: string
  error?: string
  success?: string
  /** Show a character count in the bottom-right */
  showCharCount?: boolean
  /** Max length for character count display (does not enforce HTML maxlength) */
  maxLength?: number
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      success,
      showCharCount = false,
      maxLength,
      id: externalId,
      value,
      defaultValue,
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const autoId = useId()
    const id = externalId ?? autoId
    const errorId = `${id}-error`
    const helperId = `${id}-helper`

    const [internalValue, setInternalValue] = useState(defaultValue ?? "")
    const isControlled = value !== undefined
    const currentValue = isControlled ? value : internalValue
    const charCount = String(currentValue ?? "").length

    const status: "error" | "success" | "default" = error
      ? "error"
      : success
        ? "success"
        : "default"

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-text-primary">
            {label}
            {props.required && <span className="text-maroon-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            id={id}
            value={value}
            defaultValue={defaultValue}
            maxLength={maxLength}
            onChange={(e) => {
              if (!isControlled) setInternalValue(e.target.value)
              onChange?.(e)
            }}
            disabled={disabled}
            className={cn(
              "w-full min-h-[100px] rounded-xl border bg-warm-white dark:bg-bg-secondary px-4 py-3 text-sm text-text-primary",
              "transition-all duration-200 resize-y",
              "placeholder:text-text-muted",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/20 focus-visible:border-secondary focus-visible:shadow-sm",
              "disabled:cursor-not-allowed disabled:opacity-50",
              status === "error" &&
                "border-maroon-500 focus-visible:ring-maroon-500/20 focus-visible:border-maroon-500",
              status === "success" &&
                "border-emerald-500 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500",
              status === "default" && "border-border hover:border-gold-300",
              className
            )}
            aria-invalid={status === "error"}
            aria-describedby={
              error ? errorId : helperText || success ? helperId : undefined
            }
            {...props}
          />
          {status !== "default" && (
            <div className="absolute top-3 right-3 pointer-events-none">
              {status === "error" && (
                <AlertCircle className="h-4 w-4 text-maroon-500" />
              )}
              {status === "success" && (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            {error && (
              <p id={errorId} className="flex items-center gap-1 text-xs text-maroon-500" role="alert">
                <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                {error}
              </p>
            )}
            {success && !error && (
              <p id={helperId} className="flex items-center gap-1 text-xs text-emerald-600">
                <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden="true" />
                {success}
              </p>
            )}
            {helperText && !error && !success && (
              <p id={helperId} className="text-xs text-text-muted">
                {helperText}
              </p>
            )}
          </div>
          {showCharCount && (
            <span
              className={cn(
                "text-[11px] tabular-nums shrink-0",
                maxLength && charCount > maxLength
                  ? "text-red-500 font-medium"
                  : maxLength && charCount > maxLength * 0.9
                    ? "text-amber-500"
                    : "text-text-muted"
              )}
            >
              {maxLength ? `${charCount}/${maxLength}` : charCount}
            </span>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = "Textarea"
