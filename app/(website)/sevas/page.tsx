"use client"

import {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  motion,
  AnimatePresence,
} from "framer-motion"
import {
  Search,
  IndianRupee,
  ChevronRight,
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Heart,
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
  Flower2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { PageBanner } from "@/components/PageBanner"
import { useTranslation } from "@/lib/i18n"

import {
  getDailySevas,
  type DailySeva,
} from "@/lib/data/sevas"

import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
  getCartTotal,
  getCartCount,
  type CartItem,
} from "@/lib/seva-cart"

import {
  nakshatraOptions,
  rashiOptions,
} from "@/lib/nakshatra-data"

/* ==========================================================================
   TYPES
   ========================================================================== */

type SevaWithContent = DailySeva & {
  name: string
  description: string
}

/* ==========================================================================
   DEVOTEE
   ========================================================================== */

const emptyDevotee = {
  name: "",
  nakshatra: "",
  rashi: "",
  gotra: "",
}

/* ==========================================================================
   ANIMATION
   ========================================================================== */

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.045,
    },
  },
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
}

/* ==========================================================================
   TEMPLE MARK
   ========================================================================== */

function TempleMark({
  small = false,
}: {
  small?: boolean
}) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-2xl border border-secondary/25 bg-secondary/[0.07]",
        small
          ? "h-11 w-11"
          : "h-12 w-12",
      )}
    >
      <span className="absolute inset-1.5 rounded-xl border border-secondary/10" />

      <Flower2
        className={cn(
          "relative text-secondary",
          small
            ? "h-5 w-5"
            : "h-5 w-5",
        )}
      />
    </div>
  )
}

/* ==========================================================================
   SEVA CARD
   ========================================================================== */

