import { auth } from "@/lib/auth"
import { findHallBookingById, updateHallBooking } from "@/lib/models/hallBooking"
import { findManyHalls } from "@/lib/models/hall"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"
import { toObjectId } from "@/lib/models/utils"
import { sendEmail } from "@/lib/emails"
import { TEMPLE_NAME } from "@/lib/constants"

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

    // Get hall name for email
    const hallName = booking.hallId
      ? (await findManyHalls({ _id: { $in: [toObjectId(booking.hallId)] } }))[0]?.name || "Temple Hall"
      : "Temple Hall"

    const bookingDate = booking.bookingDate
      ? new Date(booking.bookingDate).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
      : ""
    const timeStr = booking.startTime && booking.endTime
      ? `${new Date(booking.startTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} - ${new Date(booking.endTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
      : ""

    if (action === "approve") {
      await updateHallBooking(id, {
        adminApproval: "APPROVED",
        bookingStatus: "CONFIRMED",
        approvedBy: user.id,
        approvedAt: new Date(),
      })

      // Send approval email
      if (booking.organizerEmail) {
        const html = `
          <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;">
            <div style="background:#7B1A2C;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
              <h1 style="color:#D4A843;margin:0;">${TEMPLE_NAME}</h1>
            </div>
            <div style="background:#FDF8F0;padding:30px;border:1px solid #C4A882;">
              <h2 style="color:#2D7A3A;">✓ Booking Confirmed!</h2>
              <p>Dear ${booking.organizerName || "Devotee"},</p>
              <p>Your hall booking request has been <strong>approved</strong>.</p>
              <table style="width:100%;border-collapse:collapse;margin:20px 0;">
                <tr><td style="padding:8px;border:1px solid #C4A882;font-weight:bold;">Hall</td><td style="padding:8px;border:1px solid #C4A882;">${hallName}</td></tr>
                <tr><td style="padding:8px;border:1px solid #C4A882;font-weight:bold;">Date</td><td style="padding:8px;border:1px solid #C4A882;">${bookingDate}</td></tr>
                <tr><td style="padding:8px;border:1px solid #C4A882;font-weight:bold;">Time</td><td style="padding:8px;border:1px solid #C4A882;">${timeStr}</td></tr>
                <tr><td style="padding:8px;border:1px solid #C4A882;font-weight:bold;">Event</td><td style="padding:8px;border:1px solid #C4A882;">${booking.eventName || ""}</td></tr>
                <tr><td style="padding:8px;border:1px solid #C4A882;font-weight:bold;">Booking ID</td><td style="padding:8px;border:1px solid #C4A882;">${booking.bookingId || id}</td></tr>
              </table>
              <p>Please arrive on time. Contact the temple for any changes.</p>
              <p>With blessings,<br/>${TEMPLE_NAME}</p>
            </div>
          </div>
        `
        sendEmail({ to: booking.organizerEmail, subject: `Hall Booking Confirmed - ${booking.bookingId || id}`, html }).catch(() => {})
      }

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

      // Send rejection email
      if (booking.organizerEmail) {
        const html = `
          <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;">
            <div style="background:#7B1A2C;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
              <h1 style="color:#D4A843;margin:0;">${TEMPLE_NAME}</h1>
            </div>
            <div style="background:#FDF8F0;padding:30px;border:1px solid #C4A882;">
              <h2 style="color:#C4362A;">Booking Not Approved</h2>
              <p>Dear ${booking.organizerName || "Devotee"},</p>
              <p>We regret to inform you that your hall booking request has not been approved.</p>
              <table style="width:100%;border-collapse:collapse;margin:20px 0;">
                <tr><td style="padding:8px;border:1px solid #C4A882;font-weight:bold;">Hall</td><td style="padding:8px;border:1px solid #C4A882;">${hallName}</td></tr>
                <tr><td style="padding:8px;border:1px solid #C4A882;font-weight:bold;">Date</td><td style="padding:8px;border:1px solid #C4A882;">${bookingDate}</td></tr>
                <tr><td style="padding:8px;border:1px solid #C4A882;font-weight:bold;">Reason</td><td style="padding:8px;border:1px solid #C4A882;">${body.reason}</td></tr>
              </table>
              <p>Please try booking a different date or contact the temple for assistance.</p>
              <p>With blessings,<br/>${TEMPLE_NAME}</p>
            </div>
          </div>
        `
        sendEmail({ to: booking.organizerEmail, subject: `Hall Booking Update - ${booking.bookingId || id}`, html }).catch(() => {})
      }

      await auditLog("REJECT", "HallBooking", id, { reason: body.reason }, session)
      return successResponse(null, "Hall booking rejected successfully")
    }

    return errorResponse("Invalid action. Use 'approve' or 'reject'", 400)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to process hall booking", 500)
  }
}
