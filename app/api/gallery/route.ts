import { auth } from "@/lib/auth"
import { findManyGalleries, countGalleries, createGallery } from "@/lib/models/gallery"
import { successResponse, errorResponse, getAuthUser, checkRole, paginationHelper, auditLog } from "@/lib/api-utils"
import slugify from "slugify"
import { v2 as cloudinary } from "cloudinary"
import { z } from "zod"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const galleryUploadSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = paginationHelper(searchParams)
    const category = searchParams.get("category")
    const type = searchParams.get("type")

    const where: Record<string, unknown> = { isPublished: true }
    if (category) where.category = category
    if (type) where.type = type

    const [gallery, total] = await Promise.all([
      findManyGalleries(where, { skip, limit, sortBy: "sortOrder", sortOrder: "asc" }),
      countGalleries(where),
    ])

    return successResponse({ gallery, total, page, limit, totalPages: Math.ceil(total / limit) }, "Success", 200, 120)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to fetch gallery", 500)
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    const user = getAuthUser(session)
    if (!user || !checkRole(session, ["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER"]))
      return errorResponse("Unauthorized", 401)

    const contentType = request.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      const files = formData.getAll("images") as File[]
      const metadataJson = formData.get("metadata") as string | null
      let metadata: Record<string, unknown> = {}
      if (metadataJson) {
        try { metadata = JSON.parse(metadataJson) } catch { /* ignore */ }
      }

      const parsed = galleryUploadSchema.safeParse(metadata)
      if (!parsed.success) return errorResponse("Validation failed", 400, parsed.error.flatten().fieldErrors as Record<string, string[]>)

      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]
      const maxSize = 10 * 1024 * 1024

      const uploadedItems = []
      for (const file of files) {
        if (!allowedTypes.includes(file.type))
          return errorResponse(`Invalid file type: ${file.name}. Allowed: JPEG, PNG, WebP, GIF, SVG`, 400)
        if (file.size > maxSize)
          return errorResponse(`File too large: ${file.name}. Maximum size is 10MB`, 400)

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`

        const uploadResult = await new Promise<any>((resolve, reject) => {
          cloudinary.uploader.upload(
            base64,
            {
              folder: "temple-gallery",
              resource_type: "auto",
              allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "svg"],
              transformation: [{ quality: "auto:good", fetch_format: "auto" }],
            },
            (error, result) => {
              if (error) reject(error)
              else resolve(result)
            },
          )
        })

        const title = parsed.data?.title || file.name.replace(/\.[^/.]+$/, "")
        const slug = slugify(title, { lower: true, strict: true })
        const uniqueSlug = `${slug}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

        const galleryItem = await createGallery({
          title,
          slug: uniqueSlug,
          description: parsed.data?.description ?? null,
          image: uploadResult.secure_url,
          images: [uploadResult.secure_url],
          type: (parsed.data?.type as never) || "IMAGE",
          category: (parsed.data?.category as never) || "OTHER",
          isFeatured: parsed.data?.isFeatured ?? false,
          isPublished: parsed.data?.isPublished ?? true,
          sortOrder: parsed.data?.sortOrder ?? 0,
          createdBy: user.id,
        })

        uploadedItems.push(galleryItem)
      }

      await auditLog("CREATE", "Gallery", uploadedItems.map(i => i.id).join(","), { count: uploadedItems.length }, session)
      return successResponse(uploadedItems, `${uploadedItems.length} image(s) uploaded successfully`, 201)
    }

    const body = await request.json()
    if (!body.title || !body.image) return errorResponse("Title and image are required", 400)

    const slug = slugify(body.title, { lower: true, strict: true })
    const gallery = await createGallery({
      title: body.title,
      slug: `${slug}-${Date.now()}`,
      description: body.description ?? null,
      image: body.image,
      images: [body.image],
      type: body.type ?? "IMAGE",
      category: body.category ?? "OTHER",
      isFeatured: body.isFeatured ?? false,
      isPublished: body.isPublished ?? true,
      sortOrder: body.sortOrder ?? 0,
      createdBy: user.id,
    })

    await auditLog("CREATE", "Gallery", gallery.id, { title: gallery.title }, session)
    return successResponse(gallery, "Gallery item created successfully", 201)
  } catch (error) {
    return errorResponse(error instanceof Error ? error.message : "Failed to create gallery item", 500)
  }
}
