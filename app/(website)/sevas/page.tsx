"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Clock, IndianRupee, ChevronRight, Filter, Sparkles, Droplets, Heart, Star, Flame, Sun, Moon, Loader2, ShoppingCart, X, Plus, Minus, Trash2, User, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { PageBanner } from "@/components/PageBanner"
import { useTranslation } from "@/lib/i18n"
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  updateCartDevotee,
  clearCart,
  getCartTotal,
  getCartCount,
  type CartItem,
} from "@/lib/seva-cart"
import { nakshatraOptions, rashiOptions } from "@/lib/nakshatra-data"

const GRADIENTS = [
  "from-amber-600 to-orange-700",
  "from-blue-600 to-cyan-700",
  "from-rose-600 to-pink-700",
  "from-purple-600 to-violet-700",
  "from-red-600 to-rose-700",
  "from-teal-600 to-emerald-700",
  "from-pink-600 to-rose-700",
  "from-orange-700 to-red-800",
  "from-emerald-600 to-teal-700",
  "from-indigo-600 to-blue-700",
]

const ICONS = [Sun, Droplets, Heart, Star, Sparkles, Moon, Flame, Sparkles, Sun, Droplets] as const

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export default function SevasPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [sevas, setSevas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/sevas?limit=100")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setSevas(res.data.sevas)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setCart(getCart())
  }, [])

  // Lock body scroll when cart is open
  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = "hidden"
      return () => { document.body.style.overflow = "" }
    }
  }, [cartOpen])

  const handleAddToCart = useCallback((seva: any) => {
    const updated = addToCart({
      sevaId: seva.id,
      slug: seva.slug,
      name: seva.name,
      price: Number(seva.price),
      devoteeDetails: { name: "", nakshatra: "", rashi: "", gothra: "", notes: "" },
    })
    setCart(updated)
    setCartOpen(true)
  }, [])

  const handleRemove = useCallback((sevaId: string) => {
    const updated = removeFromCart(sevaId)
    setCart(updated)
  }, [])

  const handleQty = useCallback((sevaId: string, delta: number) => {
    const item = cart.find((c) => c.sevaId === sevaId)
    if (!item) return
    const updated = updateCartQuantity(sevaId, item.quantity + delta)
    setCart(updated)
  }, [cart])

  const handleDevoteeChange = useCallback((sevaId: string, field: string, value: string) => {
    const item = cart.find((c) => c.sevaId === sevaId)
    if (!item) return
    const details = item.devoteeDetails ?? { name: "", nakshatra: "", rashi: "", gothra: "", notes: "" }
    const updated = updateCartDevotee(sevaId, { ...details, [field]: value })
    setCart(updated)
  }, [cart])

  const cartCount = getCartCount(cart)
  const cartTotal = getCartTotal(cart)
  const cartGrandTotal = cartTotal + Math.round(cartTotal * 0.18)

  const filteredSevas = useMemo(() => {
    return sevas.filter((seva) => {
      const matchesSearch = seva.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (seva.description || seva.shortDescription || "").toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })
  }, [searchQuery, sevas])

  return (
    <div className="min-h-screen">
      <PageBanner 
        title={t("sevas.ourSevas")} 
        eyebrow={t("sevas.sacredOfferings")} 
        subtitle={t("sevas.subtitle")}
      />

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-text-muted mb-10"
          >
            <Link href="/" className="hover:text-secondary transition-colors">{t("nav.home")}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">{t("nav.sevas")}</span>
          </motion.div>

          <div className="flex items-center gap-3">
              <div className="w-full lg:w-72">
                <Input
                  placeholder={t("sevas.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  iconLeft={<Search className="h-4 w-4" />}
                  variant="filled"
                />
              </div>
              <Button
                variant="gradient"
                onClick={() => setCartOpen(true)}
                className="relative shrink-0"
                iconLeft={<ShoppingCart className="h-4 w-4" />}                >
                {t("sevas.cart")}
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-maroon-600 text-warm-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center ring-2 ring-warm-white">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>

          <div>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </motion.div>
            ) : filteredSevas.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-bg-secondary flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-text-muted" />
                </div>
                <h3 className="text-xl font-heading font-bold text-text-primary">{t("sevas.noResults")}</h3>
                <p className="text-text-muted mt-2">{t("sevas.noResultsHint")}</p>
              </motion.div>
            ) : (
              <motion.div
                key={searchQuery}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredSevas.map((seva, idx) => {
                  const Icon = ICONS[idx % ICONS.length]
                  const grad = GRADIENTS[idx % GRADIENTS.length]
                  return (
                    <motion.div
                      key={seva.slug || seva.id}
                      variants={itemVariants}
                      layout
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <Card variant="elevated" padding="none" hover className="group h-full overflow-hidden relative">
                        <div className="relative h-52 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-b from-maroon-900/10 to-transparent z-[1]" />
                          <Image
                            src={seva.image || "/logo.svg"}
                            alt={seva.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <svg className="absolute -bottom-[2px] left-0 right-0 w-full h-6 z-[2]" viewBox="0 0 400 24" preserveAspectRatio="none">
                            <path d="M0 24 Q50 8 100 16 Q150 24 200 16 Q250 8 300 16 Q350 24 400 16 L400 24 L0 24Z" fill="#FDF8F3" />
                          </svg>
                          <div className="absolute top-3 right-3 z-[3]">
                            <Badge variant="secondary" size="sm">
                              {seva.category?.name || seva.category}
                            </Badge>
                          </div>
                          <div className="absolute bottom-4 left-4 z-[3]">
                            <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg shadow-black/20 ring-2 ring-white/30", grad)}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="p-5 pt-4">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-lg font-heading font-bold text-text-primary group-hover:text-primary transition-colors leading-tight">
                              {seva.name}
                            </h3>
                            {Number(seva.price) >= 5000 && (
                              <span className="shrink-0 text-[10px] uppercase tracking-wider font-bold text-gold-600 bg-gold-50 px-2 py-0.5 rounded-full border border-gold-200/50">
                                {t("sevas.premium")}
                              </span>
                            )}
                          </div>
                          <p className="mt-1.5 text-sm text-text-secondary leading-relaxed line-clamp-2">
                            {seva.description || seva.shortDescription}
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-sm font-bold text-text-primary">
                              <IndianRupee className="h-3.5 w-3.5 text-primary" />
                              <span>{Number(seva.price).toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-text-muted">
                              <Clock className="h-3 w-3" />
                              <span>{seva.duration ? `${seva.duration} min` : "-"}</span>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-lg"
                                onClick={(e) => { e.preventDefault(); handleAddToCart(seva) }}
                                iconLeft={<ShoppingCart className="h-3.5 w-3.5" />}
                              >
                                {t("sevas.addToCart")}
                              </Button>
                              <Link href={`/sevas/book/${seva.slug || seva.id}`}>
                                <Button variant="gradient" size="sm" className="w-full group/btn rounded-lg">
                                  {t("sevas.bookNow")}
                                  <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60]"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-warm-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-text-primary">Your Cart</h3>
                    <p className="text-xs text-text-muted">{cartCount} {cartCount === 1 ? "item" : "items"}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setCartOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="w-20 h-20 rounded-2xl bg-bg-secondary flex items-center justify-center mb-4">
                      <ShoppingCart className="h-10 w-10 text-text-muted" />
                    </div>
                    <h4 className="font-heading font-bold text-text-primary mb-1">Your cart is empty</h4>
                    <p className="text-sm text-text-muted mb-4">Add sevas from the listing to get started</p>
                    <Button variant="outline" onClick={() => setCartOpen(false)}>Browse Sevas</Button>
                  </div>
                ) : (
                  cart.map((item) => {
                    const isExpanded = expandedItem === item.sevaId
                    const devotee = item.devoteeDetails ?? { name: "", nakshatra: "", rashi: "", gothra: "", notes: "" }
                    return (
                      <motion.div
                        key={item.sevaId}
                        layout
                        className="bg-bg-secondary rounded-xl border border-border overflow-hidden"
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-text-primary text-sm leading-tight">{item.name}</h5>
                              <p className="text-xs text-primary font-bold mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleRemove(item.sevaId)} className="h-8 w-8">
                              <Trash2 className="h-4 w-4 text-text-muted hover:text-red-500" />
                            </Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleQty(item.sevaId, -1)}
                                disabled={item.quantity <= 1}
                                className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-text-primary hover:border-primary hover:text-primary transition-all disabled:opacity-40"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-8 text-center font-semibold text-sm text-text-primary tabular-nums">{item.quantity}</span>
                              <button
                                onClick={() => handleQty(item.sevaId, +1)}
                                className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-text-primary hover:border-primary hover:text-primary transition-all"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <p className="text-sm font-bold text-text-primary">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                          </div>
                          <button
                            onClick={() => setExpandedItem(isExpanded ? null : item.sevaId)}
                            className="mt-3 w-full flex items-center justify-between gap-2 text-xs text-text-secondary hover:text-primary transition-colors pt-3 border-t border-border/50"
                          >
                            <span className="flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5" />
                              Devotee Info
                              {devotee.name && <CheckCircle className="h-3.5 w-3.5 text-success" />}
                            </span>
                            <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", isExpanded && "rotate-90")} />
                          </button>
                        </div>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 space-y-3 border-t border-border/50 bg-bg-tertiary/30">
                                <div className="pt-3 space-y-3">
                                  <Input
                                    label="Devotee Name"
                                    inputSize="sm"
                                    placeholder="Enter name"
                                    value={devotee.name}
                                    onChange={(e) => handleDevoteeChange(item.sevaId, "name", e.target.value)}
                                  />
                                  <Input
                                    label="Gothra"
                                    inputSize="sm"
                                    placeholder="e.g. Bharadwaja"
                                    value={devotee.gothra}
                                    onChange={(e) => handleDevoteeChange(item.sevaId, "gothra", e.target.value)}
                                  />
                                  <div className="grid grid-cols-2 gap-3">
                                    <Select
                                      label="Nakshatra"
                                      size="sm"
                                      options={nakshatraOptions}
                                      value={devotee.nakshatra}
                                      onChange={(e) => handleDevoteeChange(item.sevaId, "nakshatra", e.target.value)}
                                      placeholder="Select"
                                    />
                                    <Select
                                      label="Rashi"
                                      size="sm"
                                      options={rashiOptions}
                                      value={devotee.rashi}
                                      onChange={(e) => handleDevoteeChange(item.sevaId, "rashi", e.target.value)}
                                      placeholder="Select"
                                    />
                                  </div>
                                  <textarea
                                    value={devotee.notes}
                                    onChange={(e) => handleDevoteeChange(item.sevaId, "notes", e.target.value)}
                                    placeholder="Special notes / instructions..."
                                    rows={2}
                                    className="w-full rounded-lg border border-border bg-warm-white p-3 text-sm text-text-primary placeholder:text-text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus-visible:outline-none transition-all resize-none"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-border p-5 bg-bg-tertiary/30 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">Subtotal</span>
                      <span className="font-medium text-text-primary">₹{cartTotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-muted">GST (18%)</span>
                      <span className="font-medium text-text-primary">₹{Math.round(cartTotal * 0.18).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="font-bold text-text-primary">Total</span>
                      <span className="font-heading font-bold text-lg text-primary">₹{cartGrandTotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={() => { clearCart(); setCart([]); setExpandedItem(null) }}>
                      Clear Cart
                    </Button>
                    <Button
                      variant="premium"
                      onClick={() => {
                        setCartOpen(false)
                        router.push("/sevas/cart/checkout")
                      }}
                      iconRight={<ChevronRight className="h-4 w-4" />}
                    >
                      Checkout
                    </Button>
                  </div>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
