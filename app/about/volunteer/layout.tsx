import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Volunteer | Sri Kalikamba Temple",
  description:
    "Volunteer at Sri Kalikamba Temple in Barkur. Help with events, educational programs, annadana, and community service.",
  openGraph: {
    title: "Volunteer | Sri Kalikamba Temple",
    description:
      "Join us in serving the divine at Sri Kalikamba Temple.",
  },
}

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return children
}
