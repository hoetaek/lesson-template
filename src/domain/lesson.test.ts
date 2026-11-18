import assert from "node:assert/strict";
import { test } from "node:test";
import { validateLesson, type Lesson } from "./lesson.ts";
const lesson: Lesson = {
  id: "demo",
  title: "예시",
  description: "",
  checkedAt: "2026-11-18",
  sources: {},
  activities: [
    {
      id: "one",
      title: "활동",
      slides: [
        {
          id: "intro",
          title: "소개",
          sources: [],
          scenes: [{ id: "start", label: "시작", caption: "자막", content: null }],
        },
      ],
    },
  ],
};
test("화면 주소가 충돌하는 중복 ID와 없는 출처를 검출한다", () => {
  assert.deepEqual(validateLesson(lesson), []);
  const bad = structuredClone(lesson);
  bad.activities[0].slides[0].sources = ["missing"];
  bad.activities[0].slides = [...bad.activities[0].slides, bad.activities[0].slides[0]];
  assert.match(validateLesson(bad).join("\n"), /중복 ID intro/);
  assert.match(validateLesson(bad).join("\n"), /없는 출처/);
});
