import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { faqSchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = paginationHelper(searchParams)
    const category = searchParams.get("category")
    const session = await auth()
    const user = getAuthUser(session)
    const isAdmin = user && checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"])

    const where: Record<string, unknown> = { deletedAt: null }
    if (!isAdmin) where.isActive = true
    if (category) where.category = category

    const [faqs, total] = await Promise.all([
      prisma.fAQ.findMany({
        where: where as never,
        skip,
        take: limit,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      }),
      prisma.fAQ.count({ where: where as never }),
    ])

    return successResponse({ faqs, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch FAQs", 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const parsed = faqSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const faq = await prisma.fAQ.create({
      data: {
        question: data.question,
        answer: data.answer,
        category: data.category,
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isPublished ?? true,
      },
    })

    await auditLog("CREATE", "FAQ", faq.id, { question: faq.question }, session)
    return successResponse(faq, "FAQ created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create FAQ", 500)
  }
}
