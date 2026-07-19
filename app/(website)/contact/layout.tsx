import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact | Sri Kalikamba Temple",
  description:
    "Contact Sri Kalikamba Temple in Barkur, Udupi. Reach us by phone, email, or visit in person. Address, timings, and contact form available.",
  openGraph: {
    title: "Contact Sri Kalikamba Temple | Barkur",
    description:
      "Get in touch with Sri Kalikamba Temple. We would love to hear from you.",
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
