"use client"

import { useEffect, useRef, type ReactNode } from "react"
import Lenis from "lenis"

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const rafIdRef = useRef<number>(0)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      rafIdRef.current = requestAnimationFrame(raf)
    }

    rafIdRef.current = requestAnimationFrame(raf)

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
