"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, Bell, Search, Moon, Sun, LogOut, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sidebar } from "@/components/admin/sidebar"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/providers"

const ROLE_HIERARCHY: Record<string, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 90,
  TEMPLE_MANAGER: 70,
  ACCOUNTANT: 60,
  RECEPTION: 40,
  VOLUNTEER: 20,
}

const allowedRoles = ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER", "ACCOUNTANT", "RECEPTION", "VOLUNTEER"]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading" || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
          <p className="text-sm text-text-muted">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  const userRole = (session.user as { role?: string }).role || ""
  const roleLevel = ROLE_HIERARCHY[userRole] || 0

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          user={{
            name: session.user?.name,
            email: session.user?.email,
            role: userRole,
          }}
          onLogout={() => signOut({ callbackUrl: "/login" })}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 shrink-0 bg-warm-white dark:bg-bg-secondary border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-all lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-secondary text-text-muted text-sm w-64">
                <Search className="h-4 w-4 shrink-0" />
                <span className="text-text-muted/60">Search...</span>
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-border text-text-muted/60">
                  Ctrl+K
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-all relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-warm-white dark:ring-bg-secondary" />
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-secondary transition-all"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-bg-secondary transition-all"
                >
                  <div className="h-7 w-7 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-xs font-semibold">
                    {session.user?.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                  <div className="hidden md:flex flex-col items-start text-left">
                    <span className="text-sm font-medium text-text-primary leading-tight">
                      {session.user?.name || "Admin"}
                    </span>
                    <span className="text-[10px] text-text-muted leading-tight">
                      {userRole.replace(/_/g, " ")}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-text-muted hidden md:block" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 top-full mt-1 w-56 rounded-xl bg-warm-white dark:bg-bg-secondary border border-border shadow-elevated py-1 z-50"
                    >
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium text-text-primary">{session.user?.name}</p>
                        <p className="text-xs text-text-muted">{session.user?.email}</p>
                      </div>
                      <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-bg-primary">
            <AnimatePresence mode="wait">
              <motion.div
                key={usePathnameKey()}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="p-4 lg:p-6"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}

function usePathnameKey() {
  if (typeof window === "undefined") return "initial"
  return window.location.pathname + window.location.search
}
