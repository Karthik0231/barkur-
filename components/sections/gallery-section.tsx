"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Camera, Sparkles } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import type { Gallery } from "@/lib/types"

const ScrollRow = ({ items, direction = "left", speed = 30 }: { items: Gallery[]; direction?: "left" | "right"; speed?: number }) => {
  const duplicatedItems = [...items, ...items]
  
  return (
    <div className="relative overflow-hidden py-2">
      <motion.div
        className="flex gap-4"
        animate={{
          x: direction === "left" ? [0, -1500] : [-1500, 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        {duplicatedItems.map((item, index) => {
          const imagesArr = Array.isArray(item.images) ? item.images : []
          const src = item.image || (imagesArr[0] as string) || ""
          return (
            <div
              key={`${item.id}-${direction}-${index}`}
              className="relative flex-shrink-0 w-[280px] sm:w-[320px] h-[180px] sm:h-[200px] rounded-xl overflow-hidden shadow-lg group"
            >
              {src && <img
                src={src}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}

export function GallerySection({ galleryItems }: { galleryItems: Gallery[] }) {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" })

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-24 overflow-hidden bg-gradient-to-b from-warm-ivory to-sand-50"
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-gold-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-12 sm:mb-16"
        >
          <div className="flex items-center gap-2 mb-3">
            <Camera className="w-4 h-4 text-gold-600" />
            <span className="text-xs uppercase tracking-[0.25em] text-gold-700 font-semibold">
              {t("home.templeMoments")}
            </span>
          </div>
          <h2 className="section-heading text-dark-slate">
            {t("home.templeGallery")}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-dark-slate/60 max-w-md font-light">
            {t("home.gallerySub")}
          </p>
        </motion.div>

        {/* Auto-Scrolling Rows */}
        {galleryItems.length > 0 && (
          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
            <ScrollRow items={galleryItems.slice(0, 6)} direction="right" speed={25} />
            <ScrollRow items={galleryItems.slice(Math.floor(galleryItems.length / 4), Math.floor(galleryItems.length / 4) + 6)} direction="left" speed={35} />
            <ScrollRow items={galleryItems.slice(Math.floor(galleryItems.length / 2), Math.floor(galleryItems.length / 2) + 6)} direction="right" speed={30} />
          </div>
        )}

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-gold-600 to-gold-700 text-white text-sm sm:text-base font-semibold shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            {t("home.exploreFullGallery")}
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
