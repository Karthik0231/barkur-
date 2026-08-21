import { auth } from "@/lib/auth"
import { findManyShashwathaBookings, countShashwathaBookings, createShashwathaBooking } from "@/lib/models/shashwathaBooking"
import { findManySevas } from "@/lib/models/seva"
import { findUserById, findManyUsers } from "@/lib/models/user"
import { toObjectId } from "@/lib/models/utils"
import { shashwathaBookingSchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"
import { generateBookingId } from "@/lib/utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper(searchParams)
    const session = await auth()
    const user = getAuthUser(session)
    const isAdmin = user && checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"])

    const where: Record<string, unknown> = {}
    if (!isAdmin && user) where.userId = user.id

    const [bookings, total] = await Promise.all([
      findManyShashwathaBookings(where, { skip, limit, sortBy, sortOrder }),
      countShashwathaBookings(where),
    ])

    if (bookings.length > 0) {
      const sevaIds = [...new Set(bookings.map((b) => b.sevaId).filter(Boolean) as string[])]
      const userIds = [...new Set(bookings.map((b) => b.userId).filter(Boolean) as string[])]

      const [sevas, users] = await Promise.all([
        sevaIds.length > 0 ? findManySevas({ _id: { $in: sevaIds.map((id) => toObjectId(id)) } }) : Promise.resolve([]),
        userIds.length > 0 ? findManyUsers({ _id: { $in: userIds.map((id) => toObjectId(id)) } }) : Promise.resolve([]),
      ])

      const sevasById = sevas.reduce((acc, s) => { acc[s.id] = s; return acc }, {} as Record<string, any>)
      const usersById = users.reduce((acc, u) => { acc[u.id] = u; return acc }, {} as Record<string, any>)

      const enrichedBookings = bookings.map((booking) => ({
        ...booking,
        seva: sevasById[booking.sevaId] ? { id: sevasById[booking.sevaId].id, name: sevasById[booking.sevaId].name, slug: sevasById[booking.sevaId].slug } : null,
        user: usersById[booking.userId] ? { id: usersById[booking.userId].id, name: usersById[booking.userId].name, email: usersById[booking.userId].email } : null,
      }))

      return successResponse({ bookings: enrichedBookings, total, page, limit, totalPages: Math.ceil(total / limit) })
    }

    return successResponse({ bookings: [], total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch shashwatha bookings", 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const parsed = shashwathaBookingSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const sevas = await findManySevas({ isShashwatha: true, shashwathaType: data.type, isActive: true })
    const seva = sevas[0]
    if (!seva) return errorResponse("No shashwatha seva available for the selected type", 404)

    const count = await countShashwathaBookings()
    const bookingId = generateBookingId("SHASHWATHA", count + 1)

    const booking = await createShashwathaBooking({
      bookingId,
      userId: user.id,
      sevaId: seva.id,
      shashwathaType: data.type,
      selectedDate: data.startDate ? new Date(data.startDate) : null,
      amount: seva.price,
      status: "PENDING",
      adminApproval: "PENDING",
    })

    const userData = await findUserById(user.id)
    const enrichedBooking = {
      ...booking,
      seva: { id: seva.id, name: seva.name, slug: seva.slug },
      user: userData ? { id: userData.id, name: userData.name, email: userData.email } : null,
    }

    await auditLog("CREATE", "ShashwathaBooking", booking.id, { bookingId, type: data.type }, session)
    return successResponse(enrichedBooking, "Shashwatha booking created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create shashwatha booking", 500)
  }
}
