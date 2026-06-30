"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@/components/icon";
import { useStore } from "@/components/app/store";

/* ─── inline SVG window control icons ─── */

const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <path d="M3 3l6 6M9 3l-6 6" />
  </svg>
);

const MinimizeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <path d="M2 6h8" />
  </svg>
);

const MaximizeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
    <rect x="2" y="2" width="8" height="8" rx="1" />
  </svg>
);

const RestoreIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <rect x="3" y="1.5" width="7.5" height="7.5" rx="1" />
    <path d="M1.5 4.5v5a1 1 0 001 1h5" />
  </svg>
);

/* ─── detection ─── */

function isElectron(): boolean {
  return typeof window !== "undefined" && "electronAPI" in window;
}

/* ─── component ─── */

export function Titlebar() {
  const { newConversation, dir } = useStore();

  // Only render when inside Electron
  const [electron, setElectron] = useState(false);
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    if (!isElectron()) return;
    setElectron(true);

    // Query initial maximize state
    window.electronAPI!.isMaximized().then(setMaximized);

    // Listen for changes
    const unsub = window.electronAPI!.onMaximizedChange((m) => setMaximized(m));
    return () => unsub();
  }, []);

  const minimize = useCallback(() => window.electronAPI?.minimizeWindow(), []);
  const maximize = useCallback(() => window.electronAPI?.maximizeWindow(), []);
  const closeWin = useCallback(() => window.electronAPI?.closeWindow(), []);

  if (!electron) return null;

  return (
    <div
      className="titlebar-drag relative flex items-center h-[38px] border-b border-line bg-paper shrink-0 select-none z-50"
      dir="ltr"
    >
      {/* ── Brand ── */}
      <div className="titlebar-nodrag flex items-center gap-2 pl-3 pr-2 min-w-0">
        <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[2px] border border-ink font-display text-[9px] font-semibold leading-none tracking-tight">
          NB
        </span>
        <span className="font-display text-[13px] tracking-tight text-ink-2 truncate">
          Notabene
        </span>
      </div>

      {/* ── spacer (drag) ── */}
      <div className="flex-1 min-w-0" />

      {/* ── app buttons ── */}
      <div className="titlebar-nodrag flex items-center gap-0.5 pr-1">
        {/* New conversation */}
        <button
          onClick={newConversation}
          className="flex items-center justify-center w-[30px] h-[30px] rounded-[3px] text-ink-2 hover:text-ink hover:bg-paper-2 transition-colors active:scale-95"
          title={dir === "rtl" ? "محادثة جديدة" : "New conversation"}
        >
          <Icon name="new" size={16} strokeWidth={1.8} />
        </button>

        {/* Settings */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('notabene:open-settings'))}
          className="flex items-center justify-center w-[30px] h-[30px] rounded-[3px] text-ink-2 hover:text-ink hover:bg-paper-2 transition-colors active:scale-95"
          title={dir === "rtl" ? "الإعدادات" : "Settings"}
        >
          <Icon name="settings" size={16} strokeWidth={1.8} />
        </button>

        {/* thin separator */}
        <span className="mx-1.5 block w-px h-[16px] bg-line shrink-0" />
      </div>

      {/* ── window controls ── */}
      <div className="titlebar-nodrag flex items-stretch h-full">
        <button
          onClick={minimize}
          className="flex items-center justify-center w-[46px] text-ink-2 hover:text-ink hover:bg-paper-2 transition-colors active:bg-paper-3"
          aria-label="Minimize"
        >
          <MinimizeIcon />
        </button>
        <button
          onClick={maximize}
          className="flex items-center justify-center w-[46px] text-ink-2 hover:text-ink hover:bg-paper-2 transition-colors active:bg-paper-3"
          aria-label={maximized ? "Restore" : "Maximize"}
        >
          {maximized ? <RestoreIcon /> : <MaximizeIcon />}
        </button>
        <button
          onClick={closeWin}
          className="flex items-center justify-center w-[46px] text-ink-2 hover:text-paper hover:bg-ink transition-colors"
          aria-label="Close"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}
