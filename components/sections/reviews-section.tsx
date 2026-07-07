"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Star, ThumbsUp, Quote } from "lucide-react"
import { cn } from "@/lib/utils"

const reviews = [
  {
    name: "Aarav Mehta",
    rating: 5,
    text: "One of the most peaceful temples I have ever visited. The architecture is magnificent and the atmosphere is filled with positive energy. A must-visit spiritual destination in Udupi.",
    date: "2 weeks ago",
    source: "Google",
  },
  {
    name: "Sneha Kulkarni",
    rating: 5,
    text: "The temple management has done an excellent job with the online seva booking system. Very convenient for devotees living outside Karnataka. The priests are very knowledgeable.",
    date: "1 month ago",
    source: "Google",
  },
  {
    name: "Vikram Pai",
    rating: 5,
    text: "Visited during Navaratri and was blown away by the celebrations. The temple was beautifully decorated and the cultural programs were top-notch. Will visit again next year!",
    date: "3 months ago",
    source: "Google",
  },
  {
    name: "Rohini Desai",
    rating: 4,
    text: "A beautiful ancient temple with a rich history. The gopuram architecture is stunning. The temple tank is well maintained. Wish they had more parking space though.",
    date: "2 months ago",
    source: "Google",
  },
]

const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length

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
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

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
                <span className="text-xs text-dark-slate/50 mt-0.5">Google Reviews</span>
              </div>
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-dark-slate">
            What Devotees Say
          </h2>
          <p className="mt-2 text-sm text-dark-slate/50">
            Real reviews from visitors who experienced divine grace
          </p>
        </motion.div>

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
                  <span>Found helpful</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
            Leave a Review on Google
          </a>
        </motion.div>
      </div>
    </section>
  )
}
