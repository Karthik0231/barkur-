"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, Heart, Download, Share2, Home, ArrowRight, ChevronRight, Globe, Copy, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"

function ThankYouContent() {
  const searchParams = useSearchParams()
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const getStoredDonation = () => {
    if (typeof window === "undefined") return null
    try {
      const stored = sessionStorage.getItem("lastDonation")
      if (stored) return JSON.parse(stored)
    } catch { return null }
    return null
  }

  const stored = getStoredDonation()
  const donorName = searchParams.get("donorName") || stored?.donorName || "Guest Devotee"
  const amount = Number(searchParams.get("amount")) || Number(stored?.amount) || 0
  const campaign = searchParams.get("campaign") || stored?.campaign || "General Donation"
  const donationId = searchParams.get("donationId") || stored?.donationId || ""
  const receiptNumber = searchParams.get("receiptNumber") || stored?.receiptNumber || ""
  const date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })

  const shareUrl = typeof window !== "undefined" ? window.location.origin + "/donate" : ""
  const shareText = `I just donated to Sri Kalikamba Temple! Support this noble cause. 🙏`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = (type: "receipt" | "certificate") => {
    const element = document.createElement("a")
    const id = receiptNumber || donationId || `DON-${Date.now()}`
    element.href = `data:text/plain;charset=utf-8,${encodeURIComponent(
      `${type.toUpperCase()}\n\n${type === "receipt" ? `Receipt No: ${receiptNumber || id}` : `Donation ID: ${donationId || id}`}\nDonor: ${donorName}\nAmount: ${formatPrice(amount)}\nCampaign: ${campaign}\nDate: ${date}\n\nStatus: Pending Verification\n\nThank you for your generosity. Your donation is currently being verified.\n\nSri Kalikamba Temple, Barkur\n`
    )}`
    element.download = `${type}-${id}.txt`
    element.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-bg-primary dark:from-emerald-950/10">
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={mounted ? { scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30">
              <motion.div
                initial={{ pathLength: 0 }}
                animate={mounted ? { pathLength: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <CheckCircle className="h-12 w-12 text-white" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mt-6">
              Thank You for Your Generosity!
            </h1>
            <p className="text-lg text-text-secondary mt-4 max-w-xl mx-auto leading-relaxed">
              Your donation record has been submitted successfully. Our team will verify and confirm your payment shortly. May the divine bless you abundantly for your kindness and support.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8"
          >
            <Card variant="elevated" className="p-6 max-w-md mx-auto text-left">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center shrink-0">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <Badge variant="warning" size="sm" className="mb-2">Pending Verification</Badge>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Donor</span>
                      <span className="text-text-primary font-medium">{donorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Amount</span>
                      <span className="text-primary font-bold font-heading text-lg">{formatPrice(amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Campaign</span>
                      <span className="text-text-primary">{campaign}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Date</span>
                      <span className="text-text-primary">{date}</span>
                    </div>
                    {donationId && (
                      <div className="flex justify-between">
                        <span className="text-text-muted">Donation ID</span>
                        <span className="text-text-primary font-mono text-xs">{donationId}</span>
                      </div>
                    )}
                    {receiptNumber && (
                      <div className="flex justify-between">
                        <span className="text-text-muted">Receipt No.</span>
                        <span className="text-text-primary font-mono text-xs">{receiptNumber}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <Button variant="primary" size="lg" onClick={() => handleDownload("receipt")}>
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
            <Button variant="secondary" size="lg" onClick={() => handleDownload("certificate")}>
              <Download className="h-4 w-4" />
              Download Certificate
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-8"
          >
            <p className="text-sm text-text-muted mb-3">Share your kindness</p>
            <div className="flex justify-center gap-3">
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl bg-bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors">
                <Globe className="h-5 w-5 text-text-primary" />
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl bg-bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors">
                <Globe className="h-5 w-5 text-text-primary" />
              </a>
              <a href={`https://www.linkedin.com/share?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-xl bg-bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors">
                <Globe className="h-5 w-5 text-text-primary" />
              </a>
              <button onClick={handleCopyLink} className="w-11 h-11 rounded-xl bg-bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors">
                {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5 text-text-primary" />}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link href="/donate">
              <Button variant="outline">
                <Heart className="h-4 w-4" />
                Make Another Donation
              </Button>
            </Link>
            <Link href="/donate/history">
              <Button variant="ghost">
                <ArrowRight className="h-4 w-4" />
                View Donation History
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default function DonationThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-text-muted">
        Loading...
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  )
}
