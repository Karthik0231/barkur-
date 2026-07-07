import { prisma } from "@/lib/prisma"
import { calculatePanchanga } from "@/lib/panchanga"
import { successResponse, errorResponse } from "@/lib/api-utils"

async function tryFreeAPI(date: string): Promise<Record<string, unknown> | null> {
  const controllers: AbortController[] = []
  const timeout = 3000

  const tryVedika = async () => {
    const ac = new AbortController()
    controllers.push(ac)
    const timer = setTimeout(() => ac.abort(), timeout)
    try {
      const body: Record<string, string | number> = {
        date,
        time: "06:00",
        latitude: 13.47,
        longitude: 74.75,
        timezone: "Asia/Kolkata",
      }
      const res = await fetch("https://api.vedika.io/v2/astrology/panchang", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-sandbox": "true" },
        body: JSON.stringify(body),
        signal: ac.signal,
      })
      if (res.ok) {
        const json = await res.json()
        return json as Record<string, unknown>
      }
    } catch {
      // fall through
    } finally {
      clearTimeout(timer)
    }
    return null
  }

  const tryProkerala = async () => {
    const ac = new AbortController()
    controllers.push(ac)
    const timer = setTimeout(() => ac.abort(), timeout)
    try {
      const apiKey = process.env.PROKERALA_API_KEY
      if (!apiKey) return null
      const url = `https://api.prokerala.com/v2/hindu/panchang?ayanamsa=1&date=${date}&coordinates=13.47,74.75`
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${apiKey}` },
        signal: ac.signal,
      })
      if (res.ok) {
        const json = await res.json()
        return json as Record<string, unknown>
      }
    } catch {
      // fall through
    } finally {
      clearTimeout(timer)
    }
    return null
  }

  const result = await Promise.race([tryVedika(), tryProkerala()])
  controllers.forEach((c) => c.abort())
  return result ?? null
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get("date") || new Date().toISOString().split("T")[0]
    const date = new Date(dateParam + "T00:00:00.000Z")
    if (isNaN(date.getTime())) return errorResponse("Invalid date format. Use YYYY-MM-DD", 400)

    const existing = await prisma.panchanga.findUnique({ where: { date } })
    if (existing) {
      return successResponse({
        panchanga: {
          ...existing,
          rahuKalaStart: existing.rahuKala?.split(" - ")[0]?.trim() ?? "",
          rahuKalaEnd: existing.rahuKala?.split(" - ")[1]?.trim() ?? "",
          yamagandaStart: existing.yamaganda?.split(" - ")[0]?.trim() ?? "",
          yamagandaEnd: existing.yamaganda?.split(" - ")[1]?.trim() ?? "",
          gulikaStart: existing.gulika?.split(" - ")[0]?.trim() ?? "",
          gulikaEnd: existing.gulika?.split(" - ")[1]?.trim() ?? "",
        },
      })
    }

    const apiResult = await tryFreeAPI(dateParam)
    if (apiResult) {
      return successResponse({ panchanga: apiResult, source: "api" })
    }

    const calculated = calculatePanchanga(date)
    const panchanga = await prisma.panchanga.create({
      data: {
        date,
        masa: calculated.masa,
        tithi: calculated.tithi,
        nakshatra: calculated.nakshatra,
        yoga: calculated.yoga,
        karana: calculated.karana,
        sunrise: calculated.sunrise,
        sunset: calculated.sunset,
        rahuKala: `${calculated.rahuKala.start} - ${calculated.rahuKala.end}`,
        yamaganda: `${calculated.yamaganda.start} - ${calculated.yamaganda.end}`,
        gulika: `${calculated.gulika.start} - ${calculated.gulika.end}`,
        amritaKala: `${calculated.amritaKala.start} - ${calculated.amritaKala.end}`,
        abhijitMuhurta: `${calculated.abhijitMuhurta.start} - ${calculated.abhijitMuhurta.end}`,
        isEkadashi: calculated.isEkadashi,
        isAmavasya: calculated.isAmavasya,
        isPournami: calculated.isPournami,
        month: calculated.masa,
      },
    })

    return successResponse({
      panchanga: {
        ...panchanga,
        rahuKalaStart: calculated.rahuKala.start,
        rahuKalaEnd: calculated.rahuKala.end,
        yamagandaStart: calculated.yamaganda.start,
        yamagandaEnd: calculated.yamaganda.end,
        gulikaStart: calculated.gulika.start,
        gulikaEnd: calculated.gulika.end,
        source: "calculation",
      },
    })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to calculate panchanga", 500)
  }
}
