"use client"

import { motion } from "framer-motion"
import { Sun, ChevronDown } from "lucide-react"

interface PageBannerProps {
  title: string
  subtitle?: string
  eyebrow?: string
}

export function PageBanner({
  title,
  subtitle,
  eyebrow = "Sri Kalikamba Temple",
}: PageBannerProps) {
  return (
    <section
      className="
        relative
        isolate
        flex
        min-h-[440px]
        items-center
        overflow-hidden
        bg-[#4A0911]
        pt-[78px]
        sm:min-h-[490px]
        sm:pt-[86px]
        md:min-h-[530px]
        md:pt-[92px]
        lg:min-h-[550px]
      "
    >
      {/* ================================================================== */}
      {/* BACKGROUND                                                         */}
      {/* ================================================================== */}

      <div className="absolute inset-0 -z-30">
        {/* Deep base */}
        <div
          className="
            absolute
            inset-0
            bg-[linear-gradient(118deg,#35070D_0%,#5A0C15_38%,#73121D_68%,#430810_100%)]
          "
        />

        {/* Large warm light */}
        <div
          className="
            absolute
            -right-[12%]
            top-[5%]
            h-[620px]
            w-[620px]
            rounded-full
            bg-[#DDB25C]/[0.07]
            blur-[150px]
          "
        />

        {/* Left deep vignette */}
        <div
          className="
            absolute
            -left-[18%]
            top-[20%]
            h-[600px]
            w-[500px]
            rounded-full
            bg-[#220309]/40
            blur-[120px]
          "
        />

        {/* Top warm atmosphere */}
        <div
          className="
            absolute
            inset-x-0
            top-0
            h-[240px]
            bg-gradient-to-b
            from-[#F6E2A0]/[0.07]
            to-transparent
          "
        />
      </div>

      {/* ================================================================== */}
      {/* HUGE WATERMARK                                                      */}
      {/* ================================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-[4%]
          top-[16%]
          -z-20
          select-none
          font-heading
          text-[180px]
          font-bold
          leading-none
          text-[#F6E2A0]/[0.025]
          sm:text-[240px]
          md:text-[320px]
          lg:text-[390px]
        "
      >
        ಕಾ
      </div>

      {/* ================================================================== */}
      {/* ARCHITECTURAL GRID                                                  */}
      {/* ================================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
        "
      >
        {/* Vertical lines */}
        <div
          className="
            absolute
            bottom-0
            left-[8%]
            top-0
            w-px
            bg-gradient-to-b
            from-transparent
            via-[#DDB25C]/[0.08]
            to-transparent
          "
        />

        <div
          className="
            absolute
            bottom-0
            right-[8%]
            top-0
            w-px
            bg-gradient-to-b
            from-transparent
            via-[#DDB25C]/[0.08]
            to-transparent
          "
        />

        {/* Horizontal line */}
        <div
          className="
            absolute
            left-0
            right-0
            top-[26%]
            h-px
            bg-gradient-to-r
            from-transparent
            via-[#DDB25C]/[0.06]
            to-transparent
          "
        />

        {/* Fine vertical center guide */}
        <div
          className="
            absolute
            bottom-0
            left-1/2
            top-0
            hidden
            w-px
            bg-[#DDB25C]/[0.025]
            lg:block
          "
        />
      </div>

      {/* ================================================================== */}
      {/* TOP GOLD LINE                                                       */}
      {/* ================================================================== */}

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: 1,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="
          absolute
          inset-x-0
          top-0
          h-[2px]
          origin-center
          bg-gradient-to-r
          from-transparent
          via-[#DDB25C]
          to-transparent
        "
      />

      {/* ================================================================== */}
      {/* CONTENT CONTAINER                                                   */}
      {/* ================================================================== */}

      <div
        className="
          relative
          z-20
          mx-auto
          flex
          w-full
          max-w-[1440px]
          items-center
          px-5
          pb-20
          sm:px-8
          md:px-12
          lg:px-16
          xl:px-20
        "
      >
        <div
          className="
            grid
            w-full
            grid-cols-1
            items-center
            gap-10
            lg:grid-cols-[minmax(0,1fr)_280px]
            lg:gap-16
          "
        >
          {/* ============================================================= */}
          {/* MAIN CONTENT                                                   */}
          {/* ============================================================= */}

          <div className="max-w-4xl mt-4">
            {/* Eyebrow */}
            <motion.div
              initial={{
                opacity: 0,
                x: -25,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="
                mb-6
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#DDB25C]/35
                  bg-[#DDB25C]/[0.06]
                "
              >
                <Sun className="h-3.5 w-3.5 text-[#DDB25C]" />
              </span>

              <span
                className="
                  h-px
                  w-8
                  bg-[#DDB25C]/45
                "
              />

              <span
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.28em]
                  text-[#F6E2A0]/70
                  sm:text-[10px]
                  md:text-[11px]
                "
              >
                {eyebrow}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="
                max-w-4xl
                font-heading
                text-[3rem]
                font-bold
                leading-[0.98]
                tracking-[-0.035em]
                text-[#FFF8EA]
                drop-shadow-[0_10px_30px_rgba(0,0,0,0.3)]
                sm:text-[4.2rem]
                md:text-[5rem]
                lg:text-[5.8rem]
                xl:text-[6.2rem]
              "
            >
              {title}
            </motion.h1>

            {/* Underline architecture */}
            <motion.div
              initial={{
                opacity: 0,
                width: 0,
              }}
              animate={{
                opacity: 1,
                width: "100%",
              }}
              transition={{
                delay: 0.38,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="
                mt-7
                flex
                max-w-[430px]
                items-center
                gap-3
              "
            >
              <span className="h-px flex-1 bg-gradient-to-r from-[#DDB25C]/70 to-[#DDB25C]/10" />

              <span
                className="
                  h-2.5
                  w-2.5
                  rotate-45
                  border
                  border-[#DDB25C]/70
                  bg-[#DDB25C]/10
                "
              />

              <span className="h-px w-16 bg-[#DDB25C]/20" />
            </motion.div>

            {/* Subtitle */}
            {subtitle && (
              <motion.p
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.5,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="
                  mt-6
                  max-w-2xl
                  text-[14px]
                  leading-7
                  text-[#FFF8EA]/60
                  sm:text-[15px]
                  md:text-base
                  md:leading-7
                "
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          {/* ============================================================= */}
          {/* RIGHT ARCHITECTURAL ELEMENT                                    */}
          {/* ============================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: 35,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.25,
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              relative
              hidden
              h-[250px]
              lg:block
            "
          >
            {/* Outer frame */}
            <div
              className="
                absolute
                inset-4
                border
                border-[#DDB25C]/20
              "
            />

            {/* Inner frame */}
            <div
              className="
                absolute
                inset-10
                border
                border-[#DDB25C]/10
              "
            />

            {/* Vertical centerpiece */}
            <div
              className="
                absolute
                bottom-10
                left-1/2
                top-10
                w-px
                -translate-x-1/2
                bg-gradient-to-b
                from-transparent
                via-[#DDB25C]/35
                to-transparent
              "
            />

            {/* Horizontal centerpiece */}
            <div
              className="
                absolute
                left-10
                right-10
                top-1/2
                h-px
                -translate-y-1/2
                bg-gradient-to-r
                from-transparent
                via-[#DDB25C]/30
                to-transparent
              "
            />

            {/* Center emblem */}
            <div
              className="
                absolute
                left-1/2
                top-1/2
                flex
                h-20
                w-20
                -translate-x-1/2
                -translate-y-1/2
                rotate-45
                items-center
                justify-center
                border
                border-[#DDB25C]/35
                bg-[#DDB25C]/[0.035]
              "
            >
              <div className="-rotate-45 text-center">
                <span
                  className="
                    block
                    font-heading
                    text-2xl
                    font-bold
                    text-[#F6E2A0]/80
                  "
                >
                  ಕಾ
                </span>

                <span
                  className="
                    mt-1
                    block
                    text-[7px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-[#DDB25C]/50
                  "
                >
                  Temple
                </span>
              </div>
            </div>

            {/* Corner points */}
            <span className="absolute left-1 top-1 h-2 w-2 bg-[#DDB25C]/60" />
            <span className="absolute right-1 top-1 h-2 w-2 bg-[#DDB25C]/60" />
            <span className="absolute bottom-1 left-1 h-2 w-2 bg-[#DDB25C]/40" />
            <span className="absolute bottom-1 right-1 h-2 w-2 bg-[#DDB25C]/40" />
          </motion.div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* BOTTOM TRANSITION                                                  */}
      {/* ================================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          z-30
          h-28
          bg-gradient-to-t
          from-[#F8F1E4]
          via-[#F8F1E4]/35
          to-transparent
        "
      />

      {/* ================================================================== */}
      {/* BOTTOM LINE                                                        */}
      {/* ================================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-1/2
          z-40
          h-px
          w-[88%]
          -translate-x-1/2
          bg-gradient-to-r
          from-transparent
          via-[#DDB25C]/25
          to-transparent
        "
      />

      {/* ================================================================== */}
      {/* SCROLL MARK                                                        */}
      {/* ================================================================== */}

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 1,
          duration: 0.5,
        }}
        className="
          absolute
          bottom-7
          left-1/2
          z-50
          hidden
          -translate-x-1/2
          sm:block
        "
      >
        <motion.div
          animate={{
            y: [0, 4, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            border-[#6B0F1A]/15
            bg-[#F8F1E4]/10
            backdrop-blur-sm
          "
        >
          <ChevronDown className="h-3.5 w-3.5 text-[#6B0F1A]/50" />
        </motion.div>
      </motion.div>
    </section>
  )
}