"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Clock, IndianRupee, ChevronRight, Check, Shield, Sparkles,
  ArrowLeft, Sun, Droplets, Heart, Star, Flame, Moon, Calendar, Users, AlertCircle
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn, formatPrice } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"
import { AnimatedSection } from "@/components/animated-section"
import { getDailySevas, findSevaBySlug } from "@/lib/data/sevas"

const GRADIENTS = [
  "from-amber-600 to-orange-700", "from-blue-600 to-cyan-700", "from-rose-600 to-pink-700",
  "from-purple-600 to-violet-700", "from-red-600 to-rose-700", "from-teal-600 to-emerald-700",
  "from-pink-600 to-rose-700", "from-orange-700 to-red-800",
]

const ICONS: React.ElementType[] = [Sun, Droplets, Heart, Star, Sparkles, Moon, Flame, Sparkles]

export default function SevaDetailPage() {
  const { t, language } = useTranslation()
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const sevaData = findSevaBySlug(slug)
  const seva = sevaData ? { ...sevaData, name: typeof sevaData.name === "object" ? sevaData.name[language as "kn" | "en"] || sevaData.name.en : sevaData.name, description: typeof sevaData.description === "object" ? sevaData.description[language as "kn" | "en"] || sevaData.description.en : sevaData.description, category: ("category" in sevaData ? sevaData.category : "") || "Seva" } : null

  if (!seva) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-heading font-bold text-primary">{t("sevas.notFound")}</h1>
        <Link href="/sevas"><Button variant="secondary" className="mt-4"><ArrowLeft className="h-4 w-4 mr-1" />{t("sevas.backToSevas")}</Button></Link>
      </div>
    </div>
  )

  const iconIdx = Math.abs(slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % ICONS.length
  const Icon = ICONS[iconIdx]
  const gradient = GRADIENTS[iconIdx]

  return (
    <div className="min-h-screen">
      <section className="relative h-[50vh] min-h-[380px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className={cn("absolute inset-0 bg-gradient-to-r", gradient)} />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='0.15'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <Badge variant="secondary" size="md" className="mb-4">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              {seva.category || "Seva"}
            </Badge>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight"
            >
              {seva.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-warm-white/80 text-lg md:text-xl mt-4 max-w-2xl mx-auto"
            >
              {seva.description}
            </motion.p>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-10" />
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-text-muted mb-8"
          >
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/sevas" className="hover:text-secondary transition-colors">{t("nav.sevas")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{seva.name}</span>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card variant="elevated" padding="lg">
                <div className="flex items-start gap-4 mb-6">
                  <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg", gradient)}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-text-primary">{seva.name}</h2>
                    <p className="text-text-secondary mt-1">{seva.category}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-secondary">
                    <IndianRupee className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-text-muted">{t("sevas.price")}</p>
                      <p className="text-sm font-bold text-primary">{formatPrice(seva.price)}</p>
                    </div>
                  </div>
                  {seva.duration > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-secondary">
                      <Clock className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-xs text-text-muted">{t("sevas.duration")}</p>
                        <p className="text-sm font-bold text-primary">{seva.duration} min</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-secondary">
                    <Users className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-text-muted">{t("sevas.availability")}</p>
                      <p className="text-sm font-bold text-primary">{t("sevas.daily")}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-text-secondary leading-relaxed">{seva.description}</p>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card variant="elevated" padding="lg" className="sticky top-24">
                <div className="text-center">
                  <p className="text-3xl font-heading font-bold text-primary">
                    {formatPrice(seva.price)}
                  </p>
                  <p className="text-sm text-text-muted mt-1">{seva.duration ? `${seva.duration} min` : ""}</p>
                </div>
                <div className="mt-6 space-y-3">
                  <Button variant="gradient" size="lg" className="w-full" onClick={() => router.push("/sevas")}>
                    <Calendar className="h-4 w-4 mr-1" />
                    {t("sevas.bookNow")}
                  </Button>
                  <Link href="/sevas">
                    <Button variant="outline" size="lg" className="w-full">
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      {t("sevas.backToSevas")}
                    </Button>
                  </Link>
                </div>
                <div className="mt-6 p-4 rounded-xl bg-bg-secondary">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{t("sevaDetail.secureBooking")}</p>
                      <p className="text-xs text-text-muted mt-1">{t("sevaDetail.secureBookingDesc")}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
