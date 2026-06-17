import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { X, ArrowLeft, ArrowRight, Move } from "lucide-react";
import { SplitText } from "../lib/SplitText";
import { IMAGES } from "../lib/images";
import { useTheme } from "../lib/theme";

gsap.registerPlugin(Draggable, InertiaPlugin);

const G = IMAGES.gallery;

interface Album {
  index: string;
  title: string;
  year: string;
  role: string;
  desc: string;
  type: string;
  stack: string;
  tags: string;
  photos: string[];
}

const albums: Album[] = [
  { index: "01", title: "Theater Night", year: "2025", role: "Aitakatta · Setlist A",
    desc: "Malam theater di FX Sudirman. Cahaya panggung, senyum, dan energi yang tak terlupakan dari para fans.",
    type: "Theater Show", stack: "JKT48 Theater", tags: "Live · Setlist", photos: [G[0], G[2], G[4]] },
  { index: "02", title: "Golden Hour", year: "2025", role: "Photoshoot",
    desc: "Sesi foto golden hour. Hangat, lembut, dan penuh estetika — salah satu set favorit komunitas.",
    type: "Photoset", stack: "Official Edition", tags: "Portrait · Mood", photos: [G[1], G[3], G[5]] },
  { index: "03", title: "On Stage", year: "2024", role: "Heavy Rotation Special",
    desc: "Penampilan spesial Heavy Rotation. Panggung penuh, lightstick menyala, momen puncak perform.",
    type: "Concert", stack: "Special Show", tags: "Live · Crowd", photos: [G[2], G[6], G[0]] },
  { index: "04", title: "Fan Festival", year: "2024", role: "Meet & Greet",
    desc: "Festival penggemar — handshake, video call, dan tawa. Dekat dengan fans, selalu.",
    type: "Fan Event", stack: "Community", tags: "Fans · Event", photos: [G[3], G[7], G[1]] },
  { index: "05", title: "29 Mei 2026", year: "2026", role: "X Update · Special Post",
    desc: "Update spesial dari Ribka di X pada 29 Mei 2026. Momen candid yang hangat dan penuh senyum dari Ribka untuk para fans.",
    type: "Social Media", stack: "X (Twitter)", tags: "Update · Candid", photos: [G[4], G[0], G[6]] },
  { index: "06", title: "Trainee Days", year: "2023", role: "Trainee Era",
    desc: "Kenangan masa trainee — awal perjalanan Ribka bersama JKT48 sebelum debut resmi di panggung.",
    type: "Backstage", stack: "Behind the scenes", tags: "Trainee · BTS", photos: [G[7], G[5], G[3]] },
];

