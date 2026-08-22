import { auth } from "@/lib/auth"
import { findSevaBySlug, findManySevas, countSevas, createSeva } from "@/lib/models/seva"
import { getDb } from "@/lib/mongodb"
import { softDeleteFilter, escapeRegex } from "@/lib/models/utils"
import { sevaSchema } from "@/lib/validations"
import {
  successResponse,
  errorResponse,
  getAuthUser,
  checkRole,
  paginationHelper,
  auditLog,
} from "@/lib/api-utils"

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"] as const

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const {
      page,
      limit,
      skip,
      search,
      sortBy,
      sortOrder,
    } = paginationHelper(searchParams)

    const session = await auth()
    const user = getAuthUser(session)

    const isAdmin =
      !!user && checkRole(session, [...ADMIN_ROLES])

    const cacheSeconds = user ? 0 : 60

    const isActive = searchParams.get("isActive")
    const isShashwatha = searchParams.get("isShashwatha")
    const isSpecial = searchParams.get("isSpecial")

    const where: Record<string, unknown> = {
      ...softDeleteFilter(),
    }

    if (!isAdmin) {
      where.isActive = true
    } else if (isActive !== null) {
      where.isActive = isActive === "true"
    }

    if (isShashwatha !== null) {
      where.isShashwatha = isShashwatha === "true"
    }

    if (isSpecial !== null) {
      where.isSpecial = isSpecial === "true"
    }

    if (search) {
      where.$or = [
        { name: { $regex: escapeRegex(search), $options: "i" } },
        { description: { $regex: escapeRegex(search), $options: "i" } },
        { shortDescription: { $regex: escapeRegex(search), $options: "i" } },
        { slug: { $regex: escapeRegex(search), $options: "i" } },
      ]
    }

    const [sevas, total] = await Promise.all([
      findManySevas(where, { skip, limit, sortBy, sortOrder }),
      countSevas(where),
    ])

    return successResponse({
      sevas,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }, "Success", 200, cacheSeconds)
  } catch (error) {
    console.error("GET /api/sevas error:", error)

    return errorResponse(
      error instanceof Error
        ? error.message
        : "Failed to fetch sevas",
      500
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)

    if (
      !user ||
      !checkRole(session, [...ADMIN_ROLES])
    ) {
      return errorResponse("Unauthorized", 401)
    }

    const body = await request.json()

    const parsed = sevaSchema.safeParse(body)

    if (!parsed.success) {
      return errorResponse(
        "Validation failed",
        400,
        parsed.error.flatten().fieldErrors as Record<
          string,
          string[]
        >
      )
    }

    const data = parsed.data

    const existingSeva = await findSevaBySlug(data.slug)

    if (existingSeva) {
      return errorResponse(
        "A Seva with this slug already exists",
        409
      )
    }

    const rulesData: Record<string, unknown> = {}

    if (data.bookingRules) {
      rulesData.bookingRules = data.bookingRules
    }

    if (
      body.rules &&
      Array.isArray(body.rules)
    ) {
      rulesData.items = body.rules
    }

    if (
      body.instructions &&
      Array.isArray(body.instructions)
    ) {
      rulesData.instructions = body.instructions
    }

    const seva = await createSeva({
      name: data.name,
      slug: data.slug,
      description: data.description || null,
      shortDescription: data.shortDescription || null,
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
      images: data.images && Array.isArray(data.images)
        ? JSON.parse(JSON.stringify(data.images))
        : null,
      rules: Object.keys(rulesData).length > 0
        ? JSON.parse(JSON.stringify(rulesData))
        : null,
      specialInstructions: body.instructions && Array.isArray(body.instructions)
        ? JSON.parse(JSON.stringify({ items: body.instructions }))
        : null,
      createdBy: user.id,
    })

    if (
      data.availabilityDates &&
      data.availabilityDates.length > 0
    ) {
      const availabilityData =
        data.availabilityDates
          .filter((item) => item.date)
          .map((item) => ({
            sevaId: seva.id,
            date: new Date(item.date),
            isAvailable: item.isAvailable !== false,
            maxBookings: item.maxBookings ?? null,
            createdBy: user.id,
          }))

      if (availabilityData.length > 0) {
        await (await getDb()).collection("sevaDates").insertMany(availabilityData)
      }
    }

    await auditLog(
      "CREATE",
      "Seva",
      seva.id,
      {
        name: seva.name,
        slug: seva.slug,
        price: seva.price,
      },
      session
    )

    return successResponse(
      seva,
      "Seva created successfully",
      201
    )
  } catch (error) {
    console.error("POST /api/sevas error:", error)

    return errorResponse(
      error instanceof Error
        ? error.message
        : "Failed to create seva",
      500
    )
  }
}
