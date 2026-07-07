import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

const bookingInclude = {
  items: { include: { seva: { select: { id: true, name: true, slug: true, price: true } } } },
  payments: true,
  sevaDate: true,
  user: { select: { id: true, name: true, email: true, phone: true } },
  certificates: true,
  receipts: true,
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const { id } = await params
    const isAdmin = checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER", "RECEPTION"])
    const booking = await prisma.booking.findFirst({
      where: isAdmin ? { id, deletedAt: null } : { id, userId: user.id, deletedAt: null },
      include: bookingInclude,
    })
    if (!booking) return errorResponse("Booking not found", 404)
    return successResponse(booking)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch booking", 500)
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER", "RECEPTION"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await prisma.booking.findFirst({ where: { id, deletedAt: null } })
    if (!existing) return errorResponse("Booking not found", 404)

    const body = await request.json()
    const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]
    if (body.bookingStatus && !validStatuses.includes(body.bookingStatus))
      return errorResponse("Invalid booking status", 400)

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...(body.bookingStatus ? {
          bookingStatus: body.bookingStatus,
          status: body.bookingStatus,
        } : {}),
        ...(body.remarks ? { remarks: body.remarks } : {}),
      },
      include: bookingInclude,
    })

    await auditLog("UPDATE_STATUS", "Booking", id, { status: body.bookingStatus }, session)
    return successResponse(booking, "Booking updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update booking", 500)
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const { id } = await params
    const isAdmin = checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"])
    const booking = await prisma.booking.findFirst({
      where: isAdmin ? { id, deletedAt: null } : { id, userId: user.id, deletedAt: null },
    })
    if (!booking) return errorResponse("Booking not found", 404)
    if (!isAdmin && booking.bookingStatus !== "PENDING")
      return errorResponse("Cannot cancel a non-pending booking", 400)

    await prisma.booking.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        bookingStatus: "CANCELLED",
        status: "CANCELLED",
        cancellationReason: "Cancelled by user",
      },
    })

    await auditLog("CANCEL", "Booking", id, {}, session)
    return successResponse(null, "Booking cancelled successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to cancel booking", 500)
  }
}
