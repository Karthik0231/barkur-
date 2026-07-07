"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface Step {
  label: string
  description?: string
}

interface BookingStepsProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export function BookingSteps({ steps, currentStep, className }: BookingStepsProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep
          const isActive = idx === currentStep
          const stepNumber = idx + 1

          return (
            <div key={idx} className="flex-1 flex flex-col items-center relative">
              {idx > 0 && (
                <div
                  className={cn(
                    "absolute top-5 -left-[50%] w-full h-0.5 -translate-y-1/2",
                    "transition-colors duration-300",
                    isCompleted ? "bg-primary" : "bg-border",
                  )}
                />
              )}
              <motion.div
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 2 }}
                className={cn(
                  "relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                  isCompleted && "bg-primary text-warm-white",
                  isActive && "bg-primary text-warm-white ring-4 ring-primary/20",
                  !isCompleted && !isActive && "bg-bg-tertiary text-text-muted",
                )}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
              </motion.div>
              <div className="mt-2 text-center">
                <span
                  className={cn(
                    "text-xs font-semibold transition-colors duration-300 hidden sm:block",
                    isActive && "text-primary",
                    isCompleted && "text-primary",
                    !isActive && !isCompleted && "text-text-muted",
                  )}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span
                    className={cn(
                      "text-[10px] text-text-muted hidden md:block mt-0.5",
                      isActive && "text-primary/70",
                    )}
                  >
                    {step.description}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
