import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Architecture | Sri Kalikamba Temple",
  description:
    "Explore the unique architecture of Sri Kalikamba Temple — sloping terracotta-tiled roofs, Kerala-Tulunadu style, Neelanjana granite idol, and the distinctive absence of gopurams.",
  openGraph: {
    title: "Architecture of Sri Kalikamba Temple | Barkur",
    description:
      "Discover the unique Kerala-Tulunadu architectural style of Sri Kalikamba Temple in Barkur.",
  },
}

export default function ArchitectureLayout({ children }: { children: React.ReactNode }) {
  return children
}
