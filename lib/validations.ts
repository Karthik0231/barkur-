import { z } from "zod"

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be under 100 characters"),
  email: z.email("Please enter a valid email address"),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, "Please enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password must be under 128 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address"),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password must be under 128 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be under 100 characters"),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, "Please enter a valid phone number"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits").optional(),
})

const bookingItemSchema = z.object({
  sevaId: z.string().min(1, "Seva is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(100, "Quantity cannot exceed 100"),
  devoteeName: z.string().min(2, "Devotee name must be at least 2 characters").max(200).optional(),
  gotra: z.string().optional(),
  nakshatra: z.string().optional(),
  rashi: z.string().optional(),
  specialInstructions: z.string().max(2000, "Special instructions must be under 2000 characters").optional(),
  unitPrice: z.number().positive("Unit price must be greater than zero"),
})

export const sevaBookingSchema = z.union([
  z.object({
    items: z.array(bookingItemSchema).min(1, "At least one seva item is required"),
    phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, "Please enter a valid phone number"),
    email: z.email("Please enter a valid email address"),
    address: z.string().min(5, "Address must be at least 5 characters").max(500),
    state: z.string().min(2, "State is required"),
    district: z.string().min(2, "District is required"),
    pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
    preferredDate: z.string().min(1, "Preferred date is required"),
    preferredTime: z.string().optional(),
    remarks: z.string().max(1000, "Remarks must be under 1000 characters").optional(),
  }),
  z.object({
    sevaId: z.string().min(1, "Seva is required"),
    devoteeName: z.string().min(2, "Devotee name must be at least 2 characters").max(200),
    gotra: z.string().optional(),
    nakshatra: z.string().optional(),
    rashi: z.string().optional(),
    phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, "Please enter a valid phone number"),
    email: z.email("Please enter a valid email address"),
    address: z.string().min(5, "Address must be at least 5 characters").max(500),
    state: z.string().min(2, "State is required"),
    district: z.string().min(2, "District is required"),
    pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
    quantity: z.number().int().min(1, "Quantity must be at least 1").max(100, "Quantity cannot exceed 100"),
    preferredDate: z.string().min(1, "Preferred date is required"),
    preferredTime: z.string().optional(),
    remarks: z.string().max(1000, "Remarks must be under 1000 characters").optional(),
    specialInstructions: z.string().max(2000, "Special instructions must be under 2000 characters").optional(),
    familyMembers: z.array(z.object({
      name: z.string().min(1, "Name is required"),
      relation: z.string().min(1, "Relation is required"),
      age: z.number().int().positive().optional(),
    })).optional(),
  }),
])

export type BookingItemInput = z.input<typeof bookingItemSchema>

export const shashwathaBookingSchema = z.object({
  type: z.enum(["NITYA_POOJA", "NAVARATRI", "SONARATHI"] as const),
  devoteeName: z.string().min(2, "Devotee name must be at least 2 characters").max(200),
  gotra: z.string().optional(),
  nakshatra: z.string().optional(),
  rashi: z.string().optional(),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, "Please enter a valid phone number"),
  email: z.email("Please enter a valid email address"),
  address: z.string().min(5, "Address must be at least 5 characters").max(500),
  state: z.string().min(2, "State is required"),
  district: z.string().min(2, "District is required"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  remarks: z.string().max(1000).optional(),
  numberOfYears: z.number().int().min(1).max(100).optional(),
})

export const donationSchema = z.object({
  amount: z.number().positive("Amount must be greater than zero"),
  category: z.string().min(1, "Category is required"),
  campaignId: z.string().optional(),
  donorName: z.string().min(2, "Name must be at least 2 characters").max(200),
  email: z.email("Please enter a valid email address"),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, "Please enter a valid phone number"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits").optional().or(z.literal("")),
  message: z.string().max(1000, "Message must be under 1000 characters").optional(),
  isAnonymous: z.boolean().optional(),
  panCard: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN card format").optional().or(z.literal("")),
  paymentMethod: z.enum(["UPI", "BANK_TRANSFER", "OTHER"]).optional(),
  transactionReference: z.string().optional(),
})

export const hallBookingSchema = z.object({
  hallName: z.string().min(1, "Hall name is required"),
  eventType: z.string().min(1, "Event type is required"),
  eventDate: z.string().min(1, "Event date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  organizerName: z.string().min(2, "Organizer name must be at least 2 characters").max(200),
  organizerPhone: z.string().regex(/^\+?[\d\s-]{10,15}$/, "Please enter a valid phone number"),
  organizerEmail: z.email("Please enter a valid email address"),
  address: z.string().min(5, "Address must be at least 5 characters").max(500),
  expectedGuests: z.number().int().positive("Expected guests must be a positive number"),
  remarks: z.string().max(1000).optional(),
}).refine(
  (data) => {
    if (!data.startTime || !data.endTime) return true
    return data.startTime < data.endTime
  },
  { message: "End time must be after start time", path: ["endTime"] }
)

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.email("Please enter a valid email address"),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, "Please enter a valid phone number").optional(),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  category: z.string().optional(),
})

