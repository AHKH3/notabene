/** Single source of truth for brand + deployment metadata. */
export const SITE = {
  name: "Notabene",
  // Short, dual-language-friendly tagline used in meta descriptions.
  tagline: "Think in the margin",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://notabene-eight.vercel.app",
  repo: "https://github.com/AHKH3/notabene",
  author: "Abdelrahman Hamada",
  authorUrl: "https://github.com/AHKH3",
  twitter: "",
} as const;
