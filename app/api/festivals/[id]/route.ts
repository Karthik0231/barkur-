import { auth } from "@/lib/auth"
import { findFestivalById, updateFestival, findEventsByFestivalId } from "@/lib/models/festival"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const festival = await findFestivalById(id)
    if (!festival) return errorResponse("Festival not found", 404)
    const events = await findEventsByFestivalId(id)
    return successResponse({ ...festival, events })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch festival", 500)
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await findFestivalById(id)
    if (!existing) return errorResponse("Festival not found", 404)

    const body = await request.json()
    const updateData: Record<string, unknown> = { updatedBy: user.id }
    const allowed = ["name", "slug", "description", "shortDescription", "significance", "rituals", "image", "isActive", "isFeatured", "category"]
    for (const key of allowed) {
      if (body[key] !== undefined) updateData[key] = body[key]
    }
    if (body.startDate) updateData.startDate = new Date(body.startDate)
    if (body.endDate !== undefined) updateData.endDate = body.endDate ? new Date(body.endDate) : null
    if (body.startDate || body.endDate) updateData.isMultiDay = !!updateData.endDate

    const festival = await updateFestival(id, updateData)
    await auditLog("UPDATE", "Festival", id, { name: festival?.name }, session)
    return successResponse(festival, "Festival updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update festival", 500)
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await findFestivalById(id)
    if (!existing) return errorResponse("Festival not found", 404)

    await updateFestival(id, { deletedAt: new Date(), isActive: false })
    await auditLog("DELETE", "Festival", id, { name: existing.name }, session)
    return successResponse(null, "Festival deleted successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to delete festival", 500)
  }
}
