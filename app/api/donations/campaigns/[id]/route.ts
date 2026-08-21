import { auth } from "@/lib/auth"
import { findDonationCampaignById, updateDonationCampaign } from "@/lib/models/donationCampaign"
import { countDonations, findManyDonations } from "@/lib/models/donation"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const campaign = await findDonationCampaignById(id)
    if (!campaign) return errorResponse("Campaign not found", 404)

    const [recentDonations, totalDonations] = await Promise.all([
      findManyDonations({ campaignId: id }, { limit: 10, sortBy: "createdAt", sortOrder: "desc" }),
      countDonations({ campaignId: id }),
    ])

    const formattedDonations = recentDonations.map(d => ({
      amount: d.amount,
      donorName: d.donorName,
      createdAt: d.createdAt,
    }))

    return successResponse({ ...campaign, _count: { donations: totalDonations }, donations: formattedDonations })
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
    const existing = await findDonationCampaignById(id)
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

    const campaign = await updateDonationCampaign(id, updateData)
    await auditLog("UPDATE", "Campaign", id, { name: campaign?.name }, session)
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
    const existing = await findDonationCampaignById(id)
    if (!existing) return errorResponse("Campaign not found", 404)

    await updateDonationCampaign(id, { deletedAt: new Date(), isActive: false })
    await auditLog("DELETE", "Campaign", id, { name: existing.name }, session)
    return successResponse(null, "Campaign deleted successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to delete campaign", 500)
  }
}
