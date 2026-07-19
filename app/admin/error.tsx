"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n"

export default function AdminError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  const { t } = useTranslation()
  useEffect(() => {
    console.error("Admin error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-xl font-bold font-heading text-text-primary mb-2">
          {t("common.error")}
        </h2>
        <p className="text-sm text-text-muted mb-2">
          {t("admin.unexpectedError")}
        </p>
        {error.digest && (
          <p className="text-xs text-text-muted/60 mb-4 font-mono">
            {t("admin.errorId")} {error.digest}
          </p>
        )}
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" onClick={() => unstable_retry()} iconLeft={<RefreshCw className="h-4 w-4" />}>
            {t("admin.tryAgain")}
          </Button>
          <Link href="/admin">
            <Button variant="primary" size="sm" iconLeft={<ArrowLeft className="h-4 w-4" />}>
              {t("admin.backToDashboard")}
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
