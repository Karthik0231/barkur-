import { getDb } from "@/lib/mongodb"
import { toObjectId, objectIdToString, softDeleteFilter, type MongoDoc } from "./utils"

const COLLECTION = "festivals"

export async function findFestivalById(id: string): Promise<MongoDoc | null> {
  const festival = await (await getDb()).collection(COLLECTION).findOne({ _id: toObjectId(id), ...softDeleteFilter() })
  return festival ? { ...festival, id: objectIdToString(festival._id) } as MongoDoc : null
}

export async function findFestivalBySlug(slug: string): Promise<MongoDoc | null> {
  const festival = await (await getDb()).collection(COLLECTION).findOne({ slug, ...softDeleteFilter() })
  return festival ? { ...festival, id: objectIdToString(festival._id) } as MongoDoc : null
}

export async function findManyFestivals(filter: Record<string, unknown> = {}, options: { skip?: number; limit?: number; sortBy?: string; sortOrder?: string; sort?: [string, 1 | -1][] } = {}): Promise<MongoDoc[]> {
  const { skip, limit, sortBy = "createdAt", sortOrder = "desc", sort } = options
  const cursor = (await getDb()).collection(COLLECTION).find({ ...softDeleteFilter(), ...filter })
  if (sort && sort.length) {
    cursor.sort(Object.fromEntries(sort))
  } else if (sortBy) {
    cursor.sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
  }
  if (skip) cursor.skip(skip)
  if (limit) cursor.limit(limit)
  const festivals = await cursor.toArray()
  return festivals.map((f) => ({ ...f, id: objectIdToString(f._id) } as MongoDoc))
}

export async function countFestivals(filter: Record<string, unknown> = {}) {
  return (await getDb()).collection(COLLECTION).countDocuments({ ...softDeleteFilter(), ...filter })
}

export async function createFestival(data: Record<string, unknown>): Promise<MongoDoc> {
  const doc = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined))
  const result = await (await getDb()).collection(COLLECTION).insertOne(doc)
  return { id: result.insertedId.toHexString(), ...doc } as MongoDoc
}

export async function updateFestival(id: string, data: Record<string, unknown>): Promise<MongoDoc | null> {
  await (await getDb()).collection(COLLECTION).updateOne(
    { _id: toObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  )
  return findFestivalById(id)
}

export async function findEventsByFestivalId(festivalId: string) {
  return (await getDb()).collection("events").find({ festivalId, isActive: true, ...softDeleteFilter() }).sort({ date: 1 }).toArray()
}
