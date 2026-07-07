"use client"

import { useState, useMemo } from "react"
import { Calendar } from "@/components/ui/calendar"
import { motion } from "framer-motion"
import { Clock, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarSelectorProps {
  selected?: Date
  onSelect: (date: Date) => void
  unavailableDates?: Date[]
  bookedDates?: Date[]
  minDate?: Date
  maxDate?: Date
  showTimeSlots?: boolean
  selectedTime?: string
  onTimeSelect?: (time: string) => void
  timeSlots?: { id: string; label: string; available: boolean }[]
}

const defaultTimeSlots = [
  { id: "6-7", label: "6:00 AM - 7:00 AM", available: true },
  { id: "7-8", label: "7:00 AM - 8:00 AM", available: true },
  { id: "8-9", label: "8:00 AM - 9:00 AM", available: false },
  { id: "9-10", label: "9:00 AM - 10:00 AM", available: true },
  { id: "10-11", label: "10:00 AM - 11:00 AM", available: true },
  { id: "11-12", label: "11:00 AM - 12:00 PM", available: false },
  { id: "4-5", label: "4:00 PM - 5:00 PM", available: true },
  { id: "5-6", label: "5:00 PM - 6:00 PM", available: true },
  { id: "6-7", label: "6:00 PM - 7:00 PM", available: false },
]

export function CalendarSelector({
  selected,
  onSelect,
  unavailableDates = [],
  bookedDates = [],
  minDate,
  maxDate,
  showTimeSlots = false,
  selectedTime,
  onTimeSelect,
  timeSlots = defaultTimeSlots,
}: CalendarSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(selected)

  const handleSelect = (date: Date) => {
    setSelectedDate(date)
    onSelect(date)
  }

  const availableSlots = useMemo(
    () => timeSlots.filter((s) => s.available),
    [timeSlots],
  )

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-text-primary">Select Date</span>
        </div>
        <Calendar
          selected={selectedDate}
          onSelect={handleSelect}
          minDate={minDate}
          maxDate={maxDate}
          unavailableDates={unavailableDates}
          bookedDates={bookedDates}
        />
        {selectedDate && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm text-text-secondary"
          >
            Selected:{" "}
            <span className="font-semibold text-primary">
              {selectedDate.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </motion.p>
        )}
      </div>

      {showTimeSlots && selectedDate && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-text-primary">Select Time Slot</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => slot.available && onTimeSelect?.(slot.id)}
                disabled={!slot.available}
                className={cn(
                  "p-2.5 rounded-xl text-xs font-medium transition-all border",
                  selectedTime === slot.id
                    ? "border-primary bg-primary text-warm-white shadow-sm"
                    : slot.available
                    ? "border-border bg-warm-white dark:bg-bg-secondary text-text-primary hover:border-secondary"
                    : "border-border/50 bg-bg-tertiary/30 text-text-muted/50 cursor-not-allowed line-through",
                )}
              >
                {slot.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-text-muted mt-2">
            {availableSlots.length} slots available on this date
          </p>
        </motion.div>
      )}
    </div>
  )
}
