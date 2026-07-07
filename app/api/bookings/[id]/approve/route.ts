import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
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

    const booking = await prisma.booking.findFirst({
      where: { id, deletedAt: null },
      include: { user: { select: { id: true, name: true, email: true } } },
    })
    if (!booking) return errorResponse("Booking not found", 404)

    if (action === "approve") {
      await prisma.booking.update({
        where: { id },
        data: {
          adminApproval: "APPROVED",
          bookingStatus: "CONFIRMED",
          status: "CONFIRMED",
          approvedBy: user.id,
          approvedAt: new Date(),
        },
      })

      if (booking.user?.email) {
        await sendBookingConfirmation(
          { id: booking.bookingId, type: "Seva Booking", date: booking.preferredDate?.toISOString() ?? "", amount: Number(booking.finalAmount) },
          { email: booking.user.email, name: booking.user.name ?? "Devotee" }
        )
      }

      await auditLog("APPROVE", "Booking", id, {}, session)
      return successResponse(null, "Booking approved successfully")
    } else if (action === "reject") {
      if (!body.reason) return errorResponse("Rejection reason is required", 400)

      await prisma.booking.update({
        where: { id },
        data: {
          adminApproval: "REJECTED",
          bookingStatus: "CANCELLED",
          status: "CANCELLED",
          approvedBy: user.id,
          approvedAt: new Date(),
          cancellationReason: body.reason,
        },
      })

      await auditLog("REJECT", "Booking", id, { reason: body.reason }, session)
      return successResponse(null, "Booking rejected successfully")
    }

    return errorResponse("Invalid action. Use 'approve' or 'reject'", 400)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to process booking", 500)
  }
}
