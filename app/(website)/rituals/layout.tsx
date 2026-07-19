import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rituals | Sri Kalikamba Temple",
  description:
    "Explore the sacred rituals at Sri Kalikamba Temple — abhisheka, mangalarati, archana, homam, annadana, and more. Each with timing, description, and significance.",
  openGraph: {
    title: "Temple Rituals | Sri Kalikamba Temple",
    description:
      "Discover the rich tapestry of rituals and ceremonies at Sri Kalikamba Temple.",
  },
}

export default function RitualsLayout({ children }: { children: React.ReactNode }) {
  return children
}
