"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useStore } from "./store";
import { useCurator } from "./curator-context";
import { Icon } from "@/components/icon";
import { Spinner } from "./ui";
import { renderMarkdown } from "@/lib/markdown";
import { errorText } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function Note() {
  const { active, setNote, dict, settings, isConfigured } = useStore();
  const curator = useCurator();
  const t = dict.app;

  const [previewTab, setPreviewTab] = useState<"proposed" | "current">("proposed");
  const [copied, setCopied] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const isSyncing = useRef(false);

  const note = active?.note ?? "";
  const words = note.trim() ? note.trim().split(/\s+/).length : 0;
  const canCurate =
    isConfigured && !curator.curating && (active?.messages.length ?? 0) > 0;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(note);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked */
    }
  };

  const inPreview = curator.proposal !== null;

  /* — Synced scrolling between textarea and preview — */
  const syncFromTextarea = useCallback(() => {
    const ta = textareaRef.current;
    const pv = previewRef.current;
    if (!ta || !pv || isSyncing.current) return;
    isSyncing.current = true;
    const ratio =
      ta.scrollHeight > ta.clientHeight
        ? ta.scrollTop / (ta.scrollHeight - ta.clientHeight)
        : 0;
    pv.scrollTop = ratio * (pv.scrollHeight - pv.clientHeight);
    requestAnimationFrame(() => {
      isSyncing.current = false;
    });
  }, []);

  const syncFromPreview = useCallback(() => {
    const ta = textareaRef.current;
    const pv = previewRef.current;
    if (!ta || !pv || isSyncing.current) return;
    isSyncing.current = true;
    const ratio =
      pv.scrollHeight > pv.clientHeight
        ? pv.scrollTop / (pv.scrollHeight - pv.clientHeight)
        : 0;
    ta.scrollTop = ratio * (ta.scrollHeight - ta.clientHeight);
    requestAnimationFrame(() => {
      isSyncing.current = false;
    });
  }, []);

  /* — Memoised Markdown render — */
  const renderedHtml = useMemo(() => renderMarkdown(note), [note]);

  return (
    <div className="relative flex h-full w-full flex-col bg-paper">
      <header className="flex items-center gap-2 border-b border-line px-4 py-3">
        <Icon name="note" size={18} className="text-ink-2" />
        <h2 className="font-display text-base tracking-tight">{t.note}</h2>
        <span className="text-xs text-ink-3">· {words} {words === 1 ? t.wordSingular : t.wordPlural}</span>
        <span className="flex-1" />

        <button
          onClick={copy}
          aria-label={t.copyNote}
          title={t.copyNote}
          className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-ink-3 hover:bg-paper-2 hover:text-ink"
        >
          <Icon name={copied ? "check" : "copy"} size={16} />
        </button>
        <button
          onClick={() => {
            if (note.trim() && !window.confirm(t.clearNoteConfirm)) return;
            setNote("");
          }}
          aria-label={t.clearNote}
          title={t.clearNote}
          className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-ink-3 hover:bg-paper-2 hover:text-ink"
        >
          <Icon name="eraser" size={16} />
        </button>
      </header>

      {/* Body */}
      <div className="relative flex-1 overflow-hidden">
        {inPreview ? (
          /* ---- Curator proposal preview ---- */
          <div className="flex h-full flex-col">
            <div className="border-b border-line bg-paper-2 px-4 py-2.5">
              <p className="text-xs leading-relaxed text-ink-2">
                {t.curatePreviewBody}
              </p>
              <div className="mt-2 inline-flex rounded-sm border border-line p-0.5 text-xs">
                <button
                  onClick={() => setPreviewTab("proposed")}
                  className={cn(
                    "rounded-[2px] px-2 py-0.5",
                    previewTab === "proposed"
                      ? "bg-ink text-paper"
                      : "text-ink-3 hover:text-ink",
                  )}
                >
                  {t.curatePreviewTitle}
                </button>
                <button
                  onClick={() => setPreviewTab("current")}
                  className={cn(
                    "rounded-[2px] px-2 py-0.5",
                    previewTab === "current"
                      ? "bg-ink text-paper"
                      : "text-ink-3 hover:text-ink",
                  )}
                >
                  {t.currentTab}
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div
                className="prose-nb"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(
                    previewTab === "proposed" ? curator.proposal ?? "" : note,
                  ),
                }}
              />
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-line px-4 py-3">
              <button
                onClick={curator.discard}
                className="inline-flex items-center gap-2 rounded-sm border border-line-2 px-4 py-2 text-sm text-ink hover:bg-paper-2"
              >
                <Icon name="close" size={15} />
                {t.discard}
              </button>
              <button
                onClick={curator.accept}
                className="inline-flex items-center gap-2 rounded-sm bg-ink px-4 py-2 text-sm text-paper hover:opacity-90"
              >
                <Icon name="check" size={15} />
                {t.replaceNote}
              </button>
            </div>
          </div>
        ) : (
          /* ---- Unified mode: write + live preview side by side ---- */
          <div className="flex h-full flex-col md:flex-row">
            {/* ---- Textarea ---- */}
            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden border-b border-line md:border-b-0 md:border-e">
              <div className="flex items-center justify-between border-b border-line px-4 py-1.5">
                <span className="text-[10px] uppercase tracking-[0.12em] text-ink-3">
                  {t.writeTab}
                </span>
              </div>
              <textarea
                ref={textareaRef}
                value={note}
                disabled={!active}
                onChange={(e) => setNote(e.target.value)}
                onScroll={syncFromTextarea}
                placeholder={t.notePlaceholder}
                spellCheck={false}
                className="ruled flex-1 resize-none bg-transparent px-5 py-4 font-serif text-[15px] leading-[1.85] text-ink outline-none placeholder:text-ink-3"
              />
            </div>

            {/* ---- Live preview ---- */}
            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-4 py-1.5">
                <span className="text-[10px] uppercase tracking-[0.12em] text-ink-3">
                  {t.readTab}
                </span>
              </div>
              <div
                ref={previewRef}
                onScroll={syncFromPreview}
                className="flex-1 overflow-y-auto px-5 py-4"
              >
                {note.trim() ? (
                  <div
                    className="prose-nb"
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                  />
                ) : (
                  <p className="text-sm italic text-ink-3">{t.notePlaceholder}</p>
                )}
                {/* Invisible sentinel so the preview scrolls proportionally
                    with the textarea even when content is short */}
                {note.trim() && (
                  <div className="h-px" aria-hidden />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Curate action bar */}
      {!inPreview ? (
        <div className="border-t border-line px-4 py-3">
          {curator.error ? (
            <p className="mb-2 flex items-center gap-2 text-xs text-ink-2">
              <Icon name="alert" size={14} />
              {errorText(curator.error, settings.locale)}
            </p>
          ) : null}
          {curator.unchanged ? (
            <p className="mb-2 flex items-center gap-2 text-xs text-ink-3">
              <Icon name="info" size={14} />
              {t.noChanges}
            </p>
          ) : null}
          <button
            onClick={() => curator.run(false)}
            disabled={!canCurate}
            className="flex w-full items-center justify-center gap-2 rounded-sm bg-ink px-4 py-2.5 text-sm tracking-wide text-paper transition-opacity hover:opacity-90 disabled:opacity-30"
          >
            {curator.curating ? (
              <>
                <Spinner /> {t.curating}
              </>
            ) : (
              <>
                <Icon name="curate" size={17} /> {t.curate}
              </>
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}
