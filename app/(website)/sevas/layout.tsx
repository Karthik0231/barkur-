import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sevas | Sri Kalikamba Temple",
  description: "Book sacred sevas and poojas at Sri Kalikamba Temple, Barkur, Udupi",
}

export default function SevasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
