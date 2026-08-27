import { auth } from "@/lib/auth"
import { findPaymentByRazorpayOrderId, updatePayment, createPayment } from "@/lib/models/payment"
import { findBookingById, updateBooking } from "@/lib/models/booking"
import { createReceipt } from "@/lib/models/receipt"
import { successResponse, errorResponse, getAuthUser, checkRole } from "@/lib/api-utils"
import { auditLog } from "@/lib/api-utils"
import { generateReceiptNumber } from "@/lib/utils"
import { verifyPayment, createOrder } from "@/lib/payments"

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)

    const body = await request.json()
    const { action, bookingId, currency, receipt } = body

    if (action === "verify") {
      const { orderId, paymentId, signature } = body
      if (!orderId || !paymentId || !signature)
        return errorResponse("Missing payment verification fields", 400)

      const paymentRecord = await findPaymentByRazorpayOrderId(orderId)
      if (!paymentRecord) return errorResponse("Payment not found", 404)
      const booking = await findBookingById(paymentRecord.bookingId)
      if (!booking || booking.deletedAt) return errorResponse("Payment not found", 404)

      const result = await verifyPayment({ orderId, paymentId, signature })
      if (!result.success) return errorResponse(result.error ?? "Verification failed", 500)

      if (result.isValid) {
        const payment = await updatePayment(paymentRecord.id, {
          razorpayPaymentId: paymentId,
          razorpaySignature: signature,
          status: "PAID",
          paidAt: new Date(),
        })

        if (!payment) return errorResponse("Payment update failed", 500)

        await updateBooking(payment.bookingId, { paymentStatus: "PAID" })

        await createReceipt({
          bookingId: payment.bookingId,
          paymentId: payment.id,
          receiptNumber: generateReceiptNumber(),
          amount: payment.amount,
          totalAmount: payment.amount,
          type: "PAYMENT",
          issuedAt: new Date(),
        })

        await auditLog("PAYMENT_VERIFIED", "Payment", payment.id, { bookingId: payment.bookingId }, session)
        return successResponse({ isValid: true, paymentId, orderId }, "Payment verified successfully")
      }

      return successResponse({ isValid: false }, "Payment verification failed")
    }

    if (!bookingId) return errorResponse("bookingId is required", 400)

    const booking = await findBookingById(bookingId)
    if (!booking || booking.deletedAt) return errorResponse("Booking not found", 404)

    const payableAmount = Number(booking.finalAmount)
    if (!Number.isFinite(payableAmount) || payableAmount <= 0) return errorResponse("Invalid booking amount", 400)

    const receiptId = `rcpt_${Date.now()}`
    const result = await createOrder({
      amount: payableAmount,
      currency: currency ?? "INR",
      receipt: receipt ?? receiptId,
      notes: { bookingId, userId: user?.id ?? "guest" },
    })

    if (!result.success || !result.order) return errorResponse(result.error ?? "Failed to create order", 500)

    const payment = await createPayment({
      bookingId,
      razorpayOrderId: result.order.id,
      amount: payableAmount,
      currency: currency ?? "INR",
      status: "CREATED",
    })

    await auditLog("PAYMENT_INITIATED", "Payment", payment.id, { orderId: result.order.id, amount: payableAmount }, session)
    return successResponse({ order: result.order, paymentId: payment.id }, "Payment order created", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Payment processing failed", 500)
  }
}
