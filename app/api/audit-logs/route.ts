import { auth } from "@/lib/auth"
import { findManyAuditLogs, countAuditLogs } from "@/lib/models/auditLog"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper } from "@/lib/api-utils"
import { db } from "@/lib/mongodb"
import { toObjectId } from "@/lib/models/utils"

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

    const filter: Record<string, unknown> = {}
    if (entity) filter.entity = entity
    if (action) filter.action = action
    if (userId) filter.userId = userId

    const [logs, total] = await Promise.all([
      findManyAuditLogs(filter, {
        skip,
        limit,
        sort: sortBy ? [[sortBy, sortOrder === "asc" ? 1 : -1]] : undefined,
      }),
      countAuditLogs(filter),
    ])

    const userIds = [...new Set(logs.map((l) => l.userId).filter(Boolean))]
    let usersMap: Record<string, { id: string; name: string; email: string }> = {}
    if (userIds.length > 0) {
      const objectIds = userIds.map((uid) => toObjectId(uid))
      const users = await db.collection("users").find({ _id: { $in: objectIds } }, { projection: { name: 1, email: 1 } }).toArray()
      usersMap = Object.fromEntries(users.map((u) => [u._id.toHexString(), { id: u._id.toHexString(), name: u.name, email: u.email }]))
    }

    const enrichedLogs = logs.map((log) => ({
      ...log,
      user: log.userId ? usersMap[log.userId] : null,
    }))

    return successResponse({ logs: enrichedLogs, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch audit logs", 500)
  }
}
