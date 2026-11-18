import type { Lesson } from "../domain/lesson";
import { movement } from "./activities/movement";
import { sources } from "./sources";

export const lesson = {
  id: "time-and-distance",
  title: "시간과 거리",
  description: "시간과 속력을 바꾸며 이동 거리를 알아봅니다.",
  checkedAt: "2026-11-18",
  sources,
  activities: [movement],
} satisfies Lesson;
