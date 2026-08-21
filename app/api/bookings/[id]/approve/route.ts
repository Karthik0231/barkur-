import { auth } from "@/lib/auth"
import { findBookingById, updateBooking } from "@/lib/models/booking"
import { findUserById } from "@/lib/models/user"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"
import { sendBookingConfirmation } from "@/lib/emails"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const body = await request.json()
    const action = body.action as string

    const booking = await findBookingById(id)
    if (!booking) return errorResponse("Booking not found", 404)

    const userData = booking.userId ? await findUserById(booking.userId) : null

    if (action === "approve") {
      await updateBooking(id, {
        adminApproval: "APPROVED",
        bookingStatus: "CONFIRMED",
        status: "CONFIRMED",
        approvedBy: user.id,
        approvedAt: new Date(),
      })

      if (userData?.email) {
        await sendBookingConfirmation(
          { id: booking.bookingId, type: "Seva Booking", date: booking.preferredDate?.toISOString() ?? "", amount: Number(booking.finalAmount) },
          { email: userData.email, name: userData.name ?? "Devotee" }
        )
      }

      await auditLog("APPROVE", "Booking", id, {}, session)
      return successResponse(null, "Booking approved successfully")
    } else if (action === "reject") {
      if (!body.reason) return errorResponse("Rejection reason is required", 400)

      await updateBooking(id, {
        adminApproval: "REJECTED",
        bookingStatus: "CANCELLED",
        status: "CANCELLED",
        approvedBy: user.id,
        approvedAt: new Date(),
        cancellationReason: body.reason,
      })

      await auditLog("REJECT", "Booking", id, { reason: body.reason }, session)
      return successResponse(null, "Booking rejected successfully")
    }

    return errorResponse("Invalid action. Use 'approve' or 'reject'", 400)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to process booking", 500)
  }
}
