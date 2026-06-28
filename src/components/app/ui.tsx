"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/icon";

type ButtonVariant = "solid" | "outline" | "ghost";

export function Button({
  children,
  variant = "outline",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2 text-sm tracking-wide transition-colors disabled:opacity-40 disabled:pointer-events-none select-none";
  const variants: Record<ButtonVariant, string> = {
    solid: "bg-ink text-paper hover:opacity-90",
    outline: "border border-line-2 text-ink hover:bg-paper-2",
    ghost: "text-ink-2 hover:text-ink hover:bg-paper-2",
  };
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function IconButton({
  icon,
  label,
  size = 18,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconName;
  label: string;
  size?: number;
}) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-sm text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink disabled:opacity-40 disabled:pointer-events-none",
        className,
      )}
      {...props}
    >
      <Icon name={icon} size={size} />
    </button>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-[1.5px] border-current border-t-transparent",
        className,
      )}
      aria-hidden
    />
  );
}

export function Modal({
  open,
  onClose,
  children,
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  labelledBy?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/30 p-4 backdrop-blur-[2px] sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="nb-fade my-8 w-full max-w-lg rounded-sm border border-line-2 bg-paper shadow-2xl shadow-[var(--shadow)]"
      >
        {children}
      </div>
    </div>
  );
}
