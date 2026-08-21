import { auth } from "@/lib/auth"
import { findSevaById, findSevaBySlug, updateSeva } from "@/lib/models/seva"
import { db } from "@/lib/mongodb"
import { sevaSchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

async function findSevaByIdOrSlug(identifier: string) {
  try {
    const seva = await findSevaById(identifier)
    return seva
  } catch {
    return await findSevaBySlug(identifier)
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const seva = await findSevaByIdOrSlug(id)
    if (!seva) return errorResponse("Seva not found", 404)

    const [sevaDates, sevaTimeSlots] = await Promise.all([
      db.collection("sevaDates")
        .find({ sevaId: seva.id, isAvailable: true })
        .sort({ date: 1 })
        .limit(30)
        .toArray(),
      db.collection("sevaTimeSlots")
        .find({ sevaId: seva.id, isAvailable: true })
        .sort({ startTime: 1 })
        .limit(30)
        .toArray(),
    ])

    return successResponse({
      ...seva,
      sevaDates,
      sevaTimeSlots,
    })
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
    const existing = await findSevaByIdOrSlug(id)
    if (!existing) return errorResponse("Seva not found", 404)

    const body = await request.json()
    const parsed = sevaSchema.partial().safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const validFields = parsed.data
    const updateData: Record<string, unknown> = { updatedBy: user.id }
    if (validFields.name !== undefined) updateData.name = validFields.name
    if (validFields.slug !== undefined) updateData.slug = validFields.slug
    if (validFields.description !== undefined) updateData.description = validFields.description
    if (validFields.shortDescription !== undefined) updateData.shortDescription = validFields.shortDescription
    if (validFields.price !== undefined) updateData.price = validFields.price
    if (validFields.originalPrice !== undefined) updateData.originalPrice = validFields.originalPrice
    if (validFields.duration !== undefined) updateData.duration = validFields.duration
    if (validFields.maxDevotees !== undefined) updateData.maxDevotees = validFields.maxDevotees
    if (validFields.minDevotees !== undefined) updateData.minDevotees = validFields.minDevotees
    if (validFields.bookingNotice !== undefined) updateData.bookingNotice = validFields.bookingNotice
    if (validFields.requiresApproval !== undefined) updateData.requiresApproval = validFields.requiresApproval
    if (validFields.isActive !== undefined) updateData.isActive = validFields.isActive
    if (validFields.isSpecial !== undefined) updateData.isSpecial = validFields.isSpecial
    if (validFields.isShashwatha !== undefined) updateData.isShashwatha = validFields.isShashwatha
    if (validFields.sortOrder !== undefined) updateData.sortOrder = validFields.sortOrder
    if (validFields.images !== undefined) updateData.images = validFields.images ? JSON.parse(JSON.stringify(validFields.images)) : null

    const rulesData: Record<string, unknown> = {}
    if (validFields.bookingRules !== undefined) rulesData.bookingRules = validFields.bookingRules
    if (body.rules !== undefined && Array.isArray(body.rules)) rulesData.items = body.rules
    if (body.instructions !== undefined && Array.isArray(body.instructions)) rulesData.instructions = body.instructions
    if (Object.keys(rulesData).length > 0) {
      updateData.rules = JSON.parse(JSON.stringify(rulesData))
    }
    if (body.instructions !== undefined && Array.isArray(body.instructions)) {
      updateData.specialInstructions = JSON.parse(JSON.stringify({ items: body.instructions }))
    }

    const seva = await updateSeva(existing.id, updateData)

    await auditLog("UPDATE", "Seva", existing.id, { name: seva?.name }, session)
    return successResponse(seva, "Seva updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update seva", 500)
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await findSevaByIdOrSlug(id)
    if (!existing) return errorResponse("Seva not found", 404)

    const body = await request.json()
    const parsed = sevaSchema.partial().safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const validFields = parsed.data
    const updateData: Record<string, unknown> = { updatedBy: user.id }
    if (validFields.name !== undefined) updateData.name = validFields.name
    if (validFields.slug !== undefined) updateData.slug = validFields.slug
    if (validFields.description !== undefined) updateData.description = validFields.description
    if (validFields.shortDescription !== undefined) updateData.shortDescription = validFields.shortDescription
    if (validFields.price !== undefined) updateData.price = validFields.price
    if (validFields.originalPrice !== undefined) updateData.originalPrice = validFields.originalPrice
    if (validFields.duration !== undefined) updateData.duration = validFields.duration
    if (validFields.maxDevotees !== undefined) updateData.maxDevotees = validFields.maxDevotees
    if (validFields.minDevotees !== undefined) updateData.minDevotees = validFields.minDevotees
    if (validFields.bookingNotice !== undefined) updateData.bookingNotice = validFields.bookingNotice
    if (validFields.requiresApproval !== undefined) updateData.requiresApproval = validFields.requiresApproval
    if (validFields.isActive !== undefined) updateData.isActive = validFields.isActive
    if (validFields.isSpecial !== undefined) updateData.isSpecial = validFields.isSpecial
    if (validFields.isShashwatha !== undefined) updateData.isShashwatha = validFields.isShashwatha
    if (validFields.sortOrder !== undefined) updateData.sortOrder = validFields.sortOrder
    if (validFields.images !== undefined) updateData.images = validFields.images ? JSON.parse(JSON.stringify(validFields.images)) : null

    const rulesData: Record<string, unknown> = {}
    if (validFields.bookingRules !== undefined) rulesData.bookingRules = validFields.bookingRules
    if (body.rules !== undefined && Array.isArray(body.rules)) rulesData.items = body.rules
    if (body.instructions !== undefined && Array.isArray(body.instructions)) rulesData.instructions = body.instructions
    if (Object.keys(rulesData).length > 0) {
      updateData.rules = JSON.parse(JSON.stringify(rulesData))
    }
    if (body.instructions !== undefined && Array.isArray(body.instructions)) {
      updateData.specialInstructions = JSON.parse(JSON.stringify({ items: body.instructions }))
    }

    const seva = await updateSeva(existing.id, updateData)

    await auditLog("PATCH", "Seva", existing.id, { name: seva?.name, ...body }, session)
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
    const existing = await findSevaByIdOrSlug(id)
    if (!existing) return errorResponse("Seva not found", 404)

    await updateSeva(existing.id, { deletedAt: new Date(), isActive: false, updatedBy: user.id })

    await auditLog("DELETE", "Seva", existing.id, { name: existing.name }, session)
    return successResponse(null, "Seva deleted successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to delete seva", 500)
  }
}
