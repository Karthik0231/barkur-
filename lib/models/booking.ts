import { getDb } from "@/lib/mongodb"
import { toObjectId, objectIdToString, softDeleteFilter, type MongoDoc } from "./utils"

const COLLECTION = "bookings"

export async function findBookingById(id: string): Promise<MongoDoc | null> {
  const booking = await (await getDb()).collection(COLLECTION).findOne({ _id: toObjectId(id), ...softDeleteFilter() })
  return booking ? { ...booking, id: objectIdToString(booking._id) } as MongoDoc : null
}

export async function findBookingByBookingId(bookingId: string): Promise<MongoDoc | null> {
  const booking = await (await getDb()).collection(COLLECTION).findOne({ bookingId, ...softDeleteFilter() })
  return booking ? { ...booking, id: objectIdToString(booking._id) } as MongoDoc : null
}

export async function findManyBookings(filter: Record<string, unknown> = {}, options: { skip?: number; limit?: number; sortBy?: string; sortOrder?: string } = {}): Promise<MongoDoc[]> {
  const { skip, limit, sortBy = "createdAt", sortOrder = "desc" } = options
  const cursor = (await getDb()).collection(COLLECTION).find({ ...softDeleteFilter(), ...filter })
  if (sortBy) cursor.sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
  if (skip) cursor.skip(skip)
  if (limit) cursor.limit(limit)
  const bookings = await cursor.toArray()
  return bookings.map((b) => ({ ...b, id: objectIdToString(b._id) } as MongoDoc))
}

export async function countBookings(filter: Record<string, unknown> = {}) {
  return (await getDb()).collection(COLLECTION).countDocuments({ ...softDeleteFilter(), ...filter })
}

export async function createBooking(data: Record<string, unknown>): Promise<MongoDoc> {
  const result = await (await getDb()).collection(COLLECTION).insertOne(data)
  return { id: result.insertedId.toHexString(), ...data } as MongoDoc
}

export async function updateBooking(id: string, data: Record<string, unknown>): Promise<MongoDoc | null> {
  await (await getDb()).collection(COLLECTION).updateOne(
    { _id: toObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  )
  return findBookingById(id)
}

export async function aggregateBookings(pipeline: Record<string, unknown>[]) {
  return (await getDb()).collection(COLLECTION).aggregate(pipeline).toArray()
}
