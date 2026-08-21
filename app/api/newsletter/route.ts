import { findNewsletterByEmail, createNewsletter, updateNewsletter } from "@/lib/models/newsletter"
import { newsletterSchema } from "@/lib/validations"
import { successResponse, errorResponse } from "@/lib/api-utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const action = body.action as string | undefined

    if (action === "unsubscribe") {
      const parsed = newsletterSchema.safeParse(body)
      if (!parsed.success) return errorResponse("Invalid email", 400)

      const existing = await findNewsletterByEmail(parsed.data.email)
      if (!existing) return successResponse(null, "Email not found in our list")

      await updateNewsletter(existing.id, { isSubscribed: false, unsubscribedAt: new Date() })

      return successResponse(null, "Unsubscribed successfully")
    }

    const parsed = newsletterSchema.safeParse(body)
    if (!parsed.success) return errorResponse("Invalid email", 400)

    const existing = await findNewsletterByEmail(parsed.data.email)
    if (existing) {
      if (existing.isSubscribed) return successResponse(null, "Already subscribed")
      await updateNewsletter(existing.id, { isSubscribed: true, unsubscribedAt: null })
      return successResponse(null, "Re-subscribed successfully")
    }

    await createNewsletter({ email: parsed.data.email, isSubscribed: true, subscribedAt: new Date() })

    return successResponse(null, "Subscribed successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to process subscription", 500)
  }
}
