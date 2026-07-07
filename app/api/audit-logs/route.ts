import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { searchParams } = new URL(request.url)
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper(searchParams)
    const entity = searchParams.get("entity")
    const action = searchParams.get("action")
    const userId = searchParams.get("userId")

    const where: Record<string, unknown> = {}
    if (entity) where.entity = entity
    if (action) where.action = action
    if (userId) where.userId = userId

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: where as never,
        include: { user: { select: { id: true, name: true, email: true } } },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.auditLog.count({ where: where as never }),
    ])

    return successResponse({ logs, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch audit logs", 500)
  }
}
