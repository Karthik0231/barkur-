import { auth } from "@/lib/auth"
import { findHallById, updateHall } from "@/lib/models/hall"
import { findManyHallAvailabilities } from "@/lib/models/hallAvailability"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const hall = await findHallById(id)
    if (!hall) return errorResponse("Hall not found", 404)

    const availabilities = await findManyHallAvailabilities(
      { hallId: id, isAvailable: true },
      { limit: 30, sortBy: "date", sortOrder: "asc" }
    )

    return successResponse({ ...hall, availabilities })
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
    const existing = await findHallById(id)
    if (!existing) return errorResponse("Hall not found", 404)

    const body = await request.json()
    const updateData: Record<string, unknown> = {}
    const allowed = ["name", "slug", "description", "capacity", "basePrice", "pricePerHour", "pricePerDay", "securityDeposit", "amenities", "rules", "isActive", "images"]
    for (const key of allowed) {
      if (body[key] !== undefined) updateData[key] = body[key]
    }

    const hall = await updateHall(id, updateData)
    await auditLog("UPDATE", "Hall", id, { name: hall?.name }, session)
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
    const existing = await findHallById(id)
    if (!existing) return errorResponse("Hall not found", 404)

    await updateHall(id, { deletedAt: new Date(), isActive: false })
    await auditLog("DELETE", "Hall", id, { name: existing.name }, session)
    return successResponse(null, "Hall deleted successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to delete hall", 500)
  }
}
