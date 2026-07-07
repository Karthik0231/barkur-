"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Sparkles } from "lucide-react"
import { PremiumCalendar } from "@/components/premium-calendar"
import { Card } from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n"

const sampleEvents = [
  { date: 5, type: "festival" as const, label: "Dasara" },
  { date: 12, type: "pooja" as const, label: "Abhishekam" },
  { date: 15, type: "special" as const, label: "Brahmotsava" },
  { date: 20, type: "event" as const, label: "Deepotsava" },
  { date: 25, type: "festival" as const, label: "Ugadi" },
]

export function CalendarSection() {
  const { t } = useTranslation()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  return (
    <section className="py-24 bg-gradient-to-b from-bg-primary to-gold-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-100/50 border border-gold-200/40 text-gold-700 text-xs font-medium mb-4">
            <Sparkles className="h-3 w-3" />
            Temple Calendar
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-dark-slate">
            Temple Calendar
          </h2>
          <p className="mt-3 text-base sm:text-lg text-text-muted max-w-xl">
            View festival dates and special events at Sri Kalikamba Temple
          </p>
          <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-primary to-gold-500" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PremiumCalendar
              events={sampleEvents}
              onDateSelect={setSelectedDate}
            />
          </div>
          <div className="space-y-4">
            <Card variant="premium" className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-heading font-bold text-dark-slate">Selected Date</h3>
                  <p className="text-xs text-text-muted">
                    {selectedDate
                      ? selectedDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
                      : "No date selected"}
                  </p>
                </div>
              </div>
              {selectedDate && (
                <div className="p-3 rounded-xl bg-gold-50/50 border border-gold-200/30">
                  <p className="text-xs text-gold-700 font-medium">
                    <Sparkles className="h-3 w-3 inline mr-1" />
                    Special poojas available on this date
                  </p>
                </div>
              )}
            </Card>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Legend</p>
              <div className="space-y-1.5">
                {[
                  { color: "bg-maroon-100 border-maroon-200", label: "Festival" },
                  { color: "bg-gold-100 border-gold-200", label: "Event" },
                  { color: "bg-emerald-100 border-emerald-200", label: "Pooja" },
                  { color: "bg-purple-100 border-purple-200", label: "Special" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full border ${item.color}`} />
                    <span className="text-xs text-text-secondary">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
