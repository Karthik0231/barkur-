"use client"

import { HeroSection } from "@/components/sections/hero-section"
import { QuickActionsSection } from "@/components/sections/quick-actions-section"
import { PanchangaSection } from "@/components/sections/panchanga-section"
import { FeaturedSevasSection } from "@/components/sections/featured-sevas-section"
import { TempleStorySection } from "@/components/sections/temple-story-section"
import { UpcomingEventsSection } from "@/components/sections/upcoming-events-section"
import { AnnouncementsSection } from "@/components/sections/announcements-section"
import { DonationsSection } from "@/components/sections/donations-section"
import { GallerySection } from "@/components/sections/gallery-section"
import { TestimonialsSection } from "@/components/sections/testimonials-section"
import { VisitSection } from "@/components/sections/visit-section"

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <QuickActionsSection />
      <PanchangaSection />
      <FeaturedSevasSection />
      <TempleStorySection />
      <UpcomingEventsSection />
      <AnnouncementsSection />
      <DonationsSection />
      <GallerySection />
      <TestimonialsSection />
      <VisitSection />
    </main>
  )
}
