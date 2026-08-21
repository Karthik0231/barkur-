import { auth } from "@/lib/auth"
import { findManyFaqs, countFaqs, createFaq } from "@/lib/models/faq"
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

    const filter: Record<string, unknown> = {}
    if (!isAdmin) filter.isActive = true
    if (category) filter.category = category

    const [faqs, total] = await Promise.all([
      findManyFaqs(filter, {
        skip,
        limit,
        sort: [["sortOrder", 1], ["createdAt", -1]],
      }),
      countFaqs(filter),
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
    const faq = await createFaq({
      question: data.question,
      answer: data.answer,
      category: data.category,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isPublished ?? true,
    })

    await auditLog("CREATE", "FAQ", faq.id, { question: faq.question }, session)
    return successResponse(faq, "FAQ created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create FAQ", 500)
  }
}
