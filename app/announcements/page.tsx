"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, Bell, AlertTriangle, Info, Calendar, Megaphone } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const types = ["All", "Urgent", "Important", "General"]

const announcements = [
  { id: 1, date: "2026-07-01", title: "Temple Closed for Maintenance", message: "The temple will remain closed on July 1st for annual maintenance and cleaning. All regular rituals will be suspended for the day.", type: "Important", priority: "high" },
  { id: 2, date: "2026-06-25", title: "Sanskrit Exam Results Published", message: "The results for the annual Sanskrit Vidyapeetha examinations have been published. Students can check their results at the temple office.", type: "General", priority: "normal" },
  { id: 3, date: "2026-06-20", title: "Emergency: Water Shortage", message: "Due to the ongoing water shortage in the region, devotees are requested to use water judiciously. The temple is taking measures to ensure adequate water supply.", type: "Urgent", priority: "high" },
  { id: 4, date: "2026-06-15", title: "New Annadana Timings", message: "Effective from June 15th, the Annadana (prasada distribution) will now be served at 12:30 PM instead of 12:00 PM.", type: "Important", priority: "normal" },
  { id: 5, date: "2026-06-10", title: "Volunteers Required for Navaratri", message: "We are seeking volunteers for the upcoming Navaratri celebrations. Interested devotees can register at the temple office or online.", type: "General", priority: "normal" },
  { id: 6, date: "2026-06-05", title: "Updated COVID Protocols", message: "As per government guidelines, masks are recommended but not mandatory. Sanitizers are available at the temple entrance.", type: "Important", priority: "normal" },
  { id: 7, date: "2026-06-01", title: "Urgent: Roof Repair Work", message: "Urgent repair work on the temple roof will commence June 5th. Some areas may be cordoned off. Devotees are requested to follow safety instructions.", type: "Urgent", priority: "high" },
  { id: 8, date: "2026-05-28", title: "Monthly Committee Meeting", message: "The monthly temple committee meeting is scheduled for May 30th at 10:00 AM in the temple hall.", type: "General", priority: "normal" },
]

export default function AnnouncementsPage() {
  const [activeType, setActiveType] = useState("All")

  const filtered = activeType === "All" ? announcements : announcements.filter((a) => a.type === activeType)

  return (
    <div className="min-h-screen">
      <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/90 z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30 z-[1]" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <span className="inline-block text-secondary/80 text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-medium">
              Temple Notices
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight">
              Announcements
            </h1>
            <p className="text-warm-white/80 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
              Important notices, updates, and information from Sri Kalikamba Temple administration.
            </p>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-20" />
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-12">
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">Announcements</span>
          </div>

          <AnimatedSection>
            <SectionHeading title="Temple Announcements" subtitle="Stay informed with the latest updates from the temple administration." />
          </AnimatedSection>

          <div className="flex flex-wrap gap-3 justify-center mt-12 mb-10">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeType === type
                    ? "bg-primary text-warm-white shadow-md"
                    : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.map((item, index) => (
              <AnimatedSection key={item.id} delay={index * 0.03}>
                <Card
                  variant="elevated"
                  className={`p-6 border-l-4 ${
                    item.priority === "high" ? "border-l-red-500" : item.type === "Important" ? "border-l-amber-500" : "border-l-secondary"
                  }`}
                  hover
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      item.priority === "high" ? "bg-red-50" : item.type === "Important" ? "bg-amber-50" : "bg-primary/5"
                    }`}>
                      {item.priority === "high" ? (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      ) : item.type === "Important" ? (
                        <Info className="h-5 w-5 text-amber-600" />
                      ) : (
                        <Bell className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="text-lg font-heading font-bold text-primary">{item.title}</h3>
                        <Badge
                          variant={item.priority === "high" ? "destructive" : item.type === "Important" ? "warning" : "default"}
                          size="xs"
                        >
                          {item.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-text-muted mb-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(item.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed">{item.message}</p>
                    </div>
                  </div>
                </Card>
              </AnimatedSection>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <Megaphone className="h-12 w-12 mx-auto text-text-muted mb-3" />
                <p className="text-text-muted">No announcements found.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
