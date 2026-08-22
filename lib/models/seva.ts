import { getDb } from "@/lib/mongodb"
import { toObjectId, objectIdToString, softDeleteFilter, type MongoDoc } from "./utils"

const COLLECTION = "sevas"

export async function findSevaById(id: string): Promise<MongoDoc | null> {
  const seva = await (await getDb()).collection(COLLECTION).findOne({ _id: toObjectId(id), ...softDeleteFilter() })
  return seva ? { ...seva, id: objectIdToString(seva._id) } as MongoDoc : null
}

export async function findSevaBySlug(slug: string): Promise<MongoDoc | null> {
  const seva = await (await getDb()).collection(COLLECTION).findOne({ slug, ...softDeleteFilter() })
  return seva ? { ...seva, id: objectIdToString(seva._id) } as MongoDoc : null
}

export async function findManySevas(filter: Record<string, unknown> = {}, options: { skip?: number; limit?: number; sortBy?: string; sortOrder?: string } = {}): Promise<MongoDoc[]> {
  const { skip, limit, sortBy = "sortOrder", sortOrder = "asc" } = options
  const cursor = (await getDb()).collection(COLLECTION).find({ ...softDeleteFilter(), ...filter })
  if (sortBy) cursor.sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
  if (skip) cursor.skip(skip)
  if (limit) cursor.limit(limit)
  const sevas = await cursor.toArray()
  return sevas.map((s) => ({ ...s, id: objectIdToString(s._id) } as MongoDoc))
}

export async function countSevas(filter: Record<string, unknown> = {}) {
  return (await getDb()).collection(COLLECTION).countDocuments({ ...softDeleteFilter(), ...filter })
}

export async function createSeva(data: Record<string, unknown>): Promise<MongoDoc> {
  const result = await (await getDb()).collection(COLLECTION).insertOne(data)
  return { id: result.insertedId.toHexString(), ...data } as MongoDoc
}

export async function updateSeva(id: string, data: Record<string, unknown>): Promise<MongoDoc | null> {
  await (await getDb()).collection(COLLECTION).updateOne(
    { _id: toObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  )
  return findSevaById(id)
}
