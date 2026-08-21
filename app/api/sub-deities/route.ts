import { auth } from "@/lib/auth"
import { findManySubDeities, countSubDeities, createSubDeity } from "@/lib/models/subDeity"
import { subDeitySchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"
import slugify from "slugify"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = paginationHelper(searchParams)
    const session = await auth()
    const user = getAuthUser(session)
    const isAdmin = user && checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"])

    const filter: Record<string, unknown> = {}
    if (!isAdmin) filter.isActive = true

    const [deities, total] = await Promise.all([
      findManySubDeities(filter, {
        skip,
        limit,
        sort: [["sortOrder", 1], ["name", 1]],
      }),
      countSubDeities(filter),
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
    const parsed = subDeitySchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const slug = slugify(data.name, { lower: true, strict: true })
    const deity = await createSubDeity({
      name: data.name,
      slug: `${slug}-${Date.now().toString(36)}`,
      description: data.description ?? null,
      significance: data.significance ?? null,
      history: data.history ?? null,
      image: data.imageUrl ?? null,
      templeLocation: data.templeLocation ?? null,
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
    })

    await auditLog("CREATE", "SubDeity", deity.id, { name: deity.name }, session)
    return successResponse(deity, "Sub-deity created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create sub-deity", 500)
  }
}
