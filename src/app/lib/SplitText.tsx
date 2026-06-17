import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "./gsap";

interface SplitTextProps {
  text: string;
  /** Split granularity. */
  by?: "char" | "word";
  className?: string;
  /** Tailwind/utility classes applied to each split unit. */
  unitClassName?: string;
  /** Trigger on mount instead of on scroll. */
  onMount?: boolean;
  /** Delay start of animation until trigger turns true. */
  trigger?: boolean;
  delay?: number;
  stagger?: number;
  duration?: number;
  start?: string;
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
}

/**
 * Lightweight, dependency-free replacement for GSAP's club SplitText plugin.
 * Splits a string into per-character (or per-word) spans and reveals them with
 * a staggered, slightly-rotated rise. Falls back to plain visible text when the
 * user prefers reduced motion.
 */
export function SplitText({
  text,
  by = "char",
  className = "",
  unitClassName = "",
  onMount = false,
  trigger,
  delay = 0,
  stagger = 0.025,
  duration = 0.8,
  start = "top 85%",
  as = "span",
  style,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as any;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    // Do not run animation if trigger is explicitly provided and is false
    if (trigger === false) return;

    const units = el.querySelectorAll<HTMLElement>(".split-unit");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        units,
        { yPercent: 115, opacity: 0, rotate: 6 },
        {
          yPercent: 0,
          opacity: 1,
          rotate: 0,
          duration,
          delay,
          ease: "power4.out",
          stagger,
          scrollTrigger: (trigger !== undefined || onMount) ? undefined : { trigger: el, start },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [text, onMount, trigger, delay, stagger, duration, start]);

  const tokens =
    by === "char" ? Array.from(text) : text.split(/(\s+)/);

  return (
    <Tag ref={ref} className={className} style={style} aria-label={text}>
      {tokens.map((token, i) => {
        if (token === " " || /^\s+$/.test(token)) {
          return <span key={i}>{token === " " ? " " : token}</span>;
        }
        return (
          <span
            key={i}
            aria-hidden="true"
            className="inline-block overflow-hidden align-bottom"
          >
            <span className={`split-unit inline-block ${unitClassName} ${!prefersReducedMotion() ? "opacity-0" : ""}`}>
              {token}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}
