import { db } from "@/lib/mongodb"
import { toObjectId, objectIdToString, softDeleteFilter, type MongoDoc } from "./utils"

const COLLECTION = "users"

export async function findUserByEmail(email: string): Promise<MongoDoc | null> {
  const user = await db.collection(COLLECTION).findOne({ email, ...softDeleteFilter() })
  return user ? { ...user, id: objectIdToString(user._id) } as MongoDoc : null
}

export async function findUserById(id: string): Promise<MongoDoc | null> {
  const user = await db.collection(COLLECTION).findOne({ _id: toObjectId(id), ...softDeleteFilter() })
  return user ? { ...user, id: objectIdToString(user._id) } as MongoDoc : null
}

export async function findUserByPhone(phone: string): Promise<MongoDoc | null> {
  const user = await db.collection(COLLECTION).findOne({ phone, ...softDeleteFilter() })
  return user ? { ...user, id: objectIdToString(user._id) } as MongoDoc : null
}

export async function createUser(data: Record<string, unknown>): Promise<MongoDoc> {
  const result = await db.collection(COLLECTION).insertOne(data)
  return { id: result.insertedId.toHexString(), ...data } as MongoDoc
}

export async function updateUser(id: string, data: Record<string, unknown>): Promise<MongoDoc | null> {
  await db.collection(COLLECTION).updateOne(
    { _id: toObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  )
  return findUserById(id)
}

export async function findManyUsers(filter: Record<string, unknown> = {}, options: { skip?: number; limit?: number; sortBy?: string; sortOrder?: string } = {}): Promise<MongoDoc[]> {
  const { skip, limit, sortBy = "createdAt", sortOrder = "desc" } = options
  const cursor = db.collection(COLLECTION).find({ ...softDeleteFilter(), ...filter })
  if (sortBy) {
    cursor.sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
  }
  if (skip) cursor.skip(skip)
  if (limit) cursor.limit(limit)
  const users = await cursor.toArray()
  return users.map((u) => ({ ...u, id: objectIdToString(u._id) } as MongoDoc))
}

export async function countUsers(filter: Record<string, unknown> = {}) {
  return db.collection(COLLECTION).countDocuments({ ...softDeleteFilter(), ...filter })
}
