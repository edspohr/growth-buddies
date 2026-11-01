#!/usr/bin/env node
/**
 * Expense Buddy screenshots from the public demo (fictional company).
 *
 * Usage: node scripts/screenshots/expense-buddy.mjs <output-dir>
 */
import { mkdirSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const output = process.argv[2];
const DEMO = "https://expense-buddy-demo.web.app/";
const viewports = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 390, height: 844, isMobile: true },
};

mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });

async function enter(page, role) {
  await page.goto(DEMO, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: new RegExp(role) }).click();
  await page.waitForURL(/dashboard|admin/, { timeout: 30000 });
  await page.waitForTimeout(3000);
}

for (const [name, { width, height, isMobile }] of Object.entries(viewports)) {
  const context = await browser.newContext({
    viewport: { width, height },
    isMobile: Boolean(isMobile),
    hasTouch: Boolean(isMobile),
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  await enter(page, "Trabajador en terreno");
  await page.screenshot({ path: path.join(output, `expense-terreno-${name}.png`) });
  console.log(name, page.url(), await page.locator("a:visible, button:visible").allInnerTexts());

  await context.setOffline(true);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(output, `expense-offline-${name}.png`) });
  await context.setOffline(false);
  await context.clearCookies();
  await page.evaluate(async () => {
    localStorage.clear();
    for (const db of (await indexedDB.databases?.()) ?? []) indexedDB.deleteDatabase(db.name);
  });

  await enter(page, "Finanzas");
  await page.screenshot({ path: path.join(output, `expense-finanzas-${name}.png`) });
  console.log(name, page.url());
  await context.close();
}
await browser.close();
