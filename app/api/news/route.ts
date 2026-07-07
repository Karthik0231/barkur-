import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { newsSchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip, search, sortBy, sortOrder } = paginationHelper(searchParams)
    const session = await auth()
    const user = getAuthUser(session)
    const isAdmin = user && checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"])

    const where: Record<string, unknown> = { deletedAt: null }
    if (!isAdmin) where.isPublished = true
    if (search) where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
    ]

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where: where as never,
        skip,
        take: limit,
        orderBy: isAdmin ? { [sortBy]: sortOrder } : [{ isUrgent: "desc" }, { publishedAt: "desc" }],
      }),
      prisma.news.count({ where: where as never }),
    ])

    return successResponse({ news, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch news", 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const parsed = newsSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const news = await prisma.news.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt ?? null,
        featuredImage: data.coverImage ?? null,
        category: data.category ?? null,
        isPublished: data.isPublished ?? false,
        isUrgent: data.isBreaking ?? false,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : data.isPublished ? new Date() : null,
        tags: (data.tags ?? null) as never,
        createdBy: user.id,
      },
    })

    await auditLog("CREATE", "News", news.id, { title: news.title }, session)
    return successResponse(news, "News created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create news", 500)
  }
}
