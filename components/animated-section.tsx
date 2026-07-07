"use client"

import { useRef, type ReactNode } from "react"
import { motion, useInView, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"

type AnimationVariant = "fadeIn" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scale"

const animations: Record<AnimationVariant, Variants> = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slideUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
  },
  slideDown: {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
  },
  slideRight: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
  },
} as const

export interface AnimatedSectionProps {
  children: ReactNode
  animation?: AnimationVariant
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}

export function AnimatedSection({
  children,
  animation = "slideUp",
  delay = 0,
  duration = 0.6,
  className,
  once = true,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      variants={animations[animation]}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
