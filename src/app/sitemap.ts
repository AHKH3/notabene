import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: `${SITE.url}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: { en: `${SITE.url}/`, ar: `${SITE.url}/ar` } },
    },
    {
      url: `${SITE.url}/ar`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: { languages: { en: `${SITE.url}/`, ar: `${SITE.url}/ar` } },
    },
  ];
}
