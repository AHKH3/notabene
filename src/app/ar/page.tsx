import type { Metadata } from "next";
import { Landing } from "@/components/landing/landing";

export const metadata: Metadata = {
  title: "نوتابيني — فكِّر في الهامش",
  description:
    "أداة تفكير بالذكاء الاصطناعي، محلية ومفتوحة المصدر. محادثة في جهة، وهامش حيّ في الجهة الأخرى — يحرّره ذكاء اصطناعي يحتفظ بكلامك بنصّه ويُلخّص كلام الذكاء. اجلب مفتاحك.",
  alternates: {
    canonical: "/ar",
    languages: { en: "/", ar: "/ar", "x-default": "/" },
  },
  openGraph: {
    locale: "ar_AR",
    title: "نوتابيني — فكِّر في الهامش",
    description:
      "محادثة في جهة، وهامش حيّ في الأخرى يحرّره الذكاء الاصطناعي. مفتوح المصدر، محلي، واجلب مفتاحك.",
  },
};

export default function HomeAr() {
  return (
    <div lang="ar" dir="rtl">
      <Landing locale="ar" />
    </div>
  );
}
