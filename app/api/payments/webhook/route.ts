import crypto from "crypto"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-utils"

function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  try {
    const expected = crypto.createHmac("sha256", secret).update(body).digest("hex")
    return expected === signature
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
        const payment = await prisma.payment.findUnique({ where: { razorpayOrderId: orderId } })
        if (payment && payment.status !== "PAID") {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              razorpayPaymentId: paymentId,
              status: "PAID",
              method: paymentEntity.method,
              gatewayResponse: paymentEntity,
              paidAt: new Date(),
            },
          })

          await prisma.booking.update({
            where: { id: payment.bookingId },
            data: { paymentStatus: "PAID" },
          })

          await prisma.paymentLog.create({
            data: {
              paymentId: payment.id,
              action: "WEBHOOK_CAPTURED",
              status: "PAID",
              response: paymentEntity,
            },
          })
        }
      }
    } else if (eventType === "payment.failed") {
      const paymentEntity = payload.payment.entity
      const orderId = paymentEntity.order_id

      const payment = await prisma.payment.findUnique({ where: { razorpayOrderId: orderId } })
      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "FAILED", gatewayResponse: paymentEntity },
        })

        await prisma.paymentLog.create({
          data: {
            paymentId: payment.id,
            action: "WEBHOOK_FAILED",
            status: "FAILED",
            response: paymentEntity,
          },
        })
      }
    }

    return successResponse({ received: true }, "Webhook processed")
  } catch (error) {
    console.error("Webhook error:", error)
    return successResponse({ received: true }, "Webhook processed with errors")
  }
}
