import { auth } from "@/lib/auth"
import { findDonationById } from "@/lib/models/donation"
import { findDonationCampaignById } from "@/lib/models/donationCampaign"
import { findPaymentById } from "@/lib/models/payment"
import { successResponse, errorResponse, getAuthUser, checkRole } from "@/lib/api-utils"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params

    const donation = await findDonationById(id)
    if (!donation) return errorResponse("Donation not found", 404)

    const [campaign, payment] = await Promise.all([
      donation.campaignId ? findDonationCampaignById(donation.campaignId) : Promise.resolve(null),
      donation.paymentId ? findPaymentById(donation.paymentId) : Promise.resolve(null),
    ])

    return successResponse({ ...donation, campaign, payment })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch donation", 500)
  }
}
