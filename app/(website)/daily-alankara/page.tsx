"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, Video, Users, Sparkles, Calendar, Clock, Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageBanner } from "@/components/PageBanner"
import { AnimatedSection } from "@/components/animated-section"
import { useTranslation } from "@/lib/i18n"

interface AlankaraData {
  id: string
  date: string
  videoUrl: string
  specialNote: string
  partyNames: string[]
  isActive: boolean
}

function extractYouTubeEmbed(url: string): string {
  if (!url) return ""
  // Handle youtube.com/watch?v= format
  const match = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
  if (match) return `https://www.youtube.com/embed/${match[1]}`
  // Handle youtu.be/ format
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`
  // Already embed format or other
  return url
}

export default function DailyAlankaraPage() {
  const { t } = useTranslation()
  const [alankara, setAlankara] = useState<AlankaraData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/daily-alankara?action=today")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.alankara) {
          setAlankara(json.data.alankara)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const today = new Date()
  const todayStr = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const embedUrl = alankara?.videoUrl ? extractYouTubeEmbed(alankara.videoUrl) : ""

  return (
    <div className="min-h-screen">
      <PageBanner
        title={t("dailyAlankara.title")}
        eyebrow={t("dailyAlankara.eyebrow")}
        subtitle={t("dailyAlankara.subtitle")}
      />

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-text-muted mb-10"
          >
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("dailyAlankara.title")}</span>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-10 w-10 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
            </div>
          ) : !alankara ? (
            <Card variant="elevated" className="p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-bg-secondary flex items-center justify-center mb-4">
                <Video className="h-8 w-8 text-text-muted" />
              </div>
              <h3 className="text-xl font-heading font-bold text-text-primary mb-2">
                {t("dailyAlankara.noData")}
              </h3>
              <p className="text-text-muted">{t("dailyAlankara.checkBack")}</p>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Today's Date Header */}
              <AnimatedSection>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-secondary/10 to-gold-400/10">
                    <Calendar className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Today&apos;s Alankara</p>
                    <p className="text-lg font-heading font-bold text-primary">{todayStr}</p>
                  </div>
                </div>
              </AnimatedSection>

              {/* Video Section */}
              {embedUrl && (
                <AnimatedSection delay={0.1}>
                  <Card variant="elevated" padding="none" className="overflow-hidden">
                    <div className="relative aspect-video bg-dark-slate">
                      <iframe
                        src={embedUrl}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Daily Alankara Video"
                      />
                    </div>
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <Video className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-text-primary">{t("dailyAlankara.liveAlankara")}</h3>
                          <p className="text-xs text-text-muted">{t("dailyAlankara.watchingLive")}</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1.5">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                          </span>
                          <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">Live</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </AnimatedSection>
              )}

              {/* Current Day Special */}
              {alankara.specialNote && (
                <AnimatedSection delay={0.2}>
                  <Card variant="glass" className="p-6 sm:p-8 border-l-4 border-secondary">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shrink-0 shadow-sm">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-heading font-bold text-primary mb-2">
                          {t("dailyAlankara.todaySpecial")}
                        </h3>
                        <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                          {alankara.specialNote}
                        </p>
                      </div>
                    </div>
                  </Card>
                </AnimatedSection>
              )}

              {/* Nitya Pooja Seva Parties */}
              {alankara.partyNames.length > 0 && (
                <AnimatedSection delay={0.3}>
                  <Card variant="elevated" padding="lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-heading font-bold text-text-primary">
                          {t("dailyAlankara.nityaPoojaParties")}
                        </h3>
                        <p className="text-xs text-text-muted">{t("dailyAlankara.todaysDevotees")}</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      {alankara.partyNames.map((name, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-center gap-3 p-4 rounded-xl bg-bg-secondary/60 border border-border/40 hover:bg-bg-secondary/80 transition-all"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/10 text-secondary text-xs font-bold shrink-0">
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-text-primary truncate">{name}</p>
                            <p className="text-[10px] text-text-muted uppercase tracking-wider">Nitya Pooja Party</p>
                          </div>
                          <Star className="h-3.5 w-3.5 text-secondary/40 shrink-0 ml-auto" />
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </AnimatedSection>
              )}

              {/* CTA */}
              <AnimatedSection delay={0.4}>
                <div className="flex flex-wrap gap-3 justify-center pt-4">
                  <Link href="/sevas">
                    <Button variant="primary" iconLeft={<Sparkles className="h-4 w-4" />}>
                      {t("dailyAlankara.bookSeva")}
                    </Button>
                  </Link>
                  <Link href="/panchanga">
                    <Button variant="outline" iconLeft={<Calendar className="h-4 w-4" />}>
                      {t("dailyAlankara.viewPanchanga")}
                    </Button>
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
