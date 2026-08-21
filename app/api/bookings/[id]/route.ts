import { auth } from "@/lib/auth"
import { findBookingById, updateBooking } from "@/lib/models/booking"
import { findManyBookingItems } from "@/lib/models/bookingItem"
import { findManySevas } from "@/lib/models/seva"
import { findUserById } from "@/lib/models/user"
import { findManyPayments } from "@/lib/models/payment"
import { findManyCertificates } from "@/lib/models/certificate"
import { findManyReceipts } from "@/lib/models/receipt"
import { db } from "@/lib/mongodb"
import { toObjectId } from "@/lib/models/utils"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const { id } = await params
    const isAdmin = checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER", "RECEPTION"])
    const booking = await findBookingById(id)
    if (!booking || (!isAdmin && booking.userId !== user.id)) return errorResponse("Booking not found", 404)

    const [items, payments, sevaDate, certificates, receipts] = await Promise.all([
      findManyBookingItems({ bookingId: id }),
      findManyPayments({ bookingId: id }),
      booking.sevaDateId ? db.collection("sevaDates").findOne({ _id: toObjectId(booking.sevaDateId) }).then((d) => d ? { ...d, id: d._id.toHexString() } : null) : Promise.resolve(null),
      findManyCertificates({ bookingId: id }),
      findManyReceipts({ bookingId: id }),
    ])

    const sevaIds = items.map((i) => i.sevaId).filter(Boolean) as string[]
    const sevas = sevaIds.length > 0
      ? await findManySevas({ _id: { $in: sevaIds.map((sid) => toObjectId(sid)) } })
      : []
    const sevasById = sevas.reduce((acc, s) => { acc[s.id] = s; return acc }, {} as Record<string, any>)

    const userData = booking.userId ? await findUserById(booking.userId) : null

    const enrichedBooking = {
      ...booking,
      items: items.map((item) => ({
        ...item,
        seva: sevasById[item.sevaId] ? { id: sevasById[item.sevaId].id, name: sevasById[item.sevaId].name, slug: sevasById[item.sevaId].slug, price: sevasById[item.sevaId].price } : null,
      })),
      payments,
      sevaDate,
      user: userData ? { id: userData.id, name: userData.name, email: userData.email, phone: userData.phone } : null,
      certificates,
      receipts,
    }

    return successResponse(enrichedBooking)
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
    const existing = await findBookingById(id)
    if (!existing) return errorResponse("Booking not found", 404)

    const body = await request.json()
    const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]
    if (body.bookingStatus && !validStatuses.includes(body.bookingStatus))
      return errorResponse("Invalid booking status", 400)

    const updateData: Record<string, unknown> = {}
    if (body.bookingStatus) {
      updateData.bookingStatus = body.bookingStatus
      updateData.status = body.bookingStatus
    }
    if (body.remarks) updateData.remarks = body.remarks

    await updateBooking(id, updateData)

    const refreshedBooking = await findBookingById(id)
    const [items, payments, sevaDate, certificates, receipts] = await Promise.all([
      findManyBookingItems({ bookingId: id }),
      findManyPayments({ bookingId: id }),
      refreshedBooking?.sevaDateId ? db.collection("sevaDates").findOne({ _id: toObjectId(refreshedBooking.sevaDateId) }).then((d) => d ? { ...d, id: d._id.toHexString() } : null) : Promise.resolve(null),
      findManyCertificates({ bookingId: id }),
      findManyReceipts({ bookingId: id }),
    ])

    const sevaIds = items.map((i) => i.sevaId).filter(Boolean) as string[]
    const sevas = sevaIds.length > 0
      ? await findManySevas({ _id: { $in: sevaIds.map((sid) => toObjectId(sid)) } })
      : []
    const sevasById = sevas.reduce((acc, s) => { acc[s.id] = s; return acc }, {} as Record<string, any>)

    const userData = refreshedBooking?.userId ? await findUserById(refreshedBooking.userId) : null

    const enrichedBooking = {
      ...refreshedBooking,
      items: items.map((item) => ({
        ...item,
        seva: sevasById[item.sevaId] ? { id: sevasById[item.sevaId].id, name: sevasById[item.sevaId].name, slug: sevasById[item.sevaId].slug, price: sevasById[item.sevaId].price } : null,
      })),
      payments,
      sevaDate,
      user: userData ? { id: userData.id, name: userData.name, email: userData.email, phone: userData.phone } : null,
      certificates,
      receipts,
    }

    await auditLog("UPDATE_STATUS", "Booking", id, { status: body.bookingStatus }, session)
    return successResponse(enrichedBooking, "Booking updated successfully")
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
    const booking = await findBookingById(id)
    if (!booking || (!isAdmin && booking.userId !== user.id)) return errorResponse("Booking not found", 404)
    if (!isAdmin && booking.bookingStatus !== "PENDING")
      return errorResponse("Cannot cancel a non-pending booking", 400)

    await updateBooking(id, {
      deletedAt: new Date(),
      bookingStatus: "CANCELLED",
      status: "CANCELLED",
      cancellationReason: "Cancelled by user",
    })

    await auditLog("CANCEL", "Booking", id, {}, session)
    return successResponse(null, "Booking cancelled successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to cancel booking", 500)
  }
}
