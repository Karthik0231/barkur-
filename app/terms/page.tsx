"use client"

import Link from "next/link"
import { ChevronRight, FileText } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { TEMPLE_NAME } from "@/lib/constants"

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <section className="relative h-[40vh] min-h-[280px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/90 z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30 z-[1]" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-warm-white leading-tight">Terms of Service</h1>
            <p className="text-warm-white/80 text-lg mt-4 max-w-2xl mx-auto">
              Terms and conditions governing the use of our website and services.
            </p>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-20" />
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-8">
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">Terms of Service</span>
          </div>

          <Card variant="elevated" className="p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-6 w-6 text-secondary" />
              <p className="text-sm text-text-muted">Last updated: July 1, 2026</p>
            </div>

            <div className="prose prose-sm max-w-none text-text-secondary space-y-6">
              <p>
                Please read these Terms of Service carefully before using the {TEMPLE_NAME} website and services.
              </p>

              <h3 className="text-lg font-heading font-bold text-primary">Acceptance of Terms</h3>
              <p>
                By accessing or using our website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.
              </p>

              <h3 className="text-lg font-heading font-bold text-primary">Seva Bookings</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Seva bookings are subject to availability and temple schedule.</li>
                <li>Payment must be completed to confirm your booking.</li>
                <li>The temple reserves the right to reschedule or cancel bookings due to unforeseen circumstances.</li>
                <li>Cancellation and refund policies apply as specified in our Refund Policy.</li>
              </ul>

              <h3 className="text-lg font-heading font-bold text-primary">Donations</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>All donations are voluntary and non-refundable.</li>
                <li>Donations are used for temple development, maintenance, and charitable activities.</li>
                <li>Tax exemption certificates under Section 80G will be provided for eligible donations.</li>
              </ul>

              <h3 className="text-lg font-heading font-bold text-primary">User Conduct</h3>
              <p>
                You agree to use our website only for lawful purposes. You must not:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Use the website in any way that violates applicable laws</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Submit false or misleading information</li>
                <li>Interfere with the proper functioning of the website</li>
              </ul>

              <h3 className="text-lg font-heading font-bold text-primary">Intellectual Property</h3>
              <p>
                All content on this website, including text, images, logos, and design, is the property of {TEMPLE_NAME} and is protected by copyright laws. Unauthorized use is prohibited.
              </p>

              <h3 className="text-lg font-heading font-bold text-primary">Limitation of Liability</h3>
              <p>
                {TEMPLE_NAME} shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our website or services.
              </p>

              <h3 className="text-lg font-heading font-bold text-primary">Changes to Terms</h3>
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the website constitutes acceptance of the updated terms.
              </p>

              <h3 className="text-lg font-heading font-bold text-primary">Contact</h3>
              <p>
                For questions about these Terms of Service, please contact the temple administration.
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
