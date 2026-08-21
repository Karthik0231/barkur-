import { findUserByEmail, findUserByPhone, createUser } from "@/lib/models/user"
import { registerSchema } from "@/lib/validations"
import { successResponse, errorResponse, auditLog } from "@/lib/api-utils"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const existingEmail = await findUserByEmail(data.email)
    if (existingEmail) return errorResponse("Email already registered", 409)

    const existingPhone = data.phone ? await findUserByPhone(data.phone) : null
    if (existingPhone) return errorResponse("Phone number already registered", 409)

    const hashedPassword = await bcrypt.hash(data.password, 12)
    const created = await createUser({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      role: "DEVOTEE",
      isActive: true,
    })

    const user = {
      id: created.id,
      name: created.name,
      email: created.email,
      phone: created.phone,
      role: created.role,
      createdAt: created.createdAt,
    }

    await auditLog("REGISTER", "User", user.id, { email: user.email })
    return successResponse({ user }, "Registration successful", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Registration failed", 500)
  }
}
