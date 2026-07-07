import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { donationSchema } from "@/lib/validations"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"
import { createOrder } from "@/lib/payments"
import { sendDonationReceipt } from "@/lib/emails"

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
    const donationId = `DON-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`

    let razorpayOrder: Record<string, unknown> | undefined
    if (data.amount > 0) {
      const receipt = `don_${Date.now()}`
      const result = await createOrder({
        amount: data.amount,
        receipt,
        notes: { donationId, donorName: data.donorName, email: data.email },
      })
      if (result.success && result.order) {
        razorpayOrder = result.order as Record<string, unknown>
      }
    }

    const donation = await prisma.donation.create({
      data: {
        donationId,
        ...(body.campaignId ? { campaignId: body.campaignId } : {}),
        donorName: data.donorName,
        donorEmail: data.email,
        donorPhone: data.phone,
        amount: data.amount,
        message: data.message ?? null,
        isAnonymous: data.isAnonymous ?? false,
        panNumber: data.panCard ?? null,
        status: razorpayOrder ? "PENDING" : "COMPLETED",
      },
    })

    try {
      await sendDonationReceipt(
        { id: donation.donationId, amount: data.amount, date: new Date().toISOString(), category: data.category },
        { email: data.email, name: data.donorName }
      )
    } catch { /* email failure is non-fatal */ }

    await auditLog("CREATE", "Donation", donation.id, { donationId, amount: data.amount }, session)
    return successResponse({ donation, ...(razorpayOrder ? { order: razorpayOrder } : {}) }, "Donation recorded successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to process donation", 500)
  }
}
