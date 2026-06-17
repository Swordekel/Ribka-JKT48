import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { Heart, MessageCircle, Share2, Play, ExternalLink } from "lucide-react";
import { useTheme } from "../lib/theme";

// --- Mock Social Data ---

interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  likes: string;
  comments: string;
  type: "photo" | "video" | "reel";
  time: string;
}

interface Tweet {
  id: string;
  content: string;
  likes: string;
  retweets: string;
  time: string;
  hasMedia?: boolean;
}

interface TikTokPost {
  id: string;
  thumbnail: string;
  caption: string;
  views: string;
  likes: string;
  time: string;
}

const instagramPosts: InstagramPost[] = [
  {
    id: "ig1",
    image: "/Gallery/Ribka JKT48.jpg",
    caption: "Theater ready ✨ Aitakatta setlist tonight! See you at the show 🌸",
    likes: "4.2K",
    comments: "312",
    type: "photo",
    time: "2h ago",
  },
  {
    id: "ig2",
    image: "/Gallery/Ribka 29 Mei 2026 X Update.jpg",
    caption: "Golden hour feels 🌅 Thank you for all the love from yesterday's show!",
    likes: "6.8K",
    comments: "520",
    type: "photo",
    time: "1d ago",
  },
  {
    id: "ig3",
    image: "/Gallery/1054264594035347642.jpg",
    caption: "The energy was INSANE last night 🔥 Heavy Rotation Special was everything 💖",
    likes: "9.1K",
    comments: "780",
    type: "reel",
    time: "3d ago",
  },
  {
    id: "ig4",
    image: "/Gallery/899453356847193418.jpg",
    caption: "Look at all of you 🥺💗 This view from the stage is everything to me. Daisuki!",
    likes: "11.3K",
    comments: "1.1K",
    type: "photo",
    time: "5d ago",
  },
];

const tweets: Tweet[] = [
  {
    id: "tw1",
    content:
      "Theater malam ini bakal spesial banget 🎭✨ Udah latihan seharian, semoga kalian seneng ya! Dateng yaa~ 💕 #JKT48 #RibkaJKT48",
    likes: "2.4K",
    retweets: "567",
    time: "1h ago",
  },
  {
    id: "tw2",
    content:
      "Video Call Session nanti malem jam 7! Masih ada slot yaa, buruan sebelum habis 😭 Kangen banget mau ketemu kalian ❤️ Link di bio!",
    likes: "3.1K",
    retweets: "890",
    time: "5h ago",
    hasMedia: true,
  },
  {
    id: "tw3",
    content:
      "Thank you for 50K followers on Instagram!! 🎉🎉 Gatau harus bilang apa selain makasih dan sayang banget sama kalian semua 😭💗 #TerimakasihFans",
    likes: "8.7K",
    retweets: "2.1K",
    time: "2d ago",
  },
  {
    id: "tw4",
    content:
      "Baru selesai latihan choreo baru 🕺💃 Semangat terus buat persiapan anniversary! Kalian siap? Aku udah deg-degan dari sekarang 😆 #JKT48Anniversary",
    likes: "1.8K",
    retweets: "420",
    time: "3d ago",
  },
];

const tiktokPosts: TikTokPost[] = [
  {
    id: "tt1",
    thumbnail: "/Gallery/871587334146197481.jpg",
    caption: "POV: You're at the Heavy Rotation Special 🎶🌟",
    views: "128K",
    likes: "24.5K",
    time: "3d ago",
  },
  {
    id: "tt2",
    thumbnail: "/Gallery/Ribka Budiman.jpg",
    caption: "Get ready with me for theater night ✨💄",
    views: "89K",
    likes: "18.2K",
    time: "6d ago",
  },
  {
    id: "tt3",
    thumbnail: "/Gallery/653866439689600783.jpg",
    caption: "My fave moment from last week's concert 🔥",
    views: "215K",
    likes: "41K",
    time: "1w ago",
  },
];

type Platform = "instagram" | "twitter" | "tiktok";

const platformConfig: Record<Platform, { label: string; color: string; handle: string; url: string }> = {
  instagram: { label: "Instagram", color: "#E1306C", handle: "@jkt48.ribka", url: "https://www.instagram.com/jkt48.ribka/" },
  twitter: { label: "X (Twitter)", color: "#1a1a1a", handle: "@Ribka_JKT48", url: "https://x.com/Ribka_JKT48" },
  tiktok: { label: "TikTok", color: "#010101", handle: "@jkt48.ribka", url: "https://www.tiktok.com/@jkt48.ribka" },
};

// Instagram SVG
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
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

