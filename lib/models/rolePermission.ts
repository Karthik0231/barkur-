import { getDb } from "@/lib/mongodb"
import { toObjectId, objectIdToString } from "./utils"

const COLLECTION = "rolePermissions"

export async function findRolePermissionById(id: string) {
  const doc = await (await getDb()).collection(COLLECTION).findOne({ _id: toObjectId(id) })
  return doc ? { ...doc, id: objectIdToString(doc._id) } : null
}

export async function findManyRolePermissions(filter: Record<string, unknown> = {}, options: { skip?: number; limit?: number; sortBy?: string; sortOrder?: string } = {}) {
  const { skip, limit, sortBy = "role", sortOrder = "asc" } = options
  const cursor = (await getDb()).collection(COLLECTION).find(filter)
  if (sortBy) cursor.sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
  if (skip) cursor.skip(skip)
  if (limit) cursor.limit(limit)
  const docs = await cursor.toArray()
  return docs.map((d) => ({ ...d, id: objectIdToString(d._id) }))
}

export async function countRolePermissions(filter: Record<string, unknown> = {}) {
  return (await getDb()).collection(COLLECTION).countDocuments(filter)
}

export async function createRolePermission(data: Record<string, unknown>) {
  const result = await (await getDb()).collection(COLLECTION).insertOne(data)
  return { id: result.insertedId.toHexString(), ...data }
}

export async function updateRolePermission(id: string, data: Record<string, unknown>) {
  await (await getDb()).collection(COLLECTION).updateOne(
    { _id: toObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  )
  return findRolePermissionById(id)
}
