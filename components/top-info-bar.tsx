"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { motion, useMotionValueEvent, useScroll } from "framer-motion"
import { Bell, MapPin } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { LanguageSwitcher } from "@/lib/i18n/language-switcher"

export function TopInfoBar() {
  const [hidden, setHidden] = useState(false)
  const { scrollY } = useScroll()
  const { t } = useTranslation()
  const lastScrollY = useRef(0)

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = lastScrollY.current
    lastScrollY.current = latest
    if (latest > 100 && latest > prev) {
      setHidden(true)
    } else {
      setHidden(false)
    }
  })

  const linkClass =
    "text-[11px] text-warm-white/80 hover:text-secondary transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-secondary after:transition-all after:duration-300 hover:after:w-full"

  return (
    <motion.div
      animate={{ y: hidden ? "-100%" : 0 }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      className="fixed top-0 left-0 right-0 z-[51] h-[44px] bg-[#6B0F1A] flex items-center px-4 sm:px-6 lg:px-8 shadow-sm"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <motion.span
            animate={{ rotate: [0, 10, -10, 7, -7, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
            className="origin-top inline-flex shrink-0"
          >
            <Bell className="w-3.5 h-3.5 text-secondary" />
          </motion.span>
          <span className="text-[11px] text-warm-white/90 font-heading tracking-wide truncate">
            ಶ್ರೀ ಕಾಳಿಕಾಂಬಾ ದೇವಸ್ಥಾನ
          </span>
        </div>

        <div className="hidden md:flex items-center shrink-0">
          <LanguageSwitcher className="h-6 text-[11px] gap-1 text-warm-white/80" />
        </div>

        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <Link href="/live-darshana" className={`${linkClass} hidden sm:inline-block`}>
            Live Darshana
          </Link>
          <Link href="/seva-status" className={`${linkClass} hidden sm:inline-block`}>
            Seva Status
          </Link>
          <Link href="/location" className={`${linkClass} hidden sm:inline-flex items-center gap-1`}>
            <MapPin className="w-3 h-3" />
            Location
          </Link>
          <Link href="/contact" className={`${linkClass} hidden sm:inline-block`}>
            {t("nav.contact")}
          </Link>
          <Link
            href="/sevas"
            className="text-[11px] font-semibold px-3 py-1 rounded-full bg-secondary/20 text-secondary border border-secondary/40 hover:bg-secondary/30 hover:border-secondary/60 hover:shadow-sm hover:shadow-secondary/20 transition-all duration-200 shrink-0"
          >
            {t("nav.bookSeva")}
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
