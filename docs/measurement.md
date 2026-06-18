# Growth Buddies — Measurement Framework

**Last updated:** 2026-06-18  
**Owner:** Edmundo Spohr  
**Review cadence:** Monthly (first Monday of each month)

---

## 1. KPIs to track monthly

All metrics pulled from Google Search Console (GSC) unless noted.

### 1.1 Primary SEO KPIs

| KPI | Definition | Target (6-month) | Source |
|---|---|---|---|
| **Non-brand impressions** | Impressions for queries that do NOT contain "growth buddies" | Baseline → +40% | GSC › Performance › Queries (filter: exclude "growth buddies") |
| **Non-brand clicks** | Clicks from non-brand queries | Baseline → +50% | GSC › Performance (same filter) |
| **Non-brand avg. position** | Average ranking position for non-brand queries | ≤15 → ≤10 | GSC › Performance (same filter) |
| **Indexed pages** | Pages confirmed indexed by Google | Current: TBD → 35 | GSC › Indexing › Pages › "Indexed" count |
| **Coverage errors** | Pages with indexing issues (excluded, crawl errors) | 0 critical errors | GSC › Indexing › Pages |
| **Core Web Vitals: LCP** | Largest Contentful Paint — homepage | ≤2.5 s | GSC › Experience › Core Web Vitals |
| **Core Web Vitals: CLS** | Cumulative Layout Shift — homepage | ≤0.1 | GSC › Experience |

### 1.2 Per-page KPI targets

Track each keyword-map primary target individually in GSC:

| Page | Primary query | Position target | CTR target |
|---|---|---|---|
| `/` | `diagnóstico de automatización con IA` | ≤5 | ≥4% |
| `/servicios/legal-tech` | `automatización legal Chile` | ≤5 | ≥3% |
| `/servicios/ia-corporativa` | `asistente de IA para empresas Chile` | ≤8 | ≥3% |
| `/servicios/gestion-del-cambio` | `gestión del cambio tecnológico empresas` | ≤8 | ≥3% |
| `/sectores/automatizacion-ia-estudios-juridicos` | `automatización IA estudios jurídicos` | ≤5 | ≥4% |
| `/casos/spi-americas` | `caso de éxito automatización documental legal` | ≤8 | ≥3% |
| `/casos/hits-corredora` | `automatización corredora de seguros Chile` | ≤8 | ≥3% |
| `/blog/cuanto-cuesta-automatizar-empresa-chile` | `cuánto cuesta automatizar una empresa con IA Chile` | ≤8 | ≥4% |
| `/blog/legal-tech-para-abogados-chile` | `legal tech para abogados Chile` | ≤5 | ≥4% |
| `/blog/ia-para-revisar-contratos-legales` | `IA para revisar contratos` | ≤8 | ≥3% |
| `/colombia` | `automatización con IA Colombia` | ≤10 | ≥3% |
| `/peru` | `automatización con IA Perú` | ≤10 | ≥3% |
| `/ecuador` | `automatización con IA Ecuador` | ≤10 | ≥3% |
| `/recursos/informe-automatizacion-servicios-latam` | `automatización IA LATAM informe 2026` | ≤10 | ≥5% |

### 1.3 AI-citation share (GEO)

Track monthly whether Growth Buddies is cited in AI answers for the target queries. Record as a fraction of prompts tested (see Section 3).

| Month | ChatGPT citations / 10 | Perplexity citations / 10 | Claude citations / 10 |
|---|---|---|---|
| Jun 2026 (baseline) | — / 10 | — / 10 | — / 10 |
| Jul 2026 | — / 10 | — / 10 | — / 10 |
| Aug 2026 | — / 10 | — / 10 | — / 10 |
| Sep 2026 | — / 10 | — / 10 | — / 10 |

---

## 2. Monthly Search Console review checklist

Run this review on the **first Monday of each month**. Takes ~30 minutes.

### Step A — Overall health (5 min)
- [ ] Open GSC › Indexing › Pages. Note "Indexed" count vs. sitemap count (35 URLs). Any delta → investigate.
- [ ] Check "Not indexed — reason" — flag any new Discovered/Crawled but not indexed pages; if stuck >6 weeks, request indexing.
- [ ] Check Core Web Vitals: any new "Poor" URLs? If yes, open PageSpeed Insights for that URL.

### Step B — Striking-distance queries (10 min)

In GSC › Performance › Search results:
- Date range: Last 28 days
- Filter: Position between 5 and 20
- Sort by: Impressions (descending)

This is your **opportunity list**. For each URL with ≥100 impressions at position 5–20:
- [ ] Check the H1 — does it exactly match or closely contain the query phrase?
- [ ] Check if a FAQ or answer capsule addresses the query directly — if not, add one.
- [ ] Check internal links — is this page linked from the pillar and homepage footer?
- [ ] If position 10–20: consider adding the query to an existing supporting post as a section subheading.

