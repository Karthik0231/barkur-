import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Goddess Kalikamba | Sri Kalikamba Temple",
  description:
    "Learn about Goddess Kalikamba — the presiding deity of Sri Kalikamba Temple in Barkur. The Neelanjana granite idol in padmasana with trishula, damaru, khadga, and cup.",
  openGraph: {
    title: "Goddess Kalikamba | Presiding Deity",
    description:
      "The Divine Mother in her magnificent form — Neelanjana granite idol, four arms, camel symbol.",
  },
}

export default function DeityLayout({ children }: { children: React.ReactNode }) {
  return children
}
