import type { Locale } from "./types";

export type CorsSupport = "yes" | "no" | "local";

export interface ProviderPreset {
  id: string;
  name: string;
  baseUrl: string;
  /** A sensible default model id — fully editable by the user. */
  suggestedModel: string;
  /** Where to get an API key. */
  keyUrl?: string;
  /** Can the browser call it directly (CORS)? */
  cors: CorsSupport;
}

/**
 * Notabene talks to anything that speaks the OpenAI Chat Completions API.
 * Because everything runs in your browser, the provider must allow
 * cross-origin (CORS) requests. Most BYOK-friendly gateways do; a few
 * (notably api.openai.com) do not and need a small proxy.
 */
export const PROVIDERS: ProviderPreset[] = [
  {
    id: "openrouter",
    name: "OpenRouter",
    baseUrl: "https://openrouter.ai/api/v1",
    suggestedModel: "openai/gpt-4o-mini",
    keyUrl: "https://openrouter.ai/keys",
    cors: "yes",
  },
  {
    id: "groq",
    name: "Groq",
    baseUrl: "https://api.groq.com/openai/v1",
    suggestedModel: "llama-3.3-70b-versatile",
    keyUrl: "https://console.groq.com/keys",
    cors: "yes",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    baseUrl: "https://api.deepseek.com/v1",
    suggestedModel: "deepseek-chat",
    keyUrl: "https://platform.deepseek.com/api_keys",
    cors: "yes",
  },
  {
    id: "mistral",
    name: "Mistral",
    baseUrl: "https://api.mistral.ai/v1",
    suggestedModel: "mistral-large-latest",
    keyUrl: "https://console.mistral.ai/api-keys",
    cors: "yes",
  },
  {
    id: "together",
    name: "Together AI",
    baseUrl: "https://api.together.xyz/v1",
    suggestedModel: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    keyUrl: "https://api.together.xyz/settings/api-keys",
    cors: "yes",
  },
  {
    id: "ollama",
    name: "Ollama (local)",
    baseUrl: "http://localhost:11434/v1",
    suggestedModel: "llama3.2",
    keyUrl: "https://ollama.com/download",
    cors: "local",
  },
  {
    id: "lmstudio",
    name: "LM Studio (local)",
    baseUrl: "http://localhost:1234/v1",
    suggestedModel: "local-model",
    keyUrl: "https://lmstudio.ai",
    cors: "local",
  },
  {
    id: "openai",
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    suggestedModel: "gpt-4o-mini",
    keyUrl: "https://platform.openai.com/api-keys",
    cors: "no",
  },
  {
    id: "custom",
    name: "Custom / OpenAI-compatible",
    baseUrl: "",
    suggestedModel: "",
    cors: "yes",
  },
];

export function corsHint(cors: CorsSupport, locale: Locale): string | null {
  if (cors === "yes") return null;
  if (cors === "local") {
    return locale === "ar"
      ? "خادم محلي — فعّل CORS للسماح للمتصفح بالاتصال (مثلاً OLLAMA_ORIGINS=* لـ Ollama)."
      : "Local server — enable CORS so the browser can connect (e.g. OLLAMA_ORIGINS=* for Ollama).";
  }
  return locale === "ar"
    ? "هذا المزود لا يسمح بالاتصال المباشر من المتصفح (CORS). استخدم بوابة مثل OpenRouter أو وسيطًا صغيرًا."
    : "This provider blocks direct browser calls (CORS). Use a gateway like OpenRouter, or a small proxy.";
}
