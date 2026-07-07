import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "History | Sri Kalikamba Temple",
  description:
    "Discover the 600+ year history of Sri Kalikamba Temple in Barkur. From its 14th-century establishment by Vishwakarma Brahmins to the 1995 renovation and the founding of Vishwa Brahmana Sanskrit Vidyapeetha.",
  openGraph: {
    title: "History of Sri Kalikamba Temple | Barkur",
    description:
      "Trace the sacred journey of Sri Kalikamba Temple through six centuries of devotion, resilience, and spiritual service.",
  },
}

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return children
}
