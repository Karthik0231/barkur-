"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, ChevronDown, Heart, Landmark, Phone, MapPin, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"
import { LanguageSwitcher } from "@/lib/i18n/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
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
    "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-gradient-to-r after:from-gold-400 after:to-gold-600 after:transition-all after:duration-300"

  return (
    <>
      <header
        className={cn(
          "fixed top-[44px] left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-warm-ivory/90 backdrop-blur-xl shadow-premium border-b border-border/50 h-14 md:h-16"
            : "bg-warm-ivory/50 backdrop-blur-md border-b border-transparent h-16 md:h-20"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-xl gradient-bg-maroon flex items-center justify-center shadow-md group-hover:shadow-glow-maroon transition-all duration-300 group-hover:scale-105">
                <span className="text-warm-white font-heading font-bold text-lg md:text-xl tracking-wider">ಶ್ರೀ</span>
              </div>
              <div className="hidden sm:block">
                <span className="block text-sm md:text-base font-script font-semibold text-dark-slate leading-tight group-hover:text-primary transition-colors duration-300">
                  ಶ್ರೀ ಕಾಳಿಕಾಂಬಾ ದೇವಸ್ಥಾನ
                </span>
                <span className="block text-[10px] md:text-[11px] text-text-muted tracking-wider uppercase font-medium">
                  Sri Kalikamba Temple
                </span>
              </div>
            </Link>

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
                          ? "text-primary after:w-full"
                          : "text-text-secondary hover:text-primary after:w-0 hover:after:w-full"
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
                          ? "text-primary after:w-full"
                          : "text-text-secondary hover:text-primary after:w-0 hover:after:w-full"
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
                          className="absolute top-full left-0 mt-1 w-56 rounded-xl bg-white/90 backdrop-blur-xl shadow-premium border border-border-light p-1.5"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "block px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                                pathname === child.href
                                  ? "bg-gold-50/80 text-primary font-medium"
                                  : "text-text-secondary hover:bg-gold-50/60 hover:text-primary"
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
              <ThemeToggle />

              <LanguageSwitcher />

              <Link
                href="/donate"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg-maroon text-warm-white text-sm font-semibold shadow-md hover:shadow-glow-maroon hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <Heart className="w-4 h-4" />
                <span>{t("nav.donate")}</span>
              </Link>

              <motion.button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
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
