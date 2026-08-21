import { auth } from "@/lib/auth"
import { findGalleryById, updateGallery } from "@/lib/models/gallery"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const item = await findGalleryById(id)
    if (!item) return errorResponse("Gallery item not found", 404)
    return successResponse(item)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch gallery item", 500)
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await findGalleryById(id)
    if (!existing) return errorResponse("Gallery item not found", 404)

    const body = await request.json()
    const updateData: Record<string, unknown> = {}
    const allowed = ["title", "description", "image", "videoUrl", "type", "category", "tags", "isFeatured", "isPublished", "sortOrder"]
    for (const key of allowed) {
      if (body[key] !== undefined) updateData[key] = body[key]
    }

    const item = await updateGallery(id, updateData)
    await auditLog("UPDATE", "Gallery", id, { title: item?.title }, session)
    return successResponse(item, "Gallery item updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update gallery item", 500)
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await findGalleryById(id)
    if (!existing) return errorResponse("Gallery item not found", 404)

    await updateGallery(id, { deletedAt: new Date() })
    await auditLog("DELETE", "Gallery", id, { title: existing.title }, session)
    return successResponse(null, "Gallery item deleted successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to delete gallery item", 500)
  }
}
