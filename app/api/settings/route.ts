import { auth } from "@/lib/auth"
import { successResponse, errorResponse, getAuthUser, checkRole } from "@/lib/api-utils"
import { prisma } from "@/lib/prisma"

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

    for (const s of settings) {
      await prisma.templeSetting.upsert({
        where: { key: s.key },
        update: { value: s.value, group: s.group, description: s.description },
        create: { key: s.key, value: s.value, group: s.group, description: s.description },
      })
    }

    const updated = await prisma.templeSetting.findMany({ orderBy: { key: "asc" } })
    return successResponse({ settings: updated }, "Settings updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update settings", 500)
  }
}
