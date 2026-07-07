"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { z } from "zod"
import { cn, formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Shield, QrCode, CreditCard, Hash, User, Mail, Phone, MapPin, MessageSquare, Eye, EyeOff } from "lucide-react"

const donationFormSchema = z.object({
  amount: z.number().min(1, "Please select or enter an amount"),
  donorName: z.string().min(2, "Name must be at least 2 characters").max(200),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, "Please enter a valid phone number"),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits").optional().or(z.literal("")),
  message: z.string().max(500).optional(),
  isAnonymous: z.boolean().optional(),
  isRecurring: z.boolean().optional(),
  recurringFrequency: z.enum(["monthly", "yearly"]).optional(),
})

type DonationFormData = z.infer<typeof donationFormSchema>

interface DonationFormProps {
  campaignName?: string
  defaultAmount?: number
  onSubmit: (data: DonationFormData) => void
  loading?: boolean
  className?: string
}

const presetAmounts = [501, 1001, 5001, 10001]

export function DonationForm({
  campaignName,
  defaultAmount,
  onSubmit,
  loading = false,
  className,
}: DonationFormProps) {
  const [showPan, setShowPan] = useState(false)
  const [customAmount, setCustomAmount] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      amount: defaultAmount || 0,
      isAnonymous: false,
      isRecurring: false,
    },
  })

  const selectedAmount = watch("amount")
  const isRecurring = watch("isRecurring")
  const isAnonymous = watch("isAnonymous")

  const handleAmountSelect = (amount: number) => {
    setValue("amount", amount, { shouldValidate: true })
    setCustomAmount("")
  }

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "")
    setCustomAmount(val)
    if (val) setValue("amount", parseInt(val), { shouldValidate: true })
    else setValue("amount", 0, { shouldValidate: true })
  }

  return (
    <Card variant="elevated" className={cn("p-6 lg:p-8", className)}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
          <Heart className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-heading font-bold text-primary">Make a Donation</h3>
          {campaignName && (
            <p className="text-sm text-text-muted">Supporting: {campaignName}</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="text-sm font-medium text-text-primary mb-3 block">
            Select Amount
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {presetAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handleAmountSelect(amount)}
                className={cn(
                  "relative py-3 px-4 rounded-xl border-2 text-center transition-all duration-200",
                  "font-semibold text-sm",
                  selectedAmount === amount
                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                    : "border-border hover:border-secondary/50 text-text-secondary hover:text-text-primary",
                )}
              >
                {formatPrice(amount)}
                {selectedAmount === amount && (
                  <motion.div
                    layoutId="amount-selected"
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center"
                  >
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </button>
            ))}
          </div>
          <div className="mt-3">
            <label className="text-xs text-text-muted mb-1 block">Custom Amount</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted font-medium text-sm">₹</span>
              <input
                type="text"
                value={customAmount}
                onChange={handleCustomAmount}
                placeholder="Enter amount"
                className={cn(
                  "w-full h-11 pl-8 pr-4 rounded-lg border text-sm transition-all duration-200",
                  "bg-warm-white dark:bg-bg-secondary",
                  "focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none",
                  selectedAmount && !customAmount ? "border-border" : "border-secondary",
                )}
              />
            </div>
          </div>
          {errors.amount && (
            <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Full Name *"
            placeholder="Your name"
            iconLeft={<User className="h-4 w-4" />}
            error={errors.donorName?.message}
            {...register("donorName")}
          />
          <Input
            label="Email *"
            type="email"
            placeholder="your@email.com"
            iconLeft={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Phone *"
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            iconLeft={<Phone className="h-4 w-4" />}
            error={errors.phone?.message}
            {...register("phone")}
          />
          <div className="relative">
            <Input
              label="PAN Number (Optional)"
              placeholder="ABCDE1234F"
              iconLeft={<Hash className="h-4 w-4" />}
              type={showPan ? "text" : "password"}
              error={errors.panNumber?.message}
              {...register("panNumber")}
            />
            <button
              type="button"
              onClick={() => setShowPan(!showPan)}
              className="absolute right-3 top-[38px] text-text-muted hover:text-text-primary"
            >
              {showPan ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-text-primary mb-2 block">Address</label>
          <div className="space-y-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-text-muted" />
              <input
                {...register("address")}
                placeholder="Street address"
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-warm-white dark:bg-bg-secondary text-sm focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <input
                {...register("city")}
                placeholder="City"
                className="w-full h-11 px-4 rounded-lg border border-border bg-warm-white dark:bg-bg-secondary text-sm focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all"
              />
              <input
                {...register("state")}
                placeholder="State"
                className="w-full h-11 px-4 rounded-lg border border-border bg-warm-white dark:bg-bg-secondary text-sm focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all"
              />
              <input
                {...register("pincode")}
                placeholder="Pincode"
                className="w-full h-11 px-4 rounded-lg border border-border bg-warm-white dark:bg-bg-secondary text-sm focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all"
              />
            </div>
            {errors.pincode && (
              <p className="text-xs text-red-500">{errors.pincode.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-text-primary mb-2 block">Message (Optional)</label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3.5 h-4 w-4 text-text-muted" />
            <textarea
              {...register("message")}
              rows={3}
              placeholder="Add a message or prayer..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-warm-white dark:bg-bg-secondary text-sm focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all resize-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div
              onClick={() => setValue("isAnonymous", !isAnonymous)}
              className={cn(
                "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200",
                isAnonymous
                  ? "border-primary bg-primary"
                  : "border-border group-hover:border-secondary",
              )}
            >
              {isAnonymous && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
              Donate Anonymously
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div
              onClick={() => setValue("isRecurring", !isRecurring)}
              className={cn(
                "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200",
                isRecurring
                  ? "border-primary bg-primary"
                  : "border-border group-hover:border-secondary",
              )}
            >
              {isRecurring && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
              Make this a recurring donation
            </span>
          </label>
        </div>

        {isRecurring && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex gap-3"
          >
            {(["monthly", "yearly"] as const).map((freq) => (
              <button
                key={freq}
                type="button"
                onClick={() => setValue("recurringFrequency", freq)}
                className={cn(
                  "flex-1 py-2.5 px-4 rounded-xl border-2 text-sm font-medium capitalize transition-all",
                  watch("recurringFrequency") === freq
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-text-muted hover:border-secondary/50",
                )}
              >
                {freq}
              </button>
            ))}
          </motion.div>
        )}

        <div className="pt-2">
          <p className="text-xs text-text-muted flex items-center gap-1.5 mb-3">
            <Shield className="h-3.5 w-3.5 text-secondary" />
            Your information is secure and encrypted. 100% safe checkout.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="gradient" size="lg" type="submit" loading={loading} className="w-full">
              <CreditCard className="h-4 w-4" />
              {selectedAmount ? `Donate ${formatPrice(selectedAmount)}` : "Donate"}
            </Button>
            <Button variant="outline" size="lg" type="button" className="w-full">
              <QrCode className="h-4 w-4" />
              Donate using UPI
            </Button>
          </div>
        </div>
      </form>
    </Card>
  )
}
