import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, getAuthUser, checkRole } from "@/lib/api-utils"
import { createOrder, verifyPayment } from "@/lib/payments"
import { auditLog } from "@/lib/api-utils"
import { generateReceiptNumber } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const { action, bookingId, currency, receipt } = body

    if (action === "verify") {
      const { orderId, paymentId, signature } = body
      if (!orderId || !paymentId || !signature)
        return errorResponse("Missing payment verification fields", 400)

      const paymentRecord = await prisma.payment.findUnique({
        where: { razorpayOrderId: orderId },
        include: { booking: { select: { userId: true, deletedAt: true } } },
      })
      if (!paymentRecord || paymentRecord.booking.deletedAt) return errorResponse("Payment not found", 404)
      const isAdmin = checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER", "ACCOUNTANT"])
      if (!isAdmin && paymentRecord.booking.userId !== user.id) return errorResponse("Unauthorized", 401)

      const result = await verifyPayment({ orderId, paymentId, signature })
      if (!result.success) return errorResponse(result.error ?? "Verification failed", 500)

      if (result.isValid) {
        const payment = await prisma.payment.update({
          where: { id: paymentRecord.id },
          data: {
            razorpayPaymentId: paymentId,
            razorpaySignature: signature,
            status: "PAID",
            paidAt: new Date(),
          },
        })

        await prisma.booking.update({
          where: { id: payment.bookingId },
          data: { paymentStatus: "PAID" },
        })

        await prisma.receipt.create({
          data: {
            bookingId: payment.bookingId,
            paymentId: payment.id,
            receiptNumber: generateReceiptNumber(),
            amount: payment.amount,
            totalAmount: payment.amount,
            type: "PAYMENT",
            issuedAt: new Date(),
          },
        })

        await auditLog("PAYMENT_VERIFIED", "Payment", payment.id, { bookingId: payment.bookingId }, session)
        return successResponse({ isValid: true, paymentId, orderId }, "Payment verified successfully")
      }

      return successResponse({ isValid: false }, "Payment verification failed")
    }

    if (!bookingId) return errorResponse("bookingId is required", 400)

    const isAdmin = checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER", "ACCOUNTANT"])
    const booking = await prisma.booking.findFirst({
      where: isAdmin ? { id: bookingId, deletedAt: null } : { id: bookingId, userId: user.id, deletedAt: null },
    })
    if (!booking) return errorResponse("Booking not found", 404)

    const payableAmount = Number(booking.finalAmount)
    if (!Number.isFinite(payableAmount) || payableAmount <= 0) return errorResponse("Invalid booking amount", 400)

    const receiptId = `rcpt_${Date.now()}`
    const result = await createOrder({
      amount: payableAmount,
      currency: currency ?? "INR",
      receipt: receipt ?? receiptId,
      notes: { bookingId, userId: user.id },
    })

    if (!result.success || !result.order) return errorResponse(result.error ?? "Failed to create order", 500)

    const payment = await prisma.payment.create({
      data: {
        bookingId,
        razorpayOrderId: result.order.id,
        amount: payableAmount,
        currency: currency ?? "INR",
        status: "CREATED",
      },
    })

    await auditLog("PAYMENT_INITIATED", "Payment", payment.id, { orderId: result.order.id, amount: payableAmount }, session)
    return successResponse({ order: result.order, paymentId: payment.id }, "Payment order created", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Payment processing failed", 500)
  }
}
