import { auth } from "@/lib/auth"
import { findManyBookings, countBookings, createBooking } from "@/lib/models/booking"
import { findManyBookingItems, createBookingItem } from "@/lib/models/bookingItem"
import { findManySevas, findSevaById } from "@/lib/models/seva"
import { findManyUsers } from "@/lib/models/user"
import { findManyPayments } from "@/lib/models/payment"
import { db } from "@/lib/mongodb"
import { toObjectId, escapeRegex } from "@/lib/models/utils"
import { sevaBookingSchema } from "@/lib/validations"
import { z } from "zod"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"
import { generateBookingId } from "@/lib/utils"

export async function GET(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const { searchParams } = new URL(request.url)
    const { page, limit, skip, search, sortBy, sortOrder } = paginationHelper(searchParams)
    const isAdmin = checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER", "RECEPTION"])

    const where: Record<string, unknown> = {}
    if (!isAdmin) where.userId = user.id
    if (search) {
      where.$or = [
        { bookingId: { $regex: escapeRegex(search), $options: "i" } },
        { "devoteeDetails.name": { $regex: escapeRegex(search), $options: "i" } },
      ]
    }
    const adminApproval = searchParams.get("adminApproval")
    if (adminApproval) where.adminApproval = adminApproval

    const [bookings, total] = await Promise.all([
      findManyBookings(where, { skip, limit, sortBy, sortOrder }),
      countBookings(where),
    ])

    if (bookings.length > 0) {
      const bookingIds = bookings.map((b) => b.id)
      const userIds = [...new Set(bookings.map((b) => b.userId).filter(Boolean) as string[])]
      const sevaDateIds = bookings.filter((b) => b.sevaDateId).map((b) => b.sevaDateId as string)

      const [bookingItems, users, payments, sevaDates] = await Promise.all([
        findManyBookingItems({ bookingId: { $in: bookingIds } }),
        findManyUsers({ _id: { $in: userIds.map((id) => toObjectId(id)) } }),
        findManyPayments({ bookingId: { $in: bookingIds } }),
        sevaDateIds.length > 0
          ? db.collection("sevaDates").find({ _id: { $in: sevaDateIds.map((id) => toObjectId(id)) } }).toArray()
          : Promise.resolve([]),
      ])

      const usersById = users.reduce((acc, u) => { acc[u.id] = u; return acc }, {} as Record<string, any>)
      const paymentsByBookingId = payments.reduce((acc, p) => { acc[p.bookingId] = p; return acc }, {} as Record<string, any>)
      const sevaDatesById = sevaDates.reduce((acc, d) => { acc[d._id.toHexString()] = d; return acc }, {} as Record<string, any>)

      const sevaIds = [...new Set(bookingItems.map((i) => i.sevaId).filter(Boolean) as string[])]
      const sevas = sevaIds.length > 0
        ? await findManySevas({ _id: { $in: sevaIds.map((id) => toObjectId(id)) } })
        : []
      const sevasById = sevas.reduce((acc, s) => { acc[s.id] = s; return acc }, {} as Record<string, any>)

      const itemsByBookingId = bookingItems.reduce((acc, item) => {
        const bookingId = item.bookingId
        if (!acc[bookingId]) acc[bookingId] = []
        acc[bookingId].push({ ...item, seva: sevasById[item.sevaId] ? { id: sevasById[item.sevaId].id, name: sevasById[item.sevaId].name, slug: sevasById[item.sevaId].slug } : null })
        return acc
      }, {} as Record<string, any[]>)

      const enrichedBookings = bookings.map((booking) => ({
        ...booking,
        items: itemsByBookingId[booking.id] || [],
        payments: paymentsByBookingId[booking.id] || null,
        sevaDate: booking.sevaDateId ? (sevaDatesById[booking.sevaDateId] ? { id: sevaDatesById[booking.sevaDateId]._id.toHexString(), date: sevaDatesById[booking.sevaDateId].date } : null) : null,
        user: usersById[booking.userId] ? { id: usersById[booking.userId].id, name: usersById[booking.userId].name, email: usersById[booking.userId].email, phone: usersById[booking.userId].phone } : null,
      }))

      return successResponse({ bookings: enrichedBookings, total, page, limit, totalPages: Math.ceil(total / limit) })
    }

    return successResponse({ bookings: [], total, page, limit, totalPages: Math.ceil(total / limit) })
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
    const count = await countBookings()
    const bookingId = generateBookingId("SEVA", count + 1)

    const isMultiSeva = "items" in data && Array.isArray(data.items)

    let totalAmount = 0
    const itemsToCreate: any[] = []
    let primaryDevoteeName = ""
    let sharedDevoteeDetails: { name: string; gotra?: string; nakshatra?: string; rashi?: string } = { name: "" }

    if (isMultiSeva) {
      const items = data.items

      for (const item of items) {
        const seva = await findSevaById(item.sevaId)
        if (!seva || seva.deletedAt) return errorResponse(`Seva not found or inactive: ${item.sevaId}`, 404)
        if (seva.isActive === false) return errorResponse(`Seva not found or inactive: ${item.sevaId}`, 404)

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
      const seva = await findSevaById(singleData.sevaId)
      if (!seva || seva.deletedAt) return errorResponse("Seva not found or inactive", 404)
      if (seva.isActive === false) return errorResponse("Seva not found or inactive", 404)

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

    const booking = await createBooking({
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
    })

    for (const item of itemsToCreate) {
      await createBookingItem({
        ...item,
        bookingId: booking.id,
      })
    }

    const createdItems = await findManyBookingItems({ bookingId: booking.id })
    const sevas = await findManySevas({ _id: { $in: createdItems.map((i) => toObjectId(i.sevaId)) } })
    const sevasById = sevas.reduce((acc, s) => { acc[s.id] = s; return acc }, {} as Record<string, any>)

    const enrichedBooking = {
      ...booking,
      items: createdItems.map((item) => ({
        ...item,
        seva: sevasById[item.sevaId] ? { id: sevasById[item.sevaId].id, name: sevasById[item.sevaId].name, slug: sevasById[item.sevaId].slug } : null,
      })),
      payments: null,
      sevaDate: null,
    }

    await auditLog(
      "CREATE",
      "Booking",
      booking.id,
      { bookingId, sevaIds: itemsToCreate.map((i) => i.sevaId) },
      session,
    )
    return successResponse(enrichedBooking, "Booking created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create booking", 500)
  }
}
