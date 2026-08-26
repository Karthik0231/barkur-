"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ChevronRight, Clock, IndianRupee, Flame, Sparkles } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { PageBanner } from "@/components/PageBanner"
import { useTranslation } from "@/lib/i18n"
import { getHomas } from "@/lib/data/sevas"
import { useRouter } from "next/navigation"

const ICONS: Record<string, React.ElementType> = { flame: Flame, sparkles: Sparkles }

const GRADIENTS = [
  "from-amber-600 to-orange-700",
  "from-rose-600 to-pink-700",
  "from-purple-600 to-violet-700",
  "from-teal-600 to-emerald-700",
  "from-indigo-600 to-blue-700",
]

export default function HomasPage() {
  const { t, language } = useTranslation()
  const router = useRouter()
  const homas = getHomas(language)

  return (
    <div className="min-h-screen">
      <PageBanner
        title={t("pages.homas.title")}
        eyebrow={t("pages.homas.eyebrow")}
        subtitle={t("pages.homas.subtitle")}
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
            <span className="text-text-primary font-medium">{t("nav.homas")}</span>
          </motion.div>

          <SectionHeading
            title={t("sections.homasS1Title")}
            subtitle={t("sections.homasS1Sub")}
            className="mb-12"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {homas.map((homa, idx) => {
              const Icon = ICONS[homa.icon] || Flame
              const grad = GRADIENTS[idx % GRADIENTS.length]
              return (
                <motion.div
                  key={homa.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <Card variant="elevated" padding="none" hover className="group h-full overflow-hidden">
                    <div className={cn("relative h-44 bg-gradient-to-br flex items-center justify-center overflow-hidden", grad)}>
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="relative z-10 text-center">
                        <Icon className="h-10 w-10 text-white mx-auto mb-2" />
                        <h3 className="text-xl font-heading font-bold text-white">{homa.name}</h3>
                        <Badge variant="secondary" size="sm" className="mt-2">
                          {t("sections.filterHoma")}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="mt-1.5 text-sm text-text-secondary leading-relaxed line-clamp-2">
                        {homa.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm font-semibold text-text-primary">
                          <IndianRupee className="h-3.5 w-3.5" />
                          <span>{homa.price.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-text-muted">
                          <Clock className="h-3 w-3" />
                          <span>{homa.duration} min</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-border/50">
                        <Button
                          variant="gradient"
                          size="sm"
                          className="w-full group/btn"
                          onClick={() => router.push(`/sevas/book/${homa.slug}`)}
                        >
                          {t("common.bookNow")}
                          <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
