import type { NextConfig } from "next";

// Static export so Notabene can be self-hosted anywhere — GitHub Pages, Vercel,
// Netlify, an S3 bucket, or your own machine. The app runs entirely in the
// browser; your keys, chats and notes never leave your device.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
