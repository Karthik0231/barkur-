import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await prisma.committee.findFirst({ where: { id, deletedAt: null } })
    if (!existing) return errorResponse("Committee member not found", 404)

    const body = await request.json()
    const updateData: Record<string, unknown> = {}
    const allowed = ["name", "role", "type", "photo", "biography", "email", "phone", "sortOrder", "isActive"]
    for (const key of allowed) {
      if (body[key] !== undefined) updateData[key] = body[key]
    }
    if (body.designation) updateData.role = body.designation
    if (body.photoUrl) updateData.photo = body.photoUrl
    if (body.termStart) updateData.tenureStart = new Date(body.termStart)
    if (body.termEnd !== undefined) updateData.tenureEnd = body.termEnd ? new Date(body.termEnd) : null

    const member = await prisma.committee.update({ where: { id }, data: updateData as never })
    await auditLog("UPDATE", "Committee", id, { name: member.name }, session)
    return successResponse(member, "Committee member updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update committee member", 500)
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await prisma.committee.findFirst({ where: { id, deletedAt: null } })
    if (!existing) return errorResponse("Committee member not found", 404)

    await prisma.committee.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } })
    await auditLog("DELETE", "Committee", id, { name: existing.name }, session)
    return successResponse(null, "Committee member deleted successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to delete committee member", 500)
  }
}
