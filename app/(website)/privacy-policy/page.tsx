"use client"

import Link from "next/link"
import { ChevronRight, Shield } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { TEMPLE_NAME } from "@/lib/constants"
import { PageBanner } from "@/components/PageBanner"
import { useTranslation } from "@/lib/i18n"

export default function PrivacyPolicyPage() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen">
      <PageBanner 
        title={t("pages.privacyPolicy.title")} 
        subtitle={t("pages.privacyPolicy.subtitle")}
      />

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-8">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.privacyPolicy")}</span>
          </div>

          <Card variant="elevated" className="p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-6 w-6 text-secondary" />
              <p className="text-sm text-text-muted">Last updated: July 1, 2026</p>
            </div>

            <div className="prose prose-sm max-w-none text-text-secondary space-y-6">
              <p>
                {TEMPLE_NAME} (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>

              <h3 className="text-lg font-heading font-bold text-primary">Information We Collect</h3>
              <p>
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Book a seva or pooja</li>
                <li>Make a donation</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us through our forms</li>
                <li>Register for events or volunteer programs</li>
              </ul>
              <p>
                This information may include your name, email address, phone number, postal address, and payment information.
              </p>

              <h3 className="text-lg font-heading font-bold text-primary">How We Use Your Information</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>To process your seva bookings and donations</li>
                <li>To communicate with you about your requests</li>
                <li>To send you updates about temple events and activities</li>
                <li>To improve our website and services</li>
                <li>To comply with legal obligations</li>
              </ul>

              <h3 className="text-lg font-heading font-bold text-primary">Information Sharing</h3>
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and conducting our activities, subject to confidentiality agreements.
              </p>

              <h3 className="text-lg font-heading font-bold text-primary">Data Security</h3>
              <p>
                We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
              </p>

              <h3 className="text-lg font-heading font-bold text-primary">Cookies</h3>
              <p>
                Our website may use cookies to enhance your browsing experience. You can choose to disable cookies in your browser settings, though this may affect certain features of the website.
              </p>

              <h3 className="text-lg font-heading font-bold text-primary">Your Rights</h3>
              <p>
                You have the right to access, update, or delete your personal information. You may also opt out of receiving communications from us at any time by contacting us.
              </p>

              <h3 className="text-lg font-heading font-bold text-primary">Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy, please contact us at our temple address or email.
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
