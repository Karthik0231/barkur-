"use client"

import { motion } from "framer-motion"
import { Languages } from "lucide-react"
import { useTranslation } from "./index"
import { cn } from "@/lib/utils"

export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, setLanguage } = useTranslation()

  const toggle = () => setLanguage(language === "kn" ? "en" : "kn")

  return (
    <button
      onClick={toggle}
      className={cn(
        "relative flex h-9 w-16 items-center justify-center gap-1.5 rounded-full text-xs font-semibold transition-colors",
        "hover:bg-white/10 active:scale-95",
        className
      )}
      aria-label={`Switch language to ${language === "kn" ? "English" : "Kannada"}`}
    >
      <Languages className="h-3.5 w-3.5" />
      <motion.span
        key={language}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 8, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {language === "kn" ? "ಕನ್ನಡ" : "EN"}
      </motion.span>
    </button>
  )
}
