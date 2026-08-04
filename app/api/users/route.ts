import { auth } from "@/lib/auth"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper } from "@/lib/api-utils"
import { prisma } from "@/lib/prisma"
import { userSchema, type UserInput } from "@/lib/validations"

export async function GET(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const { searchParams } = new URL(request.url)
    const phone = searchParams.get("phone")

    if (phone) {
      if (!checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER", "RECEPTION"])) {
        return errorResponse("Unauthorized", 401)
      }
      const normalizedPhone = phone.replace(/\s/g, "")
      const matchedUser = await prisma.user.findFirst({
        where: {
          deletedAt: null,
          OR: [
            { phone: { contains: normalizedPhone } },
            { phone: { contains: phone } },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
      })

      if (matchedUser) {
        return successResponse({
          user: {
            name: matchedUser.name,
            email: matchedUser.email ?? "",
            phone: matchedUser.phone ?? "",
            address: "",
            city: "",
            district: "",
            state: "",
            pincode: "",
          },
          source: "user",
        })
      }

      const matchedDevotee = await prisma.devoteeDetail.findFirst({
        where: {
          OR: [
            { phone: { contains: normalizedPhone } },
            { phone: { contains: phone } },
          ],
        },
      })

      if (matchedDevotee) {
        return successResponse({
          user: {
            name: matchedDevotee.name,
            email: matchedDevotee.email ?? "",
            phone: matchedDevotee.phone ?? "",
            address: [matchedDevotee.addressLine1, matchedDevotee.addressLine2].filter(Boolean).join(" "),
            city: matchedDevotee.city ?? "",
            district: matchedDevotee.district ?? "",
            state: matchedDevotee.state ?? "",
            pincode: matchedDevotee.pincode ?? "",
            gotra: matchedDevotee.gotra ?? "",
            nakshatra: matchedDevotee.nakshatra ?? "",
            rashi: matchedDevotee.rashi ?? "",
          },
          source: "devotee",
        })
      }

      return successResponse({ user: null, source: null })
    }

    if (!checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { page, limit, skip, search, sortBy, sortOrder } = paginationHelper(searchParams)
    const role = searchParams.get("role")
    const isActive = searchParams.get("isActive")

    const where: Record<string, unknown> = { deletedAt: null }
    if (role) where.role = role
    if (isActive !== null) where.isActive = isActive === "true"
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ]
    }

    const orderBy = sortBy ? { [sortBy]: sortOrder } : { createdAt: "desc" as const }

    const [users, total] = await Promise.all([
      prisma.user.findMany({ where: where as any, orderBy, skip, take: limit }),
      prisma.user.count({ where: where as any }),
    ])

    return successResponse({ users, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch users", 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const currentUser = getAuthUser(session)
    if (!currentUser || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const parsed = userSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) return errorResponse("Email already in use", 409)

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        role: data.role || "DEVOTEE",
        isActive: data.isActive ?? true,
        createdBy: currentUser.id,
      },
    })

    return successResponse(newUser, "User created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create user", 500)
  }
}
