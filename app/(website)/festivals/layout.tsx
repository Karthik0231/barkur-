import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Festivals | Sri Kalikamba Temple",
  description:
    "Explore festivals celebrated at Sri Kalikamba Temple — Navaratri, Deepavali, Yugadi, Maha Shivaratri, Ganesha Chaturthi, and more.",
  openGraph: {
    title: "Festivals | Sri Kalikamba Temple",
    description:
      "Discover the vibrant festivals celebrated at Sri Kalikamba Temple throughout the year.",
  },
}

export default function FestivalsLayout({ children }: { children: React.ReactNode }) {
  return children
}
