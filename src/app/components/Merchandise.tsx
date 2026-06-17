import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import confetti from "canvas-confetti";
import { ShoppingCart, Heart, Star, Zap, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { useMagnetic } from "../lib/hooks";
import { BRAND } from "../lib/images";

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  originalPrice?: string;
  image: string;
  badge?: string;
  badgeColor?: string;
  stock: number;
  rating: number;
  reviews: number;
  description: string;
}

const products: Product[] = [
  {
    id: "p1",
    name: "JKT48 Request Hour 2026 Official T-Shirt",
    category: "Pakaian",
    price: "Rp 165.000",
    image: "/merch/(Pre-Order) JKT48 Request Hour 2026 Setlist Best 40 Official T-Shirt - S.jpeg",
    badge: "PRE-ORDER",
    badgeColor: "#E21F26",
    stock: 20,
    rating: 4.9,
    reviews: 87,
    description: "Kaos resmi edisi khusus JKT48 Request Hour 2026 Setlist Best 40. Bahan katun premium, nyaman dipakai seharian.",
  },
  {
    id: "p2",
    name: "JKT48 #KuSangatSuka Lanyard",
    category: "Aksesoris",
    price: "Rp 55.000",
    image: "/merch/JKT48 KuSangatSuka Lanyard - Biru.jpeg",
    badge: "OFFICIAL",
    badgeColor: "#2563eb",
    stock: 30,
    rating: 4.8,
    reviews: 142,
    description: "Lanyard resmi JKT48 edisi #KuSangatSuka warna biru. Cocok untuk ID card, kartu fan, atau aksesoris daily.",
  },
  {
    id: "p3",
    name: "JKT48 Photocard Holder — Aturan Anti Cinta",
    category: "Koleksi",
    price: "Rp 75.000",
    image: "/merch/JKT48 Photocard Holder Collection - Aturan Anti Cinta.jpeg",
    badge: "LIMITED",
    badgeColor: "#7c3aed",
    stock: 18,
    rating: 4.9,
    reviews: 213,
    description: "Photocard holder koleksi resmi edisi Aturan Anti Cinta. Muat banyak photocard, desain eksklusif JKT48.",
  },
  {
    id: "p4",
    name: "JKT48 Sambil Menggandeng Erat Tanganku Lanyard",
    category: "Aksesoris",
    price: "Rp 55.000",
    image: "/merch/JKT48 Sambil Menggandeng Erat Tanganku Lanyard - Blue.jpeg",
    badge: "OFFICIAL",
    badgeColor: "#0891b2",
    stock: 25,
    rating: 4.7,
    reviews: 178,
    description: "Lanyard resmi JKT48 edisi 'Sambil Menggandeng Erat Tanganku' warna biru. Aksesoris wajib untuk OFC member.",
  },
];

