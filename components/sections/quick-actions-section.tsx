"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { Sparkles, Heart, Play, Calendar, ArrowRight, Flower2 } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export function QuickActionsSection() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" })

  const actions = [
    {
      title: t("nav.bookSeva"),
      subtitle: t("home.bookSevaSub"),
      icon: Sparkles,
      href: "/sevas",
      gradient: "from-maroon-800 to-primary",
      accent: "text-maroon-800",
      tag: t("home.popular")
    },
    {
      title: t("home.dailyAlankaraTitle"),
      subtitle: t("home.dailyAlankaraSub"),
      icon: Flower2,
      href: "/daily-alankara",
      gradient: "from-dark-slate to-slate-700",
      accent: "text-dark-slate",
      tag: t("home.live")
    },
    {
      title: t("home.templeCalendarTitle"),
      subtitle: t("home.templeCalendarSub"),
      icon: Calendar,
      href: "/panchanga",
      gradient: "from-sand-500 to-sand-600",
      accent: "text-sand-700",
      tag: `${new Date().getDate()} ${new Date().toLocaleDateString("en-US", { month: "short" })}`
    },
    {
      title: t("home.donateTitle"),
      subtitle: t("home.donateSub"),
      icon: Heart,
      href: "/donate",
      gradient: "from-gold-500 to-gold-600",
      accent: "text-gold-700",
      tag: t("home.blessings")
    }
  ]

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-warm-ivory py-16 sm:py-20"
    >
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 12px 12px, #5B0E16 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-10 sm:mb-12"
        >
          <span className="text-xs uppercase tracking-[0.15em] text-maroon-800 font-semibold mb-2">
            {t("home.quickAccess")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-dark-slate">
            {t("home.quickActionsTitle")}
          </h2>
          <div className="mt-3 h-px w-16 bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
            >
              <Link href={action.href} className="block h-full">
                <div className="relative overflow-hidden h-full rounded-xl bg-white border border-border hover:border-gold-400/30 transition-all duration-300 shadow-sm hover:shadow-md group">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br from-maroon-50 to-transparent" />
                  
                  <div className="relative p-4 sm:p-5 flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-[9px] uppercase tracking-[0.12em] font-semibold text-text-muted/80">
                        {action.tag}
                      </span>
                    </div>
                    
                    <div>
                      <h3 className={`font-heading font-bold text-base leading-tight ${action.accent}`}>
                        {action.title}
                      </h3>
                      <p className="text-xs text-text-muted mt-1 leading-relaxed">
                        {action.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-medium text-text-muted/90 group-hover:text-primary transition-colors">
                      <span>{t("home.explore")}</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
