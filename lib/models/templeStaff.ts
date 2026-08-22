import { getDb } from "@/lib/mongodb"
import { toObjectId, objectIdToString, softDeleteFilter, type MongoDoc } from "./utils"

const COLLECTION = "templeStaff"

export async function findTempleStaffById(id: string): Promise<MongoDoc | null> {
  const doc = await (await getDb()).collection(COLLECTION).findOne({ _id: toObjectId(id), ...softDeleteFilter() })
  return doc ? { ...doc, id: objectIdToString(doc._id) } as MongoDoc : null
}

export async function findTempleStaffByEmployeeId(employeeId: string) {
  const doc = await (await getDb()).collection(COLLECTION).findOne({ employeeId, ...softDeleteFilter() })
  return doc ? { ...doc, id: objectIdToString(doc._id) } : null
}

export async function findTempleStaffByName(name: string) {
  const doc = await (await getDb()).collection(COLLECTION).findOne({ name, ...softDeleteFilter() })
  return doc ? { ...doc, id: objectIdToString(doc._id) } : null
}

export async function findManyTempleStaff(filter: Record<string, unknown> = {}, options: { skip?: number; limit?: number; sortBy?: string; sortOrder?: string; sort?: [string, 1 | -1][] } = {}): Promise<MongoDoc[]> {
  const { skip, limit, sortBy = "name", sortOrder = "asc", sort } = options
  const cursor = (await getDb()).collection(COLLECTION).find({ ...softDeleteFilter(), ...filter })
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

export async function countTempleStaff(filter: Record<string, unknown> = {}) {
  return (await getDb()).collection(COLLECTION).countDocuments({ ...softDeleteFilter(), ...filter })
}

export async function createTempleStaff(data: Record<string, unknown>): Promise<MongoDoc> {
  const result = await (await getDb()).collection(COLLECTION).insertOne(data)
  return { id: result.insertedId.toHexString(), ...data } as MongoDoc
}

export async function updateTempleStaff(id: string, data: Record<string, unknown>): Promise<MongoDoc | null> {
  await (await getDb()).collection(COLLECTION).updateOne(
    { _id: toObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  )
  return findTempleStaffById(id)
}