export const newsletterSchema = z.object({
  email: z.email("Please enter a valid email address"),
})

export const testimonialSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.email("Please enter a valid email address"),
  content: z.string().min(10, "Testimonial must be at least 10 characters").max(2000),
  rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  isApproved: z.boolean().optional(),
})

export const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z.string().max(300, "Excerpt must be under 300 characters").optional(),
  coverImage: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
  publishedAt: z.string().optional(),
  authorId: z.string().min(1, "Author is required"),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
})

export const gallerySchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(200),
  description: z.string().max(1000).optional(),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  isFeatured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  uploadedById: z.string().min(1, "Uploader is required"),
})

export const committeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  designation: z.string().min(2, "Designation must be at least 2 characters").max(100),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, "Please enter a valid phone number"),
  email: z.email("Please enter a valid email address").optional(),
  address: z.string().max(500).optional(),
  photoUrl: z.string().optional(),
  termStart: z.string().min(1, "Term start date is required"),
  termEnd: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

export const faqSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters").max(500),
  answer: z.string().min(10, "Answer must be at least 10 characters").max(5000),
  category: z.string().min(1, "Category is required"),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

export const campaignSchema = z.object({
  name: z.string().min(5, "Title must be at least 5 characters").max(200),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().min(20, "Description must be at least 20 characters").max(5000),
  shortDescription: z.string().max(300).optional(),
  goalAmount: z.coerce.number().positive("Goal amount must be greater than zero"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  banner: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
}).refine(
  (data) => {
    if (!data.startDate || !data.endDate) return true
    return new Date(data.startDate) <= new Date(data.endDate)
  },
  { message: "End date must be after start date", path: ["endDate"] }
)

export const sevaSchema = z.object({
  name: z.string().min(2, "Seva name must be at least 2 characters").max(200),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().min(20, "Description must be at least 20 characters").max(5000),
  shortDescription: z.string().max(300).optional(),
  price: z.coerce.number().positive("Price must be greater than zero"),
  originalPrice: z.coerce.number().optional(),
  duration: z.coerce.number().int().positive().optional(),
  maxDevotees: z.coerce.number().int().positive().optional(),
  minDevotees: z.coerce.number().int().positive().optional(),
  bookingNotice: z.coerce.number().int().min(0).optional(),
  requiresApproval: z.boolean().optional(),
  isActive: z.boolean().optional(),
  isSpecial: z.boolean().optional(),
  isShashwatha: z.boolean().optional(),
  images: z.array(z.object({
    id: z.string().optional(),
    url: z.string(),
    alt: z.string().optional(),
    isFeatured: z.boolean().optional(),
  })).optional(),
  bookingRules: z.string().max(2000).optional(),
  availabilityDates: z.array(z.object({
    date: z.string(),
    isAvailable: z.boolean().optional(),
    maxBookings: z.number().int().optional(),
  })).optional(),
  sortOrder: z.coerce.number().int().optional(),
})

export const settingSchema = z.object({
  key: z.string().min(1, "Setting key is required").max(100),
  value: z.union([z.string(), z.number(), z.boolean(), z.record(z.string(), z.unknown())]),
  description: z.string().max(500).optional(),
  group: z.string().max(50).optional(),
})

export const pageContentSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(200),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  isPublished: z.boolean().optional(),
  template: z.string().optional(),
  featuredImage: z.string().optional(),
})

export const festivalSchema = z.object({
  name: z.string().min(2, "Festival name must be at least 2 characters").max(200),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().min(20, "Description must be at least 20 characters").max(5000),
  shortDescription: z.string().max(300).optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  significance: z.string().max(2000).optional(),
  rituals: z.string().max(3000).optional(),
  specialSevas: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
}).refine(
  (data) => {
    if (!data.startDate || !data.endDate) return true
    return new Date(data.startDate) <= new Date(data.endDate)
  },
  { message: "End date must be after start date", path: ["endDate"] }
)

export const announcementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  content: z.string().min(10, "Content must be at least 10 characters").max(2000),
  type: z.enum(["INFO", "WARNING", "URGENT", "EVENT"] as const).optional(),
  isActive: z.boolean().optional(),
  isPopup: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  link: z.string().optional(),
  linkText: z.string().optional(),
})

