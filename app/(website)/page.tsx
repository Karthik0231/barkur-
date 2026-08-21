import { findManyFestivals, findManyAnnouncements, findManyDailySchedules, findManyGalleries } from "@/lib/models"
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
import { TempleBulletinSection } from "@/components/sections/TempleBulletinSection"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [festivals, announcements, dailySchedules, galleryItems] = await Promise.all<any[]>([
    findManyFestivals({ isActive: true }, {
      sort: [["isFeatured", -1], ["startDate", 1]],
    }),
    findManyAnnouncements({ isActive: true }, {
      sort: [["type", 1], ["createdAt", -1]],
    }),
    findManyDailySchedules({ isActive: true }, {
      sort: [["dayOfWeek", 1], ["sortOrder", 1]],
    }),
    findManyGalleries({ isPublished: true }, {
      sort: [["isFeatured", -1], ["sortOrder", 1]],
    }),
  ])

  return (
    <main>
      <HeroSection dailySchedules={dailySchedules} />
      <QuickActionsSection />
      <PanchangaSection />
      <TempleStorySection />
      <TempleBulletinSection festivals={festivals} announcements={announcements} />
      <GallerySection galleryItems={galleryItems} />
      <VisitSection />
    </main>
  )
}
