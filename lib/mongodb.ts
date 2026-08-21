import { MongoClient, Db } from "mongodb"
import { ensureIndexes } from "./db-indexes"

const uri = process.env.DATABASE_URL || process.env.MONGODB_URI
if (!uri) {
  throw new Error("DATABASE_URL or MONGODB_URI environment variable is not set")
}

function dbNameFromUri(fallback: string): string {
  if (!uri) return fallback
  try {
    const name = new URL(uri).pathname.replace(/^\//, "").split("?")[0]
    if (name) return name
  } catch {
    // ignore
  }
  return process.env.MONGODB_DB || fallback
}

const dbName = dbNameFromUri("barkurweb")

const client = new MongoClient(uri, {
  maxPoolSize: 20,
  minPoolSize: 5,
  maxIdleTimeMS: 60_000,
  serverSelectionTimeoutMS: 10_000,
})

let dbInstance: Db | null = null
let connectPromise: Promise<Db> | null = null

function initDb(): Promise<Db> {
  return client
    .connect()
    .then((c) => c.db(dbName))
    .then(async (database) => {
      await ensureIndexes(database).catch((err) => {
        // Index creation must never block the app from starting.
        console.error("Failed to create MongoDB indexes:", err)
      })
      return database
    })
}

/** Returns a cached, connected Db instance (reuses the connection across requests). */
export function getDb(): Promise<Db> {
  if (dbInstance) return Promise.resolve(dbInstance)
  if (!connectPromise) {
    connectPromise = initDb()
      .then((db) => {
        dbInstance = db
        return db
      })
      .catch((err) => {
        connectPromise = null // Allow retry on next call
        throw err
      })
  }
  return connectPromise
}

/**
 * Connect to the database and ensure indexes exist. Safe to call multiple times;
 * subsequent calls reuse the same underlying connection. Call once at startup
 * (e.g. from instrumentation) so `db` is ready before any request is served.
 */
export async function connectToDatabase(): Promise<Db> {
  return getDb()
}

/**
 * Synchronous `db` handle used by the existing models. Uses a Proxy so that
 * importing this module never triggers a connection (which would break
 * `next build`). The real connection is established by `instrumentation.ts`
 * calling `connectToDatabase()` before any request handler runs.
 */
export const db: Db = new Proxy({} as Db, {
  get(_target, prop, _receiver) {
    if (dbInstance) return Reflect.get(dbInstance, prop, _receiver)
    throw new Error(
      "Database not connected yet. " +
      "Ensure connectToDatabase() is called at startup (e.g. in instrumentation.ts).",
    )
  },
}) as Db
