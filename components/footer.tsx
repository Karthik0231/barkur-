"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useTranslation } from "@/lib/i18n"

import {
  Landmark,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
  Heart,
  ChevronRight,
} from "lucide-react"

import {
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa"

import {
  TEMPLE_NAME,
  TEMPLE_LOCATION,
  TEMPLE_PHONE,
  TEMPLE_EMAIL,
  TEMPLE_ADDRESS,
  TEMPLE_TIMINGS,
  SOCIAL_LINKS,
} from "@/lib/constants"

/* -------------------------------------------------------------------------- */
/* Links                                                                      */
/* -------------------------------------------------------------------------- */

const QUICK_LINKS = [
  { labelKey: "nav.home", href: "/" },
  { labelKey: "nav.about", href: "/about" },
  { labelKey: "nav.sevas", href: "/sevas" },
  { labelKey: "nav.gallery", href: "/gallery" },
  { labelKey: "nav.hallBooking", href: "/hall-booking" },
  { labelKey: "nav.contact", href: "/contact" },
  { labelKey: "nav.donate", href: "/donate" },
]

const SEVAS_LINKS = [
  { labelKey: "nav.dailySevas", href: "/sevas" },
  { labelKey: "nav.specialSevas", href: "/special-sevas" },
  { labelKey: "nav.shashwathaSevas", href: "/shashwatha-sevas" },
  { labelKey: "nav.homas", href: "/homas" },
  { labelKey: "nav.sriChakraPooja", href: "/sri-chakra-pooja" },
  { labelKey: "nav.festivals", href: "/festivals" },
]

/* -------------------------------------------------------------------------- */
/* Animation                                                                  */
/* -------------------------------------------------------------------------- */

const columnVariants = {
  hidden: {
    opacity: 0,
    y: 25,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 8,
  },

  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.035,
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

/* -------------------------------------------------------------------------- */
/* Footer Column                                                              */
/* -------------------------------------------------------------------------- */

function FooterColumn({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        margin: "-70px",
      }}
      variants={{
        hidden: {
          opacity: 0,
          y: 25,
        },

        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.65,
            delay,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/* Section Heading                                                            */
/* -------------------------------------------------------------------------- */

function FooterHeading({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mb-5">
      <h3
        className="
          text-[11px]
          font-bold
          uppercase
          tracking-[0.2em]
          text-[#E3BE6B]
        "
      >
        {children}
      </h3>

      <div className="mt-2 flex items-center gap-2">
        <span className="h-px w-7 bg-[#DDB25C]/60" />
        <span className="h-1 w-1 rounded-full bg-[#DDB25C]" />
        <span className="h-px w-10 bg-[#DDB25C]/15" />
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Footer                                                                     */
/* -------------------------------------------------------------------------- */

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer
      className="
        relative
        overflow-hidden
        bg-[#17090F]
        text-white
      "
    >
      {/* ================================================================== */}
      {/* Decorative top border                                              */}
      {/* ================================================================== */}

      <div
        className="
          absolute
          inset-x-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#DDB25C]/70
          to-transparent
        "
      />

      <div
        className="
          absolute
          inset-x-0
          top-1
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#6B0F1A]/80
          to-transparent
        "
      />

      {/* ================================================================== */}
      {/* Background atmosphere                                              */}
      {/* ================================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Gold glow */}
        <div
          className="
            absolute
            -left-40
            -top-40
            h-[420px]
            w-[420px]
            rounded-full
            bg-[#DDB25C]/[0.045]
            blur-[100px]
          "
        />

        {/* Maroon glow */}
        <div
          className="
            absolute
            -right-40
            bottom-[-180px]
            h-[500px]
            w-[500px]
            rounded-full
            bg-[#6B0F1A]/35
            blur-[110px]
          "
        />

        {/* Center glow */}
        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[350px]
            w-[350px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#8A1420]/[0.025]
            blur-[100px]
          "
        />

        {/* Subtle pattern */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            bg-[linear-gradient(135deg,transparent_24%,#DDB25C_25%,transparent_26%,transparent_74%,#DDB25C_75%,transparent_76%)]
            bg-[length:42px_42px]
          "
        />
      </div>

      {/* ================================================================== */}
      {/* Main content                                                        */}
      {/* ================================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1440px]
          px-5
          pb-8
          pt-16
          sm:px-7
          sm:pt-20
          lg:px-10
        "
      >
        {/* ================================================================= */}
        {/* Temple identity strip                                             */}
        {/* ================================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: "-80px",
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            mb-14
            flex
            flex-col
            gap-6
            border-b
            border-[#DDB25C]/[0.10]
            pb-10
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          {/* Brand */}
          <Link
            href="/"
            className="
              group
              flex
              items-center
              gap-4
            "
          >
            {/* Emblem */}
            <motion.div
              whileHover={{
                scale: 1.04,
              }}
              className="
                relative
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-gradient-to-br
                from-[#8A1420]
                via-[#6B0F1A]
                to-[#420A10]
                border-2
                border-[#DDB25C]/80
                shadow-[0_8px_25px_rgba(0,0,0,0.3)]
              "
            >
              <Landmark className="h-6 w-6 text-[#F6E2A0]" />

              <span
                className="
                  absolute
                  inset-1
                  rounded-full
                  border
                  border-[#F6E2A0]/10
                "
              />
            </motion.div>

            <div>
              <p
                className="
                  text-base
                  font-heading
                  font-bold
                  tracking-wide
                  text-[#F6E2A0]
                  transition-colors
                  duration-200
                  group-hover:text-[#FFE9A9]
                "
              >
                {TEMPLE_NAME}
              </p>

              <p
                className="
                  mt-1
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-white/40
                "
              >
                {TEMPLE_LOCATION}
              </p>
            </div>
          </Link>

          {/* Spiritual line */}
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[#DDB25C]/30" />

            <span
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.18em]
                text-white/35
              "
            >
              ಶ್ರೀ ಕಾಳಿಕಾಂಬಾ ದೇವಸ್ಥಾನ
            </span>

            <span className="h-px w-10 bg-[#DDB25C]/30" />
          </div>
        </motion.div>

        {/* ================================================================= */}
        {/* Main grid                                                         */}
        {/* ================================================================= */}

        <div
          className="
            grid
            gap-12
            sm:grid-cols-2
            lg:grid-cols-[1.35fr_0.8fr_0.8fr_1.25fr]
            lg:gap-10
            xl:gap-16
          "
        >
          {/* =============================================================== */}
          {/* Brand                                                            */}
          {/* =============================================================== */}

          <FooterColumn delay={0}>
            <div className="max-w-sm">
              <FooterHeading>
                {t("footer.aboutTemple")}
              </FooterHeading>

              <p
                className="
                  text-[13px]
                  leading-7
                  text-white/52
                "
              >
                {t("footer.brandDescription")}
              </p>

              {/* Socials */}
              <div className="mt-7 flex items-center gap-2.5">
                {SOCIAL_LINKS.instagram && (
                  <motion.a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{
                      y: -3,
                    }}
                    whileTap={{
                      scale: 0.92,
                    }}
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/[0.08]
                      bg-white/[0.035]
                      text-white/50
                      transition-all
                      duration-200
                      hover:border-[#DDB25C]/30
                      hover:bg-[#DDB25C]/[0.08]
                      hover:text-[#E3BE6B]
                    "
                    aria-label={t("footer.followInstagram")}
                  >
                    <FaInstagram className="h-4 w-4" />
                  </motion.a>
                )}

                {SOCIAL_LINKS.facebook && (
                  <motion.a
                    href={SOCIAL_LINKS.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{
                      y: -3,
                    }}
                    whileTap={{
                      scale: 0.92,
                    }}
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/[0.08]
                      bg-white/[0.035]
                      text-white/50
                      transition-all
                      duration-200
                      hover:border-[#DDB25C]/30
                      hover:bg-[#DDB25C]/[0.08]
                      hover:text-[#E3BE6B]
                    "
                    aria-label={t("footer.followFacebook")}
                  >
                    <FaFacebook className="h-4 w-4" />
                  </motion.a>
                )}

                {SOCIAL_LINKS.youtube && (
                  <motion.a
                    href={SOCIAL_LINKS.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{
                      y: -3,
                    }}
                    whileTap={{
                      scale: 0.92,
                    }}
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-white/[0.08]
                      bg-white/[0.035]
                      text-white/50
                      transition-all
                      duration-200
                      hover:border-[#DDB25C]/30
                      hover:bg-[#DDB25C]/[0.08]
                      hover:text-[#E3BE6B]
                    "
                    aria-label={t("footer.subscribeYoutube")}
                  >
                    <FaYoutube className="h-4 w-4" />
                  </motion.a>
                )}

                <motion.a
                  href={`https://wa.me/${TEMPLE_PHONE
                    .replace(/[\s\-]/g, "")
                    .replace(/^\+/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{
                    y: -3,
                  }}
                  whileTap={{
                    scale: 0.92,
                  }}
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/[0.08]
                    bg-white/[0.035]
                    text-white/50
                    transition-all
                    duration-200
                    hover:border-[#DDB25C]/30
                    hover:bg-[#DDB25C]/[0.08]
                    hover:text-[#E3BE6B]
                  "
                  aria-label={t("footer.chatWhatsapp")}
                >
                  <FaWhatsapp className="h-4 w-4" />
                </motion.a>
              </div>
            </div>
          </FooterColumn>

          {/* =============================================================== */}
          {/* Quick Links                                                      */}
          {/* =============================================================== */}

          <FooterColumn delay={0.08}>
            <FooterHeading>
              {t("footer.quickLinks")}
            </FooterHeading>

            <ul className="space-y-1">
              {QUICK_LINKS.map((link, index) => (
                <motion.li
                  key={link.href}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Link
                    href={link.href}
                    className="
                      group
                      flex
                      items-center
                      gap-2
                      rounded-lg
                      py-1.5
                      text-[13px]
                      text-white/50
                      transition-all
                      duration-200
                      hover:translate-x-1
                      hover:text-[#E3BE6B]
                    "
                  >
                    <ChevronRight
                      className="
                        h-3
                        w-3
                        text-[#DDB25C]/30
                        transition-all
                        duration-200
                        group-hover:text-[#DDB25C]
                      "
                    />

                    <span>{t(link.labelKey)}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </FooterColumn>

          {/* =============================================================== */}
          {/* Sevas                                                            */}
          {/* =============================================================== */}

          <FooterColumn delay={0.16}>
            <FooterHeading>
              {t("footer.sevas")}
            </FooterHeading>

            <ul className="space-y-1">
              {SEVAS_LINKS.map((link, index) => (
                <motion.li
                  key={link.href}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Link
                    href={link.href}
                    className="
                      group
                      flex
                      items-center
                      gap-2
                      rounded-lg
                      py-1.5
                      text-[13px]
                      text-white/50
                      transition-all
                      duration-200
                      hover:translate-x-1
                      hover:text-[#E3BE6B]
                    "
                  >
                    <ChevronRight
                      className="
                        h-3
                        w-3
                        text-[#DDB25C]/30
                        transition-all
                        duration-200
                        group-hover:text-[#DDB25C]
                      "
                    />

                    <span>{t(link.labelKey)}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </FooterColumn>

          {/* =============================================================== */}
          {/* Contact                                                          */}
          {/* =============================================================== */}

          <FooterColumn delay={0.24}>
            <FooterHeading>
              {t("footer.contact")}
            </FooterHeading>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-[#DDB25C]/[0.07]
                    border
                    border-[#DDB25C]/[0.10]
                  "
                >
                  <MapPin className="h-3.5 w-3.5 text-[#DDB25C]" />
                </div>

                <p
                  className="
                    pt-1
                    text-[12px]
                    leading-5
                    text-white/50
                  "
                >
                  {TEMPLE_ADDRESS}
                </p>
              </div>

              {/* Phone */}
              <a
                href={`tel:${TEMPLE_PHONE}`}
                className="
                  group
                  flex
                  items-center
                  gap-3
                  text-[12px]
                  text-white/50
                  transition-colors
                  hover:text-[#E3BE6B]
                "
              >
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-[#DDB25C]/[0.07]
                    border
                    border-[#DDB25C]/[0.10]
                  "
                >
                  <Phone className="h-3.5 w-3.5 text-[#DDB25C]" />
                </div>

                <span>{TEMPLE_PHONE}</span>

                <ArrowUpRight
                  className="
                    ml-auto
                    h-3
                    w-3
                    opacity-0
                    transition-all
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                    group-hover:opacity-100
                  "
                />
              </a>

              {/* Email */}
              <a
                href={`mailto:${TEMPLE_EMAIL}`}
                className="
                  group
                  flex
                  items-center
                  gap-3
                  text-[12px]
                  text-white/50
                  transition-colors
                  hover:text-[#E3BE6B]
                "
              >
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-[#DDB25C]/[0.07]
                    border
                    border-[#DDB25C]/[0.10]
                  "
                >
                  <Mail className="h-3.5 w-3.5 text-[#DDB25C]" />
                </div>

                <span className="break-all">
                  {TEMPLE_EMAIL}
                </span>

                <ArrowUpRight
                  className="
                    ml-auto
                    h-3
                    w-3
                    shrink-0
                    opacity-0
                    transition-all
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                    group-hover:opacity-100
                  "
                />
              </a>

              {/* Timings */}
              <div className="flex items-start gap-3">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-[#DDB25C]/[0.07]
                    border
                    border-[#DDB25C]/[0.10]
                  "
                >
                  <Clock className="h-3.5 w-3.5 text-[#DDB25C]" />
                </div>

                <div
                  className="
                    pt-0.5
                    text-[11px]
                    leading-5
                    text-white/50
                  "
                >
                  <p>
                    <span className="text-white/35">
                      {t("timings.morning")}:
                    </span>{" "}
                    {TEMPLE_TIMINGS.morning}
                  </p>

                  <p>
                    <span className="text-white/35">
                      {t("timings.evening")}:
                    </span>{" "}
                    {TEMPLE_TIMINGS.evening}
                  </p>
                </div>
              </div>
            </div>
          </FooterColumn>
        </div>

        {/* ================================================================= */}
        {/* Seva CTA                                                          */}
        {/* ================================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: "-70px",
          }}
          transition={{
            duration: 0.65,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            mt-14
            overflow-hidden
            rounded-2xl
            border
            border-[#DDB25C]/[0.13]
            bg-gradient-to-r
            from-[#6B0F1A]/30
            via-[#7A101C]/20
            to-[#6B0F1A]/10
            px-5
            py-5
            sm:px-7
          "
        >
          {/* Decorative glow */}
          <div
            className="
              pointer-events-none
              absolute
              -right-10
              -top-16
              h-40
              w-40
              rounded-full
              bg-[#DDB25C]/[0.06]
              blur-3xl
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <div className="flex items-center gap-2">
                <Heart className="h-3.5 w-3.5 text-[#DDB25C]" />

                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-[#DDB25C]
                  "
                >
                  {t("footer.stayConnected")}
                </span>
              </div>

              <p
                className="
                  mt-1.5
                  text-[12px]
                  leading-5
                  text-white/45
                "
              >
                {t("footer.newsletterDesc")}
              </p>
            </div>

            <Link
              href="/sevas"
              className="
                inline-flex
                h-10
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-full
                border
                border-[#DDB25C]/30
                bg-[#DDB25C]/[0.08]
                px-5
                text-[11px]
                font-bold
                text-[#E3BE6B]
                transition-all
                duration-200
                hover:bg-[#DDB25C]/[0.14]
                hover:border-[#DDB25C]/50
              "
            >
              {t("nav.bookSeva")}

              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>

        {/* ================================================================= */}
        {/* Bottom bar                                                        */}
        {/* ================================================================= */}

        <div
          className="
            mt-10
            border-t
            border-white/[0.07]
            pt-6
          "
        >
          <div
            className="
              flex
              flex-col
              items-center
              gap-5
              text-center
              sm:flex-row
              sm:justify-between
              sm:text-left
            "
          >
            <p
              className="
                text-[10px]
                leading-5
                text-white/30
              "
            >
              &copy; {new Date().getFullYear()}{" "}
              {TEMPLE_NAME}.{" "}
              {t("footer.copyright")}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <Link
                href="/privacy-policy"
                className="
                  text-[10px]
                  text-white/30
                  transition-colors
                  hover:text-[#DDB25C]
                "
              >
                {t("nav.privacy")}
              </Link>

              <Link
                href="/terms"
                className="
                  text-[10px]
                  text-white/30
                  transition-colors
                  hover:text-[#DDB25C]
                "
              >
                {t("nav.terms")}
              </Link>

              <Link
                href="/refund-policy"
                className="
                  text-[10px]
                  text-white/30
                  transition-colors
                  hover:text-[#DDB25C]
                "
              >
                {t("nav.refund")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}