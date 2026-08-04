"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import {
  ArrowLeft,
  Heart,
  ChevronRight,
  Users,
  CalendarDays,
  Target,
  CheckCircle,
  Copy,
  Check,
  Building2,
  Landmark,
  Smartphone,
  CreditCard,
  QrCode,
  Banknote,
  Shield,
  CircleDollarSign,
  ArrowRightCircle,
} from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProgressBar } from "@/components/donation/progress-bar"
import { DonationForm } from "@/components/donation/donation-form"
import { formatPrice } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

interface Campaign {
  id: string
  slug: string
  name: string
  description?: string | null
  shortDescription?: string | null
  goalAmount: string | number
  collectedAmount: string | number
  endDate?: string | null
  startDate?: string | null
  category: string
  banner?: string | null
  images?: any
  _count?: { donations?: number }
}

interface TempleSettings {
  bank_account_name: string
  bank_account_number: string
  bank_ifsc: string
  bank_branch: string
  bank_name: string
  upi_id: string
  qr_code_url: string
}

interface DonationFormData {
  amount: number
  donorName: string
  email: string
  phone: string
  panNumber?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  message?: string
  isAnonymous?: boolean
  paymentMethod?: "UPI" | "BANK_TRANSFER" | "OTHER"
  transactionReference?: string
}

const DEFAULT_SETTINGS: TempleSettings = {
  bank_account_name: "",
  bank_account_number: "",
  bank_ifsc: "",
  bank_branch: "",
  bank_name: "",
  upi_id: "",
  qr_code_url: "",
}

