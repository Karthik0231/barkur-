import { auth } from "@/lib/auth"
import { findTestimonialById, updateTestimonial } from "@/lib/models/testimonial"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await findTestimonialById(id)
    if (!existing) return errorResponse("Testimonial not found", 404)

    const body = await request.json()
    const updateData: Record<string, unknown> = {}
    if (body.isApproved !== undefined) updateData.isApproved = body.isApproved
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured
    if (body.name) updateData.name = body.name
    if (body.content) updateData.content = body.content
    if (body.rating !== undefined) updateData.rating = body.rating
    if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder

    const testimonial = await updateTestimonial(id, updateData)
    const action = body.isApproved === true ? "APPROVE" : body.isApproved === false ? "REJECT" : "UPDATE"
    await auditLog(action, "Testimonial", id, { name: testimonial?.name, isApproved: testimonial?.isApproved }, session)
    return successResponse(testimonial, "Testimonial updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update testimonial", 500)
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await findTestimonialById(id)
    if (!existing) return errorResponse("Testimonial not found", 404)

    await updateTestimonial(id, { deletedAt: new Date() })
    await auditLog("DELETE", "Testimonial", id, { name: existing.name }, session)
    return successResponse(null, "Testimonial deleted successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to delete testimonial", 500)
  }
}
