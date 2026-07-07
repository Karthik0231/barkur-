"use client"

import { forwardRef, type InputHTMLAttributes, type ReactNode, useId } from "react"
import { cn } from "@/lib/utils"
import { AlertCircle } from "lucide-react"

const variantStyles = {
  default:
    "bg-warm-white dark:bg-bg-secondary border border-border",
  filled:
    "bg-bg-secondary border-2 border-transparent",
  flushed:
    "bg-transparent border-b-2 border-border rounded-none",
  premium:
    "bg-warm-white border-2 border-gold-200/30 focus-within:border-gold-500 focus-within:ring-2 focus-within:ring-gold-500/10",
}

const sizeStyles = {
  sm: "h-9 text-sm px-3 py-1.5",
  md: "h-11 text-base px-4 py-2",
  lg: "h-13 text-lg px-5 py-3",
}

const floatingSizeStyles = {
  sm: "h-9 text-sm pt-4 pb-1 px-3",
  md: "h-11 text-base pt-5 pb-1.5 px-4",
  lg: "h-13 text-lg pt-6 pb-2 px-5",
}

const labelFloatingStyles = {
  sm: "-top-2.5 left-3 text-xs peer-focus:text-[10px] peer-not-placeholder-shown:text-[10px]",
  md: "-top-3 left-4 text-sm peer-focus:text-xs peer-not-placeholder-shown:text-xs",
  lg: "-top-3.5 left-5 text-base peer-focus:text-sm peer-not-placeholder-shown:text-sm",
}

const labelFloatingIconStyles = {
  sm: "left-9",
  md: "left-10",
  lg: "left-11",
}

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: keyof typeof variantStyles
  inputSize?: keyof typeof sizeStyles
  label?: string
  helperText?: string
  error?: string
  iconLeft?: ReactNode
  iconRight?: ReactNode
  floatingLabel?: boolean
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
      iconLeft,
      iconRight,
      id: externalId,
      placeholder,
      floatingLabel,
      ...props
    },
    ref,
  ) => {
    const autoId = useId()
    const id = externalId ?? autoId
    const errorId = `${id}-error`
    const helperId = `${id}-helper`
    const useFloatingLabel = floatingLabel ?? !!label

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
            error &&
              "border-maroon-500 focus-within:border-maroon-500 focus-within:ring-maroon-500/20",
            !error && variant !== "flushed" && variant !== "premium" &&
              "focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20 focus-within:shadow-sm",
            !error && variant === "flushed" &&
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
            placeholder={useFloatingLabel ? " " : placeholder}
            className={cn(
              "w-full rounded-xl transition-all duration-200 placeholder:text-text-muted bg-transparent",
              "focus-visible:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "read-only:cursor-default read-only:opacity-80",
              !error && variant !== "flushed" && variant !== "premium" &&
                "focus:border-secondary",
              error && "border-maroon-500 focus:border-maroon-500",
              useFloatingLabel && "peer",
              useFloatingLabel ? floatingSizeStyles[inputSize] : sizeStyles[inputSize],
              iconLeft && (useFloatingLabel ? "pl-9" : "pl-10"),
              iconRight && "pr-10",
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
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
          {iconRight && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-text-muted z-10">
              {iconRight}
            </div>
          )}
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

Input.displayName = "Input"
