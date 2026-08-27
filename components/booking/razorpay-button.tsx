"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { cn, formatPrice } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"
import { IndianRupee, CreditCard, Shield } from "lucide-react"

interface RazorpayButtonProps {
  amount: number
  currency?: string
  name?: string
  description?: string
  orderId?: string
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  theme?: {
    color?: string
  }
  onSuccess?: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void
  onError?: (error: unknown) => void
  className?: string
  buttonText?: string
  disabled?: boolean
  loading?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "gradient" | "primary" | "secondary" | "outline"
}

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      on: (event: string, handler: (response: RazorpayResponse) => void) => void
      open: () => void
    }
  }
}

export function RazorpayButton({
  amount,
  currency = "INR",
  name = "Sri Kalikamba Temple",
  description,
  orderId,
  prefill,
  theme,
  onSuccess,
  onError,
  className,
  buttonText,
  disabled = false,
  loading: externalLoading,
  size = "lg",
  variant = "gradient",
}: RazorpayButtonProps) {
  const { t } = useTranslation()
  const [internalLoading, setInternalLoading] = useState(false)
  const isButtonLoading = externalLoading !== undefined ? externalLoading : internalLoading

  const handlePayment = useCallback(async () => {
    if (typeof window === "undefined" || !window.Razorpay) {
      onError?.(new Error("Razorpay SDK not loaded"))
      return
    }

    setInternalLoading(true)

    try {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: amount * 100,
        currency,
        name,
        description: description || `Payment of ${formatPrice(amount)}`,
        order_id: orderId,
        prefill: {
          name: prefill?.name || "",
          email: prefill?.email || "",
          contact: prefill?.contact || "",
          ...prefill,
        },
        theme: {
          color: theme?.color || "#6b0f1a",
          ...theme,
        },
        handler: (response: RazorpayResponse) => {
          onSuccess?.(response)
          setInternalLoading(false)
        },
        modal: {
          ondismiss: () => {
            setInternalLoading(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)

      razorpay.on("payment.failed", (response: unknown) => {
        onError?.(response)
        setInternalLoading(false)
      })

      razorpay.open()
    } catch (err) {
      onError?.(err)
      setInternalLoading(false)
    }
  }, [amount, currency, name, description, orderId, prefill, theme, onSuccess, onError])

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <Button
        variant={variant}
        size={size}
        className="w-full"
        onClick={handlePayment}
        disabled={disabled || isButtonLoading}
        loading={isButtonLoading}
        iconRight={<CreditCard className="h-4 w-4" />}
      >
        {buttonText || `Pay ${formatPrice(amount)} Securely`}
      </Button>
      <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
        <Shield className="h-3 w-3" />
        <span>{t("common.securedByRazorpay")}</span>
        <span className="mx-1">&middot;</span>
        <IndianRupee className="h-3 w-3" />
        <span>{formatPrice(amount)}</span>
      </div>
    </div>
  )
}
