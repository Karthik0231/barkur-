import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, getAuthUser } from "@/lib/api-utils"
import { createOrder, verifyPayment } from "@/lib/payments"
import { auditLog } from "@/lib/api-utils"
import { generateReceiptNumber } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const { action, bookingId, amount, currency, receipt } = body

    if (action === "verify") {
      const { orderId, paymentId, signature } = body
      if (!orderId || !paymentId || !signature)
        return errorResponse("Missing payment verification fields", 400)

      const result = await verifyPayment({ orderId, paymentId, signature })
      if (!result.success) return errorResponse(result.error ?? "Verification failed", 500)

      if (result.isValid) {
        const payment = await prisma.payment.update({
          where: { razorpayOrderId: orderId },
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

    if (!bookingId || !amount) return errorResponse("bookingId and amount are required", 400)

    const booking = await prisma.booking.findFirst({ where: { id: bookingId, deletedAt: null } })
    if (!booking) return errorResponse("Booking not found", 404)

    const receiptId = `rcpt_${Date.now()}`
    const result = await createOrder({
      amount: Number(amount),
      currency: currency ?? "INR",
      receipt: receipt ?? receiptId,
      notes: { bookingId, userId: user.id },
    })

    if (!result.success || !result.order) return errorResponse(result.error ?? "Failed to create order", 500)

    const payment = await prisma.payment.create({
      data: {
        bookingId,
        razorpayOrderId: result.order.id,
        amount: Number(amount),
        currency: currency ?? "INR",
        status: "CREATED",
      },
    })

    await auditLog("PAYMENT_INITIATED", "Payment", payment.id, { orderId: result.order.id, amount }, session)
    return successResponse({ order: result.order, paymentId: payment.id }, "Payment order created", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Payment processing failed", 500)
  }
}
