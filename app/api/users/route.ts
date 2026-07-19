import { auth } from "@/lib/auth"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper } from "@/lib/api-utils"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { searchParams } = new URL(request.url)
    const { page, limit, skip, search, sortBy, sortOrder } = paginationHelper(searchParams)
    const role = searchParams.get("role")
    const isActive = searchParams.get("isActive")

    const where: Record<string, unknown> = { deletedAt: null }
    if (role) where.role = role
    if (isActive !== null) where.isActive = isActive === "true"
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ]
    }

    const orderBy = sortBy ? { [sortBy]: sortOrder } : { createdAt: "desc" as const }

    const [users, total] = await Promise.all([
      prisma.user.findMany({ where: where as any, orderBy, skip, take: limit }),
      prisma.user.count({ where: where as any }),
    ])

    return successResponse({ users, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch users", 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const currentUser = getAuthUser(session)
    if (!currentUser || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const body = await request.json()
    if (!body.name || !body.email) return errorResponse("Name and email are required", 400)

    const existing = await prisma.user.findUnique({ where: { email: body.email } })
    if (existing) return errorResponse("Email already in use", 409)

    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone ?? null,
        role: body.role ?? "DEVOTEE",
        isActive: body.isActive ?? true,
        createdBy: currentUser.id,
      },
    })

    return successResponse(newUser, "User created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create user", 500)
  }
}
