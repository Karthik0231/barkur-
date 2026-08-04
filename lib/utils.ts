import bcrypt from "bcryptjs"

export function cn(...inputs: unknown[]) {
  return inputs.filter((x) => typeof x === "string" && x.length > 0).join(" ")
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

export function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date)
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function generateBookingId(type: string, count: number) {
  const year = new Date().getFullYear()
  const padded = String(count).padStart(4, "0")
  return `${type.toUpperCase()}-${year}-${padded}`
}

const receiptCounter = { value: 1000 }
export function generateReceiptNumber() {
  const year = new Date().getFullYear()
  receiptCounter.value++
  return `RCP-${year}-${String(receiptCounter.value).padStart(5, "0")}`
}

const certCounter = { value: 1000 }
export function generateCertificateNumber() {
  const year = new Date().getFullYear()
  certCounter.value++
  return `CERT-${year}-${String(certCounter.value).padStart(5, "0")}`
}

export function generateOTP() {
  const array = new Uint32Array(1)
  crypto.getRandomValues(array)
  return String((array[0] % 900000) + 100000)
}

export function calculateAge(dob: Date) {
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }
  return age
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str
  return str.slice(0, length).trimEnd() + "..."
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
) {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

export async function encryptPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function absoluteUrl(path: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  return `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`
}
