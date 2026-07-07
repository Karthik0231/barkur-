import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Timings | Sri Kalikamba Temple",
  description:
    "View Sri Kalikamba Temple timings — morning 6:00 AM-1:30 PM, evening 4:00 PM-7:30 PM. Complete daily pooja schedule, weekly schedule, and special day timings.",
  openGraph: {
    title: "Temple Timings | Sri Kalikamba Temple",
    description:
      "Plan your visit with daily pooja schedule, weekly rituals, and special day timings.",
  },
}

export default function TimingsLayout({ children }: { children: React.ReactNode }) {
  return children
}
