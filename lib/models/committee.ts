import { db } from "@/lib/mongodb"
import { toObjectId, objectIdToString, softDeleteFilter, type MongoDoc } from "./utils"

const COLLECTION = "committees"

export async function findCommitteeById(id: string): Promise<MongoDoc | null> {
  const doc = await db.collection(COLLECTION).findOne({ _id: toObjectId(id), ...softDeleteFilter() })
  return doc ? { ...doc, id: objectIdToString(doc._id) } as MongoDoc : null
}

export async function findCommitteeBySlug(slug: string): Promise<MongoDoc | null> {
  const doc = await db.collection(COLLECTION).findOne({ slug, ...softDeleteFilter() })
  return doc ? { ...doc, id: objectIdToString(doc._id) } as MongoDoc : null
}

export async function findCommitteeByName(name: string): Promise<MongoDoc | null> {
  const doc = await db.collection(COLLECTION).findOne({ name, ...softDeleteFilter() })
  return doc ? { ...doc, id: objectIdToString(doc._id) } as MongoDoc : null
}

export async function findManyCommittees(filter: Record<string, unknown> = {}, options: { skip?: number; limit?: number; sortBy?: string; sortOrder?: string; sort?: [string, 1 | -1][] } = {}) {
  const { skip, limit, sortBy = "sortOrder", sortOrder = "asc", sort } = options
  const cursor = db.collection(COLLECTION).find({ ...softDeleteFilter(), ...filter })
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

export async function countCommittees(filter: Record<string, unknown> = {}) {
  return db.collection(COLLECTION).countDocuments({ ...softDeleteFilter(), ...filter })
}

export async function createCommittee(data: Record<string, unknown>): Promise<MongoDoc> {
  const result = await db.collection(COLLECTION).insertOne(data)
  return { id: result.insertedId.toHexString(), ...data } as MongoDoc
}

export async function updateCommittee(id: string, data: Record<string, unknown>): Promise<MongoDoc | null> {
  await db.collection(COLLECTION).updateOne(
    { _id: toObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  )
  return findCommitteeById(id)
}
