#!/usr/bin/env node
/**
 * Builds the deployable site into public/ from an explicit allowlist.
 * Nothing outside these lists is published (docs, functions, scripts, markdown).
 *
 * Usage: node scripts/build-public.mjs
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
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
  "agent-buddy",
  "blog",
  "casos",
  "colombia",
  "docflow-buddy",
  "ecuador",
  "equipo",
  "expense-buddy",
  "fonts",
  "gracias",
  "img",
  "metodologia",
  "nosotros",
  "peru",
  "preguntas-frecuentes",
  "privacidad",
  "diagnostico",
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

execFileSync(
  path.join(ROOT, "node_modules/.bin/tailwindcss"),
  ["-i", "src/input.css", "-o", "public/dist/output.css", "--minify"],
  { cwd: ROOT, stdio: "inherit" }
);

// CTA destinations live in one file; source pages use {{calendly}} and {{whatsapp}}.
const cta = JSON.parse(readFileSync(path.join(ROOT, "src/cta.config.json"), "utf8"));
// The CSS is cached for a day, so its URL changes with its content. Otherwise a
// returning visitor gets new HTML with old styles.
const css = readFileSync(path.join(OUT, "dist/output.css"));
const cssVersion = createHash("sha256").update(css).digest("hex").slice(0, 10);
const leadForm = readFileSync(path.join(ROOT, "src/lead-form.html"), "utf8");
const productsStrip = readFileSync(path.join(ROOT, "src/products-strip.html"), "utf8");
const pages = readdirSync(OUT, { recursive: true }).filter((file) => file.endsWith(".html"));
for (const page of pages) {
  const file = path.join(OUT, page);
  const html = readFileSync(file, "utf8")
    .replace(/<!-- lead-form -->/g, leadForm)
    .replace(/<!-- products-strip -->/g, productsStrip)
    .replace(/(["'])[^"']*dist\/output\.css\1/g, `$1/dist/output.css?v=${cssVersion}$1`)
    .replace(/\{\{(\w+)\}\}/g, (match, key) => cta[key] ?? match);
  writeFileSync(file, html);
}

console.log(`Built ${path.relative(ROOT, OUT)}/`);
