export interface PanchangaData {
  tithi: string
  nakshatra: string
  nakshatraPada: number
  yoga: string
  karana: string
  masa: string
  paksha: string
  sunrise: string
  sunset: string
  moonrise: string
  moonset: string
  rahuKala: { start: string; end: string }
  yamaganda: { start: string; end: string }
  gulika: { start: string; end: string }
  amritaKala: { start: string; end: string }
  abhijitMuhurta: { start: string; end: string }
  isEkadashi: boolean
  isAmavasya: boolean
  isPournami: boolean
}

const TITHI_NAMES = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya",
]

const NAKSHATRA_NAMES = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira",
  "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
  "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati",
  "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
  "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada",
  "Uttara Bhadrapada", "Revati",
]

const YOGA_NAMES = [
  "Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
  "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda",
  "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
  "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva",
  "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma",
  "Indra", "Vaidhriti",
]

const KARANA_NAMES = [
  "Bava", "Balava", "Kaulava", "Taitila", "Garija",
  "Vanija", "Vishti", "Shakuni", "Chatushpada", "Naga",
  "Kimstughna",
]

const MASA_NAMES = [
  "Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana",
  "Bhadrapada", "Ashvina", "Kartika", "Margashirsha", "Pausha",
  "Magha", "Phalguna",
]

const RASHI_NAMES = [
  "Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya",
  "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena",
]

const LATITUDE = 13.47
const LONGITUDE = 74.75
const IST_OFFSET = 5.5 // hours

function toJulian(date: Date): number {
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1
  const day = date.getUTCDate()
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
  const hours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600
  return jdn + (hours - 12) / 24
}

function obliquityAt(jd: number): number {
  return 23.439291 - 0.00000036 * (jd - 2451545.0)
}

function calcSunrise(julianDay: number, lat: number, lon: number): number {
  const n = julianDay - 2451545.0
  const meanAnomaly = (357.5291 + 0.98560028 * n) % 360
  const c = 1.9148 * Math.sin(meanAnomaly * Math.PI / 180) + 0.02 * Math.sin(2 * meanAnomaly * Math.PI / 180) + 0.0003 * Math.sin(3 * meanAnomaly * Math.PI / 180)
  const eclipticLongitude = ((meanAnomaly + c + 180 + 102.9372) % 360 + 360) % 360
  const obliquity = obliquityAt(julianDay)
  const declination = Math.asin(Math.sin(obliquity * Math.PI / 180) * Math.sin(eclipticLongitude * Math.PI / 180)) * 180 / Math.PI
  const cosHA = (Math.sin(-0.833 * Math.PI / 180) - Math.sin(lat * Math.PI / 180) * Math.sin(declination * Math.PI / 180)) / (Math.cos(lat * Math.PI / 180) * Math.cos(declination * Math.PI / 180))
  const hourAngle = Math.acos(Math.max(-1, Math.min(1, cosHA))) * 180 / Math.PI
  const equationOfTime = 4 * (meanAnomaly - 2 * c - 0.0053 * Math.sin(meanAnomaly * Math.PI / 180) + 0.0069 * Math.sin(2 * eclipticLongitude * Math.PI / 180))
  const utHours = 12 - hourAngle / 15 - equationOfTime / 60
  const localHours = utHours + lon / 15 + IST_OFFSET
  return ((localHours % 24) + 24) % 24
}

