import type { Metadata } from "next";
import { Landing } from "@/components/landing/landing";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: { en: "/", ar: "/ar", "x-default": "/" },
  },
  openGraph: { locale: "en_US" },
};

export default function HomeEn() {
  return <Landing locale="en" />;
}
