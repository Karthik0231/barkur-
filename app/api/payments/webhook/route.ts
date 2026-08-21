import crypto from "node:crypto"
import { findPaymentByRazorpayOrderId, updatePayment } from "@/lib/models/payment"
import { updateBooking } from "@/lib/models/booking"
import { createPaymentLog } from "@/lib/models/paymentLog"
import { successResponse, errorResponse } from "@/lib/api-utils"

function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  if (!secret || !signature) return false
  try {
    const expected = crypto.createHmac("sha256", secret).update(body).digest("hex")
    if (expected.length !== signature.length) return false
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  try {
    const bodyText = await request.text()
    const signature = request.headers.get("x-razorpay-signature") ?? ""
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET ?? ""

    if (!verifyWebhookSignature(bodyText, signature, webhookSecret))
      return errorResponse("Invalid webhook signature", 401)

    const event = JSON.parse(bodyText)
    const payload = event.payload
    const eventType = event.event

    if (eventType === "payment.captured") {
      const paymentEntity = payload.payment.entity
      const orderId = paymentEntity.order_id
      const paymentId = paymentEntity.id
      const status = paymentEntity.status

      if (status === "captured") {
        const payment = await findPaymentByRazorpayOrderId(orderId)
        if (payment && payment.status !== "PAID") {
          await updatePayment(payment.id, {
            razorpayPaymentId: paymentId,
            status: "PAID",
            method: paymentEntity.method,
            gatewayResponse: paymentEntity,
            paidAt: new Date(),
          })

          await updateBooking(payment.bookingId, { paymentStatus: "PAID" })

          await createPaymentLog({
            paymentId: payment.id,
            action: "WEBHOOK_CAPTURED",
            status: "PAID",
            response: paymentEntity,
          })
        }
      }
    } else if (eventType === "payment.failed") {
      const paymentEntity = payload.payment.entity
      const orderId = paymentEntity.order_id

      const payment = await findPaymentByRazorpayOrderId(orderId)
      if (payment) {
        await updatePayment(payment.id, { status: "FAILED", gatewayResponse: paymentEntity })

        await createPaymentLog({
          paymentId: payment.id,
          action: "WEBHOOK_FAILED",
          status: "FAILED",
          response: paymentEntity,
        })
      }
    }

    return successResponse({ received: true }, "Webhook processed")
  } catch (error) {
    console.error("Webhook error:", error)
    return successResponse({ received: true }, "Webhook processed with errors")
  }
}
