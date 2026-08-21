import { db } from "@/lib/mongodb"
import { toObjectId, objectIdToString, softDeleteFilter } from "./utils"

const COLLECTION = "pageContents"

export async function findPageContentById(id: string) {
  const doc = await db.collection(COLLECTION).findOne({ _id: toObjectId(id), ...softDeleteFilter() })
  return doc ? { ...doc, id: objectIdToString(doc._id) } : null
}

export async function findPageContentBySlug(slug: string) {
  const doc = await db.collection(COLLECTION).findOne({ slug, ...softDeleteFilter() })
  return doc ? { ...doc, id: objectIdToString(doc._id) } : null
}

export async function findManyPageContents(filter: Record<string, unknown> = {}, options: { skip?: number; limit?: number; sortBy?: string; sortOrder?: string } = {}) {
  const { skip, limit, sortBy = "updatedAt", sortOrder = "desc" } = options
  const cursor = db.collection(COLLECTION).find({ ...softDeleteFilter(), ...filter })
  if (sortBy) cursor.sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
  if (skip) cursor.skip(skip)
  if (limit) cursor.limit(limit)
  const docs = await cursor.toArray()
  return docs.map((d) => ({ ...d, id: objectIdToString(d._id) }))
}

export async function countPageContents(filter: Record<string, unknown> = {}) {
  return db.collection(COLLECTION).countDocuments({ ...softDeleteFilter(), ...filter })
}

export async function createPageContent(data: Record<string, unknown>) {
  const result = await db.collection(COLLECTION).insertOne(data)
  return { id: result.insertedId.toHexString(), ...data }
}

export async function updatePageContent(id: string, data: Record<string, unknown>) {
  await db.collection(COLLECTION).updateOne(
    { _id: toObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  )
  return findPageContentById(id)
}
