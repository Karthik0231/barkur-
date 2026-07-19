import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "FAQ | Sri Kalikamba Temple",
  description:
    "Frequently asked questions about Sri Kalikamba Temple — visiting timings, sevas, donations, festivals, dress code, and more.",
  openGraph: {
    title: "FAQ | Sri Kalikamba Temple",
    description:
      "Find answers to commonly asked questions about Sri Kalikamba Temple.",
  },
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children
}
