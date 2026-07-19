import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "News | Sri Kalikamba Temple",
  description:
    "Latest news and updates from Sri Kalikamba Temple in Barkur — festivals, events, announcements, and community activities.",
  openGraph: {
    title: "News | Sri Kalikamba Temple",
    description:
      "Stay informed about the latest happenings at Sri Kalikamba Temple.",
  },
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children
}