/* ── DETAIL OVERLAY (screenshot 2) ──────────────────────────────────────── */
function ProjectDetail({ album, onClose }: { album: Album; onClose: () => void }) {
  const [shot, setShot] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const colRef = useRef<HTMLDivElement>(null);
  
  // Touch gesture state for mobile swipe
  const touchStartX = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const tl = gsap.timeline();
    tl.fromTo(rootRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35 })
      .fromTo(heroRef.current,
        { clipPath: "inset(0 0 100% 0)", rotate: -2, scale: 1.05 },
        { clipPath: "inset(0 0 0% 0)", rotate: -3, scale: 1, duration: 0.9, ease: "power4.out" }, "-=0.1")
      .fromTo(colRef.current?.querySelectorAll<HTMLElement>(".d-reveal") ?? [],
        { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.08 }, "-=0.6");
    return () => { tl.kill(); };
  }, [album]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setShot((s) => (s + 1) % album.photos.length);
      if (e.key === "ArrowLeft") setShot((s) => (s - 1 + album.photos.length) % album.photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [album, onClose]);

  useEffect(() => {
    if (prefersReducedMotion() || !heroRef.current) return;
    const img = heroRef.current.querySelector("img");
    if (img) gsap.fromTo(img, { scale: 1.08, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.6, ease: "power3.out" });
  }, [shot]);

  const go = (d: number) => setShot((s) => (s + d + album.photos.length) % album.photos.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (diffX > 50) {
      go(1); // Swipe left -> next image
    } else if (diffX < -50) {
      go(-1); // Swipe right -> prev image
    }
  };

  return (
    <div ref={rootRef} className="fixed inset-0 z-[95] bg-[#0c0c0c] text-white overflow-hidden flex flex-col justify-center">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(226,31,38,0.08)_0%,transparent_70%)] pointer-events-none" />

      <button onClick={onClose} aria-label="Close"
        className="absolute top-5 right-5 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-[#E21F26] flex items-center justify-center transition-colors">
        <X className="w-5 h-5" />
      </button>

      <div className="w-full max-h-full max-w-[1500px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-[minmax(0,42%)_1fr] items-center gap-6 lg:gap-10 overflow-y-auto lg:overflow-visible py-20 lg:py-0">
        <div ref={colRef} className="relative z-10 order-2 lg:order-1">
          <p className="d-reveal text-white/40 text-sm font-semibold tracking-[0.3em] mb-4 lg:mb-6">{album.index} · {album.year}</p>
          <SplitText as="h2" text={album.title.toUpperCase()} by="char" onMount stagger={0.03}
            className="block font-extrabold leading-[0.95]"
            style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", letterSpacing: "-0.02em" }} />
          <p className="d-reveal italic text-white/80 text-lg lg:text-xl mt-3 lg:mt-5" style={{ fontFamily: "Georgia, serif" }}>{album.role}</p>
          <p className="d-reveal text-white/55 mt-4 lg:mt-6 max-w-md leading-relaxed text-sm lg:text-base">{album.desc}</p>
          <p className="d-reveal text-white/40 text-sm font-semibold tracking-widest mt-6 lg:mt-10">
            {String(shot + 1).padStart(2, "0")} / {String(album.photos.length).padStart(2, "0")}
          </p>
          <div className="d-reveal mt-4 pt-4 border-t border-white/10 max-w-md space-y-2 lg:space-y-3">
            {[["TYPE", album.type], ["STACK", album.stack], ["TAGS", album.tags]].map(([k, v]) => (
              <div key={k} className="flex text-sm lg:text-base">
                <span className="w-24 shrink-0 text-white/35 text-xs font-bold tracking-widest pt-0.5">{k}</span>
                <span className="text-white font-bold">{v}</span>
              </div>
            ))}
          </div>
          <div className="d-reveal flex items-center gap-3 mt-6 lg:mt-8">
            <button onClick={() => go(-1)} aria-label="Previous image"
              className="w-11 h-11 rounded-full border border-white/20 hover:bg-[#E21F26] hover:border-[#E21F26] flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button onClick={() => go(1)} aria-label="Next image"
              className="w-11 h-11 rounded-full border border-white/20 hover:bg-[#E21F26] hover:border-[#E21F26] flex items-center justify-center transition-colors">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative h-[30vh] sm:h-[45vh] lg:h-[78vh] [perspective:1600px] order-1 lg:order-2">
          <div ref={heroRef} onClick={() => go(1)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="absolute inset-0 rounded-sm overflow-hidden shadow-2xl shadow-black/60 cursor-pointer"
            style={{ transform: "rotate(-3deg)" }}>
            <img src={album.photos[shot]} alt={album.title} className="w-full h-full object-cover pointer-events-none" />
          </div>
          <button onClick={() => go(1)} aria-label="Next image preview"
            className="absolute -right-16 top-1/2 -translate-y-1/2 w-40 h-[60%] object-cover rounded-sm opacity-60 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer hidden lg:block"
            style={{ transform: "rotate(-3deg)" }}>
            <img src={album.photos[(shot + 1) % album.photos.length]} alt="" className="w-full h-full object-cover rounded-sm" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-xs tracking-widest hidden md:block">
        ESC untuk menutup · ← → ganti foto
      </div>
    </div>
  );
}

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const [nearest, setNearest] = useState(0);
  const { theme } = useTheme();

  const viewportRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const proxyRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<Draggable | null>(null);
  const draggedRef = useRef(false);
  const nearestRef = useRef(0);
  // geometry, recomputed on resize
  const geo = useRef({ cardW: 400, step: 520, loopW: 3120, vw: 1000 });
  const lastOffset = useRef(0);

  const n = albums.length;

  const measure = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const vw = vp.offsetWidth;
    const cardW = gsap.utils.clamp(280, 580, vw * 0.38);
    const gap = Math.max(48, vw * 0.05);
    const step = cardW + gap;
    geo.current = { cardW, step, loopW: step * n, vw };
    cardsRef.current.forEach((el) => {
      if (el) (el as HTMLElement).style.width = `${cardW}px`;
    });
  }, [n]);

  // Position + curve every frame based on the proxy's x (the scroll offset).
  const render = useCallback(() => {
    const vp = viewportRef.current;
    const proxy = proxyRef.current;
    if (!vp || !proxy) return;
    const { cardW, step, loopW, vw } = geo.current;
    const offset = -Number(gsap.getProperty(proxy, "x"));
    const vel = offset - lastOffset.current;
    lastOffset.current = offset;

    let bestAbs = Infinity;
    let near = 0;
    cardsRef.current.forEach((el, i) => {
      if (!el) return;
      // seamless wrap into a window that keeps a card entering from each side
      const raw = i * step - offset;
      const pos = gsap.utils.wrap(-step, loopW - step, raw);
      const cardCenter = pos + cardW / 2;
      const norm = (cardCenter - vw / 2) / (vw / 2); // -1 .. 1 across viewport
      const clamped = gsap.utils.clamp(-1.6, 1.6, norm);

      const rotateY = -clamped * 38;
      const z = -Math.abs(clamped) * 260;
      const yArc = clamped * clamped * 46; // edges dip → curved strip
      const rotateZ = gsap.utils.clamp(-7, 7, -vel * 0.06);

      el.style.transform =
        `translateX(${pos}px) translateY(calc(-50% + ${yArc}px)) translateZ(${z}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
      el.style.zIndex = String(200 - Math.round(Math.abs(clamped) * 100));

      const a = Math.abs(cardCenter - vw / 2);
      if (a < bestAbs) { bestAbs = a; near = i; }
    });

    if (near !== nearestRef.current) {
      nearestRef.current = near;
      setNearest(near);
    }
  }, []);

  useEffect(() => {
    const vp = viewportRef.current;
    const proxy = proxyRef.current;
    if (!vp || !proxy) return;

    measure();
    // start with the first card roughly centred
    gsap.set(proxy, { x: (geo.current.vw - geo.current.cardW) / 2 });

    if (prefersReducedMotion()) {
      render();
      return;
    }

    const tick = () => render();
    gsap.ticker.add(tick);

    const d = Draggable.create(proxy, {
      trigger: vp,
      type: "x",
      inertia: true,
      allowContextMenu: true,
      onPress() { draggedRef.current = false; },
      onDrag() { draggedRef.current = true; },
      onDragEnd() {
        // a tiny throw keeps the strip alive even on a flick
      },
    })[0];
    dragRef.current = d;

    const onResize = () => { measure(); render(); };
    window.addEventListener("resize", onResize);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", onResize);
      d.kill();
    };
  }, [measure, render]);

  // Smoothly bring a card to centre (used by dots + clicking a side card).
  const centerCard = (i: number) => {
    const proxy = proxyRef.current;
    if (!proxy) return;
    const { cardW, step, loopW, vw } = geo.current;
    const cur = -Number(gsap.getProperty(proxy, "x"));
    let target = i * step - (vw - cardW) / 2;
    target = cur + gsap.utils.wrap(-loopW / 2, loopW / 2, target - cur);
    gsap.to(proxy, { x: -target, duration: 1, ease: "power3.inOut" });
  };

  const handleCardClick = (i: number) => {
    if (draggedRef.current) return;
    if (i === nearest) setOpen(i);
    else centerCard(i);
  };

  const handlePrev = () => {
    centerCard((nearestRef.current - 1 + n) % n);
  };

  const handleNext = () => {
    centerCard((nearestRef.current + 1) % n);
  };

  return (
    <section id="gallery" className="relative py-24 bg-[#f4f4f6] dark:bg-[#0d0d0d] transition-colors overflow-hidden">
      {/* Overlay header */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 px-6 md:px-12 pt-10 flex items-start justify-between">
        <div className="font-extrabold tabular-nums text-[#1a1a1a] dark:text-white text-lg">
          {String(nearest + 1).padStart(2, "0")}
          <span className="text-gray-400 dark:text-white/30"> / {String(n).padStart(2, "0")}</span>
        </div>
        <div className="text-center">
          <p className="text-[#E21F26] text-xs font-bold uppercase tracking-[0.3em]">Moments</p>
          <h2 className="text-[#1a1a1a] dark:text-white font-extrabold tracking-tight" style={{ fontSize: "clamp(1.2rem,2vw,1.8rem)" }}>
            Photo Gallery
          </h2>
        </div>
        <div>{/* Spacing container replacing deleted instruction */}</div>
      </div>

      {/* Curved infinite viewport */}
      <div
        ref={viewportRef}
        className="relative h-[45vh] sm:h-[55vh] md:h-[65vh] lg:h-[72vh] w-full cursor-grab active:cursor-grabbing select-none overflow-hidden"
        style={{ perspective: "1300px" }}
      >
        {/* hidden proxy that Draggable actually moves */}
        <div ref={proxyRef} className="absolute w-0 h-0 pointer-events-none" />

        {albums.map((a, i) => (
          <figure
            key={a.index}
            ref={(el) => (cardsRef.current[i] = el)}
            onClick={() => handleCardClick(i)}
            className="group absolute top-1/2 left-0 cursor-pointer will-change-transform [backface-visibility:hidden]"
            style={{ width: 400 }}
          >
            <div
              className="relative aspect-[3/2] transition-[filter] duration-500"
              style={{
                filter: i === nearest
                  ? theme === "dark"
                    ? "drop-shadow(0 20px 20px rgba(0,0,0,0.65)) brightness(1)"
                    : "drop-shadow(0 20px 20px rgba(0,0,0,0.25)) brightness(1)"
                  : theme === "dark"
                    ? "drop-shadow(0 10px 10px rgba(0,0,0,0.45)) brightness(0.7)"
                    : "drop-shadow(0 10px 10px rgba(0,0,0,0.12)) brightness(0.9)"
              }}
            >
              <div className="absolute inset-0 overflow-hidden" style={{ clipPath: "url(#cylinder-curve)" }}>
                <img src={a.photos[0]} alt={a.title} draggable={false}
                  className="w-full h-full object-cover pointer-events-none transition-transform duration-700 ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {i === nearest && (
                  <span className="absolute bottom-3 left-3 bg-white/90 dark:bg-black/70 backdrop-blur-sm text-[#1a1a1a] dark:text-white text-[11px] font-bold px-3 py-1.5 rounded-full">
                    Klik untuk buka
                  </span>
                )}
              </div>
            </div>
            <figcaption className="flex items-baseline justify-between mt-2.5 px-0.5">
              <span className="text-[#1a1a1a] dark:text-white font-bold text-sm">
                <span className="text-[#E21F26] mr-2">{a.index}</span>{a.title}
              </span>
              <span className="text-gray-400 dark:text-white/40 text-xs">{a.year}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Floating Navigation Arrows */}
      <div className="absolute top-1/2 -translate-y-1/2 left-6 z-30 hidden lg:block">
        <button onClick={handlePrev} aria-label="Previous card"
          className="w-12 h-12 rounded-full bg-white/80 dark:bg-black/50 hover:bg-[#E21F26] hover:text-white dark:hover:bg-[#E21F26] text-[#1a1a1a] dark:text-white flex items-center justify-center backdrop-blur-md shadow-lg border border-black/5 dark:border-white/10 transition-all duration-300 hover:scale-105 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-6 z-30 hidden lg:block">
        <button onClick={handleNext} aria-label="Next card"
          className="w-12 h-12 rounded-full bg-white/80 dark:bg-black/50 hover:bg-[#E21F26] hover:text-white dark:hover:bg-[#E21F26] text-[#1a1a1a] dark:text-white flex items-center justify-center backdrop-blur-md shadow-lg border border-black/5 dark:border-white/10 transition-all duration-300 hover:scale-105 cursor-pointer">
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-6 relative z-20">
        {albums.map((a, i) => (
          <button key={a.index} onClick={() => centerCard(i)} aria-label={`Focus ${a.title}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === nearest ? "w-7 bg-[#E21F26]" : "w-2 bg-gray-300 dark:bg-white/20 hover:bg-gray-400"
            }`} />
        ))}
      </div>

      {open !== null && <ProjectDetail album={albums[open]} onClose={() => setOpen(null)} />}

      {/* SVG Clip Path for Cylinder Curve Effect */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="cylinder-curve" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 Q 0.5,0.08 1,0 L 1,1 Q 0.5,0.92 0,1 Z" />
          </clipPath>
        </defs>
      </svg>
    </section>
  );
}