function TwitterEmbed() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    // Timeout fallback jika koneksi diblokir / gagal muat dalam 4.5 detik
    const timeoutId = setTimeout(() => {
      setLoading(false);
      const iframe = document.querySelector('iframe[id^="twitter-widget-"]');
      if (!iframe) {
        setError(true);
      }
    }, 4500);

    const loadWidget = () => {
      // @ts-ignore
      if (window.twttr && window.twttr.widgets) {
        // @ts-ignore
        window.twttr.widgets.load().then(() => {
          setLoading(false);
          clearTimeout(timeoutId);
        });
      }
    };

    if (!document.querySelector('script[src="https://platform.twitter.com/widgets.js"]')) {
      const script = document.createElement("script");
      script.setAttribute("src", "https://platform.twitter.com/widgets.js");
      script.setAttribute("async", "true");
      script.setAttribute("charset", "utf-8");
      script.onload = () => {
        loadWidget();
      };
      script.onerror = () => {
        setError(true);
        setLoading(false);
        clearTimeout(timeoutId);
      };
      document.body.appendChild(script);
    } else {
      loadWidget();
      const checkInterval = setInterval(() => {
        const iframe = document.querySelector('iframe[id^="twitter-widget-"]');
        if (iframe) {
          setLoading(false);
          clearTimeout(timeoutId);
          clearInterval(checkInterval);
        }
      }, 300);
      return () => {
        clearInterval(checkInterval);
        clearTimeout(timeoutId);
      };
    }

    return () => clearTimeout(timeoutId);
  }, [theme]);

  if (error) {
    return (
      <div className="social-item w-full max-w-2xl mx-auto flex flex-col items-center justify-center bg-white dark:bg-white/5 p-8 rounded-2xl border border-gray-200 dark:border-white/10 text-center gap-4 min-h-[300px]">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/10 text-[#E21F26] flex items-center justify-center text-xl font-bold">!</div>
        <div>
          <h4 className="text-gray-800 dark:text-white font-bold text-sm">Gagal Memuat Timeline X (Twitter)</h4>
          <p className="text-gray-500 dark:text-white/40 text-xs mt-1.5 max-w-sm leading-relaxed">
            Koneksi dibatasi oleh ISP (Internet Positif) atau script diblokir oleh adblocker.
          </p>
        </div>
        <a
          href="https://x.com/Ribka_JKT48"
          target="_blank"
          rel="noreferrer"
          className="bg-[#E21F26] text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#c41820] transition-colors"
        >
          Buka Twitter / X Langsung
        </a>
      </div>
    );
  }

  return (
    <div key={theme} className="relative social-item w-full max-w-2xl mx-auto h-[600px] rounded-2xl border border-gray-200 dark:border-white/10 p-2 bg-white dark:bg-[#0f0f0f]">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-[#0f0f0f] rounded-2xl gap-3 z-10">
          <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#E21F26] animate-spin" />
          <span className="text-xs text-gray-400">Menghubungkan ke Twitter...</span>
        </div>
      )}
      <a
        className="twitter-timeline"
        data-height="580"
        data-theme={theme}
        href="https://twitter.com/Ribka_JKT48?ref_src=twsrc%5Etfw"
      >
        Memuat tweets dari @Ribka_JKT48...
      </a>
    </div>
  );
}

function TikTokEmbed() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    // Timeout fallback jika koneksi diblokir / gagal muat dalam 5 detik
    const timeoutId = setTimeout(() => {
      setLoading(false);
      const iframe = document.querySelector('iframe[src*="tiktok.com/embed"]');
      if (!iframe) {
        setError(true);
      }
    }, 5000);

    const loadWidget = () => {
      // @ts-ignore
      if (window.tiktok && window.tiktok.embed) {
        // @ts-ignore
        window.tiktok.embed.lib.render();
      }
    };

    if (!document.querySelector('script[src="https://www.tiktok.com/embed.js"]')) {
      const script = document.createElement("script");
      script.setAttribute("src", "https://www.tiktok.com/embed.js");
      script.setAttribute("async", "true");
      script.onload = () => {
        loadWidget();
        setLoading(false);
        clearTimeout(timeoutId);
      };
      script.onerror = () => {
        setError(true);
        setLoading(false);
        clearTimeout(timeoutId);
      };
      document.body.appendChild(script);
    } else {
      loadWidget();
      const checkInterval = setInterval(() => {
        const iframe = document.querySelector('iframe[src*="tiktok.com/embed"]');
        if (iframe) {
          setLoading(false);
          clearTimeout(timeoutId);
          clearInterval(checkInterval);
        }
      }, 300);
      return () => {
        clearInterval(checkInterval);
        clearTimeout(timeoutId);
      };
    }

    return () => clearTimeout(timeoutId);
  }, []);

  if (error) {
    return (
      <div className="social-item w-full max-w-2xl mx-auto flex flex-col items-center justify-center bg-white dark:bg-white/5 p-8 rounded-2xl border border-gray-200 dark:border-white/10 text-center gap-4 min-h-[300px]">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/10 text-[#E21F26] flex items-center justify-center text-xl font-bold">!</div>
        <div>
          <h4 className="text-gray-800 dark:text-white font-bold text-sm">Gagal Memuat Feed TikTok</h4>
          <p className="text-gray-500 dark:text-white/40 text-xs mt-1.5 max-w-sm leading-relaxed">
            Koneksi lambat atau diblokir oleh ekstensi peramban Anda.
          </p>
        </div>
        <a
          href="https://www.tiktok.com/@jkt48.ribka"
          target="_blank"
          rel="noreferrer"
          className="bg-[#010101] border border-white/10 text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-white/10 transition-colors"
        >
          Buka TikTok Langsung
        </a>
      </div>
    );
  }

  return (
    <div className="relative social-item w-full max-w-2xl mx-auto flex justify-center bg-white dark:bg-[#0f0f0f] p-4 rounded-2xl border border-gray-200 dark:border-white/10 min-h-[350px]">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-[#0f0f0f] rounded-2xl gap-3 z-10">
          <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#E21F26] animate-spin" />
          <span className="text-xs text-gray-400">Menghubungkan ke TikTok...</span>
        </div>
      )}
      <blockquote
        className="tiktok-embed"
        cite="https://www.tiktok.com/@jkt48.ribka"
        data-unique-id="jkt48.ribka"
        data-embed-type="creator"
        style={{ width: "100%", maxWidth: "780px", minWidth: "288px" }}
      >
        <section>
          <a target="_blank" rel="noreferrer" href="https://www.tiktok.com/@jkt48.ribka?refer=creator_embed">
            Memuat profil TikTok @jkt48.ribka...
          </a>
        </section>
      </blockquote>
    </div>
  );
}

