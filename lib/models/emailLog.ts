import { db } from "@/lib/mongodb"
import { toObjectId, objectIdToString } from "./utils"

const COLLECTION = "emailLogs"

export async function findEmailLogById(id: string) {
  const doc = await db.collection(COLLECTION).findOne({ _id: toObjectId(id) })
  return doc ? { ...doc, id: objectIdToString(doc._id) } : null
}

export async function findManyEmailLogs(filter: Record<string, unknown> = {}, options: { skip?: number; limit?: number; sortBy?: string; sortOrder?: string } = {}) {
  const { skip, limit, sortBy = "createdAt", sortOrder = "desc" } = options
  const cursor = db.collection(COLLECTION).find(filter)
  if (sortBy) cursor.sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
  if (skip) cursor.skip(skip)
  if (limit) cursor.limit(limit)
  const docs = await cursor.toArray()
  return docs.map((d) => ({ ...d, id: objectIdToString(d._id) }))
}

export async function countEmailLogs(filter: Record<string, unknown> = {}) {
  return db.collection(COLLECTION).countDocuments(filter)
}

export async function createEmailLog(data: Record<string, unknown>) {
  const result = await db.collection(COLLECTION).insertOne(data)
  return { id: result.insertedId.toHexString(), ...data }
}

export async function updateEmailLog(id: string, data: Record<string, unknown>) {
  await db.collection(COLLECTION).updateOne(
    { _id: toObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  )
  return findEmailLogById(id)
}
