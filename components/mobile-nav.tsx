"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronDown, ChevronRight, Landmark, Globe, Camera, Video, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"
import { LanguageSwitcher } from "@/lib/i18n/language-switcher"

interface NavItem {
  label: string
  href: string
  children?: { label: string; href: string }[]
}

const sectionConfig: { title: string; items: NavItem[] }[] = [
  {
    title: "Main",
    items: [
      { label: "nav.home", href: "/" },
      { label: "nav.festivals", href: "/festivals" },
      { label: "nav.gallery", href: "/gallery" },
      { label: "nav.contact", href: "/contact" },
    ],
  },
  {
    title: "About Temple",
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
    title: "Sevas",
    items: [
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
    ],
  },
]

const socialLinks = [
  { label: "Facebook", href: "#", icon: Globe },
  { label: "Instagram", href: "#", icon: Camera },
  { label: "YouTube", href: "#", icon: Video },
]

const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 32,
  mass: 0.8,
}

const itemVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.08 + i * 0.04, ...springTransition },
  }),
}

function SubMenuItem({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem
  pathname: string
  onNavigate: () => void
}) {
  const [open, setOpen] = useState(
    item.children ? item.children.some((c) => pathname.startsWith(c.href)) : false
  )
  const { t } = useTranslation()
  const T = (key: string): string => {
    const parts = key.split(".")
    let val: unknown = t
    for (const part of parts) {
      if (val && typeof val === "object") val = (val as Record<string, unknown>)[part]
      else return key
    }
    return typeof val === "string" ? val : key
  }

  useEffect(() => {
    if (item.children) {
      setOpen(item.children.some((c) => pathname.startsWith(c.href)))
    }
  }, [pathname, item.children])

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-center justify-between px-4 py-3.5 min-h-12 text-base font-medium text-dark-slate hover:text-primary transition-colors rounded-xl hover:bg-primary/5 group"
        >
          <span>{T(item.label)}</span>
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <ChevronDown className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
          </motion.div>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pb-2 pl-6 space-y-0.5">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 min-h-10 rounded-xl text-sm transition-all duration-200",
                      pathname === child.href
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-text-muted hover:bg-primary/5 hover:text-primary"
                    )}
                  >
                    <ChevronRight className="w-3 h-3 text-primary/40" />
                    {T(child.label)}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center justify-between px-4 py-3.5 min-h-12 text-base font-medium transition-colors rounded-xl",
        pathname === item.href
          ? "text-primary bg-primary/10 font-semibold"
          : "text-dark-slate hover:text-primary hover:bg-primary/5"
      )}
    >
      <span>{T(item.label)}</span>
      {pathname === item.href && (
        <motion.div
          layoutId="activeIndicator"
          className="w-1.5 h-1.5 rounded-full bg-primary"
        />
      )}
    </Link>
  )
}

export function MobileNav({ onClose }: { onClose: () => void }) {
  const pathname = usePathname()
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.div
        ref={drawerRef}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={springTransition}
        className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-warm-ivory shadow-2xl"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(201, 168, 76, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(201, 168, 76, 0.05) 0%, transparent 50%),
            repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(201, 168, 76, 0.02) 40px, rgba(201, 168, 76, 0.02) 41px)
          `,
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <Link href="/" className="flex items-center gap-3" onClick={onClose}>
            <div className="w-10 h-10 rounded-xl gradient-bg-maroon flex items-center justify-center shadow-md">
              <Landmark className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <span className="block text-sm font-heading font-bold text-dark-slate leading-tight tracking-wide">
                ಶ್ರೀ ಕಾಳಿಕಾಂಬಾ ದೇವಸ್ಥಾನ
              </span>
              <span className="block text-[10px] text-text-muted font-medium tracking-wider uppercase">
                Sri Kalikamba Temple
              </span>
            </div>
          </Link>
          <button
            ref={closeRef}
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-text-muted hover:bg-primary/10 hover:text-primary transition-all duration-200"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
          {sectionConfig.map((section, sectionIdx) => (
            <motion.div
              key={section.title}
              custom={sectionIdx}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <h3 className="px-4 mb-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary/60">
                {section.title}
              </h3>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <SubMenuItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    onNavigate={onClose}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </nav>

        <div className="border-t border-primary/10 px-5 pt-4 pb-6 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
              Language
            </span>
            <LanguageSwitcher />
          </div>

          <Link
            href="/sevas"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-4 py-3.5 min-h-12 text-sm font-bold text-warm-white shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200"
          >
            <Sparkles className="w-4 h-4" />
            <span>Book Seva</span>
          </Link>

          <div className="flex items-center justify-center gap-3 pt-1">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/5 text-text-muted hover:bg-primary/10 hover:text-primary transition-all duration-200"
                  aria-label={social.label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