export default function CampaignPage({ params }: { params: Promise<{ campaign: string }> }) {
  const router = useRouter()
  const { t } = useTranslation()
  const { campaign: campaignSlug } = use(params)
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [settings, setSettings] = useState<TempleSettings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [qrError, setQrError] = useState(false)
  const [now] = useState(() => Date.now())

  useEffect(() => {
    let active = true
    async function loadData() {
      setLoading(true)
      try {
        const [campaignsRes, settingsRes] = await Promise.all([
          fetch(`/api/donations/campaigns?limit=100&search=${encodeURIComponent(campaignSlug)}`),
          fetch("/api/settings"),
        ])
        const campaignsResult = await campaignsRes.json()
        const settingsResult = await settingsRes.json()

        if (active) {
          const campaigns = campaignsResult?.data?.campaigns ?? []
          const found = campaigns.find((item: Campaign) => item.slug === campaignSlug) ?? null
          setCampaign(found)

          if (settingsResult?.success && settingsResult?.data?.settings) {
            const raw: Record<string, any> = {}
            for (const s of settingsResult.data.settings) {
              raw[s.key] = typeof s.value === "string" ? s.value : String(s.value ?? "")
            }
            setSettings({
              bank_account_name: raw.bank_account_name || DEFAULT_SETTINGS.bank_account_name,
              bank_account_number: raw.bank_account_number || DEFAULT_SETTINGS.bank_account_number,
              bank_ifsc: raw.bank_ifsc || DEFAULT_SETTINGS.bank_ifsc,
              bank_branch: raw.bank_branch || DEFAULT_SETTINGS.bank_branch,
              bank_name: raw.bank_name || DEFAULT_SETTINGS.bank_name,
              upi_id: raw.upi_id || DEFAULT_SETTINGS.upi_id,
              qr_code_url: raw.qr_code_url || DEFAULT_SETTINGS.qr_code_url,
            })
          }
        }
      } catch {
        if (active) {
          setCampaign(null)
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    loadData()
    return () => { active = false }
  }, [campaignSlug])

  const handleCopy = async (value: string, field: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedField(field)
      toast.success(`${field} copied to clipboard!`)
      setTimeout(() => setCopiedField(null), 2000)
    } catch {
      toast.error("Failed to copy. Please copy manually.")
    }
  }

  const getQRImageSrc = () => {
    if (settings.qr_code_url) return settings.qr_code_url
    const upiLink = `upi://pay?pa=${encodeURIComponent(settings.upi_id)}&pn=${encodeURIComponent(settings.bank_account_name)}&cu=INR`
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiLink)}`
  }

  async function handleDonationSubmit(data: DonationFormData) {
    if (!campaign) return
    setSubmitting(true)
    setSubmitError("")
    try {
      const fullAddress = [data.address, data.city, data.state, data.pincode].filter(Boolean).join(", ") || undefined
      const body: any = {
        campaignId: campaign.id,
        category: typeof campaign.category === "string" ? campaign.category : "GENERAL",
        amount: data.amount,
        donorName: data.donorName,
        email: data.email,
        phone: data.phone,
        address: fullAddress,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        message: data.message,
        isAnonymous: data.isAnonymous,
        panCard: data.panNumber || undefined,
        paymentMethod: data.paymentMethod,
        transactionReference: data.transactionReference,
      }
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.message || "Failed to record donation")

      toast.success("Donation record submitted successfully!")
      const donationId = result?.data?.donation?.donationId || result?.data?.donationId || ""
      const receiptNumber = result?.data?.receiptNumber || ""
      const redirectParams = new URLSearchParams({
        donorName: data.donorName,
        amount: String(data.amount),
        campaign: campaign.name,
        donationId,
        receiptNumber,
      })
      if (typeof window !== "undefined") {
        sessionStorage.setItem("lastDonation", JSON.stringify({
          donorName: data.donorName,
          amount: String(data.amount),
          campaign: campaign.name,
          donationId,
          receiptNumber,
        }))
      }
      router.push(`/donate/thank-you?${redirectParams.toString()}`)
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to record donation"
      setSubmitError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-text-muted">Loading campaign...</div>
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-heading font-bold text-primary">Campaign Not Found</h1>
          <p className="text-text-secondary mt-2">The campaign you are looking for does not exist.</p>
          <Link href="/donate">
            <Button variant="primary" className="mt-6">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Donations
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const goal = Number(campaign.goalAmount)
  const raised = Number(campaign.collectedAmount)
  const percentage = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0
  const daysLeft = campaign.endDate ? Math.max(0, Math.ceil((new Date(campaign.endDate).getTime() - now) / 86400000)) : null
  const donors = campaign._count?.donations ?? 0

  return (
    <div className="min-h-screen">
      <section className="relative h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-secondary">
        {campaign.banner && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={campaign.banner}
            alt={campaign.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
          />
        )}
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-warm-white leading-tight">{campaign.name}</h1>
            <p className="text-warm-white/80 text-lg mt-4 max-w-2xl mx-auto">{campaign.shortDescription || "Support this sacred cause and earn divine blessings"}</p>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-20" />
      </section>

      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-8">
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/donate" className="hover:text-secondary transition-colors">{t("nav.donate")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{campaign.name}</span>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="lg:col-span-3 space-y-8">
              <AnimatedSection>
                <Card variant="elevated" className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-primary">About This Campaign</h2>
                  </div>
                  <p className="text-text-secondary leading-relaxed whitespace-pre-line">{campaign.description || campaign.shortDescription}</p>
                </Card>
              </AnimatedSection>

              <AnimatedSection delay={0.05}>
                <Card variant="elevated" className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-primary">Your Impact</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      "Funds temple-approved campaign work",
                      "Supports accountable donation tracking",
                      "Keeps devotees informed through live progress",
                      "Helps sustain community service",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3 p-3 rounded-xl bg-bg-secondary/50">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-text-secondary">{item}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <Card variant="elevated" className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 flex items-center justify-center">
                     <Landmark className="h-5 w-5 text-purple-600" />
                  </div>
                    <h2 className="text-2xl font-heading font-bold text-primary">Bank Account Details</h2>
                  </div>
                  {settings.bank_account_number || settings.upi_id ? (
                    <div className="space-y-3">
                      {[
                        { label: "Account Name", value: settings.bank_account_name, icon: Building2, field: "Account Name" },
                        { label: "Account Number", value: settings.bank_account_number, icon: CreditCard, field: "Account Number" },
                        { label: "Bank Name", value: settings.bank_name, icon: Landmark, field: "Bank Name" },
                        { label: "IFSC Code", value: settings.bank_ifsc, icon: Banknote, field: "IFSC Code" },
                        { label: "Branch", value: settings.bank_branch, icon: Building2, field: "Branch" },
                      ].map(({ label, value, icon: Icon, field }) => (
                        <div key={label} className="flex items-center justify-between p-4 rounded-xl bg-bg-secondary/50 border border-border/50">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-9 h-9 rounded-lg bg-white dark:bg-bg-primary flex items-center justify-center shrink-0">
                              <Icon className="h-4 w-4 text-text-muted" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-text-muted">{label}</p>
                              <p className="text-sm font-semibold text-text-primary font-mono break-all">{value}</p>
                            </div>
                          </div>
                          {value && (
                            <button
                              type="button"
                              onClick={() => handleCopy(value, field)}
                              className="ml-3 shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-secondary/50 bg-white dark:bg-bg-secondary text-xs font-medium text-text-secondary hover:text-primary hover:bg-primary/5 transition-all"
                            >
                              {copiedField === field ? (
                                <><Check className="h-3.5 w-3.5 text-emerald-500" /> Copied</>
                              ) : (
                                <><Copy className="h-3.5 w-3.5" /> Copy</>
                              )}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-xl bg-bg-secondary/50 border border-border/50 text-center">
                      <p className="text-text-muted text-sm">Bank details are being updated. Please contact the temple office for donation details.</p>
                    </div>
                  )}
                </Card>
              </AnimatedSection>

              <AnimatedSection delay={0.15}>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card variant="elevated" className="p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 flex items-center justify-center">
                        <Smartphone className="h-5 w-5 text-cyan-600" />
                      </div>
                      <h2 className="text-xl font-heading font-bold text-primary">UPI Payment</h2>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-48 h-48 rounded-2xl border-2 border-border bg-white p-3 flex items-center justify-center mb-4 shadow-sm">
                        {!qrError ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={getQRImageSrc()}
                            alt="UPI QR Code"
                            className="w-full h-full object-contain"
                            onError={() => setQrError(true)}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-text-muted">
                            <QrCode className="h-16 w-16 mb-2" />
                            <p className="text-xs">Scan QR in UPI App</p>
                          </div>
                        )}
                      </div>
                      <div className="w-full flex items-center justify-between p-3 rounded-xl bg-bg-secondary/50 border border-border/50">
                        <div className="min-w-0 flex-1 mr-2">
                          <p className="text-xs text-text-muted">UPI ID</p>
                          <p className="text-sm font-semibold text-text-primary font-mono break-all">{settings.upi_id}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(settings.upi_id, "UPI ID")}
                          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-secondary/50 bg-white dark:bg-bg-secondary text-xs font-medium text-text-secondary hover:text-primary hover:bg-primary/5 transition-all"
                        >
                          {copiedField === "UPI ID" ? (
                            <><Check className="h-3.5 w-3.5 text-emerald-500" /> Copied</>
                          ) : (
                            <><Copy className="h-3.5 w-3.5" /> Copy</>
                          )}
                        </button>
                      </div>
                    </div>
                  </Card>

                  <Card variant="elevated" className="p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/10 flex items-center justify-center">
                        <ArrowRightCircle className="h-5 w-5 text-amber-600" />
                      </div>
                      <h2 className="text-xl font-heading font-bold text-primary">How to Pay</h2>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-cyan-600" /> UPI Payment Steps:
                        </h3>
                        <ol className="space-y-2 text-sm text-text-secondary ml-6">
                          {[
                            "Open any UPI App (GPay / PhonePe / Paytm / BHIM)",
                            "Tap 'Scan QR' and scan the QR code OR enter the UPI ID",
                            "Enter the donation amount",
                            "Enter your UPI PIN and complete payment",
                            "Note the Transaction ID for reference",
                          ].map((step, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-xs font-bold text-primary shrink-0 w-5">{i + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div className="border-t border-border pt-4">
                        <h3 className="text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
                          <Landmark className="h-4 w-4 text-purple-600" /> Bank Transfer Steps:
                        </h3>
                        <ol className="space-y-2 text-sm text-text-secondary ml-6">
                          {[
                            "Open your Net Banking / Mobile Banking App",
                            "Go to Fund Transfer > Add Beneficiary / Payee",
                            "Enter Bank Account details shown above",
                            "Wait for beneficiary activation (if needed)",
                            "Transfer the donation amount via NEFT/RTGS/IMPS",
                            "Save the transaction reference number",
                          ].map((step, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-xs font-bold text-primary shrink-0 w-5">{i + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200/50 dark:border-emerald-800/30">
                        <Shield className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-text-secondary leading-relaxed">
                          After completing payment, please fill the donation form and submit your record. Our team will verify and update your donation.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <Card variant="elevated" className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <CircleDollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-primary">Campaign Progress</h2>
                  </div>
                  <ProgressBar raised={raised} goal={goal} size="lg" />
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-4 rounded-xl bg-bg-secondary/50">
                      <Target className="h-5 w-5 text-primary mx-auto mb-1" />
                      <p className="text-lg font-bold text-primary font-heading">{percentage}%</p>
                      <p className="text-xs text-text-muted">Funded</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-bg-secondary/50">
                      <Users className="h-5 w-5 text-primary mx-auto mb-1" />
                      <p className="text-lg font-bold text-primary font-heading">{donors}</p>
                      <p className="text-xs text-text-muted">Donors</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-bg-secondary/50">
                      <CalendarDays className="h-5 w-5 text-primary mx-auto mb-1" />
                      <p className="text-lg font-bold text-primary font-heading">{daysLeft ?? "Open"}</p>
                      <p className="text-xs text-text-muted">Days Left</p>
                    </div>
                  </div>
                </Card>
              </AnimatedSection>
            </div>

            <div className="lg:col-span-2">
              <AnimatedSection delay={0.1} className="sticky top-6">
                <div className="text-center mb-6 p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border">
                  <p className="text-sm text-text-muted">Support</p>
                  <h3 className="text-2xl font-heading font-bold text-primary">{campaign.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold gradient-text">{formatPrice(raised)}</span>
                    <span className="text-text-muted text-sm"> / {formatPrice(goal)}</span>
                  </div>
                </div>
                {submitError && <p className="mb-3 text-sm text-red-600">{submitError}</p>}
                <DonationForm campaignName={campaign.name} onSubmit={handleDonationSubmit} loading={submitting} />
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