export const newsSchema = z.object({
  title: z.string().min(5).max(200),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  content: z.string().min(50),
  excerpt: z.string().max(300).optional(),
  coverImage: z.string().optional(),
  category: z.string().optional(),
  isPublished: z.boolean().optional(),
  isBreaking: z.boolean().optional(),
  publishedAt: z.string().optional(),
  authorId: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export const staffSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  role: z.string().max(100).optional(),
  designation: z.string().min(2, "Designation must be at least 2 characters").max(100),
  type: z.string().optional(),
  biography: z.string().max(2000).optional(),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, "Please enter a valid phone number"),
  email: z.email("Please enter a valid email address").optional().or(z.literal("")),
  photoUrl: z.string().optional(),
  joinedAt: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

export const dailyScheduleSchema = z.object({
  dayOfWeek: z.number().int().min(0, "Day must be between 0 and 6").max(6, "Day must be between 0 and 6"),
  title: z.string().min(2, "Title must be at least 2 characters").max(200),
  description: z.string().max(500).optional(),
  startTime: z.string().min(1, "Start time is required").regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
  endTime: z.string().min(1, "End time is required").regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
  location: z.string().max(200).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
}).refine(
  (data) => {
    if (!data.startTime || !data.endTime) return true
    return data.startTime < data.endTime
  },
  { message: "End time must be after start time", path: ["endTime"] }
)

export const subDeitySchema = z.object({
  name: z.string().min(2, "Deity name must be at least 2 characters").max(200),
  sanskritName: z.string().optional(),
  description: z.string().min(20, "Description must be at least 20 characters").max(3000),
  significance: z.string().max(2000).optional(),
  history: z.string().max(3000).optional(),
  imageUrl: z.string().optional(),
  templeLocation: z.string().max(200).optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.email("Please enter a valid email address"),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, "Please enter a valid phone number").optional().or(z.literal("")),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "TEMPLE_MANAGER", "ACCOUNTANT", "RECEPTION", "DEVOTEE"]).optional(),
  isActive: z.boolean().optional(),
})

export const hallSchema = z.object({
  name: z.string().min(2, "Hall name must be at least 2 characters").max(200),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().min(20, "Description must be at least 20 characters").max(5000),
  shortDescription: z.string().max(300).optional(),
  capacity: z.number().int().positive("Capacity must be a positive number"),
  pricePerHour: z.coerce.number().positive("Price per hour must be greater than zero"),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.object({
    id: z.string().optional(),
    url: z.string(),
    alt: z.string().optional(),
    isFeatured: z.boolean().optional(),
  })).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
})

export const paymentSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  method: z.enum(["RAZORPAY", "UPI", "BANK_TRANSFER", "CASH", "OTHER"] as const),
  status: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"] as const).optional(),
  transactionId: z.string().optional(),
  razorpayPaymentId: z.string().optional(),
  razorpayOrderId: z.string().optional(),
  receiptUrl: z.string().optional(),
  notes: z.string().max(1000).optional(),
})

export const certificateSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  certificateNumber: z.string().min(1, "Certificate number is required"),
  type: z.enum(["SEVA", "DONATION", "SHASHWATHA"] as const),
  template: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export const receiptSchema = z.object({
  donationId: z.string().optional(),
  bookingId: z.string().optional(),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  transactionReference: z.string().optional(),
  notes: z.string().max(1000).optional(),
})

export type LoginInput = z.input<typeof loginSchema>
export type RegisterInput = z.input<typeof registerSchema>
export type ForgotPasswordInput = z.input<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.input<typeof resetPasswordSchema>
export type ProfileInput = z.input<typeof profileSchema>
export type SevaBookingInput = z.input<typeof sevaBookingSchema>
export type ShashwathaBookingInput = z.input<typeof shashwathaBookingSchema>
export type DonationInput = z.input<typeof donationSchema>
export type HallBookingInput = z.input<typeof hallBookingSchema>
export type ContactInput = z.input<typeof contactSchema>
export type NewsletterInput = z.input<typeof newsletterSchema>
export type TestimonialInput = z.input<typeof testimonialSchema>
export type BlogInput = z.input<typeof blogSchema>
export type GalleryInput = z.input<typeof gallerySchema>
export type CommitteeInput = z.input<typeof committeeSchema>
export type FaqInput = z.input<typeof faqSchema>
export type CampaignInput = z.input<typeof campaignSchema>
export type SevaInput = z.input<typeof sevaSchema>
export type SettingInput = z.input<typeof settingSchema>
export type PageContentInput = z.input<typeof pageContentSchema>
export type FestivalInput = z.input<typeof festivalSchema>
export type AnnouncementInput = z.input<typeof announcementSchema>
export type NewsInput = z.input<typeof newsSchema>
export type StaffInput = z.input<typeof staffSchema>
export type DailyScheduleInput = z.input<typeof dailyScheduleSchema>
export type SubDeityInput = z.input<typeof subDeitySchema>
export type UserInput = z.input<typeof userSchema>
export type HallInput = z.input<typeof hallSchema>
export type PaymentInput = z.input<typeof paymentSchema>
export type CertificateInput = z.input<typeof certificateSchema>
export type ReceiptInput = z.input<typeof receiptSchema>
