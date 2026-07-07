import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hallBookingSchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"
import { generateBookingId } from "@/lib/utils"

const bookingInclude = {
  hall: { select: { id: true, name: true, slug: true } },
  user: { select: { id: true, name: true, email: true, phone: true } },
}

export async function GET(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const { searchParams } = new URL(request.url)
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper(searchParams)
    const isAdmin = checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER", "RECEPTION"])

    const where: Record<string, unknown> = { deletedAt: null }
    if (!isAdmin) where.userId = user.id

    const [bookings, total] = await Promise.all([
      prisma.hallBooking.findMany({
        where: where as never,
        include: bookingInclude,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.hallBooking.count({ where: where as never }),
    ])

    return successResponse({ bookings, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch hall bookings", 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const parsed = hallBookingSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const hall = await prisma.hall.findFirst({ where: { slug: data.hallName, deletedAt: null, isActive: true } })
    if (!hall) return errorResponse("Hall not found", 404)

    const bookingDate = new Date(data.eventDate)
    const startTime = new Date(`${data.eventDate}T${data.startTime}`)
    const endTime = new Date(`${data.eventDate}T${data.endTime}`)

    const conflict = await prisma.hallBooking.findFirst({
      where: {
        hallId: hall.id,
        deletedAt: null,
        bookingStatus: { notIn: ["CANCELLED"] },
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    })
    if (conflict) return errorResponse("Hall is already booked for the requested time slot", 409)

    const count = await prisma.hallBooking.count()
    const bookingId = generateBookingId("HALL", count + 1)
    const totalAmount = Number(hall.basePrice ?? hall.pricePerDay ?? 0)

    const booking = await prisma.hallBooking.create({
      data: {
        bookingId,
        hallId: hall.id,
        userId: user.id,
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
        createdBy: user.id,
      },
      include: bookingInclude,
    })

    await auditLog("CREATE", "HallBooking", booking.id, { bookingId, hallId: hall.id }, session)
    return successResponse(booking, "Hall booking created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create hall booking", 500)
  }
}
