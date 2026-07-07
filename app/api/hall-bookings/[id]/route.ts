import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

const bookingInclude = {
  hall: { select: { id: true, name: true, slug: true, basePrice: true, capacity: true } },
  user: { select: { id: true, name: true, email: true, phone: true } },
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const { id } = await params
    const isAdmin = checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER", "RECEPTION"])
    const booking = await prisma.hallBooking.findFirst({
      where: isAdmin ? { id, deletedAt: null } : { id, userId: user.id, deletedAt: null },
      include: bookingInclude,
    })
    if (!booking) return errorResponse("Hall booking not found", 404)
    return successResponse(booking)
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
    const existing = await prisma.hallBooking.findFirst({ where: { id, deletedAt: null } })
    if (!existing) return errorResponse("Hall booking not found", 404)

    const body = await request.json()
    const updateData: Record<string, unknown> = {}
    const allowed = ["eventName", "eventType", "expectedGuests", "specialRequests", "bookingStatus", "totalAmount", "finalAmount"]
    for (const key of allowed) {
      if (body[key] !== undefined) updateData[key] = body[key]
    }

    const booking = await prisma.hallBooking.update({ where: { id }, data: updateData as never, include: bookingInclude })
    await auditLog("UPDATE", "HallBooking", id, { status: body.bookingStatus }, session)
    return successResponse(booking, "Hall booking updated successfully")
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
    const booking = await prisma.hallBooking.findFirst({
      where: isAdmin ? { id, deletedAt: null } : { id, userId: user.id, deletedAt: null },
    })
    if (!booking) return errorResponse("Hall booking not found", 404)

    await prisma.hallBooking.update({
      where: { id },
      data: { deletedAt: new Date(), bookingStatus: "CANCELLED", cancellationReason: "Cancelled by user" },
    })
    await auditLog("CANCEL", "HallBooking", id, {}, session)
    return successResponse(null, "Hall booking cancelled successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to cancel hall booking", 500)
  }
}
