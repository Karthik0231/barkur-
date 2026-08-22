"use client"

import { useState, useMemo, useEffect } from "react"
import { addDays, startOfMonth, endOfMonth, isBefore } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface AvailabilityCalendarProps {
  className?: string
  onDateSelect?: (date: Date) => void
  selectedDate?: Date
  hallSlug?: string
}

export function AvailabilityCalendar({
  className,
  onDateSelect,
  selectedDate: externalSelected,
  hallSlug,
}: AvailabilityCalendarProps) {
  const [internalSelected, setInternalSelected] = useState<Date | undefined>(undefined)
  const selected = externalSelected ?? internalSelected
  const [bookedDatesFromApi, setBookedDatesFromApi] = useState<Date[]>([])

  const today = new Date()
  const minDate = today
  const maxDate = addDays(today, 180)

  // Fetch real booked dates from the public availability API
  useEffect(() => {
    async function fetchBookedDates() {
      try {
        const url = hallSlug
          ? `/api/hall-availability?hallSlug=${encodeURIComponent(hallSlug)}`
          : `/api/hall-availability`
        const res = await fetch(url)
        const json = await res.json()
        if (!json?.success) return
        const booked = json?.data?.bookedDates || []
        const dates: Date[] = []
        for (const b of booked) {
          if (b.date) dates.push(new Date(b.date))
          if (b.startTime && b.endTime) {
            const start = new Date(b.startTime)
            const end = new Date(b.endTime)
            let d = new Date(start)
            while (d <= end) {
              dates.push(new Date(d))
              d = addDays(d, 1)
            }
          }
        }
        setBookedDatesFromApi(dates)
      } catch {
        // Silently fail - calendar will show no booked dates
      }
    }
    fetchBookedDates()
  }, [hallSlug])

  const { unavailableDates, bookedDates, partiallyAvailable } = useMemo(() => {
    const unavailable: Date[] = []
    const booked: Date[] = []
    const partial: Date[] = []

    // Add real booked dates from the API — these are UNAVAILABLE (blocked)
    for (const bd of bookedDatesFromApi) {
      const dateStr = bd.toDateString()
      if (!unavailable.some(u => u.toDateString() === dateStr)) {
        unavailable.push(new Date(bd))
      }
    }

    return { unavailableDates: unavailable, bookedDates: booked, partiallyAvailable: partial }
  }, [today, bookedDatesFromApi])

  const handleSelect = (date: Date) => {
    setInternalSelected(date)
    onDateSelect?.(date)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Calendar
        selected={selected}
        onSelect={handleSelect}
        minDate={minDate}
        maxDate={maxDate}
        unavailableDates={unavailableDates}
        bookedDates={bookedDates}
        highlightDates={partiallyAvailable}
      />

      <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-bg-tertiary/30 border border-border" />
          <span className="text-xs text-text-muted">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/10 border-2 border-secondary/40" />
          <span className="text-xs text-text-muted">Partially Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-bg-tertiary/30 line-through" style={{ textDecoration: 'line-through', opacity: 0.5 }} />
          <span className="text-xs text-text-muted">Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span className="text-xs text-text-muted">Selected</span>
        </div>
      </div>

      {selected && (
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-sm font-medium text-primary">
            Selected Date: <span className="font-bold">{selected.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
          </p>
          {bookedDates.some((d) => d.toDateString() === selected.toDateString()) && (
            <p className="text-xs text-red-500 mt-1">This date is partially booked. Limited availability.</p>
          )}
        </div>
      )}

      <div className="text-xs text-text-muted">
        <p>* Bookings available up to 6 months in advance</p>
      </div>
    </div>
  )
}
