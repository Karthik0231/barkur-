"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  ChevronDown,
  ChevronRight,
  Landmark,
  Globe2,
  Camera,
  Video,
  Sparkles,
  Heart,
  ArrowUpRight,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"
import { LanguageSwitcher } from "@/lib/i18n/language-switcher"
import { SOCIAL_LINKS } from "@/lib/constants"

interface NavItem {
  label: string
  href: string
  children?: {
    label: string
    href: string
  }[]
}

const sectionConfig: {
  title: string
  items: NavItem[]
}[] = [
    {
      title: "nav.sectionMain",
      items: [
        { label: "nav.home", href: "/" },
        { label: "nav.panchanga", href: "/panchanga" },
        { label: "nav.festivals", href: "/festivals" },
        { label: "nav.gallery", href: "/gallery" },
        { label: "nav.hallBooking", href: "/hall-booking" },
        { label: "nav.contact", href: "/contact" },
        { label: "nav.donate", href: "/donate" },
      ],
    },

    {
      title: "nav.aboutTemple",
      items: [
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
      ],
    },

    {
      title: "nav.sevas",
      items: [
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
      ],
    },
  ]

const socialLinks = [
  {
    label: "social.facebook",
    href: SOCIAL_LINKS.facebook || "#",
    icon: Globe2,
  },
  {
    label: "social.instagram",
    href: SOCIAL_LINKS.instagram || "#",
    icon: Camera,
  },
  {
    label: "social.youtube",
    href: SOCIAL_LINKS.youtube || "#",
    icon: Video,
  },
]

const drawerTransition = {
  type: "spring" as const,
  stiffness: 280,
  damping: 30,
  mass: 0.85,
}

const menuContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.12,
    },
  },
}

