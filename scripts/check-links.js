#!/usr/bin/env node
/**
 * Internal broken-link scanner for the Growth Buddies static site.
 * Crawls every local HTML file, extracts href/src attributes that point to
 * internal paths (starting with / but not http, mailto, tel, #),
 * and checks whether a matching file exists on disk.
 *
 * Vercel clean-URL rules applied:
 *   /foo        → foo/index.html  OR  foo.html
 *   /foo/       → foo/index.html
 *   /foo.html   → foo.html
 *
 * Usage: node scripts/check-links.js [--fix] [--verbose]
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const VERBOSE = process.argv.includes("--verbose");

// ── Gather all HTML files ───────────────────────────────────────────────────
function getAllHtml(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const skip = ["node_modules", "functions", ".git", "lib"];
      if (skip.includes(entry.name)) continue;
      getAllHtml(path.join(dir, entry.name), files);
    } else if (entry.name.endsWith(".html")) {
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

// ── Resolve an internal href to a filesystem path ───────────────────────────
function resolveHref(href) {
  // Strip query string and hash
  const clean = href.split("?")[0].split("#")[0];
  if (!clean || clean === "/") return path.join(ROOT, "index.html");

  // Absolute path candidates
  const candidates = [];

  if (clean.endsWith(".html") || clean.endsWith(".css") || clean.endsWith(".js") ||
      clean.endsWith(".webp") || clean.endsWith(".png") || clean.endsWith(".jpg") ||
      clean.endsWith(".svg") || clean.endsWith(".xml") || clean.endsWith(".txt") ||
      clean.endsWith(".pdf") || clean.endsWith(".woff2") || clean.endsWith(".webmanifest") ||
      clean.endsWith(".mp4")) {
    candidates.push(path.join(ROOT, clean));
  } else {
    // Clean URL: /foo → foo/index.html or foo.html
    candidates.push(path.join(ROOT, clean, "index.html"));
    candidates.push(path.join(ROOT, clean + ".html"));
    candidates.push(path.join(ROOT, clean.replace(/\/$/, ""), "index.html"));
  }
  return candidates;
}

// ── Extract internal hrefs from HTML ────────────────────────────────────────
function extractLinks(html) {
  const links = new Set();
  // href and src attributes
  const re = /(?:href|src)=["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const val = m[1].trim();
    // Only internal absolute paths; skip anchors-only, mailto, tel, http, data
    if (val.startsWith("/") &&
        !val.startsWith("//") &&
        !val.startsWith("http") &&
        !val.startsWith("mailto") &&
        !val.startsWith("tel:") &&
        !val.startsWith("data:")) {
      links.add(val);
    }
  }
  return links;
}

// ── Static asset dirs that always exist (don't flag them) ───────────────────
const KNOWN_PREFIXES = ["/dist/", "/img/", "/fonts/", "/vid/", "/js/"];

function isKnownAsset(href) {
  return KNOWN_PREFIXES.some(p => href.startsWith(p));
}

// ── Main ─────────────────────────────────────────────────────────────────────
const htmlFiles = getAllHtml(ROOT);
const broken = [];
const checked = new Set();

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const links = extractLinks(html);
  const relFile = path.relative(ROOT, file);

  for (const href of links) {
    const key = href;
    if (isKnownAsset(href)) continue;

    const candidates = resolveHref(href);
    const candidateList = Array.isArray(candidates) ? candidates : [candidates];
    const exists = candidateList.some(c => fs.existsSync(c));

    if (!exists) {
      broken.push({ file: relFile, href, candidates: candidateList.map(c => path.relative(ROOT, c)) });
      if (VERBOSE) console.log(`  BROKEN [${relFile}] → ${href}`);
    }
  }
}

// ── Report ───────────────────────────────────────────────────────────────────
console.log("");
console.log("══════════════════════════════════════════════════");
console.log("  Internal broken-link scan");
console.log(`  Scanned: ${htmlFiles.length} HTML files`);
console.log("══════════════════════════════════════════════════");

if (broken.length === 0) {
  console.log("  ✓ Zero broken internal links found.");
} else {
  // Group by href for deduplication
  const byHref = {};
  for (const b of broken) {
    if (!byHref[b.href]) byHref[b.href] = { href: b.href, candidates: b.candidates, files: [] };
    byHref[b.href].files.push(b.file);
  }
  const unique = Object.values(byHref);
  console.log(`  ✗ ${unique.length} unique broken paths (${broken.length} total occurrences)`);
  console.log("");
  for (const b of unique) {
    console.log(`  HREF: ${b.href}`);
    console.log(`    Used in: ${b.files.slice(0,3).join(", ")}${b.files.length > 3 ? ` +${b.files.length-3} more` : ""}`);
    console.log(`    Looked for: ${b.candidates.join(", ")}`);
    console.log("");
  }
}

console.log("══════════════════════════════════════════════════");
console.log("");

process.exit(broken.length > 0 ? 1 : 0);
