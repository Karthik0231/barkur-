"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { Star, ThumbsUp, Quote } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

interface ReviewItem {
  name: string
  rating: number
  text: string
  date: string
  source?: string
}

function ReviewStars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5",
            i < rating ? "fill-gold-400 text-gold-400" : "fill-none text-border"
          )}
        />
      ))}
    </div>
  )
}

export function ReviewsSection() {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/testimonials?isApproved=true&limit=6")
      .then((r) => r.json())
      .then((d) => {
        const list = d.data?.testimonials || d.data || d || []
        setReviews(Array.isArray(list) ? list : [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
    : 0

  return (
    <section ref={ref} className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-gold-50/20 to-warm-ivory">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="text-3xl sm:text-4xl font-heading font-bold text-dark-slate">
                {averageRating.toFixed(1)}
              </span>
              <div className="flex flex-col items-start">
                <ReviewStars rating={Math.round(averageRating)} size="md" />
                <span className="text-xs text-dark-slate/50 mt-0.5">{t("reviews.googleReviews")}</span>
              </div>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-dark-slate">
            {t("reviews.whatDevoteesSay")}
          </h2>
          <p className="mt-2 text-sm text-dark-slate/50">
            {t("reviews.subtitle")}
          </p>
        </motion.div>

        {loading && (
          <div className="flex justify-center py-16">
            <span className="text-sm text-dark-slate/60">{t("common.loading")}</span>
          </div>
        )}
        {!loading && reviews.length === 0 && (
          <div className="flex justify-center py-16 text-center">
            <span className="text-sm text-dark-slate/60">{t("common.noResults")}</span>
          </div>
        )}
        {!loading && reviews.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="group h-full rounded-2xl border border-border bg-white p-5 shadow-premium transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gold-500 to-amber-400 text-white text-sm font-bold shadow-md">
                      {review.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-dark-slate">{review.name}</h4>
                      <span className="text-[10px] text-dark-slate/50">{review.date}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-dark-slate/50 bg-gold-50 px-2 py-0.5 rounded-full">
                    {review.source}
                  </span>
                </div>

                <ReviewStars rating={review.rating} />

                <p className="mt-3 text-sm text-dark-slate/60 leading-relaxed">
                  &ldquo;{review.text}&rdquo;
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-dark-slate/40">
                  <ThumbsUp className="h-3 w-3" />
                  <span>{t("reviews.foundHelpful")}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <a
            href="https://g.page/r/CeXPPsN_8KfDEAI/review"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors"
          >
            <Quote className="h-3.5 w-3.5" />
            {t("reviews.leaveReview")}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
