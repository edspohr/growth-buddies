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

**CSS pipeline:** `src/input.css` → Tailwind CLI → `dist/output.css`. Custom colors (`accent: #00f6ff`, `dark: #050510`), fonts (Inter/Space Grotesk), and animations are defined in `tailwind.config.js`.

**URL structure (clean URLs via Vercel):**
- `/servicios/<slug>/` — 6 service landing pages
- `/soluciones/<slug>/` — 5 product/Mini App pages (exception: `catalogo.html` uses `.html` with anchor navigation)
- `/blog/<slug>/` — articles
- `/metodologia/<slug>/` — 4-phase engagement process pages
- `/equipo/<slug>/` — team bios

**JavaScript patterns used across pages:**
- All scripts are inline IIFEs at the bottom of `<body>` — no external JS files
- Mobile menu toggle, exit-intent modal (sessionStorage), sticky CTA bar (IntersectionObserver), ROI calculator → WhatsApp link
- Calendly embed loads only on desktop via `matchMedia('(min-width: 768px)')`
- All WhatsApp CTAs tracked with GA4 events; Microsoft Clarity also active

**Accessibility conventions every page must follow:**
- Skip link: `<a href="#main-content" class="sr-only ...">Saltar al contenido</a>` as first element
- `aria-expanded` / `aria-label` on interactive controls
- `:focus-visible` with cyan outline
- `prefers-reduced-motion` respected in CSS animations

**Deployment:** Vercel auto-deploys on push to `main`. Config in `vercel.json` — clean URLs, no trailing slashes, long-cache headers for static assets, `www` → apex redirect.

**JSON-LD schemas** (`Organization`, `WebSite`, `VideoObject`) are present in index.html for SEO — update them when brand info changes.
