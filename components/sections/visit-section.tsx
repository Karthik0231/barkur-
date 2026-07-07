"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Clock, MapPin, Phone, Mail, ArrowRight, Compass } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import {
  TEMPLE_ADDRESS,
  TEMPLE_PHONE,
  TEMPLE_EMAIL,
  TEMPLE_TIMINGS,
} from "@/lib/constants"

const cards = [
  {
    icon: Clock,
    title: "Opening Hours",
    lines: [
      { label: "Morning", value: TEMPLE_TIMINGS.morning },
      { label: "Evening", value: TEMPLE_TIMINGS.evening },
    ],
  },
  {
    icon: MapPin,
    title: "Location",
    lines: [
      { label: "Address", value: TEMPLE_ADDRESS },
    ],
    action: {
      label: "Get Directions",
      href: "https://maps.google.com/?q=Sri+Kalikamba+Temple+Barkur",
    },
  },
  {
    icon: Phone,
    title: "Contact",
    lines: [
      { label: "Phone", value: TEMPLE_PHONE, href: `tel:${TEMPLE_PHONE}` },
      { label: "Email", value: TEMPLE_EMAIL, href: `mailto:${TEMPLE_EMAIL}` },
    ],
  },
]

export function VisitSection() {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden bg-gradient-to-b from-warm-ivory to-gold-50/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(212,175,55,0.03)_0%,_transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-script font-semibold text-dark-slate leading-tight">
            Visit the Temple
          </h2>
          <div className="mt-4 h-0.5 w-16 rounded-full bg-gradient-to-r from-gold-400 to-gold-600" />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-[55%]"
          >
            <div className="relative h-[320px] sm:h-[400px] lg:h-[520px] rounded-2xl border border-gold-200/40 overflow-hidden bg-[#F5F0E8] shadow-premium">
              <div className="absolute inset-0 opacity-[0.15]"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 30% 40%, rgba(212,175,55,0.3) 0%, transparent 40%),
                    radial-gradient(circle at 70% 60%, rgba(180,150,100,0.15) 0%, transparent 35%),
                    repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(180,160,130,0.08) 20px, rgba(180,160,130,0.08) 21px),
                    repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(180,160,130,0.08) 20px, rgba(180,160,130,0.08) 21px)
                  `,
                }}
              />

              <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                <span className="text-xs font-medium text-dark-slate/40 tracking-wider uppercase">Google Maps</span>
                <div className="flex items-center gap-1.5 text-dark-slate/30">
                  <Compass className="h-4 w-4" />
                  <span className="text-[10px] font-medium tracking-wider">N</span>
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/60 backdrop-blur-sm border border-gold-200/50 shadow-lg mb-4">
                    <MapPin className="h-7 w-7 text-gold-600" />
                  </div>
                  <p className="text-sm font-medium text-dark-slate/70">Sri Kalikamba Temple</p>
                  <p className="text-xs text-dark-slate/40 mt-1">Barkur, Udupi District</p>
                  <p className="text-[10px] text-dark-slate/30 mt-0.5">13.47&deg;N, 74.75&deg;E</p>
                </div>
              </div>

              <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
                <a
                  href="https://maps.google.com/?q=Sri+Kalikamba+Temple+Barkur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gold-200/40 text-xs font-medium text-dark-slate/70 hover:text-primary hover:border-gold-400/60 transition-all shadow-sm"
                >
                  <MapPin className="h-3 w-3" />
                  Open in Google Maps
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </motion.div>

          <div className="lg:w-[45%] flex flex-col gap-5">
            {cards.map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 40 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -4 }}
                  className="group rounded-xl border border-gold-200/20 bg-[#FAF7F1] p-5 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300"
                  style={{ borderLeft: "3px solid #D4AF37" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-50 shrink-0">
                      <Icon className="h-5 w-5 text-gold-600" />
                    </div>
                    <h3 className="text-base font-heading font-bold text-dark-slate">{card.title}</h3>
                  </div>

                  <div className="space-y-2.5">
                    {card.lines.map((line, j) => {
                      const content = (
                        <div key={j} className="flex items-start gap-2">
                          <span className="text-xs text-dark-slate/40 w-16 sm:w-20 shrink-0 pt-0.5">{line.label}</span>
                          <span className="text-sm text-dark-slate/80">{line.value}</span>
                        </div>
                      )
                      if ("href" in line && line.href) {
                        return (
                          <a key={j} href={line.href} className="block hover:text-primary transition-colors">
                            {content}
                          </a>
                        )
                      }
                      return content
                    })}
                  </div>

                  {card.action && (
                    <a
                      href={card.action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-gold-600 hover:text-gold-700 transition-colors group/link"
                    >
                      {card.action.label}
                      <ArrowRight className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
                    </a>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
