"use client"

import { cn, formatPrice } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface LineItem {
  label: string
  amount: number
  description?: string
}

interface PaymentSummaryProps {
  lineItems: LineItem[]
  tax?: number
  deposit?: number
  total: number
  onPayment: () => void
  loading?: boolean
  paymentLabel?: string
  className?: string
}

export function PaymentSummary({
  lineItems,
  tax,
  deposit,
  total,
  onPayment,
  loading = false,
  paymentLabel = "Proceed to Payment",
  className,
}: PaymentSummaryProps) {
  const taxAmount = tax !== undefined ? Math.round(total * tax) / 100 : 0
  const grandTotal = total + taxAmount + (deposit || 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card variant="elevated" className={cn("p-6", className)}>
        <h3 className="text-lg font-heading font-bold text-primary mb-4">
          Payment Summary
        </h3>

        <div className="space-y-3">
          {lineItems.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start">
              <div>
                <span className="text-sm text-text-primary">{item.label}</span>
                {item.description && (
                  <p className="text-xs text-text-muted">{item.description}</p>
                )}
              </div>
              <span className="text-sm font-semibold text-text-primary">
                {formatPrice(item.amount)}
              </span>
            </div>
          ))}

          <div className="border-t border-border pt-3 mt-3" />

          {deposit !== undefined && deposit > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Security Deposit</span>
              <span className="text-sm font-semibold text-text-primary">
                {formatPrice(deposit)}
              </span>
            </div>
          )}

          {tax !== undefined && tax > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Tax ({tax}%)</span>
              <span className="text-sm font-semibold text-text-primary">
                {formatPrice(taxAmount)}
              </span>
            </div>
          )}

          <div className="border-t-2 border-primary/30 pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-primary font-heading">
                Total Amount
              </span>
              <span className="text-xl font-bold text-primary font-heading">
                {formatPrice(grandTotal)}
              </span>
            </div>
          </div>
        </div>

        <Button
          variant="gradient"
          size="lg"
          className="w-full mt-6"
          onClick={onPayment}
          loading={loading}
        >
          {paymentLabel}
        </Button>
      </Card>
    </motion.div>
  )
}
