import { auth } from "@/lib/auth"
import { findAnnouncementById, updateAnnouncement } from "@/lib/models/announcement"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await findAnnouncementById(id)
    if (!existing) return errorResponse("Announcement not found", 404)

    const body = await request.json()
    const updateData: Record<string, unknown> = {}
    const allowed = ["title", "content", "isActive", "isPopup", "link", "linkText", "type"]
    for (const key of allowed) {
      if (body[key] !== undefined) updateData[key] = body[key]
    }
    if (body.expiresAt) updateData.endDate = new Date(body.expiresAt)
    if (body.priority) updateData.type = body.priority

    const announcement = await updateAnnouncement(id, updateData)
    await auditLog("UPDATE", "Announcement", id, { title: announcement?.title }, session)
    return successResponse(announcement, "Announcement updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update announcement", 500)
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await findAnnouncementById(id)
    if (!existing) return errorResponse("Announcement not found", 404)

    await updateAnnouncement(id, { deletedAt: new Date(), isActive: false })
    await auditLog("DELETE", "Announcement", id, { title: existing.title }, session)
    return successResponse(null, "Announcement deleted successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to delete announcement", 500)
  }
}