### Step C — High-impression / low-CTR pages (10 min)

In GSC › Performance, filter by page. Sort by Impressions descending. For each page with CTR < 2% and ≥500 impressions:
- [ ] Review the `<title>` — is it specific and benefit-led? Does it match what the searcher wants?
- [ ] Review the meta description — does it have a clear value prop + call to action?
- [ ] Check if a featured snippet or rich result is occupying position 0 (stealing clicks)
- [ ] If the page is a blog post: consider tightening the H1 to be more searcher-intent-aligned.

### Step D — Country pages and hreflang (5 min)
- [ ] In GSC, switch property to `growthbuddies.cl`. Check International Targeting report. Any hreflang errors?
- [ ] Check impressions for `/colombia`, `/peru`, `/ecuador` — is each growing MoM?
- [ ] If any country page has 0 impressions after 4 weeks of indexing, verify it's indexed and hreflang is reciprocal (run `bash scripts/check-hreflang.sh`).

### Step E — Record metrics in this document
Update the KPI table in Section 1.2 with current position per target page.

---

## 3. AI-citation baseline test

Run these prompts **once per month** (first week). Test in:
- **ChatGPT** (GPT-4o, no search plugin, incognito)
- **Perplexity** (default web search mode)
- **Claude** (claude.ai, no projects, incognito)

Record: **C** = cited with URL or name, **M** = mentioned without URL, **X** = not cited, **?** = can't tell.

### Prompt list

| # | Prompt | Intent |
|---|---|---|
| 1 | `¿Qué consultoras de automatización con IA para empresas de servicios recomendarías en Chile?` | Brand awareness |
| 2 | `Busco una consultora en Chile que haga un diagnóstico de automatización con IA para mi empresa. ¿Qué opciones existen?` | Transactional — diagnostic |
| 3 | `¿Cómo automatizar procesos en un estudio jurídico en Chile con inteligencia artificial?` | Informational — legal sector |
| 4 | `¿Cuánto cuesta automatizar una empresa con IA en Chile?` | Commercial — pricing |
| 5 | `¿Qué consultoras de IA trabajan en Colombia para empresas de servicios profesionales?` | Brand awareness — Colombia |
| 6 | `Dame un ejemplo real de automatización con IA en una firma de abogados en Latinoamérica.` | Informational — case study |
| 7 | `¿Qué es el diagnóstico de automatización y cuánto cuesta?` | Product awareness |
| 8 | `¿Qué es la gestión del cambio en proyectos de IA? ¿Qué consultoras en Chile tienen certificación Prosci?` | Niche authority |
| 9 | `¿Cuál es el ROI típico de automatizar procesos con IA en empresas de servicios en Latinoamérica?` | Research — benchmark |
| 10 | `¿Quién es Edmundo Spohr y a qué se dedica?` | Personal brand |

### Citation tracking table

| Prompt # | ChatGPT (Jun) | Perplexity (Jun) | Claude (Jun) | ChatGPT (Jul) | Perplexity (Jul) | Claude (Jul) |
|---|---|---|---|---|---|---|
| 1 | — | — | — | — | — | — |
| 2 | — | — | — | — | — | — |
| 3 | — | — | — | — | — | — |
| 4 | — | — | — | — | — | — |
| 5 | — | — | — | — | — | — |
| 6 | — | — | — | — | — | — |
| 7 | — | — | — | — | — | — |
| 8 | — | — | — | — | — | — |
| 9 | — | — | — | — | — | — |
| 10 | — | — | — | — | — | — |
| **Score** | **— / 10** | **— / 10** | **— / 10** | **— / 10** | **— / 10** | **— / 10** |

**Scoring:** C = 1 point, M = 0.5 point, X/? = 0. Target: ≥6/10 across all three platforms by Q4 2026.

---

## 4. Post-deploy checklist (one-time, after merging to main)

Complete these steps immediately after Vercel deploys the `feat/quiet-authority-design` branch to production.