function SevaCard({
  seva,
  onAdd,
  t,
}: {
  seva: SevaWithContent
  onAdd: (seva: SevaWithContent) => void
  t: (key: string) => string
}) {
  const handleSelect = () => {
    onAdd(seva)
  }

  return (
    <motion.article
      variants={cardVariants}
      layout
      role="button"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault()
          handleSelect()
        }
      }}
      className="
        group
        relative
        flex
        h-full
        cursor-pointer
        flex-col
        overflow-hidden
        rounded-[1.5rem]
        border
        border-border
        bg-warm-white
        outline-none
        transition-all
        duration-500
        hover:-translate-y-1
        hover:border-secondary/40
        hover:shadow-premium
        focus-visible:border-secondary
        focus-visible:ring-2
        focus-visible:ring-secondary/40
        focus-visible:ring-offset-2
        active:scale-[0.992]
      "
    >
      <div className="h-[3px] bg-gradient-to-r from-primary via-secondary to-primary opacity-80" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <TempleMark />

          <div className="min-w-0 flex-1">
            <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-secondary sm:text-[10px]">
              {seva.category}
            </p>

            <h3 className="font-heading text-[18px] font-bold leading-[1.3] text-text-primary transition-colors duration-300 group-hover:text-primary sm:text-xl">
              {seva.name}
            </h3>
          </div>
        </div>

        <p className="mt-5 line-clamp-3 text-[13px] leading-6 text-text-secondary sm:text-sm">
          {seva.description}
        </p>

        <div className="mt-auto pt-6">
          <div className="h-px bg-border" />

          <div className="flex items-end justify-between gap-4 pt-5">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-text-muted">
                {t(
                  "sevas.offeringAmount",
                )}
              </p>

              <div className="mt-1 flex items-center">
                <IndianRupee className="h-4 w-4 text-primary" />

                <span className="font-heading text-xl font-bold tabular-nums text-primary sm:text-2xl">
                  {Number(
                    seva.price,
                  ).toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>
            </div>

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-secondary/30
                bg-secondary/[0.06]
                text-primary
                transition-all
                duration-300
                group-hover:border-secondary
                group-hover:bg-secondary
                group-hover:shadow-md
              "
            >
              <Plus className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

/* ==========================================================================
   CART ITEM
   ========================================================================== */

function CartItemCard({
  item,
  onRemove,
  onQuantity,
  t,
}: {
  item: CartItem
  onRemove: () => void
  onQuantity: (delta: number) => void
  t: (key: string) => string
}) {
  const itemTotal =
    Number(item.price) *
    item.quantity

  return (
    <motion.div
      layout
      className="overflow-hidden rounded-2xl border border-border bg-bg-secondary/45"
    >
      <div className="p-4 sm:p-5">
        <div className="flex gap-3">
          <TempleMark small />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h4 className="text-sm font-bold leading-snug text-text-primary sm:text-[15px]">
                  {item.name}
                </h4>

                <p className="mt-1 text-sm font-semibold text-primary">
                  ₹
                  {Number(
                    item.price,
                  ).toLocaleString(
                    "en-IN",
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onRemove()
                }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center rounded-xl border border-border bg-warm-white p-1">
                <button
                  type="button"
                  disabled={
                    item.quantity <= 1
                  }
                  onClick={(event) => {
                    event.stopPropagation()
                    onQuantity(-1)
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-text-primary transition-colors hover:bg-primary/5 disabled:opacity-30"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>

                <span className="w-9 text-center text-sm font-bold tabular-nums">
                  {item.quantity}
                </span>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    onQuantity(1)
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-text-primary transition-colors hover:bg-primary/5"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <p className="text-sm font-bold text-text-primary">
                ₹
                {itemTotal.toLocaleString(
                  "en-IN",
                )}
              </p>
            </div>
          </div>
        </div>


      </div>

    </motion.div>
  )
}

/* ==========================================================================
   CART DRAWER
   ========================================================================== */

function CartDrawer({
  open,
  cart,
  cartCount,
  cartTotal,
  cartGrandTotal,
  onClose,
  onRemove,
  onQuantity,
  onClear,
  onCheckout,
  t,
}: {
  open: boolean
  cart: CartItem[]
  cartCount: number
  cartTotal: number
  cartGrandTotal: number
  onClose: () => void
  onRemove: (
    id: string,
  ) => void
  onQuantity: (
    id: string,
    delta: number,
  ) => void
  onClear: () => void
  onCheckout: () => void
  t: (key: string) => string
}) {
  const gst =
    Math.round(
      cartTotal * 0.18,
    )

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ============================================================
              BACKDROP
             ============================================================ */}

          <motion.div
            key="cart-backdrop"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            onClick={onClose}
            className="
              fixed
              inset-0
              z-[9998]
              cursor-pointer
              bg-black/55
              backdrop-blur-[3px]
            "
          />

          {/* ============================================================
              DRAWER
             ============================================================ */}

          <motion.aside
            key="cart-drawer"
            initial={{
              x: "100%",
            }}
            animate={{
              x: 0,
            }}
            exit={{
              x: "100%",
            }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 30,
              mass: 0.8,
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
            className="
              fixed
              inset-y-0
              right-0
              z-[9999]
              flex
              w-full
              flex-col
              overflow-hidden
              border-l
              border-border
              bg-warm-white
              shadow-[-25px_0_80px_rgba(0,0,0,0.20)]
              sm:max-w-[520px]
            "
          >
            {/* ==========================================================
                HEADER
               ========================================================== */}

            <header className="shrink-0 border-b border-border bg-warm-white px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-7 sm:pt-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-warm-white">
                    <ShoppingBag className="h-5 w-5" />

                    {cartCount >
                      0 && (
                        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[9px] font-bold text-primary ring-2 ring-warm-white">
                          {cartCount}
                        </span>
                      )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-heading text-lg font-bold text-text-primary sm:text-xl">
                      {t(
                        "sevas.cart",
                      )}
                    </h2>

                    <p className="mt-0.5 text-xs text-text-muted">
                      {cartCount}{" "}
                      {t(
                        "sevas.selected",
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-border
                    bg-warm-white
                    text-text-muted
                    transition-all
                    hover:border-primary/20
                    hover:bg-bg-secondary
                    hover:text-primary
                    active:scale-95
                  "
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {cart.length > 0 && (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-secondary/15 bg-secondary/[0.06] px-3.5 py-3">
                  <Heart className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />

                  <p className="text-xs leading-5 text-text-secondary">
                    {t(
                      "sevas.devoteeReminder",
                    )}
                  </p>
                </div>
              )}
            </header>

            {/* ==========================================================
                BODY
               ========================================================== */}

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-5 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-secondary/20 bg-secondary/[0.07]">
                    <Flower2 className="h-9 w-9 text-secondary" />
                  </div>

                  <h3 className="mt-6 font-heading text-xl font-bold text-primary">
                    {t(
                      "sevas.emptyCart",
                    )}
                  </h3>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-text-muted">
                    {t(
                      "sevas.emptyCartDescription",
                    )}
                  </p>

                  <Button
                    variant="outline"
                    className="mt-6 h-11 rounded-xl"
                    onClick={onClose}
                  >
                    {t(
                      "sevas.browseSevas",
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(
                    (item) => (
                      <CartItemCard
                        key={item.sevaId}
                        item={item}
                        onRemove={() => onRemove(item.sevaId)}
                        onQuantity={(delta) => onQuantity(item.sevaId, delta)}
                        t={t}
                      />
                    ),
                  )}
                </div>
              )}
            </div>

            {/* ==========================================================
                FOOTER
               ========================================================== */}

            {cart.length > 0 && (
              <footer className="shrink-0 border-t border-border bg-warm-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-7 sm:pt-5">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">
                      {t(
                        "sevas.subtotal",
                      )}
                    </span>

                    <span className="font-medium text-text-primary">
                      ₹
                      {cartTotal.toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">
                      {t(
                        "sevas.gst",
                      )}
                    </span>

                    <span className="font-medium text-text-primary">
                      ₹
                      {gst.toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </div>

                  <div className="my-3 h-px bg-border" />

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text-primary">
                      {t(
                        "sevas.total",
                      )}
                    </span>

                    <span className="font-heading text-2xl font-bold text-primary">
                      ₹
                      {cartGrandTotal.toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-[auto_1fr] gap-3">
                  <button
                    type="button"
                    onClick={onClear}
                    className="
                      flex
                      h-12
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-border
                      px-4
                      text-xs
                      font-bold
                      text-text-secondary
                      transition-all
                      hover:border-primary/30
                      hover:text-primary
                      active:scale-[0.98]
                    "
                  >
                    <RotateCcw className="h-4 w-4" />

                    <span className="hidden sm:inline">
                      {t(
                        "sevas.clear",
                      )}
                    </span>
                  </button>

                  <Button
                    variant="premium"
                    className="h-12 rounded-xl"
                    onClick={onCheckout}
                    iconRight={
                      <ArrowRight className="h-4 w-4" />
                    }
                  >
                    {t(
                      "sevas.checkout",
                    )}
                  </Button>
                </div>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

/* ==========================================================================
   MOBILE CART
   ========================================================================== */

function MobileCartBar({
  count,
  total,
  onClick,
  t,
}: {
  count: number
  total: number
  onClick: () => void
  t: (key: string) => string
}) {
  if (count <= 0) {
    return null
  }

  return (
    <div className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[100] sm:hidden">
      <motion.button
        type="button"
        initial={{
          opacity: 0,
          y: 25,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        onClick={onClick}
        className="
          flex
          w-full
          items-center
          justify-between
          rounded-2xl
          border
          border-secondary/30
          bg-primary
          px-4
          py-3
          text-warm-white
          shadow-[0_15px_45px_rgba(72,9,17,0.32)]
          active:scale-[0.99]
        "
      >
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-warm-white/10">
            <ShoppingBag className="h-5 w-5" />

            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[9px] font-bold text-primary">
              {count}
            </span>
          </div>

          <div className="text-left">
            <p className="text-[10px] font-medium text-warm-white/60">
              {t(
                "sevas.selected",
              )}
            </p>

            <p className="mt-0.5 text-sm font-bold">
              ₹
              {total.toLocaleString(
                "en-IN",
              )}
            </p>
          </div>
        </div>

        <span className="flex items-center gap-1.5 text-xs font-bold">
          {t(
            "sevas.viewCart",
          )}

          <ArrowRight className="h-4 w-4" />
        </span>
      </motion.button>
    </div>
  )
}

/* ==========================================================================
   MAIN PAGE
   ========================================================================== */

export default function SevasPage() {
  const {
    t,
    language,
  } = useTranslation()

  const router = useRouter()

  const [searchQuery, setSearchQuery] =
    useState("")

  const [activeCategory, setActiveCategory] =
    useState("all")

  const [cart, setCart] =
    useState<CartItem[]>([])

  const [cartOpen, setCartOpen] =
    useState(false)

  /* ---------------------------------------------------------------------- */
  /* DYNAMIC SEVAS                                                          */
  /* ---------------------------------------------------------------------- */

  const sevas = useMemo(
    () =>
      getDailySevas(
        language,
      ),
    [language],
  )

  /* ---------------------------------------------------------------------- */
  /* LOAD CART                                                              */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    setCart(getCart())
  }, [])

  /* ---------------------------------------------------------------------- */
  /* BODY SCROLL LOCK                                                       */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!cartOpen) {
      document.body.style.overflow = ""
      return
    }

    const previous =
      document.body.style.overflow

    document.body.style.overflow =
      "hidden"

    return () => {
      document.body.style.overflow =
        previous
    }
  }, [cartOpen])

  /* ---------------------------------------------------------------------- */
  /* ADD                                                                    */
  /* ---------------------------------------------------------------------- */

  const handleAddToCart =
    useCallback(
      (
        seva: SevaWithContent,
      ) => {
        const updated =
          addToCart({
            sevaId: seva.id,
            slug: seva.slug,
            name: seva.name,
            price: Number(
              seva.price,
            ),
          })

        setCart(updated)
      },
      [],
    )

  /* ---------------------------------------------------------------------- */
  /* REMOVE                                                                 */
  /* ---------------------------------------------------------------------- */

  const handleRemove =
    useCallback(
      (sevaId: string) => {
        const updated =
          removeFromCart(
            sevaId,
          )

        setCart(updated)

      },
      [],
    )

  /* ---------------------------------------------------------------------- */
  /* QUANTITY                                                               */
  /* ---------------------------------------------------------------------- */

  const handleQuantity =
    useCallback(
      (
        sevaId: string,
        delta: number,
      ) => {
        const item =
          cart.find(
            (entry) =>
              entry.sevaId ===
              sevaId,
          )

        if (!item) {
          return
        }

        const next =
          item.quantity +
          delta

        if (next < 1) {
          return
        }

        const updated =
          updateCartQuantity(
            sevaId,
            next,
          )

        setCart(updated)
      },
      [cart],
    )

  /* ---------------------------------------------------------------------- */
  /* DEVOTEE                                                                */
  /* ---------------------------------------------------------------------- */
  /* TOTALS                                                                 */
  /* ---------------------------------------------------------------------- */

  const cartCount =
    getCartCount(cart)

  const cartTotal =
    getCartTotal(cart)

  const gst =
    Math.round(
      cartTotal * 0.18,
    )

  const cartGrandTotal =
    cartTotal + gst

  /* ---------------------------------------------------------------------- */
  /* CATEGORIES                                                             */
  /* ---------------------------------------------------------------------- */

  const categories =
    useMemo(() => {
      const unique =
        Array.from(
          new Set(
            sevas.map(
              (seva) =>
                seva.category,
            ),
          ),
        )

      return [
        {
          id: "all",
          label: t(
            "sevas.allSevas",
          ),
        },
        ...unique.map(
          (category) => ({
            id: category,
            label: category,
          }),
        ),
      ]
    }, [sevas, t])

  /* ---------------------------------------------------------------------- */
  /* FILTER                                                                 */
  /* ---------------------------------------------------------------------- */

  const filteredSevas =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase()

      return sevas.filter(
        (seva) => {
          const categoryMatch =
            activeCategory ===
            "all" ||
            seva.category ===
            activeCategory

          const searchMatch =
            !query ||
            seva.name
              .toLowerCase()
              .includes(
                query,
              ) ||
            seva.description
              .toLowerCase()
              .includes(
                query,
              ) ||
            seva.category
              .toLowerCase()
              .includes(
                query,
              )

          return (
            categoryMatch &&
            searchMatch
          )
        },
      )
    }, [
      sevas,
      searchQuery,
      activeCategory,
    ])

  /* ---------------------------------------------------------------------- */
  /* CLEAR FILTERS                                                          */
  /* ---------------------------------------------------------------------- */

  const clearFilters =
    useCallback(() => {
      setSearchQuery("")
      setActiveCategory(
        "all",
      )
    }, [])

  /* ---------------------------------------------------------------------- */
  /* CHECKOUT                                                               */
  /* ---------------------------------------------------------------------- */

  const handleCheckout =
    useCallback(() => {
      setCartOpen(false)

      router.push(
        "/sevas/cart/checkout",
      )
    }, [router])

  /* ====================================================================== */
  /* UI                                                                     */
  /* ====================================================================== */

  return (
    <main className="min-h-screen bg-bg-primary pb-24 sm:pb-0">
      {/* PAGE BANNER */}

      <PageBanner
        title={t(
          "sevas.ourSevas",
        )}
        eyebrow={t(
          "sevas.sacredOfferings",
        )}
        subtitle={t(
          "sevas.subtitle",
        )}
      />

      <section className="px-4 py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl">
          {/* BREADCRUMB */}

          <nav className="mb-8 flex items-center gap-2 text-xs text-text-muted sm:mb-10 sm:text-sm">
            <Link
              href="/"
              className="transition-colors hover:text-primary"
            >
              {t(
                "nav.home",
              )}
            </Link>

            <ChevronRight className="h-3.5 w-3.5" />

            <span className="font-semibold text-text-primary">
              {t(
                "nav.sevas",
              )}
            </span>
          </nav>

          {/* INTRO */}

          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-secondary" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary sm:text-xs">
                  {t(
                    "sevas.sacredOfferings",
                  )}
                </span>
              </div>

              <h2 className="font-heading text-3xl font-bold leading-[1.1] text-primary sm:text-4xl lg:text-5xl">
                {t(
                  "sevas.ourSevas",
                )}
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary sm:text-base">
                {t(
                  "sevas.subtitle",
                )}
              </p>
            </div>

            {/* DESKTOP CART BUTTON */}

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                setCartOpen(true)
              }}
              className="
                group
                hidden
                items-center
                gap-4
                rounded-2xl
                border
                border-border
                bg-warm-white
                px-4
                py-3
                text-left
                shadow-sm
                transition-all
                hover:border-secondary/40
                hover:shadow-premium
                active:scale-[0.98]
                sm:flex
              "
            >
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-warm-white">
                <ShoppingBag className="h-5 w-5" />

                {cartCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[9px] font-bold text-primary ring-2 ring-warm-white">
                    {cartCount}
                  </span>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-text-muted">
                  {t(
                    "sevas.selected",
                  )}
                </p>

                <p className="mt-0.5 text-sm font-bold text-primary">
                  ₹
                  {cartTotal.toLocaleString(
                    "en-IN",
                  )}
                </p>
              </div>

              <ChevronRight className="ml-2 h-4 w-4 text-text-muted transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* SEARCH */}

          <div className="mt-9 rounded-[1.5rem] border border-border bg-warm-white p-3 shadow-sm sm:mt-11 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />

                <input
                  value={
                    searchQuery
                  }
                  onChange={(event) =>
                    setSearchQuery(
                      event.target
                        .value,
                    )
                  }
                  placeholder={t(
                    "sevas.searchPlaceholder",
                  )}
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-border
                    bg-bg-secondary/50
                    pl-11
                    pr-10
                    text-sm
                    text-text-primary
                    outline-none
                    placeholder:text-text-muted
                    transition-all
                    focus:border-secondary
                    focus:bg-warm-white
                    focus:ring-2
                    focus:ring-secondary/10
                  "
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchQuery(
                        "",
                      )
                    }
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-text-muted hover:bg-primary/5 hover:text-primary"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* MOBILE CART */}

              <button
                type="button"
                onClick={() =>
                  setCartOpen(
                    true,
                  )
                }
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-warm-white transition-all active:scale-[0.98] sm:hidden"
              >
                <ShoppingBag className="h-4 w-4" />

                {t(
                  "sevas.cart",
                )}

                {cartCount >
                  0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[9px] font-bold text-primary">
                      {cartCount}
                    </span>
                  )}
              </button>
            </div>

            {/* CATEGORIES */}

            <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <SlidersHorizontal className="mr-1 h-3.5 w-3.5 shrink-0 text-text-muted" />

              {categories.map(
                (category) => {
                  const active =
                    activeCategory ===
                    category.id

                  return (
                    <button
                      key={
                        category.id
                      }
                      type="button"
                      onClick={() =>
                        setActiveCategory(
                          category.id,
                        )
                      }
                      className={cn(
                        "shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200",
                        active
                          ? "border-primary bg-primary text-warm-white"
                          : "border-border bg-warm-white text-text-secondary hover:border-secondary/40 hover:text-primary",
                      )}
                    >
                      {category.label}
                    </button>
                  )
                },
              )}
            </div>
          </div>

          {/* SECTION HEADER */}

          <div className="mt-10 flex items-end justify-between gap-4 sm:mt-12">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
                {activeCategory ===
                  "all"
                  ? t(
                    "sevas.templeOfferings",
                  )
                  : activeCategory}
              </p>

              <h3 className="mt-1 font-heading text-2xl font-bold text-primary sm:text-3xl">
                {activeCategory ===
                  "all"
                  ? t(
                    "sevas.sacredSevas",
                  )
                  : activeCategory}
              </h3>
            </div>

            <span className="text-xs font-medium text-text-muted">
              {filteredSevas.length}{" "}
              {t(
                filteredSevas.length ===
                  1
                  ? "sevas.seva"
                  : "sevas.sevas",
              )}
            </span>
          </div>

          {/* GRID */}

          {filteredSevas.length >
            0 ? (
            <motion.div
              variants={
                gridVariants
              }
              initial="hidden"
              animate="visible"
              className="mt-6 grid gap-4 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredSevas.map(
                (seva) => (
                  <SevaCard
                    key={
                      seva.id
                    }
                    seva={
                      seva as SevaWithContent
                    }
                    onAdd={
                      handleAddToCart
                    }
                    t={t}
                  />
                ),
              )}
            </motion.div>
          ) : (
            <div className="mt-8 rounded-[1.75rem] border border-border bg-warm-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/[0.08]">
                <Search className="h-7 w-7 text-secondary" />
              </div>

              <h3 className="mt-5 font-heading text-xl font-bold text-primary">
                {t(
                  "sevas.noResults",
                )}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">
                {t(
                  "sevas.noResultsDescription",
                )}
              </p>

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-text-secondary transition-colors hover:border-secondary hover:text-primary"
              >
                <RotateCcw className="h-3.5 w-3.5" />

                {t(
                  "sevas.clearFilters",
                )}
              </button>
            </div>
          )}

          {/* DEVOTIONAL NOTE */}

          <div className="mt-16 sm:mt-20">
            <div className="overflow-hidden rounded-[1.75rem] border border-secondary/20 bg-secondary/[0.045] px-6 py-7 sm:px-9 sm:py-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-warm-white">
                  <Heart className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">
                    {t(
                      "sevas.humbleOffering",
                    )}
                  </p>

                  <p className="mt-1.5 max-w-3xl text-sm leading-6 text-text-secondary sm:text-[15px]">
                    {t(
                      "sevas.humbleOfferingDescription",
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CART DRAWER */}

      <CartDrawer
        open={cartOpen}
        cart={cart}
        cartCount={cartCount}
        cartTotal={cartTotal}
        cartGrandTotal={cartGrandTotal}
        onClose={() => setCartOpen(false)}
        onRemove={handleRemove}
        onQuantity={handleQuantity}
        onClear={() => { clearCart(); setCart([]) }}
        onCheckout={handleCheckout}
        t={t}
      />

      {/* MOBILE FLOATING CART */}

      <MobileCartBar
        count={cartCount}
        total={cartTotal}
        onClick={() =>
          setCartOpen(true)
        }
        t={t}
      />
    </main>
  )
}