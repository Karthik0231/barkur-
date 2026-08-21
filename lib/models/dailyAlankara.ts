import { db } from "@/lib/mongodb"
import { toObjectId, objectIdToString, softDeleteFilter, type MongoDoc } from "./utils"

const COLLECTION = "dailyAlankara"

export async function findDailyAlankaraById(id: string): Promise<MongoDoc | null> {
  const doc = await db.collection(COLLECTION).findOne({ _id: toObjectId(id), ...softDeleteFilter() })
  return doc ? { ...doc, id: objectIdToString(doc._id) } as MongoDoc : null
}

export async function findTodayAlankara(): Promise<MongoDoc | null> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const doc = await db.collection(COLLECTION).findOne({
    ...softDeleteFilter(),
    date: { $gte: today, $lt: tomorrow },
    isActive: true,
  })
  return doc ? { ...doc, id: objectIdToString(doc._id) } as MongoDoc : null
}

export async function findManyDailyAlankaras(
  filter: Record<string, unknown> = {},
  options: { skip?: number; limit?: number; sortBy?: string; sortOrder?: string } = {}
): Promise<MongoDoc[]> {
  const { skip, limit, sortBy = "date", sortOrder = "desc" } = options
  const cursor = db.collection(COLLECTION).find({ ...softDeleteFilter(), ...filter })
  cursor.sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
  if (skip) cursor.skip(skip)
  if (limit) cursor.limit(limit)
  const docs = await cursor.toArray()
  return docs.map((d) => ({ ...d, id: objectIdToString(d._id) } as MongoDoc))
}

export async function countDailyAlankaras(filter: Record<string, unknown> = {}) {
  return db.collection(COLLECTION).countDocuments({ ...softDeleteFilter(), ...filter })
}

export async function createDailyAlankara(data: Record<string, unknown>): Promise<MongoDoc> {
  const doc = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined))
  const result = await db.collection(COLLECTION).insertOne(doc)
  return { id: result.insertedId.toHexString(), ...doc } as MongoDoc
}

export async function updateDailyAlankara(id: string, data: Record<string, unknown>): Promise<MongoDoc | null> {
  await db.collection(COLLECTION).updateOne(
    { _id: toObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  )
  return findDailyAlankaraById(id)
}

export async function softDeleteDailyAlankara(id: string): Promise<void> {
  await db.collection(COLLECTION).updateOne(
    { _id: toObjectId(id) },
    { $set: { deletedAt: new Date(), updatedAt: new Date() } }
  )
}

/** Delete all entries older than today (cleanup previous day data). */
export async function cleanupPreviousDays(): Promise<number> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const result = await db.collection(COLLECTION).updateMany(
    { date: { $lt: today }, ...softDeleteFilter() },
    { $set: { deletedAt: new Date(), updatedAt: new Date() } }
  )
  return result.modifiedCount
}
