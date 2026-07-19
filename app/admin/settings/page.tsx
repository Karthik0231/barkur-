"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, Building2, Clock, Mail, Palette, CreditCard, Search, Globe, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"

interface SettingSection {
  id: string
  label: string
  icon: React.ReactNode
  fields: { key: string; label: string; type: string; placeholder?: string }[]
}

const settingSections: SettingSection[] = [
  {
    id: "temple",
    label: "Temple Information",
    icon: <Building2 className="h-5 w-5" />,
    fields: [
      { key: "templeName", label: "Temple Name", type: "text" },
      { key: "templeAddress", label: "Address", type: "text" },
      { key: "templeCity", label: "City", type: "text" },
      { key: "templeState", label: "State", type: "text" },
      { key: "templePincode", label: "Pincode", type: "text" },
    ],
  },
  {
    id: "contact",
    label: "Contact Information",
    icon: <Phone className="h-5 w-5" />,
    fields: [
      { key: "contactPhone", label: "Primary Phone", type: "text" },
      { key: "contactAltPhone", label: "Alternate Phone", type: "text" },
      { key: "contactEmail", label: "Email Address", type: "email" },
      { key: "contactWhatsApp", label: "WhatsApp Number", type: "text" },
    ],
  },
  {
    id: "social",
    label: "Social Media Links",
    icon: <Globe className="h-5 w-5" />,
    fields: [
      { key: "socialInstagram", label: "Instagram URL", type: "url" },
      { key: "socialFacebook", label: "Facebook URL", type: "url" },
      { key: "socialYoutube", label: "YouTube URL", type: "url" },
      { key: "socialTwitter", label: "Twitter/X URL", type: "url" },
    ],
  },
  {
    id: "timings",
    label: "Temple Timings",
    icon: <Clock className="h-5 w-5" />,
    fields: [
      { key: "timingsMorningOpen", label: "Morning Open", type: "text", placeholder: "6:00 AM" },
      { key: "timingsMorningClose", label: "Morning Close", type: "text", placeholder: "1:30 PM" },
      { key: "timingsEveningOpen", label: "Evening Open", type: "text", placeholder: "4:00 PM" },
      { key: "timingsEveningClose", label: "Evening Close", type: "text", placeholder: "7:30 PM" },
    ],
  },
  {
    id: "payment",
    label: "Payment Gateway",
    icon: <CreditCard className="h-5 w-5" />,
    fields: [
      { key: "paymentRazorpayKey", label: "Razorpay Key ID", type: "text" },
      { key: "paymentRazorpaySecret", label: "Razorpay Secret Key", type: "password" },
      { key: "paymentCurrency", label: "Currency", type: "text" },
    ],
  },
  {
    id: "email",
    label: "Email Configuration",
    icon: <Mail className="h-5 w-5" />,
    fields: [
      { key: "emailHost", label: "SMTP Host", type: "text" },
      { key: "emailPort", label: "SMTP Port", type: "number" },
      { key: "emailUser", label: "SMTP Username", type: "text" },
      { key: "emailPassword", label: "SMTP Password", type: "password" },
      { key: "emailFrom", label: "From Address", type: "email" },
    ],
  },
  {
    id: "seo",
    label: "SEO Defaults",
    icon: <Search className="h-5 w-5" />,
    fields: [
      { key: "seoTitle", label: "Default Meta Title", type: "text" },
      { key: "seoDescription", label: "Default Meta Description", type: "text" },
      { key: "seoKeywords", label: "Default Keywords (comma separated)", type: "text" },
    ],
  },
]

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState(settingSections[0].id)
  const [dirty, setDirty] = useState(false)
  const [settingsList, setSettingsList] = useState<{ key: string; value: string; group: string }[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/settings")
        const data = await res.json()
        const list = data.settings || []
        setSettingsList(list)
        const flat: Record<string, string> = {}
        list.forEach((s: { key: string; value: string }) => { flat[s.key] = s.value })
        setValues(flat)
      } catch { toast.error("Failed to load settings") }
      finally { setLoading(false) }
    })()
  }, [])

  const updateValue = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }))
    setDirty(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = settingsList.map((s) => ({ ...s, value: values[s.key] ?? s.value }))
      const payload = { settings: updated }
      const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error()
      setDirty(false)
      toast.success("Settings saved successfully")
    } catch { toast.error("Failed to save settings") }
    finally { setSaving(false) }
  }

  const activeSection = settingSections.find((s) => s.id === activeTab) || settingSections[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-text-primary">Settings</h1>
          <p className="text-sm text-text-muted mt-1">Configure temple settings and preferences</p>
        </div>
        <div className="flex items-center gap-2">
          {dirty && <span className="text-xs text-amber-500 font-medium">Unsaved changes</span>}
          <Button variant="primary" size="sm" iconLeft={<Save className="h-4 w-4" />} onClick={handleSave} loading={saving}>
            Save Settings
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="hidden lg:flex flex-col gap-1 w-56 shrink-0">
          {settingSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
                activeTab === section.id
                  ? "bg-secondary/10 text-secondary"
                  : "text-text-muted hover:text-text-primary hover:bg-bg-secondary",
              )}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              {activeSection.icon}
              <div>
                <h3 className="text-lg font-semibold font-heading text-text-primary">{activeSection.label}</h3>
                <p className="text-sm text-text-muted">Configure {activeSection.label.toLowerCase()} settings</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeSection.fields.map((field) => (
                <Input
                  key={field.key}
                  label={field.label}
                  type={field.type}
                  placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                  value={values[field.key] || ""}
                  onChange={(e) => updateValue(field.key, e.target.value)}
                />
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border flex justify-end">
              <Button variant="primary" size="sm" iconLeft={<Save className="h-4 w-4" />} onClick={handleSave} loading={saving}>
                Save {activeSection.label}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function cn(...inputs: unknown[]) {
  return inputs.filter(Boolean).join(" ")
}
