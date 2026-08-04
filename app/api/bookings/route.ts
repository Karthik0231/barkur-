import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sevaBookingSchema } from "@/lib/validations"
import { z } from "zod"
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
    const adminApproval = searchParams.get("adminApproval")
    if (adminApproval) where.adminApproval = adminApproval

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
    const count = await prisma.booking.count()
    const bookingId = generateBookingId("SEVA", count + 1)

    const isMultiSeva = "items" in data && Array.isArray(data.items)

    let totalAmount = 0
    const itemsToCreate: any[] = []
    let primaryDevoteeName = ""
    let sharedDevoteeDetails: { name: string; gotra?: string; nakshatra?: string; rashi?: string } = { name: "" }

    if (isMultiSeva) {
      const items = data.items

      for (const item of items) {
        const seva = await prisma.seva.findFirst({ where: { id: item.sevaId, deletedAt: null, isActive: true } })
        if (!seva) return errorResponse(`Seva not found or inactive: ${item.sevaId}`, 404)

        const itemTotal = Number(item.unitPrice) * item.quantity
        totalAmount += itemTotal

        if (!primaryDevoteeName && item.devoteeName) primaryDevoteeName = item.devoteeName

        itemsToCreate.push({
          sevaId: item.sevaId,
          devoteeName: item.devoteeName ?? null,
          gotra: item.gotra ?? null,
          nakshatra: item.nakshatra ?? null,
          rashi: item.rashi ?? null,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: itemTotal,
          specialInstructions: item.specialInstructions ?? null,
        })
      }

      sharedDevoteeDetails = itemsToCreate[0]?.devoteeName
        ? {
            name: itemsToCreate[0].devoteeName,
            gotra: itemsToCreate[0].gotra,
            nakshatra: itemsToCreate[0].nakshatra,
            rashi: itemsToCreate[0].rashi,
          }
        : { name: "" }
    } else {
      const singleData = data as Extract<z.infer<typeof sevaBookingSchema>, { sevaId: string }>
      const seva = await prisma.seva.findFirst({ where: { id: singleData.sevaId, deletedAt: null, isActive: true } })
      if (!seva) return errorResponse("Seva not found or inactive", 404)

      totalAmount = Number(seva.price) * singleData.quantity
      primaryDevoteeName = singleData.devoteeName

      itemsToCreate.push({
        sevaId: singleData.sevaId,
        devoteeName: singleData.devoteeName,
        gotra: singleData.gotra,
        nakshatra: singleData.nakshatra,
        rashi: singleData.rashi,
        quantity: singleData.quantity,
        unitPrice: seva.price,
        totalPrice: totalAmount,
        specialInstructions: singleData.specialInstructions ?? null,
      })

      sharedDevoteeDetails = {
        name: singleData.devoteeName,
        gotra: singleData.gotra,
        nakshatra: singleData.nakshatra,
        rashi: singleData.rashi,
      }
    }

    const totalQty = itemsToCreate.reduce((s, i) => s + i.quantity, 0)

    const booking = await prisma.booking.create({
      data: {
        bookingId,
        userId: user.id,
        totalAmount,
        finalAmount: totalAmount,
        quantity: totalQty,
        preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
        preferredTime: data.preferredTime ?? null,
        remarks: data.remarks ?? null,
        devoteeDetails: {
          ...sharedDevoteeDetails,
          phone: data.phone,
          email: data.email,
          address: data.address,
          state: data.state,
          district: data.district,
          pincode: data.pincode,
        },
        createdBy: user.id,
        items: {
          create: itemsToCreate,
        },
      },
      include: bookingInclude,
    })

    await auditLog(
      "CREATE",
      "Booking",
      booking.id,
      { bookingId, sevaIds: itemsToCreate.map((i) => i.sevaId) },
      session,
    )
    return successResponse(booking, "Booking created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create booking", 500)
  }
}
