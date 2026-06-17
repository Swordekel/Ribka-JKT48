import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsap";
import { Menu, X, Heart, ShoppingBag, Sun, Moon } from "lucide-react";
import { useTheme } from "../lib/theme";
import { useMagnetic } from "../lib/hooks";
import { scrollToSection } from "../lib/useLenis";

const navLinks = [
  { label: "About", href: "#about-profile" },
  { label: "Schedule", href: "#schedule" },
  { label: "Merch", href: "#merchandise" },
  { label: "Gallery", href: "#gallery" },
  { label: "Social", href: "#social" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navRef = useRef<HTMLElement>(null);
  const shopRef = useMagnetic<HTMLButtonElement>(0.5);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.3 }
    );
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handler = (e: CustomEvent) => setCartCount(e.detail as number);
    window.addEventListener("cartUpdate" as any, handler);
    return () => window.removeEventListener("cartUpdate" as any, handler);
  }, []);

  const go = (href: string) => {
    setMenuOpen(false);
    scrollToSection(href);
  };

  // Light text only makes sense over the hero (before scroll) in light mode.
  const overHero = !scrolled && theme === "light";
  const linkColor = overHero ? "text-white/90" : "text-[#1a1a1a] dark:text-white/90";

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/90 dark:bg-[#0f0f0f]/90 backdrop-blur-md shadow-sm dark:shadow-black/40"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a onClick={() => go("#hero")} className="cursor-pointer flex items-center gap-1.5">
          <div className="w-7 h-7 rounded-full bg-[#E21F26] flex items-center justify-center">
            <Heart className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <span
            className={`font-extrabold tracking-tight transition-colors duration-300 ${
              overHero ? "text-white" : "text-[#1a1a1a] dark:text-white"
            }`}
            style={{ fontSize: "1.1rem" }}
          >
            Ribka<span className="text-[#E21F26]">JKT48</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => go(link.href)}
              className={`relative text-sm font-semibold tracking-wide transition-colors duration-200 hover:text-[#E21F26] group ${linkColor}`}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E21F26] transition-all duration-300 group-hover:w-full" />
            </button>
          ))}

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              overHero
                ? "text-white/90 hover:bg-white/10"
                : "text-[#1a1a1a] dark:text-white/90 hover:bg-black/5 dark:hover:bg-white/10"
            }`}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            ref={shopRef}
            onClick={() => go("#merchandise")}
            className="relative flex items-center gap-1.5 bg-[#E21F26] text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-[#c41820] transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Shop
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#1a1a1a] dark:bg-white dark:text-[#1a1a1a] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className={`transition-colors ${overHero ? "text-white" : "text-[#1a1a1a] dark:text-white"}`}
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            className={`transition-colors ${overHero ? "text-white" : "text-[#1a1a1a] dark:text-white"}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-[#0f0f0f] border-t border-gray-100 dark:border-white/10 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => go(link.href)}
              className="text-left text-[#1a1a1a] dark:text-white font-semibold text-base hover:text-[#E21F26] transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
