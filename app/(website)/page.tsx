import { prisma } from "@/lib/prisma"
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

export default async function HomePage() {
  const [festivals, announcements, dailySchedules, galleryItems] = await Promise.all([
    prisma.festival.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: [{ isFeatured: "desc" }, { startDate: "asc" }],
    }),
    prisma.announcement.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: [{ type: "asc" }, { createdAt: "desc" }],
    }),
    prisma.dailySchedule.findMany({
      where: { isActive: true },
      orderBy: [{ dayOfWeek: "asc" }, { sortOrder: "asc" }],
    }),
    prisma.gallery.findMany({
      where: { isPublished: true, deletedAt: null },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
    }),
  ])

  return (
    <main>
      <HeroSection dailySchedules={dailySchedules} />
      <QuickActionsSection />
      <PanchangaSection />
      {/* <FeaturedSevasSection /> */}
      <TempleStorySection />
      <TempleBulletinSection festivals={festivals} announcements={announcements} />
      {/* <UpcomingEventsSection /> */}
      {/* <AnnouncementsSection /> */}
      {/* <DonationsSection /> */}
      <GallerySection galleryItems={galleryItems} />
      {/* <TestimonialsSection /> */}
      <VisitSection />
    </main>
  )
}
