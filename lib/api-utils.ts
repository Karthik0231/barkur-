import type { Session } from "@auth/core/types"
import { createAuditLog } from "@/lib/models/auditLog"
type SessionLike = Session | null

export function successResponse<T>(
  data: T,
  message = "Success",
  statusCode = 200,
  cacheSeconds?: number
) {
  const init: ResponseInit = { status: statusCode }
  if (cacheSeconds && cacheSeconds > 0) {
    init.headers = {
      "Cache-Control": `public, max-age=${cacheSeconds}, s-maxage=${cacheSeconds}, stale-while-revalidate=${cacheSeconds * 2}`,
    }
  }
  return Response.json(
    { success: true, message, data },
    init
  )
}

export function errorResponse(
  message: string,
  statusCode = 400,
  errors?: Record<string, string[]>
) {
  return Response.json(
    { success: false, message, errors },
    { status: statusCode }
  )
}

export function getAuthUser(session: SessionLike) {
  const user = session?.user as { id?: string; role?: string } | undefined
  if (!user?.id) return null
  return {
    id: user.id,
    role: user.role ?? null,
  }
}

export function checkRole(
  session: SessionLike,
  roles: string[]
) {
  const user = session?.user as { role?: string } | undefined
  if (!user?.role) return false
  return roles.includes(user.role)
}

export function paginationHelper(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10) || 10))
  const skip = (page - 1) * limit
  const search = searchParams.get("search") ?? undefined
  const sortBy = searchParams.get("sortBy") ?? "createdAt"
  const sortOrder = (searchParams.get("sortOrder") ?? "desc") === "asc" ? "asc" as const : "desc" as const

  return { page, limit, skip, search, sortBy, sortOrder }
}

/** Escape special regex characters so user input is treated as a literal string. */
function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/** MongoDB-compatible case-insensitive substring filter (Prisma has no mode: insensitive on Mongo). */
export function containsFilter(value: string) {
  return { $regex: escapeRegex(value), $options: "i" }
}

/** Build OR clauses for searching multiple string fields. */
export function searchOrClauses(search: string, fields: string[]) {
  return fields.map((field) => ({ [field]: containsFilter(search) }))
}

/** Safely serialize metadata for audit logs. Handles circular references, BigInt, and undefined values. */
function safeSerialize(obj: unknown): Record<string, unknown> {
  const seen = new WeakSet()
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (typeof value === "bigint") return value.toString()
      if (typeof value === "function") return undefined
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) return "[Circular]"
        seen.add(value)
      }
      return value
    })
  )
}

export async function auditLog(
  action: string,
  entity: string,
  entityId: string,
  metadata?: Record<string, unknown>,
  session?: SessionLike
) {
  const user = getAuthUser(session ?? null)
  await createAuditLog({
    userId: user?.id ?? null,
    action,
    entity,
    entityId,
    metadata: metadata ? safeSerialize(metadata) : undefined,
  })
}