### 4.1 Submit sitemap in Google Search Console
- [ ] Open [search.google.com/search-console](https://search.google.com/search-console) → property `growthbuddies.cl`
- [ ] Go to Sitemaps (left sidebar)
- [ ] Remove any old sitemap entry if present
- [ ] Submit: `https://growthbuddies.cl/sitemap.xml`
- [ ] Confirm status shows "Success" within ~5 minutes

### 4.2 Request indexing for priority new URLs

Use GSC › URL Inspection → enter URL → "Request indexing" for each, **in this order**:

**Tier 1 — request within 24h of deploy**
1. `https://growthbuddies.cl/sectores/automatizacion-ia-estudios-juridicos`
2. `https://growthbuddies.cl/colombia`
3. `https://growthbuddies.cl/peru`
4. `https://growthbuddies.cl/ecuador`
5. `https://growthbuddies.cl/recursos/informe-automatizacion-servicios-latam`

**Tier 2 — request within 48h of deploy**
6. `https://growthbuddies.cl/blog/legal-tech-para-abogados-chile`
7. `https://growthbuddies.cl/blog/ia-para-revisar-contratos-legales`
8. `https://growthbuddies.cl/blog/cuanto-cuesta-legal-tech-chile`
9. `https://growthbuddies.cl/sectores`
10. `https://growthbuddies.cl/blog/cuanto-cuesta-automatizar-empresa-chile` (was noindex → now index)
11. `https://growthbuddies.cl/blog/agentes-ia-para-empresas-chile` (was noindex → now index)
12. `https://growthbuddies.cl/blog/automatizacion-ia-corredoras-propiedades-chile` (was noindex → now index)

> **Note:** GSC limits ~10 manual index requests/day per property. Space Tier 2 into the next day.

### 4.3 Verify hreflang in International Targeting
- [ ] GSC › Settings › International Targeting → Language tab. No errors.
- [ ] If errors appear, run `bash scripts/check-hreflang.sh` locally and fix before the next crawl.

### 4.4 Verify rich results in Rich Results Test
Test these URLs at [search.google.com/test/rich-results](https://search.google.com/test/rich-results):
- [ ] `https://growthbuddies.cl/` — expect: FAQPage, VideoObject, Organization
- [ ] `https://growthbuddies.cl/sectores/automatizacion-ia-estudios-juridicos` — expect: FAQPage, BreadcrumbList
- [ ] `https://growthbuddies.cl/casos/spi-americas` — expect: BreadcrumbList
- [ ] `https://growthbuddies.cl/blog/legal-tech-para-abogados-chile` — expect: BlogPosting, BreadcrumbList
- [ ] `https://growthbuddies.cl/recursos/informe-automatizacion-servicios-latam` — expect: Article, Dataset, FAQPage
- [ ] `https://growthbuddies.cl/preguntas-frecuentes` — expect: FAQPage

### 4.5 Confirm robots.txt is correct
- [ ] Visit `https://growthbuddies.cl/robots.txt` — confirm AI bots are allowed and `Sitemap:` line points to the correct URL.
- [ ] Visit `https://growthbuddies.cl/sitemap.xml` — confirm it renders without XML errors (35 URLs).

### 4.6 Add GSC property to Bing Webmaster Tools
- [ ] Sign in at [bing.com/webmasters](https://www.bing.com/webmasters) with the same Google account
- [ ] Import from GSC (one-click import). Submit sitemap.

### 4.7 Set up monthly reminder
- [ ] Schedule a recurring calendar event: "GSC Monthly Review — Growth Buddies" on the first Monday of each month. Link this document.

---

## 5. Lighthouse spot-check results

Run via `npx lighthouse <url> --output=json --chrome-flags="--headless"` or Chrome DevTools › Lighthouse. Targets: Performance ≥90, SEO =100, Accessibility ≥95.

> **Note:** Lighthouse requires a deployed/live URL. These results must be filled in after the first deploy to production.

| Template | URL | Performance | SEO | Accessibility | Best Practices | Date |
|---|---|---|---|---|---|---|
| Homepage | `https://growthbuddies.cl/` | — | — | — | — | post-deploy |
| Service page | `https://growthbuddies.cl/servicios/legal-tech` | — | — | — | — | post-deploy |
| Blog post | `https://growthbuddies.cl/blog/legal-tech-para-abogados-chile` | — | — | — | — | post-deploy |

**Known potential performance issues to watch:**
- Hero video (`/vid/hero.mp4`) — confirm it has `preload="none"` and poster image to avoid LCP penalty
- Calendly embed — loads conditionally only on desktop via `matchMedia`, should not block LCP
- Web fonts (Geist) — preloaded with `<link rel="preload">`, should be fine

---

## 6. Reference links

| Resource | URL |
|---|---|
| Google Search Console | https://search.google.com/search-console |
| Bing Webmaster Tools | https://www.bing.com/webmasters |
| Rich Results Test | https://search.google.com/test/rich-results |
| PageSpeed Insights | https://pagespeed.web.dev |
| hreflang validator | https://www.hreflang.org/checker |
| Schema.org validator | https://validator.schema.org |
| sitemap.xml (live) | https://growthbuddies.cl/sitemap.xml |
| robots.txt (live) | https://growthbuddies.cl/robots.txt |
| llms.txt (live) | https://growthbuddies.cl/llms.txt |
| keyword-map.md | docs/keyword-map.md |
| hreflang check script | scripts/check-hreflang.sh |
| broken-link scanner | scripts/check-links.js |
