"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

export interface SectionHeadingProps {
  title: string
  subtitle?: string
  align?: "left" | "center" | "right"
  variant?: "light" | "dark"
  className?: string
  as?: "h1" | "h2" | "h3"
}

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  variant = "dark",
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-3 max-w-2xl",
        align === "center" && "items-center text-center mx-auto",
        align === "right" && "items-end text-right ml-auto",
        align === "left" && "items-start text-left",
        className,
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative inline-block"
      >
        <Tag
          className={cn(
            "text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight",
            variant === "dark" ? "text-text-primary" : "text-warm-white",
          )}
        >
          {title}
        </Tag>
        <span
          className={cn(
            "absolute -bottom-2 left-0 right-0 h-1 rounded-full",
            align === "center" && "mx-auto",
            variant === "dark"
              ? "bg-gradient-to-r from-primary to-secondary"
              : "bg-gradient-to-r from-secondary to-gold-300",
          )}
          style={{ width: "60%" }}
        />
      </motion.div>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "text-base sm:text-lg leading-relaxed max-w-xl",
            variant === "dark"
              ? "text-text-secondary"
              : "text-warm-white/80",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
