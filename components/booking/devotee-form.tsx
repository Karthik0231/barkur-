"use client"

import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { rashiOptions, nakshatraOptions } from "@/lib/nakshatra-data"

interface DevoteeFormData {
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

export function DevoteeForm({ data, onChange }: DevoteeFormProps) {
  const update = (field: keyof DevoteeFormData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">
          Personal Information
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Full Name *"
            placeholder="Enter your full name"
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
          />
          <Input
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
          <Input
            label="Phone Number *"
            type="tel"
            placeholder="Enter your phone number"
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
          <Input
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
          Address
        </h3>
        <div className="space-y-4">
          <textarea
            value={data.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Enter your full address"
            rows={3}
            className="w-full rounded-xl border border-border bg-warm-white dark:bg-bg-secondary p-4 text-sm text-text-primary placeholder:text-text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus-visible:outline-none transition-all resize-none"
          />
          <div className="grid sm:grid-cols-3 gap-4">
            <Input
              label="State"
              placeholder="e.g. Karnataka"
              value={data.state}
              onChange={(e) => update("state", e.target.value)}
            />
            <Input
              label="District"
              placeholder="e.g. Udupi"
              value={data.district}
              onChange={(e) => update("district", e.target.value)}
            />
            <Input
              label="Pincode"
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
