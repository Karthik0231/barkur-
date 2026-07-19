"use client"

import { useRef, useState, type FormEvent } from "react"
import { motion, useInView } from "framer-motion"
import { Sparkles, Mail, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"

export function NewsletterSection() {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  function validateEmail(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrorMsg("")

    if (!email.trim()) {
      setStatus("error")
      setErrorMsg(t("newsletter.emailRequired"))
      return
    }

    if (!validateEmail(email)) {
      setStatus("error")
      setErrorMsg(t("newsletter.emailInvalid"))
      return
    }

    setStatus("loading")
    await new Promise((r) => setTimeout(r, 1500))
    setStatus("success")
    setEmail("")
  }

  return (
    <section ref={ref} className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gold-100 via-warm-ivory to-amber-50" />

      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(201, 168, 76, 1) 1px, transparent 0)`,
          backgroundSize: "30px 30px",
        }}
      />

      <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gold-300/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md border border-gold-200/40"
          >
            <Mail className="h-8 w-8 text-gold-500" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-dark-slate leading-tight">
            {t("newsletter.stayConnected")}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-gold-500">
              {t("newsletter.withTemple")}
            </span>
          </h2>

          <p className="mt-4 text-base text-dark-slate/60 max-w-lg mx-auto">
            {t("newsletter.subtitle")}
          </p>

          <div className="mt-8 max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <div className="relative flex items-center">
                <Mail className="pointer-events-none absolute left-3 h-4 w-4 text-dark-slate/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (status === "error") setStatus("idle")
                  }}
                  placeholder={t("newsletter.emailPlaceholder")}
                  disabled={status === "loading" || status === "success"}
                  className={cn(
                    "w-full rounded-xl border border-gold-200/60 bg-white py-3 pl-10 pr-32 text-sm text-dark-slate placeholder:text-dark-slate/40",
                    "focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-200/40",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                    "transition-all duration-200 shadow-sm"
                  )}
                  aria-label="Email for newsletter"
                />
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className={cn(
                    "absolute right-1.5 flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium transition-all",
                    "bg-gradient-to-r from-primary to-maroon-700 text-white shadow-md shadow-primary/20",
                    "hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02]",
                    "disabled:cursor-not-allowed disabled:opacity-70"
                  )}
                >
                  {status === "loading" ? (
                    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : status === "success" ? (
                    <CheckCircle className="h-3.5 w-3.5" />
                  ) : (
                    t("footer.subscribe")
                  )}
                </button>
              </div>
            </form>

            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center gap-1.5 text-xs text-red-500"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                {errorMsg}
              </motion.p>
            )}

            {status === "success" && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 flex items-center gap-1.5 text-xs text-leaf-500"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                {t("newsletter.subscribed")}
              </motion.p>
            )}
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-dark-slate/40">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-gold-400" />
              {t("newsletter.weeklyUpdates")}
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-gold-400" />
              {t("newsletter.noSpam")}
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-gold-400" />
              {t("newsletter.unsubscribe")}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