export function SocialHub() {
  const [activePlatform, setActivePlatform] = useState<Platform>("instagram");
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);

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

  // Re-animate the feed whenever the platform tab changes.
  useEffect(() => {
    if (prefersReducedMotion() || !feedRef.current) return;
    const items = feedRef.current.querySelectorAll(".social-item");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { y: 24, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out", stagger: 0.07 }
      );
    }, feedRef);
    return () => ctx.revert();
  }, [activePlatform]);

  return (
    <section id="social" ref={sectionRef} className="py-24 bg-[#f8f8fa] dark:bg-[#141414] transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-0.5 bg-[#E21F26]" />
            <span className="text-[#E21F26] text-xs font-bold uppercase tracking-widest">
              Social
            </span>
          </div>
          <h2
            className="text-[#1a1a1a] dark:text-white leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800 }}
          >
            Social Media Hub
          </h2>
          <p
            className="text-gray-500 dark:text-white/50 mt-3"
            style={{ fontSize: "0.95rem" }}
          >
            Follow Ribka across all platforms for the latest updates and behind-the-scenes moments.
          </p>
        </div>

        {/* Platform Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {(Object.keys(platformConfig) as Platform[]).map((platform) => {
            const cfg = platformConfig[platform];
            const isActive = activePlatform === platform;
            return (
              <button
                key={platform}
                onClick={() => setActivePlatform(platform)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-white shadow-md scale-105"
                    : "bg-white dark:bg-white/5 text-gray-600 dark:text-white/70 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                }`}
                style={{
                  backgroundColor: isActive ? cfg.color : undefined,
                  boxShadow: isActive ? `0 4px 14px ${cfg.color}40` : undefined,
                }}
              >
                {platform === "instagram" && <InstagramIcon />}
                {platform === "twitter" && <XIcon />}
                {platform === "tiktok" && <TikTokIcon />}
                {cfg.label}
                <span className="text-xs opacity-70">{cfg.handle}</span>
              </button>
            );
          })}
        </div>

        <div ref={feedRef}>
        {/* Instagram Grid */}
        {activePlatform === "instagram" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {instagramPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => window.open("https://www.instagram.com/jkt48.ribka/", "_blank")}
                className="social-item group relative rounded-xl overflow-hidden cursor-pointer"
              >
                <div className="aspect-square">
                  <img
                    src={post.image}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {post.type === "reel" && (
                  <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1.5">
                    <Play className="w-3 h-3 text-white fill-white" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-3">
                  <div className="flex items-center gap-4 text-white">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4 fill-white" />
                      <span className="text-sm font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {post.likes}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span className="text-sm font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {post.comments}
                      </span>
                    </div>
                  </div>
                  <p
                    className="text-white text-xs text-center leading-relaxed line-clamp-3"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    {post.caption}
                  </p>
                  <span className="text-white/60 text-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {post.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Twitter Feed */}
        {activePlatform === "twitter" && (
          <TwitterEmbed />
        )}

        {/* TikTok Grid */}
        {activePlatform === "tiktok" && (
          <TikTokEmbed />
        )}
        </div>

        {/* Follow Banner */}
        <div className="mt-10 flex flex-wrap gap-3">
          {(Object.keys(platformConfig) as Platform[]).map((platform) => {
            const cfg = platformConfig[platform];
            return (
              <a
                key={platform}
                href={cfg.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:shadow-md hover:border-[#E21F26]/40 transition-all duration-200 hover:scale-105"
              >
                <span style={{ color: cfg.color }} className="dark:brightness-150">
                  {platform === "instagram" && <InstagramIcon />}
                  {platform === "twitter" && <XIcon />}
                  {platform === "tiktok" && <TikTokIcon />}
                </span>
                <span className="text-sm font-semibold text-[#1a1a1a] dark:text-white">
                  Follow on {cfg.label}
                </span>
                <span className="text-gray-400 dark:text-white/40 text-xs">{cfg.handle}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
