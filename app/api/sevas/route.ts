import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sevaSchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip, search, sortBy, sortOrder } = paginationHelper(searchParams)
    const session = await auth()
    const user = getAuthUser(session)
    const isAdmin = user && checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"])
    const isActive = searchParams.get("isActive")
    const isShashwatha = searchParams.get("isShashwatha")
    const isSpecial = searchParams.get("isSpecial")
    const categoryId = searchParams.get("categoryId")

    const where: Record<string, unknown> = {}
    if (!isAdmin) where.isActive = true
    else if (isActive !== null) where.isActive = isActive === "true"
    if (isShashwatha !== null) where.isShashwatha = isShashwatha === "true"
    if (isSpecial !== null) where.isSpecial = isSpecial === "true"
    if (categoryId) where.categoryId = categoryId
    if (search) where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { shortDescription: { contains: search, mode: "insensitive" } },
    ]
    where.deletedAt = null

    const [sevas, total] = await Promise.all([
      prisma.seva.findMany({
        where: where as never,
        include: { category: true },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.seva.count({ where: where as never }),
    ])

    return successResponse({ sevas, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch sevas", 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"])) {
      return errorResponse("Unauthorized", 401)
    }

    const body = await request.json()
    const parsed = sevaSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const rulesData: Record<string, unknown> = {}
    if (data.bookingRules) rulesData.bookingRules = data.bookingRules
    if (body.rules && Array.isArray(body.rules)) rulesData.items = body.rules
    if (body.instructions && Array.isArray(body.instructions)) rulesData.instructions = body.instructions

    const seva = await prisma.seva.create({
      data: {
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId,
        description: data.description,
        shortDescription: data.shortDescription,
        price: data.price,
        originalPrice: data.originalPrice ?? null,
        duration: data.duration ?? null,
        maxDevotees: data.maxDevotees ?? null,
        minDevotees: data.minDevotees ?? null,
        bookingNotice: data.bookingNotice ?? null,
        requiresApproval: data.requiresApproval ?? false,
        isShashwatha: data.isShashwatha ?? false,
        isSpecial: data.isSpecial ?? false,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
        images: data.images ? JSON.parse(JSON.stringify(data.images)) : null,
        rules: Object.keys(rulesData).length > 0 ? JSON.parse(JSON.stringify(rulesData)) : null,
        specialInstructions: body.instructions && Array.isArray(body.instructions) ? JSON.parse(JSON.stringify({ items: body.instructions })) : null,
        createdBy: user.id,
      },
    })

    if (data.availabilityDates && data.availabilityDates.length > 0) {
      await prisma.sevaDate.createMany({
        data: data.availabilityDates.map((d) => ({
          sevaId: seva.id,
          date: new Date(d.date),
          isAvailable: d.isAvailable !== false,
          maxBookings: d.maxBookings ?? null,
          createdBy: user.id,
        })),
      })
    }

    await auditLog("CREATE", "Seva", seva.id, { name: seva.name }, session)
    return successResponse(seva, "Seva created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create seva", 500)
  }
}
