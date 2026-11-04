#!/usr/bin/env node
/**
 * Mobile audit on every page: horizontal overflow, small tap targets and small text.
 * Exit code 1 only on horizontal overflow.
 *
 * Usage: node scripts/checks/mobile.mjs <base-url> [width]
 */
import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const base = process.argv[2].replace(/\/$/, "");
const width = Number(process.argv[3] ?? 360);
const routes = readdirSync(path.join(ROOT, "public"), { recursive: true })
  .filter((file) => file.endsWith("index.html") && !file.startsWith("admin"))
  .map((file) => "/" + file.replace(/(^|\/)index\.html$/, ""));

// Block analytics so checks against the live site do not count as visits.
const TRACKERS = /googletagmanager|google-analytics|googleadservices|doubleclick|clarity\.ms/;
const browser = await chromium.launch({ channel: "chrome" });
const context = await browser.newContext({ viewport: { width, height: 800 }, isMobile: true, hasTouch: true });
await context.route(TRACKERS, (route) => route.abort());
const page = await context.newPage();
let overflowing = 0;

for (const route of routes) {
  await page.goto(`${base}${route === "/" ? "/" : `${route}`}`, { waitUntil: "load" });
  const report = await page.evaluate((limit) => {
    const visible = (el) => el.getClientRects().length && getComputedStyle(el).visibility !== "hidden";
    const wide = [...document.querySelectorAll("body *")]
      .filter((el) => visible(el) && el.getBoundingClientRect().right > limit + 1 && !el.closest("[aria-hidden=true], .overflow-x-auto, .overflow-hidden, .sr-only"))
      .slice(0, 3)
      .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 50)}`);
    const small = [...document.querySelectorAll("main a, main button, header a, header button, summary")]
      .filter(visible)
      .filter((el) => el.getBoundingClientRect().height < 36 && !el.closest("p, li")).length;
    return { scroll: document.documentElement.scrollWidth, wide, small };
  }, width);
  const over = report.scroll > width + 1;
  overflowing += over ? 1 : 0;
  if (over || report.wide.length || report.small > 3) console.log(route, report.scroll, report.wide.join(" ; "), `tap<36:${report.small}`);
}
await browser.close();
console.log(`${overflowing ? "FALLA" : "OK   "} Sin scroll horizontal a ${width}px (${routes.length} páginas, ${overflowing} con problema)`);
process.exit(overflowing ? 1 : 0);
