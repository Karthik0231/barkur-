import { PrismaClient } from "../app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  try {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "postgresql://localhost:5432/postgres" })
    return new PrismaClient({ adapter } as any)
  } catch (e) {
    console.warn("PrismaClient initialization failed:", e)
    throw e
  }
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
