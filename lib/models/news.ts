import { getDb } from "@/lib/mongodb"
import { toObjectId, objectIdToString, softDeleteFilter, type MongoDoc } from "./utils"

const COLLECTION = "news"

export async function findNewsById(id: string): Promise<MongoDoc | null> {
  const news = await (await getDb()).collection(COLLECTION).findOne({ _id: toObjectId(id), ...softDeleteFilter() })
  return news ? { ...news, id: objectIdToString(news._id) } as MongoDoc : null
}

export async function findNewsBySlug(slug: string): Promise<MongoDoc | null> {
  const doc = await (await getDb()).collection(COLLECTION).findOne({ slug, ...softDeleteFilter() })
  return doc ? { ...doc, id: objectIdToString(doc._id) } as MongoDoc : null
}

export async function findManyNews(filter: Record<string, unknown> = {}, options: { skip?: number; limit?: number; sortBy?: string; sortOrder?: string } = {}): Promise<MongoDoc[]> {
  const { skip, limit, sortBy = "createdAt", sortOrder = "desc" } = options
  const cursor = (await getDb()).collection(COLLECTION).find({ ...softDeleteFilter(), ...filter })
  if (sortBy) cursor.sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
  if (skip) cursor.skip(skip)
  if (limit) cursor.limit(limit)
  const news = await cursor.toArray()
  return news.map((n) => ({ ...n, id: objectIdToString(n._id) } as MongoDoc))
}

export async function countNews(filter: Record<string, unknown> = {}) {
  return (await getDb()).collection(COLLECTION).countDocuments({ ...softDeleteFilter(), ...filter })
}

export async function createNews(data: Record<string, unknown>): Promise<MongoDoc> {
  const doc = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined))
  const result = await (await getDb()).collection(COLLECTION).insertOne(doc)
  return { id: result.insertedId.toHexString(), ...doc } as MongoDoc
}

export async function updateNews(id: string, data: Record<string, unknown>): Promise<MongoDoc | null> {
  await (await getDb()).collection(COLLECTION).updateOne(
    { _id: toObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  )
  return findNewsById(id)
}

export async function incrementNewsViewCount(id: string) {
  await (await getDb()).collection(COLLECTION).updateOne(
    { _id: toObjectId(id) },
    { $inc: { viewCount: 1 } }
  )
}
