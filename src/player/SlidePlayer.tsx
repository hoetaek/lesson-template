import { useEffect, useEffectEvent, useRef, useState } from "react";
import type { Slide } from "../domain/lesson";
import { advance } from "../domain/timeline";
import { MotionContext } from "./context";
import { useReducedMotion } from "./useMedia";
import { Button } from "../components/Button";

const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
const segmenter = new Intl.Segmenter("ko", { granularity: "sentence" });

export function SlidePlayer({
  slide,
  index,
  sceneIndex,
  active,
  canvas,
  continuous,
  speed,
  onContinuous,
  onSpeed,
  onScene,
  onNext,
  onPrevious,
}: {
  slide: Slide;
  index: number;
  sceneIndex: number;
  active: boolean;
  canvas: boolean;
  continuous: boolean;
  speed: number;
  onContinuous: () => void;
  onSpeed: (speed: number) => void;
  onScene: (index: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}) {
  const scene = slide.scenes[sceneIndex] ?? slide.scenes[0];
  return (
    <article
      className="lesson-frame group/slide flex min-w-0 flex-col bg-surface px-4 py-5 sm:px-6 canvas:h-full canvas:px-10 canvas:py-6"
      data-canvas={canvas}
      data-slide={slide.id}
      aria-label={slide.title}
    >
      <header className="slide-head mb-5 flex items-baseline gap-3">
        <h1 className="text-2xl leading-snug tracking-tight text-heading canvas:text-[28px]">
          <span className="mr-3 text-accent">{index + 1}</span>
          {slide.title}
        </h1>
      </header>
      <ScenePlayback
        key={`${scene.id}/${active}`}
        {...{
          slide,
          sceneIndex,
          active,
          continuous,
          speed,
          onContinuous,
          onSpeed,
          onScene,
          onNext,
          onPrevious,
        }}
      />
    </article>
  );
}

function ScenePlayback({
  slide,
  sceneIndex,
  active,
  continuous,
  speed,
  onContinuous,
  onSpeed,
  onScene,
  onNext,
  onPrevious,
}: Omit<Parameters<typeof SlidePlayer>[0], "index" | "canvas">) {
  const scene = slide.scenes[sceneIndex] ?? slide.scenes[0];
  const duration = scene.duration ?? 5500;
  const reduced = useReducedMotion();
  const [time, setTime] = useState(reduced || scene.waits || !active ? duration : 0);
  const [playing, setPlaying] = useState(!reduced && !scene.waits && active);
  const [speedOpen, setSpeedOpen] = useState(false);
  const speedMenu = useRef<HTMLDivElement>(null);
  const current = useRef(time);
  const next = useEffectEvent(() => onNext?.());
  useEffect(() => {
    if (!playing || !active || reduced) return;
    let frame = 0;
    let last: number | undefined;
    const tick = (now: number) => {
      current.current = advance(
        current.current,
        last === undefined ? 0 : now - last,
        speed,
        duration,
      );
      last = now;
      setTime(current.current);
      if (current.current >= duration) setPlaying(false);
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, playing, duration, speed, reduced]);
  useEffect(() => {
    if (time < duration || playing || !active || !continuous || scene.waits || reduced) return;
    const id = setTimeout(() => next(), 900);
    return () => clearTimeout(id);
  }, [time, duration, playing, active, continuous, scene.waits, reduced]);
  useEffect(() => {
    if (!speedOpen) return;
    const pointer = (e: PointerEvent) => {
      if (!speedMenu.current?.contains(e.target as Node)) setSpeedOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setSpeedOpen(false);
        speedMenu.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", pointer);
    document.addEventListener("keydown", key, true);
    return () => {
      document.removeEventListener("pointerdown", pointer);
      document.removeEventListener("keydown", key, true);
    };
  }, [speedOpen]);
  const progress = reduced ? 1 : time / duration;
  const toggle = () => {
    if (!active) {
      onScene(sceneIndex);
      return;
    }
    if (time >= duration) {
      current.current = 0;
      setTime(0);
      setPlaying(true);
    } else setPlaying(!playing);
  };
  const previousLabel = sceneIndex > 0 ? "이전 장면" : "이전 슬라이드";
  const nextLabel = sceneIndex < slide.scenes.length - 1 ? "다음 장면" : "다음 슬라이드";
  return (
    <div className="play-stage flex min-h-0 flex-1 flex-col">
      <MotionContext.Provider value={progress}>
        <div
          className="scene-body flex min-h-0 flex-1 items-center py-4 flowing:contents [&>*]:w-full"
          data-scene={scene.id}
        >
          {scene.content}
        </div>
      </MotionContext.Provider>
      <div className="timeline-bar mt-3 grid gap-1 flowing:order-1">
        <div
          className="caption mb-3 min-h-[3.2em] text-center text-lg leading-[1.6] text-balance sm:text-[22px] canvas:text-[26px]"
          aria-live={active ? "polite" : "off"}
        >
          {[...segmenter.segment(scene.caption)].map((part, i) => (
            <p className="m-0!" key={i}>
              {part.segment.trim()}
            </p>
          ))}
        </div>
        <div className="timeline-row flex min-w-0 flex-col items-stretch gap-2 sm:flex-row sm:items-end sm:gap-4 canvas:flex-row canvas:items-end canvas:gap-4 presenting:pr-[180px]">
          <ol
            className="timeline-chapters order-0 flex min-w-0 flex-1 gap-[3px] sm:order-1 canvas:order-1"
            aria-label="장면"
          >
            {slide.scenes.map((s, i) => (
              <li key={s.id} className="min-w-0 flex-1">
                <button
                  type="button"
                  data-scene-id={s.id}
                  aria-label={s.label}
                  aria-current={i === sceneIndex ? "step" : undefined}
                  title={s.label}
                  onClick={() => onScene(i)}
                  className={`group/scene relative block min-h-11 w-full rounded-none pt-1 pb-3 text-left text-xs font-semibold aria-[current=step]:font-extrabold aria-[current=step]:underline aria-[current=step]:decoration-2 aria-[current=step]:underline-offset-4 ${i >= slide.scenes.length / 2 ? "max-sm:aria-[current=step]:flex max-sm:aria-[current=step]:items-center max-sm:aria-[current=step]:justify-end" : ""} ${s.waits ? "text-amber" : i === sceneIndex ? "text-accent" : "text-muted"}`}
                >
                  <span
                    aria-hidden="true"
                    className="timeline-label block truncate pb-1 group-aria-[current=step]/scene:underline group-aria-[current=step]/scene:decoration-2 group-aria-[current=step]/scene:underline-offset-2 max-sm:invisible max-sm:group-aria-[current=step]/scene:visible max-sm:group-aria-[current=step]/scene:shrink-0 max-sm:group-aria-[current=step]/scene:overflow-visible canvas:visible"
                  >
                    {s.waits ? "◇ " : ""}
                    {s.label}
                  </span>
                  <span
                    className={`absolute inset-x-0 bottom-0.5 h-1 rounded-full ${s.waits ? "bg-amber-line" : "bg-line"}`}
                  />
                  <span
                    className={`absolute inset-x-0 bottom-0.5 h-1 origin-left rounded-full ${s.waits ? "bg-amber" : "bg-accent"}`}
                    style={{
                      transform: `scaleX(${i < sceneIndex ? 1 : i === sceneIndex ? progress : 0})`,
                    }}
                  />
                </button>
              </li>
            ))}
          </ol>
          <div
            className="timeline-buttons relative flex shrink-0 items-end gap-1"
            role="group"
            aria-label="재생 조작"
          >
            <Button
              className="w-11 px-0"
              onClick={onPrevious}
              disabled={!onPrevious}
              aria-label={previousLabel}
              title={previousLabel}
            >
              <NavIcon back slide={sceneIndex === 0} />
            </Button>
            <Button
              className="w-11 px-0"
              onClick={toggle}
              aria-label={playing && active && !reduced ? "재생 멈추기" : "장면 재생"}
              title={playing ? "멈춤" : "재생"}
            >
              {playing && active && !reduced ? "Ⅱ" : progress >= 1 ? "↻" : "▶"}
            </Button>
            <Button
              tone={nextLabel === "다음 슬라이드" ? "primary" : "outline"}
              className="w-11 px-0"
              onClick={onNext}
              disabled={!onNext}
              aria-label={nextLabel}
              title={nextLabel}
            >
              <NavIcon slide={sceneIndex === slide.scenes.length - 1} />
            </Button>
            <div ref={speedMenu} className="relative">
              <Button
                className="min-w-15 tabular-nums"
                aria-label="재생 속도"
                aria-expanded={speedOpen}
                onClick={() => setSpeedOpen(!speedOpen)}
              >
                {speed}×
              </Button>
              {speedOpen && (
                <div
                  className="absolute bottom-full left-0 z-20 mb-2 grid min-w-24 gap-1 rounded-lg border border-line bg-surface p-1 shadow-lg"
                  role="group"
                  aria-label="재생 속도 선택"
                >
                  {speeds.map((s) => (
                    <button
                      type="button"
                      key={s}
                      aria-pressed={speed === s}
                      className="min-h-9 rounded px-4 text-sm text-navy hover:bg-band aria-pressed:bg-accent-soft aria-pressed:font-bold aria-pressed:text-accent"
                      onClick={() => {
                        onSpeed(s);
                        setSpeedOpen(false);
                      }}
                    >
                      {s}×
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              className="ml-2 text-xs aria-pressed:border-accent aria-pressed:bg-accent-soft aria-pressed:text-accent canvas:ml-5"
              aria-pressed={continuous}
              onClick={onContinuous}
            >
              연속 재생
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavIcon({ back = false, slide = false }: { back?: boolean; slide?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={back ? "-scale-x-100" : undefined}
    >
      {slide ? (
        <>
          <path d="M6 3h9l5 5v13H6v-4M15 3v6h5" />
          <path d="M3 13h11m-4-4 4 4-4 4" />
        </>
      ) : (
        <>
          <path d="m5 5 10 7-10 7Z" fill="currentColor" />
          <path d="M19 5v14" />
        </>
      )}
    </svg>
  );
}
