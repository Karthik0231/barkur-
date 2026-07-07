import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
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

    const where: Record<string, unknown> = { deletedAt: null }
    if (!isAdmin && user) where.userId = user.id

    const [bookings, total] = await Promise.all([
      prisma.shashwathaBooking.findMany({
        where: where as never,
        include: {
          seva: { select: { id: true, name: true, slug: true } },
          user: { select: { id: true, name: true, email: true } },
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.shashwathaBooking.count({ where: where as never }),
    ])

    return successResponse({ bookings, total, page, limit, totalPages: Math.ceil(total / limit) })
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
    const seva = await prisma.seva.findFirst({
      where: { isShashwatha: true, shashwathaType: data.type as never, deletedAt: null, isActive: true },
    })
    if (!seva) return errorResponse("No shashwatha seva available for the selected type", 404)

    const count = await prisma.shashwathaBooking.count()
    const bookingId = generateBookingId("SHASHWATHA", count + 1)

    const booking = await prisma.shashwathaBooking.create({
      data: {
        bookingId,
        userId: user.id,
        sevaId: seva.id,
        shashwathaType: data.type as never,
        selectedDate: data.startDate ? new Date(data.startDate) : null,
        amount: seva.price,
        status: "PENDING",
        adminApproval: "PENDING",
      },
      include: {
        seva: { select: { id: true, name: true, slug: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    })

    await auditLog("CREATE", "ShashwathaBooking", booking.id, { bookingId, type: data.type }, session)
    return successResponse(booking, "Shashwatha booking created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create shashwatha booking", 500)
  }
}
