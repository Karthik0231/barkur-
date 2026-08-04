import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, getAuthUser, checkRole } from "@/lib/api-utils"

export async function GET() {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER", "ACCOUNTANT"]))
      return errorResponse("Unauthorized", 401)

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
      prisma.booking.count({ where: { deletedAt: null } }).catch(() => 0),
      prisma.booking.count({ where: { deletedAt: null, createdAt: { gte: startOfMonth } } }).catch(() => 0),
      prisma.booking.count({ where: { deletedAt: null, adminApproval: "PENDING" } }).catch(() => 0),
      prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }).catch(() => ({ _sum: { amount: 0 } })),
      prisma.payment.aggregate({ where: { status: "PAID", paidAt: { gte: startOfMonth } }, _sum: { amount: true } }).catch(() => ({ _sum: { amount: 0 } })),
      prisma.seva.count({ where: { deletedAt: null, isActive: true } }).catch(() => 0),
      prisma.donation.aggregate({ where: { deletedAt: null, status: "COMPLETED" }, _sum: { amount: true } }).catch(() => ({ _sum: { amount: 0 } })),
      prisma.donation.aggregate({ where: { deletedAt: null, status: "COMPLETED", createdAt: { gte: startOfMonth } }, _sum: { amount: true } }).catch(() => ({ _sum: { amount: 0 } })),
      prisma.donationCampaign.count({ where: { deletedAt: null, isActive: true } }).catch(() => 0),
      prisma.booking.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, bookingId: true, finalAmount: true, bookingStatus: true, createdAt: true, user: { select: { name: true, email: true } } },
      }).catch(() => []),
      prisma.festival.findMany({
        where: { deletedAt: null, isActive: true, startDate: { gte: now } },
        orderBy: { startDate: "asc" },
        take: 5,
        select: { id: true, name: true, slug: true, startDate: true, endDate: true, isMultiDay: true },
      }).catch(() => []),
      prisma.hallBooking.count({ where: { deletedAt: null, adminApproval: "PENDING" } }).catch(() => 0),
    ])

    const revenueByDayMap: Record<string, number> = {}
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo)
      d.setDate(d.getDate() + i)
      const key = d.toISOString().split("T")[0]
      revenueByDayMap[key] = 0
    }

    const revenueByDayRaw = await prisma.payment.findMany({
      where: { status: "PAID", paidAt: { gte: sevenDaysAgo } },
      select: { amount: true, paidAt: true },
      orderBy: { paidAt: "asc" },
      take: 500,
    }).catch(() => [] as { amount: unknown; paidAt: Date | null }[])

    for (const p of revenueByDayRaw) {
      if (p.paidAt) {
        const key = new Date(p.paidAt).toISOString().split("T")[0]
        revenueByDayMap[key] = (revenueByDayMap[key] ?? 0) + Number(p.amount)
      }
    }

    const stats = {
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

    return successResponse(stats)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch dashboard data", 500)
  }
}
