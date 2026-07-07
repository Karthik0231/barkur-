import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { festivalSchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip, search, sortBy, sortOrder } = paginationHelper(searchParams)
    const session = await auth()
    const user = getAuthUser(session)
    const isAdmin = user && checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"])

    const where: Record<string, unknown> = { deletedAt: null }
    if (!isAdmin) where.isActive = true
    if (search) where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]

    const [festivals, total] = await Promise.all([
      prisma.festival.findMany({
        where: where as never,
        skip,
        take: limit,
        orderBy: [{ isFeatured: "desc" }, { [sortBy]: sortOrder }],
      }),
      prisma.festival.count({ where: where as never }),
    ])

    return successResponse({ festivals, total, page, limit, totalPages: Math.ceil(total / limit) })
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
    const festival = await prisma.festival.create({
      data: {
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
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
        createdBy: user.id,
      },
    })

    await auditLog("CREATE", "Festival", festival.id, { name: festival.name }, session)
    return successResponse(festival, "Festival created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create festival", 500)
  }
}
