import { auth } from "@/lib/auth"
import { findManyNews, countNews, createNews } from "@/lib/models/news"
import { newsSchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"
import { escapeRegex } from "@/lib/models/utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip, search, sortBy, sortOrder } = paginationHelper(searchParams)
    const session = await auth()
    const user = getAuthUser(session)
    const isAdmin = user && checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"])

    const where: Record<string, unknown> = {}
    if (!isAdmin) where.isPublished = true
    if (search) where.$or = [
      { title: { $regex: escapeRegex(search), $options: "i" } },
      { excerpt: { $regex: escapeRegex(search), $options: "i" } },
    ]

    const sortFields: Record<string, 1 | -1> = {}
    if (isAdmin && sortBy) {
      sortFields[sortBy] = sortOrder === "asc" ? 1 : -1
    } else {
      sortFields.isUrgent = -1
      sortFields.publishedAt = -1
    }

    const [news, total] = await Promise.all([
      findManyNews(where, { skip, limit, sortBy: Object.keys(sortFields)[0], sortOrder: sortOrder }),
      countNews(where),
    ])

    if (!isAdmin) {
      news.sort((a, b) => {
        if (a.isUrgent !== b.isUrgent) return b.isUrgent ? 1 : -1
        return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
      })
    }

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
    const news = await createNews({
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
    })

    await auditLog("CREATE", "News", news.id, { title: news.title }, session)
    return successResponse(news, "News created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create news", 500)
  }
}
