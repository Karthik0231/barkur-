"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Sun, Infinity, Sparkles, Flame, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

const categories = [
  {
    title: "Daily Sevas",
    icon: Sun,
    description: "Regular worship services including Nitya Pooja, Abhishekam, and Archana",
    gradient: "from-amber-500/20 to-orange-600/20",
    iconBg: "from-amber-500 to-orange-600",
  },
  {
    title: "Shashwatha Sevas",
    icon: Infinity,
    description: "Perpetual offerings for lifelong blessings and divine protection",
    gradient: "from-gold-500/20 to-amber-600/20",
    iconBg: "from-gold-500 to-amber-600",
  },
  {
    title: "Special Sevas",
    icon: Sparkles,
    description: "Unique ceremonies for special occasions and festivals",
    gradient: "from-purple-500/20 to-violet-600/20",
    iconBg: "from-purple-500 to-violet-600",
  },
  {
    title: "Homas",
    icon: Flame,
    description: "Sacred fire rituals for purification, prosperity, and spiritual growth",
    gradient: "from-red-500/20 to-rose-600/20",
    iconBg: "from-red-500 to-rose-600",
  },
]

export function SevasSection() {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="relative py-24 overflow-hidden bg-gradient-to-b from-warm-ivory to-gold-50/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(201,168,76,0.04)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(107,15,26,0.02)_0%,_transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-dark-slate">
            {t("sevas.ourSevas")}
          </h2>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold-500/60 to-gold-500/60" />
            <div className="h-2.5 w-2.5 rotate-45 bg-gold-500 shadow-lg shadow-gold-500/30" />
            <div className="h-px w-16 bg-gradient-to-r from-gold-500/60 via-gold-500/60 to-transparent" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="group relative"
              >
                <div className="relative h-full overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-gold-200/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold-500/20">
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                  <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    category.gradient
                  )} />

                  <div className="relative p-8 text-center">
                    <div className={cn(
                      "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                      category.iconBg
                    )}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>

                    <h3 className="text-xl font-heading font-bold text-dark-slate group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>

                    <p className="mt-3 text-sm text-dark-slate/60 leading-relaxed">
                      {category.description}
                    </p>

                    <div className="mt-8">
                      <Link
                        href="/sevas/book"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-maroon-700 text-white text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {t("sevas.bookNow")}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Link
            href="/sevas"
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-light transition-colors"
          >
            {t("sevas.viewAll")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
