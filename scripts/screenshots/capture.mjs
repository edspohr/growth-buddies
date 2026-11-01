#!/usr/bin/env node
/**
 * Captures pages at desktop and 390px mobile.
 *
 * Usage: node scripts/screenshots/capture.mjs <base-url> <output-dir> [/path ...]
 */
import { mkdirSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const [base, output, ...paths] = process.argv.slice(2);
const pages = paths.length ? paths : ["/", "/servicios/legal-tech", "/blog/roi-ia-estudios-juridicos"];
const viewports = {
  desktop: { width: 1440, height: 900 },
  mobile: { width: 390, height: 844 },
};

mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });

for (const [name, viewport] of Object.entries(viewports)) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  for (const route of pages) {
    await page.goto(base.replace(/\/$/, "") + route, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; } .reveal { opacity: 1 !important; transform: none !important; }" });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 60));
      }
      window.scrollTo(0, 0);
    });
    const slug = route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
    await page.screenshot({ path: path.join(output, `${slug}-${name}.png`), fullPage: true });
  }
  await context.close();
}
await browser.close();
