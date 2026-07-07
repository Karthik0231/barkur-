import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const hall = await prisma.hall.findFirst({
      where: { id, deletedAt: null },
      include: { availabilities: { where: { isAvailable: true }, take: 30, orderBy: { date: "asc" } } },
    })
    if (!hall) return errorResponse("Hall not found", 404)
    return successResponse(hall)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch hall", 500)
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await prisma.hall.findFirst({ where: { id, deletedAt: null } })
    if (!existing) return errorResponse("Hall not found", 404)

    const body = await request.json()
    const updateData: Record<string, unknown> = {}
    const allowed = ["name", "slug", "description", "capacity", "basePrice", "pricePerHour", "pricePerDay", "securityDeposit", "amenities", "rules", "isActive", "images"]
    for (const key of allowed) {
      if (body[key] !== undefined) updateData[key] = body[key]
    }

    const hall = await prisma.hall.update({ where: { id }, data: updateData as never })
    await auditLog("UPDATE", "Hall", id, { name: hall.name }, session)
    return successResponse(hall, "Hall updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update hall", 500)
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await prisma.hall.findFirst({ where: { id, deletedAt: null } })
    if (!existing) return errorResponse("Hall not found", 404)

    await prisma.hall.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } })
    await auditLog("DELETE", "Hall", id, { name: existing.name }, session)
    return successResponse(null, "Hall deleted successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to delete hall", 500)
  }
}
