import { getDb } from "@/lib/mongodb"
import { toObjectId, objectIdToString, softDeleteFilter, type MongoDoc } from "./utils"

const COLLECTION = "devoteeDetails"

export async function findDevoteeDetailByPhone(phone: string): Promise<MongoDoc | null> {
  const detail = await (await getDb()).collection(COLLECTION).findOne({ phone, ...softDeleteFilter() })
  return detail ? { ...detail, id: objectIdToString(detail._id) } as MongoDoc : null
}

export async function findDevoteeDetailById(id: string) {
  const detail = await (await getDb()).collection(COLLECTION).findOne({ _id: toObjectId(id), ...softDeleteFilter() })
  return detail ? { ...detail, id: objectIdToString(detail._id) } : null
}

export async function findManyDevoteeDetails(filter: Record<string, unknown> = {}, options: { skip?: number; limit?: number; sortBy?: string; sortOrder?: string } = {}) {
  const { skip, limit, sortBy = "createdAt", sortOrder = "desc" } = options
  const cursor = (await getDb()).collection(COLLECTION).find({ ...softDeleteFilter(), ...filter })
  if (sortBy) cursor.sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
  if (skip) cursor.skip(skip)
  if (limit) cursor.limit(limit)
  const details = await cursor.toArray()
  return details.map((d) => ({ ...d, id: objectIdToString(d._id) }))
}

export async function countDevoteeDetails(filter: Record<string, unknown> = {}) {
  return (await getDb()).collection(COLLECTION).countDocuments({ ...softDeleteFilter(), ...filter })
}

export async function createDevoteeDetail(data: Record<string, unknown>) {
  const result = await (await getDb()).collection(COLLECTION).insertOne(data)
  return { id: result.insertedId.toHexString(), ...data }
}

export async function updateDevoteeDetail(id: string, data: Record<string, unknown>) {
  await (await getDb()).collection(COLLECTION).updateOne(
    { _id: toObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  )
  return findDevoteeDetailById(id)
}
