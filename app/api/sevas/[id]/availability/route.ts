import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const seva = await prisma.seva.findFirst({ where: { id, deletedAt: null } })
    if (!seva) return errorResponse("Seva not found", 404)

    const dateFilter: Record<string, unknown> = { sevaId: id, isAvailable: true }
    if (startDate) dateFilter.date = { gte: new Date(startDate) }
    if (endDate) dateFilter.date = { ...(dateFilter.date as object || {}), lte: new Date(endDate) }

    const dates = await prisma.sevaDate.findMany({
      where: dateFilter as never,
      include: {
        timeSlots: { where: { isAvailable: true }, orderBy: { startTime: "asc" } },
      },
      orderBy: { date: "asc" },
    })

    const slots = await prisma.sevaTimeSlot.findMany({
      where: {
        sevaId: id,
        isAvailable: true,
        ...(startDate ? { startTime: { gte: new Date(startDate) } } : {}),
      },
      orderBy: { startTime: "asc" },
    })

    return successResponse({ seva: { id: seva.id, name: seva.name, price: seva.price }, dates, slots })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to check availability", 500)
  }
}
