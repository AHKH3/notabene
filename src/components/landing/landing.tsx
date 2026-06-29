import Link from "next/link";
import type { Locale } from "@/lib/types";
import { getDict } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { Icon, type IconName } from "@/components/icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { PROVIDERS } from "@/lib/providers";

const FEATURE_ICONS: IconName[] = [
  "split",
  "curate",
  "key",
  "shield",
  "translate",
  "source",
];

export function Landing({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const isAr = locale === "ar";
  const otherHref = isAr ? "/" : "/ar";
  const switchLabel = isAr ? "English" : "العربية";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE.name,
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
    url: SITE.url,
    description: d.concept,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: { "@type": "Person", name: SITE.author, url: SITE.authorUrl },
    license: "https://opensource.org/licenses/MIT",
    isAccessibleForFree: true,
    inLanguage: ["en", "ar"],
  };

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ---- Nav ---- */}
      <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-6">
          <Link href={otherHref === "/" ? "/ar" : "/"} className="flex items-center gap-2" aria-label={d.brand}>
            <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-ink font-display text-sm font-semibold">
              NB
            </span>
            <span className="font-display text-xl tracking-tight">{d.brand}</span>
          </Link>

          <div className="mx-auto hidden items-center gap-7 text-sm text-ink-2 md:flex">
            <a href="#features" className="transition-colors hover:text-ink">{d.nav.features}</a>
            <a href="#how" className="transition-colors hover:text-ink">{d.nav.how}</a>
            <a href="#privacy" className="transition-colors hover:text-ink">{d.nav.privacy}</a>
          </div>

          <div className="ms-auto flex items-center gap-1 md:ms-0">
            <Link
              href={otherHref}
              className="inline-flex h-9 items-center rounded-sm px-2.5 text-sm text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink"
            >
              {switchLabel}
            </Link>
            <ThemeToggle label="Theme" />
            <a
              href={SITE.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={d.nav.github}
              className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink"
            >
              <Icon name="github" size={19} />
            </a>
            <Link
              href="/app"
              className="ms-1 inline-flex h-9 items-center gap-1.5 rounded-sm bg-ink px-4 text-sm text-paper transition-opacity hover:opacity-90"
            >
              {d.nav.launch}
            </Link>
          </div>
        </nav>
      </header>

      {/* ---- Hero ---- */}
      <section className="mx-auto max-w-6xl px-6 pb-10 pt-16 md:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <div className="nb-rise">
            <p className="mb-5 font-serif text-sm italic text-ink-3">
              {d.hero.eyebrow}
            </p>
            <h1 className="font-display text-5xl leading-[1.04] tracking-tight md:text-6xl lg:text-7xl">
              {d.hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">
              {d.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/app"
                className="inline-flex items-center gap-2 rounded-sm bg-ink px-6 py-3 text-base text-paper transition-opacity hover:opacity-90"
              >
                {d.hero.ctaPrimary}
                <Icon name={isAr ? "arrowLeft" : "arrowRight"} size={18} />
              </Link>
              <a
                href={SITE.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-line-2 px-6 py-3 text-base text-ink transition-colors hover:bg-paper-2"
              >
                <Icon name="github" size={18} />
                {d.hero.ctaSecondary}
              </a>
            </div>
            <p className="mt-5 text-sm text-ink-3">{d.hero.note}</p>
          </div>

          <div className="nb-fade" style={{ animationDelay: "0.15s" }}>
            <DemoMock locale={locale} />
          </div>
        </div>
      </section>

      {/* ---- Meaning strip ---- */}
      <section className="border-y border-line bg-paper-2">
        <div className="mx-auto max-w-4xl px-6 py-14 text-center">
          <p className="font-display text-2xl leading-relaxed text-ink-2 md:text-[28px]">
            {d.meaning}
          </p>
        </div>
      </section>

      {/* ---- Concept ---- */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="font-display text-4xl tracking-tight md:text-5xl">
          {d.conceptHeading}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">
          {d.concept}
        </p>
      </section>

      {/* ---- Features ---- */}
      <section id="features" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="mb-14 text-center font-display text-4xl tracking-tight md:text-5xl">
            {d.featuresHeading}
          </h2>
          <div className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {d.features.map((f, i) => (
              <div key={i} className="bg-paper p-8">
                <Icon name={FEATURE_ICONS[i]} size={26} className="text-ink" strokeWidth={1.4} />
                <h3 className="mt-5 font-display text-xl">{f.title}</h3>
                <p className="mt-2.5 leading-relaxed text-ink-2">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section id="how" className="border-t border-line bg-paper-2">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <h2 className="mb-14 text-center font-display text-4xl tracking-tight md:text-5xl">
            {d.howHeading}
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            {d.how.map((s, i) => (
              <div key={i} className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-ink-2 font-display text-2xl">
                  {i + 1}
                </span>
                <h3 className="mt-5 font-display text-2xl">{s.title}</h3>
                <p className="mt-2.5 leading-relaxed text-ink-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Privacy ---- */}
      <section id="privacy" className="mx-auto max-w-4xl px-6 py-24 text-center">
        <Icon name="shield" size={34} className="mx-auto text-ink" strokeWidth={1.3} />
        <h2 className="mt-6 font-display text-4xl tracking-tight md:text-5xl">
          {d.privacyHeading}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">
          {d.privacy}
        </p>
      </section>

      {/* ---- BYOK ---- */}
      <section className="border-t border-line bg-paper-2">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <Icon name="key" size={32} className="mx-auto text-ink" strokeWidth={1.3} />
          <h2 className="mt-6 font-display text-3xl tracking-tight md:text-4xl">
            {d.byokHeading}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-ink-2">
            {d.byok}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {PROVIDERS.filter((p) => p.id !== "custom").map((p) => (
              <span
                key={p.id}
                className="rounded-sm border border-line-2 px-3 py-1.5 text-sm text-ink-2"
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Final CTA ---- */}
      <section className="mx-auto max-w-4xl px-6 py-28 text-center">
        <h2 className="font-display text-4xl tracking-tight md:text-6xl">
          {d.hero.title}
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-sm bg-ink px-7 py-3.5 text-base text-paper transition-opacity hover:opacity-90"
          >
            {d.hero.ctaPrimary}
            <Icon name={isAr ? "arrowLeft" : "arrowRight"} size={18} />
          </Link>
          <a
            href={SITE.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-sm border border-line-2 px-7 py-3.5 text-base text-ink transition-colors hover:bg-paper-2"
          >
            <Icon name="github" size={18} />
            {d.footer.source}
          </a>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-ink-3 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-sm border border-ink-2 font-display text-xs font-semibold">
              NB
            </span>
            <span className="font-display text-base text-ink-2">{d.brand}</span>
            <span className="mx-1">·</span>
            <span>{d.footer.tagline}</span>
          </div>
          <div className="flex items-center gap-5">
            <span>
              {d.footer.madeBy}{" "}
              <a
                href={SITE.authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-rule text-ink-2"
              >
                {d.footer.author}
              </a>
            </span>
            <a href={SITE.repo} target="_blank" rel="noopener noreferrer" className="link-rule">
              {d.footer.license}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- The hero demo: a static replica of the two-pane UI ---------- */
function DemoMock({ locale }: { locale: Locale }) {
  const d = getDict(locale);
  const m = d.demo;
  return (
    <div className="overflow-hidden rounded-sm border border-line-2 bg-paper shadow-2xl shadow-[var(--shadow)]">
      <div className="flex items-center gap-2 border-b border-line bg-paper-2 px-4 py-2.5">
        <span className="flex h-5 w-5 items-center justify-center rounded-[2px] border border-ink-2 font-display text-[9px] font-semibold">
          NB
        </span>
        <span className="font-display text-sm tracking-tight text-ink-2">Notabene</span>
      </div>
      <div className="grid grid-cols-2 divide-x divide-line rtl:divide-x-reverse">
        {/* Chat side */}
        <div className="space-y-3 p-4">
          <p className="text-[9px] uppercase tracking-[0.16em] text-ink-3">{m.chatTitle}</p>
          <Msg who={m.you} right>{m.u1}</Msg>
          <Msg who={m.ai}>{m.a1}</Msg>
          <Msg who={m.you} right>{m.u2}</Msg>
        </div>
        {/* Note side */}
        <div className="ruled bg-paper p-4">
          <p className="mb-3 text-[9px] uppercase tracking-[0.16em] text-ink-3">{m.noteTitle}</p>
          <h4 className="font-display text-base">{m.n1.replace(/^#+\s*/, "")}</h4>
          <blockquote className="my-2 border-s-2 border-line-2 ps-2.5 text-[13px] italic leading-relaxed text-ink-2">
            {m.n2.replace(/^>\s*/, "")}
          </blockquote>
          <p className="text-[13px] leading-relaxed text-ink">
            <strong className="font-semibold">{strongLabel(m.n3, locale)}</strong>
            {strongRest(m.n3)}
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink">
            <strong className="font-semibold">{strongLabel(m.n4, locale)}</strong>
            {strongRest(m.n4)}
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-sm bg-ink px-3 py-1.5 text-[11px] text-paper">
            <Icon name="curate" size={13} />
            {m.curate}
          </div>
        </div>
      </div>
    </div>
  );
}

function Msg({
  children,
  who,
  right,
}: {
  children: React.ReactNode;
  who: string;
  right?: boolean;
}) {
  return (
    <div className={right ? "flex flex-col items-end" : "flex flex-col items-start"}>
      <span className="px-0.5 text-[9px] uppercase tracking-[0.14em] text-ink-3">{who}</span>
      <p
        className={
          "mt-0.5 max-w-[92%] rounded-sm px-2.5 py-1.5 text-[12.5px] leading-relaxed " +
          (right ? "bg-paper-2 text-ink" : "border border-line bg-paper text-ink")
        }
      >
        {children}
      </p>
    </div>
  );
}

/** Pull the leading **bold** label out of a markdown line for styled display. */
function strongLabel(line: string, locale: Locale): string {
  const m = line.match(/^\*\*(.+?)\*\*/);
  return m ? m[1] + " " : "";
}
function strongRest(line: string): string {
  return line.replace(/^\*\*(.+?)\*\*/, "").trim() + "";
}
