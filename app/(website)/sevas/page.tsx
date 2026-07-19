"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Clock, IndianRupee, ChevronRight, Filter, Sparkles, Droplets, Heart, Star, Flame, Sun, Moon, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { PageBanner } from "@/components/PageBanner"
import { useTranslation } from "@/lib/i18n"

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
  const [sevas, setSevas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetch("/api/sevas?limit=100")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setSevas(res.data.sevas)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(() => {
    const cats = new Set(sevas.map((s) => s.category?.name).filter(Boolean))
    return ["All", ...Array.from(cats)]
  }, [sevas])

  const filteredSevas = useMemo(() => {
    return sevas.filter((seva) => {
      const matchesCategory = activeCategory === "All" || seva.category?.name === activeCategory
      const matchesSearch = seva.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (seva.description || seva.shortDescription || "").toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery, sevas])

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

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    activeCategory === cat
                      ? "bg-primary text-warm-white shadow-md shadow-primary/20"
                      : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary border border-border",
                  )}
                >
                  {cat === "All" ? <Filter className="h-3.5 w-3.5 inline mr-1" /> : null}
                  {cat}
                </motion.button>
              ))}
            </div>
            <div className="w-full lg:w-72">
              <Input
                placeholder={t("sevas.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                iconLeft={<Search className="h-4 w-4" />}
                variant="filled"
              />
            </div>
          </div>

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
                key={activeCategory + searchQuery}
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
                            src={seva.image || "/placeholder-seva.jpg"}
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
                          <div className="mt-4 pt-4 border-t border-border/50">
                            <Link href={`/sevas/${seva.slug || seva.id}`}>
                              <Button variant="gradient" size="sm" className="w-full group/btn rounded-lg">
                                {t("sevas.bookNow")}
                                <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
                              </Button>
                            </Link>
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
      </section>
    </div>
  )
}
