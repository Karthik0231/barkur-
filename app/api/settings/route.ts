import { auth } from "@/lib/auth"
import { successResponse, errorResponse, getAuthUser, checkRole } from "@/lib/api-utils"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { settingSchema } from "@/lib/validations"

const settingsArraySchema = z.object({
  settings: z.array(settingSchema),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const session = await auth()
    const user = getAuthUser(session)
    const isAdmin = user && checkRole(session, ["SUPER_ADMIN", "ADMIN"])
    const group = searchParams.get("group")

    const where: Record<string, unknown> = {}
    if (group) where.group = group

    const settings = await prisma.templeSetting.findMany({ where: where as any, orderBy: { key: "asc" } })

    if (!isAdmin) {
      const paymentKeys = [
        "bank_account_name", "bank_account_number", "bank_ifsc", "bank_branch", "bank_name",
        "upi_id", "qr_code_url", "payment_instructions",
      ]
      const publicOnly = settings.filter(s =>
        ["general", "temple", "social", "payment", "donations"].includes(s.group ?? "") ||
        paymentKeys.includes(s.key)
      )
      return successResponse({ settings: publicOnly })
    }

    return successResponse({ settings })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch settings", 500)
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const parsed = settingsArraySchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const { settings } = parsed.data

    for (const s of settings) {
      await prisma.templeSetting.upsert({
        where: { key: s.key },
        update: { value: s.value as never, group: s.group ?? null, description: s.description ?? null },
        create: { key: s.key, value: s.value as never, group: s.group ?? null, description: s.description ?? null },
      })
    }

    const updated = await prisma.templeSetting.findMany({ orderBy: { key: "asc" } })
    return successResponse({ settings: updated }, "Settings updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update settings", 500)
  }
}
