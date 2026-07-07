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

    const [committee, total] = await Promise.all([
      prisma.committee.findMany({
        where: where as never,
        skip,
        take: limit,
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),
      prisma.committee.count({ where: where as never }),
    ])

    return successResponse({ committee, total, page, limit, totalPages: Math.ceil(total / limit) })
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
    if (!body.name) return errorResponse("Name is required", 400)

    const member = await prisma.committee.create({
      data: {
        name: body.name,
        role: body.designation ?? body.role ?? null,
        type: body.type ?? "MEMBER",
        photo: body.photoUrl ?? body.photo ?? null,
        biography: body.address ?? null,
        email: body.email ?? null,
        phone: body.phone ?? null,
        tenureStart: body.termStart ? new Date(body.termStart) : null,
        tenureEnd: body.termEnd ? new Date(body.termEnd) : null,
        sortOrder: body.sortOrder ?? 0,
        isActive: body.isActive ?? true,
      },
    })

    await auditLog("CREATE", "Committee", member.id, { name: member.name }, session)
    return successResponse(member, "Committee member added successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to add committee member", 500)
  }
}
