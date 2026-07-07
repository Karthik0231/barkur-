import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { categorySchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const category = await prisma.sevaCategory.findFirst({
      where: { id, deletedAt: null },
      include: { sevas: { where: { deletedAt: null }, take: 20 } },
    })
    if (!category) return errorResponse("Category not found", 404)
    return successResponse(category)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch category", 500)
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await prisma.sevaCategory.findFirst({ where: { id, deletedAt: null } })
    if (!existing) return errorResponse("Category not found", 404)

    const body = await request.json()
    const parsed = categorySchema.partial().safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const category = await prisma.sevaCategory.update({ where: { id }, data: parsed.data })
    await auditLog("UPDATE", "Category", id, { name: category.name }, session)
    return successResponse(category, "Category updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update category", 500)
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await prisma.sevaCategory.findFirst({ where: { id, deletedAt: null } })
    if (!existing) return errorResponse("Category not found", 404)

    await prisma.sevaCategory.update({ where: { id }, data: { deletedAt: new Date() } })
    await auditLog("DELETE", "Category", id, { name: existing.name }, session)
    return successResponse(null, "Category deleted successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to delete category", 500)
  }
}
