import type { MetadataRoute } from "next";
import { asset } from "@/lib/utils";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Notabene — Think in the margin",
    short_name: "Notabene",
    description:
      "A local-first, open-source AI thinking tool: chat plus a living note curated by AI.",
    start_url: asset("/app/"),
    scope: asset("/"),
    display: "standalone",
    background_color: "#fbfaf7",
    theme_color: "#fbfaf7",
    icons: [
      { src: asset("/favicon.svg"), sizes: "any", type: "image/svg+xml" },
    ],
  };
}
