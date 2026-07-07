"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, Calendar, Check, ArrowLeft, Infinity, Sun, IndianRupee } from "lucide-react"
import { CalendarSelector } from "@/components/booking/calendar-selector"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { formatPrice } from "@/lib/utils"

export default function NityaPoojaPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")

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
            <span className="text-text-primary font-medium">Nitya Pooja</span>
          </motion.div>

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
                disabled={!selectedDate || !name || !phone}
              >
                <Check className="h-4 w-4 mr-1" />
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
        </div>
      </section>
    </div>
  )
}
