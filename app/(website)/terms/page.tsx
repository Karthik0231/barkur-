"use client"

import Link from "next/link"
import { ChevronRight, FileText } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { TEMPLE_NAME } from "@/lib/constants"
import { PageBanner } from "@/components/PageBanner"
import { useTranslation } from "@/lib/i18n"

export default function TermsPage() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen">
      <PageBanner 
        title={t("pages.terms.title")} 
        subtitle={t("pages.terms.subtitle")}
      />

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-8">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.terms")}</span>
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
