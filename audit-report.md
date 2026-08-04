# Code Audit Report: barkurweb

**Scope:** All component files in `C:\Apps-26\barkurweb\components` and all utility files in `C:\Apps-26\barkurweb\lib`
**Date:** 2026-07-31
**Total Files Audited:** ~73 (50+ components, 18 lib files)
**Categories:** Missing Hook Dependencies, Memory Leaks, TypeScript Errors, Unused Imports, Hardcoded Values, Security Issues, Performance Issues

---

## 1. Missing Hook Dependencies

### Finding MHD-001: Missing dependencies in `useEffect`
- **File:** `components\admin\sidebar.tsx` — line 265
- **Code:**
  ```tsx
  useEffect(() => {
    if (mobileOpen && onMobileClose) {
      onMobileClose()
    }
  }, [pathname])  // <-- missing mobileOpen, onMobileClose
  ```
- **Severity:** Medium / Medium-High
- **Impact:** When `mobileOpen` or `onMobileClose` changes, the effect will not re-run, causing stale closure behavior. The callback `onMobileClose` may reference outdated state/props.
- **Fix:** Add `mobileOpen` and `onMobileClose` to the dependency array: `}, [pathname, mobileOpen, onMobileClose])`

---

## 2. Memory Leaks

### Finding ML-001: Uncancelled rAF loop in LenisProvider
- **File:** `components\lenis-provider.tsx` — lines 22-24, 26
- **Code:**
  ```tsx
  function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)   // never cancelled
  }
  requestAnimationFrame(raf)

  return () => { lenis.destroy() }  // destroys Lenis but not the rAF loop
  ```
- **Severity:** High
- **Impact:** When the component unmounts, `lenis.destroy()` is called, but the `requestAnimationFrame` loop continues to fire indefinitely. The `raf` callback will keep executing `lenis.raf(time)` on a destroyed instance, leaking memory and consuming CPU.
- **Fix:** Store the rAF callback ID and cancel it in the cleanup:
  ```tsx
  const rafId = useRef<number>()
  function raf(time: number) {
    lenis.raf(time)
    rafId.current = requestAnimationFrame(raf)
  }
  return () => {
    if (rafId.current) cancelAnimationFrame(rafId.current)
    lenis.destroy()
  }
  ```

### Finding ML-002: Same uncancelled rAF loop in SmoothScroll
- **File:** `components\smooth-scroll.tsx` — lines 22-25, 29-31
- **Code:**
  ```tsx
  function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)   // never cancelled
  }
  requestAnimationFrame(raf)

  return () => {
    lenis.destroy()
  }
  ```
- **Severity:** High
- **Impact:** Identical to ML-001 — the rAF loop persists after component unmount, leaking resources.
- **Fix:** Same as ML-001.

---

## 3. TypeScript Errors

### Finding TS-001: Potentially undefined value passed to `resolveTranslation`
- **File:** `lib\i18n\index.tsx` — line 65
- **Code:**
  ```tsx
  const t = useCallback(
    (key: string) => resolveTranslation(translations[language], key),
    [language]
  )
  ```
- **Severity:** Medium
- **Impact:** `translations` is keyed by `string`, not by the `Language` type. TypeScript treats `translations[language]` as `TranslationData` at the narrowed type level, but at runtime if an unexpected `language` value reaches this code path (e.g., from a race condition or external data), `resolveTranslation` would receive `undefined` and throw a runtime error at line 25 when it tries to iterate `keys` on it. The `I18nContext` default (line 37) hardcodes `translations.kn` and the mounted fallback (line 70) also uses `translations.kn`, so this is guarded in practice — but the type contract is misleading.
- **Fix:** Add a runtime guard or type `translations` as `Record<Language, TranslationData>`:
  ```tsx
  const t = useCallback(
    (key: string) => {
      const data = translations[language] as TranslationData
      return data ? resolveTranslation(data, key) : key
    },
    [language]
  )
  ```

---

## 4. Unused Imports

