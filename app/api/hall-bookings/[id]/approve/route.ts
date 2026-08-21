import { auth } from "@/lib/auth"
import { findHallBookingById, updateHallBooking } from "@/lib/models/hallBooking"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const body = await request.json()
    const action = body.action as string

    const booking = await findHallBookingById(id)
    if (!booking) return errorResponse("Hall booking not found", 404)

    if (action === "approve") {
      await updateHallBooking(id, {
        adminApproval: "APPROVED",
        bookingStatus: "CONFIRMED",
        approvedBy: user.id,
        approvedAt: new Date(),
      })
      await auditLog("APPROVE", "HallBooking", id, {}, session)
      return successResponse(null, "Hall booking approved successfully")
    } else if (action === "reject") {
      if (!body.reason) return errorResponse("Rejection reason is required", 400)

      await updateHallBooking(id, {
        adminApproval: "REJECTED",
        bookingStatus: "CANCELLED",
        approvedBy: user.id,
        approvedAt: new Date(),
        cancellationReason: body.reason,
      })
      await auditLog("REJECT", "HallBooking", id, { reason: body.reason }, session)
      return successResponse(null, "Hall booking rejected successfully")
    }

    return errorResponse("Invalid action. Use 'approve' or 'reject'", 400)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to process hall booking", 500)
  }
}
