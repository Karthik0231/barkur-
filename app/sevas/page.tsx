"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Clock, IndianRupee, ChevronRight, Filter, Sparkles, Droplets, Heart, Star, Flame, Sun, Moon } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const categories = ["All", "Daily Pooja", "Abhishekam", "Archana", "Homa", "Special"]

const sampleSevas = [
  {
    id: "nitya-pooja",
    name: "Nitya Pooja",
    description: "Daily morning worship to the presiding deity Sri Kalikamba Devi with traditional vedic rituals.",
    price: 501,
    duration: "30 min",
    category: "Daily Pooja",
    gradient: "from-amber-600 to-orange-700",
    image: "https://picsum.photos/seed/nityapooja/800/600",
    icon: Sun,
  },
  {
    id: "abhishekam",
    name: "Abhishekam",
    description: "Sacred bathing ceremony of the deity with milk, curd, honey, ghee, and holy waters.",
    price: 1001,
    duration: "45 min",
    category: "Abhishekam",
    gradient: "from-blue-600 to-cyan-700",
    image: "https://picsum.photos/seed/abhishekam/800/600",
    icon: Droplets,
  },
  {
    id: "archana",
    name: "Archana",
    description: "Offering of flowers and chanting of 108 sacred names of the Goddess for blessings.",
    price: 251,
    duration: "20 min",
    category: "Archana",
    gradient: "from-rose-600 to-pink-700",
    image: "https://picsum.photos/seed/archana/800/600",
    icon: Heart,
  },
  {
    id: "sahasranama-archana",
    name: "Sahasranama Archana",
    description: "Recitation of thousand sacred names of the Divine Mother with elaborate offerings.",
    price: 751,
    duration: "60 min",
    category: "Archana",
    gradient: "from-purple-600 to-violet-700",
    image: "https://picsum.photos/seed/sahasranama/800/600",
    icon: Star,
  },
  {
    id: "durga-saptashati",
    name: "Durga Saptashati Parayana",
    description: "Sacred recitation of the 700-verse Durga Saptashati for divine blessings and protection.",
    price: 1501,
    duration: "90 min",
    category: "Special",
    gradient: "from-red-600 to-rose-700",
    image: "https://picsum.photos/seed/durgasaptashati/800/600",
    icon: Sparkles,
  },
  {
    id: "panchamrita-abhishekam",
    name: "Panchamrita Abhishekam",
    description: "Five nectar bath ceremony using milk, curd, honey, ghee, and sugar for supreme blessings.",
    price: 2001,
    duration: "60 min",
    category: "Abhishekam",
    gradient: "from-teal-600 to-emerald-700",
    image: "https://picsum.photos/seed/panchamrita/800/600",
    icon: Moon,
  },
  {
    id: "kumkumarchana",
    name: "Kumkumarchana",
    description: "Offering of sacred kumkum with vedic chants for marital bliss and well-being.",
    price: 351,
    duration: "20 min",
    category: "Daily Pooja",
    gradient: "from-pink-600 to-rose-700",
    image: "https://picsum.photos/seed/kumkum/800/600",
    icon: Sparkles,
  },
  {
    id: "chandi-homa",
    name: "Chandi Homa",
    description: "Powerful sacred fire ritual invoking Goddess Durga for protection, prosperity, and spiritual growth.",
    price: 5001,
    duration: "120 min",
    category: "Homa",
    gradient: "from-orange-700 to-red-800",
    image: "https://picsum.photos/seed/chandihoma/800/600",
    icon: Flame,
  },
]

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
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSevas = useMemo(() => {
    return sampleSevas.filter((seva) => {
      const matchesCategory = activeCategory === "All" || seva.category === activeCategory
      const matchesSearch = seva.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seva.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <div className="min-h-screen">
      <section className="relative h-[55vh] min-h-[420px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://picsum.photos/seed/temple-sevas/1920/1080"
            alt="Sacred Offerings"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-primary-dark/95" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='0.15'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <AnimatedSection>
            <Badge variant="secondary" size="md" className="mb-4">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Sacred Offerings
            </Badge>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-warm-white leading-tight"
            >
              Sacred <span className="gradient-text-gold">Offerings</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-warm-white/80 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed"
            >
              Book sacred sevas and poojas to receive the divine blessings of Sri Kalikamba Devi
            </motion.p>
          </AnimatedSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent z-10" />
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-text-muted mb-10"
          >
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-text-primary font-medium">Sevas</span>
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
                placeholder="Search sevas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                iconLeft={<Search className="h-4 w-4" />}
                variant="filled"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {filteredSevas.length === 0 ? (
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
                <h3 className="text-xl font-heading font-bold text-text-primary">No sevas found</h3>
                <p className="text-text-muted mt-2">Try adjusting your search or filter</p>
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
                  const Icon = seva.icon
                  return (
                    <motion.div
                      key={seva.id}
                      variants={itemVariants}
                      layout
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <Card variant="elevated" padding="none" hover className="group h-full overflow-hidden relative">
                        <div className="relative h-52 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-b from-maroon-900/10 to-transparent z-[1]" />
                          <Image
                            src={seva.image}
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
                              {seva.category}
                            </Badge>
                          </div>
                          <div className="absolute bottom-4 left-4 z-[3]">
                            <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg shadow-black/20 ring-2 ring-white/30", seva.gradient)}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                          </div>
                        </div>
                        <div className="p-5 pt-4">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-lg font-heading font-bold text-text-primary group-hover:text-primary transition-colors leading-tight">
                              {seva.name}
                            </h3>
                            {seva.price >= 5000 && (
                              <span className="shrink-0 text-[10px] uppercase tracking-wider font-bold text-gold-600 bg-gold-50 px-2 py-0.5 rounded-full border border-gold-200/50">
                                Premium
                              </span>
                            )}
                          </div>
                          <p className="mt-1.5 text-sm text-text-secondary leading-relaxed line-clamp-2">
                            {seva.description}
                          </p>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-sm font-bold text-text-primary">
                              <IndianRupee className="h-3.5 w-3.5 text-primary" />
                              <span>{seva.price.toLocaleString("en-IN")}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-text-muted">
                              <Clock className="h-3 w-3" />
                              <span>{seva.duration}</span>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-border/50">
                            <Link href={`/sevas/${seva.id}`}>
                              <Button variant="gradient" size="sm" className="w-full group/btn rounded-lg">
                                Book Now
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
