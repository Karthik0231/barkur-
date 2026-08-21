import { auth } from "@/lib/auth"
import { findManyFestivals, countFestivals, createFestival } from "@/lib/models/festival"
import { festivalSchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"
import { escapeRegex } from "@/lib/models/utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip, search, sortBy, sortOrder } = paginationHelper(searchParams)
    const session = await auth()
    const user = getAuthUser(session)
    const isAdmin = user && checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"])
    const cacheSeconds = user ? 0 : 60

    const where: Record<string, unknown> = {}
    if (!isAdmin) where.isActive = true
    if (search) where.$or = [
      { name: { $regex: escapeRegex(search), $options: "i" } },
      { description: { $regex: escapeRegex(search), $options: "i" } },
    ]

    const [festivals, total] = await Promise.all([
      findManyFestivals(where, { skip, limit, sortBy: isAdmin ? sortBy : "isFeatured", sortOrder: isAdmin ? sortOrder : "desc" }),
      countFestivals(where),
    ])

    if (!isAdmin) {
      festivals.sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) return b.isFeatured ? 1 : -1
        const aVal = (a as Record<string, unknown>)[sortBy] as string
        const bVal = (b as Record<string, unknown>)[sortBy] as string
        if (aVal === bVal) return 0
        if (sortOrder === "asc") return aVal > bVal ? 1 : -1
        return aVal < bVal ? 1 : -1
      })
    }

    return successResponse({ festivals, total, page, limit, totalPages: Math.ceil(total / limit) }, "Success", 200, cacheSeconds)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch festivals", 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const parsed = festivalSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const festival = await createFestival({
      name: data.name,
      slug: data.slug,
      description: data.description,
      shortDescription: data.shortDescription,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      isMultiDay: !!data.endDate,
      significance: data.significance ?? null,
      rituals: data.rituals ? JSON.parse(JSON.stringify(data.rituals)) : null,
      image: data.imageUrl ?? null,
      category: data.category ?? null,
      isActive: data.isActive ?? true,
      isFeatured: data.isFeatured ?? false,
      createdBy: user.id,
    })

    await auditLog("CREATE", "Festival", festival.id, { name: festival.name }, session)
    return successResponse(festival, "Festival created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create festival", 500)
  }
}
