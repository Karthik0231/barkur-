import { auth } from "@/lib/auth"
import { findHallBookingById, updateHallBooking } from "@/lib/models/hallBooking"
import { findManyHalls } from "@/lib/models/hall"
import { findManyUsers } from "@/lib/models/user"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"
import { toObjectId } from "@/lib/models/utils"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const { id } = await params
    const isAdmin = checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER", "RECEPTION"])
    const booking = await findHallBookingById(id)
    if (!booking || (!isAdmin && booking.userId !== user.id)) return errorResponse("Hall booking not found", 404)

    const [halls, users] = await Promise.all([
      booking?.hallId ? findManyHalls({ _id: { $in: [toObjectId(booking.hallId)] } }) : Promise.resolve([]),
      booking?.userId ? findManyUsers({ _id: { $in: [toObjectId(booking.userId)] } }) : Promise.resolve([]),
    ])

    return successResponse({
      ...booking,
      hall: halls[0] ? { id: halls[0].id, name: halls[0].name, slug: halls[0].slug, basePrice: halls[0].basePrice, capacity: halls[0].capacity } : undefined,
      user: users[0] ? { id: users[0].id, name: users[0].name, email: users[0].email, phone: users[0].phone } : undefined,
    })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch hall booking", 500)
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await findHallBookingById(id)
    if (!existing) return errorResponse("Hall booking not found", 404)

    const body = await request.json()
    const updateData: Record<string, unknown> = {}
    const allowed = ["eventName", "eventType", "expectedGuests", "specialRequests", "bookingStatus", "totalAmount", "finalAmount"]
    for (const key of allowed) {
      if (body[key] !== undefined) updateData[key] = body[key]
    }

    const booking = await updateHallBooking(id, updateData)

    const [halls, users] = await Promise.all([
      booking?.hallId ? findManyHalls({ _id: { $in: [toObjectId(booking.hallId)] } }) : Promise.resolve([]),
      booking?.userId ? findManyUsers({ _id: { $in: [toObjectId(booking.userId)] } }) : Promise.resolve([]),
    ])

    const finalBooking = {
      ...booking,
      hall: halls[0] ? { id: halls[0].id, name: halls[0].name, slug: halls[0].slug, basePrice: halls[0].basePrice, capacity: halls[0].capacity } : undefined,
      user: users[0] ? { id: users[0].id, name: users[0].name, email: users[0].email, phone: users[0].phone } : undefined,
    }

    await auditLog("UPDATE", "HallBooking", id, { status: body.bookingStatus }, session)
    return successResponse(finalBooking, "Hall booking updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update hall booking", 500)
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const { id } = await params
    const isAdmin = checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"])
    const booking = await findHallBookingById(id)
    if (!booking || (!isAdmin && booking.userId !== user.id)) return errorResponse("Hall booking not found", 404)

    await updateHallBooking(id, { deletedAt: new Date(), bookingStatus: "CANCELLED", cancellationReason: "Cancelled by user" })
    await auditLog("CANCEL", "HallBooking", id, {}, session)
    return successResponse(null, "Hall booking cancelled successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to cancel hall booking", 500)
  }
}
