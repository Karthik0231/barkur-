import { getDb } from "@/lib/mongodb"
import { toObjectId, objectIdToString, softDeleteFilter, type MongoDoc } from "./utils"

const COLLECTION = "announcements"

export async function findAnnouncementById(id: string): Promise<MongoDoc | null> {
  const announcement = await (await getDb()).collection(COLLECTION).findOne({ _id: toObjectId(id), ...softDeleteFilter() })
  return announcement ? { ...announcement, id: objectIdToString(announcement._id) } as MongoDoc : null
}

export async function findAnnouncementByTitle(title: string): Promise<MongoDoc | null> {
  const doc = await (await getDb()).collection(COLLECTION).findOne({ title, ...softDeleteFilter() })
  return doc ? { ...doc, id: objectIdToString(doc._id) } as MongoDoc : null
}

export async function findManyAnnouncements(filter: Record<string, unknown> = {}, options: { skip?: number; limit?: number; sortBy?: string; sortOrder?: string; sort?: [string, 1 | -1][] } = {}): Promise<MongoDoc[]> {
  const { skip, limit, sortBy = "createdAt", sortOrder = "desc", sort } = options
  const cursor = (await getDb()).collection(COLLECTION).find({ ...softDeleteFilter(), ...filter })
  if (sort && sort.length) {
    cursor.sort(Object.fromEntries(sort))
  } else if (sortBy) {
    cursor.sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
  }
  if (skip) cursor.skip(skip)
  if (limit) cursor.limit(limit)
  const announcements = await cursor.toArray()
  return announcements.map((a) => ({ ...a, id: objectIdToString(a._id) } as MongoDoc))
}

export async function countAnnouncements(filter: Record<string, unknown> = {}) {
  return (await getDb()).collection(COLLECTION).countDocuments({ ...softDeleteFilter(), ...filter })
}

export async function createAnnouncement(data: Record<string, unknown>): Promise<MongoDoc> {
  const doc = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined))
  const result = await (await getDb()).collection(COLLECTION).insertOne(doc)
  return { id: result.insertedId.toHexString(), ...doc } as MongoDoc
}

export async function updateAnnouncement(id: string, data: Record<string, unknown>): Promise<MongoDoc | null> {
  await (await getDb()).collection(COLLECTION).updateOne(
    { _id: toObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  )
  return findAnnouncementById(id)
}
