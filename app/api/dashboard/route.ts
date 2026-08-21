import { auth } from "@/lib/auth"
import { countBookings, aggregateBookings } from "@/lib/models/booking"
import { findManyPayments, aggregatePayments } from "@/lib/models/payment"
import { aggregateDonations } from "@/lib/models/donation"
import { countSevas } from "@/lib/models/seva"
import { countDonationCampaigns } from "@/lib/models/donationCampaign"
import { countHallBookings } from "@/lib/models/hallBooking"
import { findManyFestivals } from "@/lib/models/festival"
import { successResponse, errorResponse, getAuthUser, checkRole } from "@/lib/api-utils"
import { cached } from "@/lib/cache"

/** Mirrors the model layer's soft-delete convention for hand-written aggregation pipelines. */
const notDeleted = { deletedAt: { $exists: false } }

/** Reshapes a `$sum` aggregation into Prisma's `_sum` shape so downstream logic is unchanged. */
function toSum(rows: Record<string, unknown>[]) {
  return { _sum: { amount: rows[0]?.total ?? 0 } }
}

async function computeDashboard() {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalBookings,
    monthBookings,
    pendingBookings,
    totalRevenue,
    monthRevenue,
    activeSevas,
    totalDonations,
    monthDonations,
    pendingCampaigns,
    recentBookings,
    upcomingFestivals,
    pendingHallBookings,
  ] = await Promise.all([
    countBookings().catch(() => 0),
    countBookings({ createdAt: { $gte: startOfMonth } }).catch(() => 0),
    countBookings({ adminApproval: "PENDING" }).catch(() => 0),
    aggregatePayments([
      { $match: { status: "PAID" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]).then(toSum).catch(() => ({ _sum: { amount: 0 } })),
    aggregatePayments([
      { $match: { status: "PAID", paidAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]).then(toSum).catch(() => ({ _sum: { amount: 0 } })),
    countSevas({ isActive: true }).catch(() => 0),
    aggregateDonations([
      { $match: { ...notDeleted, status: "COMPLETED" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]).then(toSum).catch(() => ({ _sum: { amount: 0 } })),
    aggregateDonations([
      { $match: { ...notDeleted, status: "COMPLETED", createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]).then(toSum).catch(() => ({ _sum: { amount: 0 } })),
    countDonationCampaigns({ isActive: true }).catch(() => 0),
    aggregateBookings([
      { $match: notDeleted },
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
      { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "bookingUser" } },
      { $unwind: { path: "$bookingUser", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          id: { $toString: "$_id" },
          bookingId: 1,
          finalAmount: 1,
          bookingStatus: 1,
          createdAt: 1,
          user: { name: "$bookingUser.name", email: "$bookingUser.email" },
        },
      },
    ]).catch(() => []),
    findManyFestivals(
      { isActive: true, startDate: { $gte: now } },
      { limit: 5, sortBy: "startDate", sortOrder: "asc" }
    ).then((festivals) =>
      festivals.map((f) => ({
        id: f.id,
        name: f.name,
        slug: f.slug,
        startDate: f.startDate,
        endDate: f.endDate,
        isMultiDay: f.isMultiDay,
      }))
    ).catch(() => []),
    countHallBookings({ adminApproval: "PENDING" }).catch(() => 0),
  ])

  const revenueByDayMap: Record<string, number> = {}
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo)
    d.setDate(d.getDate() + i)
    const key = d.toISOString().split("T")[0]
    revenueByDayMap[key] = 0
  }

  const revenueByDayRaw = await findManyPayments(
    { status: "PAID", paidAt: { $gte: sevenDaysAgo } },
    { limit: 500, sortBy: "paidAt", sortOrder: "asc" }
  ).catch(() => [] as { amount: unknown; paidAt: Date | null }[])

  for (const p of revenueByDayRaw) {
    if (p.paidAt) {
      const key = new Date(p.paidAt).toISOString().split("T")[0]
      revenueByDayMap[key] = (revenueByDayMap[key] ?? 0) + Number(p.amount)
    }
  }

  return {
    totalBookings: totalBookings as number,
    monthBookings: monthBookings as number,
    pendingApprovals: (pendingBookings as number) + (pendingHallBookings as number),
    activeSevas: activeSevas as number,
    totalRevenue: Number((totalRevenue as { _sum: { amount: unknown } })._sum.amount ?? 0),
    monthRevenue: Number((monthRevenue as { _sum: { amount: unknown } })._sum.amount ?? 0),
    totalDonations: Number((totalDonations as { _sum: { amount: unknown } })._sum.amount ?? 0),
    monthDonations: Number((monthDonations as { _sum: { amount: unknown } })._sum.amount ?? 0),
    pendingCampaigns: pendingCampaigns as number,
    revenueByDay: Object.entries(revenueByDayMap).map(([date, amount]) => ({ date, amount })),
    recentBookings: recentBookings as never[],
    upcomingFestivals: upcomingFestivals as never[],
  }
}

export async function GET() {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER", "ACCOUNTANT"]))
      return errorResponse("Unauthorized", 401)

    // Dashboard data changes slowly; cache the expensive aggregations for 30s to
    // avoid recomputing ~13 queries on every admin page load.
    const stats = await cached("dashboard:admin", 30_000, computeDashboard)

    return successResponse(stats)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch dashboard data", 500)
  }
}
