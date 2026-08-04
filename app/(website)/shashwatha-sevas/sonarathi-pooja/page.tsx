"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, Check, ArrowLeft, Star, CalendarDays, IndianRupee, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { cn, formatPrice } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

const simhaMasaDays = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  label: `Simha Masa - Day ${i + 1}`,
  available: i % 3 !== 0,
}))

export default function SonarathiPoojaPage() {
  const { t } = useTranslation()
  const [selectedDay, setSelectedDay] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [state, setState] = useState("")
  const [district, setDistrict] = useState("")
  const [pincode, setPincode] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const totalAmount = 15000 * quantity

  const handleSubmit = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/shashwatha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "SONARATHI",
          devoteeName: name,
          phone,
          email,
          address,
          state,
          district,
          pincode,
          startDate: new Date().toISOString(),
          remarks: `Simha Masa Day: ${selectedDay}`,
          numberOfYears: 1,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json?.success) {
        setError(json?.message || "Failed to submit booking")
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
            <span className="text-text-primary font-medium">Sonarathi Pooja</span>
          </motion.div>

          {submitted ? (
            <Card variant="elevated" padding="lg" className="mb-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">Booking Submitted</h1>
              <p className="text-text-secondary">Your Sonarathi Pooja booking request has been received. The temple will contact you shortly.</p>
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
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-500 to-amber-600 shadow-lg">
                    <Star className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <Badge variant="primary" size="sm" className="mb-1">Shashwatha Seva</Badge>
                    <h1 className="text-2xl font-heading font-bold text-text-primary">Sonarathi Pooja</h1>
                    <p className="text-text-muted text-sm">Simha Masa worship &middot; {formatPrice(15000)} per year</p>
                  </div>
                </div>
              </Card>

              <div className="grid md:grid-cols-2 gap-8">
                <Card variant="elevated" padding="lg">
                  <div className="flex items-center gap-2 mb-6">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-heading font-bold text-text-primary">Select Simha Masa Day</h2>
                  </div>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {simhaMasaDays.map((day) => (
                      <button
                        key={day.day}
                        onClick={() => day.available && setSelectedDay(String(day.day))}
                        disabled={!day.available}
                        className={cn(
                          "w-full p-3 rounded-xl text-left transition-all border flex items-center gap-3",
                          selectedDay === String(day.day)
                            ? "border-primary bg-primary/5"
                            : day.available
                            ? "border-border hover:border-secondary bg-warm-white dark:bg-bg-secondary"
                            : "border-border/50 bg-bg-tertiary/30 text-text-muted/50 cursor-not-allowed",
                        )}
                      >
                        <div className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                          selectedDay === String(day.day)
                            ? "bg-primary text-white"
                            : day.available
                            ? "bg-bg-secondary text-text-primary"
                            : "bg-bg-tertiary text-text-muted",
                        )}>
                          <span className="text-xs font-bold">{day.day}</span>
                        </div>
                        <div className="flex-1">
                          <p className={cn(
                            "text-sm font-medium",
                            day.available ? "text-text-primary" : "text-text-muted/50",
                          )}>
                            {day.label}
                          </p>
                          <p className="text-xs text-text-muted">
                            {day.available ? "Available" : "Booked"}
                          </p>
                        </div>
                        {selectedDay === String(day.day) && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </Card>

                <Card variant="elevated" padding="lg">
                  <div className="flex items-center gap-2 mb-6">
                    <Star className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-heading font-bold text-text-primary">Your Details</h2>
                  </div>
                  {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                  <div className="space-y-4">
                    <Input
                      label="Full Name"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <Input
                      label="Phone Number"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Input
                      label="Address"
                      placeholder="Enter your full address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="State"
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                      />
                      <Input
                        label="District"
                        placeholder="District"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        required
                      />
                    </div>
                    <Input
                      label="PIN Code"
                      placeholder="6-digit PIN code"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      required
                    />
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-text-primary">Quantity:</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="text-lg font-bold font-heading text-text-primary w-8 text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Per Year</span>
                        <span className="font-semibold text-text-primary">{formatPrice(15000)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Quantity</span>
                        <span className="font-semibold text-text-primary">{quantity}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-base font-bold font-heading text-primary">Total Amount</span>
                        <span className="text-xl font-bold font-heading text-primary">{formatPrice(totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full mt-6"
                    disabled={!selectedDay || !name || !phone || !address || !state || !district || !pincode}
                    onClick={handleSubmit}
                  >
                    {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                    Book Sonarathi Pooja
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
