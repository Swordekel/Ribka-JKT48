import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { ChevronDown, Star, Users } from "lucide-react";
import { SplitText } from "../lib/SplitText";
import { useMagnetic } from "../lib/hooks";
import { scrollToSection } from "../lib/useLenis";
import { IMAGES } from "../lib/images";

function Counter({
  end,
  suffix = "",
  startTrigger = false,
  duration = 2,
  delay = 1.5,
}: {
  end: number;
  suffix?: string;
  startTrigger?: boolean;
  duration?: number;
  delay?: number;
}) {
  const [count, setCount] = useState(0);
  const countRef = useRef({ val: 0 });

  useEffect(() => {
    if (!startTrigger) return;

    countRef.current.val = 0;
    setCount(0);

    const target = countRef.current;
    const tl = gsap.to(target, {
      val: end,
      duration: duration,
      delay: delay,
      ease: "power2.out",
      onUpdate: () => {
        setCount(Math.floor(target.val));
      },
    });

    return () => {
      tl.kill();
    };
  }, [startTrigger, end, duration, delay]);

  return <span>{count}{suffix}</span>;
}

export function Hero({ start = true }: { start?: boolean }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cta1 = useMagnetic<HTMLButtonElement>(0.4);
  const cta2 = useMagnetic<HTMLButtonElement>(0.4);
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== "undefined" ? window.innerWidth < 768 : false;
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Ensure the video is properly muted and starts playing when the preloader finishes (fixing Edge & Safari compatibility issues)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    if (start) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Video autoplay failed or was blocked: ", error);
        });
      }
    }
  }, [start]);

  // Intro timeline — held until the preloader signals `start`.
  useEffect(() => {
    if (!start || prefersReducedMotion()) return;

    const tl = gsap.timeline();
    tl.fromTo(bgRef.current, { scale: 1.15 }, { scale: 1, duration: 2.4, ease: "power2.out" })
      .fromTo(".hero-badge", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=1.9")
      .fromTo(".hero-subtitle", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.4")
      .fromTo(".hero-cta", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.1 }, "-=0.5")
      .fromTo(".hero-stat", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.1 }, "-=0.4")
      .fromTo(portraitRef.current, { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: 1.1, ease: "power3.out" }, "-=1.4");
    return () => { tl.kill(); };
  }, [start]);

  // Scroll parallax + cursor parallax.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (!isDesktop) return;

    const onScroll = () => {
      const y = window.scrollY;
      if (bgRef.current) gsap.set(bgRef.current, { y: y * 0.4 });
      if (portraitRef.current) gsap.set(portraitRef.current, { y: y * 0.12 });
    };

    const xTo = portraitRef.current && gsap.quickTo(portraitRef.current, "x", { duration: 0.8, ease: "power3.out" });
    const yTo = portraitRef.current && gsap.quickTo(portraitRef.current, "rotationY", { duration: 0.8, ease: "power3.out" });
    const onMove = (e: MouseEvent) => {
      const cx = (e.clientX / window.innerWidth - 0.5) * 2;
      if (xTo) xTo(cx * 18);
      if (yTo) yTo(cx * 6);
      if (glowRef.current) {
        gsap.to(glowRef.current, { x: cx * 40, duration: 1, ease: "power3.out" });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  // Floating particles.
  useEffect(() => {
    if (prefersReducedMotion() || !heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".hero-particle").forEach((p) => {
        gsap.to(p, {
          y: gsap.utils.random(-40, 40),
          x: gsap.utils.random(-30, 30),
          duration: gsap.utils.random(3, 6),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const hideInitial = prefersReducedMotion() ? "" : "opacity-0";

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full min-h-screen overflow-hidden flex items-center"
    >
      {/* Background */}
      <div ref={bgRef} className="absolute inset-0 z-0">
        {isMobile ? (
          <img
            src={IMAGES.heroBackground}
            alt="Concert stage"
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            defaultMuted
            playsInline
            poster={IMAGES.heroBackground}
            className="w-full h-full object-cover object-center"
          >
            <source src="/video/videoBG.mp4" type="video/mp4" />
            <img src={IMAGES.heroBackground} alt="Concert stage" className="w-full h-full object-cover object-center" />
          </video>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Animated glow */}
      <div
        ref={glowRef}
        className="absolute top-1/3 left-1/4 w-[40rem] h-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E21F26]/25 blur-[120px] z-0 pointer-events-none"
      />

      {/* Particles */}
      {[...Array(8)].map((_, i) => (
        <span
          key={i}
          className="hero-particle absolute rounded-full bg-white/40 z-[1] pointer-events-none"
          style={{
            width: `${4 + (i % 3) * 3}px`,
            height: `${4 + (i % 3) * 3}px`,
            top: `${10 + i * 10}%`,
            left: `${(i * 13) % 90}%`,
            filter: "blur(0.5px)",
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Text */}
        <div className="flex flex-col gap-6">
          <div className={`hero-badge inline-flex items-center gap-2 bg-[#E21F26]/20 border border-[#E21F26]/40 backdrop-blur-sm rounded-full px-4 py-1.5 w-fit ${hideInitial}`}>
            <span className="w-2 h-2 rounded-full bg-[#E21F26] animate-pulse" />
            <span className="text-white/90 text-xs font-semibold tracking-widest uppercase">
              Official Fanbase · Est. 2024
            </span>
          </div>

          <h1
            className="text-white leading-none"
            style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.05 }}
          >
            <SplitText text="Ribka" by="char" trigger={start} delay={0.5} className="block" />
            <SplitText
              text="JKT48"
              by="char"
              trigger={start}
              delay={0.8}
              className="block"
              unitClassName="text-[#E21F26]"
            />
          </h1>

          <p className={`hero-subtitle text-white/70 max-w-md ${hideInitial}`} style={{ fontSize: "1.05rem", lineHeight: 1.7 }}>
            Your official hub for schedules, exclusive merchandise, and the latest
            updates from Ribka — member of JKT48, Indonesia's iconic idol group.
          </p>

          <div className="flex flex-wrap gap-3 mt-2">
            <button
              ref={cta1}
              onClick={() => scrollToSection("#schedule")}
              className={`hero-cta bg-[#E21F26] hover:bg-[#c41820] text-white px-7 py-3 rounded-full font-bold text-sm tracking-wide transition-colors ${hideInitial}`}
            >
              View Schedule
            </button>
            <button
              ref={cta2}
              onClick={() => scrollToSection("#merchandise")}
              className={`hero-cta bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 px-7 py-3 rounded-full font-bold text-sm tracking-wide transition-colors ${hideInitial}`}
            >
              Shop Merch
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-4 pt-4 border-t border-white/15">
            {[
              { end: 12, suffix: "K+", label: "Fans" },
              { end: 200, suffix: "+", label: "Shows" },
              { end: 50, suffix: "+", label: "Merch Items" },
            ].map((s) => (
              <div key={s.label} className={`hero-stat flex flex-col ${hideInitial}`}>
                <span className="text-white font-extrabold" style={{ fontSize: "1.6rem" }}>
                  <Counter end={s.end} suffix={s.suffix} startTrigger={start} />
                </span>
                <span className="text-white/50 text-xs font-medium uppercase tracking-wider">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Portrait card */}
        <div ref={portraitRef} className={`hidden md:flex flex-col items-end ${hideInitial}`} style={{ transformStyle: "preserve-3d" }}>
          <div className="relative">
            <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full border-2 border-[#E21F26]/30 z-0 animate-float" />
            <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-[#E21F26]/10 z-0" />

            <div className="relative z-10 w-72 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
              <img src={IMAGES.heroPortrait} alt="Ribka JKT48" className="w-full h-96 object-cover object-top" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-5">
                <div className="flex items-center gap-1.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-[#E21F26] fill-[#E21F26]" />
                  ))}
                </div>
                <p className="text-white font-bold" style={{ fontSize: "1.1rem" }}>
                  Ribka Budiman
                </p>
                <p className="text-white/60 text-xs mt-0.5">JKT48 Team Passion</p>
              </div>
            </div>

            <div className="absolute -right-6 top-12 bg-[#E21F26] text-white rounded-xl px-3 py-2 shadow-lg shadow-[#E21F26]/30 z-20 animate-float">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">Fan Event</span>
              </div>
              <p className="text-xs text-white/80 mt-0.5">Jun 28 — VCS Open</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollToSection("#about-profile")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </button>
    </section>
  );
}
