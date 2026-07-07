import { auth } from "@/lib/auth"
import { successResponse, errorResponse, getAuthUser } from "@/lib/api-utils"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user) return errorResponse("Unauthorized", 401)

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) return errorResponse("No file provided", 400)

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]
    if (!allowedTypes.includes(file.type)) return errorResponse("Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG", 400)

    if (file.size > 5 * 1024 * 1024) return errorResponse("File too large. Maximum size is 5MB", 400)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = path.extname(file.name) || ".jpg"
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`
    const uploadDir = path.join(process.cwd(), "public", "uploads")

    await mkdir(uploadDir, { recursive: true })
    const filepath = path.join(uploadDir, filename)
    await writeFile(filepath, buffer)

    const url = `/uploads/${filename}`
    return successResponse({ url, filename, size: file.size }, "File uploaded successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to upload file", 500)
  }
}
