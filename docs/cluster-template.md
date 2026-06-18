# Growth Buddies — Content Cluster Template

**Purpose:** Reusable structure for vertical ICP content clusters (pillar + supporting posts).  
**Last updated:** 2026-06-18  
**Convention:** Spanish "usted", no invented metrics, primary CTA = "Sesión de Calificación".

---

## Cluster anatomy

Each vertical produces **4 pages**:

| Page | Path pattern | Schema | Primary intent |
|------|-------------|--------|----------------|
| Pillar | `/sectores/<slug>/index.html` | WebPage + FAQPage + BreadcrumbList | Commercial investigation (C) |
| Supporting post 1 | `/blog/<query-slug>/index.html` | BlogPosting + BreadcrumbList | Informational/Commercial (I/C) |
| Supporting post 2 | `/blog/<query-slug>/index.html` | BlogPosting + BreadcrumbList | I/C |
| Supporting post 3 | `/blog/<query-slug>/index.html` | BlogPosting + BreadcrumbList | I/C |

Pillar links out to all 3 posts. Every post links back to the pillar and to the relevant `/servicios/` page.

---

## Pillar page HTML skeleton

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <!-- [HEAD BLOCK — copy from existing service pages] -->
  <title>[Primary query, title-cased] para [ICP] en Chile | Growth Buddies</title>
  <meta name="description" content="[150-160 char description targeting primary query]" />
  <link rel="canonical" href="https://growthbuddies.cl/sectores/[slug]" />
  <meta property="og:type" content="website" />
  <!-- ... OG, Twitter, analytics, fonts, CSS ... -->

  <!-- JSON-LD: BreadcrumbList -->
  <script type="application/ld+json">
  { "@context":"https://schema.org", "@type":"BreadcrumbList",
    "itemListElement": [
      { "@type":"ListItem","position":1,"name":"Inicio","item":"https://growthbuddies.cl/" },
      { "@type":"ListItem","position":2,"name":"Sectores","item":"https://growthbuddies.cl/sectores" },
      { "@type":"ListItem","position":3,"name":"[Sector name]","item":"https://growthbuddies.cl/sectores/[slug]" }
    ] }
  </script>

  <!-- JSON-LD: WebPage (speakable) -->
  <script type="application/ld+json">
  { "@context":"https://schema.org", "@type":"WebPage",
    "name":"[H1]",
    "url":"https://growthbuddies.cl/sectores/[slug]",
    "speakable":{ "@type":"SpeakableSpecification","cssSelector":["h1",".speakable","#answer-capsule"] },
    "about":{ "@type":"Thing","name":"[sector topic]" }
  }
  </script>

  <!-- JSON-LD: FAQPage (mirror FAQ accordion exactly) -->
  <script type="application/ld+json">
  { "@context":"https://schema.org", "@type":"FAQPage",
    "mainEntity": [
      { "@type":"Question","name":"[Question text exactly as shown on page]",
        "acceptedAnswer":{ "@type":"Answer","text":"[Answer text exactly as shown on page]" } }
    ] }
  </script>
</head>
<body>
  <!-- skip link -->
  <!-- noise-overlay -->
  <!-- nav (glass-nav, mobile menu) -->

  <main id="main-content">

    <!-- HERO -->
    <header class="relative pt-36 pb-16 px-6 overflow-hidden">
      <!-- gradient bg -->
      <!-- breadcrumb nav -->
      <h1>[Primary query H1]</h1>
      <p>[120-150 char subhead summarising the value prop for this sector]</p>
      <!-- CTA: "Agende su sesión de calificación" → calendly link -->
    </header>

    <!-- ANSWER CAPSULE (GEO-extractable) -->
    <section class="py-8 px-6 border-t border-zinc-900 bg-[var(--surface)]/40">
      <div id="answer-capsule" class="speakable rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-6 py-5">
        <p class="eyebrow">¿Qué es [topic] para [sector]?</p>
        <p>2-3 sentences directly answering the primary query. Mention Growth Buddies, the diagnostic product, and one real data point.</p>
      </div>
    </section>

    <!-- PROBLEM SECTION -->
    <section>
      <h2>¿Por qué [sector-specific pain point]?</h2>
      <!-- 3 paragraphs: pain context → specific examples → consequence -->
    </section>

    <!-- SOLUTIONS / SERVICES SECTION -->
    <section id="soluciones">
      <h2>¿Qué procesos de [sector] se pueden automatizar con IA?</h2>
      <!-- 4-card grid: each card = one process. Link to relevant /servicios/ page or /soluciones/ product. -->
    </section>

    <!-- PROOF SECTION (case study if available, else "[pendiente: dato propio]") -->
    <section>
      <h2>[Client name]: [result headline]</h2>
      <!-- stat cards + narrative -->
      <!-- Fuente: datos de cliente Growth Buddies ([year]). -->
    </section>

    <!-- INTERNAL LINKS BLOCK — cluster hub -->
    <section class="py-16 px-6 border-t border-zinc-900">
      <h2>Artículos sobre automatización en [sector]</h2>
      <!-- 3 cards linking to each supporting blog post -->
    </section>

    <!-- FAQ ACCORDION (must mirror FAQPage JSON-LD exactly) -->
    <section>
      <h2>Preguntas frecuentes sobre IA en [sector]</h2>
      <!-- 4-6 <details>/<summary> items -->
    </section>

    <!-- FINAL CTA -->
    <section>
      <h2>¿Cuánto podría ahorrar su [firma/clínica/empresa] con automatización?</h2>
      <a href="https://calendly.com/espohr/conversemos">Evaluar si califica</a>
    </section>

  </main>

  <!-- footer (standard 4-col) -->
  <!-- scripts: lenis, reveal IO, mobile menu, UTM capture -->
