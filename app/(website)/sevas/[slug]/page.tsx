"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import {
  Clock, IndianRupee, ChevronRight, Check, Shield, Sparkles,
  ArrowLeft, Sun, Droplets, Heart, Star, Flame, Moon, Calendar, Users, AlertCircle, Loader2
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn, formatPrice } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"
import { AnimatedSection } from "@/components/animated-section"

const GRADIENTS = [
  "from-amber-600 to-orange-700", "from-blue-600 to-cyan-700", "from-rose-600 to-pink-700",
  "from-purple-600 to-violet-700", "from-red-600 to-rose-700", "from-teal-600 to-emerald-700",
  "from-pink-600 to-rose-700", "from-orange-700 to-red-800",
]

const ICONS: React.ComponentType<{ className?: string }>[] = [Sun, Droplets, Heart, Star, Sparkles, Moon, Flame, Sparkles]

const DEFAULT_RULES = [
  "Devotees should be present 15 minutes before the scheduled time",
  "Traditional attire recommended (dhoti for men, saree for women)",
  "Mobile phones must be switched off inside the temple premises",
  "Follow the instructions of the temple priests",
  "Photography is not allowed during the pooja",
]

const DEFAULT_INCLUDES = [
  "Vedic mantra chanting",
  "Flower offerings to the deity",
  "Aarti and blessing",
  "Prasad distribution",
]

export default function SevaDetailPage() {
  const { t } = useTranslation()
  const params = useParams()
  const slug = params.slug as string
  const [activeTab, setActiveTab] = useState(0)
  const [seva, setSeva] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/sevas/${slug}`)
      .then((r) => r.json())
      .then((res) => { if (res.success) setSeva(res.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>

  if (!seva) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-heading font-bold text-primary">{t("sevas.notFound")}</h1>
        <Link href="/sevas"><Button variant="secondary" className="mt-4"><ArrowLeft className="h-4 w-4 mr-1" />{t("sevas.backToSevas")}</Button></Link>
      </div>
    </div>
  )

  const Icon = ICONS[Math.abs(slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % ICONS.length]
  const gradient = GRADIENTS[Math.abs(slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % GRADIENTS.length]

  return (
    <div className="min-h-screen">
      <section className="relative h-[50vh] min-h-[380px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={seva.image}
            alt={seva.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-primary-dark/95" />
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
              {seva.category?.name || seva.category || "Seva"}
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
              {seva.description || seva.shortDescription}
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
                    <p className="text-text-secondary mt-1">{seva.category?.name || seva.category || ""}</p>
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
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-secondary">
                    <Clock className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-text-muted">{t("sevas.duration")}</p>
                      <p className="text-sm font-bold text-primary">{seva.duration ? `${seva.duration} min` : "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-secondary">
                    <Users className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-text-muted">{t("sevas.availability")}</p>
                      <p className="text-sm font-bold text-primary">{t("sevas.daily")}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 mb-6 border-b border-border">
                  {["sevaDetail.description", "sevaDetail.includes", "sevaDetail.rules"].map((key, idx) => {
                    const label = t(key)
                    return (
                    <button
                      key={key}
                      onClick={() => setActiveTab(idx)}
                      className={cn(
                        "px-4 py-3 text-sm font-medium transition-all relative",
                        activeTab === idx
                          ? "text-primary"
                          : "text-text-muted hover:text-text-primary",
                      )}
                    >
                      {label}
                      {activeTab === idx && (
                        <motion.div
                          layoutId="tab-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                        />
                      )}
                    </button>
                  )})}
                </div>

                <div className="min-h-[200px]">
                  {activeTab === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="text-text-secondary leading-relaxed">{seva.description || seva.longDescription || ""}</p>
                    </motion.div>
                  )}
                  {activeTab === 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      {(seva.includes || DEFAULT_INCLUDES).map((item: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Check className="h-3.5 w-3.5 text-primary" />
                          </div>
                          <span className="text-text-secondary">{item}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                  {activeTab === 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      {(seva.rules || DEFAULT_RULES).map((rule: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100">
                            <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                          </div>
                          <span className="text-text-secondary">{rule}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card variant="elevated" padding="lg" className="sticky top-24">
                <div className="text-center">
                  <p className="text-3xl font-heading font-bold text-primary">
                    {formatPrice(seva.price)}
                  </p>
                  <p className="text-sm text-text-muted mt-1">{seva.duration}</p>
                </div>
                <div className="mt-6 space-y-3">
                  <Link href={`/sevas/book/${slug}`}>
                    <Button variant="gradient" size="lg" className="w-full">
                      <Calendar className="h-4 w-4 mr-1" />
                      {t("sevas.bookNow")}
                    </Button>
                  </Link>
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

          <RelatedSevas slug={slug} t={t} />
        </div>
      </section>
    </div>
  )
}

function RelatedSevas({ slug, t }: { slug: string; t: (key: string) => string }) {
  const [sevas, setSevas] = useState<any[]>([])
  useEffect(() => {
    fetch("/api/sevas?limit=4").then(r => r.json()).then(res => {
      if (res.success) setSevas(res.data.sevas.filter((s: any) => s.slug !== slug).slice(0, 3))
    }).catch(() => {})
  }, [slug])
  if (!sevas.length) return null
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-heading font-bold text-text-primary mb-8">{t("sevaDetail.relatedSevas")}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sevas.map((s, idx) => {
          const RelIcon = ICONS[Math.abs((s.slug || "").split("").reduce((a: number, c: string) => a + c.charCodeAt(0), 0)) % ICONS.length]
          return (
            <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Link href={`/sevas/${s.slug || s.id}`}>
                <Card variant="elevated" hover padding="md" className="h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br", GRADIENTS[Math.abs((s.slug || "").split("").reduce((a: number, c: string) => a + c.charCodeAt(0), 0)) % GRADIENTS.length])}>
                      <RelIcon className="h-5 w-5 text-white" />
                    </div>
                    <div><h3 className="font-heading font-bold text-text-primary">{s.name}</h3><p className="text-xs text-text-muted">{s.category?.name || ""}</p></div>
                  </div>
                  <p className="text-sm text-text-secondary line-clamp-2">{s.description || s.shortDescription}</p>
                  <div className="mt-3 flex items-center gap-3 text-sm">
                    <span className="font-semibold text-primary">{formatPrice(Number(s.price))}</span>
                    <span className="text-text-muted">{s.duration ? `${s.duration} min` : ""}</span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
