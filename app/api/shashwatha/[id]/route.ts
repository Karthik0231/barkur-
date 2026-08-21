import { auth } from "@/lib/auth"
import { findShashwathaBookingById, updateShashwathaBooking } from "@/lib/models/shashwathaBooking"
import { findManySevas } from "@/lib/models/seva"
import { findUserById } from "@/lib/models/user"
import { toObjectId } from "@/lib/models/utils"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const { id } = await params
    const isAdmin = checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"])
    const booking = await findShashwathaBookingById(id)
    if (!booking || (!isAdmin && booking.userId !== user.id)) return errorResponse("Shashwatha booking not found", 404)

    const [seva, userData] = await Promise.all([
      booking.sevaId ? findManySevas({ _id: { $in: [toObjectId(booking.sevaId)] } }) : Promise.resolve([]),
      booking.userId ? findUserById(booking.userId) : Promise.resolve(null),
    ])

    const enrichedBooking = {
      ...booking,
      seva: seva[0] ? { id: seva[0].id, name: seva[0].name, slug: seva[0].slug, price: seva[0].price } : null,
      user: userData ? { id: userData.id, name: userData.name, email: userData.email, phone: userData.phone } : null,
    }

    return successResponse(enrichedBooking)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch shashwatha booking", 500)
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await findShashwathaBookingById(id)
    if (!existing) return errorResponse("Shashwatha booking not found", 404)

    const body = await request.json()
    const updateData: Record<string, unknown> = {}
    if (body.status) updateData.status = body.status
    if (body.adminApproval) updateData.adminApproval = body.adminApproval
    if (body.adminApproval === "APPROVED") updateData.approvedBy = user.id

    const updatedBooking = await updateShashwathaBooking(id, updateData)
    if (!updatedBooking) return errorResponse("Shashwatha booking not found", 404)

    const [seva, userData] = await Promise.all([
      updatedBooking.sevaId ? findManySevas({ _id: { $in: [toObjectId(updatedBooking.sevaId)] } }) : Promise.resolve([]),
      updatedBooking.userId ? findUserById(updatedBooking.userId) : Promise.resolve(null),
    ])

    const enrichedBooking = {
      ...updatedBooking,
      seva: seva[0] ? { id: seva[0].id, name: seva[0].name } : null,
      user: userData ? { id: userData.id, name: userData.name, email: userData.email } : null,
    }

    await auditLog("UPDATE", "ShashwathaBooking", id, { status: body.status, approval: body.adminApproval }, session)
    return successResponse(enrichedBooking, "Shashwatha booking updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update shashwatha booking", 500)
  }
}
