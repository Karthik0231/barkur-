import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Special Sevas | Sri Kalikamba Temple",
  description: "Book special sevas and offerings at Sri Kalikamba Temple, Barkur, Udupi",
}

export default function SpecialSevasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
