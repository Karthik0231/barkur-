import { auth } from "@/lib/auth"
import { successResponse, errorResponse, getAuthUser, checkRole } from "@/lib/api-utils"

// Mock user data for now (no DB)
const mockUsers = [
  {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    phone: "+91 9876543210",
    role: "DEVOTEE",
    isActive: true,
    image: null,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    phone: "+91 9876543211",
    role: "ADMIN",
    isActive: true,
    image: null,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const found = mockUsers.find(u => u.id === id)
    if (!found) return errorResponse("User not found", 404)
    return successResponse(found)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch user", 500)
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const currentUser = getAuthUser(session)
    if (!currentUser || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    const existing = mockUsers.find(u => u.id === id)
    if (!existing) return errorResponse("User not found", 404)

    const body = await request.json()
    const updated = {
      ...existing,
      ...body,
    }

    return successResponse(updated, "User updated successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to update user", 500)
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    const currentUser = getAuthUser(session)
    if (!currentUser || !checkRole(session, ["SUPER_ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { id } = await params
    if (id === currentUser.id) return errorResponse("Cannot delete yourself", 400)

    const existing = mockUsers.find(u => u.id === id)
    if (!existing) return errorResponse("User not found", 404)

    return successResponse(null, "User deleted successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to delete user", 500)
  }
}
