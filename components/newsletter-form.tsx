"use client"

import { useState, type FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, CheckCircle, AlertCircle, ArrowRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function NewsletterForm() {
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
      setErrorMsg("Please enter your email address")
      return
    }

    if (!validateEmail(email)) {
      setStatus("error")
      setErrorMsg("Please enter a valid email address")
      return
    }

    setStatus("loading")

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500))
    setStatus("success")
    setEmail("")
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Mail className="pointer-events-none absolute left-3 h-4 w-4 text-white/50" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status === "error") setStatus("idle")
            }}
            placeholder="Your email address"
            disabled={status === "loading" || status === "success"}
            className={cn(
              "w-full rounded-lg border border-white/20 bg-white/10 py-2.5 pl-10 pr-28 text-sm text-white placeholder:text-white/40",
              "focus:border-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-400/20",
              "disabled:cursor-not-allowed disabled:opacity-60",
              "transition-all duration-200"
            )}
            aria-label="Email for newsletter"
          />
          <motion.button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className={cn(
              "absolute right-1.5 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20",
              "hover:from-amber-400 hover:to-amber-500",
              "disabled:cursor-not-allowed disabled:opacity-70"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {status === "loading" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : status === "success" ? (
              <CheckCircle className="h-3.5 w-3.5" />
            ) : (
              <>
                Subscribe
                <ArrowRight className="h-3 w-3" />
              </>
            )}
          </motion.button>
        </div>
      </form>

      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-2 flex items-center gap-1.5 text-xs text-red-300"
          >
            <AlertCircle className="h-3.5 w-3.5" />
            {errorMsg}
          </motion.p>
        )}

        {status === "success" && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-2 flex items-center gap-1.5 text-xs text-emerald-300"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Thank you! You have been subscribed.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
