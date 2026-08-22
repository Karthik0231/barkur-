import { getDb } from "@/lib/mongodb"
import { toObjectId, objectIdToString, type MongoDoc } from "./utils"

const COLLECTION = "templeSettings"

export async function findTempleSettingById(id: string): Promise<MongoDoc | null> {
  const doc = await (await getDb()).collection(COLLECTION).findOne({ _id: toObjectId(id) })
  return doc ? { ...doc, id: objectIdToString(doc._id) } as MongoDoc : null
}

export async function findTempleSettingByKey(key: string): Promise<MongoDoc | null> {
  const doc = await (await getDb()).collection(COLLECTION).findOne({ key })
  return doc ? { ...doc, id: objectIdToString(doc._id) } as MongoDoc : null
}

export async function findManyTempleSettings(filter: Record<string, unknown> = {}, options: { skip?: number; limit?: number; sortBy?: string; sortOrder?: string; sort?: [string, 1 | -1][] } = {}): Promise<MongoDoc[]> {
  const { skip, limit, sortBy = "key", sortOrder = "asc", sort } = options
  const cursor = (await getDb()).collection(COLLECTION).find(filter)
  if (sort && sort.length) {
    cursor.sort(Object.fromEntries(sort))
  } else if (sortBy) {
    cursor.sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
  }
  if (skip) cursor.skip(skip)
  if (limit) cursor.limit(limit)
  const docs = await cursor.toArray()
  return docs.map((d) => ({ ...d, id: objectIdToString(d._id) }))
}

export async function countTempleSettings(filter: Record<string, unknown> = {}) {
  return (await getDb()).collection(COLLECTION).countDocuments(filter)
}

export async function createTempleSetting(data: Record<string, unknown>) {
  const result = await (await getDb()).collection(COLLECTION).insertOne(data)
  return { id: result.insertedId.toHexString(), ...data }
}

export async function upsertTempleSetting(key: string, data: Record<string, unknown>): Promise<MongoDoc | null> {
  const result = await (await getDb()).collection(COLLECTION).findOneAndUpdate(
    { key },
    {
      $set: { ...data, updatedAt: new Date() },
      $setOnInsert: { key, createdAt: new Date() },
    },
    { upsert: true, returnDocument: "after" }
  )
  const val = result?.value
  return val ? { ...val, id: objectIdToString(val._id) } as MongoDoc : null
}

export async function updateTempleSetting(id: string, data: Record<string, unknown>) {
  await (await getDb()).collection(COLLECTION).updateOne(
    { _id: toObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  )
  return findTempleSettingById(id)
}
