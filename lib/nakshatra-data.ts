export interface Nakshatra {
  id: number
  name: string
  sanskrit: string
  deity: string
  symbol: string
  rashi: string
}

export interface Rashi {
  id: number
  name: string
  sanskrit: string
  lord: string
}

export const nakshatras: Nakshatra[] = [
  { id: 1, name: "Ashwini", sanskrit: "अश्विनी", deity: "Ashwini Kumaras", symbol: "Horse's head", rashi: "Aries" },
  { id: 2, name: "Bharani", sanskrit: "भरणी", deity: "Yama", symbol: "Yoni", rashi: "Aries" },
  { id: 3, name: "Krittika", sanskrit: "कृत्तिका", deity: "Agni", symbol: "Razor", rashi: "Taurus" },
  { id: 4, name: "Rohini", sanskrit: "रोहिणी", deity: "Brahma", symbol: "Chariot", rashi: "Taurus" },
  { id: 5, name: "Mrigashira", sanskrit: "मृगशीर्ष", deity: "Soma", symbol: "Deer's head", rashi: "Gemini" },
  { id: 6, name: "Ardra", sanskrit: "आर्द्रा", deity: "Rudra", symbol: "Teardrop", rashi: "Gemini" },
  { id: 7, name: "Punarvasu", sanskrit: "पुनर्वसु", deity: "Aditi", symbol: "Arrow", rashi: "Cancer" },
  { id: 8, name: "Pushya", sanskrit: "पुष्य", deity: "Brihaspati", symbol: "Cow's udder", rashi: "Cancer" },
  { id: 9, name: "Ashlesha", sanskrit: "आश्लेषा", deity: "Shesha", symbol: "Serpent", rashi: "Leo" },
  { id: 10, name: "Magha", sanskrit: "मघा", deity: "Pitris", symbol: "Throne", rashi: "Leo" },
  { id: 11, name: "Purva Phalguni", sanskrit: "पूर्व फाल्गुनी", deity: "Bhaga", symbol: "Hammock", rashi: "Virgo" },
  { id: 12, name: "Uttara Phalguni", sanskrit: "उत्तर फाल्गुनी", deity: "Aryaman", symbol: "Bed", rashi: "Virgo" },
  { id: 13, name: "Hasta", sanskrit: "हस्त", deity: "Savitr", symbol: "Hand", rashi: "Libra" },
  { id: 14, name: "Chitra", sanskrit: "चित्रा", deity: "Tvashtar", symbol: "Pearl", rashi: "Libra" },
  { id: 15, name: "Swati", sanskrit: "स्वाति", deity: "Vayu", symbol: "Coral", rashi: "Scorpio" },
  { id: 16, name: "Vishakha", sanskrit: "विशाखा", deity: "Indra-Agni", symbol: "Potter's wheel", rashi: "Scorpio" },
  { id: 17, name: "Anuradha", sanskrit: "अनुराधा", deity: "Mitra", symbol: "Lotus", rashi: "Sagittarius" },
  { id: 18, name: "Jyeshtha", sanskrit: "ज्येष्ठा", deity: "Indra", symbol: "Umbrella", rashi: "Sagittarius" },
  { id: 19, name: "Mula", sanskrit: "मूल", deity: "Nirriti", symbol: "Tied roots", rashi: "Capricorn" },
  { id: 20, name: "Purva Ashadha", sanskrit: "पूर्वाषाढा", deity: "Apas", symbol: "Fan", rashi: "Capricorn" },
  { id: 21, name: "Uttara Ashadha", sanskrit: "उत्तराषाढा", deity: "Vishvadevas", symbol: "Tusk", rashi: "Aquarius" },
  { id: 22, name: "Shravana", sanskrit: "श्रवण", deity: "Vishnu", symbol: "Ear", rashi: "Aquarius" },
  { id: 23, name: "Dhanishtha", sanskrit: "धनिष्ठा", deity: "Vasus", symbol: "Drum", rashi: "Pisces" },
  { id: 24, name: "Shatabhisha", sanskrit: "शतभिषा", deity: "Varuna", symbol: "Circle", rashi: "Pisces" },
  { id: 25, name: "Purva Bhadrapada", sanskrit: "पूर्वभाद्रपदा", deity: "Aja Ekapada", symbol: "Sword", rashi: "Aries" },
  { id: 26, name: "Uttara Bhadrapada", sanskrit: "उत्तरभाद्रपदा", deity: "Ahirbudhnya", symbol: "Twins", rashi: "Pisces" },
  { id: 27, name: "Revati", sanskrit: "रेवती", deity: "Pushan", symbol: "Fish", rashi: "Pisces" },
]

export const rashis: Rashi[] = [
  { id: 1, name: "Mesha", sanskrit: "मेष", lord: "Mangala" },
  { id: 2, name: "Vrishabha", sanskrit: "वृषभ", lord: "Shukra" },
  { id: 3, name: "Mithuna", sanskrit: "मिथुन", lord: "Budha" },
  { id: 4, name: "Karka", sanskrit: "कर्क", lord: "Chandra" },
  { id: 5, name: "Simha", sanskrit: "सिंह", lord: "Surya" },
  { id: 6, name: "Kanya", sanskrit: "कन्या", lord: "Budha" },
  { id: 7, name: "Tula", sanskrit: "तुला", lord: "Shukra" },
  { id: 8, name: "Vrishchika", sanskrit: "वृश्चिक", lord: "Kuja" },
  { id: 9, name: "Dhanu", sanskrit: "धनु", lord: "Guru" },
  { id: 10, name: "Makara", sanskrit: "मकर", lord: "Shani" },
  { id: 11, name: "Kumbha", sanskrit: "कुम्भ", lord: "Shani" },
  { id: 12, name: "Meena", sanskrit: "मीन", lord: "Guru" },
]

export const nakshatraOptions = nakshatras.map((n) => ({
  value: n.name,
  label: `${n.name} (${n.sanskrit})`,
}))

export const rashiOptions = rashis.map((r) => ({
  value: r.name,
  label: `${r.name} (${r.sanskrit})`,
}))

export function getNakshatraByName(name: string): Nakshatra | undefined {
  return nakshatras.find((n) => n.name.toLowerCase() === name.toLowerCase())
}

export function getRashiByName(name: string): Rashi | undefined {
  return rashis.find((r) => r.name.toLowerCase() === name.toLowerCase())
}

export function getNakshatrasByRashi(rashi: string): Nakshatra[] {
  return nakshatras.filter((n) => n.rashi.toLowerCase() === rashi.toLowerCase())
}
