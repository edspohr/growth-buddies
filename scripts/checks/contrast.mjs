#!/usr/bin/env node
/**
 * WCAG AA color contrast on every page of the local public/ build.
 *
 * Usage: node scripts/checks/contrast.mjs <base-url> [/path ...]
 * Exit code 1 when any page has a violation.
 */
import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const [base, ...paths] = process.argv.slice(2);
const SKIP = new Set(["/admin", "/404"]);

const allPages = readdirSync(path.join(ROOT, "public"), { recursive: true })
  .filter((file) => file.endsWith(".html"))
  .map((file) => "/" + file.replace(/(^|\/)index\.html$/, "").replace(/\.html$/, ""))
  .map((route) => (route.length > 1 ? route.replace(/\/$/, "") : route))
  .filter((route) => !SKIP.has(route));

const browser = await chromium.launch({ channel: "chrome" });
const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
const routes = paths.length ? paths : allPages;
let total = 0;

for (const route of routes) {
  // The local server has no clean URLs, so ask for the file directly.
  await page.goto(base.replace(/\/$/, "") + (route === "/" ? "/" : `${route}/`), { waitUntil: "load" });
  await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; } .reveal { opacity: 1 !important; transform: none !important; }" });
  const { violations } = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
  for (const violation of violations) {
    for (const node of violation.nodes) {
      total += 1;
      const data = node.any[0]?.data ?? {};
      console.log(`${route} | ${data.contrastRatio} ${data.fgColor}/${data.bgColor} | ${node.target[0].slice(0, 90)}`);
    }
  }
}
await browser.close();
console.log(`${total ? "FALLA" : "OK   "} Contraste AA (${routes.length} páginas, ${total} problemas)`);
process.exit(total ? 1 : 0);
