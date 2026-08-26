"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Clock,
  Star,
  CalendarDays,
  Moon,
  Sun,
  Download,
  Share2,
  Bell,
  Heart,
  Zap,
  ArrowRight,
  Check,
} from "lucide-react"

import { SectionHeading } from "@/components/section-heading"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { PageBanner } from "@/components/PageBanner"
import { calculatePanchanga } from "@/lib/panchanga"
import { useTranslation } from "@/lib/i18n"
import { TEMPLE_NAME } from "@/lib/constants"
import { cn } from "@/lib/utils"

/* ========================================================================== */
/* DATA                                                                       */
/* ========================================================================== */

const VARA_NAMES = [
  "Ravivara",
  "Somavara",
  "Mangalavara",
  "Budhavara",
  "Guruvara",
  "Shukravara",
  "Shanivara",
]

const VARA_SHORT = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

const NAKSHATRA_RASHI: Record<string, string> = {
  Ashwini: "Mesha",
  Bharani: "Mesha",
  Krittika: "Mesha",
  Rohini: "Vrishabha",
  Mrigashira: "Vrishabha",
  Ardra: "Mithuna",
  Punarvasu: "Mithuna",
  Pushya: "Karka",
  Ashlesha: "Karka",
  Magha: "Simha",
  "Purva Phalguni": "Simha",
  "Uttara Phalguni": "Simha",
  Hasta: "Kanya",
  Chitra: "Kanya",
  Swati: "Tula",
  Vishakha: "Tula",
  Anuradha: "Vrishchika",
  Jyeshtha: "Vrishchika",
  Mula: "Dhanu",
  "Purva Ashadha": "Dhanu",
  "Uttara Ashadha": "Dhanu",
  Shravana: "Makara",
  Dhanishtha: "Makara",
  Shatabhisha: "Kumbha",
  "Purva Bhadrapada": "Kumbha",
  "Uttara Bhadrapada": "Meena",
  Revati: "Meena",
}

const TITHI_NAMES_FULL = [
  "Pratipada",
  "Dwitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashthi",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dwadashi",
  "Trayodashi",
  "Chaturdashi",
  "Purnima",
  "Pratipada",
  "Dwitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashthi",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dwadashi",
  "Trayodashi",
  "Chaturdashi",
  "Amavasya",
]

/* ========================================================================== */
/* HELPERS                                                                    */
/* ========================================================================== */

function getTithiIndex(tithi: string) {
  const idx = TITHI_NAMES_FULL.indexOf(tithi)
  return idx >= 0 ? idx : 0
}

function getMoonIllumination(tithi: string) {
  const idx = getTithiIndex(tithi)

  if (idx <= 14) {
    return idx / 14
  }

  return (29 - idx) / 14
}

function getMoonPhaseName(tithi: string) {
  const idx = getTithiIndex(tithi)

  if (idx === 14) return "Purnima (Full Moon)"
  if (idx === 29) return "Amavasya (New Moon)"
  if (idx === 0 || idx === 15) return "Pratipada (Waxing Crescent)"
  if (idx === 7) return "Shukla Ashtami (First Quarter)"
  if (idx === 21) return "Krishna Ashtami (Last Quarter)"
  if (idx < 7) return "Shukla Paksha (Waxing Crescent)"
  if (idx < 14) return "Shukla Paksha (Waxing Gibbous)"
  if (idx < 21) return "Krishna Paksha (Waning Gibbous)"

  return "Krishna Paksha (Waning Crescent)"
}

function getRashi(nakshatra: string) {
  return NAKSHATRA_RASHI[nakshatra] || "—"
}

function daysUntil(dateStr: string) {
  const target = new Date(dateStr + "T00:00:00")
  const today = new Date()

  today.setHours(0, 0, 0, 0)

  return Math.round(
    (target.getTime() - today.getTime()) / 86400000
  )
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function toICSDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
}

function downloadICS(
  title: string,
  description: string,
  dateStr: string
) {
  const start = new Date(dateStr + "T00:00:00")
  const end = new Date(start.getTime() + 86400000)

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//" + TEMPLE_NAME + "//Panchanga//EN",
    "BEGIN:VEVENT",
    `UID:${slugify(title)}-${dateStr}@panchanga`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART;VALUE=DATE:${dateStr.replace(/-/g, "")}`,
    `DTEND;VALUE=DATE:${end
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "")}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")

  const blob = new Blob([ics], {
    type: "text/calendar;charset=utf-8",
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")

  a.href = url
  a.download = `${slugify(title)}.ics`

  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  URL.revokeObjectURL(url)
}

async function shareContent(
  title: string,
  text: string,
  url: string
): Promise<"shared" | "copied" | "failed"> {
  if (
    typeof navigator !== "undefined" &&
    "share" in navigator
  ) {
    try {
      await (
        navigator as Navigator & {
          share: (data: ShareData) => Promise<void>
        }
      ).share({
        title,
        text,
        url,
      })

      return "shared"
    } catch {
      // fallback
    }
  }

  try {
    await navigator.clipboard.writeText(`${text} ${url}`)
    return "copied"
  } catch {
    return "failed"
  }
}

/* ========================================================================== */
/* SKELETON                                                                    */
/* ========================================================================== */

function Skeleton({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        "shimmer-skeleton",
        className
      )}
    />
  )
}

/* ========================================================================== */
/* MOON SVG                                                                    */
/* ========================================================================== */

