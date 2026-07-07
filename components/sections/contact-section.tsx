"use client"

import { useState, useRef, type FormEvent } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  TEMPLE_ADDRESS,
  TEMPLE_PHONE,
  TEMPLE_EMAIL,
  TEMPLE_TIMINGS,
} from "@/lib/constants"
import { useTranslation } from "@/lib/i18n"

function ContactInfo({ icon: Icon, label, value, href }: { icon: React.ElementType; label: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-center gap-3 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-50 shrink-0">
        <Icon className="h-5 w-5 text-gold-500" />
      </div>
      <div>
        <p className="text-xs text-dark-slate/50">{label}</p>
        {href ? (
          <a href={href} className="text-sm font-medium text-dark-slate hover:text-primary transition-colors">
            {value}
          </a>
        ) : (
          <p className="text-sm font-medium text-dark-slate">{value}</p>
        )}
      </div>
    </div>
  )

  return content
}

export function ContactSection() {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    await new Promise((r) => setTimeout(r, 1500))
    setStatus("success")
    setFormData({ name: "", email: "", message: "" })
  }

  return (
    <section ref={ref} className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-gold-50/20 to-warm-ivory">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(107,15,26,0.02)_0%,_transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-dark-slate">
            Visit & Connect
          </h2>
          <p className="mt-3 text-base sm:text-lg text-dark-slate/50 max-w-xl">
            We would love to hear from you. Reach out for queries, seva bookings, or feedback.
          </p>
          <div className="mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-primary to-gold-500" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="h-full rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-premium">
              <h3 className="text-xl font-heading font-bold text-dark-slate mb-6">Get in Touch</h3>

              <div className="divide-y divide-border/30">
                <ContactInfo
                  icon={MapPin}
                  label="Temple Address"
                  value={TEMPLE_ADDRESS}
                />
                <ContactInfo
                  icon={Phone}
                  label="Phone"
                  value={TEMPLE_PHONE}
                  href={`tel:${TEMPLE_PHONE}`}
                />
                <ContactInfo
                  icon={Mail}
                  label="Email"
                  value={TEMPLE_EMAIL}
                  href={`mailto:${TEMPLE_EMAIL}`}
                />
                <ContactInfo
                  icon={Clock}
                  label={t("timings.templeTimings")}
                  value={`Morning: ${TEMPLE_TIMINGS.morning} | Evening: ${TEMPLE_TIMINGS.evening}`}
                />
              </div>

              <div className="mt-6 relative overflow-hidden rounded-2xl h-48 bg-gradient-to-br from-gold-100 via-amber-50 to-warm-ivory border border-gold-200/30">
                <div className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, rgba(201, 168, 76, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(107, 15, 26, 0.2) 0%, transparent 50%)`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-gold-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-dark-slate/80">Barkur, Udupi District</p>
                    <p className="text-xs text-dark-slate/50">Karnataka, India</p>
                    <p className="mt-2 text-[10px] text-dark-slate/40">13.47°N, 74.75°E</p>
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1 text-[10px] text-dark-slate/40">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" />
                  <span>Temple Location</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="h-full rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-premium">
              <h3 className="text-xl font-heading font-bold text-dark-slate mb-6">Send a Message</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-dark-slate">Your Name</label>
                  <input
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                    className={cn(
                      "w-full rounded-xl border border-border bg-warm-ivory px-4 py-3 text-sm text-dark-slate placeholder:text-dark-slate/40",
                      "focus:border-gold-400 focus:ring-2 focus:ring-gold-200/30 focus-visible:outline-none",
                      "transition-all duration-200",
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-dark-slate">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    className={cn(
                      "w-full rounded-xl border border-border bg-warm-ivory px-4 py-3 text-sm text-dark-slate placeholder:text-dark-slate/40",
                      "focus:border-gold-400 focus:ring-2 focus:ring-gold-200/30 focus-visible:outline-none",
                      "transition-all duration-200",
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-dark-slate">Message</label>
                  <textarea
                    placeholder="Write your message..."
                    value={formData.message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                    required
                    rows={4}
                    className={cn(
                      "w-full rounded-xl border border-border bg-warm-ivory px-4 py-3 text-sm text-dark-slate placeholder:text-dark-slate/40",
                      "focus:border-gold-400 focus:ring-2 focus:ring-gold-200/30 focus-visible:outline-none",
                      "transition-all duration-200 resize-none",
                    )}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className={cn(
                    "inline-flex items-center justify-center w-full gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                    "bg-gradient-to-r from-primary to-maroon-700 text-white",
                    "hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]",
                    "disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100",
                  )}
                >
                  {status === "loading" ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </span>
                  ) : status === "success" ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {status === "success" && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="text-sm text-leaf-500 text-center font-medium"
                    >
                      Thank you! We will get back to you soon.
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
