import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip, search } = paginationHelper(searchParams)
    const session = await auth()
    const user = getAuthUser(session)
    const isAdmin = user && checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"])

    const where: Record<string, unknown> = { deletedAt: null }
    if (!isAdmin) where.isActive = true
    if (search) where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]

    const [halls, total] = await Promise.all([
      prisma.hall.findMany({
        where: where as never,
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.hall.count({ where: where as never }),
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
    if (!body.name || !body.slug) return errorResponse("Name and slug are required", 400)

    const hall = await prisma.hall.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description ?? null,
        capacity: body.capacity ?? null,
        basePrice: body.basePrice ?? null,
        pricePerHour: body.pricePerHour ?? null,
        pricePerDay: body.pricePerDay ?? null,
        securityDeposit: body.securityDeposit ?? null,
        amenities: body.amenities ?? null,
        rules: body.rules ?? null,
        isActive: body.isActive ?? true,
        createdBy: user.id,
      },
    })

    await auditLog("CREATE", "Hall", hall.id, { name: hall.name }, session)
    return successResponse(hall, "Hall created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create hall", 500)
  }
}