function MoonPhaseSVG({
  tithi,
}: {
  tithi: string
}) {
  const illumination = getMoonIllumination(tithi)
  const idx = getTithiIndex(tithi)
  const isWaxing = idx <= 14

  const clipX =
    50 -
    illumination *
    50 *
    (isWaxing ? 1 : -1)

  return (
    <svg
      viewBox="0 0 100 100"
      className="h-full w-full"
    >
      <defs>
        <radialGradient
          id="moonGlow"
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop
            offset="0%"
            stopColor="#FFF8E7"
            stopOpacity="0.35"
          />
          <stop
            offset="100%"
            stopColor="#C9A84C"
            stopOpacity="0"
          />
        </radialGradient>

        <linearGradient
          id="moonSurface"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop
            offset="0%"
            stopColor="#FFF8EA"
          />
          <stop
            offset="100%"
            stopColor="#E8DDD0"
          />
        </linearGradient>

        <linearGradient
          id="moonShadow"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop
            offset="0%"
            stopColor="#241016"
          />
          <stop
            offset="100%"
            stopColor="#5A2028"
          />
        </linearGradient>

        <clipPath id="moonClip">
          <rect
            x={isWaxing ? 0 : clipX}
            y="0"
            width={
              isWaxing
                ? clipX
                : 100 - clipX
            }
            height="100"
          />
        </clipPath>
      </defs>

      <circle
        cx="50"
        cy="50"
        r="42"
        fill="url(#moonShadow)"
        opacity="0.85"
      />

      <circle
        cx="50"
        cy="50"
        r="42"
        fill="url(#moonSurface)"
        clipPath="url(#moonClip)"
      />

      <circle
        cx="50"
        cy="50"
        r="46"
        fill="url(#moonGlow)"
      />

      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke="#C9A84C"
        strokeWidth="1.2"
        opacity="0.45"
      />
    </svg>
  )
}

/* ========================================================================== */
/* TITHI HERO                                                                 */
/* ========================================================================== */

