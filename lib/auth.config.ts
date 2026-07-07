import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith("/admin")
      const isOnProfile = nextUrl.pathname.startsWith("/profile")

      if (isOnAdmin) {
        if (!isLoggedIn) return false
        const role = (auth.user as { role?: string } | undefined)?.role
        if (role !== "ADMIN" && role !== "SUPER_ADMIN") return false
        return true
      }

      if (isOnProfile) {
        if (!isLoggedIn) return false
        return true
      }

      return true
    },
  },
  providers: [],
  trustHost: true,
} satisfies NextAuthConfig
