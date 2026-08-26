"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ChevronRight, Clock, IndianRupee, Sparkles, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { PageBanner } from "@/components/PageBanner"
import { useTranslation } from "@/lib/i18n"
import { useRouter } from "next/navigation"
import { getDailySevas } from "@/lib/data/sevas"

const GRADIENTS = [
  "from-amber-600 to-orange-700",
  "from-blue-600 to-cyan-700",
  "from-rose-600 to-pink-700",
  "from-purple-600 to-violet-700",
  "from-teal-600 to-emerald-700",
]

export default function SpecialSevasPage() {
  const { t, language } = useTranslation()
  const router = useRouter()
  const sevas = getDailySevas(language).filter((s) => s.price >= 300)

  return (
    <div className="min-h-screen">
      <PageBanner
        title={t("pages.specialSevas.title")}
        eyebrow={t("pages.specialSevas.eyebrow")}
        subtitle={t("pages.specialSevas.subtitle")}
      />

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-text-muted mb-10"
          >
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.specialSevas")}</span>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sevas.map((seva, idx) => (
              <motion.div
                key={seva.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
              >
                <Card variant="elevated" padding="none" hover className="group h-full overflow-hidden">
                  <div className={cn("relative h-48 bg-gradient-to-br flex items-center justify-center overflow-hidden", GRADIENTS[idx % GRADIENTS.length])}>
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="relative z-10 text-center text-white">
                      <Sparkles className="h-10 w-10 mx-auto mb-2 opacity-90" />
                      <h3 className="text-xl font-heading font-bold">{seva.name}</h3>
                      <Badge variant="secondary" size="sm" className="mt-2">
                        {seva.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="mt-1.5 text-sm text-text-secondary leading-relaxed line-clamp-2">
                      {seva.description}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                      {seva.duration > 0 && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-bg-secondary text-text-muted">
                          <Clock className="h-3 w-3" />
                          {seva.duration} min
                        </span>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-lg font-bold font-heading text-primary">
                        <IndianRupee className="h-4 w-4" />
                        {seva.price.toLocaleString("en-IN")}
                      </span>
                      <Button
                        variant="gradient"
                        size="sm"
                        className="group/btn"
                        onClick={() => router.push(`/sevas/book/${seva.slug}`)}
                      >
                        {t("common.bookNow")}
                        <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
