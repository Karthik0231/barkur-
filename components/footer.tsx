"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Landmark, MessageCircle, MapPin, Phone, Mail, Clock } from "lucide-react"
import { FaInstagram, FaFacebook, FaYoutube, FaWhatsapp } from "react-icons/fa"
import {
  TEMPLE_NAME,
  TEMPLE_LOCATION,
  TEMPLE_PHONE,
  TEMPLE_EMAIL,
  TEMPLE_ADDRESS,
  TEMPLE_TIMINGS,
} from "@/lib/constants"
import { NewsletterForm } from "@/components/newsletter-form"

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Sevas", href: "/sevas" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
  { label: "Donate", href: "/donate" },
]

const SEVAS_LINKS = [
  { label: "Daily Sevas", href: "/sevas" },
  { label: "Special Sevas", href: "/special-sevas" },
  { label: "Shashwatha Sevas", href: "/shashwatha-sevas" },
  { label: "Homas", href: "/homas" },
  { label: "Festivals", href: "/festivals" },
]

function FooterColumn({
  children,
  delay,
}: {
  children: React.ReactNode
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-slate-900 via-slate-900 to-rose-950">
      {/* Decorative top border */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

      {/* Background ornaments */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-rose-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        {/* Grid */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Column 1: Brand */}
          <FooterColumn delay={0}>
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-rose-700 text-white shadow-lg">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                  {TEMPLE_NAME}
                </p>
                <p className="text-xs text-white/50">Barkur, Udupi</p>
              </div>
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-white/60">
              A sacred shrine dedicated to Sri Kalikamba Devi, serving devotees with
              divine grace and traditional rituals since time immemorial.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://instagram.com/shrikalikambatemple"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/60 transition-all hover:bg-rose-500/20 hover:text-rose-400"
                aria-label="Follow us on Instagram"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/60 transition-all hover:bg-blue-500/20 hover:text-blue-400"
                aria-label="Follow us on Facebook"
              >
                <FaFacebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/60 transition-all hover:bg-red-500/20 hover:text-red-400"
                aria-label="Subscribe on YouTube"
              >
                <FaYoutube className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/${TEMPLE_PHONE.replace(/[\s\-]/g, "").replace(/^\+/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/60 transition-all hover:bg-emerald-500/20 hover:text-emerald-400"
                aria-label="Chat on WhatsApp"
              >
                <FaWhatsapp className="h-4 w-4" />
              </a>
            </div>
          </FooterColumn>

          {/* Column 2: Quick Links */}
          <FooterColumn delay={0.1}>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-amber-400 uppercase">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-amber-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          {/* Column 3: Sevas */}
          <FooterColumn delay={0.2}>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-amber-400 uppercase">
              Sevas
            </h3>
            <ul className="space-y-2.5">
              {SEVAS_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-amber-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          {/* Column 4: Contact */}
          <FooterColumn delay={0.3}>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-amber-400 uppercase">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/70" />
                <span className="text-sm text-white/60">{TEMPLE_ADDRESS}</span>
              </li>
              <li>
                <a
                  href={`tel:${TEMPLE_PHONE}`}
                  className="flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-amber-400"
                >
                  <Phone className="h-4 w-4 shrink-0 text-amber-400/70" />
                  {TEMPLE_PHONE}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${TEMPLE_EMAIL}`}
                  className="flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-amber-400"
                >
                  <Mail className="h-4 w-4 shrink-0 text-amber-400/70" />
                  {TEMPLE_EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/70" />
                <div className="text-sm text-white/60">
                  <p>Morning: {TEMPLE_TIMINGS.morning}</p>
                  <p>Evening: {TEMPLE_TIMINGS.evening}</p>
                </div>
              </li>
            </ul>
          </FooterColumn>
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
        >
          <div className="mx-auto max-w-xl text-center">
            <h3 className="text-lg font-semibold text-white">
              Stay Connected
            </h3>
            <p className="mt-1 text-sm text-white/50">
              Subscribe to receive temple updates, event notifications, and spiritual insights.
            </p>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-white/40">
              &copy; {new Date().getFullYear()} {TEMPLE_NAME}. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="text-xs text-white/40 transition-colors hover:text-white/60"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-white/40 transition-colors hover:text-white/60"
              >
                Terms of Service
              </Link>
              <Link
                href="/refund"
                className="text-xs text-white/40 transition-colors hover:text-white/60"
              >
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
