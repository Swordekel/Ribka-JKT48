import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap";
import { Heart } from "lucide-react";

const WORDS = [
  "RIBKA BUDIMAN",
  "JKT48 TEAM PASSION",
  "OFFICIAL FANBASE",
  "AITAKATTA",
  "DAISUKI",
];

/**
 * Infinite scrolling marquee. Base motion runs continuously; scroll velocity
 * nudges its speed/direction for an extra-dynamic feel.
 */
export function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        xPercent: -50,
        repeat: -1,
        duration: 22,
        ease: "none",
      });

      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      if (isDesktop) {
        let direction = 1;
        const st = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const v = self.getVelocity();
            if (v !== 0) direction = v < 0 ? -1 : 1;
            const boost = gsap.utils.clamp(1, 4, 1 + Math.abs(v) / 600);
            gsap.to(tween, { timeScale: boost * direction, duration: 0.3, overwrite: true });
          },
        });

        return () => st.kill();
      }
    }, track);

    return () => ctx.revert();
  }, []);

  const items = [...WORDS, ...WORDS];

  return (
    <div className="relative overflow-hidden bg-[#E21F26] py-4 select-none">
      <div ref={trackRef} className="flex w-max whitespace-nowrap will-change-transform">
        {items.map((word, i) => (
          <div key={i} className="flex items-center">
            <span className="text-white font-extrabold tracking-tight px-6 text-xl md:text-2xl">
              {word}
            </span>
            <Heart className="w-4 h-4 text-white/70 fill-white/70 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