function TithiVisual({
  tithi,
  paksha,
}: {
  tithi: string
  paksha: string
}) {
  const index = getTithiIndex(tithi)
  const illumination = getMoonIllumination(tithi)

  return (
    <div className="relative flex flex-col items-center">
      <div
        className="
          absolute
          h-52
          w-52
          rounded-full
          bg-[#DDB25C]/10
          blur-3xl
        "
      />

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.7,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="
          relative
          h-36
          w-36
          sm:h-44
          sm:w-44
        "
      >
        <div
          className="
            absolute
            -inset-3
            rounded-full
            border
            border-[#DDB25C]/10
          "
        />

        <div
          className="
            absolute
            -inset-6
            rounded-full
            border
            border-[#DDB25C]/[0.05]
          "
        />

        <MoonPhaseSVG tithi={tithi} />

        <div
          className="
            absolute
            bottom-0
            right-0
            flex
            h-9
            min-w-9
            items-center
            justify-center
            rounded-full
            border
            border-[#DDB25C]/40
            bg-[#5A0C15]
            px-2
            shadow-lg
          "
        >
          <span className="text-[10px] font-bold text-[#F6E2A0]">
            {Math.round(
              illumination * 100
            )}
            %
          </span>
        </div>
      </motion.div>

      <div className="relative mt-6 text-center">
        <p
          className="
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.22em]
            text-[#DDB25C]/70
          "
        >
          Tithi {index + 1} / 30
        </p>

        <h3
          className="
            mt-2
            font-heading
            text-2xl
            font-bold
            text-[#FFF8EA]
            sm:text-3xl
          "
        >
          {tithi}
        </h3>

        <p className="mt-1 text-xs text-[#FFF8EA]/50">
          {paksha}
        </p>
      </div>
    </div>
  )
}

/* ========================================================================== */
/* PANCHANGA DATA ITEM                                                        */
/* ========================================================================== */

function DataItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any
  label: string
  value: string
}) {
  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      className="
        group
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-[#DDB25C]/10
        bg-white/[0.025]
        p-3
        transition-all
        duration-300
        hover:border-[#DDB25C]/25
        hover:bg-[#DDB25C]/[0.045]
      "
    >
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-[#DDB25C]/15
          bg-[#DDB25C]/[0.06]
        "
      >
        <Icon className="h-4 w-4 text-[#DDB25C]" />
      </div>

      <div className="min-w-0">
        <p
          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.13em]
            text-[#FFF8EA]/40
          "
        >
          {label}
        </p>

        <p
          className="
            mt-0.5
            truncate
            text-sm
            font-semibold
            text-[#FFF8EA]/90
          "
        >
          {value}
        </p>
      </div>
    </motion.div>
  )
}

/* ========================================================================== */
/* CALENDAR                                                                    */
/* ========================================================================== */

function MonthCalendar({
  month,
  year,
  days,
  onChangeMonth,
  onDayClick,
  locale,
  t,
}: {
  month: number
  year: number
  days: {
    day: number
    tithi: string
    nakshatra: string
    isSpecial: boolean
    isEkadashi: boolean
    isAmavasya: boolean
    isPournami: boolean
  }[]
  onChangeMonth: (dir: number) => void
  onDayClick?: (date: Date) => void
  locale: string
  t: (key: string) => string
}) {
  const firstDay = new Date(
    year,
    month,
    1
  ).getDay()

  const today = new Date()

  const dayNames = Array.from(
    { length: 7 },
    (_, i) =>
      new Date(
        2024,
        0,
        i + 1
      ).toLocaleDateString(
        locale,
        {
          weekday: "long",
        }
      )
  )

  const dayNamesShort = Array.from(
    { length: 7 },
    (_, i) =>
      new Date(
        2024,
        0,
        i + 1
      ).toLocaleDateString(
        locale,
        {
          weekday: "narrow",
        }
      )
  )

  return (
    <div>
      {/* Header */}
      <div
        className="
          mb-6
          flex
          items-center
          justify-between
        "
      >
        <motion.button
          whileHover={{
            scale: 1.04,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={() =>
            onChangeMonth(-1)
          }
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-[#DDB25C]/15
            bg-[#FFF8EA]
            text-[#6B0F1A]
            shadow-sm
            transition-all
            hover:border-[#DDB25C]/50
            hover:shadow-md
          "
          aria-label={t(
            "panchanga.previousMonth"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </motion.button>

        <div className="text-center">
          <p
            className="
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#6B0F1A]/40
            "
          >
            Panchanga Calendar
          </p>

          <motion.h3
            key={`${month}-${year}`}
            initial={{
              opacity: 0,
              y: -8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              mt-1
              font-heading
              text-xl
              font-bold
              text-[#6B0F1A]
              sm:text-2xl
            "
          >
            {new Date(
              year,
              month
            ).toLocaleDateString(
              locale,
              {
                month: "long",
                year: "numeric",
              }
            )}
          </motion.h3>
        </div>

        <motion.button
          whileHover={{
            scale: 1.04,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={() =>
            onChangeMonth(1)
          }
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-[#DDB25C]/15
            bg-[#FFF8EA]
            text-[#6B0F1A]
            shadow-sm
            transition-all
            hover:border-[#DDB25C]/50
            hover:shadow-md
          "
          aria-label={t(
            "panchanga.nextMonth"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Calendar */}
      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-[#6B0F1A]/10
          bg-[#6B0F1A]/[0.025]
        "
      >
        <div className="grid grid-cols-7">
          {dayNames.map((day, i) => (
            <div
              key={day}
              className="
                border-b
                border-[#6B0F1A]/10
                bg-[#6B0F1A]/[0.035]
                px-1
                py-3
                text-center
              "
            >
              <span
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-[#6B0F1A]/45
                "
              >
                <span className="sm:hidden">
                  {dayNamesShort[i]}
                </span>

                <span className="hidden sm:inline">
                  {day}
                </span>
              </span>
            </div>
          ))}

          {Array.from({
            length: firstDay,
          }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="
                min-h-[74px]
                border-b
                border-r
                border-[#6B0F1A]/[0.06]
                bg-white/30
                sm:min-h-[105px]
              "
            />
          ))}

          <AnimatePresence mode="popLayout">
            {days.map((d) => {
              const isToday =
                today.getDate() === d.day &&
                today.getMonth() === month &&
                today.getFullYear() === year

              return (
                <motion.div
                  key={d.day}
                  layout
                  initial={{
                    opacity: 0,
                    scale: 0.94,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  onClick={() =>
                    onDayClick?.(
                      new Date(
                        year,
                        month,
                        d.day
                      )
                    )
                  }
                  className={cn(
                    `
                      group
                      relative
                      min-h-[74px]
                      cursor-pointer
                      border-b
                      border-r
                      border-[#6B0F1A]/[0.06]
                      p-2
                      transition-all
                      duration-200
                      sm:min-h-[105px]
                      sm:p-3
                    `,
                    isToday
                      ? `
                        z-10
                        bg-[#DDB25C]/[0.10]
                        shadow-[inset_0_0_0_2px_rgba(201,168,76,0.45)]
                      `
                      : `
                        bg-white/45
                        hover:bg-[#DDB25C]/[0.06]
                      `
                  )}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span
                      className={cn(
                        `
                          text-xs
                          font-bold
                          sm:text-sm
                        `,
                        isToday
                          ? "text-[#6B0F1A]"
                          : "text-[#6B0F1A]/80"
                      )}
                    >
                      {d.day}
                    </span>

                    {(d.isEkadashi ||
                      d.isAmavasya ||
                      d.isPournami) && (
                        <span
                          className={cn(
                            `
                            hidden
                            rounded-full
                            px-1.5
                            py-0.5
                            text-[6px]
                            font-bold
                            uppercase
                            tracking-wide
                            sm:inline-block
                          `,
                            d.isEkadashi &&
                            "bg-emerald-100 text-emerald-700",
                            d.isAmavasya &&
                            "bg-[#6B0F1A]/10 text-[#6B0F1A]",
                            d.isPournami &&
                            "bg-[#DDB25C]/20 text-[#8B6914]"
                          )}
                        >
                          {d.isEkadashi
                            ? "Ekadashi"
                            : d.isAmavasya
                              ? "Amavasya"
                              : "Pournami"}
                        </span>
                      )}
                  </div>

                  <div className="mt-2">
                    <p
                      className="
                        truncate
                        text-[8px]
                        font-semibold
                        leading-tight
                        text-[#6B0F1A]/65
                        sm:text-[9px]
                      "
                    >
                      {d.tithi}
                    </p>

                    <p
                      className="
                        mt-1
                        hidden
                        truncate
                        text-[8px]
                        leading-tight
                        text-[#6B0F1A]/40
                        sm:block
                      "
                    >
                      {d.nakshatra}
                    </p>
                  </div>

                  {isToday && (
                    <div
                      className="
                        absolute
                        bottom-2
                        left-2
                        h-1
                        w-1
                        rounded-full
                        bg-[#DDB25C]
                        sm:bottom-3
                        sm:left-3
                      "
                    />
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ========================================================================== */
/* FESTIVAL CARD                                                              */
/* ========================================================================== */

function FestivalCard({
  festival,
  index,
  locale,
  t,
}: {
  festival: any
  index: number
  locale: string
  t: (key: string) => string
}) {
  const dateStr = festival.startDate
    ? festival.startDate
      .toISOString()
      .split("T")[0]
    : festival.date
      ? festival.date
        .toISOString()
        .split("T")[0]
      : "2026-01-01"

  const days = daysUntil(dateStr)
  const isPast = days < 0
  const isToday = days === 0
  const isSoon =
    days > 0 && days <= 7

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 25,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-50px",
      }}
      transition={{
        delay: index * 0.06,
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        `
          group
          relative
          overflow-hidden
          rounded-[1.6rem]
          border
          border-[#DDB25C]/15
          bg-[#FFF8EA]
          shadow-[0_16px_45px_rgba(72,9,17,0.07)]
          transition-all
          duration-500
          hover:-translate-y-2
          hover:border-[#DDB25C]/35
          hover:shadow-[0_25px_60px_rgba(72,9,17,0.12)]
        `,
        isPast &&
        "opacity-55"
      )}
    >
      {/* Gold top accent */}
      <div
        className="
          h-1
          w-full
          bg-gradient-to-r
          from-[#6B0F1A]
          via-[#DDB25C]
          to-[#6B0F1A]
        "
      />

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              border
              border-[#DDB25C]/20
              bg-[#DDB25C]/[0.08]
            "
          >
            <Bell className="h-5 w-5 text-[#6B0F1A]" />
          </div>

          {isToday ? (
            <Badge
              variant="primary"
              size="sm"
              dot
            >
              {t("panchanga.today")}
            </Badge>
          ) : isSoon ? (
            <Badge
              variant="secondary"
              size="sm"
            >
              {t("panchanga.inDays").replace(
                "{days}",
                String(days)
              )}
            </Badge>
          ) : !isPast ? (
            <Badge
              variant="default"
              size="sm"
            >
              {new Date(
                dateStr
              ).toLocaleDateString(
                locale,
                {
                  day: "numeric",
                  month: "short",
                }
              )}
            </Badge>
          ) : (
            <Badge
              variant="default"
              size="sm"
            >
              {t("panchanga.past")}
            </Badge>
          )}
        </div>

        <h3
          className="
            mt-5
            font-heading
            text-lg
            font-bold
            leading-snug
            text-[#6B0F1A]
          "
        >
          {festival.name}
        </h3>

        {festival.startDate && (
          <p
            className="
              mt-1
              text-xs
              font-medium
              text-[#6B0F1A]/45
            "
          >
            {new Date(
              festival.startDate
            ).toLocaleDateString(
              locale,
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          </p>
        )}

        <p
          className="
            mt-4
            line-clamp-3
            text-sm
            leading-6
            text-[#6B0F1A]/60
          "
        >
          {festival.description ||
            festival.shortDescription ||
            ""}
        </p>

        <div
          className="
            mt-6
            flex
            items-center
            gap-2
            border-t
            border-[#6B0F1A]/10
            pt-4
          "
        >
          <Link
            href={`/sevas?event=${slugify(
              festival.name
            )}`}
            className="flex-1"
          >
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              iconRight={
                <ArrowRight className="h-3.5 w-3.5" />
              }
            >
              Book Seva
            </Button>
          </Link>

          <button
            onClick={() =>
              downloadICS(
                festival.name,
                festival.description ||
                festival.shortDescription ||
                "",
                dateStr
              )
            }
            aria-label={`Add ${festival.name} to calendar`}
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-[#6B0F1A]/10
              text-[#6B0F1A]/45
              transition-all
              hover:border-[#DDB25C]/50
              hover:text-[#6B0F1A]
            "
          >
            <CalendarDays className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}

/* ========================================================================== */
/* MAIN                                                                       */
/* ========================================================================== */

interface PanchangaData {
  tithi: string
  nakshatra: string
  nakshatraPada: number
  yoga: string
  karana: string
  masa: string
  paksha: string

  sunrise: string
  sunset: string
  moonrise: string
  moonset: string

  rahuKala: {
    start: string
    end: string
  }

  yamaganda: {
    start: string
    end: string
  }

  gulika: {
    start: string
    end: string
  }

  amritaKala: {
    start: string
    end: string
  }

  abhijitMuhurta: {
    start: string
    end: string
  }

  isEkadashi: boolean
  isAmavasya: boolean
  isPournami: boolean
}

export default function PanchangaClient({
  festivals,
}: {
  festivals: any[]
}) {
  const { t, language } =
    useTranslation()

  const locale =
    language === "kn"
      ? "kn-IN"
      : "en-IN"

  const [panchanga, setPanchanga] =
    useState<PanchangaData | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [month, setMonth] =
    useState(new Date().getMonth())

  const [year, setYear] =
    useState(new Date().getFullYear())

  const [shareStatus, setShareStatus] =
    useState<
      "idle" |
      "shared" |
      "copied" |
      "failed"
    >("idle")

  const [selectedDay, setSelectedDay] =
    useState<Date | null>(null)

  /* ---------------------------------------------------------------------- */
  /* FETCH                                                                  */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    setLoading(true)

    fetch("/api/panchanga?today=true")
      .then((r) => r.json())
      .then((d) => {
        const raw =
          d.data?.panchanga ||
          d.panchanga ||
          d

        if (raw && raw.tithi) {
          setPanchanga({
            tithi: raw.tithi,
            nakshatra: raw.nakshatra,
            nakshatraPada:
              raw.nakshatraPada ?? 0,
            yoga: raw.yoga,
            karana: raw.karana,
            masa: raw.masa || "—",
            paksha: raw.paksha || "—",
            sunrise:
              raw.sunrise || "—",
            sunset:
              raw.sunset || "—",
            moonrise:
              raw.moonrise || "—",
            moonset:
              raw.moonset || "—",
            rahuKala: {
              start: "—",
              end: "—",
            },
            yamaganda: {
              start: "—",
              end: "—",
            },
            gulika: {
              start: "—",
              end: "—",
            },
            amritaKala: {
              start: "—",
              end: "—",
            },
            abhijitMuhurta: {
              start: "—",
              end: "—",
            },
            isEkadashi:
              !!raw.isEkadashi,
            isAmavasya:
              !!raw.isAmavasya,
            isPournami:
              !!raw.isPournami,
          })
        }

        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  /* ---------------------------------------------------------------------- */
  /* SHARE STATUS                                                           */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (shareStatus === "idle") return

    const timeout = setTimeout(
      () => setShareStatus("idle"),
      2500
    )

    return () =>
      clearTimeout(timeout)
  }, [shareStatus])

  /* ---------------------------------------------------------------------- */
  /* TODAY                                                                  */
  /* ---------------------------------------------------------------------- */

  const today = new Date()

  const vara =
    VARA_NAMES[today.getDay()]

  const varaShort =
    VARA_SHORT[today.getDay()]

  /* ---------------------------------------------------------------------- */
  /* CALENDAR                                                                */
  /* ---------------------------------------------------------------------- */

  const calendarDays = useMemo(() => {
    const daysInMonth =
      new Date(
        year,
        month + 1,
        0
      ).getDate()

    return Array.from(
      {
        length: daysInMonth,
      },
      (_, i) => {
        const day = i + 1

        const date = new Date(
          year,
          month,
          day
        )

        const p =
          calculatePanchanga(date)

        return {
          day,
          tithi: p.tithi,
          nakshatra: p.nakshatra,
          isSpecial:
            p.isEkadashi ||
            p.isAmavasya ||
            p.isPournami,
          isEkadashi:
            p.isEkadashi,
          isAmavasya:
            p.isAmavasya,
          isPournami:
            p.isPournami,
        }
      }
    )
  }, [month, year])

  const handleMonthChange =
    useCallback(
      (dir: number) => {
        if (dir > 0) {
          if (month === 11) {
            setMonth(0)
            setYear(
              (y) => y + 1
            )
          } else {
            setMonth(
              (m) => m + 1
            )
          }
        } else {
          if (month === 0) {
            setMonth(11)
            setYear(
              (y) => y - 1
            )
          } else {
            setMonth(
              (m) => m - 1
            )
          }
        }
      },
      [month]
    )

  /* ---------------------------------------------------------------------- */
  /* ACTIONS                                                                */
  /* ---------------------------------------------------------------------- */

  const handleShare =
    useCallback(async () => {
      const url =
        typeof window !== "undefined"
          ? window.location.href
          : ""

      const text = panchanga
        ? `Today's Panchanga at ${TEMPLE_NAME}: ${panchanga.tithi} tithi, ${panchanga.nakshatra} nakshatra.`
        : `Today's Panchanga at ${TEMPLE_NAME}.`

      const status =
        await shareContent(
          `${TEMPLE_NAME} Panchanga`,
          text,
          url
        )

      setShareStatus(status)
    }, [panchanga])

  const selectedDayPanchanga =
    selectedDay
      ? calculatePanchanga(
        selectedDay
      )
      : null

  const handleDayClick =
    useCallback((date: Date) => {
      setSelectedDay(date)
    }, [])

  const handleAddToCalendar =
    useCallback(() => {
      if (!panchanga) return

      const dateStr =
        today
          .toISOString()
          .split("T")[0]

      const description =
        `Tithi: ${panchanga.tithi}\n` +
        `Nakshatra: ${panchanga.nakshatra}\n` +
        `Yoga: ${panchanga.yoga}\n` +
        `Karana: ${panchanga.karana}`

      downloadICS(
        `Panchanga — ${panchanga.tithi}`,
        description,
        dateStr
      )
    }, [panchanga])

  const handleDownloadPdf =
    useCallback(() => {
      if (
        typeof window !==
        "undefined"
      ) {
        window.print()
      }
    }, [])

  /* ---------------------------------------------------------------------- */
  /* DERIVED DATA                                                           */
  /* ---------------------------------------------------------------------- */

  const tithiIndex =
    panchanga
      ? getTithiIndex(
        panchanga.tithi
      )
      : 0

  const isShukla =
    panchanga?.paksha ===
    "Shukla Paksha"

  const moonIllumination =
    panchanga
      ? getMoonIllumination(
        panchanga.tithi
      )
      : 0

  const moonPhaseName =
    panchanga
      ? getMoonPhaseName(
        panchanga.tithi
      )
      : ""

  const rashi =
    panchanga
      ? getRashi(
        panchanga.nakshatra
      )
      : "—"

  const upcomingFestivals =
    useMemo(() => {
      return [...festivals].sort(
        (a, b) => {
          const aDate =
            a.startDate || a.date
              ? new Date(
                a.startDate ||
                a.date
              ).getTime()
              : 0

          const bDate =
            b.startDate || b.date
              ? new Date(
                b.startDate ||
                b.date
              ).getTime()
              : 0

          return aDate - bDate
        }
      )
    }, [festivals])

  /* ====================================================================== */
  /* UI                                                                     */
  /* ====================================================================== */

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* ================================================================ */}
      {/* PAGE HERO                                                         */}
      {/* ================================================================ */}

      <PageBanner
        title={t(
          "pages.panchanga.title"
        )}
        eyebrow={t(
          "pages.panchanga.eyebrow"
        )}
        subtitle={`${t(
          "pages.panchanga.subtitle"
        )} ${TEMPLE_NAME}.`}
      />

      {/* ================================================================ */}
      {/* BREADCRUMB + TODAY                                                */}
      {/* ================================================================ */}

      <section
        className="
          relative
          z-10
          -mt-8
          px-4
          pb-16
          sm:-mt-10
          sm:pb-20
        "
      >
        <div className="mx-auto max-w-7xl">
          <nav
            className="
              mb-8
              flex
              items-center
              gap-2
              px-1
              text-xs
              text-text-muted
            "
          >
            <Link
              href="/"
              className="transition-colors hover:text-secondary"
            >
              {t("nav.home")}
            </Link>

            <ChevronRight className="h-3.5 w-3.5" />

            <span className="font-medium text-text-primary">
              {t(
                "panchanga.title"
              )}
            </span>
          </nav>

          <AnimatedSection>
            <div
              className="
                mb-8
                flex
                flex-col
                gap-2
                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >
              <div>
                <p
                  className="
                    mb-2
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.2em]
                    text-secondary
                  "
                >
                  {t(
                    "panchanga.todaysPanchanga"
                  )}
                </p>

                <h2
                  className="
                    font-heading
                    text-2xl
                    font-bold
                    text-primary
                    sm:text-3xl
                  "
                >
                  {today.toLocaleDateString(
                    locale,
                    {
                      weekday:
                        "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </h2>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-xs
                  text-text-muted
                "
              >
                <span
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-secondary
                    shadow-[0_0_12px_rgba(201,168,76,0.5)]
                  "
                />

                {varaShort}
              </div>
            </div>
          </AnimatedSection>

          {/* ============================================================ */}
          {/* MAIN PANCHANGA PANEL                                         */}
          {/* ============================================================ */}

          <motion.div
            initial={{
              opacity: 0,
              y: 35,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              relative
              overflow-hidden
              rounded-[2rem]
              border
              border-[#DDB25C]/20
              bg-gradient-to-br
              from-[#3D080F]
              via-[#5A0C15]
              to-[#70121C]
              shadow-[0_30px_90px_rgba(72,9,17,0.22)]
            "
          >
            {/* Background architecture */}
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                opacity-40
              "
            >
              <div
                className="
                  absolute
                  -right-32
                  -top-32
                  h-96
                  w-96
                  rounded-full
                  border
                  border-[#DDB25C]/10
                "
              />

              <div
                className="
                  absolute
                  -right-20
                  -top-20
                  h-72
                  w-72
                  rounded-full
                  border
                  border-[#DDB25C]/10
                "
              />

              <div
                className="
                  absolute
                  bottom-0
                  left-1/3
                  h-px
                  w-1/2
                  bg-gradient-to-r
                  from-transparent
                  via-[#DDB25C]/10
                  to-transparent
                "
              />
            </div>

            <div
              className="
                relative
                grid
                lg:grid-cols-[300px_minmax(0,1fr)]
              "
            >
              {/* TITHI */}
              <div
                className="
                  flex
                  items-center
                  justify-center
                  border-b
                  border-[#DDB25C]/10
                  px-6
                  py-12
                  lg:border-b-0
                  lg:border-r
                  lg:px-10
                "
              >
                {loading ? (
                  <div className="space-y-4 text-center">
                    <Skeleton className="mx-auto h-36 w-36 rounded-full" />
                    <Skeleton className="mx-auto h-5 w-28 rounded-lg" />
                    <Skeleton className="mx-auto h-3 w-20 rounded-lg" />
                  </div>
                ) : panchanga ? (
                  <TithiVisual
                    tithi={panchanga.tithi}
                    paksha={panchanga.paksha}
                  />
                ) : null}
              </div>

              {/* DATA */}
              <div className="p-6 sm:p-8 lg:p-10">
                <div
                  className="
                    mb-7
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <p
                      className="
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.22em]
                        text-[#DDB25C]/65
                      "
                    >
                      {t(
                        "panchanga.panchangaDetails"
                      )}
                    </p>

                    <h3
                      className="
                        mt-1
                        font-heading
                        text-xl
                        font-bold
                        text-[#FFF8EA]
                        sm:text-2xl
                      "
                    >
                      {panchanga?.masa ||
                        "Today's Sacred Almanac"}
                    </h3>
                  </div>

                  {panchanga && (
                    <div
                      className="
                        hidden
                        rounded-full
                        border
                        border-[#DDB25C]/20
                        bg-[#DDB25C]/[0.06]
                        px-3
                        py-1.5
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-wider
                        text-[#F6E2A0]/70
                        sm:block
                      "
                    >
                      {isShukla
                        ? "Shukla Paksha"
                        : "Krishna Paksha"}
                    </div>
                  )}
                </div>

                {loading ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Array.from({
                      length: 6,
                    }).map((_, i) => (
                      <div
                        key={i}
                        className="
                          rounded-2xl
                          border
                          border-white/5
                          bg-white/[0.025]
                          p-3
                        "
                      >
                        <Skeleton className="h-9 w-full rounded-xl" />
                      </div>
                    ))}
                  </div>
                ) : panchanga ? (
                  <div
                    className="
                      grid
                      gap-3
                      sm:grid-cols-2
                    "
                  >
                    <DataItem
                      icon={Moon}
                      label={t(
                        "panchanga.tithi"
                      )}
                      value={
                        panchanga.tithi
                      }
                    />

                    <DataItem
                      icon={Star}
                      label={t(
                        "panchanga.nakshatra"
                      )}
                      value={`${panchanga.nakshatra} · Pada ${panchanga.nakshatraPada}`}
                    />

                    <DataItem
                      icon={Zap}
                      label={t(
                        "panchanga.yoga"
                      )}
                      value={
                        panchanga.yoga
                      }
                    />

                    <DataItem
                      icon={Clock}
                      label={t(
                        "panchanga.karana"
                      )}
                      value={
                        panchanga.karana
                      }
                    />

                    <DataItem
                      icon={CalendarDays}
                      label={t(
                        "panchanga.masa"
                      )}
                      value={
                        panchanga.masa
                      }
                    />

                    <DataItem
                      icon={Sun}
                      label={t(
                        "panchanga.paksha"
                      )}
                      value={
                        panchanga.paksha
                      }
                    />
                  </div>
                ) : null}

                {/* Special day */}
                {panchanga &&
                  (panchanga.isEkadashi ||
                    panchanga.isAmavasya ||
                    panchanga.isPournami) && (
                    <div
                      className="
                        mt-6
                        flex
                        flex-wrap
                        items-center
                        gap-2
                        border-t
                        border-[#DDB25C]/10
                        pt-5
                      "
                    >
                      <span
                        className="
                          mr-1
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-wider
                          text-[#FFF8EA]/35
                        "
                      >
                        Today
                      </span>

                      {panchanga.isEkadashi && (
                        <Badge
                          variant="primary"
                          size="md"
                          dot
                        >
                          Ekadashi
                        </Badge>
                      )}

                      {panchanga.isAmavasya && (
                        <Badge
                          variant="warning"
                          size="md"
                          dot
                        >
                          Amavasya
                        </Badge>
                      )}

                      {panchanga.isPournami && (
                        <Badge
                          variant="secondary"
                          size="md"
                          dot
                        >
                          Pournami
                        </Badge>
                      )}
                    </div>
                  )}
              </div>
            </div>
          </motion.div>

          {/* ============================================================ */}
          {/* CALENDAR                                                      */}
          {/* ============================================================ */}

          <section className="mt-20 sm:mt-24">
            <AnimatedSection>
              <SectionHeading
                title={t(
                  "sections.panchangaCalendarTitle"
                )}
                subtitle={t(
                  "sections.panchangaCalendarSub"
                )}
              />
            </AnimatedSection>

            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                margin: "-80px",
              }}
              transition={{
                duration: 0.7,
              }}
              className="
                mt-10
                overflow-hidden
                rounded-[2rem]
                border
                border-border/60
                bg-warm-white
                p-4
                shadow-premium
                sm:mt-12
                sm:p-7
              "
            >
              <MonthCalendar
                month={month}
                year={year}
                days={calendarDays}
                locale={locale}
                t={t}
                onDayClick={
                  handleDayClick
                }
                onChangeMonth={
                  handleMonthChange
                }
              />
            </motion.div>
          </section>

          {/* ============================================================ */}
          {/* FESTIVALS                                                     */}
          {/* ============================================================ */}

          <section className="mt-20 sm:mt-28">
            <AnimatedSection>
              <SectionHeading
                title={t(
                  "sections.panchangaFestivalsTitle"
                )}
                subtitle={t(
                  "sections.panchangaFestivalsSub"
                )}
              />
            </AnimatedSection>

            <div
              className="
                mt-10
                grid
                gap-5
                sm:grid-cols-2
                lg:grid-cols-3
                sm:mt-12
              "
            >
              {upcomingFestivals.map(
                (festival, i) => (
                  <FestivalCard
                    key={festival.id}
                    festival={festival}
                    index={i}
                    locale={locale}
                    t={t}
                  />
                )
              )}
            </div>
          </section>
        </div>
      </section>

      {/* ================================================================ */}
      {/* MOON SECTION                                                      */}
      {/* ================================================================ */}

      <section
        className="
          relative
          overflow-hidden
          bg-gradient-to-b
          from-bg-secondary/30
          to-bg-primary
          px-4
          py-20
          sm:py-28
        "
      >
        <div className="mx-auto max-w-6xl">
          <AnimatedSection>
            <SectionHeading
              title={t(
                "sections.panchangaMoonTitle"
              )}
              subtitle={t(
                "sections.panchangaMoonSub"
              )}
            />
          </AnimatedSection>

          <div
            className="
              mt-10
              grid
              gap-5
              sm:mt-12
              md:grid-cols-3
            "
          >
            {/* Moon phase */}
            <motion.div
              whileHover={{
                y: -5,
              }}
              className="
                rounded-[2rem]
                border
                border-[#DDB25C]/20
                bg-gradient-to-br
                from-[#3D080F]
                via-[#5A0C15]
                to-[#70121C]
                p-7
                text-center
                shadow-premium
              "
            >
              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-[#DDB25C]/60
                "
              >
                Moon Phase
              </p>

              <div className="mx-auto mt-6 h-36 w-36">
                {panchanga ? (
                  <MoonPhaseSVG
                    tithi={
                      panchanga.tithi
                    }
                  />
                ) : (
                  <Skeleton className="h-full w-full rounded-full" />
                )}
              </div>

              <h3
                className="
                  mt-6
                  font-heading
                  text-xl
                  font-bold
                  text-[#FFF8EA]
                "
              >
                {moonPhaseName ||
                  "—"}
              </h3>

              <p className="mt-2 text-xs text-[#FFF8EA]/45">
                {isShukla
                  ? "Waxing · Light half"
                  : "Waning · Dark half"}{" "}
                ·{" "}
                {Math.round(
                  moonIllumination *
                  100
                )}
                % illuminated
              </p>
            </motion.div>

            {/* Tithi progress */}
            <motion.div
              whileHover={{
                y: -5,
              }}
              className="
                rounded-[2rem]
                border
                border-border/60
                bg-warm-white
                p-7
                text-center
                shadow-premium
              "
            >
              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-secondary
                "
              >
                Tithi Progress
              </p>

              <div className="relative mx-auto mt-7 h-40 w-40">
                <svg
                  viewBox="0 0 100 100"
                  className="-rotate-90"
                >
                  <defs>
                    <linearGradient
                      id="panchangaGold"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        stopColor="#B78E32"
                      />
                      <stop
                        offset="50%"
                        stopColor="#DFC06A"
                      />
                      <stop
                        offset="100%"
                        stopColor="#C9A84C"
                      />
                    </linearGradient>
                  </defs>

                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#6B0F1A"
                    strokeWidth="5"
                    opacity="0.08"
                  />

                  <motion.circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="url(#panchangaGold)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="264"
                    initial={{
                      strokeDashoffset: 264,
                    }}
                    animate={{
                      strokeDashoffset:
                        264 -
                        (tithiIndex /
                          30) *
                        264,
                    }}
                    transition={{
                      duration: 1.4,
                      ease: "easeOut",
                    }}
                  />
                </svg>

                <div
                  className="
                    absolute
                    inset-0
                    flex
                    flex-col
                    items-center
                    justify-center
                  "
                >
                  <span
                    className="
                      font-heading
                      text-3xl
                      font-bold
                      text-primary
                    "
                  >
                    {tithiIndex + 1}
                  </span>

                  <span className="text-[10px] text-text-muted">
                    of 30
                  </span>
                </div>
              </div>

              <p className="mt-5 text-sm font-semibold text-text-primary">
                {panchanga?.tithi ||
                  "—"}
              </p>

              <p className="mt-1 text-xs text-text-muted">
                {panchanga?.paksha ||
                  "—"}
              </p>
            </motion.div>

            {/* Rashi */}
            <motion.div
              whileHover={{
                y: -5,
              }}
              className="
                rounded-[2rem]
                border
                border-border/60
                bg-warm-white
                p-7
                text-center
                shadow-premium
              "
            >
              <p
                className="
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-secondary
                "
              >
                Zodiac · Rashi
              </p>

              <div
                className="
                  mx-auto
                  mt-8
                  flex
                  h-32
                  w-32
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#DDB25C]/35
                  bg-gradient-to-br
                  from-[#DDB25C]/15
                  to-[#6B0F1A]/5
                "
              >
                <div>
                  <Sun className="mx-auto mb-2 h-7 w-7 text-secondary" />

                  <p
                    className="
                      font-heading
                      text-2xl
                      font-bold
                      text-primary
                    "
                  >
                    {rashi}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm text-text-secondary">
                Moon is currently in{" "}
                <span className="font-bold text-primary">
                  {rashi}
                </span>{" "}
                rashi
              </p>

              <p className="mt-2 text-xs text-text-muted">
                {t(
                  "panchanga.basedOnNakshatra"
                )}
                :{" "}
                {panchanga?.nakshatra ||
                  "—"}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* DAY DETAILS DIALOG                                               */}
      {/* ================================================================ */}

      <Dialog
        open={!!selectedDay}
        onClose={() =>
          setSelectedDay(null)
        }
        className="max-w-lg"
      >
        {selectedDayPanchanga && (
          <div className="p-6 sm:p-7">
            <div className="mb-6 text-center">
              <p className="text-xs text-text-muted">
                {selectedDay?.toLocaleDateString(
                  locale,
                  {
                    weekday:
                      "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>

              <h3
                className="
                  mt-1
                  font-heading
                  text-2xl
                  font-bold
                  text-primary
                "
              >
                {t(
                  "panchanga.panchangaDetails"
                )}
              </h3>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  label: t(
                    "panchanga.tithi"
                  ),
                  value:
                    selectedDayPanchanga.tithi,
                  icon: Moon,
                },
                {
                  label: t(
                    "panchanga.nakshatra"
                  ),
                  value: `${selectedDayPanchanga.nakshatra} (Pada ${selectedDayPanchanga.nakshatraPada})`,
                  icon: Star,
                },
                {
                  label: t(
                    "panchanga.yoga"
                  ),
                  value:
                    selectedDayPanchanga.yoga,
                  icon: Zap,
                },
                {
                  label: t(
                    "panchanga.karana"
                  ),
                  value:
                    selectedDayPanchanga.karana,
                  icon: Clock,
                },
                {
                  label: t(
                    "panchanga.masa"
                  ),
                  value:
                    selectedDayPanchanga.masa,
                  icon: CalendarDays,
                },
                {
                  label: t(
                    "panchanga.paksha"
                  ),
                  value:
                    selectedDayPanchanga.paksha,
                  icon: Sun,
                },
              ].map((item) => {
                const Icon =
                  item.icon

                return (
                  <div
                    key={item.label}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-border/50
                      bg-bg-secondary/50
                      p-3
                    "
                  >
                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-secondary/10
                      "
                    >
                      <Icon className="h-4 w-4 text-secondary" />
                    </div>

                    <div>
                      <p
                        className="
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-wider
                          text-text-muted
                        "
                      >
                        {item.label}
                      </p>

                      <p className="text-sm font-bold text-text-primary">
                        {item.value}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {selectedDayPanchanga.isEkadashi && (
                <Badge
                  variant="primary"
                  size="md"
                  dot
                >
                  Ekadashi
                </Badge>
              )}

              {selectedDayPanchanga.isAmavasya && (
                <Badge
                  variant="warning"
                  size="md"
                  dot
                >
                  Amavasya
                </Badge>
              )}

              {selectedDayPanchanga.isPournami && (
                <Badge
                  variant="secondary"
                  size="md"
                  dot
                >
                  Pournami
                </Badge>
              )}
            </div>
          </div>
        )}
      </Dialog>

      {/* ================================================================ */}
      {/* FLOATING ACTION BAR                                               */}
      {/* ================================================================ */}

      <div className="sticky bottom-4 z-50 px-4 print:hidden sm:bottom-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.8,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mx-auto max-w-4xl"
        >
          <div
            className="
              flex
              flex-wrap
              items-center
              justify-center
              gap-1.5
              rounded-2xl
              border
              border-[#DDB25C]/25
              bg-[#FFF8EA]/90
              p-2
              shadow-[0_20px_60px_rgba(72,9,17,0.18)]
              backdrop-blur-xl
              sm:gap-2
              sm:p-2.5
            "
          >
            <Link
              href="/sevas?event=today"
              className="shrink-0"
            >
              <Button
                variant="primary"
                size="sm"
              >
                <Heart className="mr-1.5 h-4 w-4" />

                <span className="hidden sm:inline">
                  {t(
                    "panchanga.bookTodaysSeva"
                  )}
                </span>

                <span className="sm:hidden">
                  {t(
                    "panchanga.bookSeva"
                  )}
                </span>
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="shrink-0"
              onClick={
                handleDownloadPdf
              }
            >
              <Download className="mr-1.5 h-4 w-4" />

              <span className="hidden sm:inline">
                {t(
                  "panchanga.downloadPdf"
                )}
              </span>

              <span className="sm:hidden">
                {t(
                  "panchanga.pdf"
                )}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="shrink-0"
              onClick={
                handleShare
              }
            >
              {shareStatus ===
                "shared" ||
                shareStatus ===
                "copied" ? (
                <Check className="mr-1.5 h-4 w-4" />
              ) : (
                <Share2 className="mr-1.5 h-4 w-4" />
              )}

              {shareStatus ===
                "shared"
                ? t(
                  "panchanga.shared"
                )
                : shareStatus ===
                  "copied"
                  ? t(
                    "panchanga.linkCopied"
                  )
                  : t(
                    "panchanga.share"
                  )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="shrink-0"
              onClick={
                handleAddToCalendar
              }
            >
              <CalendarDays className="mr-1.5 h-4 w-4" />

              <span className="hidden sm:inline">
                {t(
                  "panchanga.addToCalendar"
                )}
              </span>

              <span className="sm:hidden">
                {t(
                  "panchanga.calendar"
                )}
              </span>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}