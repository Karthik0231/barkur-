import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const campaign = await prisma.donationCampaign.findFirst({
      where: { id, deletedAt: null },
      include: {
        _count: { select: { donations: true } },
        donations: { take: 10, orderBy: { createdAt: "desc" }, select: { amount: true, donorName: true, createdAt: true } },
      },
    })
    if (!campaign) return errorResponse("Campaign not found", 404)
    return successResponse(campaign)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch campaign", 500)
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await prisma.donationCampaign.findFirst({ where: { id, deletedAt: null } })
    if (!existing) return errorResponse("Campaign not found", 404)

    const body = await request.json()
    const updateData: Record<string, unknown> = { updatedBy: user.id }
    if (body.name) updateData.name = body.name
    if (body.slug) updateData.slug = body.slug
    if (body.description) updateData.description = body.description
    if (body.shortDescription) updateData.shortDescription = body.shortDescription
    if (body.targetAmount) updateData.goalAmount = body.targetAmount
    if (body.startDate) updateData.startDate = new Date(body.startDate)
    if (body.endDate !== undefined) updateData.endDate = body.endDate ? new Date(body.endDate) : null
    if (body.isActive !== undefined) updateData.isActive = body.isActive
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured
    if (body.coverImage) updateData.banner = body.coverImage
    if (body.category) updateData.category = body.category

    const campaign = await prisma.donationCampaign.update({ where: { id }, data: updateData as never })
    await auditLog("UPDATE", "Campaign", id, { name: campaign.name }, session)
    return successResponse(campaign, "Campaign updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update campaign", 500)
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = await prisma.donationCampaign.findFirst({ where: { id, deletedAt: null } })
    if (!existing) return errorResponse("Campaign not found", 404)

    await prisma.donationCampaign.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    })
    await auditLog("DELETE", "Campaign", id, { name: existing.name }, session)
    return successResponse(null, "Campaign deleted successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to delete campaign", 500)
  }
}