### Finding UI-001: `useState` imported but not the only import that could be scrutinized
- **File:** `components\sections\events-section.tsx` — line 3
- **Note:** After re-reading the full file, `useState` IS used on lines 23-24 (`const [events, setEvents]` and `const [loading, setLoading]`). The original audit flag on this file was **incorrect** — `useState` is actively used.
- **Correct finding:** No confirmed unused imports in this file after full verification.

### Findings UI-002 through UI-00N: No verified unused imports found
- After re-reading all component and lib files, no definitively unused imports were confirmed. Every imported symbol was traceable to a usage in the file.
- **Recommendation:** Run `npx tsc --noEmit` or a linter (`eslint-plugin-unused-imports`) to catch any imports that may have been masked by conditional usage or re-exports.

---

## 5. Hardcoded Values

### Finding HV-001: Hardcoded fallback URL in `absoluteUrl`
- **File:** `lib\utils.ts` — lines 102-104
- **Code:**
  ```ts
  export function absoluteUrl(path: string) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    return `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`
  }
  ```
- **Severity:** Medium
- **Impact:** The hardcoded fallback `http://localhost:3000` will produce incorrect absolute URLs in production if `NEXT_PUBLIC_APP_URL` is not set, causing broken links in emails and shared URLs.
- **Fix:** Remove the fallback or throw in production; make the URL always an environment variable.

### Finding HV-002: Hardcoded temple identity constants
- **File:** `lib\constants.ts` — lines 1-116
- **Code:**
  ```ts
  export const TEMPLE_NAME = "Sri Kalikamba Temple"
  export const TEMPLE_LOCATION = "Barkur, Udupi District, Karnataka, India"
  export const TEMPLE_PHONE = "+91 77952 92377"
  export const TEMPLE_EMAIL = "info@kalikambatemple.org"
  // ... etc.
  ```
- **Severity:** Low (architectural)
- **Impact:** These values are correct for the current temple but make the codebase non-reusable. If deployed for a different temple, every constant must be manually changed.
- **Fix:** Consider making these configurable via environment variables or a site-config file, especially `TEMPLE_NAME`, `TEMPLE_EMAIL`, and `TEMPLE_PHONE`.

### Finding HV-003: Hardcoded inline background color in panchanga section
- **File:** `components\sections\panchanga-section.tsx` — line 151
- **Code:**
  ```tsx
  <section ref={ref} className="relative py-20 sm:py-28 overflow-hidden" style={{ backgroundColor: "#F4EFE8" }}>
  ```
- **Severity:** Low
- **Impact:** The parchment color `#F4EFE8` is defined as a CSS custom property or Tailwind color elsewhere (the section uses `bg-gold-50/20` in other places). Hardcoding it in a `style` attribute prevents theme switching and is not discoverable in the design system.
- **Fix:** Use a Tailwind class or CSS custom property instead, e.g., `className="bg-[#F4EFE8]"` or `className="bg-parchment"`.

### Finding HV-004: Hardcoded default stats values
- **File:** `components\sections\stats-section.tsx` — lines 15-20
- **Code:**
  ```tsx
  const defaultStats: StatItem[] = [
    { icon: Landmark, value: 800, suffix: "+", label: "stats.yearsOfHeritage" },
    { icon: Flower2, value: 250, suffix: "+", label: "stats.dailyPoojas" },
    { icon: Users, value: 10, suffix: "K+", label: "stats.divineBlessings" },
    { icon: CalendarDays, value: 500, suffix: "+", label: "stats.annualFestivals" },
  ]
  ```
- **Severity:** Low
- **Impact:** These figures are hardcoded fallbacks that will be overwritten by the API fetch. They are not harmful but represent "magic numbers" that will rot if not updated.
- **Fix:** Move these to `lib/constants.ts` as named constants (already partially done via `constants.ts`).

### Finding HV-005: Hardcoded default time slots (duplicated across two files)
- **Files:**
  - `components\booking\calendar-selector.tsx` — lines 22-32
  - `components\booking\date-time-picker.tsx` — lines 25-35
