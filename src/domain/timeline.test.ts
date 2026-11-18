import assert from "node:assert/strict";
import { test } from "node:test";
import { advance, phase } from "./timeline.ts";
test("프레임 시각이 역전되거나 늦어도 재생 범위를 넘지 않는다", () => {
  assert.equal(advance(100, -20, 1, 1000), 100);
  assert.equal(advance(990, 100, 1, 1000), 1000);
  assert.equal(phase(5, 10, 0), 0);
  assert.equal(phase(10, 10, 0), 1);
});
