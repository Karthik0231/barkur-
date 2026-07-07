import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await prisma.contact.findFirst({ where: { id, deletedAt: null } })
    if (!existing) return errorResponse("Contact not found", 404)

    const body = await request.json()
    const updateData: Record<string, unknown> = {}
    if (body.isRead !== undefined) updateData.isRead = body.isRead
    if (body.isRead) {
      updateData.repliedAt = new Date()
      updateData.repliedBy = user.id
    }

    const contact = await prisma.contact.update({ where: { id }, data: updateData as never })
    await auditLog("UPDATE", "Contact", id, { isRead: body.isRead }, session)
    return successResponse(contact, "Contact updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update contact", 500)
  }
}
