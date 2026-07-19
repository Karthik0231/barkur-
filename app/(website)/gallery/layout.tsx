import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gallery | Sri Kalikamba Temple",
  description:
    "Browse the photo gallery of Sri Kalikamba Temple in Barkur — temple architecture, poojas, festivals, events, and spiritual moments.",
  openGraph: {
    title: "Gallery | Sri Kalikamba Temple",
    description:
      "Explore the visual journey of Sri Kalikamba Temple through photos.",
  },
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children
}