- **Code (identical in both files):**
  ```tsx
  const defaultTimeSlots = [
    { id: "6-7", label: "6:00 AM - 7:00 AM", available: true },
    { id: "7-8", label: "7:00 AM - 8:00 AM", available: true },
    { id: "8-9", label: "8:00 AM - 9:00 AM", available: false },
    { id: "9-10", label: "9:00 AM - 10:00 AM", available: true },
    { id: "10-11", label: "10:00 AM - 11:00 AM", available: true },
    { id: "11-12", label: "11:00 AM - 12:00 PM", available: false },
    { id: "4-5", label: "4:00 PM - 5:00 PM", available: true },
    { id: "5-6", label: "5:00 PM - 6:00 PM", available: true },
    { id: "6-7", label: "6:00 PM - 7:00 PM", available: false },
  ]
  ```
- **Severity:** Medium
- **Impact:** This array is duplicated verbatim in two files. Any change to time slots must be made in both places. The duplicate `id: "6-7"` is also intentional but confusing.
- **Fix:** Extract to `lib/constants.ts` as a shared constant (e.g., `DEFAULT_TIME_SLOTS`) and import it in both files.

### Finding HV-006: Hardcoded Razorpay theme color
- **File:** `components\booking\razorpay-button.tsx` — line 90
- **Code:**
  ```tsx
  theme: {
    color: theme?.color || "#6b0f1a",
    ...theme,
  },
  ```
- **Severity:** Low
- **Impact:** The fallback color `#6b0f1a` (a dark maroon) is hardcoded. The temple's brand colors are already defined in `COLORS` in `lib/constants.ts` as `deepMaroon: "#7B1A2C"`. Use that instead.
- **Fix:** `color: theme?.color || COLORS.deepMaroon`

### Finding HV-007: Hardcoded date computation origin point in panchanga
- **File:** `lib\panchanga.ts` — lines 67-69 and 267
- **Code:**
  ```ts
  const LATITUDE = 13.47
  const LONGITUDE = 74.75
  const IST_OFFSET = 5.5 // hours
  // ...
  const noonLocal = 12 + IST_OFFSET + LONGITUDE / 15
  ```
- **Severity:** Low (but correct for Barkur temple)
- **Impact:** These coordinates are hardcoded for the Barkur temple location. They will produce inaccurate results if reused for any other location. The `noonLocal` computation uses `LONGITUDE / 15` for the solar noon offset, which is correct.
- **Fix:** Already appropriately scoped. Consider extracting to a `TEMPLE_LOCATION` config object in `lib/constants.ts` for clarity.

---

## 6. Security Issues

### Finding SEC-001 (CRITICAL): XSS via `dangerouslySetInnerHTML` in RichEditor preview
- **File:** `components\admin\rich-editor.tsx` — line 269
- **Code:**
  ```tsx
  {preview ? (
    <div
      className="prose prose-sm max-w-none p-4 min-h-[200px] text-text-primary"
      style={{ minHeight }}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  ) : (
  ```
- **Severity:** Critical
- **Impact:** The `value` prop is raw HTML from the TipTap editor's `getHTML()` output. When the user clicks the preview button, this HTML is injected directly into the DOM with no sanitization. Any stored XSS payload (e.g., `<img src=x onerror="stealCookies()">` or `<script>` tags) will execute in the admin panel. Since the admin panel likely has elevated privileges, this is a high-risk attack vector.
- **Fix:** Sanitize the HTML before rendering. Use a library like `dompurify` with `dangerouslySetInnerHTML`, or render content in a sandboxed iframe. At minimum, strip `<script>` tags and event handler attributes (`onerror`, `onclick`, etc.).
  ```tsx
  import DOMPurify from "dompurify"
  // ...
  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }}
  ```

