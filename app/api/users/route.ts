import { auth } from "@/lib/auth"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper } from "@/lib/api-utils"

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
  },
  {
    id: "3",
    name: "Super Admin",
    email: "superadmin@example.com",
    phone: "+91 9876543212",
    role: "SUPER_ADMIN",
    isActive: true,
    image: null,
    lastLogin: new Date(),
    createdAt: new Date(),
  },
]

export async function GET(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const { searchParams } = new URL(request.url)
    const { page, limit, skip, search, sortBy, sortOrder } = paginationHelper(searchParams)
    const role = searchParams.get("role")
    const isActive = searchParams.get("isActive")

    let filteredUsers = [...mockUsers]
    if (role) {
      filteredUsers = filteredUsers.filter(u => u.role === role)
    }
    if (isActive !== null) {
      filteredUsers = filteredUsers.filter(u => u.isActive === (isActive === "true"))
    }
    if (search) {
      filteredUsers = filteredUsers.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.phone && u.phone.includes(search))
      )
    }

    // Simple sort
    if (sortBy) {
      filteredUsers.sort((a, b) => {
        const aVal = a[sortBy as keyof typeof a]
        const bVal = b[sortBy as keyof typeof b]
        
        if (aVal === null && bVal === null) return 0
        if (aVal === null) return sortOrder === "asc" ? 1 : -1
        if (bVal === null) return sortOrder === "asc" ? -1 : 1
        
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
        return 0
      })
    }

    const total = filteredUsers.length
    const users = filteredUsers.slice(skip, skip + limit)

    return successResponse({ users, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch users", 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const currentUser = getAuthUser(session)
    if (!currentUser || !checkRole(session, ["SUPER_ADMIN", "ADMIN"]))
      return errorResponse("Unauthorized", 401)

    const body = await request.json()
    if (!body.name || !body.email) return errorResponse("Name and email are required", 400)

    const existing = mockUsers.find(u => u.email === body.email)
    if (existing) return errorResponse("Email already in use", 409)

    const newUser = {
      id: Date.now().toString(),
      name: body.name,
      email: body.email,
      phone: body.phone ?? null,
      role: body.role ?? "DEVOTEE",
      isActive: body.isActive ?? true,
      image: null,
      lastLogin: new Date(),
      createdAt: new Date(),
    }
    mockUsers.push(newUser)

    return successResponse(newUser, "User created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create user", 500)
  }
}
