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
    const updated = await prisma.user.update({
      where: { id },
      data: { ...body, updatedBy: currentUser.id },
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
