import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

/**
 * Wires up Lenis smooth scrolling and keeps GSAP's ScrollTrigger in sync.
 * Mount this once near the root of the app. Respects reduced-motion: when the
 * user opts out, native scrolling is left untouched.
 */
export function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    // Expose for in-page anchor scrolling elsewhere in the app.
    (window as any).__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);
}

/** Smoothly scroll to a selector, routing through Lenis when available. */
export function scrollToSection(href: string) {
  const el = document.querySelector(href);
  if (!el) return;
  const lenis = (window as any).__lenis as Lenis | undefined;
  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { offset: -64, duration: 1.2 });
  } else {
    (el as HTMLElement).scrollIntoView({ behavior: "smooth" });
  }
}
