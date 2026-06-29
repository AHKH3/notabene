"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useStore } from "./store";
import { useCurator } from "./curator-context";
import { Icon } from "@/components/icon";
import { Spinner } from "./ui";
import { renderMarkdown } from "@/lib/markdown";
import { errorText } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/* — Shared pane header with optional focus indicator — */
function PaneHeader({ label, focus }: { label: string; focus?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-line px-5 py-[7px]">
      <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-ink-3">
        {label}
      </span>
      <span
        className={cn(
          "inline-block h-1 w-1 rounded-full motion-safe:transition-colors motion-safe:duration-200",
          focus !== undefined
            ? focus
              ? "bg-ink/60"
              : "bg-ink-3/25"
            : "bg-ink-3/15",
        )}
      />
    </div>
  );
}

export function Note() {
  const { active, setNote, dict, settings, isConfigured, dir } = useStore();
  const curator = useCurator();
  const t = dict.app;

  const [previewTab, setPreviewTab] = useState<"proposed" | "current">("proposed");
  const [copied, setCopied] = useState(false);
  const [focus, setFocus] = useState(false);
  const [expandedPreview, setExpandedPreview] = useState(false);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const dragRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [splitRatio, setSplitRatio] = useState(0.5);

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

  /* — Draggable split: updates the writing‑pane ratio on pointer drag — */
  const onSplitDrag = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      let r = (clientX - rect.left) / rect.width;
      if (dir === "rtl") r = 1 - r;
      setSplitRatio(Math.min(Math.max(r, 0.25), 0.75));
    },
    [dir],
  );

  const resetSplit = useCallback(() => setSplitRatio(0.5), []);

  /* — Tab → 2‑space indent inside the textarea — */
  const onTextareaKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const val = ta.value;
        const newVal = val.slice(0, start) + "  " + val.slice(end);
        setNote(newVal);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 2;
        });
      }
    },
    [setNote],
  );

  /* — Track cursor line/col position — */
  const updateCursorPos = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const upTo = ta.value.slice(0, ta.selectionStart);
    const line = upTo.split("\n").length;
    const col = upTo.length - upTo.lastIndexOf("\n");
    setCursorPos({ line, col });
  }, []);

  /* — Toggle between split and full‑preview — */
  const togglePreviewMode = useCallback(() => {
    setExpandedPreview((p) => !p);
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col bg-paper">
      <header className="flex items-center gap-2 border-b border-line px-4 py-3">
        <Icon name="note" size={18} className="text-ink-2" />
        <h2 className="font-display text-base tracking-tight">{t.note}</h2>
        <span className="hidden text-xs text-ink-3 sm:inline">
          · <span dir="ltr">{note.length}</span>{" "}
          <span className="text-ink-3/50">ch</span>
        </span>
        <span className="text-xs text-ink-3">
          · {words} {words === 1 ? t.wordSingular : t.wordPlural}
        </span>
        {focus && note.trim() && (
          <span className="hidden text-xs text-ink-3/60 md:inline">
            · Ln {cursorPos.line}, Col {cursorPos.col}
          </span>
        )}
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
          <div
            ref={containerRef}
            className="flex h-full select-none flex-col md:flex-row"
          >
            {/* ---- Writing pane ---- */}
            {!expandedPreview && (
              <div
                className="relative flex min-h-0 flex-col overflow-hidden"
                style={{
                  flexBasis: `${splitRatio * 100}%`,
                  flexGrow: 0,
                  flexShrink: 0,
                }}
              >
                <PaneHeader label={t.writeTab} focus={focus} />
                <textarea
                  ref={textareaRef}
                  value={note}
                  disabled={!active}
                  onChange={(e) => setNote(e.target.value)}
                  onScroll={syncFromTextarea}
                  onFocus={() => setFocus(true)}
                  onBlur={() => setFocus(false)}
                  onKeyDown={onTextareaKeyDown}
                  onKeyUp={updateCursorPos}
                  onClick={updateCursorPos}
                  placeholder={t.notePlaceholder}
                  spellCheck={false}
                  className="ruled flex-1 resize-none bg-transparent px-5 py-[14px] font-serif text-[15px] leading-[1.85] text-ink outline-none placeholder:text-ink-3 selection:bg-ink selection:text-paper"
                  aria-label={t.writeTab}
                />
              </div>
            )}

            {/* ---- Draggable divider ---- */}
            {!expandedPreview && (
              <div
                onPointerDown={(e) => {
                  dragRef.current = true;
                  (e.target as HTMLElement).setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => {
                  if (dragRef.current) onSplitDrag(e.clientX);
                }}
                onPointerUp={() => {
                  dragRef.current = false;
                }}
                onDoubleClick={resetSplit}
                role="separator"
                aria-valuenow={Math.round(splitRatio * 100)}
                aria-valuemin={25}
                aria-valuemax={75}
                aria-label={dir === 'rtl' ? 'مُقسّم' : 'Splitter'}
                tabIndex={0}
                onKeyDown={(e) => {
                  const step = 0.05;
                  if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSplitRatio((r) => Math.max(r - step, 0.25));
                  }
                  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSplitRatio((r) => Math.min(r + step, 0.75));
                  }
                }}
                title={
                  dir === 'rtl'
                    ? 'اسحب لتغيير حجم الأقسام'
                    : 'Drag to resize panes'
                }
                className="group relative hidden shrink-0 cursor-col-resize select-none md:block motion-safe:transition-colors motion-safe:duration-150"
                style={{ width: 16 }}
              >
                {/* Vertical rule */}
                <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line" />
                {/* Center dot */}
                <div
                  className={cn(
                    "pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center motion-safe:transition-all motion-safe:duration-200",
                    focus ? "opacity-100" : "opacity-50",
                  )}
                >
                  <span className="flex h-2 w-2 items-center justify-center rounded-full border border-line-2 bg-paper transition-transform duration-200 group-hover:scale-125 group-focus-visible:scale-125">
                    <span className="block h-[1.5px] w-[1.5px] rounded-full bg-ink-3/60" />
                  </span>
                </div>
              </div>
            )}

            {/* ---- Preview pane ---- */}
            <div
              className="relative flex min-h-0 flex-1 flex-col overflow-hidden border-t border-line md:border-t-0"
              role="region"
              aria-label={t.readTab}
            >
              <div className="flex shrink-0 items-center gap-2 border-b border-line px-5 py-[7px]">
                <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-ink-3">
                  {t.readTab}
                </span>
                <span className="inline-block h-1 w-1 rounded-full bg-ink-3/15" />
                <span className="flex-1" />
                <button
                  onClick={togglePreviewMode}
                  aria-label={
                    expandedPreview
                      ? "Show writing pane"
                      : "Hide writing pane"
                  }
                  title={
                    expandedPreview
                      ? "Show writing pane"
                      : "Hide writing pane"
                  }
                  className="inline-flex h-5 w-5 items-center justify-center rounded-sm text-ink-3 hover:text-ink motion-safe:transition-colors motion-safe:duration-150"
                >
                  <Icon name={expandedPreview ? "eye" : "eyeOff"} size={13} strokeWidth={1.8} />
                </button>
              </div>
              <div
                ref={previewRef}
                onScroll={syncFromPreview}
                className="flex-1 overflow-y-auto px-5 py-[14px]"
              >
                {note.trim() ? (
                  <div
                    className="prose-nb"
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                  />
                ) : (
                  <p className="text-sm italic text-ink-3">{t.notePlaceholder}</p>
                )}
                {/* Ensure preview scrolls proportionally with textarea */}
                {note.trim() && <div className="h-px" aria-hidden />}
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
