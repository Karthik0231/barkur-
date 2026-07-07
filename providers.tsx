"use client"

import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"
import { I18nProvider } from "@/lib/i18n"
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { LazyMotion, domAnimation } from "framer-motion"
import { SmoothScroll } from "@/components/smooth-scroll"
import { PageTransition } from "@/components/page-transition"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("theme") as Theme | null
    if (stored === "light" || stored === "dark") {
      setThemeState(stored)
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setThemeState(prefersDark ? "dark" : "light")
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    localStorage.setItem("theme", theme)
  }, [theme, mounted])

  const setTheme = useCallback((t: Theme) => setThemeState(t), [])
  const toggleTheme = useCallback(() => setThemeState((prev) => (prev === "dark" ? "light" : "dark")), [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <I18nProvider>
        <ThemeProvider>
          <LazyMotion features={domAnimation}>
            <SmoothScroll>
              <PageTransition>
                {children}
              </PageTransition>
            </SmoothScroll>
          </LazyMotion>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#fff",
                color: "#2D2D2D",
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                border: "1px solid rgba(201,168,76,0.15)",
                padding: "16px 20px",
                fontSize: "14px",
              },
              success: {
                iconTheme: { primary: "#4A7C59", secondary: "#fff" },
              },
              error: {
                iconTheme: { primary: "#DC2626", secondary: "#fff" },
              },
            }}
          />
        </ThemeProvider>
      </I18nProvider>
    </SessionProvider>
  )
}
