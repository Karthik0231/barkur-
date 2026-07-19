"use client"

import { motion } from "framer-motion"
import { Sun } from "lucide-react"

interface PageBannerProps {
  title: string
  subtitle?: string
  eyebrow?: string
}

export function PageBanner({
  title,
  subtitle,
  eyebrow = "Sri Kalikamba Temple",
}: PageBannerProps) {
  return (
    <section className="relative min-h-[42vh] pt-[44px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-maroon-800 via-maroon-700 to-gold-700 z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/40 via-transparent to-gold-500/20 z-[1]" />
      <div className="absolute inset-0 pattern-mandala opacity-20 z-[2]" />
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-gold-400/10 to-transparent z-[3]" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg-primary to-transparent z-[4]" />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-14 sm:py-16 mt-16 sm:mt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block text-gold-300/90 text-xs sm:text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium"
          >
            <Sun className="inline-block h-4 w-4 mr-2 text-gold-300" />
            {eyebrow}
            <Sun className="inline-block h-4 w-4 ml-2 text-gold-300" />
          </motion.span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-warm-white leading-tight drop-shadow-lg">
            {title}
          </h1>
          {subtitle && (
            <>
              <div className="h-1 w-24 bg-gradient-to-r from-gold-400 to-gold-300 rounded-full mx-auto mt-6 mb-6" />
              <p className="text-warm-white/80 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-sans px-2">
                {subtitle}
              </p>
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}
