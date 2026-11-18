import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "playwright-core";

const base = process.env.LESSON_URL ?? "http://127.0.0.1:5196/";
const capture = process.argv.includes("--capture");
const out = ".local/captures";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const failures = [];
const images = [];
const manifest = [];
const quizzes = [];
const frame = "article:visible";

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}
async function openNav(page) {
  const button = page.getByRole("button", { name: "차례 펼치기", exact: true });
  if (await button.count()) await button.click();
}
async function go(page, slide, scene) {
  await page.goto(`${base}${slide.href}?scene=${scene.id}`);
  await page.locator(`${frame} [data-scene="${scene.id}"]`).waitFor({ state: "attached" });
  await settle(page);
}
async function inspect(page, name, presentation = false) {
  const issues = await page.evaluate(() => {
    const issues = [];
    if (document.documentElement.scrollWidth > innerWidth + 2) issues.push("페이지 가로 넘침");
    for (const el of document.querySelectorAll("article *")) {
      if (!(el instanceof HTMLElement) || !el.getClientRects().length) continue;
      const css = getComputedStyle(el);
      if (css.visibility === "hidden" || css.display === "contents") continue;
      if (el.scrollWidth > el.clientWidth + 3 && css.overflowX === "hidden")
        issues.push(`가로 잘림: ${el.className}`);
      if (el.scrollHeight > el.clientHeight + 3 && css.overflowY === "hidden")
        issues.push(`세로 잘림: ${el.className}`);
    }
    for (const article of document.querySelectorAll('article[data-canvas="true"]')) {
      if (!article.getClientRects().length) continue;
      const body = article.querySelector(".scene-body").getBoundingClientRect();
      const content = article
        .querySelector(".scene-body")
        .firstElementChild.getBoundingClientRect();
      const bounds = article.getBoundingClientRect();
      if (content.top < body.top - 2 || content.bottom > body.bottom + 2)
        issues.push("그림 영역 넘침");
      if (
        [...article.querySelectorAll(".caption, .timeline-row")].some(
          (el) => el.getBoundingClientRect().bottom > bounds.bottom + 2,
        )
      )
        issues.push("캔버스 넘침");
    }
    return issues;
  });
  failures.push(...issues.map((issue) => ({ name, issue })));
  if (capture || issues.length) {
    const path = `${out}/${name}.png`;
    if (presentation) await page.locator(".canvas-inner:visible").screenshot({ path });
    else await page.screenshot({ path, fullPage: true });
    images.push(path);
  }
}

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(base);
  await page.locator(`${frame} .scene-body`).waitFor({ state: "attached" });
  await openNav(page);
  const links = await page
    .locator(".activity-group a")
    .evaluateAll((items) =>
      items.map((el) => ({ href: el.getAttribute("href"), title: el.textContent })),
    );
  assert.ok(links.length > 0, "차례에 슬라이드가 있어야 합니다");
  for (const slide of links) {
    await page.goto(`${base}${slide.href}`);
    await page.locator(`${frame} .scene-body`).waitFor({ state: "attached" });
    const scenes = await page
      .locator(`${frame} [data-scene-id]`)
      .evaluateAll((items) =>
        items.map((el) => ({ id: el.dataset.sceneId, label: el.textContent })),
      );
    assert.ok(scenes.length > 0, `${slide.title}: 장면 없음`);
    manifest.push({ ...slide, scenes });
  }
  await page.getByRole("button", { name: "차례 접기", exact: true }).click();
  for (const width of [390, 1024, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    for (const [index, slide] of manifest.entries()) {
      for (const scene of slide.scenes) {
        await go(page, slide, scene);
        await inspect(page, `${width}-${index + 1}-${scene.id}`);
        if (width === 1440 && (await page.locator(`${frame} .quiz`).count()))
          quizzes.push({ slide, scene });
      }
    }
    console.log(`${width}px: 모든 장면 확인`);
  }
  for (const [index, slide] of manifest.entries()) {
    for (const scene of slide.scenes) {
      await go(page, slide, scene);
      await openNav(page);
      await page.getByRole("button", { name: "발표 보기", exact: true }).click();
      await page.locator('.app[data-view="present"]').waitFor();
      await settle(page);
      await inspect(page, `presentation-${index + 1}-${scene.id}`, true);
      await page.getByRole("button", { name: "발표 끝내기", exact: true }).click();
    }
  }
  for (const [index, { slide, scene }] of quizzes.entries()) {
    await go(page, slide, scene);
    const quiz = page.locator(`${frame} .quiz`);
    await quiz.getByRole("radio").first().check();
    await quiz.getByRole("button", { name: "답 확인", exact: true }).click();
    const feedback = await quiz.locator(".feedback").innerText();
    assert.match(feedback, /정답:/);
    await page.reload();
    await quiz.locator(".feedback").waitFor();
    assert.equal(await quiz.locator(".feedback").innerText(), feedback);
    await openNav(page);
    await page.getByRole("button", { name: "발표 보기", exact: true }).click();
    await settle(page);
    await inspect(page, `quiz-${index + 1}-feedback`, true);
    await quiz.getByRole("button", { name: "다시 풀기", exact: true }).click();
    assert.equal(await quiz.locator(".feedback").count(), 0);
    await page.getByRole("button", { name: "발표 끝내기", exact: true }).click();
  }

  await go(page, manifest[0], manifest[0].scenes[0]);
  await openNav(page);
  await page.reload();
  await page.getByRole("button", { name: "차례 접기", exact: true }).waitFor();
  await page.getByRole("button", { name: "전체", exact: true }).click();
  await settle(page);
  assert.equal(await page.locator(frame).count(), manifest.length);
  const beforeScroll = page.url();
  await page
    .locator("[data-entry]")
    .last()
    .evaluate((el) => el.scrollIntoView({ block: "start" }));
  await settle(page);
  assert.equal(page.url(), beforeScroll, "전체 보기의 스크롤은 주소를 바꾸지 않습니다");
  await page.getByRole("button", { name: "한 장", exact: true }).click();
  await settle(page);
  assert.equal(await page.locator(frame).count(), 1);
  await page.locator(frame).getByRole("button", { name: "재생 속도", exact: true }).click();
  await page.getByRole("button", { name: "2×", exact: true }).click();
  await page.reload();
  assert.equal(
    await page.locator(frame).getByRole("button", { name: "재생 속도", exact: true }).innerText(),
    "2×",
  );
  await page.getByRole("button", { name: "설정", exact: true }).click();
  await page.locator("dialog[open]").waitFor();
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("dialog[open]").count(), 0);
  await page.setViewportSize({ width: 390, height: 844 });
  await settle(page);
  await openNav(page);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("aside:visible").count(), 0);
  await openNav(page);
  await page.locator(".activity-group a").first().click();
  assert.equal(await page.locator("aside:visible").count(), 0);
  await page.goto(`${base}#/unknown/missing`);
  await page.getByRole("heading", { name: "자료를 찾지 못했어요." }).waitFor();
  assert.deepEqual(errors, []);
  assert.deepEqual(failures, []);
  console.log(
    `통과: ${manifest.length}개 슬라이드, ${manifest.reduce((count, slide) => count + slide.scenes.length, 0)}개 장면, 퀴즈 ${quizzes.length}개, 보기 전환·차례·배속 기억·모바일 탐색`,
  );
} finally {
  writeFileSync(
    `${out}/verification.json`,
    JSON.stringify({ manifest, images, failures, errors }, null, 2),
  );
  await browser.close();
}
