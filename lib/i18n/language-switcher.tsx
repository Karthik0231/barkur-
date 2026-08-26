"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Languages, ChevronDown } from "lucide-react"
import { useTranslation } from "./index"
import { cn } from "@/lib/utils"

export function LanguageSwitcher({
  className,
}: {
  className?: string
}) {
  const { language, setLanguage } = useTranslation()

  const isKannada = language === "kn"

  const toggle = () => {
    setLanguage(isKannada ? "en" : "kn")
  }

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileTap={{ scale: 0.94 }}
      whileHover={{ y: -1 }}
      className={cn(
        `
          group
          relative
          inline-flex
          h-9
          min-w-[78px]
          items-center
          justify-center
          gap-1.5
          overflow-hidden
          rounded-full
          border
          border-[#DDB25C]/20
          bg-[#6B0F1A]/[0.12]
          px-2.5
          text-[#F6E2A0]
          shadow-[0_4px_15px_rgba(0,0,0,0.12)]
          transition-all
          duration-300
          hover:border-[#DDB25C]/40
          hover:bg-[#6B0F1A]/[0.20]
          hover:shadow-[0_6px_20px_rgba(107,15,26,0.18)]
          active:shadow-none
        `,
        className
      )}
      aria-label={`Switch language to ${isKannada ? "English" : "Kannada"
        }`}
    >
      {/* -------------------------------------------------------------- */}
      {/* Subtle gold glow                                               */}
      {/* -------------------------------------------------------------- */}

      <span
        className="
          pointer-events-none
          absolute
          inset-0
          rounded-full
          bg-gradient-to-r
          from-transparent
          via-[#DDB25C]/[0.06]
          to-transparent
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />

      {/* -------------------------------------------------------------- */}
      {/* Active pill                                                     */}
      {/* -------------------------------------------------------------- */}

      <motion.span
        layout
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 28,
        }}
        className="
          absolute
          left-1
          top-1
          bottom-1
          w-[34px]
          rounded-full
          bg-gradient-to-b
          from-[#8A1420]
          to-[#5A0C15]
          border
          border-[#DDB25C]/20
          shadow-[0_2px_8px_rgba(0,0,0,0.22)]
        "
        style={{
          x: isKannada ? 0 : 38,
        }}
      />

      {/* -------------------------------------------------------------- */}
      {/* Language icon                                                   */}
      {/* -------------------------------------------------------------- */}

      <span
        className="
          relative
          z-10
          flex
          h-6
          w-6
          items-center
          justify-center
          rounded-full
          text-[#DDB25C]
        "
      >
        <Languages className="h-3.5 w-3.5" />
      </span>

      {/* -------------------------------------------------------------- */}
      {/* Language text                                                   */}
      {/* -------------------------------------------------------------- */}

      <AnimatePresence mode="wait">
        <motion.span
          key={language}
          initial={{
            opacity: 0,
            y: 5,
            filter: "blur(3px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            y: -5,
            filter: "blur(3px)",
          }}
          transition={{
            duration: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            z-10
            min-w-[28px]
            text-center
            text-[10px]
            font-bold
            tracking-wide
            text-[#F6E2A0]
          "
        >
          {isKannada ? "ಕನ್ನಡ" : "EN"}
        </motion.span>
      </AnimatePresence>

      {/* -------------------------------------------------------------- */}
      {/* Chevron                                                         */}
      {/* -------------------------------------------------------------- */}

      <ChevronDown
        className="
          relative
          z-10
          h-3
          w-3
          text-[#DDB25C]/50
          transition-transform
          duration-300
          group-hover:rotate-180
        "
      />
    </motion.button>
  )
}