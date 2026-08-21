import { findUserByEmail, updateUser } from "@/lib/models/user"
import { findValidOTPByToken, updateOTP } from "@/lib/models/otp"
import { resetPasswordSchema } from "@/lib/validations"
import { successResponse, errorResponse } from "@/lib/api-utils"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = resetPasswordSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const otpRecord = await findValidOTPByToken(data.token)
    if (!otpRecord || !otpRecord.email)
      return errorResponse("Invalid or expired reset token", 400)

    const user = await findUserByEmail(otpRecord.email)
    if (!user) return errorResponse("Invalid or expired reset token", 400)

    const hashedPassword = await bcrypt.hash(data.password, 12)
    await updateUser(user.id, { password: hashedPassword })

    await updateOTP(otpRecord.id, { isUsed: true, usedAt: new Date() })

    return successResponse(null, "Password reset successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to reset password", 500)
  }
}
