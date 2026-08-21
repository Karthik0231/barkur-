import { auth } from "@/lib/auth"
import { findManyDonations, countDonations, createDonation } from "@/lib/models/donation"
import { findManyDonationCampaigns } from "@/lib/models/donationCampaign"
import { findManyPayments } from "@/lib/models/payment"
import { donationSchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"
import { sendDonationReceipt } from "@/lib/emails"
import { generateReceiptNumber } from "@/lib/utils"
import { toObjectId, escapeRegex } from "@/lib/models/utils"

export async function GET(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"]))
      return errorResponse("Unauthorized", 401)

    const { searchParams } = new URL(request.url)
    const { page, limit, skip, search, sortBy, sortOrder } = paginationHelper(searchParams)

    const where: Record<string, unknown> = {}
    if (search) where.$or = [
      { donorName: { $regex: escapeRegex(search), $options: "i" } },
      { donationId: { $regex: escapeRegex(search), $options: "i" } },
      { donorEmail: { $regex: escapeRegex(search), $options: "i" } },
    ]

    const [donations, total] = await Promise.all([
      findManyDonations(where, { skip, limit, sortBy, sortOrder }),
      countDonations(where),
    ])

    const campaignIds = donations.filter(d => d.campaignId).map(d => d.campaignId)
    const paymentIds = donations.filter(d => d.paymentId).map(d => d.paymentId)

    const [campaigns, payments] = await Promise.all([
      campaignIds.length ? findManyDonationCampaigns({ _id: { $in: campaignIds.map(id => toObjectId(id)) } }) : Promise.resolve([]),
      paymentIds.length ? findManyPayments({ _id: { $in: paymentIds.map(id => toObjectId(id)) } }) : Promise.resolve([]),
    ])

    const campaignMap = new Map(campaigns.map(c => [c.id, c]))
    const paymentMap = new Map(payments.map(p => [p.id, p]))

    donations.forEach(d => {
      d.campaign = d.campaignId ? campaignMap.get(d.campaignId) : undefined
      d.payment = d.paymentId ? paymentMap.get(d.paymentId) : undefined
    })

    return successResponse({ donations, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch donations", 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)

    const body = await request.json()
    const parsed = donationSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const count = await countDonations({})
    const donationId = `DON-${new Date().getFullYear()}-${String(count + 1).padStart(5, "0")}`
    const receiptNumber = generateReceiptNumber()

    const fullAddress = data.address
    const addressParts = fullAddress ? fullAddress.split(", ") : []
    const addressLine1 = data.address || addressParts[0] || null
    const addressLine2 = addressParts.length > 1 ? addressParts.slice(1).join(", ") : null

    const metadata: Record<string, unknown> = {}
    if (data.paymentMethod) metadata.paymentMethod = data.paymentMethod
    if (data.transactionReference) metadata.transactionReference = data.transactionReference

    const donation = await createDonation({
      donationId,
      receiptNumber,
      ...(data.campaignId ? { campaignId: data.campaignId } : {}),
      donorName: data.donorName,
      donorEmail: data.email,
      donorPhone: data.phone,
      amount: data.amount,
      message: data.message ?? null,
      isAnonymous: data.isAnonymous ?? false,
      panNumber: data.panCard ? data.panCard : null,
      status: "PENDING_VERIFICATION",
      paymentId: null,
      addressLine1,
      addressLine2,
      city: data.city ?? null,
      state: data.state ?? null,
      pincode: data.pincode ?? null,
    })

    try {
      await sendDonationReceipt(
        { id: donation.donationId, amount: data.amount, date: new Date().toISOString(), category: data.category },
        { email: data.email, name: data.donorName }
      )
    } catch { /* email failure is non-fatal */ }

    if (session && user) {
      await auditLog("CREATE", "Donation", donation.id, { donationId, amount: data.amount }, session)
    }

    return successResponse(
      { donation, receiptNumber },
      "Donation record submitted successfully. Please allow time for verification.",
      201
    )
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to process donation", 500)
  }
}
