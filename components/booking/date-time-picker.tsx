"use client"

import { useState, useMemo, useCallback } from "react"
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
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"

import { useTranslation } from "@/lib/i18n"

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export interface DateTimePickerProps {
  selectedDate?: Date
  onSelectDate: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  unavailableDates?: Date[]
  quantity: number
  onQuantityChange: (qty: number) => void
  price: number
  className?: string
}

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export function DateTimePicker({
  selectedDate,
  onSelectDate,
  minDate,
  maxDate,
  unavailableDates = [],
  quantity,
  onQuantityChange,
  price,
  className,
}: DateTimePickerProps) {
  const { t } = useTranslation()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [direction, setDirection] = useState(0)

  const unavailableSet = useMemo(
    () => new Set(unavailableDates.map((d) => toDateKey(startOfDay(d)))),
    [unavailableDates],
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
    if (canGoPrev) { setDirection(-1); setCurrentMonth((m) => subMonths(m, 1)) }
  }, [canGoPrev])

  const nextMonth = useCallback(() => {
    if (canGoNext) { setDirection(1); setCurrentMonth((m) => addMonths(m, 1)) }
  }, [canGoNext])

  const handleDayClick = useCallback(
    (day: Date) => {
      const key = toDateKey(day)
      if (unavailableSet.has(key)) return
      if (minDate && isBefore(day, startOfDay(minDate))) return
      if (maxDate && isAfter(day, startOfDay(maxDate))) return
      onSelectDate(day)
    },
    [onSelectDate, unavailableSet, minDate, maxDate],
  )

  const selectedKey = selectedDate ? toDateKey(selectedDate) : null

  return (
    <div className={cn("space-y-6", className)}>
      {/* Calendar */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h3 className="text-base font-heading font-bold text-text-primary">{t("booking.selectDate")}</h3>
        </div>

        <div className="bg-warm-white rounded-2xl border border-gold-200/20 shadow-premium p-5">
          <div className="flex items-center justify-between mb-5">
            <button
              type="button"
              onClick={prevMonth}
              disabled={!canGoPrev}
              className="p-1.5 rounded-xl text-text-muted hover:text-primary hover:bg-bg-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="relative overflow-hidden h-7">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.span
                  key={currentMonth.toISOString()}
                  custom={direction}
                  initial={{ x: direction > 0 ? 40 : -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: direction > 0 ? -40 : 40, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-base font-semibold font-heading text-text-primary absolute inset-x-0 text-center"
                >
                  {format(currentMonth, "MMMM yyyy")}
                </motion.span>
              </AnimatePresence>
            </div>
            <button
              type="button"
              onClick={nextMonth}
              disabled={!canGoNext}
              className="p-1.5 rounded-xl text-text-muted hover:text-primary hover:bg-bg-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-3 gap-1">
            {dayLabels.map((name) => (
              <div key={name} className="text-[11px] font-semibold text-text-muted text-center py-1 uppercase tracking-wider">
                {name}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, idx) => {
              const key = toDateKey(day)
              const inMonth = isSameMonth(day, currentMonth)
              const isSel = selectedKey === key
              const isUnavail = unavailableSet.has(key)
              const isTodayDate = isToday(day)
              const disabled = !inMonth || isUnavail ||
                (minDate && isBefore(day, startOfDay(minDate))) ||
                (maxDate && isAfter(day, startOfDay(maxDate)))

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  disabled={disabled}
                  className={cn(
                    "relative h-11 w-full text-sm rounded-xl transition-all duration-150 font-medium",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-1",
                    !inMonth && "text-text-muted/20",
                    inMonth && !isSel && !disabled && "text-text-primary hover:bg-bg-secondary hover:scale-105",
                    isSel && "bg-gradient-to-br from-primary to-primary-light text-warm-white font-semibold shadow-md shadow-primary/20",
                    isUnavail && "text-text-muted/30 line-through cursor-not-allowed bg-bg-tertiary/30",
                    disabled && !isUnavail && "text-text-muted/30 cursor-not-allowed",
                    isTodayDate && !isSel && "ring-2 ring-gold-400/50",
                  )}
                  aria-label={format(day, "EEEE, MMMM d, yyyy")}
                  aria-pressed={isSel}
                >
                  {format(day, "d")}
                  {isTodayDate && (
                    <span className={cn(
                      "absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full",
                      isSel ? "bg-warm-white" : "bg-gold-500",
                    )} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {selectedDate && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm text-text-secondary text-center"
          >
            {t("booking.selected")}: {" "}
            <span className="font-semibold text-primary">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </span>
          </motion.p>
        )}
      </div>

      {/* Quantity - shows after date selected */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base font-heading font-bold text-text-primary">{t("booking.quantity")}</span>
          </div>
          <div className="flex items-center gap-4 bg-warm-white rounded-xl border border-gold-200/20 shadow-premium p-4">
            <button
              type="button"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-9 h-9 rounded-lg border-2 border-border text-text-primary font-bold hover:border-primary hover:text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
            >
              -
            </button>
            <span className="text-2xl font-bold font-heading text-text-primary w-8 text-center tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(quantity + 1)}
              className="w-9 h-9 rounded-lg border-2 border-border text-text-primary font-bold hover:border-primary hover:text-primary transition-all flex items-center justify-center"
            >
              +
            </button>
            <span className="text-sm text-text-muted ml-auto">
              &times; ₹{price.toLocaleString("en-IN")} = <span className="font-semibold text-primary">₹{(price * quantity).toLocaleString("en-IN")}</span>
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
