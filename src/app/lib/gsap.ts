import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugins once, centrally, so individual components don't have to.
gsap.registerPlugin(ScrollTrigger);

// Some animations target nodes that mount/unmount transiently (the preloader
// curtain, the lightbox image, timelines that re-run when `start` flips). When
// the target isn't present the tween is a harmless no-op — silence GSAP's
// dev-only "target not found" warning so the console stays clean.
gsap.config({ nullTargetWarn: false });

export { gsap, ScrollTrigger };

/** True when the user has asked the OS to minimize motion. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
