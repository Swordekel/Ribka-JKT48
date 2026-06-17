import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

/**
 * Magnetic hover effect — the element subtly follows the cursor while hovered,
 * then springs back on leave. Great for primary buttons / interactive chips.
 */
export function useMagnetic<T extends HTMLElement = HTMLButtonElement>(
  strength = 0.4
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!el || prefersReducedMotion() || !hasFinePointer) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      xTo(relX * strength);
      yTo(relY * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return ref;
}

/**
 * 3D tilt effect driven by cursor position over the element.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(max = 10) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!el || prefersReducedMotion() || !hasFinePointer) return;

    const rotX = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power2.out" });
    const rotY = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power2.out" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      rotY(px * max * 2);
      rotX(-py * max * 2);
    };
    const onEnter = () => gsap.to(el, { scale: 1.02, duration: 0.4, ease: "power2.out" });
    const onLeave = () => {
      rotX(0);
      rotY(0);
      gsap.to(el, { scale: 1, duration: 0.5, ease: "power2.out" });
    };

    gsap.set(el, { transformPerspective: 800, transformStyle: "preserve-3d" });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [max]);

  return ref;
}

interface RevealOptions {
  y?: number;
  x?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  selector?: string;
  delay?: number;
  scale?: number;
}

/**
 * Generic scroll-triggered reveal. Pass `selector` to stagger children,
 * otherwise the container itself animates in. Reduced-motion safe (elements
 * are left fully visible).
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  opts: RevealOptions = {}
) {
  const ref = useRef<T>(null);
  const {
    y = 40,
    x = 0,
    duration = 0.9,
    stagger = 0.1,
    start = "top 82%",
    selector,
    delay = 0,
    scale,
  } = opts;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const targets = selector ? el.querySelectorAll(selector) : el;
    const from: gsap.TweenVars = { y, x, opacity: 0 };
    if (scale != null) from.scale = scale;

    const ctx = gsap.context(() => {
      gsap.fromTo(targets, from, {
        y: 0,
        x: 0,
        opacity: 1,
        scale: 1,
        duration,
        delay,
        ease: "power3.out",
        stagger,
        scrollTrigger: { trigger: el, start },
      });
    }, el);

    return () => ctx.revert();
  }, [y, x, duration, stagger, start, selector, delay, scale]);

  return ref;
}

export { ScrollTrigger };
