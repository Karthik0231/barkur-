"use client"

import { useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { BookingSteps } from "./booking-steps"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

export interface BookingStep {
  label: string
  description?: string
  content: ReactNode
  onNext?: () => boolean | Promise<boolean>
}

interface BookingFormProps {
  steps: BookingStep[]
  onComplete?: () => void
  className?: string
  completeLabel?: string
}

export function BookingForm({
  steps,
  onComplete,
  className,
  completeLabel = "Complete Booking",
}: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  const handleNext = async () => {
    const step = steps[currentStep]
    if (step.onNext) {
      setLoading(true)
      const canProceed = await step.onNext()
      setLoading(false)
      if (!canProceed) return
    }
    if (isLast) {
      onComplete?.()
    } else {
      setCurrentStep((s) => s + 1)
    }
  }

  const handleBack = () => {
    if (!isFirst) setCurrentStep((s) => s - 1)
  }

  return (
    <div className={cn("w-full", className)}>
      <BookingSteps
        steps={steps.map(({ label, description }) => ({ label, description }))}
        currentStep={currentStep}
        className="mb-10"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {steps[currentStep].content}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-8">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isFirst || loading}
          iconLeft={<ChevronLeft className="h-4 w-4" />}
        >
          {t("booking.back")}
        </Button>
        <Button
          variant="gradient"
          onClick={handleNext}
          loading={loading}
          iconRight={!isLast ? <ChevronRight className="h-4 w-4" /> : undefined}
        >
          {isLast ? completeLabel : t("booking.next")}
        </Button>
      </div>
    </div>
  )
}
