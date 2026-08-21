import { auth } from "@/lib/auth"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper } from "@/lib/api-utils"
import { findUserByEmail, createUser, findManyUsers, countUsers } from "@/lib/models/user"
import { findDevoteeDetailByPhone } from "@/lib/models/devoteeDetail"
import { userSchema, type UserInput } from "@/lib/validations"

/** Escape regex metacharacters so `$regex` behaves like Prisma's literal `contains`. */
function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

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
      const [matchedUser] = await findManyUsers(
        {
          $or: [
            { phone: { $regex: escapeRegex(normalizedPhone) } },
            { phone: { $regex: escapeRegex(phone) } },
          ],
        },
        { limit: 1 }
      )

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

      const matchedDevotee = await findDevoteeDetailByPhone(normalizedPhone || phone)

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

    const where: Record<string, unknown> = {}
    if (role) where.role = role
    if (isActive !== null) where.isActive = isActive === "true"
    if (search) {
      where.$or = [
        { name: { $regex: escapeRegex(search), $options: "i" } },
        { email: { $regex: escapeRegex(search), $options: "i" } },
        { phone: { $regex: escapeRegex(search) } },
      ]
    }

    const [users, total] = await Promise.all([
      findManyUsers(where, { skip, limit, sortBy, sortOrder }),
      countUsers(where),
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
    const existing = await findUserByEmail(data.email)
    if (existing) return errorResponse("Email already in use", 409)

    const now = new Date()
    const newUser = await createUser({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      role: data.role || "DEVOTEE",
      isActive: data.isActive ?? true,
      createdBy: currentUser.id,
      createdAt: now,
      updatedAt: now,
    })

    return successResponse(newUser, "User created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create user", 500)
  }
}
