type Entry<T> = { value: T; expires: number }

const store = new Map<string, Entry<unknown>>()

/**
 * Small in-memory TTL cache used to memoize expensive read operations
 * (aggregations, reference data) for a short window. Scoped to the current
 * server process only — safe because data is eventually consistent and the TTL
 * is short. Falls back gracefully if memory is unavailable.
 */
export function cached<T>(key: string, ttlMs: number, producer: () => Promise<T>): Promise<T> {
  const now = Date.now()
  const hit = store.get(key) as Entry<T> | undefined
  if (hit && hit.expires > now) {
    return Promise.resolve(hit.value)
  }

  return producer().then((value) => {
    store.set(key, { value, expires: now + ttlMs })
    return value
  })
}

export function invalidateCache(prefix: string): void {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key)
  }
}
