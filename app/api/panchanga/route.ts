import { calculatePanchanga } from "@/lib/panchanga"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get("date") || new Date().toISOString().split("T")[0]
    const date = new Date(dateParam + "T00:00:00.000Z")
    if (isNaN(date.getTime())) return errorResponse("Invalid date format. Use YYYY-MM-DD", 400)

    const calculated = calculatePanchanga(date)

    return successResponse({
      panchanga: {
        ...calculated,
        rahuKalaStart: calculated.rahuKala.start,
        rahuKalaEnd: calculated.rahuKala.end,
        yamagandaStart: calculated.yamaganda.start,
        yamagandaEnd: calculated.yamaganda.end,
        gulikaStart: calculated.gulika.start,
        gulikaEnd: calculated.gulika.end,
        amritaKalaStart: calculated.amritaKala.start,
        amritaKalaEnd: calculated.amritaKala.end,
        abhijitMuhurtaStart: calculated.abhijitMuhurta.start,
        abhijitMuhurtaEnd: calculated.abhijitMuhurta.end,
        source: "calculation",
      },
    })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to calculate panchanga", 500)
  }
}
