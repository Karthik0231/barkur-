import Razorpay from "razorpay"

interface CreateOrderParams {
  amount: number
  currency?: string
  receipt: string
  notes?: Record<string, string>
}

interface CreateOrderResult {
  success: boolean
  order?: {
    id: string
    amount: number
    currency: string
    receipt: string
    status: string
    notes?: Record<string, string>
  }
  error?: string
}

interface VerifyPaymentParams {
  orderId: string
  paymentId: string
  signature: string
}

interface VerifyPaymentResult {
  success: boolean
  isValid: boolean
  error?: string
}

interface RefundPaymentParams {
  paymentId: string
  amount?: number
  notes?: Record<string, string>
}

interface RefundPaymentResult {
  success: boolean
  refund?: {
    id: string
    paymentId: string
    amount: number
    status: string
  }
  error?: string
}

interface FetchPaymentResult {
  success: boolean
  payment?: {
    id: string
    amount: number
    currency: string
    status: string
    method: string
    description?: string
    email?: string
    contact?: string
    fee: number
    tax: number
    createdAt: number
  }
  error?: string
}

function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials not configured")
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret })
}

export async function createOrder({
  amount,
  currency = "INR",
  receipt,
  notes,
}: CreateOrderParams): Promise<CreateOrderResult> {
  try {
    const instance = getRazorpayInstance()
    const order = await instance.orders.create({
      amount: amount * 100,
      currency,
      receipt,
      notes,
    })
    return {
      success: true,
      order: {
        id: order.id,
        amount: Number(order.amount),
        currency: order.currency,
        receipt: String(order.receipt ?? ""),
        status: order.status,
        notes: order.notes as Record<string, string> | undefined,
      },
    }
  } catch (error) {
    console.error("Razorpay create order failed:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to create order" }
  }
}

export async function verifyPayment({
  orderId,
  paymentId,
  signature,
}: VerifyPaymentParams): Promise<VerifyPaymentResult> {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) {
      return { success: false, isValid: false, error: "RAZORPAY_KEY_SECRET is not configured" }
    }
    const crypto = await import("crypto")
    const body = orderId + "|" + paymentId
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex")

    return {
      success: true,
      isValid: expectedSignature === signature,
    }
  } catch (error) {
    console.error("Razorpay verify payment failed:", error)
    return { success: false, isValid: false, error: error instanceof Error ? error.message : "Failed to verify payment" }
  }
}

export async function refundPayment({
  paymentId,
  amount,
  notes,
}: RefundPaymentParams): Promise<RefundPaymentResult> {
  try {
    const instance = getRazorpayInstance()
    const refund = await instance.payments.refund(paymentId, {
      ...(amount ? { amount: amount * 100 } : {}),
      ...(notes ? { notes } : {}),
    })
    return {
      success: true,
      refund: {
        id: refund.id,
        paymentId: refund.payment_id,
        amount: Number(refund.amount) || 0,
        status: refund.status,
      },
    }
  } catch (error) {
    console.error("Razorpay refund failed:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to process refund" }
  }
}

export async function fetchPayment(paymentId: string): Promise<FetchPaymentResult> {
  try {
    const instance = getRazorpayInstance()
    const payment = await instance.payments.fetch(paymentId)
    return {
      success: true,
      payment: {
        id: payment.id,
        amount: Number(payment.amount) || 0,
        currency: payment.currency,
        status: payment.status,
        method: payment.method ?? "",
        description: typeof payment.description === "string" ? payment.description : undefined,
        email: typeof payment.email === "string" ? payment.email : undefined,
        contact: typeof payment.contact === "string" ? payment.contact : undefined,
        fee: Number(payment.fee) || 0,
        tax: Number(payment.tax) || 0,
        createdAt: payment.created_at,
      },
    }
  } catch (error) {
    console.error("Razorpay fetch payment failed:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to fetch payment" }
  }
}
