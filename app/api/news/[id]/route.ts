import { auth } from "@/lib/auth"
import { findNewsById, updateNews, incrementNewsViewCount } from "@/lib/models/news"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const news = await findNewsById(id)
    if (!news) return errorResponse("News not found", 404)
    incrementNewsViewCount(id).catch(() => {})
    return successResponse(news)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch news", 500)
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await findNewsById(id)
    if (!existing) return errorResponse("News not found", 404)

    const body = await request.json()
    const updateData: Record<string, unknown> = {}
    const allowed = ["title", "slug", "content", "excerpt", "featuredImage", "category", "isPublished", "isUrgent", "tags"]
    for (const key of allowed) {
      if (body[key] !== undefined) updateData[key] = body[key]
    }
    if (body.isPublished && !existing.publishedAt) updateData.publishedAt = new Date()

    const news = await updateNews(id, updateData)
    await auditLog("UPDATE", "News", id, { title: news?.title }, session)
    return successResponse(news, "News updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update news", 500)
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await findNewsById(id)
    if (!existing) return errorResponse("News not found", 404)

    await updateNews(id, { deletedAt: new Date() })
    await auditLog("DELETE", "News", id, { title: existing.title }, session)
    return successResponse(null, "News deleted successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to delete news", 500)
  }
}
