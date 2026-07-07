import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await prisma.fAQ.findFirst({ where: { id, deletedAt: null } })
    if (!existing) return errorResponse("FAQ not found", 404)

    const body = await request.json()
    const updateData: Record<string, unknown> = {}
    const allowed = ["question", "answer", "category", "sortOrder", "isActive"]
    for (const key of allowed) {
      if (body[key] !== undefined) updateData[key] = body[key]
    }

    const faq = await prisma.fAQ.update({ where: { id }, data: updateData as never })
    await auditLog("UPDATE", "FAQ", id, { question: faq.question }, session)
    return successResponse(faq, "FAQ updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update FAQ", 500)
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await prisma.fAQ.findFirst({ where: { id, deletedAt: null } })
    if (!existing) return errorResponse("FAQ not found", 404)

    await prisma.fAQ.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } })
    await auditLog("DELETE", "FAQ", id, { question: existing.question }, session)
    return successResponse(null, "FAQ deleted successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to delete FAQ", 500)
  }
}
