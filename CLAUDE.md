# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies (Tailwind CSS only)
npm install

# Compile CSS once
npm run build

# Watch mode — recompile CSS on file changes during development
npm run watch

# Local preview of the build (pages use {{calendly}}, {{whatsapp}} and {{form}} placeholders)
npm run build && python3 -m http.server 8080 -d public
```

Tests and checks:

```bash
npm run test:rules                                # Firestore rules (needs openjdk@21 in PATH)
npm run test:lead                                 # submitLead on the emulators
npm run build && npm run sitemap && npm run build # regenerate sitemap.xml from the build
npm run check -- <url>                            # sitemap, redirects, canonicals, links, forbidden text
node scripts/checks/contrast.mjs <url>            # WCAG AA on every page
node scripts/checks/lighthouse.mjs <url> / /expense-buddy
```

All of them must pass before a live deploy.

## Architecture

Static HTML5 site for a Chilean AI automation consulting firm. No JavaScript framework — pages are self-contained semantic HTML with vanilla JS for interactivity.

**Positioning:** Growth Buddies builds and implements operational tools with AI and leads with packaged products: Expense Buddy, DocFlow Buddy, Agent Buddy (Web and a medida). Custom work is the discreet fifth door: Proyecto a medida, a paid diagnostic of CLP 490.000 + IVA, 100% creditable within 90 days. The primary CTA is "Recibir propuesta en 24 horas hábiles", which goes to the form. Never promise a money-back guarantee, scarcity, payment through WhatsApp, SII validation, ERP integration, WhatsApp capture, electronic signature, "datos alojados en Chile" or "tipo de cambio oficial". Copy is Spanish (Chile), formal "usted", no em dashes. Never invent clients, numbers, logos or features.

**CSS pipeline:** `src/input.css` → Tailwind CLI → `public/dist/output.css` (`npm run watch` writes `dist/output.css` for local work). Semantic color tokens live in `src/input.css` and flip inside `.band-dark`; see `docs/design-system.md`. Fonts are Geist and Inter. Never use raw colors in pages.

**URL structure (clean URLs via Firebase Hosting):**

- `/expense-buddy`, `/docflow-buddy`, `/agent-buddy`, `/proyecto-a-medida` — product pages, with sector pages under `/expense-buddy/<slug>` and `/docflow-buddy/<slug>`
- `/servicios/<slug>/` — service pages
- `/soluciones` — implementation examples
- `/recursos/<slug>` — resources, including the quiz at `/recursos/diagnostico-rapido`
- `/blog/<slug>/` — articles
- `/metodologia/<slug>/` — 4-phase engagement process pages
- `/equipo/<slug>/` — team bios

**JavaScript patterns used across pages:**

- All scripts are inline IIFEs at the bottom of `<body>` — no external JS files
- Mobile menu toggle, sticky CTA bar (IntersectionObserver), UTM attribution capture (sessionStorage)
- Calendly embed loads only on desktop via `matchMedia('(min-width: 768px)')`
- All WhatsApp CTAs tracked with GA4 events; Microsoft Clarity also active
- **Lead form:** `src/lead-form.html` is injected by the build wherever a page has `<!-- lead-form -->` inside a `.lead-card[data-product]`. It posts to `/api/lead`.

**Accessibility conventions every page must follow:**

- Skip link: `<a href="#main-content" class="sr-only ...">Saltar al contenido</a>` as first element
- `aria-expanded` / `aria-label` on interactive controls
- `:focus-visible` with accent outline
- `prefers-reduced-motion` respected in CSS animations

**Deployment:** GitHub Actions deploys to Firebase Hosting on push to `main`, with a preview channel per pull request. `npm run build` assembles `public/` from an allowlist (`scripts/build-public.mjs`) and fills `{{calendly}}` and `{{whatsapp}}` from `src/cta.config.json`; open pages through the build, not the raw source. Config in `firebase.json`: clean URLs, no trailing slashes, cache headers. `www` → apex redirect lives in the Firebase custom domain.

**JSON-LD schemas** (`Organization`, `WebSite`, `VideoObject`, `FAQPage`, `HowTo`) are present in index.html for SEO/GEO — update them when brand info changes. The Organization schema includes `hasOfferCatalog` for the diagnostic product and `knowsAbout` for LLM discoverability.

## Firebase Backend

The `functions/` directory contains Firebase Cloud Functions (Node.js 22, v2 API, `us-central1`). Email is sent via Resend using the secret `RESEND_API_KEY`.

**Deploy commands:**

```bash
firebase deploy --only functions       # deploy Cloud Functions
firebase deploy --only firestore:rules # deploy Firestore security rules
firebase emulators:start --only functions  # local dev / testing
```

**Firestore collections and their triggers:**

- `leads/{leadId}` — written only by `submitLead` (source `proposal_form`), never from the browser; triggers `notifyNewLead`. These leads stay out of `sendFollowupSequence`
- `lead_limits/{hash}` — per-IP rate limit, server only
- `guide_leads/{leadId}` — guide download leads; triggers `sendGuideDelivery` (instant guide email + CRM alert); scheduled follow-ups on days 2/5/10
- `report_leads/{leadId}` — report requests; triggers `sendReportDelivery` (web report link + CRM alert)
- `calculator_leads/{leadId}` — ROI calculator leads; triggers `notifyCalcLead` (CRM alert only, no drip)

**Cloud Functions summary:**
| Export | Trigger | Purpose |
|--------|---------|---------|
| `sendGuideDelivery` | `guide_leads` created | Deliver guide PDF link + notify Edmundo |
| `sendReportDelivery` | `report_leads` created | Send web report link + notify Edmundo |
| `submitLead` | HTTP, `/api/lead` | Validate, honeypot, 5 per hour per IP, write to `leads` |
| `notifyNewLead` | `leads` created | Acknowledgment to the lead and alert to `LEAD_ALERT_TO` (default edmundo@spohr.cl) |
| `notifyCalcLead` | `calculator_leads` created | CRM alert for ROI calc submissions |
| `sendDay0Confirmation` | `leads` updated | Confirmation email when lead qualifies (step 2) |
| `sendFollowupSequence` | Scheduled (daily) | Drip sequence for both `leads` and `guide_leads` |

Email sender addresses: `edmundo@growthbuddies.cl` (From on the verified Resend domain, Reply-To `edmundo@spohr.cl`), `crm@growthbuddies.cl` (CRM alerts to `edmundo@spohr.cl`).

## Redesign records

`docs/redesign/PROGRESS.md` holds decisions and the deploy log. `docs/redesign/pendientes.md` holds what Edmundo must do. Expense Buddy screenshots come from `scripts/screenshots/expense-buddy.mjs`; DocFlow screenshots use local emulators only and stay unpublished until approved.
