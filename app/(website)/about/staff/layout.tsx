import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Staff | Sri Kalikamba Temple",
  description:
    "View the staff directory of Sri Kalikamba Temple in Barkur — priests, administration, maintenance, and support staff.",
  openGraph: {
    title: "Temple Staff | Sri Kalikamba Temple",
    description:
      "Meet the dedicated staff serving at Sri Kalikamba Temple.",
  },
}

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return children
}
