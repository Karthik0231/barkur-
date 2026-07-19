import { TopInfoBar } from "@/components/top-info-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BackToTop } from "@/components/back-to-top"
import { WhatsAppFloat } from "@/components/whatsapp-float"

export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopInfoBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
      <WhatsAppFloat />
    </div>
  )
}
