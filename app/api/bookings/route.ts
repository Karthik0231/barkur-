import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sevaBookingSchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"
import { generateBookingId } from "@/lib/utils"

const bookingInclude = {
  items: { include: { seva: { select: { id: true, name: true, slug: true } } } },
  payments: true,
  sevaDate: { select: { id: true, date: true } },
}

export async function GET(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const { searchParams } = new URL(request.url)
    const { page, limit, skip, search, sortBy, sortOrder } = paginationHelper(searchParams)
    const isAdmin = checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER", "RECEPTION"])

    const where: Record<string, unknown> = { deletedAt: null }
    if (!isAdmin) where.userId = user.id
    if (search) where.OR = [
      { bookingId: { contains: search, mode: "insensitive" } },
      { devoteeDetails: { path: ["name"], string_contains: search } },
    ]

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where: where as never,
        include: { ...bookingInclude, user: { select: { id: true, name: true, email: true, phone: true } } },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.booking.count({ where: where as never }),
    ])

    return successResponse({ bookings, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch bookings", 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const parsed = sevaBookingSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const seva = await prisma.seva.findFirst({ where: { id: data.sevaId, deletedAt: null, isActive: true } })
    if (!seva) return errorResponse("Seva not found or inactive", 404)

    const count = await prisma.booking.count()
    const bookingId = generateBookingId("SEVA", count + 1)

    const totalAmount = Number(seva.price) * data.quantity
    const booking = await prisma.booking.create({
      data: {
        bookingId,
        userId: user.id,
        totalAmount,
        finalAmount: totalAmount,
        quantity: data.quantity,
        preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
        preferredTime: data.preferredTime ?? null,
        remarks: data.remarks ?? null,
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
        specialInstructions: data.specialInstructions ? JSON.parse(JSON.stringify(data.specialInstructions)) : null,
        createdBy: user.id,
        items: {
          create: {
            sevaId: data.sevaId,
            devoteeName: data.devoteeName,
            gotra: data.gotra,
            nakshatra: data.nakshatra,
            rashi: data.rashi,
            quantity: data.quantity,
            unitPrice: seva.price,
            totalPrice: totalAmount,
            specialInstructions: data.specialInstructions ?? null,
          },
        },
      },
      include: bookingInclude,
    })

    await auditLog("CREATE", "Booking", booking.id, { bookingId, sevaId: data.sevaId }, session)
    return successResponse(booking, "Booking created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create booking", 500)
  }
}
