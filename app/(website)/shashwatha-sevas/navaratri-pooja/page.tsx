"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, Check, ArrowLeft, Crown, CalendarDays, IndianRupee } from "lucide-react"
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

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    )
  }

  const totalAmount = selectedDays.length * 3500

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
                <h2 className="text-lg font-heading font-bold text-text-primary">Your Details</h2>
              </div>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                disabled={selectedDays.length === 0 || !name || !phone}
              >
                <Check className="h-4 w-4 mr-1" />
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
        </div>
      </section>
    </div>
  )
}
