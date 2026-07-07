import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { contactSchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { searchParams } = new URL(request.url)
    const { page, limit, skip, search, sortBy, sortOrder } = paginationHelper(searchParams)
    const isRead = searchParams.get("isRead")

    const where: Record<string, unknown> = { deletedAt: null }
    if (isRead !== null) where.isRead = isRead === "true"
    if (search) where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { subject: { contains: search, mode: "insensitive" } },
      { message: { contains: search, mode: "insensitive" } },
    ]

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where: where as never,
        skip,
        take: limit,
        orderBy: [{ isRead: "asc" }, { [sortBy]: sortOrder }],
      }),
      prisma.contact.count({ where: where as never }),
    ])

    return successResponse({ contacts, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch contact submissions", 500)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const contact = await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        subject: data.subject,
        message: data.message,
      },
    })

    return successResponse(contact, "Message sent successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to send message", 500)
  }
}
