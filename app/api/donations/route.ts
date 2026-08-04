import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { donationSchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"
import { sendDonationReceipt } from "@/lib/emails"
import { generateReceiptNumber } from "@/lib/utils"

export async function GET(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"]))
      return errorResponse("Unauthorized", 401)

    const { searchParams } = new URL(request.url)
    const { page, limit, skip, search, sortBy, sortOrder } = paginationHelper(searchParams)

    const where: Record<string, unknown> = { deletedAt: null }
    if (search) where.OR = [
      { donorName: { contains: search, mode: "insensitive" } },
      { donationId: { contains: search, mode: "insensitive" } },
      { donorEmail: { contains: search, mode: "insensitive" } },
    ]

    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where: where as never,
        include: { campaign: { select: { id: true, name: true, slug: true } }, payment: true },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.donation.count({ where: where as never }),
    ])

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
    const count = await prisma.donation.count()
    const donationId = `DON-${new Date().getFullYear()}-${String(count + 1).padStart(5, "0")}`
    const receiptNumber = generateReceiptNumber()

    const fullAddress = data.address
    const addressParts = fullAddress ? fullAddress.split(", ") : []
    const addressLine1 = data.address || addressParts[0] || null
    const addressLine2 = addressParts.length > 1 ? addressParts.slice(1).join(", ") : null

    const metadata: Record<string, unknown> = {}
    if (data.paymentMethod) metadata.paymentMethod = data.paymentMethod
    if (data.transactionReference) metadata.transactionReference = data.transactionReference

    const donation = await prisma.donation.create({
      data: {
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
      },
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
