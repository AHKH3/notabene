"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useStore } from "./store";
import { complete, ApiError, type ApiErrorCode } from "@/lib/openai";
import { buildCuratorMessages } from "@/lib/curator";
import type { ChatMessage } from "@/lib/types";

interface CuratorInput {
  messages: ChatMessage[];
  note: string;
}

interface CuratorState {
  curating: boolean;
  /** A proposed note awaiting the user's accept/discard. */
  proposal: string | null;
  error: ApiErrorCode | null;
  /** Set briefly when the Curator suggests nothing new. */
  unchanged: boolean;
  /** `override` lets a caller curate freshly-produced state (e.g. the reply
   *  that React hasn't committed to `active` yet) instead of stale context. */
  run: (autoApply?: boolean, override?: CuratorInput) => Promise<void>;
  accept: () => void;
  discard: () => void;
}

const Ctx = createContext<CuratorState | null>(null);

export function CuratorProvider({ children }: { children: React.ReactNode }) {
  const { active, settings, setNote } = useStore();
  const [curating, setCurating] = useState(false);
  const [proposal, setProposal] = useState<string | null>(null);
  const [error, setError] = useState<ApiErrorCode | null>(null);
  const [unchanged, setUnchanged] = useState(false);
  const unchangedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRef = useRef({ id: active?.id, ts: active?.updatedAt });

  // Discard any stale curator proposal when the conversation changes.
  useEffect(() => {
    if (!active) return;
    const prev = activeRef.current;
    if (prev.id !== active.id || prev.ts !== active.updatedAt) {
      setProposal(null);
      setError(null);
      setUnchanged(false);
      activeRef.current = { id: active.id, ts: active.updatedAt };
    }
  }, [active?.id, active?.updatedAt]);

  const run = useCallback(
    async (autoApply = false, override?: CuratorInput) => {
      const source = override ?? active;
      if (!source || curating) return;
      setError(null);
      setUnchanged(false);
      setCurating(true);
      try {
        const messages = buildCuratorMessages(source.messages, source.note);
        const model = settings.curatorModel.trim() || settings.model;
        const text = await complete({
          baseUrl: settings.baseUrl,
          apiKey: settings.apiKey,
          model,
          messages,
          temperature: 0.3,
        });
        const proposed = stripFences(text).trim();
        if (!proposed || proposed === source.note.trim()) {
          setUnchanged(true);
          if (unchangedTimer.current) clearTimeout(unchangedTimer.current);
          unchangedTimer.current = setTimeout(() => setUnchanged(false), 2600);
          return;
        }
        if (autoApply) setNote(proposed);
        else setProposal(proposed);
      } catch (err) {
        setError(err instanceof ApiError ? err.code : "unknown");
      } finally {
        setCurating(false);
      }
    },
    [active, curating, settings, setNote],
  );

  const accept = useCallback(() => {
    if (proposal !== null) setNote(proposal);
    setProposal(null);
  }, [proposal, setNote]);

  const discard = useCallback(() => setProposal(null), []);

  return (
    <Ctx.Provider
      value={{ curating, proposal, error, unchanged, run, accept, discard }}
    >
      {children}
    </Ctx.Provider>
  );
}

/** Models sometimes wrap the whole note in a ```markdown fence — strip it. */
function stripFences(text: string): string {
  const m = text.trim().match(/^```[a-zA-Z]*\n([\s\S]*?)\n?```\s*$/);
  return m ? m[1] : text;
}

export function useCurator(): CuratorState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCurator must be used within CuratorProvider");
  return ctx;
}
