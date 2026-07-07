import { prisma } from "@/lib/prisma"
import type { Prisma } from "@/app/generated/prisma/client"

import type { Session } from "@auth/core/types"
type SessionLike = Session | null

export function successResponse<T>(
  data: T,
  message = "Success",
  statusCode = 200
) {
  return Response.json(
    { success: true, message, data },
    { status: statusCode }
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

export async function auditLog(
  action: string,
  entity: string,
  entityId: string,
  metadata?: Record<string, unknown>,
  session?: SessionLike
) {
  try {
    const user = session?.user as { id?: string } | undefined
    await prisma.auditLog.create({
      data: {
        action,
        entity,
        entityId,
        metadata: (metadata ?? {}) as Prisma.InputJsonValue,
        userId: user?.id ?? "system",
      },
    })
  } catch {
    console.error("Failed to create audit log:", action, entity, entityId)
  }
}
