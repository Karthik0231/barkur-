import { auth } from "@/lib/auth"
import { findBookingById } from "@/lib/models/booking"
import { findUserById } from "@/lib/models/user"
import { createCertificate, findManyCertificates } from "@/lib/models/certificate"
import { findManyBookings } from "@/lib/models/booking"
import { successResponse, errorResponse, getAuthUser } from "@/lib/api-utils"
import { generateCertificateNumber } from "@/lib/utils"
import { certificateSchema } from "@/lib/validations"
import { toObjectId } from "@/lib/models/utils"

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const parsed = certificateSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const booking = await findBookingById(data.bookingId)
    if (!booking) return errorResponse("Booking not found", 404)

    if (booking.paymentStatus !== "PAID") return errorResponse("Payment not completed", 400)

    const bookingUser = await findUserById(booking.userId)

    const certNumber = data.certificateNumber || generateCertificateNumber()
    const certificate = await createCertificate({
      bookingId: data.bookingId,
      certificateNumber: certNumber,
      type: data.type,
      template: data.template ?? "default",
      metadata: { generatedBy: user.id, bookingId: booking.id, devotee: bookingUser?.name } as never,
      issuedAt: new Date(),
    })

    return successResponse(certificate, "Certificate generated successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to generate certificate", 500)
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const bookingId = searchParams.get("bookingId")
    const certNumber = searchParams.get("certNumber")

    const where: Record<string, unknown> = {}
    if (bookingId) where.bookingId = bookingId
    if (certNumber) where.certificateNumber = certNumber

    const certificates = await findManyCertificates(where, { sortBy: "createdAt", sortOrder: "desc" })

    const bookingIds = certificates.filter(c => c.bookingId).map(c => c.bookingId)
    const bookings = bookingIds.length ? await findManyBookings({ _id: { $in: bookingIds.map(id => toObjectId(id)) } }) : []

    const bookingMap = new Map(bookings.map(b => [b.id, b]))
    const finalCertificates = certificates.map(c => ({
      ...c,
      booking: c.bookingId ? { bookingId: bookingMap.get(c.bookingId)?.bookingId } : undefined,
    }))

    return successResponse({ certificates: finalCertificates })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch certificates", 500)
  }
}
