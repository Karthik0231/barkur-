import { findUserByEmail } from "@/lib/models/user"
import { createOTP } from "@/lib/models/otp"
import { forgotPasswordSchema } from "@/lib/validations"
import { successResponse, errorResponse } from "@/lib/api-utils"
import { generateOTP } from "@/lib/utils"
import { sendOTP } from "@/lib/emails"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = forgotPasswordSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Invalid email", 400)

    const { email } = parsed.data
    const user = await findUserByEmail(email)
    if (!user) return successResponse(null, "If the email exists, an OTP has been sent")

    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await createOTP({
      email,
      otp,
      type: "EMAIL",
      purpose: "FORGOT_PASSWORD",
      expiresAt,
      isUsed: false,
    })

    await sendOTP(email, otp)

    return successResponse(null, "If the email exists, an OTP has been sent")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to send OTP", 500)
  }
}
