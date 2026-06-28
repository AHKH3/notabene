"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";

/** A tiny island so the otherwise-static landing pages get a theme toggle. */
export function ThemeToggle({ label }: { label: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      const raw = localStorage.getItem("notabene.settings");
      const settings = raw ? JSON.parse(raw) : {};
      settings.theme = next ? "dark" : "light";
      localStorage.setItem("notabene.settings", JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink"
    >
      <Icon name="theme" size={18} />
    </button>
  );
}
