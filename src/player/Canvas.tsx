import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export function Canvas({
  children,
  presentation = false,
  fit = false,
}: {
  children: ReactNode;
  presentation?: boolean;
  fit?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ scale: 1, height: 720 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const widthScale = el.clientWidth / 1280;
      const main = el.closest("main");
      const footer = main?.querySelector(".pager")?.getBoundingClientRect().height ?? 0;
      const notices = [...(main?.querySelectorAll(".resume, .storage-warning") ?? [])].reduce(
        (height, notice) => height + notice.getBoundingClientRect().height,
        0,
      );
      const available = presentation
        ? el.clientHeight
        : (main?.clientHeight ?? 720) - footer - notices - 8;
      const scale =
        presentation || fit ? Math.min(widthScale, Math.max(0, available) / 720) : widthScale;
      setSize({ scale, height: scale * 720 });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    if (fit && el.closest("main")) observer.observe(el.closest("main")!);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [presentation, fit]);
  return (
    <div
      ref={ref}
      className={
        presentation
          ? "canvas-viewport relative grid h-dvh w-full place-items-center overflow-hidden bg-ink"
          : "canvas-viewport relative w-full"
      }
      style={presentation ? undefined : { height: size.height }}
    >
      <div
        className={`canvas-inner absolute h-[720px] w-[1280px] bg-surface ${presentation ? "origin-center" : "top-0 left-1/2 origin-top"}`}
        style={
          {
            transform: `${presentation ? "" : "translateX(-50%) "}scale(${size.scale})`,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </div>
  );
}
