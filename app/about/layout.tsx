import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | Sri Kalikamba Temple",
  description:
    "Discover the sacred history and spiritual significance of Sri Kalikamba Temple in Barkur, Udupi. Learn about our mission, architecture, and divine deities.",
  openGraph: {
    title: "About Sri Kalikamba Temple | Barkur, Udupi",
    description:
      "Discover the sacred history and spiritual significance of Sri Kalikamba Temple in Barkur, Udupi.",
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
