import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Announcements | Sri Kalikamba Temple",
  description:
    "Latest announcements from Sri Kalikamba Temple in Barkur — urgent notices, important updates, and general information.",
  openGraph: {
    title: "Announcements | Sri Kalikamba Temple",
    description:
      "Stay informed with the latest announcements from Sri Kalikamba Temple.",
  },
}

export default function AnnouncementsLayout({ children }: { children: React.ReactNode }) {
  return children
}