### Finding SEC-002 (HIGH): HTML injection in all email template functions
- **File:** `lib\emails.ts` — lines 48-198 (all email template functions)
- **Code (representative example from `sendBookingConfirmation`, line 55-56):**
  ```tsx
  <p>Dear ${user.name},</p>
  // ...
  <td style="padding:8px;border:1px solid #C4A882;">${booking.id}</td>
  ```
- **Severity:** High
- **Impact:** All user-supplied values (`user.name`, `booking.id`, `booking.type`, `booking.date`, `donation.id`, `donation.category`, `donation.date`, `certificate.type`, `otp`, `token`, `JSON.stringify(data)`) are interpolated directly into HTML strings with no escaping or sanitization. A malicious user can inject arbitrary HTML/JavaScript into email content. For example:
  - `user.name = "<img src=x onerror=alert(document.cookie)>"` would execute in the email client.
  - `otp = "<script>alert(1)</script>"` would inject a script tag into the OTP email.
  - `data` in `sendAdminNotification` is `JSON.stringify`'d but could contain HTML-breaking content.
- **Fix:** Escape all user-supplied values before interpolation:
  ```ts
  function escapeHtml(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
  }
  ```
  Then use `escapeHtml(user.name)`, `escapeHtml(booking.id)`, etc. in all template strings.

### Finding SEC-003 (MEDIUM): Non-cryptographic randomness for OTP generation
- **File:** `lib\utils.ts` — line 64
- **Code:**
  ```ts
  export function generateOTP() {
    return String(Math.floor(100000 + Math.random() * 900000))
  }
  ```
- **Severity:** Medium
- **Impact:** `Math.random()` is not cryptographically secure and is predictable. OTPs should use `crypto.getRandomValues()` or Node.js `crypto.randomInt()` to prevent brute-force prediction of the OTP value.
- **Fix:**
  ```ts
  export function generateOTP() {
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    return String((array[0] % 900000) + 100000)
  }
  ```

### Finding SEC-004 (LOW): Silent fallback to empty string for Razorpay key secret in verification
- **File:** `lib\payments.ts` — line 121
- **Code:**
  ```ts
  .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET ?? "")
  ```
- **Severity:** Low
- **Impact:** If `RAZORPAY_KEY_SECRET` is not set, the HMAC is computed with an empty string, producing a valid-but-incorrect signature check that will always fail silently rather than throwing an error. The `verifyPayment` function returns `{ isValid: false }` without indicating an error, which could confuse debugging.
- **Fix:** Add an explicit check before verification and throw or return an error:
  ```ts
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) throw new Error("RAZORPAY_KEY_SECRET not configured")
  ```

---

## 7. Performance Issues

### Finding PERF-001: Infinite CSS animation loop in gallery scroll rows
- **File:** `components\sections\gallery-section.tsx` — lines 10-49 (ScrollRow component)
- **Code:**
  ```tsx
  <motion.div
    className="flex gap-4"
    animate={{
      x: direction === "left" ? [0, -1500] : [-1500, 0],
    }}
    transition={{
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: speed,
        ease: "linear",
      },
    }}
  >
  ```
- **Severity:** Medium
- **Impact:** The `ScrollRow` component runs an infinite CSS animation on every instance. The gallery section renders 3 `ScrollRow` instances simultaneously (line 92-94), meaning 3 independent infinite animations are always running, even when the section is not in the viewport. This consumes GPU resources continuously and can affect page responsiveness, especially on lower-end devices. The `motion.div` elements re-render on every frame, triggering layout recalculations.
- **Fix:** Use `animate={isInView ? { x: ... } : {}}` to only animate when in view (the `isInView` hook is available in the parent `GallerySection` but is not passed to `ScrollRow`). Alternatively, use CSS `@keyframes` animation instead of Framer Motion for the infinite scroll, which is GPU-composited and cheaper.

### Finding PERF-002: Stale date computation in panchanga section
- **File:** `components\sections\panchanga-section.tsx` — line 126
- **Code:**
  ```tsx
  const now = useMemo(() => new Date(), [])
  const vara = VARA_NAMES[now.getDay()]
  const dayNum = now.getDate()
  const monthShort = MONTH_SHORT[now.getMonth()]
  const todayShort = now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  const todayDate = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
  ```