function formatTime(hours: number): string {
  if (!isFinite(hours)) return "—"
  const h = ((Math.floor(hours) % 24) + 24) % 24
  const m = Math.floor((hours - Math.floor(hours)) * 60)
  const period = h >= 12 ? "PM" : "AM"
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, "0")} ${period}`
}

function calcSunPosition(jd: number): { lon: number } {
  const t = (jd - 2451545.0) / 36525
  const L = ((280.46646 + 36000.76983 * t + 0.0003032 * t * t) % 360 + 360) % 360
  const M = ((357.52911 + 35999.05029 * t - 0.0001537 * t * t) % 360 + 360) % 360
  const c = (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(M * Math.PI / 180)
    + (0.019993 - 0.000101 * t) * Math.sin(2 * M * Math.PI / 180)
    + 0.000289 * Math.sin(3 * M * Math.PI / 180)
  const sunLon = ((L + c) % 360 + 360) % 360
  return { lon: sunLon }
}

// Returns Moon's geocentric ecliptic longitude AND latitude (leading terms only).
function calcMoonPosition(jd: number): { lon: number; lat: number } {
  const t = (jd - 2451545.0) / 36525
  const Lp = ((218.3165 + 481267.8813 * t) % 360 + 360) % 360
  const Mp = ((134.9634 + 477198.8676 * t) % 360 + 360) % 360
  const M = ((357.5291 + 35999.0503 * t) % 360 + 360) % 360
  const D = ((297.8502 + 445267.1114 * t) % 360 + 360) % 360
  const F = ((93.2667 + 483202.0187 * t) % 360 + 360) % 360
  const eclLon = Lp
    + 6.2888 * Math.sin(Mp * Math.PI / 180)
    + 1.2740 * Math.sin((2 * D - Mp) * Math.PI / 180)
    + 0.6583 * Math.sin(2 * D * Math.PI / 180)
    + 0.2136 * Math.sin(2 * Mp * Math.PI / 180)
    - 0.1856 * Math.sin(M * Math.PI / 180)
    - 0.1143 * Math.sin(2 * F * Math.PI / 180)
    + 0.0588 * Math.sin((2 * D - 2 * Mp) * Math.PI / 180)
    + 0.0572 * Math.sin((2 * D - Mp - M) * Math.PI / 180)
    + 0.0533 * Math.sin((2 * D + Mp) * Math.PI / 180)
    + 0.0459 * Math.sin((2 * D - M) * Math.PI / 180)
    + 0.0410 * Math.sin((Mp - M) * Math.PI / 180)
    + 0.0348 * Math.sin(D * Math.PI / 180)
    + 0.0306 * Math.sin((Mp + M) * Math.PI / 180)
    + 0.0153 * Math.sin((2 * D - 2 * F) * Math.PI / 180)
    + 0.0093 * Math.sin((D + 2 * F) * Math.PI / 180)
  const moonLon = ((eclLon + 360) % 360 + 360) % 360
  // Leading-term ecliptic latitude (dominant ~5.13° term); adequate for a display-grade moonrise/set.
  const moonLat = 5.1282 * Math.sin(F * Math.PI / 180)
  return { lon: moonLon, lat: moonLat }
}

// FIX: previously this returned *only* the precession accumulated since J2000 (≈0° in the
// year 2000) instead of the actual ayanamsa. Lahiri ayanamsa at J2000.0 is ≈23.85°, so
// Nakshatra/Masa (which depend on sidereal longitude) were off by roughly two nakshatras.
function ayanamsa(jd: number): number {
  const LAHIRI_AT_J2000 = 23.85
  const t = (jd - 2451545.0) / 36525
  const precessionArcsec = 5029.0926 * t + 1.112 * t * t + 0.000077 * t * t * t
  return LAHIRI_AT_J2000 + precessionArcsec / 3600
}

function calcTithiIndex(sun: number, moon: number): number {
  return Math.floor((((moon - sun + 360) % 360)) / 12)
}

function calcTithi(sun: number, moon: number): { index: number; name: string; paksha: string } {
  const idx = calcTithiIndex(sun, moon)
  const paksha = idx < 15 ? "Shukla Paksha" : "Krishna Paksha"
  return { index: idx, name: TITHI_NAMES[idx], paksha }
}

function calcNakshatra(moonNirayana: number): { index: number; name: string; pada: number } {
  const span = 360 / 27
  const idx = Math.floor(moonNirayana / span) % 27
  const withinNakshatra = moonNirayana % span
  const pada = Math.floor(withinNakshatra / (span / 4)) + 1
  return { index: idx, name: NAKSHATRA_NAMES[idx], pada }
}

// FIX: Yoga is Sun + Moon, so it must use SIDEREAL (nirayana) longitudes for both — using
// tropical longitudes here doubled the ayanamsa error instead of cancelling it out.
function calcYoga(sunNirayana: number, moonNirayana: number): { index: number; name: string } {
  const idx = Math.floor((((sunNirayana + moonNirayana) % 360 + 360) % 360) / (360 / 27)) % 27
  return { index: idx, name: YOGA_NAMES[idx] }
}

function calcKarana(sun: number, moon: number): { index: number; name: string } {
  const tithiFraction = (((moon - sun + 360) % 360)) / 6
  const idx = Math.floor(tithiFraction) % 11
  return { index: idx, name: KARANA_NAMES[idx] }
}

// NOTE (limitation): this names the masa after the Sun's current sidereal rashi. It's a
// reasonable approximation for display, but true Amanta/Purnimanta month-naming (and Adhika
// Masa / leap-month handling) requires tracking new-moon nakshatra, which isn't done here.
function calcMasa(sunNirayana: number): string {
  const sunRashi = Math.floor(sunNirayana / 30) % 12
  return MASA_NAMES[sunRashi]
}

function calcRashi(moonNirayana: number): string {
  return RASHI_NAMES[Math.floor(moonNirayana / 30) % 12]
}

function eclipticToEquatorial(lonDeg: number, latDeg: number, obliquityDeg: number): { ra: number; dec: number } {
  const lon = (lonDeg * Math.PI) / 180
  const lat = (latDeg * Math.PI) / 180
  const obl = (obliquityDeg * Math.PI) / 180
  const sinDec = Math.sin(lat) * Math.cos(obl) + Math.cos(lat) * Math.sin(obl) * Math.sin(lon)
  const dec = Math.asin(Math.max(-1, Math.min(1, sinDec)))
  const y = Math.sin(lon) * Math.cos(obl) - Math.tan(lat) * Math.sin(obl)
  const x = Math.cos(lon)
  let ra = (Math.atan2(y, x) * 180) / Math.PI
  ra = ((ra % 360) + 360) % 360
  return { ra, dec: (dec * 180) / Math.PI }
}

function calcGMST(jd: number): number {
  const T = (jd - 2451545.0) / 36525
  const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000
  return ((gmst % 360) + 360) % 360
}

// NOTE (limitation): single-epoch (non-iterative) rise/set solve. Because the Moon moves
// ~12-13°/day, this can be off by up to ~20-30 minutes versus an iterative ephemeris solution.
// Good enough for a "roughly when" display; not for split-second ritual timing.
function calcMoonRiseSet(dateJD0UT: number, lat: number, lon: number): { moonrise: string; moonset: string } {
  const moonPos = calcMoonPosition(dateJD0UT)
  const obliquity = obliquityAt(dateJD0UT)
  const eq = eclipticToEquatorial(moonPos.lon, moonPos.lat, obliquity)
  const h0 = 0.125 // standard altitude for Moon rise/set (deg): refraction + semidiameter - parallax
  const latRad = (lat * Math.PI) / 180
  const decRad = (eq.dec * Math.PI) / 180
  const cosH = (Math.sin((h0 * Math.PI) / 180) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad))
  if (cosH > 1 || cosH < -1) return { moonrise: "—", moonset: "—" }
  const H0 = (Math.acos(cosH) * 180) / Math.PI
  const gmst0 = calcGMST(dateJD0UT)

  const solve = (sign: 1 | -1) => {
    const target = (((eq.ra + sign * H0 - lon) % 360) + 360) % 360
    const deltaDeg = (((target - gmst0) % 360) + 360) % 360
    const deltaDays = deltaDeg / 360.98564736629
    const utHours = deltaDays * 24
    return ((utHours + IST_OFFSET) % 24 + 24) % 24
  }

  return { moonrise: formatTime(solve(-1)), moonset: formatTime(solve(1)) }
}

function calcPeriods(julianDay: number, sunriseHours: number, sunsetHours: number) {
  const dayLength = sunsetHours - sunriseHours
  const eighthDay = dayLength / 8
  const dayOfWeek = (Math.floor(julianDay + 1.5) % 7 + 7) % 7
  const rahuSlots = [4, 3, 2, 1, 0, 5, 6]
  const yamaSlots = [1, 6, 5, 4, 3, 2, 0]
  const guliSlots = [5, 4, 3, 2, 1, 0, 6]
  const ri = rahuSlots[dayOfWeek]
  const yi = yamaSlots[dayOfWeek]
  const gi = guliSlots[dayOfWeek]
  const rahuKala = { start: formatTime(sunriseHours + ri * eighthDay), end: formatTime(sunriseHours + (ri + 1) * eighthDay) }
  const yamaganda = { start: formatTime(sunriseHours + yi * eighthDay), end: formatTime(sunriseHours + (yi + 1) * eighthDay) }
  const gulika = { start: formatTime(sunriseHours + gi * eighthDay), end: formatTime(sunriseHours + (gi + 1) * eighthDay) }
  // NOTE (limitation): Amrita Kala should come from nakshatra+vara lookup tables. This is a
  // placeholder proportion of daylight, kept from the original implementation.
  const amritaStart = sunriseHours + dayLength * 0.2
  const amritaEnd = sunriseHours + dayLength * 0.35
  const noonLocal = 12 + IST_OFFSET + LONGITUDE / 15
  const abhijitStart = noonLocal - 0.4
  const abhijitEnd = noonLocal + 0.4
  return {
    rahuKala,
    yamaganda,
    gulika,
    amritaKala: { start: formatTime(amritaStart), end: formatTime(amritaEnd) },
    abhijitMuhurta: { start: formatTime(abhijitStart), end: formatTime(abhijitEnd) },
  }
}

export function calculatePanchanga(date: Date): PanchangaData {
  const julianDay = toJulian(date)
  const jd0UT = Math.floor(julianDay - 0.5) + 0.5 // 0h UT of this date, used for rise/set solving
  const sunriseHours = calcSunrise(julianDay, LATITUDE, LONGITUDE)
  const sunsetHours = calcSunrise(julianDay + 0.5, LATITUDE, LONGITUDE)

  const sunrise = formatTime(sunriseHours)
  const sunset = formatTime(sunsetHours)
  const { moonrise, moonset } = calcMoonRiseSet(jd0UT, LATITUDE, LONGITUDE)

  const sunPos = calcSunPosition(julianDay)
  const moonPos = calcMoonPosition(julianDay)
  const sunSayana = sunPos.lon
  const moonSayana = moonPos.lon
  const ayan = ayanamsa(julianDay)
  const sunNirayana = ((sunSayana - ayan) % 360 + 360) % 360
  const moonNirayana = ((moonSayana - ayan) % 360 + 360) % 360

  const tithi = calcTithi(sunSayana, moonSayana)
  const nakshatra = calcNakshatra(moonNirayana)
  const yoga = calcYoga(sunNirayana, moonNirayana)
  const karana = calcKarana(sunSayana, moonSayana)
  const masa = calcMasa(sunNirayana)

  const periods = calcPeriods(julianDay, sunriseHours, sunsetHours)

  return {
    tithi: tithi.name,
    nakshatra: nakshatra.name,
    nakshatraPada: nakshatra.pada,
    yoga: yoga.name,
    karana: karana.name,
    masa,
    paksha: tithi.paksha,
    sunrise,
    sunset,
    moonrise,
    moonset,
    rahuKala: periods.rahuKala,
    yamaganda: periods.yamaganda,
    gulika: periods.gulika,
    amritaKala: periods.amritaKala,
    abhijitMuhurta: periods.abhijitMuhurta,
    isEkadashi: tithi.index === 10 || tithi.index === 25,
    isAmavasya: tithi.index === 29,
    isPournami: tithi.index === 14,
  }
}

const defaultPanchanga: PanchangaData = {
  tithi: "—",
  nakshatra: "—",
  nakshatraPada: 0,
  yoga: "—",
  karana: "—",
  masa: "—",
  paksha: "—",
  sunrise: "—",
  sunset: "—",
  moonrise: "—",
  moonset: "—",
  rahuKala: { start: "—", end: "—" },
  yamaganda: { start: "—", end: "—" },
  gulika: { start: "—", end: "—" },
  amritaKala: { start: "—", end: "—" },
  abhijitMuhurta: { start: "—", end: "—" },
  isEkadashi: false,
  isAmavasya: false,
  isPournami: false,
}

let cache: { date: string; data: PanchangaData } | null = null

export async function fetchPanchanga(date?: Date): Promise<PanchangaData> {
  const d = date || new Date()
  const istDate = new Date(d.getTime() + d.getTimezoneOffset() * 60000 + 330 * 60000)
  const istDateStr = istDate.toISOString().split("T")[0]

  if (cache && cache.date === istDateStr) return cache.data

  try {
    const res = await fetch(`/api/panchanga?date=${istDateStr}`, { cache: "no-store" })
    const json = await res.json()
    if (json?.success && json?.data?.panchanga) {
      const p = json.data.panchanga
      const result: PanchangaData = {
        tithi: p.tithi,
        nakshatra: p.nakshatra,
        nakshatraPada: p.nakshatraPada ?? 0,
        yoga: p.yoga,
        karana: p.karana,
        masa: p.masa || p.month || "—",
        paksha: p.paksha || "",
        sunrise: p.sunrise,
        sunset: p.sunset,
        moonrise: p.moonrise || "—",
        moonset: p.moonset || "—",
        rahuKala: { start: p.rahuKalaStart || "", end: p.rahuKalaEnd || "" },
        yamaganda: { start: p.yamagandaStart || "", end: p.yamagandaEnd || "" },
        gulika: { start: p.gulikaStart || "", end: p.gulikaEnd || "" },
        amritaKala: { start: p.amritaKalaStart || "", end: p.amritaKalaEnd || "" },
        abhijitMuhurta: { start: p.abhijitMuhurtaStart || "", end: p.abhijitMuhurtaEnd || "" },
        isEkadashi: p.isEkadashi || false,
        isAmavasya: p.isAmavasya || false,
        isPournami: p.isPournami || false,
      }
      cache = { date: istDateStr, data: result }
      return result
    }
  } catch {
    // fall through to calculate locally
  }

  const local = calculatePanchanga(istDate)
  cache = { date: istDateStr, data: local }
  return local
}