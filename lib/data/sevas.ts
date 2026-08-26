import dailySevas from "./daily-sevas.json"
import shashwathaSevas from "./shashwatha-sevas.json"
import homas from "./homas.json"

export interface LocalizedString {
  kn: string
  en: string
}

export interface DailySeva {
  id: string
  slug: string
  name: LocalizedString
  description: LocalizedString
  price: number
  duration: number
  category: string
  icon: string
}

export interface ShashwathaSeva {
  id: string
  slug: string
  type: "NITYA_POOJA" | "NAVARATRI" | "SONARATHI"
  name: LocalizedString
  description: LocalizedString
  price: number
  duration: number
  featured: boolean
  features: { kn: string[]; en: string[] }
}

export interface Homa {
  id: string
  slug: string
  name: LocalizedString
  description: LocalizedString
  price: number
  duration: number
  category: string
  icon: string
}

export type SevaItem = DailySeva | ShashwathaSeva | Homa

export function localize<T extends { name: LocalizedString; description: LocalizedString }>(
  item: T,
  lang: string
): T & { name: string; description: string } {
  const l = (lang === "kn" ? "kn" : "en") as "kn" | "en"
  return { ...item, name: item.name[l], description: item.description[l] }
}

export function localizeFeatures(
  features: { kn: string[]; en: string[] },
  lang: string
): string[] {
  const l = (lang === "kn" ? "kn" : "en") as "kn" | "en"
  return features[l] || features.en
}

export function getDailySevas(lang: string) {
  return (dailySevas as DailySeva[]).map((s) => localize(s, lang))
}

export function getShashwathaSevas(lang: string) {
  return (shashwathaSevas as ShashwathaSeva[]).map((s) => ({
    ...localize(s, lang),
    features: s.features,
  }))
}

export function getHomas(lang: string) {
  return (homas as Homa[]).map((s) => localize(s, lang))
}

export function findSevaById(id: string): SevaItem | undefined {
  const all = [...(dailySevas as SevaItem[]), ...(shashwathaSevas as SevaItem[]), ...(homas as SevaItem[])]
  return all.find((s) => s.id === id)
}

export function findSevaBySlug(slug: string): SevaItem | undefined {
  const all = [...(dailySevas as SevaItem[]), ...(shashwathaSevas as SevaItem[]), ...(homas as SevaItem[])]
  return all.find((s) => s.slug === slug)
}
