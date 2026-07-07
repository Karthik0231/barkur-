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
  instagram: "https://instagram.com/shrikalikambatemple",
} as const

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Sevas", href: "/sevas" },
  { label: "Donations", href: "/donations" },
  { label: "Gallery", href: "/gallery" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const

export const ADMIN_NAV_ITEMS = {
  dashboard: { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  bookings: {
    label: "Bookings",
    children: [
      { label: "Seva Bookings", href: "/admin/bookings/seva" },
      { label: "Hall Bookings", href: "/admin/bookings/hall" },
      { label: "Shashwatha Bookings", href: "/admin/bookings/shashwatha" },
    ],
  },
  donations: { label: "Donations", href: "/admin/donations" },
  campaigns: { label: "Campaigns", href: "/admin/campaigns" },
  content: {
    label: "Content",
    children: [
      { label: "Sevas", href: "/admin/sevas" },
      { label: "Blog", href: "/admin/blog" },
      { label: "Gallery", href: "/admin/gallery" },
      { label: "Testimonials", href: "/admin/testimonials" },
      { label: "FAQs", href: "/admin/faqs" },
    ],
  },
  temple: {
    label: "Temple",
    children: [
      { label: "Festivals", href: "/admin/festivals" },
      { label: "News", href: "/admin/news" },
      { label: "Announcements", href: "/admin/announcements" },
      { label: "Daily Schedule", href: "/admin/daily-schedule" },
      { label: "Sub Deities", href: "/admin/sub-deities" },
    ],
  },
  users: { label: "Users", href: "/admin/users" },
  staff: { label: "Staff", href: "/admin/staff" },
  committee: { label: "Committee", href: "/admin/committee" },
  pages: { label: "Pages", href: "/admin/pages" },
  categories: { label: "Categories", href: "/admin/categories" },
  settings: { label: "Settings", href: "/admin/settings" },
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
