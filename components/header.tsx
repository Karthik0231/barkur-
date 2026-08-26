"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  ChevronDown,
  Heart,
  Landmark,
  ArrowUpRight,
} from "lucide-react"

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
      { label: "nav.sriChakraPooja", href: "/sri-chakra-pooja" },
    ],
  },

  { label: "nav.festivals", href: "/festivals" },
  { label: "nav.gallery", href: "/gallery" },
  { label: "nav.hallBooking", href: "/hall-booking" },
  { label: "nav.contact", href: "/contact" },
]

/* -------------------------------------------------------------------------- */
/* Logo                                                                       */
/* -------------------------------------------------------------------------- */

function LogoBanner() {
  return (
    <Link
      href="/"
      aria-label="Sri Kalikamba Temple, Barkur"
      className="relative flex items-center shrink-0 group"
    >
      {/* Circular emblem */}
      <motion.div
        whileHover={{ scale: 1.045 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="
          relative z-20
          h-11 w-11
          sm:h-12 sm:w-12
          md:h-14 md:w-14
          rounded-full
          bg-gradient-to-br from-[#8A1420] via-[#6B0F1A] to-[#420A10]
          border-[2px] md:border-[3px] border-gold-300
          shadow-[0_5px_18px_rgba(0,0,0,0.38)]
          flex items-center justify-center
        "
      >
        <span
          className="
            text-gold-200
            font-heading
            font-bold
            text-sm
            md:text-lg
            tracking-wider
          "
        >
          ಶ್ರೀ
        </span>

        {/* Small glow */}
        <span className="absolute inset-0 rounded-full ring-1 ring-gold-200/20" />
      </motion.div>

      {/* Gold banner */}
      <div className="hidden sm:block relative -ml-5 md:-ml-6 h-12 md:h-16 w-[210px] md:w-[285px]">
        <svg
          viewBox="0 0 300 70"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          style={{
            filter: "drop-shadow(0 4px 7px rgba(0,0,0,0.4))",
          }}
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

        <div className="relative z-10 h-full flex flex-col justify-center pl-8 md:pl-10 pr-9">
          <span
            className="
              text-[10px]
              md:text-sm
              font-script
              font-bold
              text-[#4A0E14]
              leading-tight
              whitespace-nowrap
            "
          >
            ಶ್ರೀ ಕಾಳಿಕಾಂಬಾ ದೇವಸ್ಥಾನ
          </span>

          <span
            className="
              mt-0.5
              text-[7px]
              md:text-[9px]
              text-[#4A0E14]/75
              tracking-[0.12em]
              uppercase
              font-semibold
              whitespace-nowrap
            "
          >
            Sri Kalikamba Temple, Barkur
          </span>
        </div>
      </div>
    </Link>
  )
}

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const pathname = usePathname()
  const { t } = useTranslation()

  /* ------------------------------------------------------------------------ */
  /* Scroll state                                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 35)
    }

    handleScroll()

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  /* ------------------------------------------------------------------------ */
  /* Close menus on route change                                              */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  /* ------------------------------------------------------------------------ */
  /* Prevent background scroll when mobile nav is open                        */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!mobileOpen) return

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileOpen])

  /* ------------------------------------------------------------------------ */
  /* Active route                                                             */
  /* ------------------------------------------------------------------------ */

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }

    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const isChildActive = (item: NavItem) => {
    return item.children?.some((child) => isActive(child.href))
  }

  /* ------------------------------------------------------------------------ */
  /* Nav item                                                                  */
  /* ------------------------------------------------------------------------ */

  const navItemClass = (active: boolean) =>
    cn(
      `
        group/nav
        relative
        inline-flex
        items-center
        justify-center
        gap-1.5
        h-9
        px-2.5
        xl:px-3
        rounded-lg
        text-[12px]
        xl:text-[13px]
        font-medium
        tracking-[0.01em]
        transition-all
        duration-200
        whitespace-nowrap
      `,
      active
        ? "text-gold-200 bg-gold-300/[0.07]"
        : "text-warm-white/72 hover:text-gold-200 hover:bg-white/[0.045]"
    )

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Main Header                                                        */}
      {/* ------------------------------------------------------------------ */}

      <header
        className={cn(
          `
            fixed
            top-[44px]
            left-0
            right-0
            z-50
            transition-all
            duration-500
            ease-[cubic-bezier(0.32,0.72,0,1)]
          `,
          scrolled
            ? `
              h-[68px]
              bg-[#160A11]/[0.94]
              backdrop-blur-2xl
              border-b border-gold-300/[0.14]
              shadow-[0_10px_35px_rgba(0,0,0,0.28)]
            `
            : `
              h-[78px]
              md:h-[88px]
              bg-gradient-to-b
              from-[#14070C]/[0.18]
              to-transparent
              border-b border-transparent
            `
        )}
      >
        {/* subtle top highlight */}
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-px transition-opacity duration-500",
            scrolled
              ? "bg-gradient-to-r from-transparent via-gold-300/40 to-transparent opacity-100"
              : "opacity-0"
          )}
        />

        <div className="max-w-[1440px] mx-auto h-full px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="h-full flex items-center justify-between gap-4">
            {/* ---------------------------------------------------------- */}
            {/* Logo                                                        */}
            {/* ---------------------------------------------------------- */}

            <LogoBanner />

            {/* ---------------------------------------------------------- */}
            {/* Desktop Navigation                                         */}
            {/* ---------------------------------------------------------- */}

            <nav
              className="
                hidden
                lg:flex
                items-center
                justify-center
                flex-1
                min-w-0
                h-full
                px-3
              "
              aria-label="Main navigation"
            >
              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-0.5
                  xl:gap-1
                  min-w-0
                "
              >
                {navItems.map((item) => {
                  const active = isActive(item.href)
                  const childActive = isChildActive(item)

                  return (
                    <div
                      key={item.href}
                      className="relative h-full flex items-center"
                      onMouseEnter={() => {
                        if (item.children) {
                          setOpenDropdown(item.href)
                        }
                      }}
                      onMouseLeave={() => {
                        if (item.children) {
                          setOpenDropdown(null)
                        }
                      }}
                    >
                      {/* ------------------------------------------------ */}
                      {/* Parent item                                       */}
                      {/* ------------------------------------------------ */}

                      {item.children ? (
                        <button
                          type="button"
                          aria-haspopup="menu"
                          aria-expanded={openDropdown === item.href}
                          onClick={() =>
                            setOpenDropdown((current) =>
                              current === item.href ? null : item.href
                            )
                          }
                          className={navItemClass(active || !!childActive)}
                        >
                          <span>{t(item.label)}</span>

                          <ChevronDown
                            className={cn(
                              "w-3.5 h-3.5 transition-transform duration-300",
                              openDropdown === item.href && "rotate-180"
                            )}
                          />

                          {/* Active indicator */}
                          <span
                            className={cn(
                              `
                                absolute
                                bottom-[1px]
                                left-1/2
                                -translate-x-1/2
                                h-[2px]
                                rounded-full
                                bg-gradient-to-r
                                from-gold-300
                                via-gold-400
                                to-gold-500
                                transition-all
                                duration-300
                              `,
                              active || childActive
                                ? "w-5 opacity-100"
                                : "w-0 opacity-0 group-hover/nav:w-5 group-hover/nav:opacity-100"
                            )}
                          />
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className={navItemClass(active)}
                        >
                          <span>{t(item.label)}</span>

                          {/* Active indicator */}
                          <span
                            className={cn(
                              `
                                absolute
                                bottom-[1px]
                                left-1/2
                                -translate-x-1/2
                                h-[2px]
                                rounded-full
                                bg-gradient-to-r
                                from-gold-300
                                via-gold-400
                                to-gold-500
                                transition-all
                                duration-300
                              `,
                              active
                                ? "w-5 opacity-100"
                                : "w-0 opacity-0 group-hover/nav:w-5 group-hover/nav:opacity-100"
                            )}
                          />
                        </Link>
                      )}

                      {/* ------------------------------------------------ */}
                      {/* Dropdown                                          */}
                      {/* ------------------------------------------------ */}

                      {item.children && (
                        <AnimatePresence>
                          {openDropdown === item.href && (
                            <motion.div
                              initial={{
                                opacity: 0,
                                y: 10,
                                scale: 0.97,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                              }}
                              exit={{
                                opacity: 0,
                                y: 8,
                                scale: 0.98,
                              }}
                              transition={{
                                duration: 0.18,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className="
                                absolute
                                top-[calc(100%-2px)]
                                left-1/2
                                -translate-x-1/2
                                pt-3
                                z-[70]
                              "
                            >
                              <div
                                className="
                                  relative
                                  w-[250px]
                                  overflow-hidden
                                  rounded-2xl
                                  bg-[#24080D]/[0.97]
                                  backdrop-blur-2xl
                                  border border-gold-300/[0.16]
                                  shadow-[0_22px_60px_rgba(0,0,0,0.5)]
                                  p-2
                                "
                              >
                                {/* Dropdown top glow */}
                                <div
                                  className="
                                    absolute
                                    top-0
                                    left-1/2
                                    -translate-x-1/2
                                    w-24
                                    h-px
                                    bg-gradient-to-r
                                    from-transparent
                                    via-gold-300/60
                                    to-transparent
                                  "
                                />

                                {item.children.map((child, index) => {
                                  const activeChild =
                                    pathname === child.href

                                  return (
                                    <Link
                                      key={child.href}
                                      href={child.href}
                                      className={cn(
                                        `
                                          group/drop
                                          relative
                                          flex
                                          items-center
                                          justify-between
                                          gap-3
                                          px-3.5
                                          py-3
                                          rounded-xl
                                          text-[13px]
                                          transition-all
                                          duration-200
                                        `,
                                        activeChild
                                          ? `
                                            bg-gold-300/[0.12]
                                            text-gold-200
                                          `
                                          : `
                                            text-warm-white/70
                                            hover:bg-white/[0.045]
                                            hover:text-gold-200
                                          `
                                      )}
                                    >
                                      <div className="flex items-center gap-3">
                                        {/* Number */}
                                        <span
                                          className={cn(
                                            `
                                              flex
                                              items-center
                                              justify-center
                                              w-5
                                              h-5
                                              rounded-md
                                              text-[9px]
                                              font-semibold
                                              border
                                              transition-all
                                            `,
                                            activeChild
                                              ? "border-gold-300/40 bg-gold-300/10 text-gold-200"
                                              : "border-white/10 text-warm-white/35 group-hover/drop:border-gold-300/30 group-hover/drop:text-gold-200"
                                          )}
                                        >
                                          {String(index + 1).padStart(2, "0")}
                                        </span>

                                        <span className="font-medium">
                                          {t(child.label)}
                                        </span>
                                      </div>

                                      <ArrowUpRight
                                        className={cn(
                                          `
                                            w-3.5
                                            h-3.5
                                            transition-all
                                            duration-200
                                          `,
                                          activeChild
                                            ? "text-gold-300"
                                            : "text-warm-white/20 group-hover/drop:text-gold-300 group-hover/drop:translate-x-0.5 group-hover/drop:-translate-y-0.5"
                                        )}
                                      />
                                    </Link>
                                  )
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}
                    </div>
                  )
                })}
              </div>
            </nav>

            {/* ---------------------------------------------------------- */}
            {/* Actions                                                     */}
            {/* ---------------------------------------------------------- */}

            <div className="flex items-center gap-2 shrink-0">
              {/* Language */}
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              {/* Donate */}
              <Link
                href="/donate"
                className="
                  hidden
                  md:inline-flex
                  items-center
                  gap-2
                  h-10
                  px-4
                  xl:px-5
                  rounded-full
                  bg-gradient-to-b
                  from-[#C1432B]
                  to-[#8F2E1B]
                  text-warm-white
                  text-[12px]
                  xl:text-[13px]
                  font-semibold
                  border
                  border-gold-300/35
                  shadow-[0_5px_18px_rgba(0,0,0,0.25)]
                  hover:from-[#D04C32]
                  hover:to-[#9B321F]
                  hover:border-gold-300/55
                  hover:shadow-[0_8px_25px_rgba(0,0,0,0.32)]
                  hover:-translate-y-px
                  active:translate-y-0
                  transition-all
                  duration-200
                  whitespace-nowrap
                "
              >
                <Heart className="w-3.5 h-3.5" />
                <span>{t("nav.donate")}</span>
              </Link>

              {/* Mobile language */}
              <div className="sm:hidden">
                <LanguageSwitcher />
              </div>

              {/* Mobile menu */}
              <motion.button
                type="button"
                onClick={() => setMobileOpen(true)}
                whileTap={{ scale: 0.92 }}
                className="
                  lg:hidden
                  relative
                  flex
                  items-center
                  justify-center
                  w-10
                  h-10
                  rounded-xl
                  bg-gold-300/[0.08]
                  border border-gold-300/[0.14]
                  text-gold-200
                  hover:bg-gold-300/[0.14]
                  hover:border-gold-300/[0.25]
                  transition-all
                  duration-200
                "
                aria-label="Open navigation menu"
                aria-expanded={mobileOpen}
              >
                <Menu className="w-[19px] h-[19px]" />

                {/* tiny indicator */}
                <span
                  className="
                    absolute
                    top-1.5
                    right-1.5
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-gold-300
                    shadow-[0_0_7px_rgba(221,178,92,0.7)]
                  "
                />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Mobile navigation                                                   */}
      {/* ------------------------------------------------------------------ */}

      <AnimatePresence mode="wait">
        {mobileOpen && (
          <MobileNav onClose={() => setMobileOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}