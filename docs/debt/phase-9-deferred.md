# Phase 9 — Deferred Items

This file tracks work that surfaced during Phase 9 implementation but was deferred for safety, scope, or external dependency reasons. Edmundo decides when each item gets resolved.

## Commit message format anomaly — Task 1
- The first commit on this branch (`c925db5`) uses the legacy format `Phase 9.1: ...` instead of the new convention `refactor(phase-9): ...` introduced in the updated runbook.
- Decision: NOT amended (per repo policy of preferring new commits over amending). Functionally identical work.
- Recommended action: squash-merge the branch on PR; the squash message can use the canonical format.

## Pre-existing uncommitted modifications (NOT touched in Phase 9)
At the start of Phase 9 the working tree had three pre-existing modifications carried in from prior work:
- `.DS_Store`
- `functions/package.json` (firebase-functions bumped 6.0.0 → 7.2.5)
- `functions/package-lock.json`

These remained uncommitted on the branch through Tasks 1-4. Task 5 adds a `pdfkit` dependency on top of these, so `functions/package.json` is now committed (with both the firebase-functions bump and the new pdfkit entry); `functions/package-lock.json` and `.DS_Store` still need Edmundo's attention out-of-band.

## Firestore Rules Update — REQUIRES MANUAL DEPLOY
- File: `firestore.rules`
- Change: Added `match /quiz_leads/{id}` rule allowing public create + authenticated read/update/delete (mirrors `guide_leads`)
- Deploy command (Edmundo): `firebase deploy --only firestore:rules`
- Verify: Firebase Console → Firestore → Rules tab shows `quiz_leads` rule
- Note: Without this deploy the homepage quiz form will fail with permission-denied errors in production

## Cloud Functions install + deploy — REQUIRES MANUAL ACTION
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

## Local visual verification of /soluciones/ rewrite — recommended
- The /soluciones/ page was rewritten end-to-end in Task 3 without local browser verification
- Recommend: `python3 -m http.server 8080` and visit http://localhost:8080/soluciones/ before merging
- Spot-check: 5 example cards render, top + bottom CTA boxes look correct, footer matches homepage 3-column structure

## /soluciones/<slug>/ subpages still use legacy "Mini Apps" framing — Phase 10
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

