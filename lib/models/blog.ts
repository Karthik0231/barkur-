import { getDb } from "@/lib/mongodb"
import { toObjectId, objectIdToString, softDeleteFilter } from "./utils"

const COLLECTION = "blogs"

export async function findBlogById(id: string) {
  const doc = await (await getDb()).collection(COLLECTION).findOne({ _id: toObjectId(id), ...softDeleteFilter() })
  return doc ? { ...doc, id: objectIdToString(doc._id) } : null
}

export async function findBlogBySlug(slug: string) {
  const doc = await (await getDb()).collection(COLLECTION).findOne({ slug, ...softDeleteFilter() })
  return doc ? { ...doc, id: objectIdToString(doc._id) } : null
}

export async function findManyBlogs(filter: Record<string, unknown> = {}, options: { skip?: number; limit?: number; sortBy?: string; sortOrder?: string } = {}) {
  const { skip, limit, sortBy = "publishedAt", sortOrder = "desc" } = options
  const cursor = (await getDb()).collection(COLLECTION).find({ ...softDeleteFilter(), ...filter })
  if (sortBy) cursor.sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
  if (skip) cursor.skip(skip)
  if (limit) cursor.limit(limit)
  const docs = await cursor.toArray()
  return docs.map((d) => ({ ...d, id: objectIdToString(d._id) }))
}

export async function countBlogs(filter: Record<string, unknown> = {}) {
  return (await getDb()).collection(COLLECTION).countDocuments({ ...softDeleteFilter(), ...filter })
}

export async function createBlog(data: Record<string, unknown>) {
  const result = await (await getDb()).collection(COLLECTION).insertOne(data)
  return { id: result.insertedId.toHexString(), ...data }
}

export async function updateBlog(id: string, data: Record<string, unknown>) {
  await (await getDb()).collection(COLLECTION).updateOne(
    { _id: toObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  )
  return findBlogById(id)
}
