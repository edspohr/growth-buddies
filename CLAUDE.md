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

# Local dev server (no build step required for HTML/JS)
python3 -m http.server 8080
```

There are no linting or testing tools. This is a static site with CSS preprocessing only.

## Architecture

Static HTML5 site for a Chilean AI automation consulting firm. No JavaScript framework — pages are self-contained semantic HTML with vanilla JS for interactivity.

**Positioning:** Growth Buddies is positioned as a **strategic diagnostic consultant**, not an implementation agency. The primary CTA everywhere is "Sesión de Calificación" (30-min qualification call) or "Evaluar si califica". The main paid product is the Diagnóstico de Automatización Estratégica (USD $3,000, 2-week engagement). Avoid language like "auditoría gratuita" or "Automatizamos lo aburrido" — these belong to the old positioning.

**CSS pipeline:** `src/input.css` → Tailwind CLI → `dist/output.css`. Custom colors (`accent: #00f6ff`, `dark: #050510`), fonts (Inter/Space Grotesk), and animations are defined in `tailwind.config.js`.

**URL structure (clean URLs via Vercel):**
- `/servicios/<slug>/` — 6 service landing pages
- `/soluciones/<slug>/` — 5 product/Mini App pages (exception: `catalogo.html` uses `.html` with anchor navigation)
- `/blog/<slug>/` — articles
- `/metodologia/<slug>/` — 4-phase engagement process pages
- `/equipo/<slug>/` — team bios

**JavaScript patterns used across pages:**
- All scripts are inline IIFEs at the bottom of `<body>` — no external JS files
- Mobile menu toggle, sticky CTA bar (IntersectionObserver), UTM attribution capture (sessionStorage)
- Calendly embed loads only on desktop via `matchMedia('(min-width: 768px)')`
- All WhatsApp CTAs tracked with GA4 events; Microsoft Clarity also active
- **index.html has no contact form** — the contacto section uses direct Calendly/WhatsApp CTAs only. No Firebase JS on the homepage.

**Accessibility conventions every page must follow:**
- Skip link: `<a href="#main-content" class="sr-only ...">Saltar al contenido</a>` as first element
- `aria-expanded` / `aria-label` on interactive controls
- `:focus-visible` with cyan outline
- `prefers-reduced-motion` respected in CSS animations

**Deployment:** Vercel auto-deploys on push to `main`. Config in `vercel.json` — clean URLs, no trailing slashes, long-cache headers for static assets, `www` → apex redirect.

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
- `leads/{leadId}` — main contact form leads; triggers `sendDay0Confirmation` on update, `sendFollowupSequence` (scheduled daily) sends days 1/3/7 follow-ups
- `guide_leads/{leadId}` — guide download leads; triggers `sendGuideDelivery` (instant guide email + CRM alert); scheduled follow-ups on days 2/5/10
- `calculator_leads/{leadId}` — ROI calculator leads; triggers `notifyCalcLead` (CRM alert only, no drip)

**Cloud Functions summary:**
| Export | Trigger | Purpose |
|--------|---------|---------|
| `sendGuideDelivery` | `guide_leads` created | Deliver guide PDF link + notify Edmundo |
| `notifyNewLead` | `leads` created | CRM alert email to Edmundo |
| `notifyCalcLead` | `calculator_leads` created | CRM alert for ROI calc submissions |
| `sendDay0Confirmation` | `leads` updated | Confirmation email when lead qualifies (step 2) |
| `sendFollowupSequence` | Scheduled (daily) | Drip sequence for both `leads` and `guide_leads` |

Email sender addresses: `edmundo@growthbuddies.cl` (to leads), `crm@growthbuddies.cl` (CRM alerts to `edmundo@spohr.cl`).
