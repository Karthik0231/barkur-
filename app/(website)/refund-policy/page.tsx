"use client"

import Link from "next/link"
import { ChevronRight, RotateCcw } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TEMPLE_NAME } from "@/lib/constants"
import { useTranslation } from "@/lib/i18n"

export default function RefundPolicyPage() {
  const { t } = useTranslation()
  return (
    <div className="min-h-screen">
      <section className="relative h-[40vh] min-h-[280px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/90 z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30 z-[1]" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-warm-white leading-tight">Refund Policy</h1>
            <p className="text-warm-white/80 text-lg mt-4 max-w-2xl mx-auto">
              Our policy on refunds and cancellations for seva bookings and donations.
            </p>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-20" />
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-8">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.refund")}</span>
          </div>

          <Card variant="elevated" className="p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-6">
              <RotateCcw className="h-6 w-6 text-secondary" />
              <p className="text-sm text-text-muted">Last updated: July 1, 2026</p>
            </div>

            <div className="prose prose-sm max-w-none text-text-secondary space-y-6">
              <p>
                At {TEMPLE_NAME}, we strive to provide the best spiritual services to our devotees. This Refund Policy outlines the terms for refunds and cancellations related to seva bookings and donations.
              </p>

              <h3 className="text-lg font-heading font-bold text-primary">Seva Bookings</h3>

              <h4 className="font-heading font-bold text-primary">Cancellation by Devotee</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Cancellation 48+ hours before scheduled seva:</strong> Full refund minus a nominal processing fee of 5% or ₹50, whichever is lower.
                </li>
                <li>
                  <strong>Cancellation between 24-48 hours before scheduled seva:</strong> 50% refund of the booking amount.
                </li>
                <li>
                  <strong>Cancellation less than 24 hours before scheduled seva:</strong> No refund will be provided.
                </li>
                <li>
                  <strong>No-show:</strong> No refund will be provided for devotees who do not attend the scheduled seva without prior notice.
                </li>
              </ul>

              <h4 className="font-heading font-bold text-primary">Cancellation by Temple</h4>
              <p>
                In the rare event that the temple needs to cancel a seva due to unforeseen circumstances, a full refund will be provided to the devotee. We will make every effort to reschedule the booking to a mutually convenient date.
              </p>

              <h3 className="text-lg font-heading font-bold text-primary">Donations</h3>
              <p>
                Donations made to {TEMPLE_NAME} are voluntary and generally non-refundable. However, in the case of:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Duplicate payment:</strong> Full refund will be processed upon verification.</li>
                <li><strong>Incorrect amount:</strong> The difference will be refunded.</li>
                <li><strong>Technical error:</strong> Full refund will be processed if a donation was made due to a technical error on our website.</li>
              </ul>

              <h3 className="text-lg font-heading font-bold text-primary">Refund Processing</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Refund requests must be submitted in writing to the temple office or via email.</li>
                <li>Refunds will be processed within 7-10 business days from the date of approval.</li>
                <li>Refunds will be made to the original payment method used during booking.</li>
                <li>Processing fees charged by payment gateways are non-refundable.</li>
              </ul>

              <h3 className="text-lg font-heading font-bold text-primary">How to Request a Refund</h3>
              <p>
                To request a refund, please contact us with your booking details:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Visit the temple office in person</li>
                <li>Email us with your booking reference number</li>
                <li>Call us during temple office hours</li>
              </ul>
              <p>
                Please include your name, booking reference number, date of booking, and reason for cancellation in your request.
              </p>

              <h3 className="text-lg font-heading font-bold text-primary">Contact</h3>
              <p>
                For any questions regarding this Refund Policy, please contact the temple administration.
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
