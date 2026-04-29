# Phase 9 — Deployment Checklist

**Branch:** `phase-9-conversion-focus`
**Status:** All tasks committed locally. Ready for review and manual deploy.

## Step 1 — Code Review (Edmundo)

```bash
# View all commits in the branch
git log main..phase-9-conversion-focus --oneline

# Review file changes
git diff main..phase-9-conversion-focus

# Optional: review by file
git diff main..phase-9-conversion-focus -- index.html
git diff main..phase-9-conversion-focus -- soluciones/index.html
git diff main..phase-9-conversion-focus -- nosotros/index.html
```

## Step 2 — Local Final Test

```bash
git checkout phase-9-conversion-focus
npm run build
python3 -m http.server 8080
```

Open http://localhost:8080 and verify:
- [ ] Hero CTA says "Agendar conversación con el director →"
- [ ] Nav does NOT show "Soluciones"
- [ ] Quiz section appears between "Cómo Trabajamos" and "Reseñas en Google"
- [ ] Quiz flow works through all 7 questions (don't submit — backend not deployed yet)
- [ ] Mobile sticky CTA shows new text
- [ ] /soluciones/ page shows "Ejemplos de Implementación", not "Mini Apps"
- [ ] /nosotros/ shows new H1
- [ ] Footer shows 3 columns (Brand / Empresa / Recursos)

## Step 3 — Deploy Order (CRITICAL — follow this exact sequence)

### 3.1 — Deploy Firestore rules FIRST
```bash
firebase deploy --only firestore:rules
```
Verify in Firebase Console → Firestore → Rules tab that `quiz_leads` rule is present.

**Why first:** If we deploy hosting before this, the quiz form will be visible but submissions will fail with permission denied.

### 3.2 — Install Cloud Function dependencies
```bash
cd functions
npm install
cd ..
```

### 3.3 — Deploy Cloud Functions
```bash
firebase deploy --only functions:sendQuizReport,functions:sendQuizFollowup
```

Verify in Firebase Console → Functions:
- `sendQuizReport` — status OK, region us-central1, trigger Firestore document
- `sendQuizFollowup` — status OK, region us-central1, trigger Pub/Sub schedule

### 3.4 — Smoke test the backend (CRITICAL)

Before merging to main, do a private smoke test:
1. Create a test document directly in Firestore Console:
   - Collection: `quiz_leads`
   - Fields:
     - `email`: your personal test email
     - `company`: "Test"
     - `answers`: `{ sector: 'legal', size: '15-30', pain1: 'docs', pain2: '5-15', tools: 'office', previous: 'no', urgency: 'now' }`
     - `tags`: `['legal', 'mid', 'docs', 'compliance']`
     - `opportunities`: `['Validación documental con IA', 'Triaje legal automático', 'Base de conocimientos pasiva']`
     - `timestamp`: server timestamp
     - `followup_sent`: false
     - `source`: 'manual_smoke_test'

2. Verify within 2 minutes:
   - You receive an email with PDF attachment
   - `edmundo@spohr.cl` receives the CRM alert
   - The PDF opens correctly and contains the 3 opportunities

3. If all good, delete the test document.
4. If any failure, do NOT proceed to step 3.5. Debug first.

### 3.5 — Merge to main and deploy hosting
```bash
git checkout main
git merge phase-9-conversion-focus --no-ff
git push origin main
```

Vercel will auto-deploy the static site within 1-2 minutes.

### 3.6 — Production verification (within 10 min of deploy)

- [ ] Visit https://growthbuddies.cl and verify the new hero text
- [ ] Open the quiz, complete all 7 questions, submit with your real email
- [ ] Verify the PDF email arrives within 2 minutes
- [ ] Verify the CRM alert arrives at edmundo@spohr.cl
- [ ] Open Firebase Console → Firestore and confirm the new `quiz_leads` document exists
- [ ] Test on mobile (iOS Safari + Android Chrome)
- [ ] Run a fresh PageSpeed test to confirm no regression from Phase 8

### 3.7 — If anything fails

```bash
# Roll back hosting (Vercel)
git revert HEAD --no-edit
git push origin main

# Roll back functions if needed
firebase functions:delete sendQuizReport sendQuizFollowup --region us-central1

# Roll back firestore rules
git checkout main~1 -- firestore.rules
firebase deploy --only firestore:rules
```

## Step 4 — Post-Deploy Tasks

- [ ] Add the 7-day followup test to your calendar (verify it fires for the smoke test lead)
- [ ] Review docs/debt/phase-9-deferred.md and clear or address remaining items
- [ ] Update CLAUDE.md to reflect the new quiz collection and functions
- [ ] Update README.md homepage features section

## Step 5 — Cleanup

After 7-14 days of clean operation:
```bash
git branch -d phase-9-conversion-focus
git push origin --delete phase-9-conversion-focus
```
