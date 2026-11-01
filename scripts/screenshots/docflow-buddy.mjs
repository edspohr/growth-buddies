#!/usr/bin/env node
/**
 * DocFlow Buddy screenshots. Local emulators ONLY (http://localhost:5174).
 * De-brands the DOM before capture and fails on any forbidden name.
 * Output stays out of the live site until it is approved.
 *
 * Usage: DOCFLOW_REPO=~/dev/spi-smart-flow-v2 node scripts/screenshots/docflow-buddy.mjs <output-dir>
 */
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const APP = "http://localhost:5174";
const output = process.argv[2];
const credentials = JSON.parse(
  readFileSync(path.join(process.env.DOCFLOW_REPO, "e2e/credentials.local.json"), "utf8")
);
const accounts = Array.isArray(credentials.accounts)
  ? credentials.accounts
  : Object.entries(credentials.accounts).map(([role, value]) => ({ role, ...value }));
const find = (pattern) => accounts.find((account) => pattern.test(JSON.stringify({ ...account, password: "" })));

const FORBIDDEN = /SPI|Smart ?Flow|PREFLEX|TRIUNFO|\bJuli\b|Pipefy|Gemini|Vertex/i;
const REPLACEMENTS = [
  [/SPI DEMO S\.A\.S\.?/gi, "Comercial Los Andes SpA"],
  [/PREFLEX S\.A\.S\.?/gi, "Textiles del Maipo SpA"],
  [/FABRICA DE CHOCOLATES TRIUNFO S\.A\.?/gi, "Alimentos Cordillera SpA"],
  [/SPI Smart Flow|Smart ?Flow|SPI Americas|SPI Asociados|\bSPI\b/gi, "DocFlow Buddy"],
  [/\bJuli\b/g, "Camila"],
  [/Pipefy/gi, "Sistema"],
  [/\s*\(e2e\)/gi, ""],
  [/Camila Admin/g, "Camila Rojas"],
  [/^JU$/, "CR"],
  [/^CL$/, "CD"],
];

// Runs once, after the app settles: a live observer fights React's reconciler.
function debrand(replacements) {
  const rules = replacements.map(([source, flags, to]) => [new RegExp(source, flags), to]);
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    let text = walker.currentNode.nodeValue;
    for (const [rule, to] of rules) text = text.replace(rule, to);
    if (text !== walker.currentNode.nodeValue) walker.currentNode.nodeValue = text;
  }
  document.querySelectorAll('img[src*="spi"], img[src*="logo"], img[alt*="SPI"]').forEach((image) => {
    const mark = document.createElement("span");
    mark.textContent = "DocFlow Buddy";
    mark.style.cssText = "font:600 18px Inter,sans-serif;color:currentColor";
    image.replaceWith(mark);
  });
}

const serializable = REPLACEMENTS.map(([rule, to]) => [rule.source, rule.flags, to]);
const shots = [
  { name: "docflow-control", account: /"key":"admin"/, route: "/spi-admin/torre-de-control" },
  { name: "docflow-pipeline", account: /"key":"admin"/, route: "/spi-admin" },
  { name: "docflow-portal", account: /"key":"cliente"/, route: "/client/ots" },
];

mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
for (const shot of shots) {
  for (const [label, viewport] of [["desktop", { width: 1280, height: 800 }], ["mobile", { width: 390, height: 844 }]]) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 2 });
    const page = await context.newPage();
    const account = find(shot.account);
    await page.goto(`${APP}/login`, { waitUntil: "load" });
    await page.locator('input[type="email"]').fill(account.email);
    await page.locator('input[type="password"]').fill(account.password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL((url) => !url.pathname.startsWith("/login"), { timeout: 20000 });
        await page.waitForTimeout(2500);
    if (shot.route !== "/") {
      await page.goto(APP + shot.route, { waitUntil: "load" });
      await page.waitForTimeout(2500);
    }
    const links = await page.locator("nav a:visible, aside a:visible").allInnerTexts();
    console.log(new URL(page.url()).pathname, links.join(" | "));
    const skip = page.getByRole("button", { name: "Omitir" });
    if (await skip.isVisible().catch(() => false)) await skip.click();
    await page.waitForTimeout(1500);
    await page.evaluate(debrand, serializable);
    const text = await page.locator("body").innerText();
    if (/Algo salió mal/.test(text)) throw new Error(`Error screen on ${shot.name}-${label}`);
    const hit = text.match(FORBIDDEN);
    if (hit) throw new Error(`Forbidden name "${hit[0]}" on ${shot.name}-${label}`);
    await page.screenshot({ path: path.join(output, `${shot.name}-${label}.png`) });
    console.log(shot.name, label, new URL(page.url()).pathname, await page.locator("nav a:visible, aside a:visible").allInnerTexts());
    await context.close();
  }
}
await browser.close();
