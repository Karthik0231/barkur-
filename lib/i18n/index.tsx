"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { usePathname } from "next/navigation"
import translations, { type TranslationData } from "./translations"

export type Language = "kn" | "en"

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

function resolveTranslation(data: TranslationData, key: string): string {
  const keys = key.split(".")
  let result: unknown = data as unknown as Record<string, unknown>
  for (const k of keys) {
    if (result && typeof result === "object" && k in (result as Record<string, unknown>)) {
      result = (result as Record<string, unknown>)[k]
    } else {
      return key
    }
  }
  return typeof result === "string" ? result : key
}

const I18nContext = createContext<I18nContextType>({
  language: "kn",
  setLanguage: () => {},
  t: (key: string) => resolveTranslation(translations.kn, key),
})

export function useTranslation() {
  return useContext(I18nContext)
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("kn")
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  const isAdmin = pathname?.startsWith("/admin")

  useEffect(() => {
    setMounted(true)
    if (!isAdmin) {
      const stored = localStorage.getItem("language") as Language | null
      if (stored === "kn" || stored === "en") {
        setLanguageState(stored)
      }
    }
  }, [isAdmin])

  useEffect(() => {
    if (!mounted) return
    if (isAdmin) return
    localStorage.setItem("language", language)
    document.documentElement.lang = language === "kn" ? "kn" : "en"
  }, [language, mounted, isAdmin])

  const setLanguage = useCallback((lang: Language) => {
    if (!isAdmin) {
      setLanguageState(lang)
    }
  }, [isAdmin])

  const t = useCallback(
    (key: string) => resolveTranslation(translations[isAdmin ? "en" : language], key),
    [language, isAdmin]
  )

  if (!mounted) {
    const defaultT = (key: string) => resolveTranslation(translations.kn, key)
    return (
      <I18nContext.Provider value={{ language: "kn", setLanguage: () => {}, t: defaultT }}>
        {children}
      </I18nContext.Provider>
    )
  }

  return (
    <I18nContext.Provider
      value={{
        language: isAdmin ? "en" : language,
        setLanguage,
        t,
      }}
    >
      {children}
    </I18nContext.Provider>
  )
}
