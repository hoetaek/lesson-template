import type { Activity } from "../../../domain/lesson";
import { slide as slideDistance } from "./distance/slide";
import { slide as slideExperiment } from "./experiment/slide";
import { slide as slideCheck } from "./check/slide";

export const movement = {
  id: "movement",
  title: "움직임 살펴보기",
  slides: [slideDistance, slideExperiment, slideCheck],
} satisfies Activity;
