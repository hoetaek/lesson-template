import { useState, type ReactNode } from "react";
import { Button } from "./Button";

export function Split({ children, side }: { children: ReactNode; side: ReactNode }) {
  return (
    <div className="split grid w-full min-w-0 grid-cols-1 items-center gap-6 canvas:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] flowing:contents">
      <div className="visual min-w-0 flowing:order-0">{children}</div>
      <div className="side grid min-w-0 gap-4 flowing:order-2 flowing:mt-5 flowing:border-t flowing:border-line flowing:pt-5">
        {side}
      </div>
    </div>
  );
}
export function Note({
  title,
  children,
  tone = "plain",
}: {
  title: string;
  children: ReactNode;
  tone?: "plain" | "warning" | "success";
}) {
  return (
    <div
      className={`note border-l-2 pl-5 ${tone === "warning" ? "border-amber" : tone === "success" ? "border-teal" : "border-line"}`}
    >
      <h3 className="mb-3 text-lg leading-snug">{title}</h3>
      <div className="text-base leading-relaxed">{children}</div>
    </div>
  );
}
export function Cards({ items }: { items: readonly { title: string; body: string }[] }) {
  return (
    <div className="cards grid w-full grid-cols-1 gap-5 sm:grid-cols-3 canvas:grid-cols-3">
      {items.map((item) => (
        <div className="concept border-t-2 border-teal bg-bg p-6" key={item.title}>
          <h3 className="mb-4 text-[22px]">{item.title}</h3>
          <p className="leading-relaxed">{item.body}</p>
        </div>
      ))}
    </div>
  );
}
export function Code({
  label,
  code,
  children,
}: {
  label: string;
  code: string;
  children?: ReactNode;
}) {
  const [status, setStatus] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("복사했어요");
    } catch {
      setStatus("코드를 선택해 복사해 주세요");
    }
  }
  return (
    <div className="code-block overflow-hidden rounded-lg bg-navy-strong text-white">
      <div className="flex items-center justify-between gap-3 border-b border-white/20 px-4 py-2 text-xs">
        <span>{label}</span>
        <button
          type="button"
          className="rounded border border-white/30 px-2 py-1 hover:bg-white/10"
          onClick={() => void copy()}
          aria-label={`${label} 복사`}
        >
          복사
        </button>
      </div>
      <pre className="p-5 font-mono text-sm leading-relaxed wrap-anywhere whitespace-pre-wrap canvas:text-base">
        <code>{code}</code>
      </pre>
      {children && <div className="border-t border-white/20 px-4 py-3 text-sm">{children}</div>}
      <span className="block px-4 text-xs" role="status">
        {status}
      </span>
    </div>
  );
}
export function Steps({ items }: { items: readonly ReactNode[] }) {
  return (
    <ol className="steps grid w-full gap-5">
      {items.map((item, i) => (
        <li className="flex items-start gap-4" key={i}>
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-band font-bold text-navy">
            {i + 1}
          </span>
          <div>{item}</div>
        </li>
      ))}
    </ol>
  );
}
export function External({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="hover:underline" href={href} target="_blank" rel="noreferrer">
      {children} ↗
    </a>
  );
}
export { Button };
