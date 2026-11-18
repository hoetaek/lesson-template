import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import type { Lesson } from "../domain/lesson";
import { isText } from "../domain/storage";
import { LessonContext, load, save } from "./context";
import { Canvas } from "./Canvas";
import { SlidePlayer } from "./SlidePlayer";
import { useWide } from "./useMedia";
import { Button } from "../components/Button";

type View = "one" | "all";
const isView = (v: unknown): v is View => v === "one" || v === "all";
const isBoolean = (v: unknown): v is boolean => typeof v === "boolean";
const isSpeed = (v: unknown): v is number =>
  typeof v === "number" && [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].includes(v);

export default function Player({ lesson }: { lesson: Lesson }) {
  const { activityId, slideId } = useParams();
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const wide = useWide();
  const prefix = `lesson:${new URL(import.meta.env.BASE_URL, window.location.href).pathname}:${lesson.id}:v1`;
  const [view, setView] = useState<View>(() => load(`${prefix}:view`, "one", isView));
  const [desktopOpen, setDesktopOpen] = useState(() => load(`${prefix}:nav`, false, isBoolean));
  const [mobileOpen, setMobileOpen] = useState(false);
  const open = wide ? desktopOpen : mobileOpen;
  const [presentation, setPresentation] = useState(false);
  const [continuous, setContinuous] = useState(() =>
    load(`${prefix}:continuous`, false, isBoolean),
  );
  const [speed, setSpeed] = useState(() => load(`${prefix}:speed`, 1, isSpeed));
  const [resume, setResume] = useState(() => load(`${prefix}:position`, "", isText));
  const [storageFailed, setStorageFailed] = useState(false);
  const settings = useRef<HTMLDialogElement>(null);
  const reset = useRef<HTMLDialogElement>(null);
  const content = useRef<HTMLElement>(null);
  const entries = lesson.activities.flatMap((activity) =>
    activity.slides.map((slide) => ({ activity, slide })),
  );
  const selected = entries.findIndex((e) => e.activity.id === activityId && e.slide.id === slideId);
  const [observed, setObserved] = useState(Math.max(0, selected));
  const first = entries[0]!;
  const firstPath = `/${first.activity.id}/${first.slide.id}`;
  const entry = entries[selected];
  const validEntry = !!entry;
  const [contentWidth, setContentWidth] = useState(0);
  const canvasLayout = wide && contentWidth >= 1152;
  useEffect(() => {
    const el = content.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setContentWidth(el.clientWidth));
    observer.observe(el);
    return () => observer.disconnect();
  }, [validEntry]);
  const sceneIndex = entry
    ? Math.max(
        0,
        entry.slide.scenes.findIndex((s) => s.id === search.get("scene")),
      )
    : 0;
  const showAll = view === "all" && !presentation;
  const seenIndex = showAll ? observed : selected;
  const seen = entries[seenIndex] ?? entry;
  const go = (index: number, at = 0) => {
    const target = entries[index];
    if (!target) return;
    navigate(
      `/${target.activity.id}/${target.slide.id}?scene=${target.slide.scenes[at]?.id ?? target.slide.scenes[0].id}`,
    );
    setMobileOpen(false);
  };
  const next = (index = selected, at = sceneIndex) => {
    const target = entries[index];
    if (!target) return;
    if (at < target.slide.scenes.length - 1) go(index, at + 1);
    else go(index + 1);
  };
  const previous = (index = selected, at = sceneIndex) => {
    if (at > 0) go(index, at - 1);
    else if (index > 0) go(index - 1, entries[index - 1]!.slide.scenes.length - 1);
  };
  const stopPresentation = () => {
    setPresentation(false);
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
  };
  const startPresentation = () => {
    if (showAll && observed !== selected) go(observed);
    setPresentation(true);
    void document.documentElement.requestFullscreen?.().catch(() => {});
  };
  const changeView = (value: View) => {
    if (showAll && observed !== selected) go(observed);
    setView(value);
    save(`${prefix}:view`, value);
  };
  const toggleNav = () => {
    if (wide) {
      setDesktopOpen(!open);
      save(`${prefix}:nav`, !open);
    } else setMobileOpen(!open);
  };
  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if (
      e.defaultPrevented ||
      e.altKey ||
      e.ctrlKey ||
      e.metaKey ||
      document.querySelector("dialog[open]")
    )
      return;
    if (e.key === "Escape") {
      stopPresentation();
      setMobileOpen(false);
      return;
    }
    const target = e.target as HTMLElement;
    if (target.closest("input,textarea,select,button,a") || target.isContentEditable) return;
    if (["ArrowRight", "PageDown", ...(presentation ? [" "] : [])].includes(e.key)) {
      e.preventDefault();
      next(seenIndex, seenIndex === selected ? sceneIndex : 0);
    }
    if (["ArrowLeft", "PageUp"].includes(e.key)) {
      e.preventDefault();
      previous(seenIndex, seenIndex === selected ? sceneIndex : 0);
    }
  });
  useEffect(() => {
    const failure = () => setStorageFailed(true);
    window.addEventListener("lesson-storage-failed", failure);
    window.addEventListener("keydown", onKey);
    const fullscreen = () => {
      if (!document.fullscreenElement) setPresentation(false);
    };
    document.addEventListener("fullscreenchange", fullscreen);
    return () => {
      window.removeEventListener("lesson-storage-failed", failure);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", fullscreen);
    };
  }, []);
  const title = entry?.slide.title;
  useEffect(() => {
    if (title) {
      document.title = `${title} · ${lesson.title}`;
      save(`${prefix}:position`, `${location.pathname}${location.search}`);
    }
  }, [title, lesson.title, prefix, location.pathname, location.search]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setObserved(Math.max(0, selected));
      if (showAll)
        content.current
          ?.querySelector(`[data-entry="${selected}"]`)
          ?.scrollIntoView({ block: "start" });
      else {
        content.current?.scrollTo(0, 0);
        window.scrollTo(0, 0);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [selected, showAll, presentation]);
  useEffect(() => {
    if (!showAll) return;
    const root = content.current;
    if (!root) return;
    let frame = 0;
    const read = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const line = wide ? root.getBoundingClientRect().top + 80 : 100;
        const sections = [...root.querySelectorAll<HTMLElement>("[data-entry]")];
        const current =
          sections.filter((el) => el.getBoundingClientRect().top <= line).at(-1) ?? sections[0];
        if (current) setObserved(Number(current.dataset.entry));
      });
    };
    root.addEventListener("scroll", read);
    window.addEventListener("scroll", read);
    read();
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("scroll", read);
      window.removeEventListener("scroll", read);
    };
  }, [showAll, wide]);
  const clear = () => {
    try {
      for (const key of Object.keys(localStorage))
        if (key.startsWith(`${prefix}:`)) localStorage.removeItem(key);
    } catch {
      /* Reload also clears temporary answers. */
    }
    window.location.assign(`#${firstPath}`);
    window.location.reload();
  };
  if (!activityId && !slideId) return <Navigate to={firstPath} replace />;
  if (!entry)
    return (
      <main className="p-10">
        <h1 className="mb-5 text-2xl">자료를 찾지 못했어요.</h1>
        <Link to={firstPath}>처음으로</Link>
      </main>
    );
  const renderSlide = (index: number, canvas: boolean) => {
    const item = entries[index]!;
    const at = index === selected ? sceneIndex : 0;
    return (
      <SlidePlayer
        slide={item.slide}
        index={index}
        sceneIndex={at}
        active={index === seenIndex}
        canvas={canvas}
        continuous={continuous}
        speed={speed}
        onContinuous={() => {
          setContinuous(!continuous);
          save(`${prefix}:continuous`, !continuous);
        }}
        onSpeed={(value) => {
          setSpeed(value);
          save(`${prefix}:speed`, value);
        }}
        onScene={(i) => go(index, i)}
        onPrevious={index > 0 || at > 0 ? () => previous(index, at) : undefined}
        onNext={
          index < entries.length - 1 || at < item.slide.scenes.length - 1
            ? () => next(index, at)
            : undefined
        }
      />
    );
  };
  return (
    <LessonContext.Provider value={prefix}>
      <div
        className="app flex min-h-dvh flex-col lg:h-dvh lg:overflow-hidden"
        data-view={presentation ? "present" : view}
      >
        <a
          className="fixed top-2 left-2 z-50 -translate-y-20 rounded bg-surface p-3 focus:translate-y-0"
          href="#content"
          onClick={(e) => {
            e.preventDefault();
            content.current?.focus();
          }}
        >
          본문으로
        </a>
        {!presentation && (
          <header className="flex h-9 shrink-0 items-center bg-bg px-4 lg:px-16">
            <Link to={firstPath} className="text-sm font-extrabold text-navy">
              {lesson.title}
            </Link>
          </header>
        )}
        <div
          className={`min-h-0 flex-1 lg:grid ${open ? "lg:grid-cols-[220px_minmax(0,1fr)]" : "lg:grid-cols-[52px_minmax(0,1fr)]"}`}
        >
          {!presentation && (
            <>
              <div className="flex h-13 items-center justify-between border-b border-line bg-surface px-3 lg:hidden">
                <Link to={firstPath} aria-label="처음으로">
                  ←
                </Link>
                <span className="text-sm font-bold text-navy">{seen?.activity.title}</span>
                <Button
                  tone="quiet"
                  aria-label={open ? "차례 접기" : "차례 펼치기"}
                  aria-expanded={open}
                  aria-controls="lesson-nav"
                  onClick={toggleNav}
                >
                  ☰
                </Button>
              </div>
              {mobileOpen && !wide && (
                <button
                  type="button"
                  className="fixed inset-0 z-20 bg-navy/30"
                  aria-label="차례 닫기"
                  onClick={() => setMobileOpen(false)}
                />
              )}
              <aside
                id="lesson-nav"
                className={`sidebar z-30 flex-col border-r border-line bg-surface p-2.5 ${wide ? "flex min-h-0" : open ? "fixed inset-y-0 left-0 flex w-72 max-w-[88vw]" : "hidden"}`}
              >
                <div
                  className={`mb-2 flex items-center ${open ? "justify-between gap-1" : "flex-col gap-1"}`}
                >
                  <Link
                    to={firstPath}
                    className="grid size-8 shrink-0 place-items-center rounded-lg font-bold text-navy hover:bg-band"
                    aria-label="처음으로"
                    title="처음으로"
                  >
                    ←
                  </Link>
                  {open && (
                    <span
                      className="min-w-0 flex-1 truncate text-sm font-bold text-navy"
                      title={lesson.title}
                    >
                      {lesson.title}
                    </span>
                  )}
                  <Button
                    tone="quiet"
                    className="min-h-8 w-8 px-0"
                    aria-label={open ? "차례 접기" : "차례 펼치기"}
                    aria-expanded={open}
                    aria-controls="lesson-nav"
                    onClick={toggleNav}
                  >
                    {wide ? "☰" : "✕"}
                  </Button>
                </div>
                {open && (
                  <>
                    <div
                      className="mb-5 flex rounded-lg border border-line p-0.5"
                      role="group"
                      aria-label="보기"
                    >
                      {(
                        [
                          ["all", "전체"],
                          ["one", "한 장"],
                        ] as const
                      ).map(([value, label]) => (
                        <button
                          type="button"
                          className="min-h-8 flex-1 rounded-md text-xs font-semibold text-muted hover:bg-band aria-pressed:bg-accent-soft aria-pressed:text-accent"
                          key={value}
                          aria-pressed={view === value}
                          onClick={() => changeView(value)}
                        >
                          {label}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="min-h-8 flex-1 rounded-md text-xs font-semibold text-muted hover:bg-band"
                        onClick={startPresentation}
                        aria-label="발표 보기"
                      >
                        발표
                      </button>
                    </div>
                    <nav className="min-h-0 flex-1 overflow-y-auto" aria-label="차례">
                      {lesson.activities.map((activity) => (
                        <div className="activity-group mb-5" key={activity.id}>
                          <h2 className="mb-2 px-2 text-xs font-bold text-muted">
                            {activity.title}
                          </h2>
                          <ol>
                            {activity.slides.map((slide) => {
                              const i = entries.findIndex(
                                (e) => e.activity.id === activity.id && e.slide.id === slide.id,
                              );
                              return (
                                <li key={slide.id}>
                                  <Link
                                    to={`/${activity.id}/${slide.id}`}
                                    aria-current={i === seenIndex ? "page" : undefined}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      go(i);
                                    }}
                                    className="grid grid-cols-[1.6em_minmax(0,1fr)] items-baseline gap-1 rounded-md px-2 py-2 text-[13px] leading-snug text-ink hover:bg-band aria-[current=page]:bg-accent-soft aria-[current=page]:font-bold aria-[current=page]:text-accent aria-[current=page]:shadow-[inset_3px_0_0_var(--color-accent)]"
                                  >
                                    <span className="tabular-nums">{i + 1}</span>
                                    <span>{slide.title}</span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ol>
                        </div>
                      ))}
                    </nav>
                  </>
                )}
                <div
                  className={`mt-auto border-t border-line pt-2 ${open ? "" : "border-transparent"}`}
                >
                  <Button
                    tone="quiet"
                    className={`min-h-9 ${open ? "w-full justify-start text-xs" : "w-8 px-0"}`}
                    aria-label="설정"
                    onClick={() => settings.current?.showModal()}
                  >
                    <span aria-hidden="true">⚙</span>
                    {open && "설정"}
                  </Button>
                </div>
              </aside>
            </>
          )}
          <main
            id="content"
            ref={content}
            tabIndex={-1}
            className={`slides-content min-w-0 outline-none lg:overflow-y-auto ${showAll ? "bg-bg" : "bg-surface"} ${presentation ? "fixed inset-0 z-40" : ""}`}
          >
            {!presentation && storageFailed && (
              <p className="storage-warning px-5 py-2 text-xs text-amber" role="status">
                저장이 막혀 있어요. 새로고침하거나 탭을 닫으면 답이 사라져요.
              </p>
            )}
            {!presentation &&
              resume &&
              resume !== `${location.pathname}${location.search}` &&
              location.pathname === firstPath && (
                <div className="resume flex flex-wrap items-center gap-3 border-b border-line px-5 py-2 text-xs">
                  <span>지난번 보던 곳이 있어요.</span>
                  <button
                    type="button"
                    className="text-accent underline"
                    onClick={() => {
                      navigate(resume);
                      setResume("");
                    }}
                  >
                    이어보기
                  </button>
                  <button
                    type="button"
                    className="p-2"
                    aria-label="이어보기 안내 닫기"
                    onClick={() => setResume("")}
                  >
                    ×
                  </button>
                </div>
              )}
            {presentation ? (
              <Canvas presentation>
                {renderSlide(selected, true)}
                <div className="present-bar absolute right-10 bottom-6 flex items-center gap-1 rounded-full border border-line bg-surface px-2 py-1 text-xs tabular-nums opacity-40 focus-within:opacity-100 hover:opacity-100">
                  <Button
                    tone="quiet"
                    className="min-h-8! px-2!"
                    disabled={selected === 0}
                    onClick={() => go(selected - 1)}
                    aria-label="이전 슬라이드로 이동"
                  >
                    ←
                  </Button>
                  <span>
                    {selected + 1} / {entries.length}
                  </span>
                  <Button
                    tone="quiet"
                    className="min-h-8! px-2!"
                    disabled={selected === entries.length - 1}
                    onClick={() => go(selected + 1)}
                    aria-label="다음 슬라이드로 이동"
                  >
                    →
                  </Button>
                  <Button
                    tone="quiet"
                    className="min-h-8! px-2!"
                    onClick={stopPresentation}
                    aria-label="발표 끝내기"
                  >
                    ✕
                  </Button>
                </div>
              </Canvas>
            ) : (
              <div
                className={
                  showAll ? "mx-auto grid max-w-[1420px] gap-6 p-4" : "flex min-h-full flex-col"
                }
              >
                {entries.map((item, i) => (
                  <div
                    key={`${item.activity.id}/${item.slide.id}`}
                    data-entry={i}
                    hidden={!showAll && i !== selected}
                    className={
                      showAll
                        ? "scroll-mt-4 overflow-visible rounded-lg border border-line bg-surface"
                        : "my-auto"
                    }
                  >
                    {canvasLayout ? (
                      <Canvas fit={!showAll}>{renderSlide(i, true)}</Canvas>
                    ) : (
                      renderSlide(i, false)
                    )}
                  </div>
                ))}
                {!showAll && (
                  <nav
                    className="pager grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 border-t border-line px-4 py-3 text-xs sm:px-6 sm:text-sm"
                    aria-label="슬라이드 이동"
                  >
                    {selected > 0 ? (
                      <button
                        type="button"
                        className="truncate text-left font-semibold text-accent hover:underline"
                        onClick={() => go(selected - 1)}
                      >
                        ← {entries[selected - 1]!.slide.title}
                      </button>
                    ) : (
                      <span />
                    )}
                    <span className="text-muted tabular-nums">
                      {selected + 1} / {entries.length}
                    </span>
                    {selected < entries.length - 1 ? (
                      <button
                        type="button"
                        className="truncate text-right font-semibold text-accent hover:underline"
                        onClick={() => go(selected + 1)}
                      >
                        {entries[selected + 1]!.slide.title} →
                      </button>
                    ) : (
                      <Link className="text-right font-semibold" to={firstPath}>
                        처음으로 ↻
                      </Link>
                    )}
                  </nav>
                )}
              </div>
            )}
          </main>
        </div>
        <dialog
          ref={settings}
          className="m-auto max-h-[85dvh] w-[min(560px,90vw)] overflow-auto rounded-xl border border-line bg-surface p-7 text-ink shadow-xl"
          aria-labelledby="settings-title"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 id="settings-title" className="text-xl">
              설정
            </h2>
            <Button tone="quiet" aria-label="설정 닫기" onClick={() => settings.current?.close()}>
              ✕
            </Button>
          </div>
          <h3 className="mb-2">자료·출처</h3>
          <p className="mb-4 text-sm text-muted">
            {seen?.slide.title} · 확인일 {lesson.checkedAt}
          </p>
          <ul className="grid gap-3 text-sm">
            {seen?.slide.sources.map((id) => (
              <li key={id}>
                <a
                  className="hover:underline"
                  href={lesson.sources[id]!.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {lesson.sources[id]!.title} ↗
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-7 border-t border-line pt-5">
            <Button
              tone="quiet"
              onClick={() => {
                settings.current?.close();
                reset.current?.showModal();
              }}
            >
              내 기록 지우기
            </Button>
          </div>
        </dialog>
        <dialog
          ref={reset}
          className="m-auto max-w-[90vw] rounded-xl border border-line bg-surface p-7 text-ink shadow-xl"
          aria-labelledby="reset-title"
        >
          <h2 id="reset-title" className="mb-3 text-xl">
            이 수업의 기록을 지울까요?
          </h2>
          <p className="mb-6 text-sm">이 브라우저에 저장된 퀴즈 답과 이어보기 위치를 지웁니다.</p>
          <div className="flex gap-3">
            <Button onClick={() => reset.current?.close()}>취소</Button>
            <Button tone="primary" onClick={clear}>
              기록 지우기
            </Button>
          </div>
        </dialog>
      </div>
    </LessonContext.Provider>
  );
}
