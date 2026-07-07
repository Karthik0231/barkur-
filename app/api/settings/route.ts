import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"
import type { Prisma } from "@/app/generated/prisma/client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const session = await auth()
    const user = getAuthUser(session)
    const isAdmin = user && checkRole(session, ["SUPER_ADMIN", "ADMIN"])
    const group = searchParams.get("group")

    const where: Record<string, unknown> = {}
    if (group) where.group = group

    const settings = await prisma.templeSetting.findMany({
      where: where as never,
      orderBy: [{ group: "asc" }, { key: "asc" }],
    })

    if (!isAdmin) {
      const publicOnly = settings.filter(s => ["general", "temple", "social"].includes(s.group ?? ""))
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
    const { settings } = body
    if (!Array.isArray(settings)) return errorResponse("Settings array is required", 400)

    const results = []
    for (const setting of settings) {
      if (!setting.key) continue
      const upserted = await prisma.templeSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value as Prisma.InputJsonValue, group: setting.group ?? null, description: setting.description ?? null },
        create: { key: setting.key, value: setting.value as Prisma.InputJsonValue, group: setting.group ?? null, description: setting.description ?? null },
      })
      results.push(upserted)
    }

    await auditLog("UPDATE", "Settings", "bulk", { count: results.length }, session)
    return successResponse({ settings: results }, "Settings updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update settings", 500)
  }
}
