import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const festival = await prisma.festival.findFirst({
      where: { id, deletedAt: null },
      include: { events: { where: { isActive: true }, orderBy: { date: "asc" } } },
    })
    if (!festival) return errorResponse("Festival not found", 404)
    return successResponse(festival)
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
    const existing = await prisma.festival.findFirst({ where: { id, deletedAt: null } })
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

    const festival = await prisma.festival.update({ where: { id }, data: updateData as never })
    await auditLog("UPDATE", "Festival", id, { name: festival.name }, session)
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
    const existing = await prisma.festival.findFirst({ where: { id, deletedAt: null } })
    if (!existing) return errorResponse("Festival not found", 404)

    await prisma.festival.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } })
    await auditLog("DELETE", "Festival", id, { name: existing.name }, session)
    return successResponse(null, "Festival deleted successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to delete festival", 500)
  }
}
