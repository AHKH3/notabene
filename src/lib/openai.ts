/**
 * A tiny, dependency-free client for the OpenAI Chat Completions API and the
 * many providers that implement it. The streaming parser is written to spec:
 * it handles `data: [DONE]`, keep-alive comments, multiple events per network
 * chunk, and — crucially — JSON objects split across two reads.
 */

import type { Role } from "./types";

export interface WireMessage {
  role: Role;
  content: string;
}

export interface ChatOptions {
  baseUrl: string;
  apiKey: string;
  model: string;
  messages: WireMessage[];
  temperature?: number;
  signal?: AbortSignal;
}

export type ApiErrorCode =
  | "no-config"
  | "auth"
  | "rate-limit"
  | "cors"
  | "network"
  | "bad-response"
  | "aborted"
  | "unknown";

export class ApiError extends Error {
  code: ApiErrorCode;
  status?: number;
  constructor(code: ApiErrorCode, message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

function endpoint(baseUrl: string): string {
  const trimmed = baseUrl.trim().replace(/\/+$/, "");
  return `${trimmed}/chat/completions`;
}

function buildHeaders(baseUrl: string, apiKey: string): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
  // OpenRouter likes these for attribution; harmless elsewhere.
  if (/openrouter\.ai/.test(baseUrl) && typeof window !== "undefined") {
    headers["HTTP-Referer"] = window.location.origin;
    headers["X-Title"] = "Notabene";
  }
  return headers;
}

async function readError(res: Response): Promise<ApiError> {
  let detail = "";
  try {
    const data = await res.json();
    detail = data?.error?.message || data?.message || JSON.stringify(data);
  } catch {
    try {
      detail = await res.text();
    } catch {
      detail = res.statusText;
    }
  }
  let code: ApiErrorCode = "unknown";
  if (res.status === 401 || res.status === 403) code = "auth";
  else if (res.status === 429) code = "rate-limit";
  else if (res.status >= 500) code = "bad-response";
  return new ApiError(code, detail || `HTTP ${res.status}`, res.status);
}

function wrapFetchError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;
  if (err instanceof DOMException && err.name === "AbortError") {
    return new ApiError("aborted", "Request cancelled.");
  }
  // A failed fetch with no Response is almost always CORS or connectivity.
  return new ApiError(
    "cors",
    err instanceof Error ? err.message : "Network request failed.",
  );
}

/**
 * Stream a chat completion. `onDelta` is called with each text fragment as it
 * arrives. Resolves with the full assembled text.
 */
export async function streamChat(
  opts: ChatOptions,
  onDelta: (delta: string) => void,
): Promise<string> {
  if (!opts.baseUrl || !opts.model) {
    throw new ApiError("no-config", "No provider configured.");
  }

  let res: Response;
  try {
    res = await fetch(endpoint(opts.baseUrl), {
      method: "POST",
      headers: buildHeaders(opts.baseUrl, opts.apiKey),
      body: JSON.stringify({
        model: opts.model,
        messages: opts.messages,
        temperature: opts.temperature ?? 0.7,
        stream: true,
      }),
      signal: opts.signal,
    });
  } catch (err) {
    throw wrapFetchError(err);
  }

  if (!res.ok) throw await readError(res);
  if (!res.body) throw new ApiError("bad-response", "Empty response body.");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";

  const consume = (block: string) => {
    // An SSE block is one event; data may span several `data:` lines.
    for (const rawLine of block.split("\n")) {
      const line = rawLine.trim();
      if (!line || line.startsWith(":")) continue; // blank or comment/keep-alive
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (payload === "[DONE]") return true; // signal completion
      try {
        const json = JSON.parse(payload);
        const delta: unknown = json?.choices?.[0]?.delta?.content;
        if (typeof delta === "string" && delta.length) {
          full += delta;
          onDelta(delta);
        }
      } catch {
        // Partial or non-JSON line — ignore; the rest will arrive next read.
      }
    }
    return false;
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Process complete events (separated by a blank line). Keep the
      // trailing fragment in the buffer until more bytes arrive.
      let sep: number;
      while ((sep = buffer.indexOf("\n\n")) !== -1) {
        const block = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);
        if (consume(block)) return full;
      }
    }
    // Flush whatever is left (some servers omit the final blank line).
    buffer += decoder.decode();
    if (buffer.trim()) consume(buffer);
  } catch (err) {
    throw wrapFetchError(err);
  }

  return full;
}

/**
 * Non-streaming completion — used by the Curator, which needs the whole note
 * back at once before showing a preview.
 */
export async function complete(opts: ChatOptions): Promise<string> {
  if (!opts.baseUrl || !opts.model) {
    throw new ApiError("no-config", "No provider configured.");
  }
  let res: Response;
  try {
    res = await fetch(endpoint(opts.baseUrl), {
      method: "POST",
      headers: buildHeaders(opts.baseUrl, opts.apiKey),
      body: JSON.stringify({
        model: opts.model,
        messages: opts.messages,
        temperature: opts.temperature ?? 0.3,
        stream: false,
      }),
      signal: opts.signal,
    });
  } catch (err) {
    throw wrapFetchError(err);
  }
  if (!res.ok) throw await readError(res);
  let data: { choices?: { message?: { content?: string } }[] };
  try {
    data = await res.json();
  } catch {
    throw new ApiError("bad-response", "Could not parse provider response.");
  }
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new ApiError("bad-response", "Provider returned no message content.");
  }
  return content;
}
