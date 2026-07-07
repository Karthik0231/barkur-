import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google"
import "./globals.css"
import { Providers } from "@/providers"
import { TopInfoBar } from "@/components/top-info-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import { WhatsAppFloat } from "@/components/whatsapp-float"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-script",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Sri Kalikamba Temple | Barkur, Udupi",
    template: "%s | Sri Kalikamba Temple",
  },
  description:
    "Discover the divine grace of Sri Kalikamba Temple in Barkur, Udupi. Book seva, puja offerings, and explore the spiritual heritage of this ancient temple.",
  keywords: [
    "Sri Kalikamba Temple",
    "Barkur",
    "Udupi",
    "Temple",
    "Seva",
    "Puja",
    "Hindu Temple",
    "Karnataka",
    "Kalikamba Devi",
    "Shakti Peetha",
  ],
  authors: [{ name: "Sri Kalikamba Temple Trust" }],
  openGraph: {
    title: "Sri Kalikamba Temple | Barkur, Udupi",
    description:
      "Discover the divine grace of Sri Kalikamba Temple in Barkur, Udupi. Book seva, puja offerings, and explore the spiritual heritage of this ancient temple.",
    type: "website",
    locale: "en_IN",
    siteName: "Sri Kalikamba Temple",
    url: "https://srikalikambatemple.org",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sri Kalikamba Temple | Barkur, Udupi",
    description:
      "Discover the divine grace of Sri Kalikamba Temple in Barkur, Udupi.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDF8F3" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="kn" dir="ltr" className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <body className="bg-warm-ivory text-dark-slate font-sans antialiased">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <TopInfoBar />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <BackToTop />
            <WhatsAppFloat />
          </div>
        </Providers>
      </body>
    </html>
  )
}
