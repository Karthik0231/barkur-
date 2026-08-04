import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
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
    const parsed = committeeSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const member = await prisma.committee.create({
      data: {
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
      },
    })

    await auditLog("CREATE", "Committee", member.id, { name: member.name }, session)
    return successResponse(member, "Committee member added successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to add committee member", 500)
  }
}
