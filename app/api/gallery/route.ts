import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"
import slugify from "slugify"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = paginationHelper(searchParams)
    const category = searchParams.get("category")
    const type = searchParams.get("type")

    const where: Record<string, unknown> = { deletedAt: null, isPublished: true }
    if (category) where.category = category
    if (type) where.type = type

    const [gallery, total] = await Promise.all([
      prisma.gallery.findMany({
        where: where as never,
        skip,
        take: limit,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      }),
      prisma.gallery.count({ where: where as never }),
    ])

    return successResponse({ gallery, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch gallery", 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const body = await request.json()
    if (!body.title || !body.image) return errorResponse("Title and image are required", 400)

    const slug = slugify(body.title, { lower: true, strict: true })
    const gallery = await prisma.gallery.create({
      data: {
        title: body.title,
        slug: `${slug}-${Date.now()}`,
        description: body.description ?? null,
        image: body.image,
        type: body.type ?? "IMAGE",
        category: body.category ?? "OTHER",
        tags: body.tags ?? null,
        isFeatured: body.isFeatured ?? false,
        isPublished: body.isPublished ?? true,
        sortOrder: body.sortOrder ?? 0,
        createdBy: user.id,
      },
    })

    await auditLog("CREATE", "Gallery", gallery.id, { title: gallery.title }, session)
    return successResponse(gallery, "Gallery item created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create gallery item", 500)
  }
}
