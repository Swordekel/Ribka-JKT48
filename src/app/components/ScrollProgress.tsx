import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";

/** Thin gradient bar pinned to the top that tracks page scroll progress. */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;

    gsap.set(el, { scaleX: 0, transformOrigin: "left center" });
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => gsap.set(el, { scaleX: self.progress }),
    });
    return () => st.kill();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent pointer-events-none">
      <div
        ref={barRef}
        className="h-full w-full bg-gradient-to-r from-[#E21F26] via-[#ff5a5f] to-[#E21F26]"
      />
    </div>
  );
}
