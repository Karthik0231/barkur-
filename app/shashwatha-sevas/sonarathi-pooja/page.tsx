"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, Check, ArrowLeft, Star, CalendarDays, IndianRupee } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { cn, formatPrice } from "@/lib/utils"

const simhaMasaDays = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  label: `Simha Masa - Day ${i + 1}`,
  available: i % 3 !== 0,
}))

export default function SonarathiPoojaPage() {
  const [selectedDay, setSelectedDay] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [quantity, setQuantity] = useState(1)

  const totalAmount = 15000 * quantity

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-secondary/30 to-bg-primary">
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-text-muted mb-6"
          >
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/shashwatha-sevas" className="hover:text-secondary transition-colors">Shashwatha Sevas</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">Sonarathi Pooja</span>
          </motion.div>

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
                disabled={!selectedDay || !name || !phone}
              >
                <Check className="h-4 w-4 mr-1" />
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
        </div>
      </section>
    </div>
  )
}
