import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, getAuthUser } from "@/lib/api-utils"
import { generateCertificateNumber } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const { bookingId, type } = body

    if (!bookingId || !type) return errorResponse("bookingId and type are required", 400)

    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, deletedAt: null },
      include: { user: { select: { name: true } } },
    })
    if (!booking) return errorResponse("Booking not found", 404)

    if (booking.paymentStatus !== "PAID") return errorResponse("Payment not completed", 400)

    const certNumber = generateCertificateNumber()
    const certificate = await prisma.certificate.create({
      data: {
        bookingId,
        certificateNumber: certNumber,
        type: type as never,
        template: "default",
        metadata: { generatedBy: user.id, bookingId: booking.bookingId, devotee: booking.user?.name },
        issuedAt: new Date(),
      },
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
    const type = searchParams.get("type")

    const where: Record<string, unknown> = {}
    if (bookingId) where.bookingId = bookingId
    if (certNumber) where.certificateNumber = certNumber
    if (type) where.type = type

    const whereBooking = await prisma.certificate.findMany({
      where: where as never,
      include: { booking: { select: { bookingId: true } } },
      orderBy: { createdAt: "desc" },
    })

    return successResponse({ certificates: whereBooking })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch certificates", 500)
  }
}
