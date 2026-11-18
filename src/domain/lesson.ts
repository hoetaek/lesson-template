import type { ReactNode } from "react";

export type Scene = {
  id: string;
  label: string;
  caption: string;
  content: ReactNode;
  duration?: number;
  waits?: boolean;
};
export type Slide = {
  id: string;
  title: string;
  sources: readonly string[];
  scenes: readonly [Scene, ...Scene[]];
};
export type Activity = {
  id: string;
  title: string;
  slides: readonly [Slide, ...Slide[]];
};
export type Source = { title: string; url: string };
export type Lesson = {
  id: string;
  title: string;
  description: string;
  checkedAt: string;
  sources: Readonly<Record<string, Source>>;
  activities: readonly [Activity, ...Activity[]];
};

export function validateLesson(lesson: Lesson): string[] {
  const errors: string[] = [];
  const unique = (items: readonly { id: string }[], parent: string) => {
    const ids = new Set<string>();
    if (!items.length) errors.push(`${parent}: 내용이 없습니다`);
    for (const item of items) {
      if (!/^[a-z][a-z0-9-]*$/.test(item.id)) errors.push(`${parent}: 잘못된 ID ${item.id}`);
      if (ids.has(item.id)) errors.push(`${parent}: 중복 ID ${item.id}`);
      ids.add(item.id);
    }
  };
  unique([lesson], "차시");
  unique(lesson.activities, lesson.id);
  for (const activity of lesson.activities) {
    unique(activity.slides, activity.id);
    for (const slide of activity.slides) {
      unique(slide.scenes, `${activity.id}/${slide.id}`);
      for (const source of slide.sources)
        if (!lesson.sources[source]) errors.push(`없는 출처: ${source}`);
      for (const scene of slide.scenes) {
        if (!scene.caption.trim()) errors.push(`자막 없음: ${slide.id}/${scene.id}`);
        if (
          scene.duration !== undefined &&
          (!Number.isFinite(scene.duration) || scene.duration <= 0)
        )
          errors.push(`잘못된 장면 길이: ${scene.id}`);
      }
    }
  }
  return errors;
}

export const slidePath = (activity: string, slide: string) => `/${activity}/${slide}`;
