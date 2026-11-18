import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const source = fileURLToPath(new URL("../", import.meta.url));

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(path) && !path.endsWith(".test.ts") ? [path] : [];
  });
}

test("공용 재생기·부품·규칙은 수업 내용에 의존하지 않는다", () => {
  for (const folder of ["player", "components", "domain"]) {
    for (const file of sourceFiles(join(source, folder))) {
      const imports = readFileSync(file, "utf8").matchAll(
        /\b(?:from\s*|import\s*(?:\(\s*)?)["']([^"']+)["']/g,
      );
      for (const match of imports) {
        const specifier = match[1]!;
        if (!specifier.startsWith(".")) continue;
        const target = resolve(dirname(file), specifier);
        assert.ok(
          target !== join(source, "lesson") && !target.startsWith(join(source, "lesson") + sep),
          `${file}: 수업 내용 ${specifier}를 공용 코드에서 가져오면 안 됩니다`,
        );
      }
    }
  }
});
