import { auth } from "@/lib/auth"
import { findSubDeityById, updateSubDeity } from "@/lib/models/subDeity"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await findSubDeityById(id)
    if (!existing) return errorResponse("Sub-deity not found", 404)

    const body = await request.json()
    const updateData: Record<string, unknown> = {}
    const allowed = ["name", "description", "significance", "history", "image", "templeLocation", "isActive", "sortOrder"]
    for (const key of allowed) {
      if (body[key] !== undefined) updateData[key] = body[key]
    }
    if (body.imageUrl) updateData.image = body.imageUrl

    const deity = await updateSubDeity(id, updateData)
    await auditLog("UPDATE", "SubDeity", id, { name: deity?.name }, session)
    return successResponse(deity, "Sub-deity updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update sub-deity", 500)
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await findSubDeityById(id)
    if (!existing) return errorResponse("Sub-deity not found", 404)

    await updateSubDeity(id, { deletedAt: new Date(), isActive: false })
    await auditLog("DELETE", "SubDeity", id, { name: existing.name }, session)
    return successResponse(null, "Sub-deity deleted successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to delete sub-deity", 500)
  }
}
