"use client"

import { useCallback, useMemo, useState } from "react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isBefore,
  isAfter,
  startOfDay,
} from "date-fns"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export interface CalendarProps {
  selected?: Date | Date[]
  onSelect?: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  unavailableDates?: Date[]
  bookedDates?: Date[]
  highlightDates?: Date[]
  className?: string
}

function toDateString(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const monthVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" as const },
  },
  exit: (dir: number) => ({
    x: dir < 0 ? 200 : -200,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" as const },
  }),
}

export function Calendar({
  selected,
  onSelect,
  minDate,
  maxDate,
  unavailableDates = [],
  bookedDates = [],
  highlightDates = [],
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [direction, setDirection] = useState(0)

  const selectedDates = useMemo(() => {
    if (!selected) return []
    return Array.isArray(selected) ? selected : [selected]
  }, [selected])

  const selectedSet = useMemo(
    () => new Set(selectedDates.map(toDateString)),
    [selectedDates],
  )

  const unavailableSet = useMemo(
    () => new Set(unavailableDates.map((d) => toDateString(startOfDay(d)))),
    [unavailableDates],
  )

  const bookedSet = useMemo(
    () => new Set(bookedDates.map((d) => toDateString(startOfDay(d)))),
    [bookedDates],
  )

  const highlightSet = useMemo(
    () => new Set(highlightDates.map((d) => toDateString(startOfDay(d)))),
    [highlightDates],
  )

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calStart = startOfWeek(monthStart)
    const calEnd = endOfWeek(monthEnd)
    return eachDayOfInterval({ start: calStart, end: calEnd })
  }, [currentMonth])

  const canGoPrev = useMemo(() => {
    if (!minDate) return true
    return !isBefore(subMonths(currentMonth, 1), startOfMonth(minDate))
  }, [currentMonth, minDate])

  const canGoNext = useMemo(() => {
    if (!maxDate) return true
    return !isAfter(addMonths(currentMonth, 1), endOfMonth(maxDate))
  }, [currentMonth, maxDate])

  const prevMonth = useCallback(() => {
    if (canGoPrev) {
      setDirection(-1)
      setCurrentMonth((m) => subMonths(m, 1))
    }
  }, [canGoPrev])

  const nextMonth = useCallback(() => {
    if (canGoNext) {
      setDirection(1)
      setCurrentMonth((m) => addMonths(m, 1))
    }
  }, [canGoNext])

  const handleDayClick = useCallback(
    (day: Date) => {
      const ds = toDateString(day)
      if (unavailableSet.has(ds) || bookedSet.has(ds)) return
      if (minDate && isBefore(day, startOfDay(minDate))) return
      if (maxDate && isAfter(day, startOfDay(maxDate))) return
      onSelect?.(day)
    },
    [onSelect, unavailableSet, bookedSet, minDate, maxDate],
  )

  return (
    <div className={cn("w-full max-w-sm select-none", className)}>
      <div className="flex items-center justify-between mb-5 px-1">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          className={cn(
            "p-2 rounded-xl transition-all duration-200",
            "hover:bg-bg-secondary hover:scale-105 active:scale-95",
            "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary",
          )}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5 text-text-primary" />
        </button>
        <div className="relative overflow-hidden h-7">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.h3
              key={currentMonth.toISOString()}
              custom={direction}
              variants={monthVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="text-base font-semibold font-heading text-text-primary absolute inset-x-0 text-center"
            >
              {format(currentMonth, "MMMM yyyy")}
            </motion.h3>
          </AnimatePresence>
        </div>
        <button
          type="button"
          onClick={nextMonth}
          disabled={!canGoNext}
          className={cn(
            "p-2 rounded-xl transition-all duration-200",
            "hover:bg-bg-secondary hover:scale-105 active:scale-95",
            "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary",
          )}
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5 text-text-primary" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-3 gap-1">
        {dayNames.map((name) => (
          <div
            key={name}
            className="text-xs font-semibold text-text-muted text-center py-1.5 tracking-wide"
          >
            {name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const ds = toDateString(day)
          const inMonth = isSameMonth(day, currentMonth)
          const isSel = selectedSet.has(ds)
          const isUnavail = unavailableSet.has(ds)
          const isBooked = bookedSet.has(ds)
          const isHigh = highlightSet.has(ds)
          const isTodayDate = isToday(day)
          const isDisabled =
            !inMonth ||
            isUnavail ||
            isBooked ||
            (minDate && isBefore(day, startOfDay(minDate))) ||
            (maxDate && isAfter(day, startOfDay(maxDate)))

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleDayClick(day)}
              disabled={isDisabled}
              className={cn(
                "relative h-10 w-full text-sm rounded-xl transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-1",
                "font-medium",
                !inMonth && "text-text-muted/20",
                inMonth &&
                  !isSel &&
                  !isDisabled &&
                  "text-text-primary hover:bg-bg-secondary hover:scale-105",
                isSel &&
                  "bg-primary text-warm-white font-semibold shadow-sm hover:bg-primary-light",
                (isUnavail || isBooked) &&
                  "text-text-muted/40 line-through cursor-not-allowed bg-bg-tertiary/30",
                isDisabled && !isUnavail && !isBooked && "text-text-muted/30 cursor-not-allowed",
                isTodayDate && !isSel && "ring-1 ring-gold-400/60",
                isHigh && !isSel && "bg-gold-50 dark:bg-gold-950/20 text-gold-700 dark:text-gold-300 font-semibold",
              )}
              aria-label={format(day, "EEEE, MMMM d, yyyy")}
              aria-pressed={isSel}
              aria-disabled={isDisabled}
              aria-current={isTodayDate ? "date" : undefined}
            >
              {format(day, "d")}
              {isTodayDate && (
                <span
                  className={cn(
                    "absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full",
                    isSel ? "bg-warm-white" : "bg-gold-500",
                  )}
                  aria-hidden="true"
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
