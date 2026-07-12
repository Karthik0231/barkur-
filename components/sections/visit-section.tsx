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
            <div className="relative h-[320px] sm:h-[400px] lg:h-[520px] overflow-hidden rounded-2xl border border-gold-200/40 shadow-premium bg-white">
  <iframe
    title="Shri Kalikamba Temple"
    src="https://www.google.com/maps?q=13.4666553,74.7522106&z=17&output=embed"
    width="100%"
    height="100%"
    loading="lazy"
    allowFullScreen
    referrerPolicy="no-referrer-when-downgrade"
    className="absolute inset-0 h-full w-full border-0"
  />

  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10">
    <a
      href="https://www.google.com/maps/place/Shri+Kalikamba+Temple/@13.4666553,74.7496357,17z/data=!4m16!1m9!3m8!1s0x3bbc97bf39f7c9b5:0x139619cb2edb81fb!2sShri+Kalikamba+Temple!8m2!3d13.4666553!4d74.7522106!9m1!1b1!16s%2Fg%2F11c2rb530h!3m5!1s0x3bbc97bf39f7c9b5:0x139619cb2edb81fb!8m2!3d13.4666553!4d74.7522106!16s%2Fg%2F11c2rb530h?entry=ttu"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-medium text-dark-slate shadow-lg backdrop-blur transition-all hover:scale-105 hover:bg-white"
    >
      <MapPin className="h-4 w-4 text-gold-600" />
      Open in Google Maps
      <ArrowRight className="h-4 w-4" />
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
