import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Committee | Sri Kalikamba Temple",
  description:
    "Meet the temple committee, board of trustees, priests, and staff of Sri Kalikamba Temple in Barkur, Udupi.",
  openGraph: {
    title: "Temple Committee | Sri Kalikamba Temple",
    description:
      "Meet the dedicated individuals guiding Sri Kalikamba Temple's spiritual and administrative affairs.",
  },
}

export default function CommitteeLayout({ children }: { children: React.ReactNode }) {
  return children
}
