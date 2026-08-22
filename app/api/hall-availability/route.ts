import { findManyHallBookings } from "@/lib/models/hallBooking"
import { findManyHalls } from "@/lib/models/hall"
import { successResponse, errorResponse } from "@/lib/api-utils"
import { toObjectId } from "@/lib/models/utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const hallSlug = searchParams.get("hallSlug")

    // Fetch all non-cancelled bookings
    const where: Record<string, unknown> = {
      bookingStatus: { $in: ["PENDING", "CONFIRMED"] },
    }

    const bookings = await findManyHallBookings(where, { limit: 200 })

    // Fetch hall info to match by slug
    const hallIds = bookings.filter(b => b.hallId).map(b => b.hallId)
    const halls = hallIds.length > 0
      ? await findManyHalls({ _id: { $in: hallIds.map(id => toObjectId(id)) } })
      : []
    const hallMap = new Map(halls.map(h => [h.id, h]))

    // Build booked dates array
    const bookedDates: Array<{
      date: string
      hallSlug: string
      hallName: string
      startTime: string
      endTime: string
      status: string
    }> = []

    for (const b of bookings) {
      const hall = b.hallId ? hallMap.get(b.hallId) : undefined
      if (!hall) continue

      // If a specific hall is requested, filter by it
      if (hallSlug && hall.slug !== hallSlug) continue

      bookedDates.push({
        date: b.bookingDate ? new Date(b.bookingDate).toISOString().split("T")[0] : "",
        hallSlug: hall.slug || "",
        hallName: hall.name || "",
        startTime: b.startTime ? new Date(b.startTime).toISOString() : "",
        endTime: b.endTime ? new Date(b.endTime).toISOString() : "",
        status: b.bookingStatus || "PENDING",
      })
    }

    return successResponse({ bookedDates })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch availability", 500)
  }
}
