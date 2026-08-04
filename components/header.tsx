"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, ChevronDown, Heart, Landmark } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"
import { LanguageSwitcher } from "@/lib/i18n/language-switcher"
import { MobileNav } from "@/components/mobile-nav"

type NavChild = {
  label: string
  href: string
}

type NavItem = {
  label: string
  href: string
  children?: NavChild[]
}

export const navItems: NavItem[] = [
  { label: "nav.home", href: "/" },
  { label: "nav.panchanga", href: "/panchanga" },
  {
    label: "nav.about",
    href: "/about",
    children: [
      { label: "nav.history", href: "/about/history" },
      { label: "nav.architecture", href: "/about/architecture" },
      { label: "nav.deity", href: "/about/deity" },
      { label: "nav.subDeities", href: "/about/sub-deities" },
      { label: "nav.committee", href: "/about/committee" },
      { label: "nav.staff", href: "/about/staff" },
    ],
  },
  {
    label: "nav.sevas",
    href: "/sevas",
    children: [
      { label: "nav.bookSeva", href: "/sevas" },
      { label: "nav.specialSevas", href: "/special-sevas" },
      { label: "nav.shashwathaSevas", href: "/shashwatha-sevas" },
      { label: "nav.homas", href: "/homas" },
    ],
  },
  { label: "nav.festivals", href: "/festivals" },
  { label: "nav.gallery", href: "/gallery" },
  { label: "nav.contact", href: "/contact" },
]

/**
 * Logo mark — a brass pennant banner (same ribbon motif as the hero)
 * flying out from behind a circular temple emblem. Drawn with an SVG
 * path rather than a CSS clip-path, so the point stays crisp instead
 * of rendering as a soft blob under the drop-shadow.
 */
function LogoBanner() {
  return (
    <Link href="/" className="relative flex items-center shrink-0 group">
      <div className="relative z-20 h-12 w-12 md:h-14 md:w-14 rounded-full bg-gradient-to-br from-[#8A1420] to-[#4A0E14] border-[3px] border-gold-300 shadow-lg shadow-black/50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
        <span className="text-gold-200 font-heading font-bold text-base md:text-lg tracking-wider">ಶ್ರೀ</span>
      </div>

      <div className="hidden sm:block relative -ml-6 h-14 md:h-16 w-64 md:w-[19rem]">
        <svg
          viewBox="0 0 300 70"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.45))" }}
        >
          <defs>
            <linearGradient id="logoGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F6E2A0" />
              <stop offset="45%" stopColor="#DDB25C" />
              <stop offset="100%" stopColor="#B3872F" />
            </linearGradient>
          </defs>
          <path
            d="M0 2 H253 L297 35 L253 68 H0 Z"
            fill="url(#logoGold)"
            stroke="#7A5A1E"
            strokeWidth="1.5"
          />
        </svg>
        <div className="relative z-10 h-full flex flex-col justify-center pl-9 pr-11">
          <span className="text-xs md:text-sm font-script font-bold text-[#4A0E14] leading-tight whitespace-nowrap">
            ಶ್ರೀ ಕಾಳಿಕಾಂಬಾ ದೇವಸ್ಥಾನ
          </span>
          <span className="text-[9px] md:text-[10px] text-[#4A0E14]/75 tracking-[0.14em] uppercase font-semibold whitespace-nowrap">
            Sri Kalikamba Temple, Barkur
          </span>
        </div>
      </div>
    </Link>
  )
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const { t } = useTranslation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === "/") return pathname === href
    return pathname.startsWith(href)
  }

  const underlineClasses =
    "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-gradient-to-r after:from-gold-300 after:to-gold-500 after:transition-all after:duration-300"

  return (
    <>
      <header
        className={cn(
          "fixed top-[44px] left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-[#150A12]/92 backdrop-blur-xl shadow-lg shadow-black/40 border-b border-gold-300/15 h-16 md:h-[4.5rem]"
            : "bg-transparent border-b border-transparent h-20 md:h-24"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <LogoBanner />

            <nav className="hidden lg:flex items-center gap-0.5 h-full">
              {navItems.map((item) => (
                <div
                  key={item.href}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setOpenDropdown(item.href)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {item.children ? (
                    <button
                      className={cn(
                        "relative flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 h-fit",
                        underlineClasses,
                        isActive(item.href)
                          ? "text-gold-200 after:w-full"
                          : "text-warm-white/75 hover:text-gold-200 after:w-0 hover:after:w-full"
                      )}
                    >
                      {t(item.label)}
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 transition-transform duration-200",
                          openDropdown === item.href && "rotate-180"
                        )}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "relative flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 h-fit",
                        underlineClasses,
                        pathname === item.href
                          ? "text-gold-200 after:w-full"
                          : "text-warm-white/75 hover:text-gold-200 after:w-0 hover:after:w-full"
                      )}
                    >
                      {t(item.label)}
                    </Link>
                  )}

                  {item.children && (
                    <AnimatePresence>
                      {openDropdown === item.href && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.96 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute top-full left-0 mt-1 w-56 rounded-xl bg-[#2A0408]/95 backdrop-blur-xl shadow-xl shadow-black/50 border border-gold-300/15 p-1.5"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "block px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                                pathname === child.href
                                  ? "bg-gold-300/15 text-gold-200 font-medium"
                                  : "text-warm-white/70 hover:bg-gold-300/10 hover:text-gold-200"
                              )}
                            >
                              {t(child.label)}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <LanguageSwitcher />

              <Link
                href="/donate"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-b from-[#C1432B] to-[#8F2E1B] text-warm-white text-sm font-semibold border border-gold-300/40 shadow-md shadow-black/30 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Heart className="w-4 h-4" />
                <span>{t("nav.donate")}</span>
              </Link>

              <motion.button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gold-300/10 text-gold-200 hover:bg-gold-300/20 transition-colors"
                aria-label="Open menu"
                whileTap={{ scale: 0.9 }}
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <MobileNav onClose={() => setMobileOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}