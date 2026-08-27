import { auth } from "@/lib/auth"
import { findManyShashwathaBookings, countShashwathaBookings, createShashwathaBooking } from "@/lib/models/shashwathaBooking"
import { findUserById, findManyUsers } from "@/lib/models/user"
import { toObjectId } from "@/lib/models/utils"
import { shashwathaBookingSchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"
import { generateBookingId } from "@/lib/utils"
import { getShashwathaSevas } from "@/lib/data/sevas"

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
      const userIds = [...new Set(bookings.map((b) => b.userId).filter(Boolean) as string[])]

      const users = userIds.length > 0
        ? await findManyUsers({ _id: { $in: userIds.map((id) => toObjectId(id)) } })
        : []
      const usersById = users.reduce((acc, u) => { acc[u.id] = u; return acc }, {} as Record<string, any>)

      // Map seva IDs to local JSON data
      const localSevas = getShashwathaSevas("en")
      const localSevasById = localSevas.reduce((acc, s) => { acc[s.id] = s; return acc }, {} as Record<string, any>)

      const enrichedBookings = bookings.map((booking) => ({
        ...booking,
        seva: localSevasById[booking.sevaId]
          ? { id: booking.sevaId, name: localSevasById[booking.sevaId].name, slug: localSevasById[booking.sevaId].slug }
          : { id: booking.sevaId, name: booking.shashwathaType || "Shashwatha", slug: "" },
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

    const body = await request.json()
    const parsed = shashwathaBookingSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data

    // Find the shashwatha seva from local JSON
    const localSevas = getShashwathaSevas("en")
    const matchingSeva = localSevas.find((s) => s.type === data.type)
    if (!matchingSeva) return errorResponse("No shashwatha seva available for the selected type", 404)

    const count = await countShashwathaBookings()
    const bookingId = generateBookingId("SHASHWATHA", count + 1)

    const booking = await createShashwathaBooking({
      bookingId,
      userId: user?.id ?? null,
      sevaId: matchingSeva.id,
      shashwathaType: data.type,
      selectedDate: data.startDate ? new Date(data.startDate) : null,
      amount: matchingSeva.price,
      devoteeDetails: {
        name: data.devoteeName,
        gotra: data.gotra,
        nakshatra: data.nakshatra,
        rashi: data.rashi,
        phone: data.phone,
        email: data.email,
        address: data.address,
        state: data.state,
        district: data.district,
        pincode: data.pincode,
      },
      status: "PENDING",
      adminApproval: "PENDING",
    })

    const enrichedBooking = {
      ...booking,
      seva: { id: matchingSeva.id, name: matchingSeva.name, slug: matchingSeva.slug },
      user: { id: user?.id ?? null, name: data.devoteeName, email: data.email },
    }

    await auditLog("CREATE", "ShashwathaBooking", booking.id, { bookingId, type: data.type }, session)
    return successResponse(enrichedBooking, "Shashwatha booking created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create shashwatha booking", 500)
  }
}
