import { auth } from "@/lib/auth"
import { findBookingById, findManyBookings } from "@/lib/models/booking"
import { createReceipt, findManyReceipts } from "@/lib/models/receipt"
import { successResponse, errorResponse, getAuthUser, checkRole } from "@/lib/api-utils"
import { generateReceiptNumber } from "@/lib/utils"
import { receiptSchema } from "@/lib/validations"
import { toObjectId } from "@/lib/models/utils"

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const parsed = receiptSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const booking = await findBookingById(data.bookingId!)
    if (!booking) return errorResponse("Booking not found", 404)

    const receipt = await createReceipt({
      bookingId: data.bookingId!,
      paymentId: data.donationId ?? null,
      receiptNumber: generateReceiptNumber(),
      amount: data.amount,
      totalAmount: data.amount,
      type: "BOOKING",
      issuedAt: new Date(),
    })

    return successResponse(receipt, "Receipt generated successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to generate receipt", 500)
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"])) return errorResponse("Unauthorized", 401)

    const bookingId = searchParams.get("bookingId")
    const receiptNumber = searchParams.get("receiptNumber")

    const where: Record<string, unknown> = {}
    if (bookingId) where.bookingId = bookingId
    if (receiptNumber) where.receiptNumber = receiptNumber

    const receipts = await findManyReceipts(where, { sortBy: "createdAt", sortOrder: "desc" })

    const bookingIds = receipts.filter(r => r.bookingId).map(r => r.bookingId)
    const bookings = bookingIds.length ? await findManyBookings({ _id: { $in: bookingIds.map(id => toObjectId(id)) } }) : []

    const bookingMap = new Map(bookings.map(b => [b.id, b]))
    const finalReceipts = receipts.map(r => ({
      ...r,
      booking: r.bookingId ? { bookingId: bookingMap.get(r.bookingId)?.bookingId } : undefined,
    }))

    return successResponse({ receipts: finalReceipts })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch receipts", 500)
  }
}