- **Severity:** Medium
- **Impact:** `now` is computed once via `useMemo(() => new Date(), [])` and never updates. If the page is left open past midnight, the panchanga dial will show yesterday's date until a manual page refresh. The `vara`, `dayNum`, `monthShort`, `todayShort`, and `todayDate` values are all derived from this stale `now`.
- **Fix:** Move the date computation outside `useMemo` so it recomputes on every render, or add a minute-based interval to update the date:
  ```tsx
  const now = new Date()  // computed fresh each render
  ```

### Finding PERF-003: Unnecessary re-renders from `useInView` on scroll
- **Files:** Multiple section components (e.g., `panchanga-section.tsx` line 104, `gallery-section.tsx` line 54, `stats-section.tsx` line 62, `events-section.tsx` line 22, `devotee-form.tsx` line 33)
- **Code pattern:**
  ```tsx
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  // Then used in animate prop:
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  ```
- **Severity:** Low
- **Impact:** `useInView` from framer-motion fires a re-render when the element enters the viewport (even with `once: true`). This is expected behavior. However, some sections pair this with `motion.div` elements whose `animate` prop always references `isInView`, causing a re-render when the intersection observer fires. Combined with the other state variables (`loading`, `panchanga`, etc.) in the same components, this can cause cascading re-renders.
- **Fix:** This is a minor concern. Consider using CSS-based animations (e.g., `@media (prefers-reduced-motion)`) or lowering the frequency of `useInView` callbacks if performance is noticeable.

### Finding PERF-004: `setInterval` for animated counter may cause jank
- **File:** `components\sections\stats-section.tsx` — lines 32-41
- **Code:**
  ```tsx
  const timer = setInterval(() => {
    start += step
    if (start >= end) {
      setCount(end)
      clearInterval(timer)
    } else {
      setCount(start)
    }
  }, 16)
  ```
- **Severity:** Low
- **Impact:** A 16ms interval fires approximately 60 times per second, triggering a React state update on each tick. This is the maximum sustainable rate but can cause jank on lower-end devices because each `setCount` triggers a re-render of the entire counter component and potentially its parent. The cleanup `return () => clearInterval(timer)` is correct.
- **Fix:** Consider using `requestAnimationFrame` instead of `setInterval` for smoother animation that syncs with the browser's paint cycle, or reduce the frequency to every 50ms.

---

## Summary

| Category | Severity | Count |
|---|---|---|
| Missing Hook Dependencies | Medium | 1 |
| Memory Leaks | High | 2 |
| TypeScript Errors | Medium | 1 |
| Unused Imports | — | 0 confirmed |
| Hardcoded Values | Low–Medium | 7 |
| Security Issues | Critical–Low | 4 |
| Performance Issues | Medium | 4 |
| **Total** | | **19** |

### Critical / High Priority Items (Action Required)
1. **SEC-001**: XSS in `rich-editor.tsx` preview mode — sanitize HTML before `dangerouslySetInnerHTML`
2. **SEC-002**: HTML injection in all email templates — escape all user input
3. **ML-001 / ML-002**: Uncancelled rAF loops in `lenis-provider.tsx` and `smooth-scroll.tsx` — cancel animation frames on unmount
4. **MHD-001**: Missing hook dependencies in `admin/sidebar.tsx` — add `mobileOpen` and `onMobileClose` to dependency array
5. **SEC-003**: Use `crypto.getRandomValues()` instead of `Math.random()` for OTP generation

### Recommendations
- Run `npx tsc --noEmit` in the project root to catch any TypeScript errors not found in this manual audit
- Add `eslint-plugin-unused-imports` and `eslint-plugin-react-hooks` to the linting pipeline
- Consider adding a CI step that runs `npm audit` for dependency vulnerability scanning
- Implement a centralized sanitization utility in `lib/utils.ts` for all HTML string output
