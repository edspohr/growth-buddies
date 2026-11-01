#!/usr/bin/env node
/**
 * Builds the deployable site into public/ from an explicit allowlist.
 * Nothing outside these lists is published (docs, functions, scripts, markdown).
 *
 * Usage: node scripts/build-public.mjs
 */
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public");

const ROOT_FILES = [
  "index.html",
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
  "site.webmanifest",
];

// admin stays public: it is the lead panel, gated by Firebase Auth and noindex.
const DIRECTORIES = [
  "admin",
  "blog",
  "casos",
  "colombia",
  "ecuador",
  "equipo",
  "fonts",
  "gracias",
  "img",
  "metodologia",
  "nosotros",
  "peru",
  "preguntas-frecuentes",
  "privacidad",
  "recursos",
  "sectores",
  "servicios",
  "soluciones",
  "terminos",
];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);

for (const file of ROOT_FILES) {
  cpSync(path.join(ROOT, file), path.join(OUT, file));
}

for (const dir of DIRECTORIES) {
  if (!existsSync(path.join(ROOT, dir))) {
    throw new Error(`Missing allowlisted directory: ${dir}`);
  }
  cpSync(path.join(ROOT, dir), path.join(OUT, dir), {
    recursive: true,
    filter: (source) => !/\.(md|DS_Store)$/.test(source),
  });
}

// CTA destinations live in one file; source pages use {{calendly}} and {{whatsapp}}.
const cta = JSON.parse(readFileSync(path.join(ROOT, "src/cta.config.json"), "utf8"));
const pages = readdirSync(OUT, { recursive: true }).filter((file) => file.endsWith(".html"));
for (const page of pages) {
  const file = path.join(OUT, page);
  const html = readFileSync(file, "utf8").replace(/\{\{(\w+)\}\}/g, (match, key) => cta[key] ?? match);
  writeFileSync(file, html);
}

execFileSync(
  path.join(ROOT, "node_modules/.bin/tailwindcss"),
  ["-i", "src/input.css", "-o", "public/dist/output.css", "--minify"],
  { cwd: ROOT, stdio: "inherit" }
);

console.log(`Built ${path.relative(ROOT, OUT)}/`);
