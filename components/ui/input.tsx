"use client"

import { forwardRef, type InputHTMLAttributes, type ReactNode, useId, useState } from "react"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2, X } from "lucide-react"

const variantStyles = {
  default:
    "bg-warm-white dark:bg-bg-secondary border border-border",
  filled:
    "bg-bg-secondary border-2 border-transparent",
  flushed:
    "bg-transparent border-b-2 border-border rounded-none",
  premium:
    "bg-warm-white border-2 border-gold-200/30 focus-within:border-gold-500 focus-within:ring-2 focus-within:ring-gold-500/10",
} as const

const sizeStyles = {
  sm: "h-9 text-sm px-3 py-1.5",
  md: "h-11 text-base px-4 py-2",
  lg: "h-12 sm:h-13 text-base sm:text-lg px-4 sm:px-5 py-2.5 sm:py-3",
} as const

const floatingSizeStyles = {
  sm: "h-9 text-sm pt-4 pb-1 px-3",
  md: "h-11 text-base pt-5 pb-1.5 px-4",
  lg: "h-12 sm:h-13 text-base sm:text-lg pt-5 sm:pt-6 pb-1.5 sm:pb-2 px-4 sm:px-5",
} as const

const labelFloatingStyles = {
  sm: "-top-2.5 left-3 text-xs peer-focus:text-[10px] peer-not-placeholder-shown:text-[10px]",
  md: "-top-3 left-4 text-sm peer-focus:text-xs peer-not-placeholder-shown:text-xs",
  lg: "-top-3.5 left-5 text-base peer-focus:text-sm peer-not-placeholder-shown:text-sm",
} as const

const labelFloatingIconStyles = {
  sm: "left-9",
  md: "left-10",
  lg: "left-11",
} as const

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: keyof typeof variantStyles
  inputSize?: keyof typeof sizeStyles
  label?: string
  helperText?: string
  error?: string
  success?: string
  iconLeft?: ReactNode
  iconRight?: ReactNode
  floatingLabel?: boolean
  /** Show a clear (x) button when there is a value. Requires value + onChange to be controlled. */
  clearable?: boolean
  onClear?: () => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = "default",
      inputSize = "md",
      label,
      helperText,
      error,
      success,
      iconLeft,
      iconRight,
      id: externalId,
      placeholder,
      floatingLabel,
      clearable = false,
      onClear,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref,
  ) => {
    const autoId = useId()
    const id = externalId ?? autoId
    const errorId = `${id}-error`
    const helperId = `${id}-helper`
    const useFloatingLabel = floatingLabel ?? !!label
    const [internalValue, setInternalValue] = useState(defaultValue ?? "")
    const isControlled = value !== undefined
    const currentValue = isControlled ? value : internalValue
    const hasValue = String(currentValue ?? "").length > 0
    const showClear = clearable && hasValue

    const status: "error" | "success" | "default" = error ? "error" : success ? "success" : "default"

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && !useFloatingLabel && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative rounded-xl transition-all duration-200",
            variantStyles[variant],
            status === "error" &&
              "border-maroon-500 focus-within:border-maroon-500 focus-within:ring-2 focus-within:ring-maroon-500/20",
            status === "success" &&
              "border-emerald-500 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20",
            status === "default" && variant !== "flushed" && variant !== "premium" &&
              "focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20 focus-within:shadow-sm",
            status === "default" && variant === "flushed" &&
              "focus-within:border-secondary",
          )}
        >
          {iconLeft && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-muted z-10">
              {iconLeft}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            value={value}
            defaultValue={defaultValue}
            onChange={(e) => {
              if (!isControlled) setInternalValue(e.target.value)
              onChange?.(e)
            }}
            placeholder={useFloatingLabel ? " " : placeholder}
            className={cn(
              "w-full rounded-xl transition-all duration-200 placeholder:text-text-muted bg-transparent",
              "focus-visible:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "read-only:cursor-default read-only:opacity-80",
              useFloatingLabel && "peer",
              useFloatingLabel ? floatingSizeStyles[inputSize] : sizeStyles[inputSize],
              iconLeft && (useFloatingLabel ? "pl-9" : "pl-10"),
              (iconRight || showClear || status !== "default") && "pr-10",
              className,
            )}
            aria-invalid={status === "error"}
            aria-describedby={
              error ? errorId : helperText || success ? helperId : undefined
            }
            {...props}
          />
          {useFloatingLabel && label && (
            <label
              htmlFor={id}
              className={cn(
                "absolute pointer-events-none transition-all duration-200 text-text-muted",
                "peer-focus:text-secondary",
                "peer-not-placeholder-shown:text-secondary",
                labelFloatingStyles[inputSize],
                iconLeft && labelFloatingIconStyles[inputSize],
              )}
            >
              {label}
            </label>
          )}

          <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1.5">
            {showClear && (
              <button
                type="button"
                onClick={() => {
                  if (!isControlled) setInternalValue("")
                  onClear?.()
                }}
                className="text-text-muted hover:text-text-primary transition-colors rounded-full p-0.5 hover:bg-bg-secondary"
                aria-label="Clear input"
                tabIndex={-1}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            {status === "error" && (
              <AlertCircle className="h-4 w-4 text-maroon-500 shrink-0 pointer-events-none" aria-hidden="true" />
            )}
            {status === "success" && (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 pointer-events-none" aria-hidden="true" />
            )}
            {iconRight && status === "default" && !showClear && (
              <div className="pointer-events-none text-text-muted">{iconRight}</div>
            )}
          </div>
        </div>
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
    )
  },
)

Input.displayName = "Input"
