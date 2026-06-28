export type Role = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  /** Set while a streamed assistant message is still being received. */
  streaming?: boolean;
  error?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  /** The curated margin note — the heart of Notabene. Markdown. */
  note: string;
  createdAt: number;
  updatedAt: number;
}

export type Locale = "en" | "ar";
export type ThemeMode = "light" | "dark" | "system";

export interface Settings {
  baseUrl: string;
  apiKey: string;
  model: string;
  /** Optional separate model for the curator; falls back to `model`. */
  curatorModel: string;
  temperature: number;
  locale: Locale;
  theme: ThemeMode;
  /** Whether the curator may run automatically after assistant replies. */
  autoCurate: boolean;
}
