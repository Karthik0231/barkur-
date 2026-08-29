"use client"

import { Select } from "@/components/ui/select"
import { rashiOptions, nakshatraOptions } from "@/lib/nakshatra-data"
import { useTranslation } from "@/lib/i18n"
import { User, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

export interface DevoteeEntry {
  name: string
  gotra: string
  nakshatra: string
  rashi: string
}

export interface DevoteeListGroup {
  sevaId: string
  sevaName: string
  quantity: number
  devotees: DevoteeEntry[]
}

interface DevoteeListFormProps {
  groups: DevoteeListGroup[]
  onChange: (groups: DevoteeListGroup[]) => void
  /** If true, only show per-person fields (name/gotra/rashi/nakshatra), not contact */
  compact?: boolean
}

function emptyDevotee(): DevoteeEntry {
  return { name: "", gotra: "", nakshatra: "", rashi: "" }
}

function PersonCard({
  person,
  index,
  total,
  label,
  onChange,
  t,
}: {
  person: DevoteeEntry
  index: number
  total: number
  label: string
  onChange: (field: keyof DevoteeEntry, value: string) => void
  t: (key: string) => string
}) {
  return (
    <div className="p-3 rounded-xl bg-bg-secondary/50 border border-border/30 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
          {index + 1}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-text-primary truncate">
            {label} {t("booking.person")} {index + 1}
          </p>
          {person.name && (
            <p className="text-[10px] text-text-muted truncate">{person.name}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">
            {t("booking.fullName")} *
          </label>
          <input
            type="text"
            value={person.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder={t("booking.fullNamePlaceholder")}
            className="w-full rounded-lg border border-border bg-warm-white px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary/20 focus-visible:outline-none transition-all"
          />
        </div>
        <div>
          <label className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">
            {t("booking.gotra")}
          </label>
          <input
            type="text"
            value={person.gotra}
            onChange={(e) => onChange("gotra", e.target.value)}
            placeholder={t("booking.gotraPlaceholder")}
            className="w-full rounded-lg border border-border bg-warm-white px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary/20 focus-visible:outline-none transition-all"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Select
          options={nakshatraOptions}
          value={person.nakshatra}
          onChange={(e) => onChange("nakshatra", e.target.value)}
          placeholder={t("booking.selectNakshatra")}
        />
        <Select
          options={rashiOptions}
          value={person.rashi}
          onChange={(e) => onChange("rashi", e.target.value)}
          placeholder={t("booking.selectRashi")}
        />
      </div>
    </div>
  )
}

export function DevoteeListForm({ groups, onChange, compact = false }: DevoteeListFormProps) {
  const { t } = useTranslation()
  const [collapsedSevas, setCollapsedSevas] = useState<Record<string, boolean>>({})

  const totalPersons = groups.reduce((s, g) => s + g.devotees.length, 0)
  const filledCount = groups.reduce(
    (s, g) => s + g.devotees.filter((d) => d.name.trim().length > 0).length,
    0
  )

  const updateDevotee = (sevaId: string, personIndex: number, field: keyof DevoteeEntry, value: string) => {
    const newGroups = groups.map((g) => {
      if (g.sevaId !== sevaId) return g
      const newDevotees = [...g.devotees]
      newDevotees[personIndex] = { ...newDevotees[personIndex], [field]: value }
      return { ...g, devotees: newDevotees }
    })
    onChange(newGroups)
  }

  const toggleCollapse = (sevaId: string) => {
    setCollapsedSevas((prev) => ({ ...prev, [sevaId]: !prev[sevaId] }))
  }

  if (groups.length === 0) return null

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <p className="text-sm font-semibold text-text-primary">
            {t("booking.personDetails")}
          </p>
        </div>
        <span className={cn(
          "text-xs font-medium px-2 py-0.5 rounded-full",
          filledCount === totalPersons
            ? "bg-emerald-100 text-emerald-700"
            : "bg-amber-100 text-amber-700"
        )}>
          {filledCount}/{totalPersons} {t("booking.filled")}
        </span>
      </div>

      {groups.map((group) => {
        const isCollapsed = collapsedSevas[group.sevaId] || false
        const groupFilled = group.devotees.filter((d) => d.name.trim().length > 0).length

        return (
          <div key={group.sevaId} className="rounded-xl border border-border/50 overflow-hidden">
            {/* Seva header */}
            <button
              type="button"
              onClick={() => toggleCollapse(group.sevaId)}
              className="w-full flex items-center justify-between px-4 py-3 bg-bg-secondary/80 hover:bg-bg-secondary transition-colors text-left"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-primary truncate">
                  {group.sevaName}
                </p>
                <p className="text-[10px] text-text-muted">
                  {group.quantity} {t("booking.persons")} · {groupFilled}/{group.quantity} {t("booking.filled")}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {groupFilled === group.quantity ? (
                  <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    ✓ {t("booking.complete")}
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    {group.quantity - groupFilled} {t("booking.pending")}
                  </span>
                )}
                {isCollapsed ? (
                  <ChevronDown className="h-4 w-4 text-text-muted" />
                ) : (
                  <ChevronUp className="h-4 w-4 text-text-muted" />
                )}
              </div>
            </button>

            {/* Person cards */}
            {!isCollapsed && (
              <div className="p-3 space-y-2">
                {group.devotees.map((person, idx) => (
                  <PersonCard
                    key={idx}
                    person={person}
                    index={idx}
                    total={group.devotees.length}
                    label={group.sevaName}
                    onChange={(field, value) => updateDevotee(group.sevaId, idx, field, value)}
                    t={t}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
