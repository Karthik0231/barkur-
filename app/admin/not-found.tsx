import Link from "next/link"
import { FileQuestion, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function AdminNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center mb-4">
          <FileQuestion className="h-6 w-6 text-amber-600" />
        </div>
        <h2 className="text-xl font-bold font-heading text-text-primary mb-2">
          Page Not Found
        </h2>
        <p className="text-sm text-text-muted mb-6">
          The admin page you are looking for does not exist or has been moved.
        </p>
        <Link href="/admin">
          <Button variant="primary" iconLeft={<ArrowLeft className="h-4 w-4" />}>
            Back to Dashboard
          </Button>
        </Link>
      </Card>
    </div>
  )
}
