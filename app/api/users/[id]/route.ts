import { auth } from "@/lib/auth"
import { successResponse, errorResponse, getAuthUser, checkRole } from "@/lib/api-utils"
import { prisma } from "@/lib/prisma"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const found = await prisma.user.findUnique({ where: { id } })
    if (!found || found.deletedAt) return errorResponse("User not found", 404)
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
    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing || existing.deletedAt) return errorResponse("User not found", 404)

    const body = await request.json()
    const updateData: Record<string, unknown> = { updatedBy: currentUser.id }
    if (typeof body.name === "string") updateData.name = body.name
    if (typeof body.email === "string" || body.email === null) updateData.email = body.email
    if (typeof body.phone === "string" || body.phone === null) updateData.phone = body.phone
    if (typeof body.image === "string" || body.image === null) updateData.image = body.image
    if (typeof body.isActive === "boolean") updateData.isActive = body.isActive
    if (typeof body.role === "string") {
      if (!checkRole(session, ["SUPER_ADMIN"])) return errorResponse("Only super admins can change roles", 403)
      const roles = ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER", "ACCOUNTANT", "VOLUNTEER", "RECEPTION", "DEVOTEE"]
      if (!roles.includes(body.role)) return errorResponse("Invalid role", 400)
      updateData.role = body.role
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData as never,
    })

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

    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing || existing.deletedAt) return errorResponse("User not found", 404)

    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: currentUser.id },
    })

    return successResponse(null, "User deleted successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to delete user", 500)
  }
}
