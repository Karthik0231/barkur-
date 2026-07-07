"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Clock, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn, formatPrice } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

const featuredSevas = [
  {
    id: "nitya-pooja",
    name: "Nitya Pooja",
    description: "Daily ritual worship of the deity with flowers, incense, and lamps",
    price: 501,
    duration: "30 min",
    gradient: "from-maroon-800 to-primary",
  },
  {
    id: "abhishekam",
    name: "Abhishekam",
    description: "Sacred bathing ceremony with milk, curd, honey, and sacred waters",
    price: 1001,
    duration: "45 min",
    gradient: "from-gold-700 to-secondary",
  },
  {
    id: "maha-homa",
    name: "Maha Homa",
    description: "Grand fire ritual for peace, prosperity, and spiritual well-being",
    price: 5001,
    duration: "2 hours",
    gradient: "from-primary-dark to-maroon-900",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function FeaturedSevasSection() {
  const { t } = useTranslation()
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section
      ref={ref}
      className="relative py-24 overflow-hidden bg-gradient-to-b from-warm-ivory to-gold-50/30"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(212,168,67,0.04)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(107,15,26,0.03)_0%,_transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-gold-600 font-medium mb-3">
            {t("sevas.ourSevas")}
          </span>
          <h2 className="section-heading font-script text-dark-slate leading-none">
            Sacred Rituals
          </h2>
          <div className="ornament-divider mt-6 max-w-[200px]">
            <span className="ornament" />
          </div>
          <p className="mt-5 text-sm sm:text-base text-dark-slate/50 max-w-lg font-light leading-relaxed">
            Ancient ceremonies meticulously performed by learned priests, preserving traditions that span millennia
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6"
        >
          {/* Nitya Pooja — tall hero card */}
          <motion.div variants={cardVariants} className="lg:col-span-7">
            <div className="group relative h-full overflow-hidden rounded-3xl bg-white shadow-elevated transition-all duration-500 hover:shadow-xl hover:shadow-gold-500/10">
              <div className="relative h-[320px] sm:h-[420px] lg:h-[540px] overflow-hidden">
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br transition-transform duration-700 ease-out group-hover:scale-105",
                    featuredSevas[0].gradient,
                  )}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.08)_0%,_transparent_60%)]" />
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 30px 30px, rgba(255,255,255,0.1) 1px, transparent 1px)",
                      backgroundSize: "60px 60px",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
                  <div className="flex items-start justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-[10px] uppercase tracking-[0.15em] font-medium border border-white/20">
                      <Sparkles className="h-3 w-3" />
                      Featured
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-dark-slate text-xs font-semibold shadow-sm">
                      {formatPrice(featuredSevas[0].price)}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/15 backdrop-blur-sm text-white/80 text-[10px] uppercase tracking-wider">
                        <Clock className="h-2.5 w-2.5" />
                        {featuredSevas[0].duration}
                      </span>
                    </div>
                    <h3 className="font-script text-3xl sm:text-4xl lg:text-5xl text-white leading-none mb-2">
                      {featuredSevas[0].name}
                    </h3>
                    <p className="text-white/70 text-sm sm:text-base max-w-md leading-relaxed hidden sm:block">
                      {featuredSevas[0].description}
                    </p>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/20">
                  <Link href="/sevas/book">
                    <Button
                      variant="premium"
                      size="lg"
                      className="scale-90 group-hover:scale-100 transition-transform duration-500 shadow-xl shadow-gold-500/20"
                    >
                      <Sparkles className="h-4 w-4" />
                      {t("sevas.bookNow")}
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="p-5 sm:p-6 flex items-center justify-between">
                <p className="text-sm text-dark-slate/60 leading-relaxed sm:hidden">
                  {featuredSevas[0].description}
                </p>
                <div className="hidden sm:flex items-center gap-3 text-sm text-dark-slate/50">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-gold-500" />
                    Daily ceremony
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gold-300" />
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-gold-500" />
                    {featuredSevas[0].duration}
                  </span>
                </div>
                <Link
                  href="/sevas/book"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors group/btn sm:hidden"
                >
                  {t("sevas.bookNow")}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right column: two stacked cards */}
          <div className="lg:col-span-5 flex flex-col gap-5 lg:gap-6">
            {/* Abhishekam — horizontal split */}
            <motion.div variants={cardVariants}>
              <div className="group relative overflow-hidden rounded-2xl bg-white shadow-elevated transition-all duration-500 hover:shadow-xl hover:shadow-gold-500/10">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-2/5 h-48 sm:h-auto overflow-hidden">
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br transition-transform duration-700 ease-out group-hover:scale-105",
                        featuredSevas[1].gradient,
                      )}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1)_0%,_transparent_60%)]" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/20">
                      <Link href="/sevas/book">
                        <Button
                          variant="premium"
                          size="sm"
                          className="scale-90 group-hover:scale-100 transition-transform duration-500 shadow-lg shadow-gold-500/20"
                        >
                          {t("sevas.bookNow")}
                        </Button>
                      </Link>
                    </div>
                    <div className="absolute top-3 left-3 sm:hidden">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/90 text-dark-slate text-[10px] font-semibold shadow-sm">
                        {formatPrice(featuredSevas[1].price)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 p-5 sm:p-6 flex flex-col justify-center">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-script text-2xl sm:text-3xl text-dark-slate leading-none">
                        {featuredSevas[1].name}
                      </h3>
                      <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gold-50 text-gold-700 text-sm font-semibold">
                        {formatPrice(featuredSevas[1].price)}
                      </span>
                    </div>
                    <p className="text-sm text-dark-slate/60 leading-relaxed mb-4">
                      {featuredSevas[1].description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-dark-slate/40">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-50/50 text-gold-600">
                        <Clock className="h-3 w-3" />
                        {featuredSevas[1].duration}
                      </span>
                      <span className="hidden sm:inline-flex items-center gap-1 text-gold-500">
                        <Sparkles className="h-3 w-3" />
                        Sacred bath
                      </span>
                    </div>
                    <div className="mt-4 hidden sm:block">
                      <Link
                        href="/sevas/book"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-600 hover:text-gold-700 transition-colors group/btn"
                      >
                        {t("sevas.bookNow")}
                        <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Maha Homa — horizontal reversed */}
            <motion.div variants={cardVariants}>
              <div className="group relative overflow-hidden rounded-2xl bg-white shadow-elevated transition-all duration-500 hover:shadow-xl hover:shadow-gold-500/10">
                <div className="flex flex-col sm:flex-row-reverse">
                  <div className="relative w-full sm:w-2/5 h-48 sm:h-auto overflow-hidden">
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br transition-transform duration-700 ease-out group-hover:scale-105",
                        featuredSevas[2].gradient,
                      )}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.06)_0%,_transparent_60%)]" />
                      <div className="absolute inset-0 bg-gradient-to-l from-black/30 to-transparent" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/20">
                      <Link href="/sevas/book">
                        <Button
                          variant="premium"
                          size="sm"
                          className="scale-90 group-hover:scale-100 transition-transform duration-500 shadow-lg shadow-gold-500/20"
                        >
                          {t("sevas.bookNow")}
                        </Button>
                      </Link>
                    </div>
                    <div className="absolute top-3 right-3 sm:hidden">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/90 text-dark-slate text-[10px] font-semibold shadow-sm">
                        {formatPrice(featuredSevas[2].price)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 p-5 sm:p-6 flex flex-col justify-center">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-script text-2xl sm:text-3xl text-dark-slate leading-none">
                        {featuredSevas[2].name}
                      </h3>
                      <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gold-50 text-gold-700 text-sm font-semibold">
                        {formatPrice(featuredSevas[2].price)}
                      </span>
                    </div>
                    <p className="text-sm text-dark-slate/60 leading-relaxed mb-4">
                      {featuredSevas[2].description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-dark-slate/40">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-50/50 text-gold-600">
                        <Clock className="h-3 w-3" />
                        {featuredSevas[2].duration}
                      </span>
                      <span className="hidden sm:inline-flex items-center gap-1 text-gold-500">
                        <Sparkles className="h-3 w-3" />
                        Fire ritual
                      </span>
                    </div>
                    <div className="mt-4 hidden sm:block">
                      <Link
                        href="/sevas/book"
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-gold-600 hover:text-gold-700 transition-colors group/btn"
                      >
                        {t("sevas.bookNow")}
                        <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <Link
            href="/sevas"
            className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-light transition-colors"
          >
            View All Sacred Services
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
