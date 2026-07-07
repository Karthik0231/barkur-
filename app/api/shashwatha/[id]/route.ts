import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const { id } = await params
    const isAdmin = checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"])
    const booking = await prisma.shashwathaBooking.findFirst({
      where: isAdmin ? { id, deletedAt: null } : { id, userId: user.id, deletedAt: null },
      include: {
        seva: { select: { id: true, name: true, slug: true, price: true } },
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    })
    if (!booking) return errorResponse("Shashwatha booking not found", 404)
    return successResponse(booking)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch shashwatha booking", 500)
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await prisma.shashwathaBooking.findFirst({ where: { id, deletedAt: null } })
    if (!existing) return errorResponse("Shashwatha booking not found", 404)

    const body = await request.json()
    const updateData: Record<string, unknown> = {}
    if (body.status) updateData.status = body.status
    if (body.adminApproval) updateData.adminApproval = body.adminApproval
    if (body.adminApproval === "APPROVED") updateData.approvedBy = user.id

    const booking = await prisma.shashwathaBooking.update({
      where: { id },
      data: updateData as never,
      include: {
        seva: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    })

    await auditLog("UPDATE", "ShashwathaBooking", id, { status: body.status, approval: body.adminApproval }, session)
    return successResponse(booking, "Shashwatha booking updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update shashwatha booking", 500)
  }
}
