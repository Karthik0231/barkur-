import { getDb } from "@/lib/mongodb"
import { toObjectId, objectIdToString, softDeleteFilter, type MongoDoc } from "./utils"

const COLLECTION = "gallery"

export async function findGalleryById(id: string): Promise<MongoDoc | null> {
  const item = await (await getDb()).collection(COLLECTION).findOne({ _id: toObjectId(id), ...softDeleteFilter() })
  return item ? { ...item, id: objectIdToString(item._id) } as MongoDoc : null
}

export async function findGalleryBySlug(slug: string): Promise<MongoDoc | null> {
  const item = await (await getDb()).collection(COLLECTION).findOne({ slug, ...softDeleteFilter() })
  return item ? { ...item, id: objectIdToString(item._id) } as MongoDoc : null
}

export async function findManyGalleries(filter: Record<string, unknown> = {}, options: { skip?: number; limit?: number; sortBy?: string; sortOrder?: string; sort?: [string, 1 | -1][] } = {}): Promise<MongoDoc[]> {
  const { skip, limit, sortBy = "sortOrder", sortOrder = "asc", sort } = options
  const cursor = (await getDb()).collection(COLLECTION).find({ ...softDeleteFilter(), ...filter })
  if (sort && sort.length) {
    cursor.sort(Object.fromEntries(sort))
  } else if (sortBy) {
    cursor.sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
  }
  if (skip) cursor.skip(skip)
  if (limit) cursor.limit(limit)
  const galleries = await cursor.toArray()
  return galleries.map((g) => ({ ...g, id: objectIdToString(g._id) } as MongoDoc))
}

export async function countGalleries(filter: Record<string, unknown> = {}) {
  return (await getDb()).collection(COLLECTION).countDocuments({ ...softDeleteFilter(), ...filter })
}

export async function createGallery(data: Record<string, unknown>): Promise<MongoDoc> {
  const doc = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined))
  const result = await (await getDb()).collection(COLLECTION).insertOne(doc)
  return { id: result.insertedId.toHexString(), ...doc } as MongoDoc
}

export async function updateGallery(id: string, data: Record<string, unknown>): Promise<MongoDoc | null> {
  await (await getDb()).collection(COLLECTION).updateOne(
    { _id: toObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  )
  return findGalleryById(id)
}
