"use client"

import { useState, useEffect, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  CalendarCheck,
  Flower2,
  HandHeart,
  Building2,
  Newspaper,
  Users,
  Settings,
  FileText,
  ChevronDown,
  ChevronLeft,
  Menu,
  X,
  Star,
  Megaphone,
  MessageSquareQuote,
  Mail,
  Image,
  PartyPopper,
  Clock,
  LogOut,
  ScrollText,
  Tent,
  Landmark,
  Church,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react"

interface NavItem {
  label: string
  href?: string
  icon: LucideIcon
  children?: NavItem[]
  roles?: string[]
}

const navGroups: { group: string; items: NavItem[]; roles?: string[] }[] = [
  {
    group: "Main",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    group: "Bookings",
    items: [
      { label: "All Bookings", href: "/admin/bookings", icon: CalendarCheck },
      { label: "Hall Booking", href: "/admin/hall-booking", icon: Building2 },
      { label: "Shashwatha", href: "/admin/shashwatha", icon: ScrollText },
    ],
  },
  {
    group: "Sevas",
    items: [
      { label: "Sevas", href: "/admin/sevas", icon: Flower2 },
    ],
  },
  {
    group: "Donations",
    items: [
      { label: "Donations", href: "/admin/donations", icon: HandHeart },
      { label: "Campaigns", href: "/admin/donations/campaigns", icon: Megaphone },
      { label: "Reports", href: "/admin/donations/reports", icon: FileText },
    ],
  },
  {
    group: "Temple",
    items: [
      { label: "Daily Alankara", href: "/admin/daily-alankara", icon: Flower2 },
      { label: "Daily Schedule", href: "/admin/daily-schedule", icon: Clock },
      { label: "Festivals", href: "/admin/festivals", icon: PartyPopper },
      { label: "Sub Deities", href: "/admin/sub-deities", icon: Church },
      { label: "Gallery", href: "/admin/gallery", icon: Image },
    ],
  },
  {
    group: "Content",
    items: [
      { label: "News", href: "/admin/news", icon: Newspaper },
      { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
      { label: "FAQ", href: "/admin/faq", icon: MessagesSquare },
      { label: "Testimonials", href: "/admin/testimonials", icon: Star },
      { label: "Contact", href: "/admin/contact", icon: Mail },
    ],
  },
  {
    group: "System",
    items: [
      { label: "Users", href: "/admin/users", icon: Users },
      { label: "Settings", href: "/admin/settings", icon: Settings },
      { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
    ],
  },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  user?: {
    name?: string | null
    email?: string | null
    role?: string | null
    image?: string | null
  }
  onLogout?: () => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}

function NavLink({
  item,
  collapsed,
  pathname,
  depth = 0,
}: {
  item: NavItem
  collapsed: boolean
  pathname: string
  depth?: number
}) {
  const isActive = item.href
    ? pathname === item.href || pathname.startsWith(item.href + "/")
    : false
  const hasChildren = item.children && item.children.length > 0

  if (hasChildren) {
    return <NavGroupItem item={item} collapsed={collapsed} pathname={pathname} depth={depth} />
  }

  const Icon = item.icon

  return (
    <Link
      href={item.href || "#"}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
        isActive
          ? "bg-secondary/15 text-secondary shadow-sm"
          : "text-text-muted hover:text-text-primary hover:bg-bg-secondary/80",
      )}
      title={collapsed ? item.label : undefined}
    >
      <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-secondary")} />
      {!collapsed && (
        <span className="truncate">{item.label}</span>
      )}
      {isActive && !collapsed && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 bg-secondary/10 rounded-xl -z-10"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
      {isActive && collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-secondary" />
      )}
    </Link>
  )
}

function NavGroupItem({
  item,
  collapsed,
  pathname,
  depth,
}: {
  item: NavItem
  collapsed: boolean
  pathname: string
  depth: number
}) {
  const [open, setOpen] = useState(
    item.children?.some((c) => pathname.startsWith(c.href || "#")) || false,
  )
  const Icon = item.icon

  if (collapsed) {
    return (
      <div className="relative group">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:text-text-primary hover:bg-bg-secondary/80 transition-all cursor-pointer">
          <Icon className="h-5 w-5 shrink-0" />
        </div>
        <div className="absolute left-full top-0 ml-2 bg-warm-white dark:bg-bg-secondary border border-border rounded-xl shadow-elevated p-2 min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          {item.children?.map((child) => (
            <NavLink key={child.label} item={child} collapsed={false} pathname={pathname} depth={depth + 1} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
          open
            ? "text-text-primary bg-bg-secondary/50"
            : "text-text-muted hover:text-text-primary hover:bg-bg-secondary/80",
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 shrink-0" />
          <span className="truncate">{item.label}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-3 pl-3 border-l border-border space-y-0.5 mt-0.5">
              {item.children?.map((child) => (
                <NavLink key={child.label} item={child} collapsed={collapsed} pathname={pathname} depth={depth + 1} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Sidebar({
  collapsed,
  onToggle,
  user,
  onLogout,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname()

  useEffect(() => {
    if (mobileOpen && onMobileClose) {
      onMobileClose()
    }
  }, [pathname, mobileOpen, onMobileClose])

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen flex flex-col bg-warm-white dark:bg-bg-secondary border-r border-border transition-all duration-300 overflow-hidden",
          collapsed ? "w-[72px]" : "w-[260px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-border shrink-0">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-warm-white font-bold text-sm">
                SK
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-text-primary leading-tight">
                  Temple Admin
                </span>
                <span className="text-[10px] text-text-muted leading-tight">
                  Sri Kalikamba
                </span>
              </div>
            </Link>
          )}
          {collapsed && (
            <Link href="/admin" className="mx-auto">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-warm-white font-bold text-sm">
                SK
              </div>
            </Link>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-all lg:flex hidden"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                collapsed && "rotate-180",
              )}
            />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 scrollbar-thin">
          {navGroups.map((group) => (
            <div key={group.group} className="mb-4">
              {!collapsed && (
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-text-muted/60">
                  {group.group}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.label}
                    item={item}
                    collapsed={collapsed}
                    pathname={pathname}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-3 shrink-0">
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-semibold text-sm shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user?.name || "Admin"}
                </p>
                <p className="text-[10px] text-text-muted truncate">
                  {user?.role?.replace(/_/g, " ") || "Admin"}
                </p>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
