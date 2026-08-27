"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, Calendar, Check, ArrowLeft, Infinity, Sun, IndianRupee, Loader2 } from "lucide-react"
import { CalendarSelector } from "@/components/booking/calendar-selector"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { formatPrice } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

export default function NityaPoojaPage() {
  const { t } = useTranslation()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [state, setState] = useState("")
  const [district, setDistrict] = useState("")
  const [pincode, setPincode] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/shashwatha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "NITYA_POOJA",
          devoteeName: name,
          phone,
          email,
          address,
          state,
          district,
          pincode,
          startDate: selectedDate ? selectedDate.toISOString() : "",
          numberOfYears: 1,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json?.success) {
        setError(json?.message || "Failed to submit subscription")
        setLoading(false)
        return
      }
      setSubmitted(true)
      setLoading(false)
    } catch {
      setError("Network error. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-secondary/30 to-bg-primary">
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-text-muted mb-6"
          >
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/shashwatha-sevas" className="hover:text-secondary transition-colors">{t("nav.shashwathaSevas")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">Nitya Pooja</span>
          </motion.div>

          {submitted ? (
            <Card variant="elevated" padding="lg" className="mb-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">Subscription Submitted</h1>
              <p className="text-text-secondary">Your Nitya Pooja subscription request has been received. The temple will contact you shortly.</p>
              <Link href="/shashwatha-sevas">
                <Button variant="outline" className="mt-6">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Shashwatha Sevas
                </Button>
              </Link>
            </Card>
          ) : (
            <>
              <Card variant="elevated" padding="lg" className="mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600 to-orange-700 shadow-lg">
                    <Infinity className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <Badge variant="primary" size="sm" className="mb-1">Shashwatha Seva</Badge>
                    <h1 className="text-2xl font-heading font-bold text-text-primary">Nitya Pooja Subscription</h1>
                    <p className="text-text-muted text-sm">Daily worship for 12 months &middot; {formatPrice(36000)}</p>
                  </div>
                </div>
              </Card>

              <div className="grid md:grid-cols-2 gap-8">
                <Card variant="elevated" padding="lg">
                  <div className="flex items-center gap-2 mb-6">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-heading font-bold text-text-primary">Select Start Date</h2>
                  </div>
                  <CalendarSelector
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    minDate={new Date()}
                  />
                </Card>

                <Card variant="elevated" padding="lg">
                  <div className="flex items-center gap-2 mb-6">
                    <Sun className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-heading font-bold text-text-primary">{t("booking.devoteeDetails")}</h2>
                  </div>
                  {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                  <div className="space-y-4">
                    <Input
                      label={t("booking.fullName")}
                      placeholder={t("booking.fullNamePlaceholder")}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <Input
                      label={t("booking.phone")}
                      placeholder={t("booking.phonePlaceholder")}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                    <Input
                      label={t("booking.email")}
                      type="email"
                      placeholder={t("booking.emailPlaceholder")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Input
                      label={t("booking.address")}
                      placeholder={t("booking.addressPlaceholder")}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label={t("booking.state")}
                        placeholder={t("booking.statePlaceholder")}
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                      />
                      <Input
                        label={t("booking.district")}
                        placeholder={t("booking.districtPlaceholder")}
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        required
                      />
                    </div>
                    <Input
                      label={t("booking.pincode")}
                      placeholder={t("booking.pincodePlaceholder")}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-text-secondary">Subscription Amount</span>
                      <span className="text-lg font-bold font-heading text-primary">{formatPrice(36000)}</span>
                    </div>
                    <p className="text-xs text-text-muted">For 12 months of daily Nitya Pooja</p>
                  </div>
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full mt-6"
                    disabled={!selectedDate || !name || !phone || !address || !state || !district || !pincode}
                    onClick={handleSubmit}
                  >
                    {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                    Subscribe Now
                  </Button>
                  <Link href="/shashwatha-sevas">
                    <Button variant="ghost" size="sm" className="w-full mt-2">
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Back to Shashwatha Sevas
                    </Button>
                  </Link>
                </Card>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
