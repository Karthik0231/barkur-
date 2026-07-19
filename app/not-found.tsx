"use client"

import Link from "next/link"
import { Home } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-heading font-bold text-gold-400/30 mb-4">404</div>
        <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">{t("common.pageNotFound")}</h1>
        <p className="text-sm text-text-muted mb-6">{t("common.pageNotFoundDesc")}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-white text-sm font-medium hover:bg-secondary-light transition-all"
        >
          <Home className="h-4 w-4" />
          {t("nav.home")}
        </Link>
      </div>
    </div>
  )
}
