import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { sevaSchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const seva = await prisma.seva.findFirst({
      where: { id, deletedAt: null },
      include: {
        category: true,
        sevaDates: { where: { isAvailable: true }, take: 30, orderBy: { date: "asc" } },
        sevaTimeSlots: { where: { isAvailable: true }, take: 30, orderBy: { startTime: "asc" } },
      },
    })
    if (!seva) return errorResponse("Seva not found", 404)
    return successResponse(seva)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch seva", 500)
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await prisma.seva.findFirst({ where: { id, deletedAt: null } })
    if (!existing) return errorResponse("Seva not found", 404)

    const body = await request.json()
    const parsed = sevaSchema.partial().safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const validFields = parsed.data
    const updateData: Record<string, unknown> = { updatedBy: user.id }
    if (validFields.name) updateData.name = validFields.name
    if (validFields.slug) updateData.slug = validFields.slug
    if (validFields.description) updateData.description = validFields.description
    if (validFields.shortDescription) updateData.shortDescription = validFields.shortDescription
    if (validFields.price) updateData.price = validFields.price
    if (validFields.discountedPrice) updateData.originalPrice = validFields.discountedPrice
    if (validFields.maxQuantity) updateData.maxDevotees = validFields.maxQuantity
    if (validFields.isActive !== undefined) updateData.isActive = validFields.isActive
    if (validFields.categoryId) updateData.categoryId = validFields.categoryId
    if (validFields.imageUrl) updateData.images = JSON.parse(JSON.stringify([validFields.imageUrl]))
    if (validFields.prerequisites) updateData.rules = JSON.parse(JSON.stringify({ prerequisites: validFields.prerequisites }))
    if (validFields.notes) updateData.specialInstructions = JSON.parse(JSON.stringify({ notes: validFields.notes }))
    if (validFields.duration) updateData.duration = parseInt(validFields.duration)

    const seva = await prisma.seva.update({
      where: { id },
      data: updateData as never,
    })

    await auditLog("UPDATE", "Seva", id, { name: seva.name }, session)
    return successResponse(seva, "Seva updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update seva", 500)
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await prisma.seva.findFirst({ where: { id, deletedAt: null } })
    if (!existing) return errorResponse("Seva not found", 404)

    await prisma.seva.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false, updatedBy: user.id },
    })

    await auditLog("DELETE", "Seva", id, { name: existing.name }, session)
    return successResponse(null, "Seva deleted successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to delete seva", 500)
  }
}
