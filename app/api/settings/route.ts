import { auth } from "@/lib/auth"
import { successResponse, errorResponse, getAuthUser, checkRole } from "@/lib/api-utils"

// Mock settings data for now (no DB)
const mockSettings = [
  { id: "1", key: "temple_name", value: "Sri Kshetra Barkur", group: "general", description: "Temple name" },
  { id: "2", key: "temple_address", value: "Barkur, Karnataka", group: "temple", description: "Temple address" },
  { id: "3", key: "contact_email", value: "info@barkurtemple.org", group: "general", description: "Contact email" },
  { id: "4", key: "contact_phone", value: "+91 9876543210", group: "general", description: "Contact phone" },
  { id: "5", key: "social_facebook", value: "https://facebook.com/barkurtemple", group: "social", description: "Facebook page" },
  { id: "6", key: "social_instagram", value: "https://instagram.com/barkurtemple", group: "social", description: "Instagram page" },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const session = await auth()
    const user = getAuthUser(session)
    const isAdmin = user && checkRole(session, ["SUPER_ADMIN", "ADMIN"])
    const group = searchParams.get("group")

    let settings = [...mockSettings]
    if (group) {
      settings = settings.filter(s => s.group === group)
    }

    if (!isAdmin) {
      const publicOnly = settings.filter(s => ["general", "temple", "social"].includes(s.group ?? ""))
      return successResponse({ settings: publicOnly })
    }

    return successResponse({ settings })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch settings", 500)
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const { settings } = body
    if (!Array.isArray(settings)) return errorResponse("Settings array is required", 400)

    // Mock update - just return the settings
    return successResponse({ settings }, "Settings updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update settings", 500)
  }
}
