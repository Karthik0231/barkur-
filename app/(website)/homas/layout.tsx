import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Homas | Sri Kalikamba Temple",
  description: "Book sacred homas and fire rituals at Sri Kalikamba Temple, Barkur, Udupi",
}

export default function HomasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
