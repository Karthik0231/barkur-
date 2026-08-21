import type { Db, IndexDescription } from "mongodb"

/**
 * Index definitions that mirror the @index / @@unique constraints from the
 * original Prisma schema. These are created lazily on first connection so
 * every filtered, sorted and paginated query can use an index instead of
 * scanning the whole collection. createIndexes() is idempotent.
 */
export const INDEXES: Record<string, IndexDescription[]> = {
  users: [
    { key: { email: 1 }, unique: true },
    { key: { role: 1 } },
    { key: { isActive: 1 } },
    { key: { deletedAt: 1 } },
  ],
  accounts: [
    { key: { provider: 1, providerAccountId: 1 }, unique: true },
    { key: { userId: 1 } },
  ],
  sessions: [
    { key: { sessionToken: 1 }, unique: true },
    { key: { userId: 1 } },
  ],
  verificationTokens: [{ key: { identifier: 1, token: 1 } }],
  permissions: [
    { key: { slug: 1 }, unique: true },
    { key: { module: 1 } },
  ],
  rolePermissions: [{ key: { role: 1 } }, { key: { permissionId: 1 } }],
  auditLogs: [
    { key: { userId: 1 } },
    { key: { action: 1 } },
    { key: { entity: 1 } },
    { key: { entityId: 1 } },
    { key: { createdAt: 1 } },
  ],
  templeSettings: [
    { key: { key: 1 }, unique: true },
    { key: { group: 1 } },
  ],
  sevas: [
    { key: { slug: 1 }, unique: true },
    { key: { isActive: 1 } },
    { key: { isSpecial: 1 } },
    { key: { sortOrder: 1 } },
    { key: { deletedAt: 1 } },
  ],
  sevaDates: [
    { key: { sevaId: 1, date: 1 }, unique: true },
    { key: { date: 1 } },
    { key: { isAvailable: 1 } },
  ],
  sevaTimeSlots: [
    { key: { sevaId: 1 } },
    { key: { dateId: 1 } },
    { key: { isAvailable: 1 } },
  ],
  devoteeDetails: [{ key: { phone: 1 } }, { key: { email: 1 } }],
  bookings: [
    { key: { bookingId: 1 }, unique: true },
    { key: { userId: 1 } },
    { key: { bookingStatus: 1 } },
    { key: { paymentStatus: 1 } },
    { key: { adminApproval: 1 } },
    { key: { deletedAt: 1 } },
    { key: { createdAt: 1 } },
  ],
  bookingItems: [
    { key: { bookingId: 1 } },
    { key: { sevaId: 1 } },
    { key: { devoteeDetailId: 1 } },
  ],
  payments: [
    { key: { razorpayOrderId: 1 }, unique: true },
    { key: { razorpayPaymentId: 1 }, unique: true },
    { key: { bookingId: 1 } },
    { key: { status: 1 } },
    { key: { paidAt: 1 } },
  ],
  paymentLogs: [{ key: { paymentId: 1 } }],
  certificates: [
    { key: { certificateNumber: 1 }, unique: true },
    { key: { bookingId: 1 } },
    { key: { type: 1 } },
  ],
  receipts: [
    { key: { receiptNumber: 1 }, unique: true },
    { key: { bookingId: 1 } },
    { key: { paymentId: 1 } },
  ],
  donationCampaigns: [
    { key: { slug: 1 }, unique: true },
    { key: { isActive: 1 } },
    { key: { category: 1 } },
    { key: { isFeatured: 1 } },
    { key: { deletedAt: 1 } },
  ],
  donations: [
    { key: { donationId: 1 }, unique: true },
    { key: { campaignId: 1 } },
    { key: { donorEmail: 1 } },
    { key: { status: 1 } },
    { key: { deletedAt: 1 } },
  ],
  halls: [
    { key: { slug: 1 }, unique: true },
    { key: { isActive: 1 } },
    { key: { deletedAt: 1 } },
  ],
  hallBookings: [
    { key: { bookingId: 1 }, unique: true },
    { key: { hallId: 1 } },
    { key: { userId: 1 } },
    { key: { bookingDate: 1 } },
    { key: { bookingStatus: 1 } },
    { key: { deletedAt: 1 } },
  ],
  hallAvailabilities: [
    { key: { hallId: 1, date: 1 }, unique: true },
    { key: { date: 1 } },
    { key: { isAvailable: 1 } },
  ],
  festivals: [
    { key: { slug: 1 }, unique: true },
    { key: { isActive: 1 } },
    { key: { category: 1 } },
    { key: { isFeatured: 1 } },
    { key: { deletedAt: 1 } },
  ],
  events: [
    { key: { festivalId: 1 } },
    { key: { date: 1 } },
    { key: { isActive: 1 } },
  ],
  blogs: [
    { key: { slug: 1 }, unique: true },
    { key: { isPublished: 1 } },
    { key: { category: 1 } },
    { key: { author: 1 } },
    { key: { deletedAt: 1 } },
    { key: { publishedAt: 1 } },
  ],
  news: [
    { key: { slug: 1 }, unique: true },
    { key: { isPublished: 1 } },
    { key: { isUrgent: 1 } },
    { key: { category: 1 } },
    { key: { deletedAt: 1 } },
    { key: { publishedAt: 1 } },
  ],
  announcements: [
    { key: { isActive: 1 } },
    { key: { type: 1 } },
    { key: { startDate: 1, endDate: 1 } },
    { key: { deletedAt: 1 } },
  ],
  gallery: [
    { key: { slug: 1 }, unique: true },
    { key: { type: 1 } },
    { key: { category: 1 } },
    { key: { isPublished: 1 } },
    { key: { sortOrder: 1 } },
    { key: { deletedAt: 1 } },
  ],
  testimonials: [
    { key: { isFeatured: 1 } },
    { key: { isApproved: 1 } },
    { key: { sortOrder: 1 } },
    { key: { deletedAt: 1 } },
  ],
  committees: [
    { key: { type: 1 } },
    { key: { isActive: 1 } },
    { key: { sortOrder: 1 } },
    { key: { deletedAt: 1 } },
  ],
  faqs: [
    { key: { category: 1 } },
    { key: { isActive: 1 } },
    { key: { sortOrder: 1 } },
    { key: { deletedAt: 1 } },
  ],
  contacts: [
    { key: { email: 1 } },
    { key: { isRead: 1 } },
    { key: { category: 1 } },
    { key: { deletedAt: 1 } },
    { key: { createdAt: 1 } },
  ],
  newsletters: [{ key: { email: 1 }, unique: true }],
  panchanga: [
    { key: { date: 1 }, unique: true },
    { key: { isEkadashi: 1 } },
    { key: { isAmavasya: 1 } },
    { key: { isPournami: 1 } },
  ],
  otps: [
    { key: { email: 1 } },
    { key: { phone: 1 } },
    { key: { otp: 1, email: 1, isUsed: 1 } },
    { key: { expiresAt: 1 } },
  ],
  feedbacks: [
    { key: { userId: 1 } },
    { key: { isResolved: 1 } },
    { key: { category: 1 } },
    { key: { deletedAt: 1 } },
  ],
  seo: [{ key: { page: 1 }, unique: true }],
  emailLogs: [
    { key: { status: 1 } },
    { key: { sentAt: 1 } },
    { key: { to: 1 } },
  ],
  notifications: [
    { key: { userId: 1 } },
    { key: { isRead: 1 } },
    { key: { type: 1 } },
    { key: { createdAt: 1 } },
  ],
  families: [{ key: { name: 1 } }, { key: { isActive: 1 } }],
  subDeities: [
    { key: { slug: 1 }, unique: true },
    { key: { isActive: 1 } },
    { key: { sortOrder: 1 } },
    { key: { deletedAt: 1 } },
  ],
  dailySchedules: [
    { key: { dayOfWeek: 1 } },
    { key: { isActive: 1 } },
    { key: { sortOrder: 1 } },
  ],
  dailyAlankara: [
    { key: { date: 1 } },
    { key: { isActive: 1 } },
    { key: { deletedAt: 1 } },
    { key: { createdBy: 1 } },
  ],
  templeStaff: [
    { key: { type: 1 } },
    { key: { isActive: 1 } },
    { key: { sortOrder: 1 } },
    { key: { deletedAt: 1 } },
  ],
  pageContents: [
    { key: { page: 1, section: 1 }, unique: true },
    { key: { page: 1 } },
    { key: { isActive: 1 } },
    { key: { sortOrder: 1 } },
  ],
  whatsappConfigs: [{ key: { isActive: 1 } }],
  shashwathaBookings: [
    { key: { bookingId: 1 }, unique: true },
    { key: { userId: 1 } },
    { key: { sevaId: 1 } },
    { key: { shashwathaType: 1 } },
    { key: { status: 1 } },
    { key: { deletedAt: 1 } },
  ],
}

let indexesCreated = false

/** Create all indexes once per process. Safe to call repeatedly. */
export async function ensureIndexes(db: Db): Promise<void> {
  if (indexesCreated) return
  indexesCreated = true

  const collections = await db.listCollections().toArray()
  const existing = new Set(collections.map((c) => c.name))

  const tasks: Promise<unknown>[] = []
  for (const [collection, indexes] of Object.entries(INDEXES)) {
    if (indexes.length === 0) continue
    if (!existing.has(collection)) {
      // Collection will be created implicitly on first write; create indexes now so
      // they exist before data is inserted.
      tasks.push(db.createCollection(collection).catch(() => undefined))
    }
    tasks.push(db.collection(collection).createIndexes(indexes))
  }

  await Promise.all(tasks)
}
