import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Panchanga | Sri Kalikamba Temple",
  description:
    "Today's panchanga for Sri Kalikamba Temple in Barkur — tithi, nakshatra, yoga, karana, sunrise, sunset, and auspicious timings.",
  openGraph: {
    title: "Panchanga | Sri Kalikamba Temple",
    description:
      "The sacred Hindu almanac — today's tithi, nakshatra, yoga, karana, and auspicious timings.",
  },
}

export default function PanchangaLayout({ children }: { children: React.ReactNode }) {
  return children
}
