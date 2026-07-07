import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, getAuthUser } from "@/lib/api-utils"
import { generateReceiptNumber } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const { bookingId, paymentId } = body
    if (!bookingId) return errorResponse("bookingId is required", 400)

    const booking = await prisma.booking.findFirst({ where: { id: bookingId, deletedAt: null } })
    if (!booking) return errorResponse("Booking not found", 404)

    const receipt = await prisma.receipt.create({
      data: {
        bookingId,
        paymentId: paymentId ?? null,
        receiptNumber: generateReceiptNumber(),
        amount: booking.finalAmount,
        totalAmount: booking.finalAmount,
        type: "BOOKING",
        issuedAt: new Date(),
      },
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
    if (!user) return errorResponse("Unauthorized", 401)

    const bookingId = searchParams.get("bookingId")
    const receiptNumber = searchParams.get("receiptNumber")

    const where: Record<string, unknown> = {}
    if (bookingId) where.bookingId = bookingId
    if (receiptNumber) where.receiptNumber = receiptNumber

    const receipts = await prisma.receipt.findMany({
      where: where as never,
      include: { booking: { select: { bookingId: true } } },
      orderBy: { createdAt: "desc" },
    })

    return successResponse({ receipts })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch receipts", 500)
  }
}
