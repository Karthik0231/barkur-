"use client"

import { useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface WizardStep {
  id: string
  title: string
  content: ReactNode
}

export interface BookingWizardProps {
  steps: WizardStep[]
  onComplete: () => void
  canProceed?: boolean
  className?: string
}

export function BookingWizard({ steps, onComplete, canProceed = true, className }: BookingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(0)

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1)
      setCurrentStep((prev) => prev + 1)
    } else {
      onComplete()
    }
  }

  const goBack = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep((prev) => prev - 1)
    }
  }

  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-center mb-10">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                animate={{
                  scale: i === currentStep ? 1.1 : 1,
                  backgroundColor: i <= currentStep ? "var(--color-primary)" : "var(--color-bg-secondary)",
                  borderColor: i <= currentStep ? "var(--color-primary)" : "var(--color-border)",
                  color: i <= currentStep ? "#fff" : "var(--color-text-muted)",
                }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300",
                  i === currentStep && "shadow-lg shadow-primary/20",
                )}
              >
                {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
              </motion.div>
              <span className={cn(
                "text-xs mt-1.5 font-medium transition-colors duration-300 whitespace-nowrap",
                i === currentStep ? "text-primary" : i < currentStep ? "text-text-muted" : "text-text-muted/50",
              )}>
                {step.title}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                "w-12 sm:w-16 h-0.5 mx-2 rounded-full transition-colors duration-300",
                i < currentStep ? "bg-primary" : "bg-border",
              )} />
            )}
          </div>
        ))}
      </div>

      <div className="relative min-h-[300px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {steps[currentStep].content}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={goBack}
          disabled={isFirst}
          className={isFirst ? "invisible" : ""}
        >
          Back
        </Button>
        <Button
          variant="premium"
          onClick={goNext}
          disabled={!canProceed}
        >
          {isLast ? "Confirm Booking" : "Continue"}
        </Button>
      </div>
    </div>
  )
}
