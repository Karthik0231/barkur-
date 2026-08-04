import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { successResponse, errorResponse, getAuthUser } from "@/lib/api-utils"
import { generateCertificateNumber } from "@/lib/utils"
import { certificateSchema } from "@/lib/validations"

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const parsed = certificateSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

    const data = parsed.data
    const booking = await prisma.booking.findFirst({
      where: { id: data.bookingId, deletedAt: null },
      include: { user: { select: { name: true } } },
    })
    if (!booking) return errorResponse("Booking not found", 404)

    if (booking.paymentStatus !== "PAID") return errorResponse("Payment not completed", 400)

    const certNumber = data.certificateNumber || generateCertificateNumber()
    const certificate = await prisma.certificate.create({
      data: {
        bookingId: data.bookingId,
        certificateNumber: certNumber,
        type: data.type,
        template: data.template ?? "default",
        metadata: (data.metadata ?? { generatedBy: user.id, bookingId: booking.id, devotee: booking.user?.name }) as never,
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

    const where: Record<string, unknown> = {}
    if (bookingId) where.bookingId = bookingId
    if (certNumber) where.certificateNumber = certNumber

    const certificates = await prisma.certificate.findMany({
      where: where as never,
      include: { booking: { select: { bookingId: true } } },
      orderBy: { createdAt: "desc" },
    })

    return successResponse({ certificates })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch certificates", 500)
  }
}
