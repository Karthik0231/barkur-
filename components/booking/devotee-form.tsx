"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { rashiOptions, nakshatraOptions } from "@/lib/nakshatra-data"
import { Loader2, CheckCircle, AlertCircle, User } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DevoteeFormData {
  name: string
  gotra: string
  nakshatra: string
  rashi: string
  phone: string
  email: string
  address: string
  state: string
  district: string
  pincode: string
}

interface DevoteeFormProps {
  data: DevoteeFormData
  onChange: (data: DevoteeFormData) => void
}

type LookupStatus = "idle" | "loading" | "found" | "notfound" | "error"

export function DevoteeForm({ data, onChange }: DevoteeFormProps) {
  const [lookupStatus, setLookupStatus] = useState<LookupStatus>("idle")
  const [lookupMsg, setLookupMsg] = useState("")
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const update = (field: keyof DevoteeFormData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  const doLookup = async (phone: string) => {
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      setLookupStatus("idle")
      setLookupMsg("")
      return
    }
    setLookupStatus("loading")
    setLookupMsg("")
    try {
      const res = await fetch(`/api/users?phone=${encodeURIComponent(phone)}`)
      const json = await res.json()
      if (json.success && json.data?.user) {
        const u = json.data.user
        onChange({
          ...data,
          name: u.name || data.name,
          email: u.email || data.email,
          phone: u.phone || data.phone,
          address: u.address || data.address,
          state: u.state || data.state,
          district: u.district || data.district,
          pincode: u.pincode || data.pincode,
          gotra: u.gotra || data.gotra,
          nakshatra: u.nakshatra || data.nakshatra,
          rashi: u.rashi || data.rashi,
        })
        setLookupStatus("found")
        setLookupMsg(`Auto-filled from ${json.data.source === "devotee" ? "devotee records" : "account"}`)
      } else {
        setLookupStatus("notfound")
        setLookupMsg("No existing record found, please fill in details")
      }
    } catch (e) {
      setLookupStatus("error")
      setLookupMsg("Lookup unavailable, please fill in manually")
    }
  }

  const handlePhoneBlur = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doLookup(data.phone), 400)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">
          Personal Information
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            variant="premium"
            label="Full Name *"
            placeholder="Enter your full name"
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
            success={lookupStatus === "found" && data.name ? " " : undefined}
          />
          <Input
            variant="premium"
            label="Gotra"
            placeholder="e.g. Bharadwaja, Vashishta..."
            value={data.gotra}
            onChange={(e) => update("gotra", e.target.value)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">
          Astrological Details
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Select
            label="Nakshatra (Birth Star)"
            options={nakshatraOptions}
            value={data.nakshatra}
            onChange={(e) => update("nakshatra", e.target.value)}
            placeholder="Select nakshatra"
          />
          <Select
            label="Rashi (Zodiac)"
            options={rashiOptions}
            value={data.rashi}
            onChange={(e) => update("rashi", e.target.value)}
            placeholder="Select rashi"
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">
          Contact Details
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Input
              variant="premium"
              label="Phone Number *"
              type="tel"
              placeholder="Enter your phone number"
              value={data.phone}
              onChange={(e) => {
                update("phone", e.target.value)
                if (lookupStatus === "found") {
                  setLookupStatus("idle")
                  setLookupMsg("")
                }
              }}
              onBlur={handlePhoneBlur}
              iconLeft={<User className="h-4 w-4" />}
              iconRight={
                lookupStatus === "loading" ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> :
                lookupStatus === "found" ? <CheckCircle className="h-4 w-4 text-emerald-600" /> :
                lookupStatus === "error" || lookupStatus === "notfound" ? <AlertCircle className="h-4 w-4 text-amber-500" /> :
                undefined
              }
            />
            {lookupMsg && (
              <p className={cn(
                "text-xs mt-1.5 flex items-center gap-1",
                lookupStatus === "found" ? "text-emerald-600" :
                lookupStatus === "error" ? "text-amber-600" : "text-text-muted"
              )}>
                {lookupStatus === "found" && <CheckCircle className="h-3 w-3 shrink-0" />}
                {lookupStatus === "error" && <AlertCircle className="h-3 w-3 shrink-0" />}
                {lookupMsg}
              </p>
            )}
          </div>
          <Input
            variant="premium"
            label="Email Address *"
            type="email"
            placeholder="Enter your email address"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">
          Address *
        </h3>
        <div className="space-y-4">
          <textarea
            value={data.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Enter your full address"
            rows={3}
            className="w-full rounded-xl border-2 border-gold-200/30 bg-warm-white p-4 text-sm text-text-primary placeholder:text-text-muted focus:border-gold-500 focus:ring-2 focus:ring-gold-500/10 focus-visible:outline-none transition-all resize-none shadow-premium"
          />
          <div className="grid sm:grid-cols-3 gap-4">
            <Input
              variant="premium"
              label="State *"
              placeholder="e.g. Karnataka"
              value={data.state}
              onChange={(e) => update("state", e.target.value)}
            />
            <Input
              variant="premium"
              label="District *"
              placeholder="e.g. Udupi"
              value={data.district}
              onChange={(e) => update("district", e.target.value)}
            />
            <Input
              variant="premium"
              label="Pincode *"
              placeholder="e.g. 576101"
              value={data.pincode}
              onChange={(e) => update("pincode", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
