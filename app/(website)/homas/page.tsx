"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, ChevronRight, Clock, IndianRupee } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { PageBanner } from "@/components/PageBanner"
import { useTranslation } from "@/lib/i18n"

export default function HomasPage() {
  const { t } = useTranslation()
  const [sevas, setSevas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/sevas?limit=50")
      .then(res => res.json())
      .then(data => {
        const filtered = (data.sevas || []).filter((s: any) => s.category?.slug === "homas")
        setSevas(filtered)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

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

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sevas.map((seva, idx) => (
                <motion.div
                  key={seva.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <Card variant="elevated" padding="none" hover className="group h-full overflow-hidden">
                    <div className="relative h-44 overflow-hidden">
                      {seva.images?.[0] ? (
                        <Image
                          src={seva.images[0]}
                          alt={seva.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-secondary/60" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" size="sm">
                          {t("sections.filterHoma")}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-heading font-bold text-text-primary group-hover:text-primary transition-colors">
                        {seva.name}
                      </h3>
                      <p className="mt-1.5 text-sm text-text-secondary leading-relaxed line-clamp-2">
                        {seva.shortDescription || seva.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm font-semibold text-text-primary">
                          <IndianRupee className="h-3.5 w-3.5" />
                          <span>{Number(seva.price).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-text-muted">
                          <Clock className="h-3 w-3" />
                          <span>{seva.duration ? `${seva.duration} min` : "—"}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-border/50">
                        <Link href={`/sevas/${seva.slug}`}>
                          <Button variant="gradient" size="sm" className="w-full group/btn">
                            {t("common.bookNow")}
                            <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
