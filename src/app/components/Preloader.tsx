import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { Heart } from "lucide-react";

/**
 * Full-screen intro overlay. Animates a counter + brand mark, then curtains
 * away to reveal the page. Calls onComplete so the hero can kick off in sync.
 */
export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      onComplete();
      setDone(true);
      return;
    }

    document.body.style.overflow = "hidden";
    const count = { v: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        setDone(true);
        onComplete();
      },
    });

    tl.fromTo(
      markRef.current,
      { scale: 0.6, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)" }
    )
      .to(
        count,
        {
          v: 100,
          duration: 1.4,
          ease: "power2.inOut",
          onUpdate: () => {
            if (counterRef.current)
              counterRef.current.textContent = String(Math.round(count.v));
          },
        },
        "-=0.2"
      )
      .to(markRef.current, { scale: 0.9, opacity: 0, duration: 0.4, ease: "power2.in" })
      .to(
        rootRef.current,
        { yPercent: -100, duration: 0.9, ease: "power4.inOut" },
        "-=0.1"
      );

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f0f0f]"
    >
      <div ref={markRef} className="flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-[#E21F26] flex items-center justify-center shadow-lg shadow-[#E21F26]/40">
          <Heart className="w-8 h-8 text-white fill-white" />
        </div>
        <div className="flex items-baseline gap-1 text-white">
          <span className="text-4xl font-extrabold tracking-tight">
            Ribka<span className="text-[#E21F26]">JKT48</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-white/40 text-sm font-semibold tracking-widest uppercase">
          Loading <span ref={counterRef}>0</span>%
        </div>
      </div>
    </div>
  );
}
