import { get, set, del } from "idb-keyval";
import type { Conversation, Settings } from "./types";
import { PROVIDERS } from "./providers";

const SETTINGS_KEY = "notabene.settings";
const CONVERSATIONS_KEY = "notabene.conversations";
const ACTIVE_KEY = "notabene.active";

const openrouter = PROVIDERS[0];

export const DEFAULT_SETTINGS: Settings = {
  baseUrl: openrouter.baseUrl,
  apiKey: "",
  model: openrouter.suggestedModel,
  curatorModel: "",
  temperature: 0.7,
  locale: "en",
  theme: "system",
  autoCurate: false,
};

/** Settings (including the key) live in localStorage — small and synchronous. */
export function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS, locale: detectLocale() };
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* storage full or blocked — non-fatal */
  }
}

function detectLocale(): Settings["locale"] {
  if (typeof navigator === "undefined") return "en";
  return navigator.language?.toLowerCase().startsWith("ar") ? "ar" : "en";
}

/** Conversations can grow large, so they go in IndexedDB. */
export async function loadConversations(): Promise<Conversation[]> {
  try {
    const data = await get<Conversation[]>(CONVERSATIONS_KEY);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function saveConversations(
  conversations: Conversation[],
): Promise<void> {
  try {
    await set(CONVERSATIONS_KEY, conversations);
  } catch {
    /* non-fatal */
  }
}

export async function loadActiveId(): Promise<string | null> {
  try {
    return (await get<string>(ACTIVE_KEY)) ?? null;
  } catch {
    return null;
  }
}

export async function saveActiveId(id: string | null): Promise<void> {
  try {
    if (id) await set(ACTIVE_KEY, id);
    else await del(ACTIVE_KEY);
  } catch {
    /* non-fatal */
  }
}

export async function clearAllData(): Promise<void> {
  try {
    window.localStorage.removeItem(SETTINGS_KEY);
    await del(CONVERSATIONS_KEY);
    await del(ACTIVE_KEY);
  } catch {
    /* non-fatal */
  }
}
