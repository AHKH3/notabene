import type { Metadata, Viewport } from "next";
import { Playfair_Display, EB_Garamond, Amiri, IBM_Plex_Mono } from "next/font/google";
import { SITE } from "@/lib/site";
import { asset } from "@/lib/utils";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Notabene — Think in the margin",
    template: "%s — Notabene",
  },
  description:
    "A local-first, open-source AI thinking tool. Chat on one side, a living note on the other — an AI Curator keeps your words verbatim and the AI's distilled. Bring your own key.",
  keywords: [
    "AI thinking tool",
    "AI notes",
    "open source AI chat",
    "bring your own key",
    "local-first",
    "BYOK",
    "OpenAI compatible",
    "Arabic AI app",
    "note taking AI",
    "Notabene",
  ],
  authors: [{ name: SITE.author, url: SITE.authorUrl }],
  creator: SITE.author,
  applicationName: SITE.name,
  alternates: {
    canonical: "/",
    languages: { en: "/", ar: "/ar", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "Notabene — Think in the margin",
    description:
      "Chat with AI on one side, a living note on the other. An AI Curator distils what matters — your words verbatim, the AI's summarised. Open source, local-first, BYOK.",
    url: SITE.url,
    // og image is provided by the app/opengraph-image convention.
  },
  twitter: {
    card: "summary_large_image",
    title: "Notabene — Think in the margin",
    description:
      "A local-first, open-source AI thinking tool. Chat + a living note, curated by AI. Bring your own key.",
  },
  icons: {
    icon: [{ url: asset("/favicon.svg"), type: "image/svg+xml" }],
    apple: asset("/favicon.svg"),
  },
  manifest: asset("/manifest.webmanifest"),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#100e0c" },
  ],
  colorScheme: "light dark",
};

// Sets the .dark class before first paint so there is no flash of the wrong theme.
const themeScript = `(function(){try{var s=localStorage.getItem('notabene.settings');var t=s?JSON.parse(s).theme:'system';var d=t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${garamond.variable} ${amiri.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
      </body>
    </html>
  );
}
