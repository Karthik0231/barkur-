import { db } from "@/lib/mongodb"
import { toObjectId, objectIdToString, softDeleteFilter, type MongoDoc } from "./utils"

const COLLECTION = "testimonials"

export async function findTestimonialById(id: string): Promise<MongoDoc | null> {
  const doc = await db.collection(COLLECTION).findOne({ _id: toObjectId(id), ...softDeleteFilter() })
  return doc ? { ...doc, id: objectIdToString(doc._id) } as MongoDoc : null
}

export async function findTestimonialByName(name: string): Promise<MongoDoc | null> {
  const doc = await db.collection(COLLECTION).findOne({ name, ...softDeleteFilter() })
  return doc ? { ...doc, id: objectIdToString(doc._id) } as MongoDoc : null
}

export async function findManyTestimonials(filter: Record<string, unknown> = {}, options: { skip?: number; limit?: number; sortBy?: string; sortOrder?: string } = {}): Promise<MongoDoc[]> {
  const { skip, limit, sortBy = "sortOrder", sortOrder = "asc" } = options
  const cursor = db.collection(COLLECTION).find({ ...softDeleteFilter(), ...filter })
  if (sortBy) cursor.sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
  if (skip) cursor.skip(skip)
  if (limit) cursor.limit(limit)
  const docs = await cursor.toArray()
  return docs.map((d) => ({ ...d, id: objectIdToString(d._id) } as MongoDoc))
}

export async function countTestimonials(filter: Record<string, unknown> = {}) {
  return db.collection(COLLECTION).countDocuments({ ...softDeleteFilter(), ...filter })
}

export async function createTestimonial(data: Record<string, unknown>): Promise<MongoDoc> {
  const result = await db.collection(COLLECTION).insertOne(data)
  return { id: result.insertedId.toHexString(), ...data } as MongoDoc
}

export async function updateTestimonial(id: string, data: Record<string, unknown>): Promise<MongoDoc | null> {
  await db.collection(COLLECTION).updateOne(
    { _id: toObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  )
  return findTestimonialById(id)
}
