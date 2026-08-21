import { auth } from "@/lib/auth"
import { findManyTempleStaff, countTempleStaff, createTempleStaff } from "@/lib/models/templeStaff"
import { staffSchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = paginationHelper(searchParams)
    const type = searchParams.get("type")
    const session = await auth()
    const user = getAuthUser(session)
    const isAdmin = user && checkRole(session, ["SUPER_ADMIN", "ADMIN"])

    const filter: Record<string, unknown> = {}
    if (!isAdmin) filter.isActive = true
    if (type) filter.type = type

    const [staff, total] = await Promise.all([
      findManyTempleStaff(filter, {
        skip,
        limit,
        sort: [["sortOrder", 1], ["name", 1]],
      }),
      countTempleStaff(filter),
    ])

    return successResponse({ staff, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch staff", 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const parsed = staffSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const staff = await createTempleStaff({
      name: data.name,
      role: data.designation ?? data.role ?? null,
      designation: data.designation ?? null,
      photo: data.photoUrl ?? null,
      biography: data.biography ?? null,
      email: data.email || null,
      phone: data.phone,
      type: data.type ?? "OTHER",
      joinedAt: data.joinedAt ? new Date(data.joinedAt) : null,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
    })

    await auditLog("CREATE", "Staff", staff.id, { name: staff.name }, session)
    return successResponse(staff, "Staff member added successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to add staff member", 500)
  }
}
