import { ObjectId } from "mongodb"
import { db } from "@/lib/mongodb"

/** Document type returned by model helpers – carries an `id` field and preserves all MongoDB document properties via the index signature. */
export type MongoDoc = Record<string, any> & { id: string }

export function toObjectId(id: string) {
  if (!id || typeof id !== "string") {
    throw new Error("Invalid ObjectId: expected a non-empty string")
  }
  if (!ObjectId.isValid(id)) {
    throw new Error(`Invalid ObjectId: "${id}"`)
  }
  return new ObjectId(id)
}

export function objectIdToString(id: ObjectId) {
  return id.toHexString()
}

export function softDeleteFilter() {
  return { deletedAt: { $exists: false } }
}

export function buildSort(sortBy: string, sortOrder: "asc" | "desc") {
  return { [sortBy]: sortOrder === "asc" ? 1 : -1 }
}

/** Escape special regex characters so user input is treated as a literal string. */
export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/** Build an OR filter for case-insensitive substring search across multiple fields. */
export function buildSearchFilter(search: string, fields: string[]) {
  if (!search) return {}
  const escaped = escapeRegex(search)
  return {
    $or: fields.map((field) => ({
      [field]: { $regex: escaped, $options: "i" },
    })),
  }
}

export function combineFilters(...filters: Record<string, unknown>[]) {
  return filters.reduce((acc, filter) => ({ ...acc, ...filter }), {})
}

export async function getNextSequence(collection: string, field: string): Promise<string> {
  const counter = await db.collection("counters").findOneAndUpdate(
    { _id: collection as any },
    { $inc: { [field]: 1 } },
    { upsert: true, returnDocument: "after" }
  )
  return String(counter?.value?.[field] ?? 1).padStart(6, "0")
}