function fireConfetti(originX: number, originY: number) {
  if (prefersReducedMotion()) return;
  confetti({
    particleCount: 80,
    spread: 70,
    startVelocity: 35,
    scalar: 0.9,
    origin: { x: originX, y: originY },
    colors: [BRAND.red, "#ff7a5f", "#ffffff", BRAND.ink],
    zIndex: 75,
  });
}

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (id: string) => void }) {
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleAdd = () => {
    setAdded(true);
    onAddToCart(product.id);
    setTimeout(() => setAdded(false), 1800);

    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      fireConfetti(
        (rect.left + rect.width / 2) / window.innerWidth,
        (rect.top + rect.height / 2) / window.innerHeight
      );
      gsap.fromTo(btnRef.current, { scale: 1 }, { scale: 0.9, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.out" });
    }
  };

  return (
    <div className="group relative bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 hover:border-[#E21F26]/40 transition-colors duration-300">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge */}
        {product.badge && (
          <span
            className="absolute top-3 left-3 text-white text-xs font-extrabold px-2.5 py-1 rounded-full tracking-wider"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              backgroundColor: product.badgeColor,
            }}
          >
            {product.badge}
          </span>
        )}

        {/* Stock indicator */}
        {product.stock <= 10 && (
          <div className="absolute top-3 right-12 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            Only {product.stock} left
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${liked ? "text-[#E21F26] fill-[#E21F26]" : "text-gray-400"}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span
            className="text-xs text-[#E21F26] font-semibold uppercase tracking-wide"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {product.category}
          </span>
        </div>

        <h3
          className="text-[#1a1a1a] dark:text-white font-extrabold mb-1.5 leading-snug text-base sm:text-[1.1rem]"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          {product.name}
        </h3>

        <p className="text-gray-500 dark:text-white/50 text-xs sm:text-[13px] mb-4 leading-relaxed">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-200 fill-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs sm:text-sm text-gray-400 font-medium" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span
              className="font-extrabold text-[#1a1a1a] dark:text-white text-base sm:text-[1.2rem]"
            >
              {product.price}
            </span>
            {product.originalPrice && (
              <span className="text-gray-400 dark:text-white/40 text-xs sm:text-sm line-through ml-1.5">
                {product.originalPrice}
              </span>
            )}
          </div>
          <button
            ref={btnRef}
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold transition-colors duration-200 ${
              added
                ? "bg-green-500 text-white"
                : "bg-[#E21F26] text-white hover:bg-[#c41820]"
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {added ? "Added!" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 3D coverflow carousel. The active card faces the viewer head-on; neighbours
 * fan back in perspective and dim, with arrow + dot navigation. GSAP animates
 * the transforms; reduced-motion users get instant repositioning.
 */
function Coverflow({
  products,
  onAddToCart,
}: {
  products: Product[];
  onAddToCart: (id: string) => void;
}) {
  const [active, setActive] = useState(Math.floor(products.length / 2));
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const firstRun = useRef(true);

  // Drag / swipe states
  const startX = useRef(0);
  const dragDistance = useRef(0);
  const isDragging = useRef(false);

  const layout = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const spacing = Math.min(310, Math.max(130, stage.offsetWidth * 0.3));
    const instant = firstRun.current || prefersReducedMotion();

    const n = products.length;
    cardsRef.current.forEach((el, i) => {
      if (!el) return;
      // Shortest circular distance so cards wrap and always flank both sides.
      let pos = i - active;
      if (pos > n / 2) pos -= n;
      if (pos < -n / 2) pos += n;
      const abs = Math.abs(pos);
      const visible = abs <= Math.floor(n / 2);
      gsap.to(el, {
        xPercent: -50,
        yPercent: -50,
        x: pos * spacing,
        rotationY: -Math.sign(pos) * 42,
        z: -abs * 160,
        scale: 1 - Math.min(abs, 2) * 0.13,
        opacity: visible ? 1 - abs * 0.3 : 0,
        zIndex: 100 - abs,
        duration: instant ? 0 : 0.6,
        ease: "power3.out",
        overwrite: "auto",
      });
      el.style.pointerEvents = visible ? "auto" : "none";
    });
    firstRun.current = false;
  }, [active]);

  useLayoutEffect(() => {
    layout();
  }, [layout]);

  useEffect(() => {
    const onResize = () => {
      firstRun.current = true; // snap on resize, no slide
      layout();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [layout]);

  const go = (dir: number) =>
    setActive((a) => (a + dir + products.length) % products.length);

  const handleStart = (clientX: number) => {
    startX.current = clientX;
    dragDistance.current = 0;
    isDragging.current = true;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging.current) return;
    const currentDistance = clientX - startX.current;
    dragDistance.current = currentDistance;
  };

  const handleEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    // Threshold to switch card
    if (Math.abs(dragDistance.current) > 50) {
      if (dragDistance.current > 0) {
        go(-1);
      } else {
        go(1);
      }
    }
  };

  return (
    <div className="relative">
      <div
        ref={stageRef}
        className="relative h-[480px] sm:h-[590px] w-full cursor-grab active:cursor-grabbing select-none"
        style={{ perspective: "1500px" }}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        {products.map((product, i) => {
          const isActive = i === active;
          return (
            <div
              key={product.id}
              ref={(el) => (cardsRef.current[i] = el)}
              onClick={(e) => {
                // Prevent card activation / page interaction if card was dragged
                if (Math.abs(dragDistance.current) > 10) {
                  e.preventDefault();
                  return;
                }
                if (!isActive) setActive(i);
              }}
              className={`absolute left-1/2 top-1/2 w-[250px] min-[375px]:w-[295px] sm:w-[365px] ${isActive ? "cursor-default" : "cursor-pointer"}`}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className={`rounded-2xl transition-[filter,box-shadow] duration-500 ${
                  isActive
                    ? "shadow-2xl shadow-black/30 dark:shadow-black/60"
                    : "brightness-[0.78] dark:brightness-[0.55] saturate-[0.9]"
                }`}
              >
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Arrows */}
      <button
        onClick={() => go(-1)}
        aria-label="Previous product"
        className="absolute left-1 sm:left-6 top-1/2 -translate-y-1/2 z-[110] w-11 h-11 rounded-full bg-white dark:bg-white/10 shadow-lg shadow-black/10 flex items-center justify-center text-[#1a1a1a] dark:text-white hover:bg-[#E21F26] hover:text-white transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Next product"
        className="absolute right-1 sm:right-6 top-1/2 -translate-y-1/2 z-[110] w-11 h-11 rounded-full bg-white dark:bg-white/10 shadow-lg shadow-black/10 flex items-center justify-center text-[#1a1a1a] dark:text-white hover:bg-[#E21F26] hover:text-white transition-colors cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-2">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Go to product ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === active ? "w-7 bg-[#E21F26]" : "w-2 bg-gray-300 dark:bg-white/20 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function Merchandise() {
  const [cartCount, setCartCount] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const joinRef = useMagnetic<HTMLButtonElement>(0.5);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    gsap.fromTo(
      headerRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      }
    );
  }, []);

  const handleAddToCart = (id: string) => {
    const next = cartCount + 1;
    setCartCount(next);
    window.dispatchEvent(new CustomEvent("cartUpdate", { detail: next }));
  };

  return (
    <section id="merchandise" ref={sectionRef} className="py-24 bg-white dark:bg-[#0f0f0f] transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-0.5 bg-[#E21F26]" />
              <span className="text-[#E21F26] text-xs font-bold uppercase tracking-widest">
                Official Store
              </span>
            </div>
            <h2
              className="text-[#1a1a1a] dark:text-white leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800 }}
            >
              Fan Merchandise
            </h2>
            <p
              className="text-gray-500 dark:text-white/50 mt-3 max-w-lg"
              style={{ fontSize: "0.95rem" }}
            >
              Exclusive apparel and collectibles made for the true fans. Limited editions — get yours before they're gone.
            </p>
          </div>

        </div>

        {/* Product carousel (3D coverflow) */}
        <Coverflow products={products} onAddToCart={handleAddToCart} />

        {/* CTA Banner */}
        <div className="mt-12 rounded-2xl bg-[#1a1a1a] p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#E21F26]/10" />
          <div className="absolute right-24 -bottom-8 w-32 h-32 rounded-full bg-[#E21F26]/5" />
          <div className="relative z-10">
            <p
              className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Fan Club Exclusive
            </p>
            <h3
              className="text-white font-extrabold"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.6rem" }}
            >
              Join the Official Fanbase
            </h3>
            <p className="text-white/50 mt-1 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Get early access to limited drops, member pricing, and exclusive content.
            </p>
          </div>
          <button
            ref={joinRef}
            className="relative z-10 flex-shrink-0 bg-[#E21F26] hover:bg-[#c41820] text-white font-bold px-8 py-3.5 rounded-full transition-colors"
          >
            Join Now — Free
          </button>
        </div>
      </div>
    </section>
  );
}
