import { Heart, Mail, MapPin } from "lucide-react";
import { scrollToSection } from "../lib/useLenis";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.78a8.18 8.18 0 004.78 1.53V6.85a4.85 4.85 0 01-1.01-.16z" />
  </svg>
);

export function Footer() {
  const scrollTo = (href: string) => scrollToSection(href);

  return (
    <footer id="about" className="bg-[#0f0f0f] text-white">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#E21F26] flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span
              className="font-extrabold text-white tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1.2rem" }}
            >
              Ribka<span className="text-[#E21F26]">JKT48</span>
            </span>
          </div>
          <p
            className="text-white/50 text-sm leading-relaxed max-w-xs"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            The official fan community for Ribka Budiman — member of JKT48 Team Passion.
            Your one-stop destination for schedules, merch, and community updates.
          </p>

          <div className="flex items-center gap-1.5 mt-4 text-white/40 text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <MapPin className="w-3 h-3" />
            Based in Jakarta, Indonesia
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 text-white/40 text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <Mail className="w-3 h-3" />
            fanbase@ribkajkt48.id
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3 mt-6">
            {[
              { icon: <InstagramIcon />, href: "#" },
              { icon: <XIcon />, href: "#" },
              { icon: <TikTokIcon />, href: "#" },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                className="w-9 h-9 rounded-full bg-white/8 hover:bg-[#E21F26] flex items-center justify-center text-white/60 hover:text-white transition-all duration-200 hover:scale-110"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h4
            className="text-white/80 font-bold mb-4 uppercase tracking-widest text-xs"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Navigation
          </h4>
          <ul className="flex flex-col gap-2.5">
            {[
              { label: "Schedule", href: "#schedule" },
              { label: "Merchandise", href: "#merchandise" },
              { label: "Social Hub", href: "#social" },
              { label: "Fan Club", href: "#" },
              { label: "Contact", href: "#" },
            ].map((link) => (
              <li key={link.label}>
                <button
                  onClick={() => scrollTo(link.href)}
                  className="text-white/50 hover:text-white text-sm transition-colors"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Fanbase info */}
        <div>
          <h4
            className="text-white/80 font-bold mb-4 uppercase tracking-widest text-xs"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Fanbase
          </h4>
          <ul className="flex flex-col gap-2.5">
            {[
              "About Ribka",
              "JKT48 Official",
              "Theater Tickets",
              "IDN Live",
              "Showroom",
            ].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-white/50 hover:text-white text-sm transition-colors"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/8" />

      {/* Bottom */}
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
        <p
          className="text-white/30 text-xs"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          © 2024 Ribka JKT48 Official Fanbase. This is an independent fan community, not affiliated with JKT48 Inc.
        </p>
        <div className="flex items-center gap-1.5 text-white/30 text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Made with
          <Heart className="w-3 h-3 text-[#E21F26] fill-[#E21F26]" />
          for the fans
        </div>
      </div>
    </footer>
  );
}
