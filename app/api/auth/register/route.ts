import { prisma } from "@/lib/prisma"
import { registerSchema } from "@/lib/validations"
import { successResponse, errorResponse, auditLog } from "@/lib/api-utils"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const existingEmail = await prisma.user.findUnique({ where: { email: data.email } })
    if (existingEmail) return errorResponse("Email already registered", 409)

    const existingPhone = data.phone ? await prisma.user.findFirst({ where: { phone: data.phone } }) : null
    if (existingPhone) return errorResponse("Phone number already registered", 409)

    const hashedPassword = await bcrypt.hash(data.password, 12)
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        role: "DEVOTEE",
        isActive: true,
      },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    })

    await auditLog("REGISTER", "User", user.id, { email: user.email })
    return successResponse({ user }, "Registration successful", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Registration failed", 500)
  }
}
