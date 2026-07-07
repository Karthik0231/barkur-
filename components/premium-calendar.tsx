"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarEvent {
  date: number
  type: "festival" | "event" | "pooja" | "special"
  label: string
}

interface PremiumCalendarProps {
  events?: CalendarEvent[]
  onDateSelect?: (date: Date) => void
  className?: string
  bookedDates?: number[]
  unavailableDates?: number[]
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const eventStyles = {
  festival: "bg-maroon-100 text-maroon-700 border-maroon-200",
  event: "bg-gold-100 text-gold-800 border-gold-200",
  pooja: "bg-emerald-100 text-emerald-700 border-emerald-200",
  special: "bg-purple-100 text-purple-700 border-purple-200",
}

export function PremiumCalendar({
  events = [],
  onDateSelect,
  className,
  bookedDates = [],
  unavailableDates = [],
}: PremiumCalendarProps) {
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState<number | null>(null)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const handleDateClick = (day: number) => {
    if (unavailableDates.includes(day)) return
    setSelectedDate(day)
    onDateSelect?.(new Date(year, month, day))
  }

  const getEventsForDay = (day: number) => events.filter((e) => e.date === day)

  return (
    <div className={cn("bg-warm-white rounded-2xl border border-border shadow-premium overflow-hidden", className)}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
        <button onClick={prevMonth} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-bg-secondary transition-all text-text-muted hover:text-primary">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="text-lg font-heading font-bold text-text-primary">
          {monthNames[month]} {year}
        </h3>
        <button onClick={nextMonth} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-bg-secondary transition-all text-text-muted hover:text-primary">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 mb-2">
          {dayNames.map((d) => (
            <div key={d} className="text-center text-[11px] font-semibold text-text-muted uppercase tracking-wider py-2">{d}</div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${month}-${year}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-7 gap-1"
          >
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
              const isSelected = day === selectedDate
              const isUnavailable = unavailableDates.includes(day)
              const isBooked = bookedDates.includes(day)
              const dayEvents = getEventsForDay(day)

              return (
                <motion.button
                  key={day}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDateClick(day)}
                  disabled={isUnavailable}
                  className={cn(
                    "relative min-h-[56px] sm:min-h-[64px] rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200",
                    isSelected && "bg-primary text-warm-white shadow-lg shadow-primary/20",
                    !isSelected && isToday && "bg-gold-50 border border-gold-200 text-primary",
                    !isSelected && !isToday && "hover:bg-bg-secondary text-text-primary",
                    isUnavailable && "opacity-30 cursor-not-allowed",
                    isBooked && !isSelected && "bg-maroon-50/50",
                  )}
                >
                  <span className={cn(
                    "text-sm font-semibold leading-none",
                    isSelected && "text-warm-white",
                    isToday && !isSelected && "text-primary",
                  )}>
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5">
                      {dayEvents.slice(0, 2).map((e, i) => (
                        <span key={i} className={cn("w-1.5 h-1.5 rounded-full border", eventStyles[e.type])} />
                      ))}
                    </div>
                  )}
                  {isBooked && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-maroon-400" />
                  )}
                </motion.button>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
