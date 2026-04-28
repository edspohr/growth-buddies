# Phase 9 — Deferred Items

This file tracks work that surfaced during Phase 9 implementation but was deferred for safety, scope, or external dependency reasons. Edmundo decides when each item gets resolved.

_Last updated: 2026-04-28_

## Pending

### Commit message format anomaly — Task 1
- The first commit on this branch (`c925db5`) uses the legacy format `Phase 9.1: ...` instead of the new convention `refactor(phase-9): ...` introduced in the updated runbook.
- Decision: NOT amended (per repo policy of preferring new commits over amending). Functionally identical work.
- Recommended action: squash-merge the branch on PR; the squash message can use the canonical format.

### Firestore Rules Update — REQUIRES MANUAL DEPLOY
- File: `firestore.rules`
- Change: Added `match /quiz_leads/{id}` rule allowing public create + authenticated read/update/delete (mirrors `guide_leads`)
- Deploy command (Edmundo): `firebase deploy --only firestore:rules`
- Verify: Firebase Console → Firestore → Rules tab shows `quiz_leads` rule
- Note: Without this deploy the homepage quiz form will fail with permission-denied errors in production

### Cloud Functions install + deploy — REQUIRES MANUAL ACTION
- Directory: `functions/`
- New dep: `pdfkit ^0.15.0` (added to `functions/package.json`, NOT installed by Claude)
- New files: `functions/sendQuizReport.js`, `functions/sendQuizFollowup.js`
- New exports wired in `functions/index.js`: `sendQuizReport`, `sendQuizFollowup`
- Steps for Edmundo:
  1. `cd functions && npm install` — installs pdfkit
  2. `firebase deploy --only functions:sendQuizReport,functions:sendQuizFollowup`
  3. Verify in Firebase Console → Functions: both deployed in us-central1, status OK
  4. Smoke-test by creating a `quiz_leads` document in Firestore Console with the schema documented in the deploy checklist
- Note: `sendQuizFollowup` is scheduled `every day 14:00 America/Santiago` (Cloud Scheduler will be created on first deploy — may also require enabling the Cloud Scheduler API in GCP if not already enabled)
- Note: Without these deploys, quiz_leads docs will be created in Firestore but no PDF/email will be sent

### /soluciones/<slug>/ subpages still use legacy "Mini Apps" framing — Phase 10
Task 3 only rewrote `/soluciones/index.html`. The five subpages still contain legacy terminology:
- `soluciones/automatizacion-legal-emails/index.html` — "Catálogo Mini Apps" eyebrow tag
- `soluciones/rendicion-gastos-ia/index.html` — "Catálogo Mini Apps" eyebrow + "Caja Negra" section title
- `soluciones/gestion-documental-ip/index.html` — "Catálogo Mini Apps" eyebrow tag
- `soluciones/brokeria/index.html` — "Catálogo Mini Apps" eyebrow + 3× "Caja Negra" labels
- `soluciones/catalogo.html` — entire page is the legacy Mini Apps catalog with full Caja Negra/Entrada/Resultado scaffolding (the canonical /soluciones/ replaces this — consider whether `catalogo.html` should be deleted, redirected, or rewritten)

These pages are now linked only from breadcrumbs on the soluciones detail pages and from sitemap/SEO crawl, so they're lower-stakes than the homepage and /soluciones/. Recommended Phase 10 task: align eyebrows + remove the Caja Negra/Entrada/Resultado scaffolding to match the new "implementation example" frame.

Verification grep remaining after Phase 9:
```
grep -rn "Mini Apps Plug\|Caja Negra\|Catálogo Mini" --include="*.html"
```
Returns 21 hits across the 5 files above.

## Resolved during deploy prep

### ✓ RESOLVED — Pre-existing uncommitted modifications (`.DS_Store`, `functions/package-lock.json`)
At the start of Phase 9 the working tree had three pre-existing modifications carried in from prior work: `.DS_Store`, `functions/package.json` (firebase-functions 6.0.0 → 7.2.5), `functions/package-lock.json`. `package.json` was committed alongside Task 5's pdfkit addition. The remaining two were resolved out-of-band:
- `.DS_Store` untracked and added to `.gitignore` — commit `efc5c77`
- `functions/package-lock.json` synced with firebase-functions 7 + pdfkit — commit `d07d926`

### ✓ RESOLVED — Local visual verification of /soluciones/ rewrite
The page was opened locally on http://localhost:8080/soluciones/ and visually confirmed during deploy prep: H1 reads "Ejemplos de Implementación", 5 example cards render with Hallazgo/Implementación/Resultado structure, top CTA box and bottom CTA section render correctly, footer matches the homepage 3-column structure. Grep for legacy terms on /soluciones/index.html returns zero hits.

### ✓ RESOLVED — Hero video .webm 404 (pre-existing console error)
`vid/hero.webm` was referenced in the desktop video-source injection but the file didn't exist, producing a 404 on every homepage visit. Resolved by compressing `vid/hero.mp4` from 7.8 MB → 2.1 MB and removing the webm `<source>` from the JS injection (a webm experiment compressed worse than the mp4 for this short clip, so it was dropped):
- Original debt logged — commit `7674f9e`
- Compression + webm-fallback removal — commit `4ba6e1c`
- Debt entry deleted from this file — commit `17a2c60`
