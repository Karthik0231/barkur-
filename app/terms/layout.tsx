import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Sri Kalikamba Temple",
  description:
    "Terms of Service for Sri Kalikamba Temple website. Understand the terms governing seva bookings, donations, and website usage.",
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
