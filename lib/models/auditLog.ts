import { db } from "@/lib/mongodb"
import { toObjectId, objectIdToString, type MongoDoc } from "./utils"

const COLLECTION = "auditLogs"

export async function findAuditLogById(id: string): Promise<MongoDoc | null> {
  const doc = await db.collection(COLLECTION).findOne({ _id: toObjectId(id) })
  return doc ? { ...doc, id: objectIdToString(doc._id) } as MongoDoc : null
}

export async function findManyAuditLogs(filter: Record<string, unknown> = {}, options: { skip?: number; limit?: number; sortBy?: string; sortOrder?: string; sort?: [string, 1 | -1][] } = {}): Promise<MongoDoc[]> {
  const { skip, limit, sortBy = "createdAt", sortOrder = "desc", sort } = options
  const cursor = db.collection(COLLECTION).find(filter)
  if (sort && sort.length) {
    cursor.sort(Object.fromEntries(sort))
  } else if (sortBy) {
    cursor.sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
  }
  if (skip) cursor.skip(skip)
  if (limit) cursor.limit(limit)
  const docs = await cursor.toArray()
  return docs.map((d) => ({ ...d, id: objectIdToString(d._id) } as MongoDoc))
}

export async function countAuditLogs(filter: Record<string, unknown> = {}) {
  return db.collection(COLLECTION).countDocuments(filter)
}

export async function createAuditLog(data: Record<string, unknown>): Promise<MongoDoc> {
  const result = await db.collection(COLLECTION).insertOne(data)
  return { id: result.insertedId.toHexString(), ...data } as MongoDoc
}

export async function updateAuditLog(id: string, data: Record<string, unknown>): Promise<MongoDoc | null> {
  await db.collection(COLLECTION).updateOne(
    { _id: toObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  )
  return findAuditLogById(id)
}
