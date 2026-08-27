import { auth } from "@/lib/auth"
import { findManyHallBookings, countHallBookings, createHallBooking } from "@/lib/models/hallBooking"
import { findHallBySlug, findManyHalls } from "@/lib/models/hall"
import { findManyUsers } from "@/lib/models/user"
import { hallBookingSchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"
import { generateBookingId } from "@/lib/utils"
import { toObjectId } from "@/lib/models/utils"

export async function GET(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const { searchParams } = new URL(request.url)
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper(searchParams)
    const isAdmin = checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER", "RECEPTION"])

    const where: Record<string, unknown> = {}
    if (!isAdmin && user) where.userId = user.id

    const [bookings, total] = await Promise.all([
      findManyHallBookings(where, { skip, limit, sortBy, sortOrder }),
      countHallBookings(where),
    ])

    const hallIds = bookings.filter(b => b.hallId).map(b => b.hallId)
    const userIds = bookings.filter(b => b.userId).map(b => b.userId)

    const [halls, users] = await Promise.all([
      hallIds.length ? findManyHalls({ _id: { $in: hallIds.map(id => toObjectId(id)) } }) : Promise.resolve([]),
      userIds.length ? findManyUsers({ _id: { $in: userIds.map(id => toObjectId(id)) } }) : Promise.resolve([]),
    ])

    const hallMap = new Map(halls.map(h => [h.id, h]))
    const userMap = new Map(users.map(u => [u.id, u]))

    bookings.forEach(b => {
      b.hall = b.hallId ? hallMap.get(b.hallId) : undefined
      b.user = b.userId ? userMap.get(b.userId) : undefined
    })

    return successResponse({ bookings, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch hall bookings", 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)

    const body = await request.json()
    const parsed = hallBookingSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const hall = await findHallBySlug(data.hallName)
    if (!hall?.isActive) return errorResponse("Hall not found", 404)

    const bookingDate = new Date(data.eventDate)
    const startTime = new Date(`${data.eventDate}T${data.startTime}`)
    const endTime = new Date(`${data.eventDate}T${data.endTime}`)

    const conflict = await findManyHallBookings({
      hallId: hall.id,
      bookingStatus: { $nin: ["CANCELLED"] },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    }, { limit: 1 })
    if (conflict.length > 0) return errorResponse("Hall is already booked for the requested time slot", 409)

    const count = await countHallBookings({})
    const bookingId = generateBookingId("HALL", count + 1)
    const totalAmount = Number(hall.basePrice ?? hall.pricePerDay ?? 0)

    const booking = await createHallBooking({
      bookingId,
      hallId: hall.id,
      userId: user?.id ?? null,
      eventName: data.eventType,
      eventType: data.eventType,
      organizerName: data.organizerName,
      organizerPhone: data.organizerPhone,
      organizerEmail: data.organizerEmail,
      bookingDate,
      startTime,
      endTime,
      totalAmount,
      finalAmount: totalAmount,
      expectedGuests: data.expectedGuests,
      specialRequests: data.remarks ?? null,
      createdBy: user?.id ?? null,
    })

    const [createdHall, createdUser] = await Promise.all([
      findManyHalls({ _id: { $in: [toObjectId(booking.hallId)] } }),
      findManyUsers({ _id: { $in: [toObjectId(booking.userId)] } }),
    ])

    const finalBooking = {
      ...booking,
      hall: createdHall[0] ? { id: createdHall[0].id, name: createdHall[0].name, slug: createdHall[0].slug } : undefined,
      user: createdUser[0] ? { id: createdUser[0].id, name: createdUser[0].name, email: createdUser[0].email, phone: createdUser[0].phone } : undefined,
    }

    await auditLog("CREATE", "HallBooking", booking.id, { bookingId, hallId: hall.id }, session)
    return successResponse(finalBooking, "Hall booking created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create hall booking", 500)
  }
}
