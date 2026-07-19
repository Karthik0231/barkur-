export const TEMPLE_NAME = "Sri Kalikamba Temple"
export const TEMPLE_LOCATION = "Barkur, Udupi District, Karnataka, India"
export const TEMPLE_PHONE = "+91 77952 92377"
export const TEMPLE_EMAIL = "info@kalikambatemple.org"
export const TEMPLE_ADDRESS = "Near Kalchappra, Barkurpete, Moodahadu, Karnataka"
export const TEMPLE_TIMINGS = {
  morning: "6:00 AM - 1:30 PM",
  evening: "4:00 PM - 7:30 PM",
} as const

export const SOCIAL_LINKS = {
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/shrikalikambatemple",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
} as const

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Sevas", href: "/sevas" },
  { label: "Donate", href: "/donate" },
  { label: "Gallery", href: "/gallery" },
  { label: "Festivals", href: "/festivals" },
  { label: "Contact", href: "/contact" },
] as const

export const ADMIN_NAV_ITEMS = {
  dashboard: { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  bookings: { label: "All Bookings", href: "/admin/bookings" },
  hallBooking: { label: "Hall Booking", href: "/admin/hall-booking" },
  shashwatha: { label: "Shashwatha", href: "/admin/shashwatha" },
  categories: { label: "Categories", href: "/admin/categories" },
  sevas: { label: "Sevas", href: "/admin/sevas" },
  donations: { label: "Donations", href: "/admin/donations" },
  campaigns: { label: "Campaigns", href: "/admin/donations/campaigns" },
  donationReports: { label: "Reports", href: "/admin/donations/reports" },
  dailySchedule: { label: "Daily Schedule", href: "/admin/daily-schedule" },
  festivals: { label: "Festivals", href: "/admin/festivals" },
  subDeities: { label: "Sub Deities", href: "/admin/sub-deities" },
  gallery: { label: "Gallery", href: "/admin/gallery" },
  news: { label: "News", href: "/admin/news" },
  announcements: { label: "Announcements", href: "/admin/announcements" },
  faq: { label: "FAQ", href: "/admin/faq" },
  testimonials: { label: "Testimonials", href: "/admin/testimonials" },
  contact: { label: "Contact", href: "/admin/contact" },
  committee: { label: "Committee", href: "/admin/committee" },
  staff: { label: "Staff", href: "/admin/staff" },
  priests: { label: "Priests", href: "/admin/staff/priests" },
  pages: { label: "Pages", href: "/admin/pages" },
  users: { label: "Users", href: "/admin/users" },
  settings: { label: "Settings", href: "/admin/settings" },
  auditLogs: { label: "Audit Logs", href: "/admin/audit-logs" },
} as const

export const BOOKING_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
  REFUNDED: "REFUNDED",
} as const

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const

export const USER_ROLES = {
  USER: "USER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
  STAFF: "STAFF",
} as const

export const SEVA_TYPES = {
  NITYA_POOJA: "NITYA_POOJA",
  VISESH_POOJA: "VISESH_POOJA",
  SATSUNG: "SATSUNG",
  ABHISHEKAM: "ABHISHEKAM",
  ARCHANA: "ARCHANA",
  HOMAM: "HOMAM",
  OTHER: "OTHER",
} as const

export const DONATION_CATEGORIES = [
  { value: "GENERAL", label: "General Donation" },
  { value: "TEMPLE_DEVELOPMENT", label: "Temple Development" },
  { value: "ANNADANA", label: "Annadana (Food Offering)" },
  { value: "VIDYA", label: "Vidya (Education)" },
  { value: "VAIDYA", label: "Vaidya (Health)" },
  { value: "GOU_SEVA", label: "Gou Seva (Cow Service)" },
  { value: "OTHER", label: "Other" },
] as const

export const GALLERY_CATEGORIES = [
  { value: "TEMPLE", label: "Temple" },
  { value: "FESTIVAL", label: "Festivals" },
  { value: "EVENT", label: "Events" },
  { value: "POOJA", label: "Pooja" },
  { value: "OTHER", label: "Other" },
] as const

export const COLORS = {
  deepMaroon: "#7B1A2C",
  templeGold: "#D4A843",
  sandalwood: "#C4A882",
  warmWhite: "#FDF8F0",
  darkSlate: "#2D2D2D",
} as const

export type BookingStatus = keyof typeof BOOKING_STATUS
export type PaymentStatus = keyof typeof PAYMENT_STATUS
export type UserRole = keyof typeof USER_ROLES
export type SevaType = keyof typeof SEVA_TYPES