</body>
</html>
```

---

## Supporting post HTML skeleton

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <!-- [HEAD BLOCK] -->
  <title>[How-to or question H1] | Growth Buddies</title>
  <meta name="description" content="[150-160 char]" />
  <link rel="canonical" href="https://growthbuddies.cl/blog/[slug]" />
  <meta property="og:type" content="article" />
  <meta property="og:article:published_time" content="[ISO date]" />

  <!-- JSON-LD: BreadcrumbList -->
  <!-- JSON-LD: BlogPosting -->
  <script type="application/ld+json">
  { "@context":"https://schema.org", "@type":"BlogPosting",
    "headline":"[H1 text]",
    "image":"https://growthbuddies.cl/img/og-default.webp",
    "author":{ "@type":"Person","name":"Edmundo Spohr","url":"https://growthbuddies.cl/equipo/edmundo-spohr" },
    "publisher":{ "@type":"Organization","name":"Growth Buddies","logo":{ "@type":"ImageObject","url":"https://growthbuddies.cl/img/logo.webp" } },
    "datePublished":"[ISO date]",
    "description":"[meta description]",
    "mainEntityOfPage":"https://growthbuddies.cl/blog/[slug]"
  }
  </script>
</head>
<body>
  <!-- skip link, noise-overlay, nav, mobile menu -->

  <main id="main-content">
    <!-- ARTICLE HEADER: breadcrumb, h1, author + date byline -->
    <!-- reading-progress bar -->

    <!-- Two-column: article + TOC sidebar (desktop) -->
    <article id="article-body" class="prose prose-invert prose-lg ...">

      <!-- LEAD paragraph: 1-2 sentences, answers the query immediately -->
      <p class="lead">...</p>

      <!-- H3 sections (TOC-auto-generated from these) -->
      <h3 id="section-1">[What/Why/How question]</h3>
      <p>Self-contained answer immediately below heading.</p>

      <!-- INLINE CTA box (mid-article) -->
      <div class="bg-zinc-900 border border-zinc-700 p-8 rounded-2xl my-12 not-prose">
        <h4>¿Necesita ayuda técnica?</h4>
        <a href="https://calendly.com/espohr/conversemos">Agendar sesión de calificación →</a>
      </div>

      <!-- Fuente: lines after any stat claim -->
      <p class="text-xs text-slate-500">Fuente: [source]</p>

    </article>

    <!-- PILLAR LINK (always present in every supporting post) -->
    <div class="border-t border-zinc-800 pt-8">
      <p class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Lectura relacionada</p>
      <a href="/sectores/[pillar-slug]">Guía completa: automatización IA en [sector] →</a>
      <a href="/servicios/[service-slug]">Servicio: [Service name] →</a>
    </div>

    <!-- Share buttons (LinkedIn, X, WhatsApp) -->
    <!-- Related articles (2-3 cards) -->
  </main>

  <!-- footer -->
  <!-- scripts -->
</body>
</html>
```

---

## Cannibalization rules (per vertical)

- Pillar owns the broad **sector** query (e.g. "automatización IA estudios jurídicos").
- Supporting posts own **how-to** or **specific tool** angles (e.g. "cómo revisar contratos con IA").
- `/servicios/` pages own **service** queries (e.g. "automatización legal Chile") — pillar must NOT copy their H1.
- Cross-link direction: posts → pillar (always), pillar → posts (always), pillar → /servicios/ (always).

---

## Clusters built

| Vertical | Pillar URL | Status |
|----------|-----------|--------|
| Legal / Estudios Jurídicos | `/sectores/automatizacion-ia-estudios-juridicos` | ✅ 2026-06-18 |
| Seguros / Corredoras | `/sectores/automatizacion-ia-corredoras-seguros` | pending |
| Construcción / Ingeniería | `/sectores/automatizacion-ia-construccion` | pending |
| Salud / Clínicas | `/sectores/automatizacion-ia-clinicas` | pending |
