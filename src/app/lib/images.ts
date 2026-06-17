/**
 * ──────────────────────────────────────────────────────────────────────────
 *  CENTRAL IMAGE REGISTRY
 *  Semua gambar di website ini diatur dari sini. Untuk mengganti dengan foto
 *  Ribka yang asli, cukup ubah URL/path di bawah (atau taruh file di folder
 *  /public dan tulis pathnya, contoh: "/images/ribka-hero.jpg").
 * ──────────────────────────────────────────────────────────────────────────
 */

export const IMAGES = {
  // Hero
  heroBackground:
    "/card-hero/Ribka_Budiman_JKT48_2026_29.webp",
  heroPortrait:
    "/card-hero/Ribka_Budiman_JKT48_2026_29.webp",

  // About / Profile
  profile:
    "/card-hero/Ribka_Budiman_JKT48.jpg",

  // Gallery
  gallery: [
    "/Gallery/Ribka JKT48.jpg",
    "/Gallery/Ribka Budiman.jpg",
    "/Gallery/Ribka 29 Mei 2026 X Update.jpg",
    "/Gallery/Ribka Trainee JKT48.jpg",
    "/Gallery/1054264594035347642.jpg",
    "/Gallery/653866439689600783.jpg",
    "/Gallery/871587334146197481.jpg",
    "/Gallery/899453356847193418.jpg",
  ],
} as const;

/** Brand color tokens used across the JS layer (charts, GSAP, confetti). */
export const BRAND = {
  red: "#E21F26",
  redDark: "#c41820",
  ink: "#1a1a1a",
} as const;
