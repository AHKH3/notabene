"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "./store";
import { useCurator } from "./curator-context";
import { Icon } from "@/components/icon";
import { Spinner } from "./ui";
import { renderMarkdown } from "@/lib/markdown";
import { streamChat, ApiError, type ApiErrorCode } from "@/lib/openai";
import { errorText } from "@/lib/i18n";
import type { ChatMessage } from "@/lib/types";
import { uid } from "@/lib/utils";
import { cn } from "@/lib/utils";

function Bubble({
  message,
  isArabic,
}: {
  message: ChatMessage;
  isArabic: boolean;
}) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
      <span className="px-1 text-[10px] uppercase tracking-[0.16em] text-ink-3">
        {isUser ? (isArabic ? "أنت" : "You") : (isArabic ? "الذكاء" : "AI")}
      </span>
      <div
        className={cn(
          "max-w-[88%] rounded-sm px-4 py-3 text-[15px] leading-relaxed",
          isUser
            ? "whitespace-pre-wrap bg-paper-2 text-ink"
            : "border border-line bg-paper text-ink",
          message.error && "border-line-2 text-ink-2",
        )}
      >
        {isUser ? (
          message.content
        ) : (
          <div
            className="prose-nb"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
          />
        )}
      </div>
    </div>
  );
}

export function Chat() {
  const { active, settings, setMessages, dict, isConfigured } = useStore();
  const curator = useCurator();
  const t = dict.app;
  const isArabic = settings.locale === "ar";

  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [error, setError] = useState<ApiErrorCode | null>(null);
  const streamRef = useRef("");
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const messages = active?.messages ?? [];

  // Auto-scroll to the latest content.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, streamText, streaming]);

  // Auto-grow the textarea.
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [input]);

  async function run(history: ChatMessage[]) {
    setStreaming(true);
    setStreamText("");
    streamRef.current = "";
    setError(null);
    const controller = new AbortController();
    abortRef.current = controller;
    const wire = history
      .filter((m) => !m.error && m.content.trim())
      .map((m) => ({ role: m.role, content: m.content }));
    try {
      const full = await streamChat(
        {
          baseUrl: settings.baseUrl,
          apiKey: settings.apiKey,
          model: settings.model,
          temperature: settings.temperature,
          messages: wire,
          signal: controller.signal,
        },
        (delta) => {
          streamRef.current += delta;
          setStreamText(streamRef.current);
        },
      );
      const assistant: ChatMessage = {
        id: uid(),
        role: "assistant",
        content: full,
        createdAt: Date.now(),
      };
      const updated = [...history, assistant];
      setMessages(updated);
      if (settings.autoCurate) {
        void curator.run(true, { messages: updated, note: active?.note ?? "" });
      }
    } catch (err) {
      const code = err instanceof ApiError ? err.code : "unknown";
      if (code === "aborted") {
        const partial = streamRef.current.trim();
        if (partial) {
          setMessages([
            ...history,
            { id: uid(), role: "assistant", content: partial, createdAt: Date.now() },
          ]);
        }
      } else {
        setError(code);
      }
    } finally {
      setStreaming(false);
      setStreamText("");
      streamRef.current = "";
      abortRef.current = null;
    }
  }

  function send() {
    const content = input.trim();
    if (!content || streaming || !active) return;
    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      content,
      createdAt: Date.now(),
    };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    void run(history);
  }

  function stop() {
    abortRef.current?.abort();
  }

  function regenerate() {
    if (streaming || messages.length === 0) return;
    // Drop trailing assistant messages, re-run from the last user turn.
    let end = messages.length;
    while (end > 0 && messages[end - 1].role === "assistant") end--;
    const history = messages.slice(0, end);
    if (history.length === 0) return;
    setMessages(history);
    setError(null);
    void run(history);
  }

  const showEmpty = messages.length === 0 && !streaming;

  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex items-center gap-2 border-b border-line px-4 py-3">
        <Icon name="quill" size={18} className="text-ink-2" />
        <h2 className="font-display text-base tracking-tight">{t.chat}</h2>
        <span className="flex-1" />
        {messages.some((m) => m.role === "assistant") && !streaming ? (
          <button
            onClick={regenerate}
            className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs text-ink-3 hover:bg-paper-2 hover:text-ink"
          >
            <Icon name="regenerate" size={14} />
            {t.regenerate}
          </button>
        ) : null}
      </header>

      <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
        {showEmpty ? (
          <div className="mx-auto flex h-full max-w-md flex-col items-center justify-center text-center">
            <Icon name="quill" size={30} className="mb-4 text-ink-3" />
            <h3 className="font-display text-xl">{t.chatEmptyTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">
              {t.chatEmptyBody}
            </p>
          </div>
        ) : (
          messages.map((m) => <Bubble key={m.id} message={m} isArabic={isArabic} />)
        )}

        {streaming ? (
          <div className="flex flex-col items-start gap-1">
            <span className="px-1 text-[10px] uppercase tracking-[0.16em] text-ink-3">
              {isArabic ? "الذكاء" : "AI"}
            </span>
            <div className="max-w-[88%] rounded-sm border border-line bg-paper px-4 py-3 text-[15px] leading-relaxed text-ink">
              {streamText ? (
                <div
                  className="prose-nb nb-caret"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(streamText) }}
                />
              ) : (
                <span className="inline-flex items-center gap-2 text-ink-3">
                  <Spinner /> {t.thinking}
                </span>
              )}
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="flex items-start gap-2 rounded-sm border border-line-2 bg-paper-2 px-3 py-2.5 text-sm text-ink-2">
            <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
            <div className="flex-1">
              <p>{errorText(error, settings.locale)}</p>
              <button
                onClick={regenerate}
                className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-ink hover:underline"
              >
                <Icon name="regenerate" size={13} /> {t.retry}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-line px-3 py-3">
        <div className="flex items-end gap-2 rounded-sm border border-line-2 bg-field px-2 py-1.5 focus-within:border-ink">
          <textarea
            ref={taRef}
            rows={1}
            value={input}
            disabled={!active}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={t.chatPlaceholder}
            className="max-h-[200px] flex-1 resize-none bg-transparent px-2 py-1.5 text-[15px] outline-none placeholder:text-ink-3"
          />
          {streaming ? (
            <button
              onClick={stop}
              aria-label={t.stop}
              title={t.stop}
              className="mb-0.5 inline-flex h-9 w-9 items-center justify-center rounded-sm bg-ink text-paper hover:opacity-90"
            >
              <Icon name="stop" size={16} />
            </button>
          ) : (
            <button
              onClick={send}
              disabled={!input.trim() || !active}
              aria-label={t.send}
              title={t.send}
              className="mb-0.5 inline-flex h-9 w-9 items-center justify-center rounded-sm bg-ink text-paper transition-opacity hover:opacity-90 disabled:opacity-30"
            >
              <Icon name="send" size={16} className={isArabic ? "-scale-x-100" : ""} />
            </button>
          )}
        </div>
        {!isConfigured ? (
          <p className="mt-1.5 px-1 text-xs text-ink-3">{t.connectBody}</p>
        ) : null}
      </div>
    </div>
  );
}
