import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"
import slugify from "slugify"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = paginationHelper(searchParams)
    const session = await auth()
    const user = getAuthUser(session)
    const isAdmin = user && checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"])

    const where: Record<string, unknown> = { deletedAt: null }
    if (!isAdmin) where.isActive = true

    const [deities, total] = await Promise.all([
      prisma.subDeity.findMany({
        where: where as never,
        skip,
        take: limit,
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
      prisma.subDeity.count({ where: where as never }),
    ])

    return successResponse({ deities, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch sub-deities", 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const body = await request.json()
    if (!body.name) return errorResponse("Name is required", 400)

    const slug = slugify(body.name, { lower: true, strict: true })
    const deity = await prisma.subDeity.create({
      data: {
        name: body.name,
        slug: `${slug}-${Date.now().toString(36)}`,
        description: body.description ?? null,
        significance: body.significance ?? null,
        history: body.history ?? null,
        image: body.imageUrl ?? body.image ?? null,
        templeLocation: body.templeLocation ?? null,
        isActive: body.isActive ?? true,
        sortOrder: body.sortOrder ?? 0,
      },
    })

    await auditLog("CREATE", "SubDeity", deity.id, { name: deity.name }, session)
    return successResponse(deity, "Sub-deity created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create sub-deity", 500)
  }
}
