#!/usr/bin/env node
/**
 * Lighthouse mobile. Reports LCP, CLS and accessibility.
 * Blocks only on accessibility below 90.
 *
 * Usage: node scripts/checks/lighthouse.mjs <url> [/path ...]
 */
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const [base, ...paths] = process.argv.slice(2);
const pages = paths.length ? paths : ["/"];
const dir = mkdtempSync(path.join(tmpdir(), "lighthouse-"));
let failed = false;

for (const [index, page] of pages.entries()) {
  const output = path.join(dir, `${index}.json`);
  execFileSync(
    "npx",
    [
      "-y",
      "lighthouse@13",
      base.replace(/\/$/, "") + page,
      "--quiet",
      "--output=json",
      `--output-path=${output}`,
      "--only-categories=accessibility,performance",
      "--chrome-flags=--headless=new",
    ],
    { stdio: ["ignore", "ignore", "inherit"] }
  );
  const { categories, audits } = JSON.parse(readFileSync(output, "utf8"));
  const accessibility = Math.round(categories.accessibility.score * 100);
  failed ||= accessibility < 90;
  console.log(
    `${accessibility < 90 ? "FALLA" : "OK   "} ${page}: accesibilidad ${accessibility}, ` +
      `LCP ${audits["largest-contentful-paint"].displayValue}, ` +
      `CLS ${audits["cumulative-layout-shift"].displayValue}`
  );
}
process.exit(failed ? 1 : 0);
