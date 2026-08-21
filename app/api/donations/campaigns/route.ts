import { auth } from "@/lib/auth"
import { findManyDonationCampaigns, countDonationCampaigns, createDonationCampaign } from "@/lib/models/donationCampaign"
import { countDonations } from "@/lib/models/donation"
import { campaignSchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"
import { escapeRegex } from "@/lib/models/utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip, search, sortBy, sortOrder } = paginationHelper(searchParams)
    const session = await auth()
    const user = getAuthUser(session)
    const isAdmin = user && checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER", "ACCOUNTANT"])

    const where: Record<string, unknown> = {}
    if (!isAdmin) where.isActive = true
    if (search) where.$or = [
      { name: { $regex: escapeRegex(search), $options: "i" } },
      { slug: { $regex: escapeRegex(search), $options: "i" } },
      { description: { $regex: escapeRegex(search), $options: "i" } },
    ]

    const [campaigns, total] = await Promise.all([
      findManyDonationCampaigns(where, { skip, limit, sortBy, sortOrder }),
      countDonationCampaigns(where),
    ])

    const donationCounts = await Promise.all(
      campaigns.map(c => countDonations({ campaignId: c.id }))
    )
    campaigns.forEach((campaign, index) => {
      campaign._count = { donations: donationCounts[index] }
    })

    return successResponse({ campaigns, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch campaigns", 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const parsed = campaignSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const campaign = await createDonationCampaign({
      name: data.name,
      slug: data.slug,
      description: data.description,
      shortDescription: data.shortDescription,
      goalAmount: data.goalAmount,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      banner: data.banner ?? null,
      category: data.category as never,
      isActive: data.isActive ?? true,
      isFeatured: data.isFeatured ?? false,
      createdBy: user.id,
    })

    await auditLog("CREATE", "Campaign", campaign.id, { name: campaign.name }, session)
    return successResponse(campaign, "Campaign created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create campaign", 500)
  }
}
