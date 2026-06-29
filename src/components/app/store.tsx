"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ChatMessage, Conversation, Settings } from "@/lib/types";
import {
  DEFAULT_SETTINGS,
  clearAllData as clearAll,
  loadActiveId,
  loadConversations,
  loadSettings,
  saveActiveId,
  saveConversations,
  saveSettings,
} from "@/lib/storage";
import { getDict, type Dict } from "@/lib/i18n";
import { uid } from "@/lib/utils";

interface Store {
  hydrated: boolean;
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  conversations: Conversation[];
  activeId: string | null;
  active: Conversation | null;
  dict: Dict;
  dir: "ltr" | "rtl";
  isConfigured: boolean;
  newConversation: () => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setNote: (note: string) => void;
  wipeEverything: () => Promise<void>;
}

const StoreContext = createContext<Store | null>(null);

function makeConversation(): Conversation {
  const now = Date.now();
  return {
    id: uid(),
    title: "",
    messages: [],
    note: "",
    createdAt: now,
    updatedAt: now,
  };
}

function deriveTitle(messages: ChatMessage[]): string {
  const firstUser = messages.find((m) => m.role === "user" && m.content.trim());
  if (!firstUser) return "";
  const t = firstUser.content.trim().replace(/\s+/g, " ");
  return t.length > 48 ? t.slice(0, 48) + "…" : t;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---- Hydrate from storage on mount ------------------------------------
  useEffect(() => {
    let alive = true;
    const s = loadSettings();
    (async () => {
      const [convs, active] = await Promise.all([
        loadConversations(),
        loadActiveId(),
      ]);
      if (!alive) return;
      setSettings(s);
      if (convs.length === 0) {
        const fresh = makeConversation();
        setConversations([fresh]);
        setActiveId(fresh.id);
      } else {
        setConversations(convs);
        setActiveId(active && convs.some((c) => c.id === active) ? active : convs[0].id);
      }
      setHydrated(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // ---- Persist settings -------------------------------------------------
  useEffect(() => {
    if (hydrated) saveSettings(settings);
  }, [settings, hydrated]);

  // ---- Persist conversations (debounced) --------------------------------
  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveConversations(conversations), 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [conversations, hydrated]);

  // ---- Persist conversations on page hide (prevent data loss) -----------
  useEffect(() => {
    if (!hydrated) return;
    const handle = () => {
      if (document.hidden) {
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveConversations(conversations);
      }
    };
    document.addEventListener("visibilitychange", handle);
    return () => document.removeEventListener("visibilitychange", handle);
  }, [conversations, hydrated]);

  useEffect(() => {
    if (hydrated) saveActiveId(activeId);
  }, [activeId, hydrated]);

  // ---- Apply theme ------------------------------------------------------
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const dark =
        settings.theme === "dark" ||
        (settings.theme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.classList.toggle("dark", dark);
    };
    apply();
    if (settings.theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [settings.theme]);

  // ---- Apply language / direction to the document -----------------------
  useEffect(() => {
    document.documentElement.lang = settings.locale;
    document.documentElement.dir = settings.locale === "ar" ? "rtl" : "ltr";
  }, [settings.locale]);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const patchActive = useCallback(
    (patch: Partial<Conversation>) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId ? { ...c, ...patch, updatedAt: Date.now() } : c,
        ),
      );
    },
    [activeId],
  );

  const setMessages = useCallback(
    (messages: ChatMessage[]) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== activeId) return c;
          const title = c.title || deriveTitle(messages);
          return { ...c, messages, title, updatedAt: Date.now() };
        }),
      );
    },
    [activeId],
  );

  const setNote = useCallback((note: string) => patchActive({ note }), [patchActive]);

  const newConversation = useCallback(() => {
    const fresh = makeConversation();
    setConversations((prev) => [fresh, ...prev]);
    setActiveId(fresh.id);
  }, []);

  const selectConversation = useCallback((id: string) => setActiveId(id), []);

  const deleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== id);
        if (next.length === 0) {
          const fresh = makeConversation();
          setActiveId(fresh.id);
          return [fresh];
        }
        if (id === activeId) setActiveId(next[0].id);
        return next;
      });
    },
    [activeId],
  );

  const renameConversation = useCallback((id: string, title: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: title.trim() } : c)),
    );
  }, []);

  const wipeEverything = useCallback(async () => {
    await clearAll();
    const fresh = makeConversation();
    setConversations([fresh]);
    setActiveId(fresh.id);
    setSettings({ ...DEFAULT_SETTINGS, locale: settings.locale });
  }, [settings.locale]);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId],
  );

  const value: Store = {
    hydrated,
    settings,
    updateSettings,
    conversations,
    activeId,
    active,
    dict: getDict(settings.locale),
    dir: settings.locale === "ar" ? "rtl" : "ltr",
    // A local server needs no key; everything else does.
    isConfigured: Boolean(
      settings.baseUrl &&
        settings.model &&
        (settings.apiKey.trim() ||
          /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(settings.baseUrl)),
    ),
    newConversation,
    selectConversation,
    deleteConversation,
    renameConversation,
    setMessages,
    setNote,
    wipeEverything,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
