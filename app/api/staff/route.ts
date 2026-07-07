import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = paginationHelper(searchParams)
    const type = searchParams.get("type")
    const session = await auth()
    const user = getAuthUser(session)
    const isAdmin = user && checkRole(session, ["SUPER_ADMIN", "ADMIN"])

    const where: Record<string, unknown> = { deletedAt: null }
    if (!isAdmin) where.isActive = true
    if (type) where.type = type

    const [staff, total] = await Promise.all([
      prisma.templeStaff.findMany({
        where: where as never,
        skip,
        take: limit,
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
      prisma.templeStaff.count({ where: where as never }),
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
    if (!body.name) return errorResponse("Name is required", 400)

    const staff = await prisma.templeStaff.create({
      data: {
        name: body.name,
        role: body.designation ?? body.role ?? null,
        designation: body.designation ?? null,
        photo: body.photoUrl ?? body.photo ?? null,
        biography: body.address ?? body.biography ?? null,
        email: body.email ?? null,
        phone: body.phone ?? null,
        type: body.type ?? "OTHER",
        sortOrder: body.sortOrder ?? 0,
        isActive: body.isActive ?? true,
      },
    })

    await auditLog("CREATE", "Staff", staff.id, { name: staff.name }, session)
    return successResponse(staff, "Staff member added successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to add staff member", 500)
  }
}
