import { auth } from "@/lib/auth"
import { findManyAnnouncements, countAnnouncements, createAnnouncement } from "@/lib/models/announcement"
import { announcementSchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = paginationHelper(searchParams)
    const session = await auth()
    const user = getAuthUser(session)
    const isAdmin = user && checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"])
    const cacheSeconds = user ? 0 : 60

    const where: Record<string, unknown> = {}
    if (isAdmin) {
      if (searchParams.get("isActive") !== null) where.isActive = searchParams.get("isActive") === "true"
    } else {
      where.isActive = true
      const now = new Date()
      where.startDate = { $lte: now }
      where.endDate = null
    }

    const [announcements, total] = await Promise.all([
      findManyAnnouncements(where, { skip, limit, sortBy: "type", sortOrder: "asc" }),
      countAnnouncements(where),
    ])

    announcements.sort((a, b) => {
      if (a.type !== b.type) return a.type > b.type ? 1 : -1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return successResponse({ announcements, total, page, limit, totalPages: Math.ceil(total / limit) }, "Success", 200, cacheSeconds)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch announcements", 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const parsed = announcementSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const announcement = await createAnnouncement({
      title: data.title,
      content: data.content,
      type: (data.type ?? "INFO") as never,
      isActive: data.isActive ?? true,
      isPopup: data.isPopup ?? false,
      startDate: data.startDate ? new Date(data.startDate) : new Date(),
      endDate: data.endDate ? new Date(data.endDate) : null,
      link: data.link ?? null,
      linkText: data.linkText ?? null,
      createdBy: user.id,
    })

    await auditLog("CREATE", "Announcement", announcement.id, { title: announcement.title }, session)
    return successResponse(announcement, "Announcement created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create announcement", 500)
  }
}
