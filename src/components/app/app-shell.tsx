"use client";

import { useCallback, useRef, useState } from "react";
import { useStore } from "./store";
import { Sidebar } from "./sidebar";
import { Chat } from "./chat";
import { Note } from "./note";
import { SettingsModal } from "./settings";
import { Icon } from "@/components/icon";
import { clamp } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function AppShell() {
  const { hydrated, dict, isConfigured, dir } = useStore();
  const t = dict.app;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"chat" | "note">("chat");
  const [ratio, setRatio] = useState(0.5);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const onDrag = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      let r = (clientX - rect.left) / rect.width;
      if (dir === "rtl") r = 1 - r;
      setRatio(clamp(r, 0.25, 0.75));
    },
    [dir],
  );

  if (!hydrated) {
    return (
      <div className="flex h-dvh items-center justify-center bg-paper">
        <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-ink-2 font-display text-sm font-semibold animate-pulse">
          NB
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-paper text-ink">
      {/* Sidebar — persistent on desktop */}
      <aside className="hidden w-64 shrink-0 border-e border-line md:block">
        <Sidebar onOpenSettings={() => setSettingsOpen(true)} />
      </aside>

      {/* Sidebar — mobile drawer */}
      {sidebarOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-ink/30 backdrop-blur-[1px]"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 start-0 w-72 max-w-[82%] border-e border-line shadow-2xl shadow-[var(--shadow)]">
            <Sidebar
              onOpenSettings={() => {
                setSettingsOpen(true);
                setSidebarOpen(false);
              }}
              onNavigate={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      ) : null}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center gap-2 border-b border-line px-2 py-2 md:hidden">
          <button
            aria-label={t.settings}
            onClick={() => setSidebarOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink-2 hover:bg-paper-2"
          >
            <Icon name="menu" size={20} />
          </button>
          <div className="inline-flex flex-1 justify-center">
            <div className="inline-flex rounded-sm border border-line p-0.5 text-sm">
              <button
                onClick={() => setMobileTab("chat")}
                className={cn(
                  "rounded-[2px] px-4 py-1",
                  mobileTab === "chat" ? "bg-ink text-paper" : "text-ink-2",
                )}
              >
                {t.chat}
              </button>
              <button
                onClick={() => setMobileTab("note")}
                className={cn(
                  "rounded-[2px] px-4 py-1",
                  mobileTab === "note" ? "bg-ink text-paper" : "text-ink-2",
                )}
              >
                {t.note}
              </button>
            </div>
          </div>
          <span className="h-9 w-9" />
        </div>

        {/* Connect banner */}
        {!isConfigured ? (
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center justify-center gap-2 border-b border-line bg-paper-2 px-4 py-2 text-sm text-ink-2 hover:text-ink"
          >
            <Icon name="settings" size={15} />
            <span>{t.connectTitle}</span>
            <span className="font-medium underline">{t.openSettings}</span>
          </button>
        ) : null}

        {/* Panes */}
        <div ref={containerRef} className="flex min-h-0 flex-1">
          {/* Chat — fixed basis on desktop, full width on mobile */}
          <section
            className={cn(
              "min-w-0 overflow-hidden",
              mobileTab === "chat" ? "max-md:!basis-full" : "max-md:hidden",
            )}
            style={{ flexBasis: `${ratio * 100}%`, flexGrow: 0, flexShrink: 0 }}
          >
            <Chat />
          </section>

          {/* Resizer (desktop only) */}
          <div
            onPointerDown={(e) => {
              dragging.current = true;
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (dragging.current) onDrag(e.clientX);
            }}
            onPointerUp={(e) => {
              dragging.current = false;
              (e.target as HTMLElement).releasePointerCapture(e.pointerId);
            }}
            className="hidden w-px shrink-0 cursor-col-resize bg-line transition-colors hover:bg-ink-2 md:block"
            role="separator"
            aria-orientation="vertical"
          />

          {/* Note — fills remaining space on desktop */}
          <section
            className={cn(
              "min-w-0 overflow-hidden border-s border-line md:flex-1",
              mobileTab === "note" ? "max-md:!basis-full" : "max-md:hidden",
            )}
          >
            <Note />
          </section>
        </div>
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
