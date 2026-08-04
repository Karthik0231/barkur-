import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, getAuthUser, checkRole } from "@/lib/api-utils"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "ACCOUNTANT"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params

    const donation = await prisma.donation.findFirst({
      where: { id, deletedAt: null },
      include: {
        campaign: { select: { id: true, name: true, slug: true } },
        payment: true,
      },
    })
    if (!donation) return errorResponse("Donation not found", 404)
    return successResponse(donation)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch donation", 500)
  }
}
