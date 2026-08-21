import { findSevaById } from "@/lib/models/seva"
import { db } from "@/lib/mongodb"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const seva = await findSevaById(id)
    if (!seva) return errorResponse("Seva not found", 404)

    const dateFilter: Record<string, unknown> = { sevaId: id, isAvailable: true }
    if (startDate) dateFilter.date = { $gte: new Date(startDate) }
    if (endDate) dateFilter.date = { ...(dateFilter.date as object || {}), $lte: new Date(endDate) }

    const dates = await db.collection("sevaDates")
      .find(dateFilter)
      .sort({ date: 1 })
      .toArray()

    const dateIds = dates.map((d) => d._id)
    const timeSlots = await db.collection("sevaTimeSlots")
      .find({
        dateId: { $in: dateIds },
        isAvailable: true,
      })
      .sort({ startTime: 1 })
      .toArray()

    const slotsByDateId = timeSlots.reduce((acc, slot) => {
      const key = slot.dateId?.toHexString?.() ?? String(slot.dateId)
      if (!acc[key]) acc[key] = []
      acc[key].push(slot)
      return acc
    }, {} as Record<string, any[]>)

    const datesWithSlots = dates.map((date) => ({
      ...date,
      timeSlots: slotsByDateId[date._id.toHexString()] || [],
    }))

    const slots = await db.collection("sevaTimeSlots")
      .find({
        sevaId: id,
        isAvailable: true,
        ...(startDate ? { startTime: { $gte: new Date(startDate) } } : {}),
      })
      .sort({ startTime: 1 })
      .toArray()

    return successResponse({ seva: { id: seva.id, name: seva.name, price: seva.price }, dates: datesWithSlots, slots })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to check availability", 500)
  }
}