const menuItemVariants = {
  hidden: {
    opacity: 0,
    x: 18,
  },

  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

/* -------------------------------------------------------------------------- */
/* Decorative temple mark                                                     */
/* -------------------------------------------------------------------------- */

function TempleMark() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay: 0.12,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        relative
        flex
        h-11
        w-11
        shrink-0
        items-center
        justify-center
        rounded-2xl
        bg-gradient-to-br
        from-[#8A1420]
        via-[#6B0F1A]
        to-[#420A10]
        border
        border-[#DDB25C]/50
        shadow-[0_7px_24px_rgba(70,5,12,0.28)]
      "
    >
      <Landmark className="h-5 w-5 text-[#F6E2A0]" />

      <span
        className="
          absolute
          inset-1
          rounded-[13px]
          border
          border-[#F6E2A0]/10
        "
      />

      <span
        className="
          absolute
          -right-1
          -top-1
          h-2
          w-2
          rounded-full
          bg-[#DDB25C]
          shadow-[0_0_10px_rgba(221,178,92,0.8)]
        "
      />
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/* Nested navigation item                                                     */
/* -------------------------------------------------------------------------- */

function MobileSubMenuItem({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem
  pathname: string
  onNavigate: () => void
}) {
  const { t } = useTranslation()

  const hasChildren = !!item.children?.length

  const [open, setOpen] = useState(
    hasChildren
      ? item.children!.some(
        (child) =>
          pathname === child.href ||
          pathname.startsWith(`${child.href}/`)
      )
      : false
  )

  useEffect(() => {
    if (!item.children?.length) return

    const childActive = item.children.some(
      (child) =>
        pathname === child.href ||
        pathname.startsWith(`${child.href}/`)
    )

    setOpen(childActive)
  }, [pathname, item.children])

  /* ------------------------------------------------------------------------ */
  /* Parent with children                                                     */
  /* ------------------------------------------------------------------------ */

  if (hasChildren) {
    return (
      <motion.div variants={menuItemVariants}>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="
            group
            flex
            w-full
            items-center
            justify-between
            rounded-2xl
            px-4
            py-3.5
            min-h-[52px]
            text-[15px]
            font-semibold
            text-[#32141A]
            transition-all
            duration-200
            hover:bg-[#6B0F1A]/[0.045]
            active:scale-[0.985]
          "
        >
          <span className="flex items-center gap-3">
            <span
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-xl
                bg-[#6B0F1A]/[0.055]
                border
                border-[#6B0F1A]/[0.07]
                text-[10px]
                font-bold
                tracking-wider
                text-[#6B0F1A]/60
              "
            >
              {item.label === "nav.about" ? "01" : "02"}
            </span>

            <span>{t(item.label)}</span>
          </span>

          <motion.span
            animate={{
              rotate: open ? 180 : 0,
            }}
            transition={{
              duration: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-[#6B0F1A]/[0.045]
              text-[#6B0F1A]/60
              group-hover:text-[#6B0F1A]
            "
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="overflow-hidden"
            >
              <div className="relative ml-8 mr-2 pb-2 pl-5">
                {/* vertical gold line */}
                <span
                  className="
                    absolute
                    left-0
                    top-1
                    bottom-4
                    w-px
                    bg-gradient-to-b
                    from-[#DDB25C]/60
                    via-[#DDB25C]/25
                    to-transparent
                  "
                />

                <div className="space-y-1">
                  {item.children!.map((child, index) => {
                    const active =
                      pathname === child.href ||
                      pathname.startsWith(`${child.href}/`)

                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onNavigate}
                        className={cn(
                          `
                            group
                            relative
                            flex
                            items-center
                            justify-between
                            gap-3
                            rounded-xl
                            px-3
                            py-3
                            min-h-[44px]
                            text-[13px]
                            transition-all
                            duration-200
                          `,
                          active
                            ? `
                              bg-[#6B0F1A]/[0.09]
                              text-[#6B0F1A]
                            `
                            : `
                              text-[#32141A]/65
                              hover:bg-[#6B0F1A]/[0.045]
                              hover:text-[#6B0F1A]
                            `
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={cn(
                              `
                                flex
                                h-6
                                w-6
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                text-[9px]
                                font-bold
                                tracking-wider
                                transition-all
                              `,
                              active
                                ? `
                                  bg-[#6B0F1A]
                                  text-[#F6E2A0]
                                  shadow-[0_3px_10px_rgba(107,15,26,0.2)]
                                `
                                : `
                                  bg-[#6B0F1A]/[0.05]
                                  text-[#6B0F1A]/40
                                  group-hover:bg-[#DDB25C]/20
                                  group-hover:text-[#6B0F1A]
                                `
                            )}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <span
                            className={cn(
                              active && "font-semibold"
                            )}
                          >
                            {t(child.label)}
                          </span>
                        </span>

                        <ChevronRight
                          className={cn(
                            `
                              h-3.5
                              w-3.5
                              transition-all
                              duration-200
                            `,
                            active
                              ? "text-[#6B0F1A]"
                              : "text-[#32141A]/20 group-hover:text-[#6B0F1A] group-hover:translate-x-0.5"
                          )}
                        />
                      </Link>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  /* ------------------------------------------------------------------------ */
  /* Normal navigation item                                                   */
  /* ------------------------------------------------------------------------ */

  const active =
    pathname === item.href ||
    pathname.startsWith(`${item.href}/`)

  return (
    <motion.div variants={menuItemVariants}>
      <Link
        href={item.href}
        onClick={onNavigate}
        className={cn(
          `
            group
            relative
            flex
            items-center
            justify-between
            rounded-2xl
            px-4
            py-3.5
            min-h-[52px]
            text-[15px]
            font-semibold
            transition-all
            duration-200
            active:scale-[0.985]
          `,
          active
            ? `
              bg-[#6B0F1A]
              text-[#F6E2A0]
              shadow-[0_7px_20px_rgba(107,15,26,0.18)]
            `
            : `
              text-[#32141A]
              hover:bg-[#6B0F1A]/[0.045]
              hover:text-[#6B0F1A]
            `
        )}
      >
        <span className="flex items-center gap-3">
          <span
            className={cn(
              `
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-xl
                text-[10px]
                font-bold
                tracking-wider
                transition-all
              `,
              active
                ? `
                  bg-[#F6E2A0]/15
                  text-[#F6E2A0]
                `
                : `
                  bg-[#6B0F1A]/[0.055]
                  text-[#6B0F1A]/55
                  group-hover:bg-[#DDB25C]/20
                  group-hover:text-[#6B0F1A]
                `
            )}
          >
            {item.label === "nav.home"
              ? "⌂"
              : item.label === "nav.panchanga"
                ? "02"
                : item.label === "nav.festivals"
                  ? "03"
                  : item.label === "nav.gallery"
                    ? "04"
                    : item.label === "nav.hallBooking"
                      ? "05"
                      : item.label === "nav.contact"
                        ? "06"
                        : "07"}
          </span>

          <span>{t(item.label)}</span>
        </span>

        {active && (
          <motion.div
            layoutId="mobileActiveDot"
            className="
              flex
              h-6
              w-6
              items-center
              justify-center
              rounded-full
              bg-[#F6E2A0]/15
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#F6E2A0]
                shadow-[0_0_8px_rgba(246,226,160,0.7)]
              "
            />
          </motion.div>
        )}
      </Link>
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/* Mobile Navigation                                                          */
/* -------------------------------------------------------------------------- */

export function MobileNav({
  onClose,
}: {
  onClose: () => void
}) {
  const { t } = useTranslation()
  const pathname = usePathname()

  const drawerRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  /* ------------------------------------------------------------------------ */
  /* Lock body                                                                */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = "hidden"

    closeRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  /* ------------------------------------------------------------------------ */
  /* Escape                                                                   */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[80] lg:hidden">
      {/* ------------------------------------------------------------------ */}
      {/* Backdrop                                                           */}
      {/* ------------------------------------------------------------------ */}

      <motion.button
        type="button"
        aria-label={t("nav.closeMenu")}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        transition={{
          duration: 0.3,
        }}
        className="
          absolute
          inset-0
          w-full
          h-full
          cursor-default
          bg-[#12070B]/60
          backdrop-blur-md
        "
        onClick={onClose}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Drawer                                                             */}
      {/* ------------------------------------------------------------------ */}

      <motion.aside
        ref={drawerRef}
        initial={{
          x: "100%",
        }}
        animate={{
          x: 0,
        }}
        exit={{
          x: "100%",
        }}
        transition={drawerTransition}
        className="
          absolute
          right-0
          top-0
          flex
          h-[100dvh]
          w-full
          max-w-[430px]
          flex-col
          overflow-hidden
          bg-[#F9F4E8]
          shadow-[-18px_0_60px_rgba(0,0,0,0.28)]
        "
        role="dialog"
        aria-modal="true"
        aria-label={t("nav.navigationMenu")}
      >
        {/* ---------------------------------------------------------------- */}
        {/* Decorative background                                            */}
        {/* ---------------------------------------------------------------- */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            overflow-hidden
          "
        >
          <div
            className="
              absolute
              -right-24
              -top-24
              h-72
              w-72
              rounded-full
              bg-[#DDB25C]/[0.055]
              blur-3xl
            "
          />

          <div
            className="
              absolute
              -left-28
              top-[45%]
              h-64
              w-64
              rounded-full
              bg-[#6B0F1A]/[0.035]
              blur-3xl
            "
          />

          <div
            className="
              absolute
              inset-0
              opacity-[0.025]
              bg-[linear-gradient(135deg,transparent_24%,#6B0F1A_25%,transparent_26%,transparent_74%,#6B0F1A_75%,transparent_76%)]
              bg-[length:34px_34px]
            "
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div
          className="
            relative
            z-10
            shrink-0
            border-b
            border-[#6B0F1A]/[0.09]
            bg-gradient-to-b
            from-[#6B0F1A]/[0.07]
            to-transparent
            px-5
            pt-[max(20px,env(safe-area-inset-top))]
            pb-4
          "
        >
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              onClick={onClose}
              className="
                group
                flex
                min-w-0
                items-center
                gap-3
              "
            >
              <TempleMark />

              <div className="min-w-0">
                <span
                  className="
                    block
                    truncate
                    text-[14px]
                    font-heading
                    font-bold
                    leading-tight
                    tracking-wide
                    text-[#32141A]
                  "
                >
                  ಶ್ರೀ ಕಾಳಿಕಾಂಬಾ ದೇವಸ್ಥಾನ
                </span>

                <span
                  className="
                    mt-1
                    block
                    truncate
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-[#32141A]/45
                  "
                >
                  Sri Kalikamba Temple · Barkur
                </span>
              </div>
            </Link>

            <motion.button
              ref={closeRef}
              type="button"
              onClick={onClose}
              whileTap={{
                scale: 0.9,
                rotate: -5,
              }}
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-[#6B0F1A]/[0.09]
                bg-[#6B0F1A]/[0.045]
                text-[#32141A]/60
                transition-all
                duration-200
                hover:bg-[#6B0F1A]/[0.09]
                hover:text-[#6B0F1A]
              "
              aria-label={t("nav.closeMenu")}
            >
              <X className="h-[18px] w-[18px]" />
            </motion.button>
          </div>

          {/* Small gold line */}
          <div
            className="
              absolute
              bottom-0
              left-5
              h-px
              w-20
              bg-gradient-to-r
              from-[#DDB25C]
              to-transparent
            "
          />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Navigation                                                        */}
        {/* ---------------------------------------------------------------- */}

        <motion.nav
          variants={menuContainerVariants}
          initial="hidden"
          animate="visible"
          className="
            relative
            z-10
            flex-1
            overflow-y-auto
            overscroll-contain
            px-3
            py-5
            pb-6
            scrollbar-thin
          "
          aria-label={t("nav.navigationMenu")}
        >
          {sectionConfig.map((section, sectionIndex) => (
            <motion.section
              key={section.title}
              variants={menuItemVariants}
              className={cn(
                "mb-7",
                sectionIndex === sectionConfig.length - 1 && "mb-2"
              )}
            >
              {/* Section title */}
              <div className="mb-2 flex items-center gap-3 px-4">
                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-[#6B0F1A]/50
                  "
                >
                  {t(section.title)}
                </span>

                <span
                  className="
                    h-px
                    flex-1
                    bg-gradient-to-r
                    from-[#DDB25C]/25
                    to-transparent
                  "
                />
              </div>

              <div className="space-y-1">
                {section.items.map((item) => (
                  <MobileSubMenuItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    onNavigate={onClose}
                  />
                ))}
              </div>
            </motion.section>
          ))}
        </motion.nav>

        {/* ---------------------------------------------------------------- */}
        {/* Bottom actions                                                    */}
        {/* ---------------------------------------------------------------- */}

        <motion.div
          initial={{
            y: 25,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            delay: 0.25,
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            z-20
            shrink-0
            border-t
            border-[#6B0F1A]/[0.09]
            bg-[#F9F4E8]/[0.96]
            px-5
            pt-4
            pb-[max(18px,env(safe-area-inset-bottom))]
            backdrop-blur-xl
          "
        >
          {/* Language */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe2 className="h-3.5 w-3.5 text-[#6B0F1A]/45" />

              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  text-[#32141A]/45
                "
              >
                {t("nav.language")}
              </span>
            </div>

            <LanguageSwitcher />
          </div>

          {/* Primary CTA */}
          <Link
            href="/sevas"
            onClick={onClose}
            className="
              group
              relative
              flex
              min-h-[52px]
              w-full
              items-center
              justify-center
              gap-2.5
              overflow-hidden
              rounded-2xl
              bg-gradient-to-r
              from-[#6B0F1A]
              via-[#7E111D]
              to-[#5A0C15]
              px-4
              text-[14px]
              font-bold
              text-[#F6E2A0]
              shadow-[0_9px_28px_rgba(107,15,26,0.23)]
              transition-all
              duration-300
              active:scale-[0.98]
            "
          >
            {/* CTA shine */}
            <motion.span
              animate={{
                x: ["-120%", "140%"],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                repeatDelay: 3.5,
                ease: "easeInOut",
              }}
              className="
                absolute
                inset-y-0
                w-20
                rotate-[18deg]
                bg-gradient-to-r
                from-transparent
                via-white/[0.12]
                to-transparent
              "
            />

            <Sparkles className="relative h-4 w-4" />

            <span className="relative">
              {t("nav.bookSeva")}
            </span>

            <ArrowUpRight className="relative h-4 w-4 opacity-60 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>

          {/* Social row */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-3.5 w-3.5 text-[#DDB25C]" />

              <span
                className="
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.13em]
                  text-[#32141A]/40
                "
              >
                Sri Kalikamba Temple
              </span>
            </div>

            <div className="flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon

                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.9,
                    }}
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#6B0F1A]/[0.08]
                      bg-[#6B0F1A]/[0.035]
                      text-[#32141A]/45
                      transition-colors
                      duration-200
                      hover:border-[#DDB25C]/40
                      hover:bg-[#DDB25C]/10
                      hover:text-[#6B0F1A]
                    "
                    aria-label={t(social.label)}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </motion.a>
                )
              })}
            </div>
          </div>
        </motion.div>
      </motion.aside>
    </div>
  )
}