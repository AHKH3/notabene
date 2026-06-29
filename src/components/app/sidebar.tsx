"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useStore } from "./store";
import { Icon } from "@/components/icon";
import { Button, IconButton } from "./ui";
import { cn } from "@/lib/utils";

export function Sidebar({
  onOpenSettings,
  onNavigate,
}: {
  onOpenSettings: () => void;
  onNavigate?: () => void;
}) {
  const {
    conversations,
    activeId,
    selectConversation,
    deleteConversation,
    newConversation,
    dict,
    settings,
    updateSettings,
  } = useStore();
  const t = dict.app;
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const sorted = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);
    if (!query.trim()) return sorted;
    const q = query.toLowerCase();
    return sorted.filter(
      (c) =>
        (c.title || "").toLowerCase().includes(q) ||
        c.messages.some((m) => m.content.toLowerCase().includes(q)),
    );
  }, [conversations, query]);

  return (
    <div className="flex h-full flex-col bg-paper-2">
      {/* Brand */}
      <div className="flex items-center justify-between gap-2 px-4 py-4">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label={dict.brand}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-ink-2 font-display text-sm font-semibold">
            NB
          </span>
          <span className="font-display text-lg tracking-tight">{dict.brand}</span>
        </Link>
        <IconButton icon="theme" label={t.toggleTheme} onClick={() => {
          const order = ["light", "dark", "system"] as const;
          const next = order[(order.indexOf(settings.theme) + 1) % 3];
          updateSettings({ theme: next });
        }} />
      </div>

      <div className="px-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            newConversation();
            onNavigate?.();
          }}
        >
          <Icon name="new" size={16} />
          {t.newConversation}
        </Button>
      </div>

      {/* Search */}
      <div className="px-3 pt-3">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 start-2.5 flex items-center text-ink-3">
            <Icon name="search" size={15} />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setQuery("");
            }}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-sm border border-line bg-field py-1.5 ps-8 pe-9 text-sm outline-none placeholder:text-ink-3 focus:border-ink-2"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              aria-label={t.clear}
              title={t.clear}
              className="absolute inset-y-0 end-2 flex items-center text-ink-3 hover:text-ink"
            >
              <Icon name="close" size={15} />
            </button>
          ) : null}
        </div>
      </div>

      {/* List */}
      <nav className="mt-3 flex-1 overflow-y-auto px-2 pb-2">
        {filtered.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-ink-3">{t.empty}</p>
        ) : (
          <ul className="space-y-0.5">
            {filtered.map((c) => (
              <li key={c.id} className="group relative">
                <button
                  onClick={() => {
                    selectConversation(c.id);
                    onNavigate?.();
                  }}
                  className={cn(
                    "w-full truncate rounded-sm py-2 pe-9 ps-3 text-start text-sm transition-colors",
                    c.id === activeId
                      ? "bg-paper text-ink shadow-sm shadow-[var(--shadow)]"
                      : "text-ink-2 hover:bg-paper/60 hover:text-ink",
                  )}
                  title={c.title || t.untitled}
                >
                  {c.title || (
                    <span className="italic text-ink-3">{t.untitled}</span>
                  )}
                </button>
                <button
                  aria-label={t.delete}
                  title={t.delete}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(t.deleteConfirm)) deleteConversation(c.id);
                  }}
                  className="absolute end-1.5 top-1/2 hidden -translate-y-1/2 rounded-sm p-1 text-ink-3 hover:bg-paper-3 hover:text-ink group-hover:block max-md:block"
                >
                  <Icon name="delete" size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-line px-3 py-3">
        <button
          onClick={onOpenSettings}
          className="inline-flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-ink-2 hover:bg-paper hover:text-ink"
        >
          <Icon name="settings" size={17} />
          {t.settings}
        </button>
        <button
          onClick={() =>
            updateSettings({ locale: settings.locale === "ar" ? "en" : "ar" })
          }
          className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1.5 text-sm text-ink-2 hover:bg-paper hover:text-ink"
        >
          <Icon name="translate" size={16} />
          {settings.locale === "ar" ? "EN" : "ع"}
        </button>
      </div>
    </div>
  );
}
