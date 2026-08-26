"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import {
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion"
import { Bell, MapPin, Sparkles } from "lucide-react"

import { useTranslation } from "@/lib/i18n"
import { LanguageSwitcher } from "@/lib/i18n/language-switcher"

export function TopInfoBar() {
  const [hidden, setHidden] = useState(false)

  const { scrollY } = useScroll()
  const { t } = useTranslation()

  const lastScrollY = useRef(0)

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current
    lastScrollY.current = latest

    if (latest > 80 && latest > previous) {
      setHidden(true)
    } else {
      setHidden(false)
    }
  })

  return (
    <motion.div
      animate={{
        y: hidden ? "-100%" : 0,
      }}
      transition={{
        duration: 0.35,
        ease: [0.32, 0.72, 0, 1],
      }}
      className="
        fixed
        inset-x-0
        top-0
        z-[60]
        h-[40px]
        bg-[#6B0F1A]
        border-b
        border-[#DDB25C]/10
      "
    >
      <div
        className="
          mx-auto
          flex
          h-full
          w-full
          max-w-[1440px]
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-8
          xl:px-10
        "
      >
        {/* -------------------------------------------------------------- */}
        {/* Left — small temple/update info                                */}
        {/* -------------------------------------------------------------- */}

        <div className="flex min-w-0 items-center gap-2">
          <motion.div
            animate={{
              rotate: [0, 8, -8, 5, -5, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 5,
              ease: "easeInOut",
            }}
            className="
              flex
              h-5
              w-5
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#DDB25C]/[0.10]
            "
          >
            <Bell className="h-2.5 w-2.5 text-[#F6E2A0]" />
          </motion.div>

          <span
            className="
              truncate
              text-[10px]
              font-medium
              tracking-wide
              text-white/70
            "
          >
            ಶ್ರೀ ಕಾಳಿಕಾಂಬಾ ದೇವಸ್ಥಾನ
          </span>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* Right — utilities                                               */}
        {/* -------------------------------------------------------------- */}

        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Contact */}
          <Link
            href="/contact"
            className="
              group
              hidden
              items-center
              gap-1.5
              rounded-full
              px-2
              py-1
              text-[10px]
              font-medium
              text-white/60
              transition-colors
              duration-200
              hover:text-[#F6E2A0]
              sm:inline-flex
            "
          >
            <MapPin className="h-3 w-3 text-[#DDB25C]/70" />

            <span>{t("nav.contact")}</span>
          </Link>

          {/* Divider */}
          <span
            className="
              hidden
              h-4
              w-px
              bg-white/10
              sm:block
            "
          />

          {/* Language */}
          {/* <LanguageSwitcher
            className="
              h-7
              min-w-[72px]
              border-transparent
              bg-transparent
              px-2
              text-[9px]
              shadow-none
              hover:border-[#DDB25C]/15
              hover:bg-white/[0.05]
            "
          /> */}

          {/* Divider */}
          {/* <span className="h-4 w-px bg-white/10" />  */}

          {/* Book Seva */}
          <Link
            href="/sevas"
            className="
              group
              inline-flex
              h-7
              items-center
              gap-1.5
              rounded-full
              border
              border-[#DDB25C]/30
              bg-[#DDB25C]/[0.10]
              px-2.5
              text-[9px]
              font-semibold
              text-[#F6E2A0]
              transition-all
              duration-200
              hover:border-[#DDB25C]/50
              hover:bg-[#DDB25C]/[0.16]
            "
          >
            <Sparkles
              className="
                h-2.5
                w-2.5
                text-[#DDB25C]
              "
            />

            <span>{t("nav.bookSeva")}</span>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}