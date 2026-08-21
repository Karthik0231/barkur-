import { auth } from "@/lib/auth"
import { successResponse, errorResponse, getAuthUser, checkRole, auditLog } from "@/lib/api-utils"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"])) return errorResponse("Unauthorized", 401)

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const folder = (formData.get("folder") as string) || "temple-uploads"
    if (!file) return errorResponse("No file provided", 400)

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]
    if (!allowedTypes.includes(file.type))
      return errorResponse("Invalid file type. Allowed: JPEG, PNG, WebP, GIF, SVG", 400)

    if (file.size > 10 * 1024 * 1024)
      return errorResponse("File too large. Maximum size is 10MB", 400)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload(
        base64,
        {
          folder,
          resource_type: "auto",
          allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "svg"],
          transformation: [
            { quality: "auto:good", fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        },
      )
    })

    await auditLog("UPLOAD", "Media", uploadResult.public_id, {
      url: uploadResult.secure_url,
      bytes: uploadResult.bytes,
      format: uploadResult.format,
      folder,
    }, session)

    return successResponse(
      {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        filename: file.name,
        size: file.size,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height,
      },
      "File uploaded successfully",
      201,
    )
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to upload file", 500)
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN"])) return errorResponse("Unauthorized", 401)

    const body = await request.json()
    const { publicId } = body
    if (!publicId) return errorResponse("publicId is required", 400)

    await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error: any, result: any) => {
        if (error) reject(error)
        else resolve(result)
      })
    })

    await auditLog("DELETE", "Media", publicId, { publicId }, session)

    return successResponse({ publicId }, "File deleted successfully")
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to delete file", 500)
  }
}
