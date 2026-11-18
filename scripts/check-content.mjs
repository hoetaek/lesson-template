import { createServer } from "vite";

// Load TSX through the same pipeline as the app, without starting an HTTP server.
const server = await createServer({
  server: { middlewareMode: true, hmr: false, watch: null },
  appType: "custom",
  logLevel: "error",
});
try {
  const { lesson } = await server.ssrLoadModule("/src/lesson/lesson.ts");
  const { validateLesson } = await server.ssrLoadModule("/src/domain/lesson.ts");
  const errors = validateLesson(lesson);
  if (errors.length) throw new Error(errors.join("\n"));
  console.log("차시 내용 검사 통과: ID·중복·출처 연결·자막·재생 시간");
} finally {
  await server.close();
}
