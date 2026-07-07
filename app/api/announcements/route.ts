import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { announcementSchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = paginationHelper(searchParams)
    const session = await auth()
    const user = getAuthUser(session)
    const isAdmin = user && checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"])

    const where: Record<string, unknown> = { deletedAt: null }
    if (isAdmin) {
      if (searchParams.get("isActive") !== null) where.isActive = searchParams.get("isActive") === "true"
    } else {
      where.isActive = true
      const now = new Date()
      where.OR = [
        { startDate: null },
        { startDate: { lte: now } },
      ]
      where.AND = [
        { endDate: null },
        { endDate: { gte: now } },
      ]
      delete where.AND
      where.endDate = null
      where.startDate = { lte: now }
    }

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where: where as never,
        skip,
        take: limit,
        orderBy: [{ type: "asc" }, { createdAt: "desc" }],
      }),
      prisma.announcement.count({ where: where as never }),
    ])

    return successResponse({ announcements, total, page, limit, totalPages: Math.ceil(total / limit) })
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
    const announcement = await prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        type: (data.priority ?? "NORMAL") as never,
        isActive: data.isActive ?? true,
        isPopup: false,
        startDate: new Date(),
        endDate: data.expiresAt ? new Date(data.expiresAt) : null,
        link: data.link ?? null,
        createdBy: user.id,
      },
    })

    await auditLog("CREATE", "Announcement", announcement.id, { title: announcement.title }, session)
    return successResponse(announcement, "Announcement created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create announcement", 500)
  }
}
