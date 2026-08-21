import { auth } from "@/lib/auth"
import { findManyTestimonials, countTestimonials, createTestimonial } from "@/lib/models/testimonial"
import { testimonialSchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = paginationHelper(searchParams)
    const session = await auth()
    const user = getAuthUser(session)
    const isAdmin = user && checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"])

    const where: Record<string, unknown> = {}
    if (isAdmin) {
      if (searchParams.get("isApproved") !== null) where.isApproved = searchParams.get("isApproved") === "true"
    } else {
      where.isApproved = true
    }

    const [testimonials, total] = await Promise.all([
      findManyTestimonials(where, { skip, limit, sortBy: "sortOrder", sortOrder: "asc" }),
      countTestimonials(where),
    ])

    testimonials.sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return b.isFeatured ? 1 : -1
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return successResponse({ testimonials, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch testimonials", 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)

    const body = await request.json()
    const parsed = testimonialSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const isAdmin = user && checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"])

    const testimonial = await createTestimonial({
      name: data.name,
      content: data.content,
      rating: data.rating,
      isApproved: data.isApproved ?? !!isAdmin,
      isFeatured: false,
      sortOrder: 0,
    })

    await auditLog("CREATE", "Testimonial", testimonial.id, { name: testimonial.name }, session)
    return successResponse(testimonial, "Testimonial submitted successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to submit testimonial", 500)
  }
}
