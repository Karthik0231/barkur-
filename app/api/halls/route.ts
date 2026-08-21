import { auth } from "@/lib/auth"
import { findManyHalls, countHalls, createHall } from "@/lib/models/hall"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"
import { escapeRegex } from "@/lib/models/utils"
import { hallSchema } from "@/lib/validations"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip, search } = paginationHelper(searchParams)
    const session = await auth()
    const user = getAuthUser(session)
    const isAdmin = user && checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"])

    const where: Record<string, unknown> = {}
    if (!isAdmin) where.isActive = true
    if (search) where.$or = [
      { name: { $regex: escapeRegex(search), $options: "i" } },
      { description: { $regex: escapeRegex(search), $options: "i" } },
    ]

    const [halls, total] = await Promise.all([
      findManyHalls(where, { skip, limit, sortBy: "name", sortOrder: "asc" }),
      countHalls(where),
    ])

    return successResponse({ halls, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch halls", 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const parsed = hallSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const hall = await createHall({
      name: data.name,
      slug: data.slug,
      description: data.description ?? undefined,
      capacity: data.capacity ?? undefined,
      basePrice: data.pricePerHour ?? undefined,
      pricePerHour: data.pricePerHour ?? undefined,
      pricePerDay: data.pricePerHour ? data.pricePerHour * 8 : undefined,
      securityDeposit: undefined,
      amenities: data.amenities ?? undefined,
      rules: undefined,
      isActive: data.isActive ?? true,
      createdBy: user.id,
    })

    await auditLog("CREATE", "Hall", hall.id, { name: hall.name }, session)
    return successResponse(hall, "Hall created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create hall", 500)
  }
}
