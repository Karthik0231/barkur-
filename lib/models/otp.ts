import { getDb } from "@/lib/mongodb"
import { toObjectId, objectIdToString, type MongoDoc } from "./utils"

const COLLECTION = "otps"

export async function findValidOTPByToken(token: string): Promise<MongoDoc | null> {
  const record = await (await getDb()).collection(COLLECTION).findOne({
    otp: token,
    purpose: "FORGOT_PASSWORD",
    isUsed: false,
    expiresAt: { $gte: new Date() },
  })
  return record ? { ...record, id: objectIdToString(record._id) } as MongoDoc : null
}

export async function createOTP(data: Record<string, unknown>) {
  const doc = { ...data, createdAt: data.createdAt ?? new Date() }
  const result = await (await getDb()).collection(COLLECTION).insertOne(doc)
  return { id: result.insertedId.toHexString(), ...doc }
}

export async function updateOTP(id: string, data: Record<string, unknown>) {
  await (await getDb()).collection(COLLECTION).updateOne(
    { _id: toObjectId(id) },
    { $set: { ...data, updatedAt: new Date() } }
  )
  const record = await (await getDb()).collection(COLLECTION).findOne({ _id: toObjectId(id) })
  return record ? { ...record, id: objectIdToString(record._id) } : null
}
