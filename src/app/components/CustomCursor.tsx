import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";

/**
 * Soft trailing ring that follows the native cursor on pointer devices. The
 * native cursor is intentionally left visible — the ring is a decorative accent
 * that lags behind it and grows over interactive elements. Disabled on touch /
 * reduced-motion, where it adds nothing.
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer || prefersReducedMotion()) return;

    const ring = ringRef.current!;
    gsap.set(ring, { xPercent: -50, yPercent: -50, opacity: 0 });

    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    let shown = false;
    const onMove = (e: MouseEvent) => {
      if (!shown) {
        gsap.to(ring, { opacity: 1, duration: 0.3 });
        shown = true;
      }
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const interactive = t.closest("a, button, [role='button'], input, .cursor-pointer");
      gsap.to(ring, {
        scale: interactive ? 1.8 : 1,
        borderColor: interactive ? "#E21F26" : "rgba(226,31,38,0.5)",
        duration: 0.3,
      });
    };

    const onLeave = () => gsap.to(ring, { opacity: 0, duration: 0.2 });

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      className="hidden md:block fixed top-0 left-0 z-[90] w-8 h-8 rounded-full border-2 pointer-events-none mix-blend-difference"
      style={{ borderColor: "rgba(226,31,38,0.5)" }}
    />
  );
}
