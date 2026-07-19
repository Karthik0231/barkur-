"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle } from "lucide-react"
import { TEMPLE_PHONE } from "@/lib/constants"
import { useTranslation } from "@/lib/i18n"

export function WhatsAppFloat() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 200)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const phone = TEMPLE_PHONE.replace(/[\s\-]/g, "")
  const waUrl = `https://wa.me/${phone.replace(/^\+/, "")}`

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="group fixed bottom-6 right-6 z-50 flex items-center gap-2"
          aria-label={t("common.chatWithUsWhatsApp")}
        >
          <span className="pointer-events-none absolute right-full mr-3 rounded-lg bg-slate-900/90 px-3 py-1.5 text-xs text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 dark:bg-white/10">
            {t("common.chatWithUs")}
          </span>
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30 transition-transform hover:scale-105 active:scale-95">
            <motion.div
              className="absolute inset-0 rounded-full bg-emerald-500"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ opacity: 0.3 }}
            />
            <MessageCircle className="relative h-7 w-7 text-white" />
          </div>
        </motion.a>
      )}
    </AnimatePresence>
  )
}
