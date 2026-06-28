import { clsx, type ClassValue } from "clsx";

/** Tailwind-friendly class concatenation. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/** Reasonably unique id without pulling in a uuid dependency. */
export function uid(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}

/** Resolve a public asset path, honouring a deployment basePath. */
export function asset(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
