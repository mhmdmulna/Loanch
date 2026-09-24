import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Initialises Lenis smooth scroll for the whole page.
 *
 * Tuning notes:
 *  - duration: 1.2 s  → perceptibly smooth without feeling sluggish
 *  - easing: exponential ease-out → snappy start, graceful stop
 *  - wheelMultiplier / touchMultiplier match native-feel defaults
 *  - Respects prefers-reduced-motion: when the user has reduced motion
 *    enabled, native scroll is kept (Lenis stops intercepting).
 */
export function useLenis() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReduced) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    })

    let rafId: number

    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])
}
