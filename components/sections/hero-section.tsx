"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Link from "next/link"
import { Calendar, Clock, Sun, Moon, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"
import { fetchPanchanga, type PanchangaData } from "@/lib/panchanga"
import { TEMPLE_TIMINGS } from "@/lib/constants"

const particles = [
  { x: "10%", y: "20%", size: 3, delay: 0, duration: 7 },
  { x: "80%", y: "25%", size: 2, delay: 1.2, duration: 9 },
  { x: "22%", y: "70%", size: 4, delay: 0.6, duration: 6 },
  { x: "76%", y: "65%", size: 2, delay: 1.8, duration: 8 },
  { x: "50%", y: "12%", size: 3, delay: 2.4, duration: 7 },
  { x: "38%", y: "80%", size: 2, delay: 0.3, duration: 9 },
  { x: "64%", y: "74%", size: 3, delay: 1.5, duration: 6 },
  { x: "92%", y: "40%", size: 2, delay: 2, duration: 8 },
  { x: "8%", y: "50%", size: 3, delay: 2.8, duration: 7 },
  { x: "45%", y: "45%", size: 2, delay: 3.2, duration: 9 },
]

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"])
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3])
  const [panchanga, setPanchanga] = useState<PanchangaData | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    fetchPanchanga().then(setPanchanga)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#5B0E16] to-[#431017]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/6 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-secondary/8 via-secondary/3 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(212, 175, 55, 1) 1px, transparent 0)",
          backgroundSize: "48px 48px",
        }}
      />

      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-secondary/25 pointer-events-none"
          style={{ width: p.size, height: p.size, left: p.x, top: p.y }}
          animate={{
            y: [0, -30, -70],
            opacity: [0.1, 0.3, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#431017] via-[#431017]/60 to-transparent pointer-events-none z-[2]" />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,67,0.05)_0%,transparent_70%)]" />
      </motion.div>

      <motion.div
        className="relative z-10 container mx-auto h-screen flex flex-col px-4 sm:px-6 lg:px-8"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="pt-20 lg:pt-28"
        >
          <h1 className="font-script text-4xl sm:text-5xl md:text-6xl text-secondary/85 leading-tight">
            ಶ್ರೀ ಕಾಳಿಕಾಂಬಾ ದೇವಸ್ಥಾನ
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-warm-white/40 font-light tracking-[0.15em] uppercase">
            Sri Kalikamba Temple &mdash; Barkur, Udupi
          </p>
        </motion.div>

        <div className="flex-1 flex flex-col justify-center -mt-16 lg:-mt-28 max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] tracking-tight"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-warm-white to-gold-100">
              An 800-Year Legacy
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-200 to-secondary">
              of Divine Grace
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg md:text-xl text-warm-white/45 font-light leading-relaxed"
          >
            Nestled in the sacred town of Barkur, this ancient shrine has stood as a beacon
            of devotion for over eight centuries &mdash; where the divine presence of
            Sri Kalikamba Devi blesses every soul who seeks her grace.
          </motion.p>
        </div>

        <div className="pb-12 lg:pb-16 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-3 sm:gap-4"
          >
            <Link href="/sevas">
              <Button variant="primary" size="lg" className="shadow-xl shadow-secondary/15 ring-1 ring-secondary/20">
                <Calendar className="h-4 w-4" />
                Book Seva
              </Button>
            </Link>
            <Link href="/donations">
              <Button variant="outline" size="lg" className="border-secondary/30 text-gold-300 hover:bg-secondary/10 hover:text-gold-200 hover:border-secondary/60">
                <ArrowRight className="h-4 w-4" />
                Donate
              </Button>
            </Link>
            <Link href="/live-darshana">
              <Button variant="ghost" size="lg" className="text-gold-300/60 hover:text-gold-200 hover:bg-white/5">
                <Sun className="h-4 w-4" />
                Live Darshana
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="glass-gold rounded-2xl p-5 sm:p-6 w-full lg:w-80"
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4 text-secondary" />
                <h3 className="text-warm-white/90 font-heading text-sm font-semibold tracking-wide">
                  Temple Timings
                </h3>
              </div>
              <div className="space-y-2.5 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-warm-white/60">
                    <Sun className="h-3.5 w-3.5 text-secondary/60" />
                    <span className="text-xs">Morning</span>
                  </div>
                  <span className="text-xs font-medium text-warm-white/80">{TEMPLE_TIMINGS.morning}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-warm-white/60">
                    <Moon className="h-3.5 w-3.5 text-secondary/60" />
                    <span className="text-xs">Evening</span>
                  </div>
                  <span className="text-xs font-medium text-warm-white/80">{TEMPLE_TIMINGS.evening}</span>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent my-4" />

              <div className="mb-3">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-3.5 w-3.5 text-secondary" />
                  <h3 className="text-warm-white/90 font-heading text-sm font-semibold tracking-wide">
                    Today&apos;s Panchanga
                  </h3>
                </div>
                {!panchanga ? (
                  <div className="space-y-2">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="h-3 bg-white/5 rounded animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-warm-white/50">Tithi</span>
                      <span className="text-xs font-medium text-warm-white/80">{panchanga.tithi}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-warm-white/50">Nakshatra</span>
                      <span className="text-xs font-medium text-warm-white/80">{panchanga.nakshatra}</span>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/panchanga"
                className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-secondary-light transition-colors mt-2 group"
              >
                View Panchanga
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 pointer-events-none z-[3]">
        <svg viewBox="0 0 1440 160" fill="none" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0 80 C200 80, 400 60, 520 45 L540 30 L560 45 C680 60, 760 60, 880 45 L900 30 L920 45 C1040 60, 1240 80, 1440 80 L1440 160 L0 160 Z"
            fill="#2A0408"
            opacity="0.4"
          />
          <path
            d="M0 100 C250 100, 450 75, 540 58 L560 40 L580 58 C680 75, 760 75, 860 58 L880 40 L900 58 C1050 75, 1190 100, 1440 100 L1440 160 L0 160 Z"
            fill="#431017"
            opacity="0.7"
          />
          <path
            d="M0 125 C300 125, 480 95, 555 75 L560 60 L565 75 C660 95, 780 95, 875 75 L880 60 L885 75 C960 95, 1140 125, 1440 125 L1440 160 L0 160 Z"
            fill="#5B0E16"
            opacity="0.9"
          />
        </svg>
      </div>
    </section>
  )
}
