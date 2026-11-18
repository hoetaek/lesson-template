import type { ButtonHTMLAttributes } from "react";

export function Button({
  tone = "outline",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "outline" | "quiet" | "primary" }) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors motion-reduce:transition-none ${tone === "primary" ? "border border-accent bg-accent text-white hover:bg-cobalt-strong" : tone === "quiet" ? "border border-transparent text-muted hover:bg-band hover:text-navy" : "border border-line bg-surface text-navy hover:bg-band"} ${className}`}
    />
  );
}
