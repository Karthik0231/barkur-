"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, Check, ArrowLeft, Crown, CalendarDays, IndianRupee, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn, formatPrice } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

const navaratriDays = [
  { day: 1, name: "Day 1 - Shailaputri", date: "Pratipada", color: "from-red-500 to-rose-600" },
  { day: 2, name: "Day 2 - Brahmacharini", date: "Dwitiya", color: "from-blue-500 to-indigo-600" },
  { day: 3, name: "Day 3 - Chandraghanta", date: "Tritiya", color: "from-yellow-500 to-amber-600" },
  { day: 4, name: "Day 4 - Kushmanda", date: "Chaturthi", color: "from-green-500 to-emerald-600" },
  { day: 5, name: "Day 5 - Skandamata", date: "Panchami", color: "from-purple-500 to-violet-600" },
  { day: 6, name: "Day 6 - Katyayani", date: "Shashthi", color: "from-orange-500 to-red-600" },
  { day: 7, name: "Day 7 - Kalaratri", date: "Saptami", color: "from-slate-700 to-gray-900" },
  { day: 8, name: "Day 8 - Mahagauri", date: "Ashtami", color: "from-pink-500 to-rose-600" },
  { day: 9, name: "Day 9 - Siddhidatri", date: "Navami", color: "from-gold-500 to-amber-600" },
]

export default function NavaratriPoojaPage() {
  const { t } = useTranslation()
  const [selectedDays, setSelectedDays] = useState<number[]>([])
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

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    )
  }

  const totalAmount = selectedDays.length * 3500

  const handleSubmit = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/shashwatha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "NAVARATRI",
          devoteeName: name,
          phone,
          email,
          address,
          state,
          district,
          pincode,
          startDate: new Date().toISOString(),
          remarks: `Selected days: ${selectedDays.sort((a, b) => a - b).join(", ")}`,
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
            <span className="text-text-primary font-medium">Navaratri Pooja</span>
          </motion.div>

          {submitted ? (
            <Card variant="elevated" padding="lg" className="mb-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-text-primary mb-2">Booking Submitted</h1>
              <p className="text-text-secondary">Your Navaratri Pooja booking request has been received. The temple will contact you shortly.</p>
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
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-violet-700 shadow-lg">
                    <Crown className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <Badge variant="primary" size="sm" className="mb-1">Shashwatha Seva</Badge>
                    <h1 className="text-2xl font-heading font-bold text-text-primary">Navaratri Pooja</h1>
                    <p className="text-text-muted text-sm">Nine nights sacred worship &middot; {formatPrice(3500)} per day</p>
                  </div>
                </div>
              </Card>

              <div className="grid md:grid-cols-2 gap-8">
                <Card variant="elevated" padding="lg">
                  <div className="flex items-center gap-2 mb-6">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-heading font-bold text-text-primary">Select Days</h2>
                  </div>
                  <div className="space-y-2">
                    {navaratriDays.map((day) => (
                      <button
                        key={day.day}
                        onClick={() => toggleDay(day.day)}
                        className={cn(
                          "w-full p-3 rounded-xl text-left transition-all border flex items-center gap-3",
                          selectedDays.includes(day.day)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-secondary bg-warm-white dark:bg-bg-secondary",
                        )}
                      >
                        <div className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br",
                          day.color,
                        )}>
                          <span className="text-xs font-bold text-white">{day.day}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-text-primary">{day.name}</p>
                          <p className="text-xs text-text-muted">{day.date}</p>
                        </div>
                        <div className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                          selectedDays.includes(day.day)
                            ? "bg-primary border-primary text-white"
                            : "border-border",
                        )}>
                          {selectedDays.includes(day.day) && <Check className="h-3 w-3" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>

                <Card variant="elevated" padding="lg">
                  <div className="flex items-center gap-2 mb-6">
                    <Crown className="h-5 w-5 text-primary" />
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
                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Days Selected</span>
                        <span className="font-semibold text-text-primary">{selectedDays.length} / 9</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Per Day</span>
                        <span className="font-semibold text-text-primary">{formatPrice(3500)}</span>
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
                    disabled={selectedDays.length === 0 || !name || !phone || !address || !state || !district || !pincode}
                    onClick={handleSubmit}
                  >
                    {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                    Book Navaratri Pooja
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
