"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Image as ImageIcon } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

import { cn } from "@/lib/utils"

const items = [
  {
    gradient: "from-maroon-900 via-maroon-800 to-[#2A0408]",
    label: "Ancient Gopuram Architecture",
    category: "Architecture",
    height: "h-80 lg:h-96",
    gridSpan: "lg:col-span-2 lg:row-span-2",
    aspect: "aspect-[4/5] lg:aspect-auto",
  },
  {
    gradient: "from-[#3A2812] via-gold-800 to-[#2E1C11]",
    label: "Navaratri Mahotsava",
    category: "Festivals",
    height: "h-72 lg:h-80",
    gridSpan: "lg:col-span-1 lg:row-span-2",
    aspect: "aspect-[3/4] lg:aspect-auto",
  },
  {
    gradient: "from-maroon-800 via-[#5B0E16] to-gold-900",
    label: "Morning Abhishekam",
    category: "Daily Rituals",
    height: "h-48 lg:h-52",
    gridSpan: "lg:col-span-1 lg:row-span-1",
    aspect: "aspect-[4/3] lg:aspect-auto",
  },
  {
    gradient: "from-gold-900 via-[#75572A] to-maroon-800",
    label: "Evening Deepa Aarti",
    category: "Night Aarti",
    height: "h-56 lg:h-60",
    gridSpan: "lg:col-span-1 lg:row-span-1",
    aspect: "aspect-[1/1] lg:aspect-auto",
  },
  {
    gradient: "from-[#2A0408] via-maroon-900 to-gold-800",
    label: "Sculpted Pillar Details",
    category: "Architecture",
    height: "h-40 lg:h-44",
    gridSpan: "lg:col-span-1 lg:row-span-1",
    aspect: "aspect-[3/2] lg:aspect-auto",
  },
  {
    gradient: "from-[#54401E] via-gold-700 to-[#3A2812]",
    label: "Rathotsava Celebration",
    category: "Festivals",
    height: "h-36 lg:h-36",
    gridSpan: "lg:col-span-1 lg:row-span-1",
    aspect: "aspect-[1/1] lg:aspect-auto",
  },
  {
    gradient: "from-maroon-950 via-[#431017] to-[#2A0408]",
    label: "Nivedyam Offering",
    category: "Daily Rituals",
    height: "h-32 lg:h-32",
    gridSpan: "lg:col-span-1 lg:row-span-1",
    aspect: "aspect-[4/3] lg:aspect-auto",
  },
]

export function GallerySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })

  return (
    <section
      ref={sectionRef}
      className="relative py-24 sm:py-32 overflow-hidden bg-[#0A0604]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.02)_0%,transparent_50%)]" />
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(212,175,55,0.5) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-16 sm:mb-20"
        >
          <h2 className="section-heading text-gold-400">
            Temple Gallery
          </h2>
          <div className="mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-[1440px] px-0 sm:px-4 lg:px-6">
        <div className="lg:grid lg:grid-cols-4 lg:gap-4 lg:auto-rows-min">
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={cn(
                "group relative overflow-hidden cursor-pointer",
                item.height,
                item.aspect,
                item.gridSpan,
                "mb-4 lg:mb-0",
              )}
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br transition-all duration-700 ease-out",
                  "group-hover:scale-105",
                  item.gradient,
                )}
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              <motion.div
                initial={{ y: "100%" }}
                whileHover={{ y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"
              >
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-gold-400/60 font-medium">
                    {item.category}
                  </span>
                  <p className="text-sm sm:text-base text-warm-white/90 font-heading mt-1 leading-tight">
                    {item.label}
                  </p>
                  <div className="mt-3 h-px w-10 bg-gradient-to-r from-gold-500/40 to-transparent" />
                </div>
              </motion.div>

              <div className="absolute top-4 left-4 sm:top-5 sm:left-5">
                <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center">
                  <ImageIcon className="w-3.5 h-3.5 text-gold-400/50" />
                </div>
              </div>

              <div className="absolute inset-0 ring-1 ring-inset ring-white/0 group-hover:ring-gold-500/20 transition-all duration-500" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.2em] text-gold-500/40 hover:text-gold-400 transition-colors font-medium"
          >
            View Full Gallery
            <svg
              className="w-3 h-3 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 12 12"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M1 6h10M7 2l4 4-4 4" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
