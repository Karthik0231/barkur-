import { auth } from "@/lib/auth"
import { findManyCommittees, countCommittees, createCommittee } from "@/lib/models/committee"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"
import { committeeSchema, type CommitteeInput } from "@/lib/validations"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = paginationHelper(searchParams)
    const type = searchParams.get("type")
    const session = await auth()
    const user = getAuthUser(session)
    const isAdmin = user && checkRole(session, ["SUPER_ADMIN", "ADMIN"])
    const cacheSeconds = user ? 0 : 60

    const filter: Record<string, unknown> = {}
    if (!isAdmin) filter.isActive = true
    if (type) filter.type = type

    const [committee, total] = await Promise.all([
      findManyCommittees(filter, {
        skip,
        limit,
        sort: [["sortOrder", 1], ["name", 1]],
      }),
      countCommittees(filter),
    ])

    return successResponse({ committee, total, page, limit, totalPages: Math.ceil(total / limit) }, "Success", 200, cacheSeconds)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch committee", 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const parsed = committeeSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const member = await createCommittee({
      name: data.name,
      role: data.designation ?? null,
      type: "MEMBER",
      photo: data.photoUrl ?? null,
      biography: data.address ?? null,
      email: data.email ?? null,
      phone: data.phone ?? null,
      tenureStart: data.termStart ? new Date(data.termStart) : null,
      tenureEnd: data.termEnd ? new Date(data.termEnd) : null,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
    })

    await auditLog("CREATE", "Committee", member.id, { name: member.name }, session)
    return successResponse(member, "Committee member added successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to add committee member", 500)
  }
}
