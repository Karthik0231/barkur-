// Mock Prisma client for now (no DB set up)
const noop = () => Promise.resolve(null)
export const prisma = {
  user: {
    findUnique: noop,
    findFirst: noop,
    findMany: noop,
    create: noop,
    update: noop,
    count: noop,
  },
  templeSetting: {
    findMany: noop,
    upsert: noop,
  },
  panchanga: {
    findUnique: noop,
    create: noop,
  },
  auditLog: {
    create: noop,
  },
} as any
