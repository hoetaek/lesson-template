import assert from "node:assert/strict";
import { test } from "node:test";
import { isText, readValue, writeValue } from "./storage.ts";
test("차단·손상·다른 형식의 저장값은 시작을 막지 않는다", () => {
  assert.equal(
    readValue(
      {
        getItem: () => {
          throw new Error("blocked");
        },
      },
      "x",
      "",
      isText,
    ),
    "",
  );
  assert.equal(readValue({ getItem: () => "{broken" }, "x", "", isText), "");
  assert.equal(readValue({ getItem: () => "123" }, "x", "", isText), "");
  assert.equal(
    readValue({ getItem: () => JSON.stringify("/activity/slide") }, "x", "", isText),
    "/activity/slide",
  );
  assert.equal(
    writeValue(
      {
        setItem: () => {
          throw new Error("quota");
        },
      },
      "x",
      "answer",
    ),
    false,
  );
});
