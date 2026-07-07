import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sub-Deities | Sri Kalikamba Temple",
  description:
    "Explore the various sub-deities and associated shrines at Sri Kalikamba Temple in Barkur — Ganesha, Shiva, Vishnu, Saraswati, Lakshmi, Hanuman, Navagrahas, and Bhairava.",
  openGraph: {
    title: "Sub-Deities | Sri Kalikamba Temple",
    description:
      "Explore the divine companions at Sri Kalikamba Temple — Ganesha, Shiva, Vishnu, and more.",
  },
}

export default function SubDeitiesLayout({ children }: { children: React.ReactNode }) {
  return children
}
