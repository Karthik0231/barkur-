import { auth } from "@/lib/auth"
import { findTempleStaffById, updateTempleStaff } from "@/lib/models/templeStaff"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await findTempleStaffById(id)
    if (!existing) return errorResponse("Staff member not found", 404)

    const body = await request.json()
    const updateData: Record<string, unknown> = {}
    const allowed = ["name", "role", "designation", "photo", "biography", "email", "phone", "type", "sortOrder", "isActive"]
    for (const key of allowed) {
      if (body[key] !== undefined) updateData[key] = body[key]
    }

    const staff = await updateTempleStaff(id, updateData)
    await auditLog("UPDATE", "Staff", id, { name: staff?.name }, session)
    return successResponse(staff, "Staff updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update staff", 500)
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await findTempleStaffById(id)
    if (!existing) return errorResponse("Staff member not found", 404)

    await updateTempleStaff(id, { deletedAt: new Date(), isActive: false })
    await auditLog("DELETE", "Staff", id, { name: existing.name }, session)
    return successResponse(null, "Staff member deleted successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to delete staff", 500)
  }
}
