import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"
import bcrypt from "bcryptjs"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const found = await prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, name: true, email: true, phone: true, role: true, isActive: true, image: true, lastLogin: true, createdAt: true, updatedAt: true },
    })
    if (!found) return errorResponse("User not found", 404)
    return successResponse(found)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch user", 500)
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const currentUser = getAuthUser(session)
    if (!currentUser || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await prisma.user.findFirst({ where: { id, deletedAt: null } })
    if (!existing) return errorResponse("User not found", 404)

    const body = await request.json()
    const updateData: Record<string, unknown> = { updatedBy: currentUser.id }
    if (body.name) updateData.name = body.name
    if (body.phone) updateData.phone = body.phone
    if (body.role) updateData.role = body.role
    if (body.isActive !== undefined) updateData.isActive = body.isActive
    if (body.password) updateData.password = await bcrypt.hash(body.password, 12)

    const updated = await prisma.user.update({
      where: { id },
      data: updateData as never,
      select: { id: true, name: true, email: true, phone: true, role: true, isActive: true },
    })

    await auditLog("UPDATE", "User", id, { name: updated.name }, session)
    return successResponse(updated, "User updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update user", 500)
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const currentUser = getAuthUser(session)
    if (!currentUser || !checkRole(session, ["SUPER_ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    if (id === currentUser.id) return errorResponse("Cannot delete yourself", 400)

    const existing = await prisma.user.findFirst({ where: { id, deletedAt: null } })
    if (!existing) return errorResponse("User not found", 404)

    await prisma.user.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } })
    await auditLog("DELETE", "User", id, { email: existing.email }, session)
    return successResponse(null, "User deleted successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to delete user", 500)
  }
}
