import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "My Bookings | Sri Kalikamba Temple",
  description: "View and manage your bookings at Sri Kalikamba Temple, Barkur, Udupi",
}

export default function BookingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
