import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shashwatha Sevas | Sri Kalikamba Temple",
  description: "Book Shashwatha (perpetual) sevas at Sri Kalikamba Temple, Barkur, Udupi",
}

export default function ShashwathaSevasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
