"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useTranslation()
  useEffect(() => { console.error(error) }, [error])
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
      <div className="text-center max-w-md">
        <div className="mx-auto h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h1 className="text-xl font-bold font-heading text-text-primary mb-2">{t("common.error")}</h1>
        <p className="text-sm text-text-muted mb-6">{t("common.unexpectedError")}</p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-white text-sm font-medium hover:bg-secondary-light transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          {t("common.tryAgain")}
        </button>
      </div>
    </div>
  )
}
