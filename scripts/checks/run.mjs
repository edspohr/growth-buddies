#!/usr/bin/env node
/**
 * Pre-deploy checks. Runs against a deployed URL and the local public/ build.
 *
 * Usage: node scripts/checks/run.mjs https://<channel-or-site-url>
 * Exit code 1 when any check fails.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PUBLIC = path.join(ROOT, "public");
const PROD = "https://growthbuddies.cl";
const BASE = (process.argv[2] || "").replace(/\/$/, "");
const FORBIDDEN = [
  "SPI Smart Flow",
  "Smart Flow",
  "Martina",
  "Summer",
  "OASIS",
  "edmundo@growthbuddies.cl",
  "datos alojados en Chile",
  "tipo de cambio oficial",
  "Quedan",
  "cupos",
];

if (!BASE || !existsSync(PUBLIC)) {
  console.error("Usage: node scripts/checks/run.mjs <url> (run npm run build first)");
  process.exit(2);
}

const { redirects } = JSON.parse(readFileSync(path.join(ROOT, "firebase.json"), "utf8")).hosting;
const redirectSources = new Set(redirects.map((r) => r.source));

function htmlFiles(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) htmlFiles(full, files);
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function urlPath(file) {
  const rel = "/" + path.relative(PUBLIC, file).split(path.sep).join("/");
  return rel === "/index.html" ? "/" : rel.replace(/\/index\.html$/, "").replace(/\.html$/, "");
}

async function checkSitemap() {
  const xml = readFileSync(path.join(PUBLIC, "sitemap.xml"), "utf8");
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const failures = [];
  for (const url of urls) {
    const res = await fetch(url.replace(PROD, BASE), { redirect: "manual" });
    if (res.status !== 200) failures.push(`${res.status} ${url}`);
  }
  return { name: "Sitemap devuelve 200", total: urls.length, failures };
}

async function checkRedirects() {
  const failures = [];
  for (const { source, destination } of redirects) {
    const res = await fetch(BASE + source, { redirect: "manual" });
    const location = (res.headers.get("location") || "").replace(BASE, "");
    if (res.status !== 301 || location !== destination) {
      failures.push(`${source}: ${res.status} -> ${location || "(sin location)"}`);
      continue;
    }
    const target = await fetch(BASE + destination.split("#")[0], { redirect: "manual" });
    if (target.status !== 200) failures.push(`${source}: destino da ${target.status}`);
  }
  return { name: "Redirects 301 en un salto", total: redirects.length, failures };
}

function checkCanonicals() {
  const failures = [];
  let total = 0;
  for (const file of htmlFiles(PUBLIC)) {
    const page = urlPath(file);
    const html = readFileSync(file, "utf8");
    if (page === "/404" || redirectSources.has(page) || /<meta[^>]+noindex/i.test(html)) continue;
    total += 1;
    const canonicals = [...html.matchAll(/<link[^>]+rel="canonical"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
    const expected = page === "/" ? `${PROD}/` : PROD + page;
    if (canonicals.length !== 1) failures.push(`${page}: ${canonicals.length} canonicals`);
    else if (canonicals[0] !== expected) failures.push(`${page}: ${canonicals[0]}`);
  }
  return { name: "Canonical propio, sin slash final", total, failures };
}

function checkInternalLinks() {
  const failures = new Set();
  const files = htmlFiles(PUBLIC);
  for (const file of files) {
    const html = readFileSync(file, "utf8");
    for (const [, target] of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
      if (target.startsWith("//")) continue;
      const clean = target.split(/[?#]/)[0].replace(/\/$/, "") || "/";
      const disk = path.join(PUBLIC, clean);
      const exists =
        clean === "/" ||
        redirectSources.has(clean) ||
        (existsSync(disk) && statSync(disk).isFile()) ||
        existsSync(`${disk}.html`) ||
        existsSync(path.join(disk, "index.html"));
      if (!exists) failures.add(`${urlPath(file)} -> ${target}`);
    }
  }
  return { name: "Sin enlaces internos rotos", total: files.length, failures: [...failures] };
}

function checkForbiddenStrings() {
  const failures = [];
  const files = [...htmlFiles(PUBLIC), path.join(PUBLIC, "llms.txt")];
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    const found = FORBIDDEN.filter((term) => text.includes(term));
    if (found.length) failures.push(`${path.relative(PUBLIC, file)}: ${found.join(", ")}`);
  }
  return { name: "Sin textos prohibidos", total: files.length, failures };
}

const results = [
  await checkSitemap(),
  await checkRedirects(),
  checkCanonicals(),
  checkInternalLinks(),
  checkForbiddenStrings(),
];

let failed = false;
for (const { name, total, failures } of results) {
  console.log(`${failures.length ? "FALLA" : "OK   "} ${name} (${total - failures.length}/${total})`);
  for (const failure of failures) console.log(`      ${failure}`);
  failed ||= failures.length > 0;
}
process.exit(failed ? 1 : 0);
