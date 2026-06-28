"use client";

import { useState } from "react";
import { useStore } from "./store";
import { Button, Modal } from "./ui";
import { Icon } from "@/components/icon";
import { PROVIDERS, corsHint } from "@/lib/providers";
import type { Locale, ThemeMode } from "@/lib/types";
import { cn } from "@/lib/utils";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-[0.12em] text-ink-3">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1.5 block text-xs text-ink-3">{hint}</span> : null}
    </label>
  );
}

const inputClass =
  "w-full rounded-sm border border-line-2 bg-field px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-3 focus:border-ink";

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-sm border border-line-2 p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-[2px] px-3 py-1 text-sm transition-colors",
            value === o.value ? "bg-ink text-paper" : "text-ink-2 hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SettingsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { settings, updateSettings, dict, wipeEverything } = useStore();
  const t = dict.settings;
  const [showKey, setShowKey] = useState(false);

  const current =
    PROVIDERS.find((p) => p.baseUrl && p.baseUrl === settings.baseUrl) ??
    PROVIDERS.find((p) => p.id === "custom")!;
  const hint = corsHint(current.cors, settings.locale);

  const pickProvider = (id: string) => {
    const p = PROVIDERS.find((x) => x.id === id)!;
    updateSettings({
      baseUrl: p.baseUrl,
      model: p.suggestedModel || settings.model,
    });
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="settings-title">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2
          id="settings-title"
          className="font-display text-xl"
        >
          {t.title}
        </h2>
        <button
          aria-label={t.close}
          onClick={onClose}
          className="rounded-sm p-1 text-ink-2 hover:bg-paper-2 hover:text-ink"
        >
          <Icon name="close" size={20} />
        </button>
      </div>

      <div className="max-h-[70vh] space-y-5 overflow-y-auto px-5 py-5">
        <Field label={t.provider}>
          <div className="flex flex-wrap gap-1.5">
            {PROVIDERS.map((p) => (
              <button
                key={p.id}
                onClick={() => pickProvider(p.id)}
                className={cn(
                  "rounded-sm border px-2.5 py-1 text-xs transition-colors",
                  current.id === p.id
                    ? "border-ink bg-ink text-paper"
                    : "border-line-2 text-ink-2 hover:border-ink hover:text-ink",
                )}
              >
                {p.name}
              </button>
            ))}
          </div>
        </Field>

        <Field label={t.baseUrl}>
          <input
            className={inputClass}
            dir="ltr"
            spellCheck={false}
            placeholder="https://openrouter.ai/api/v1"
            value={settings.baseUrl}
            onChange={(e) => updateSettings({ baseUrl: e.target.value })}
          />
        </Field>

        <Field
          label={t.apiKey}
          hint={
            <span className="flex flex-wrap items-center gap-x-2">
              {t.apiKeyHint}
              {current.keyUrl ? (
                <a
                  href={current.keyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-rule inline-flex items-center gap-0.5 text-ink-2"
                >
                  {t.getKey}
                  <Icon name="external" size={12} />
                </a>
              ) : null}
            </span>
          }
        >
          <div className="relative">
            <input
              className={cn(inputClass, "pe-10")}
              dir="ltr"
              type={showKey ? "text" : "password"}
              autoComplete="off"
              spellCheck={false}
              placeholder="sk-…"
              value={settings.apiKey}
              onChange={(e) => updateSettings({ apiKey: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowKey((s) => !s)}
              className="absolute inset-y-0 end-2 my-auto flex h-7 w-7 items-center justify-center rounded-sm text-ink-3 hover:text-ink"
              aria-label={showKey ? "Hide" : "Show"}
            >
              <Icon name={showKey ? "info" : "search"} size={16} />
            </button>
          </div>
        </Field>

        {hint ? (
          <div className="flex items-start gap-2 rounded-sm border border-line-2 bg-paper-2 px-3 py-2.5 text-xs text-ink-2">
            <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
            <span>{hint}</span>
          </div>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t.model}>
            <input
              className={inputClass}
              dir="ltr"
              spellCheck={false}
              value={settings.model}
              onChange={(e) => updateSettings({ model: e.target.value })}
            />
          </Field>
          <Field label={t.curatorModel} hint={t.curatorModelHint}>
            <input
              className={inputClass}
              dir="ltr"
              spellCheck={false}
              placeholder={t.sameAsChat}
              value={settings.curatorModel}
              onChange={(e) => updateSettings({ curatorModel: e.target.value })}
            />
          </Field>
        </div>

        <Field label={`${t.temperature} · ${settings.temperature.toFixed(1)}`}>
          <input
            type="range"
            min={0}
            max={1.5}
            step={0.1}
            value={settings.temperature}
            onChange={(e) =>
              updateSettings({ temperature: Number(e.target.value) })
            }
            className="w-full accent-[var(--ink)]"
          />
        </Field>

        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-sm border border-line-2 px-3 py-2.5">
          <span className="text-sm text-ink">{t.autoCurate}</span>
          <input
            type="checkbox"
            checked={settings.autoCurate}
            onChange={(e) => updateSettings({ autoCurate: e.target.checked })}
            className="h-4 w-4 accent-[var(--ink)]"
          />
        </label>

        <div className="border-t border-line pt-5">
          <span className="mb-3 block text-xs uppercase tracking-[0.12em] text-ink-3">
            {t.appearance}
          </span>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink-2">{t.theme}</span>
              <Segmented<ThemeMode>
                value={settings.theme}
                onChange={(theme) => updateSettings({ theme })}
                options={[
                  { value: "light", label: t.light },
                  { value: "dark", label: t.dark },
                  { value: "system", label: t.system },
                ]}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink-2">{t.language}</span>
              <Segmented<Locale>
                value={settings.locale}
                onChange={(locale) => updateSettings({ locale })}
                options={[
                  { value: "en", label: "English" },
                  { value: "ar", label: "العربية" },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-line pt-4">
          <button
            onClick={() => {
              if (window.confirm(t.clearAllConfirm)) wipeEverything();
            }}
            className="inline-flex items-center gap-2 text-xs text-ink-3 hover:text-ink"
          >
            <Icon name="delete" size={14} />
            {t.clearAll}
          </button>
        </div>
      </div>

      <div className="flex justify-end border-t border-line px-5 py-4">
        <Button variant="solid" onClick={onClose}>
          {t.save}
        </Button>
      </div>
    </Modal>
  );
}
