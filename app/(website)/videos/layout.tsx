import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Videos | Sri Kalikamba Temple",
  description:
    "Watch spiritual videos from Sri Kalikamba Temple — rituals, festivals, temple tours, spiritual talks, and events.",
  openGraph: {
    title: "Videos | Sri Kalikamba Temple",
    description:
      "Experience the divine through our video collection from Sri Kalikamba Temple.",
  },
}

export default function VideosLayout({ children }: { children: React.ReactNode }) {
  return children
}
