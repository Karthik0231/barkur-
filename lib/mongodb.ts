import { MongoClient, Db } from "mongodb"
import { ensureIndexes } from "./db-indexes"

const uri = process.env.DATABASE_URL || process.env.MONGODB_URI

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

let client: MongoClient | null = null

function getClient(): MongoClient {
  if (!uri) {
    throw new Error("DATABASE_URL or MONGODB_URI environment variable is not set")
  }
  if (!client) {
    client = new MongoClient(uri, {
      maxPoolSize: 20,
      minPoolSize: 5,
      maxIdleTimeMS: 60_000,
      serverSelectionTimeoutMS: 10_000,
    })
  }
  return client
}

let dbInstance: Db | null = null
let connectPromise: Promise<Db> | null = null

function initDb(): Promise<Db> {
  return getClient()
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
        console.log("✅ MongoDB connected successfully")
        return db
      })
      .catch((err) => {
        connectPromise = null // Allow retry on next call
        console.error("❌ MongoDB connection failed:", err.message)
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
 * Eagerly start the database connection when this module is first imported
 * at runtime (not during `next build`). This ensures the connection is
 * in-progress before any request handler or server component accesses `db`.
 */
if (process.env.NEXT_RUNTIME !== "build") {
  getDb().catch(() => {
    // Connection failure is logged inside getDb(); we swallow here so the
    // module import never crashes. Queries will fail gracefully via the
    // db Proxy until the connection succeeds on retry.
  })
}

/**
 * Synchronous `db` handle used by the existing models. Uses a Proxy so that
 * importing this module never triggers a connection (which would break
 * `next build`). At runtime the eager connection above starts immediately;
 * the Proxy auto-triggers a connection attempt on first access as a safety net.
 */
export const db: Db = new Proxy({} as Db, {
  get(_target, prop, _receiver) {
    if (dbInstance) return Reflect.get(dbInstance, prop, _receiver)

    // Auto-trigger connection on first access if not already in progress
    if (!connectPromise) {
      getDb().catch(() => {})
    }

    throw new Error(
      "Database not connected yet. " +
      "Ensure connectToDatabase() is called at startup (e.g. in instrumentation.ts).",
    )
  },
}) as Db
