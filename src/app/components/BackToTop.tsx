import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { ArrowUp } from "lucide-react";
import { scrollToSection } from "../lib/useLenis";

/** Floating button that fades in after scrolling down a screen. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      opacity: visible ? 1 : 0,
      scale: visible ? 1 : 0.6,
      duration: 0.4,
      ease: "power3.out",
      pointerEvents: visible ? "auto" : "none",
    });
  }, [visible]);

  return (
    <button
      ref={ref}
      onClick={() => scrollToSection("#hero")}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-[70] w-12 h-12 rounded-full bg-[#E21F26] text-white shadow-lg shadow-[#E21F26]/40 flex items-center justify-center opacity-0 hover:bg-[#c41820] hover:scale-110 transition-colors"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
