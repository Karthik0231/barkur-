import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { categorySchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = paginationHelper(searchParams)
    const category = searchParams.get("type")

    const where: Record<string, unknown> = { deletedAt: null }
    if (category) where.name = { contains: category, mode: "insensitive" }

    const [categories, total] = await Promise.all([
      prisma.sevaCategory.findMany({
        where: where as never,
        include: { _count: { select: { sevas: true } } },
        skip,
        take: limit,
        orderBy: { sortOrder: "asc" },
      }),
      prisma.sevaCategory.count({ where: where as never }),
    ])

    return successResponse({ categories, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch categories", 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const parsed = categorySchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const category = await prisma.sevaCategory.create({
      data: { ...parsed.data, createdBy: user.id },
    })

    await auditLog("CREATE", "Category", category.id, { name: category.name }, session)
    return successResponse(category, "Category created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create category", 500)
  }
}
