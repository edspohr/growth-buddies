# PLAN: SEO Expansion + Polish, Batch 1 (2026-09)

## 1. Executive summary

Growth Buddies' organic search is trending up. This round establishes a **repeatable landing-add pattern** so we can protect that trend while adding SEO surface for two new content clusters (industrial and conversational agents) and pay down visual/hygiene debt that quietly contradicts the "Quiet Authority" design system. The batch introduces **4 new indexable pages** (two per cluster: pillar + supporting post), plus a Phase 0 hygiene pass that removes the last references to SPI's technical stack (client requirement), swaps the phone number sitewide, aligns the documented price/offer in `llms.txt`/`CLAUDE.md`/`README.md`, and extends Tailwind coverage to five previously-uncovered directories. Phase 3 aligns homepage visuals with `docs/design-system.md` (removes noise-overlay, glass-nav backdrop-filter, hero video, Lenis, decorative emojis, and reduces above-the-fold CTA variants). Phase 4 defines the measurement rubric and the rollback path.

### The 7 non-negotiable rules (apply to every phase)

1. **Zero URL changes, zero new redirects.** No changes to `<title>`, `<h1>`, `<link rel="canonical">`, or JSON-LD `@type` on any existing page. Protected pages (body-copy edits only): `/`, `/equipo/edmundo-spohr`, `/servicios/legal-tech`, `/casos/spi-americas`, `/sectores/automatizacion-ia-estudios-juridicos`, and every existing `/blog/*` post.
2. **Only add pages; never consolidate, merge or delete existing indexable pages.**
3. **New pages ship in one batch of 4**, with `sitemap.xml` updated and a manual indexing request in Search Console (Edmundo step). Future batches follow the same size.
4. **Every new page is linked from at least three places on day one**: its pillar (or the relevant `/servicios/` page), one high-authority existing page, and the footer. The "Sectores" and "Servicios" footer columns are added in Phase 0 so future landings have a home.
5. **One primary query per page**, registered in `docs/keyword-map.md` before the page is written, with explicit cannibalization notes against existing owners (e.g. `/servicios/ia-corporativa` owns "asistente de IA para empresas Chile"; `/blog/agentes-ia-para-empresas-chile` owns "agentes de IA para empresas Chile").
6. **Every new page follows `docs/cluster-template.md`**: `BreadcrumbList`, `WebPage` with `speakable`, `FAQPage` mirroring 3 to 5 on-page questions, and an `#answer-capsule` block near the top.
7. **Every page verified locally (desktop and mobile widths)** and passes `node scripts/check-links.js` and `bash scripts/check-hreflang.sh` before commit. One branch and one PR per phase. Commit convention: `feat(seo-expansion): ...`, `refactor(polish): ...`, `chore(hygiene): ...`. **Never modify `lastmod` on an existing `sitemap.xml` entry.** Only add new `<url>` blocks or, in Phase 3's video-block removal and Phase 4's rollback, delete the `<video:video>` child element or an entire new-page `<url>` block. `git diff sitemap.xml` on every PR must show either purely added lines or a purely removed block; no in-place edits to pre-existing entries.

---

## 2. Findings from the audit (not already covered by the phase scopes)

Concrete facts uncovered that inform, or interfere with, the plan.

### 2.1 Design system already declares things that are still in the code

`docs/design-system.md` (lines 154–179) claims these were removed under "Quiet Authority" (2026-06-18): they are still present:

- `.noise-overlay`: [index.html:457](../index.html#L457)
- `.glass-nav` on the fixed top nav: [index.html:459](../index.html#L459); plus mobile-menu backdrop with `backdrop-blur-xl` at [index.html:541](../index.html#L541).
- `backdrop-blur-md` on sticky CTA bar: [index.html:640](../index.html#L640).
- `backdrop-blur-sm` on review cards: [index.html:2538](../index.html#L2538), [:2576](../index.html#L2576), [:2700](../index.html#L2700), [:2823](../index.html#L2823).

The design doc separately says **Lenis is kept** and **hero video is kept (opacity reduced)** (lines 179, 154–166). The new brief overrides both: Phase 3 removes them **and** the design doc must be updated in the same PR so the doc stops contradicting itself.

### 2.2 A third stray phone number

Aside from the current-deployed `+56 9 7599 1366` and the new `+56 9 7599 1366`:
- [README.md:185](../README.md#L185) contains `+56 9 7599 1366`: a wrong number that matches neither deployed nor planned. Flag for correction in Phase 0.

### 2.3 SPI de-branding: 9 file surfaces, ~30 lines to rewrite

Occurrences of the client-forbidden string set (verbatim locations from audit):

| File | Lines | Strings to rewrite |
|---|---|---|
| [casos/spi-americas/index.html](../casos/spi-americas/index.html) | 180, 255, 268, 276–278, 293, 305 | SPI Smart Flow, Pipefy, OCR + Gemini stack, webhooks, "bilingüe", "genera el PDF bilingüe" |
| [servicios/legal-tech/index.html](../servicios/legal-tech/index.html) | 244 | "con la plataforma SPI Smart Flow" |
| [sectores/automatizacion-ia-estudios-juridicos/index.html](../sectores/automatizacion-ia-estudios-juridicos/index.html) | 360 | "SPI Smart Flow" (in answer capsule proof block) |
| [casos/index.html](../casos/index.html) | 213 | "generación de poderes bilingüe" |
| [colombia/index.html](../colombia/index.html) | 354 | "la plataforma SPI Smart Flow" |
| [peru/index.html](../peru/index.html) | 311 | "la plataforma SPI Smart Flow" |
| [ecuador/index.html](../ecuador/index.html) | 311 | "la plataforma SPI Smart Flow" |
| [recursos/informe-automatizacion-servicios-latam/index.html](../recursos/informe-automatizacion-servicios-latam/index.html) | 833 | "Plataforma SPI Smart Flow" |
| [blog/legal-tech-para-abogados-chile/index.html](../blog/legal-tech-para-abogados-chile/index.html) | 244 | Verify: only mentions 8.000 documents; audit says clean, confirm during Phase 0 |

Note: `/casos/spi-americas` is on the protected list (no H1/title/canonical changes). Body-copy edits only. **All published SPI metrics (+17%, 60%, 80%, 8.000+) must survive every rewrite.**

Legitimate technical uses of "OCR" and "webhook" outside SPI context (e.g. [servicios/automatizacion-inteligente/index.html:522](../servicios/automatizacion-inteligente/index.html#L522), [soluciones/rendicion-gastos-ia/index.html:114](../soluciones/rendicion-gastos-ia/index.html#L114)) stay. The de-branding grep must be scoped to SPI files or manually reviewed.

### 2.4 The homepage no longer needs a video-sitemap entry

[sitemap.xml:12–24](../sitemap.xml#L12-L24) still declares `<video:video>` metadata pointing at `vid/hero.mp4`. Once Phase 3 removes the hero video, this block must be deleted or it becomes a broken sitemap-video entry (Search Console will flag it).

### 2.5 Nav "Servicios" is an anchor, no `/servicios/` hub exists

[index.html:~482](../index.html#L482): `href="#como-trabajamos"`. There is no `/servicios/index.html`. Existing `/servicios/*` pages: `legal-tech`, `ia-corporativa`, `gestion-del-cambio`. Phase 0 does **not** touch the nav (the anchor stays as is). Phase 2 builds a lightweight `/servicios/index.html` hub (title, one paragraph, four cards: legal-tech, ia-corporativa, gestion-del-cambio, and the new agentes-ia-chatbots-empresas) and repoints the nav "Servicios" item to `/servicios`. This keeps Phase 0 strictly hygiene and lets the nav change land together with the new service page it advertises.

### 2.6 Documentation debt in `docs/debt/phase-9-deferred.md`

Still open at time of audit:
- Commit-style anomaly on legacy `Phase 9.1:` commit (cosmetic, skip).
- Firestore rules and Cloud Functions deploy items: **already deployed status unknown**; Phase 0 lists this as an Edmundo confirmation step, no code change here.
- Legacy `/soluciones/<slug>/` "Caja Negra" framing: out of scope this batch; keep noted.

### 2.7 Scarcity counter is dynamic (single source of truth)

[index.html:4954-4962](../index.html#L4954-L4962): an IIFE reads `MONTHLY_SLOTS = 2` and writes it into every `[data-monthly-slots]` node. Changing the number is a 1-line edit. Truthful maintenance is a process problem, not a code problem: Phase 0 flags this to Edmundo and proposes a fortnightly review cadence (see open questions).

### 2.8 Header/footer duplicated across 46+ pages, no include mechanism

Every nav/footer edit means editing every HTML file. Phase 0's footer-column addition (Sectores + Servicios) has a large blast radius. **Proposal**: use `sed` scripted replacements against the current shared footer signature, then run `check-links.js` afterwards. Do not attempt to introduce a build-time include system in this batch (scope creep).

### 2.9 Tailwind content-coverage gap

[tailwind.config.js:3-17](../tailwind.config.js#L3-L17): missing `./sectores/**`, `./colombia/**`, `./peru/**`, `./ecuador/**`, `./preguntas-frecuentes/**`. Any class used only in those directories is currently purged. Adding the entries and rebuilding may **increase** `dist/output.css` size: Phase 0 lists the before/after byte-count as a verification step.

### 2.10 Preserved: `prefers-reduced-motion` and skip links

[src/input.css:548-562](../src/input.css#L548-L562) has the correct `prefers-reduced-motion` block. All new pages must inherit it (no override needed).

### 2.11 hreflang cluster is closed at 4 country URLs + homepage

`bash scripts/check-hreflang.sh` verifies reciprocal tags across `/`, `/colombia`, `/peru`, `/ecuador`. **New `/sectores/*` and `/blog/*` landings in this batch must NOT add themselves to the hreflang cluster.** Their canonical is self-referential; hreflang is single `es` pointing to self.

---

## 3. `docs/keyword-map.md`: ready-to-paste additions

Append to the existing file (following the exact section format used at lines 22–129). Also update the "Cannibalization rules" section at the end.

```markdown
---

## /sectores/automatizacion-ia-industria-mineria (Pillar)

| Field | Value |
|---|---|
| **Primary query** | `automatización con IA empresas industriales Chile` |
| **Secondary queries** | `automatización IA minería servicios Chile`, `IA para consultoras de ingeniería minera`, `automatización mantenimiento industrial IA` |
| **Intent** | C |
| **Target countries** | CL, PE |
| **Title target** | `Automatización con IA para Empresas Industriales en Chile | Growth Buddies` |
| **H1 target** | reflects operational reporting pain + monetizable output |
| **Cluster posts** | `/blog/automatizar-informes-tecnicos-ordenes-de-trabajo` (+ planned) |

### /blog/automatizar-informes-tecnicos-ordenes-de-trabajo
| Field | Value |
|---|---|
| **Primary query** | `automatizar informes técnicos y órdenes de trabajo` |
| **Intent** | I/C |
| **Title target** | `Cómo automatizar informes técnicos y órdenes de trabajo con IA | Growth Buddies` |
| **Pillar** | `/sectores/automatizacion-ia-industria-mineria` |

### /blog/control-gestion-por-contrato-mineria-ia (planned: Batch 2)
| Field | Value |
|---|---|
| **Primary query** | `control de gestión por contrato minería IA` |
| **Status** | reserved: do not target this query on any other page until published |

### /blog/ia-para-cotizaciones-distribuidora-industrial (planned: Batch 2)
| Field | Value |
|---|---|
| **Primary query** | `IA para cotizaciones distribuidora industrial` |
| **Status** | reserved: do not target this query on any other page until published |

---

## /servicios/agentes-ia-chatbots-empresas

| Field | Value |
|---|---|
| **Primary query** | `chatbot empresarial a medida Chile` |
| **Secondary queries** | `agente conversacional para empresas`, `chatbot IA con integración a sistemas`, `asistente conversacional empresarial LATAM` |
| **Intent** | C/T |
| **Target countries** | CL, CO, PE |
| **Title target** | `Chatbot Empresarial a Medida y Agentes Conversacionales con IA | Growth Buddies` |
| **H1 target** | qualifies audience (empresas 15+ personas con operaciones documentales/administrativas), avoids "compre un bot de WhatsApp" framing |
| **Cannibalization** | Does **not** target "asistente de IA para empresas" (owned by `/servicios/ia-corporativa`) or "agentes de IA para empresas Chile" (owned by `/blog/agentes-ia-para-empresas-chile`). Must link to both. |

### /blog/cuanto-cuesta-un-chatbot-con-ia-empresa-chile
| Field | Value |
|---|---|
| **Primary query** | `cuánto cuesta un chatbot con IA` |
| **Secondary queries** | `precio chatbot empresarial Chile`, `costos ocultos chatbot IA`, `cuánto cuesta agente conversacional empresa` |
| **Intent** | C: high commercial value |
| **Title target** | `¿Cuánto cuesta un chatbot con IA para una empresa en Chile? | Growth Buddies` |
| **Service** | `/servicios/agentes-ia-chatbots-empresas` |
| **Cannibalization** | Complements (not replaces) `/blog/cuanto-cuesta-automatizar-empresa-chile`. This post is chatbot-specific; the other is broader automation. Must link to it. |

### /blog/diferencia-chatbot-y-agente-de-ia (planned: Batch 2)
| Field | Value |
|---|---|
| **Primary query** | `diferencia entre chatbot y agente de IA` |
| **Status** | reserved: do not target this query on any other page until published |
```

**Amend the "Cannibalization rules" block at the bottom of `docs/keyword-map.md`:**

```markdown
- /sectores/automatizacion-ia-industria-mineria owns "automatización con IA empresas industriales Chile": no service or blog page should copy this H1 phrasing.
- /servicios/agentes-ia-chatbots-empresas owns "chatbot empresarial a medida": separate from /servicios/ia-corporativa (asistente IA/RAG) and /blog/agentes-ia-para-empresas-chile (informational agents). Must cross-link.
- Reserved queries (planned Batch 2): "control de gestión por contrato minería IA", "IA para cotizaciones distribuidora industrial", "diferencia entre chatbot y agente de IA".
```

---

## 4. Internal-linking matrix

Every new page gets **≥3 inbound links** and carries the outbound links below.

### `/sectores/automatizacion-ia-industria-mineria` (pillar)
- **Inbound (3)**: (1) `/` hero-adjacent industrial mention or "Empresas que Automatizaron con Nosotros" section (link the Ingeglobal card to the pillar). (2) `/servicios/automatizacion-inteligente`: add link block. (3) Footer "Sectores" column (added in Phase 0).
- **Outbound**: `/servicios/automatizacion-inteligente`; `/blog/automatizar-informes-tecnicos-ordenes-de-trabajo`; `/blog/cuanto-cuesta-automatizar-empresa-chile`; homepage; Calendly CTA. **No SPI Americas link from this cluster.** The proof section uses Ingeglobal exclusively; SPI belongs to the legal cluster and mixing them dilutes both.

### `/blog/automatizar-informes-tecnicos-ordenes-de-trabajo`
- **Inbound (3)**: (1) Pillar (cluster block). (2) `/blog/cuanto-cuesta-automatizar-empresa-chile`: add related-posts card. (3) Footer "Recursos" column (existing).
- **Outbound**: pillar (mandatory), `/servicios/automatizacion-inteligente`. No SPI Americas link.

### `/servicios/agentes-ia-chatbots-empresas`
- **Inbound (3)**: (1) `/servicios/ia-corporativa`: "también puede interesarle" block at bottom. (2) `/blog/agentes-ia-para-empresas-chile`: inline link in intro or related-posts. (3) Footer "Servicios" column (added in Phase 0).
- **Outbound**: `/servicios/ia-corporativa` (differentiation, not competition); `/blog/agentes-ia-para-empresas-chile`; `/blog/cuanto-cuesta-un-chatbot-con-ia-empresa-chile`; `/preguntas-frecuentes` (RAG/data-security anchor); Calendly CTA.

### `/blog/cuanto-cuesta-un-chatbot-con-ia-empresa-chile`
- **Inbound (3)**: (1) `/servicios/agentes-ia-chatbots-empresas`. (2) `/blog/cuanto-cuesta-automatizar-empresa-chile`: related-posts card. (3) `/blog/agentes-ia-para-empresas-chile`: inline link where pricing is punted.
- **Outbound**: `/servicios/agentes-ia-chatbots-empresas` (mandatory), `/blog/cuanto-cuesta-automatizar-empresa-chile`, Calendly CTA.

---

## 5. Phases

### Phase 0: Hygiene + de-branding + footer columns

**Goal.** Silence 6 categories of drift: SPI technical-stack leak, wrong phone, stale price/offer in docs, Tailwind coverage gap, scarcity-counter process, footer preparedness for future landings. Zero user-visible SEO change, but a hard blocker before Phases 1–3.

**Files touched.**
- Body-copy edits: [casos/spi-americas/index.html](../casos/spi-americas/index.html), [casos/index.html](../casos/index.html), [servicios/legal-tech/index.html](../servicios/legal-tech/index.html), [sectores/automatizacion-ia-estudios-juridicos/index.html](../sectores/automatizacion-ia-estudios-juridicos/index.html), [colombia/index.html](../colombia/index.html), [peru/index.html](../peru/index.html), [ecuador/index.html](../ecuador/index.html), [recursos/informe-automatizacion-servicios-latam/index.html](../recursos/informe-automatizacion-servicios-latam/index.html).
- Phone replacement across all HTML + `functions/` files where wa.me/tel links appear + [llms.txt](../llms.txt) + [README.md](../README.md) + [index.html JSON-LD](../index.html) (lines 113, 306).
- [llms.txt](../llms.txt), [CLAUDE.md](../CLAUDE.md), [README.md](../README.md): price, guarantee, service-lines section, phone.
- [tailwind.config.js](../tailwind.config.js): add 5 content globs. Rebuild [dist/output.css](../dist/output.css) via `npm run build`.
- Footer: add "Sectores" and "Servicios" columns to every page's footer.

**Ordered tasks.**
1. Branch: `git checkout -b chore/phase-0-hygiene`.
2. **SPI de-branding.** Rewrite each occurrence to a generic phrasing that preserves all metrics. Approved generic phrasings:
   - "SPI Smart Flow" / "la plataforma SPI Smart Flow" → **"una plataforma de gestión documental con IA a medida"** (or, where context favors it, **"una plataforma de automatización de registros de propiedad intelectual"**).
   - "SPI Smart Flow, una plataforma SaaS con OCR (Gemini), generación de poderes bilingüe y dashboard Kanban" → **"una plataforma a medida que automatiza la extracción de datos desde correos, la generación de documentos y la coordinación de expedientes en cuatro países"** (describe function, not product type: no "SaaS").
   - "extrae datos automáticamente desde los correos de ingreso usando OCR con Gemini, los valida contra la base de expedientes, genera el documento PDF bilingüe con firma lista, y actualiza el tablero Kanban" → **"extrae y valida los datos de cada expediente, genera automáticamente la documentación necesaria y mantiene el tablero del equipo al día"**.
   - "poderes notariales bilingües" → **"documentación en varios idiomas"** (only if wording context requires it; otherwise omit "bilingüe").
   - Remove the badge chips "Pipefy (Webhooks)", "Google Gemini (OCR + IA)", "Generación PDF bilingüe" from `/casos/spi-americas` (lines 276–278). Replace with neutral chips like "Automatización a medida", "Integración con sistemas del cliente", "Operación en cuatro países".
3. **Phone number replacement.** Sitewide grep-and-swap: `+56 9 7599 1366` → `+56 9 7599 1366`, `56975991366` → `56975991366`, `+56975991366` → `+56975991366`. Also fix [README.md:185](../README.md#L185) `+56 9 7599 1366` → same target. Update `functions/` reference strings identically (email templates), but do NOT deploy functions in this phase: the change is code-level and rides the next scheduled functions deploy. Flag this to Edmundo as a follow-up.
4. **Stale price/offer docs.** Update [llms.txt:15](../llms.txt#L15) and [:19](../llms.txt#L19) (USD $3,000 → CLP $490.000 + IVA / USD 500, 10–15 días, maqueta funcionando, 100% credit within 90 días, refund if <3 opportunities with positive ROI). Update [CLAUDE.md:27](../CLAUDE.md#L27) and [README.md:5](../README.md#L5) identically. In `llms.txt`, refresh the "Service lines" section so it lists **only what already exists on the site at this moment**: (a) Diagnóstico de Automatización Estratégica (entry product), (b) Legal Tech, (c) Asistente de IA Corporativo, (d) Gestión del Cambio (Prosci ADKAR). Do NOT list "planned" service lines. The agents/chatbots line is added to `llms.txt` in Phase 2, at the same time the new service page ships.
5. **Tailwind content coverage.** Add to `content` array in [tailwind.config.js:3-17](../tailwind.config.js#L3-L17):
   ```
   "./sectores/**/*.{html,js}",
   "./colombia/**/*.{html,js}",
   "./peru/**/*.{html,js}",
   "./ecuador/**/*.{html,js}",
   "./preguntas-frecuentes/**/*.{html,js}",
   ```
   Run `npm run build`. Capture before/after byte size of `dist/output.css`. Report any class added.
6. **Scarcity counter.** No code change. Add a comment near [index.html:4954-4962](../index.html#L4954-L4962) documenting the review cadence Edmundo chooses (see open questions).
7. **Footer columns.** Add two new columns to every page's footer between the existing "Empresa" (or "Servicios") and "Recursos" columns. Content:

   ```html
   <div>
     <h4 class="text-white font-semibold mb-4">Servicios</h4>
     <ul class="space-y-2 text-sm text-slate-400">
       <li><a href="/servicios/legal-tech" class="hover:text-white">Legal Tech y Automatización</a></li>
       <li><a href="/servicios/ia-corporativa" class="hover:text-white">Asistente de IA Corporativo</a></li>
       <li><a href="/servicios/gestion-del-cambio" class="hover:text-white">Gestión del Cambio (Prosci)</a></li>
       <!-- INSERTION POINT: new /servicios/ landings (agentes-ia-chatbots-empresas ships in Batch 1) -->
     </ul>
   </div>
   <div>
     <h4 class="text-white font-semibold mb-4">Sectores</h4>
     <ul class="space-y-2 text-sm text-slate-400">
       <li><a href="/sectores/automatizacion-ia-estudios-juridicos" class="hover:text-white">Estudios Jurídicos</a></li>
       <!-- INSERTION POINT: new /sectores/ pillars (automatizacion-ia-industria-mineria ships in Batch 1) -->
     </ul>
   </div>
   ```
   The insertion points are HTML comments so future Claude Code sessions can find the slot with a grep. Because there is no include mechanism, use a scripted `sed` update against the shared footer signature (identify signature by grepping for the current copyright line).

**Verification checklist.**
- `grep -rniE "SPI Smart Flow|Pipefy|bilingüe" --include="*.html" .` returns 0 lines (allow Ingeglobal-unrelated "OCR"/"webhook" hits; verify manually).
- `grep -rE "6586 ?3160|56975991366|5727 ?2191" .` returns 0 lines.
- `grep -rE "\+56 9 7599 1366|56975991366" .` returns the expected count (Edmundo confirms).
- `grep -E "USD \\$?3[,.]000|3\\.000 USD" llms.txt CLAUDE.md README.md` returns 0 lines.
- `npm run build` completes; `dist/output.css` byte-count reported.
- `node scripts/check-links.js` and `bash scripts/check-hreflang.sh` both exit 0.
- Manual browser check on `/`, `/casos/spi-americas`, `/colombia`, `/peru`, `/ecuador` at 375px and 1440px widths. New footer columns render; SPI metrics still visible; scarcity counter still shows "2".

**Commit list.**
```
chore(hygiene): remove SPI Smart Flow branding, keep published metrics
chore(hygiene): swap contact phone to +56 9 7599 1366 sitewide
chore(hygiene): align llms.txt, CLAUDE.md, README.md with current offer
chore(hygiene): extend tailwind content coverage and rebuild dist/output.css
chore(hygiene): add Sectores and Servicios footer columns
```

**Edmundo's manual steps.**
- Confirm the current effective offer wording once (CLP + IVA in Chile; USD 500 elsewhere; 10 to 15 días; 100% credit within 90 days; refund if <3 opportunities).
- Decide the scarcity-counter refresh cadence (recommended: fortnightly on the 1st and 15th, updated by hand in `MONTHLY_SLOTS`).
- Merge PR + push to `main` (Vercel auto-deploys).
- Redeploy Cloud Functions when convenient (`firebase deploy --only functions`) so email templates carry the new phone. Not blocking the site release.

**Estimated effort.** 4–6 h of edits + 1 h verification.

**Claude Code prompt (self-contained).**

> You are working in the Growth Buddies static site (repo root: current working directory). Do all of the following on a new branch named `chore/phase-0-hygiene`, in the order given. All user-facing copy must be in formal Chilean Spanish ("usted"). Do not use em dashes; use parentheses or colons.
>
> **1. SPI de-branding.** In these files (`casos/spi-americas/index.html`, `casos/index.html`, `servicios/legal-tech/index.html`, `sectores/automatizacion-ia-estudios-juridicos/index.html`, `colombia/index.html`, `peru/index.html`, `ecuador/index.html`, `recursos/informe-automatizacion-servicios-latam/index.html`), rewrite every mention of "SPI Smart Flow", "Pipefy", "OCR con Gemini", "webhooks de Pipefy", "generación bilingüe de poderes PDF", and "bilingüe" in the SPI context, following these substitutions:
> - "SPI Smart Flow" / "la plataforma SPI Smart Flow" → "una plataforma de gestión documental con IA a medida" (or "una plataforma de automatización de registros de propiedad intelectual" where context favors it).
> - The stack sentence "una plataforma SaaS con OCR (Gemini), generación de poderes bilingüe y dashboard Kanban" → "una plataforma a medida que automatiza la extracción de datos desde correos, la generación de documentos y la coordinación de expedientes en cuatro países" (describe function, not product type: do NOT say "SaaS").
> - The flow sentence "extrae datos automáticamente desde los correos de ingreso usando OCR con Gemini, los valida contra la base de expedientes, genera el documento PDF bilingüe con firma lista, y actualiza el tablero Kanban" → "extrae y valida los datos de cada expediente, genera automáticamente la documentación necesaria y mantiene el tablero del equipo al día".
> - "poderes notariales bilingües" → "documentación en varios idiomas".
> - In `casos/spi-americas/index.html` around lines 276–278, replace the technology badge chips ("Pipefy (Webhooks)", "Google Gemini (OCR + IA)", "Generación PDF bilingüe") with neutral chips: "Automatización a medida", "Integración con sistemas del cliente", "Operación en cuatro países".
> - **Preserve every SPI metric verbatim**: +17%, 60%, 80%, 8.000+ (all appear multiple times in these files).
> - Verify with `grep -rniE "SPI Smart Flow|Pipefy|bilingüe" --include="*.html" .`: must return zero lines. Allow "OCR" and "webhook" outside SPI files (e.g. `servicios/automatizacion-inteligente/index.html`, `soluciones/rendicion-gastos-ia/index.html`).
>
> **2. Phone number swap.** Replace across the entire repo (all `.html`, `.js`, `.md`, `functions/**/*.js`, `llms.txt`):
> - `+56 9 7599 1366` → `+56 9 7599 1366`
> - `56975991366` → `56975991366`
> - `+56975991366` → `+56975991366`
> - In `README.md` line 185, `+56 9 7599 1366` → `+56 9 7599 1366` and its `wa.me/56975991366` → `wa.me/56975991366`.
> Verify: `grep -rE "6586 ?3160|56975991366|5727 ?2191" .` returns zero lines.
>
> **3. Docs alignment.**
> - `llms.txt` lines 15 and 19: replace "USD $3,000" and "The $3,000 is fully deducted…" with the current offer: **CLP $490.000 + IVA in Chile, USD 500 for the rest of LATAM. Delivered in 10 to 15 days. Includes a working mockup ("maqueta funcionando"). 100% of the value is creditable to any project contracted within 90 days. Full refund if fewer than 3 opportunities with positive ROI are identified.**
> - `CLAUDE.md` line 27: replace "USD $3.000, 2-week engagement" with "CLP $490.000 + IVA in Chile (USD 500 for the rest of LATAM), delivered in 10 to 15 days".
> - `README.md` line 5: replace "USD $3.000, 2 semanas" with "CLP $490.000 + IVA en Chile (USD 500 en el resto de LATAM), entrega en 10 a 15 días".
> - In `llms.txt`, update the "Service lines" section so it lists **only what already exists on the site right now**: (a) Diagnóstico de Automatización Estratégica (entry product), (b) Legal Tech, (c) Asistente de IA Corporativo, (d) Gestión del Cambio (Prosci ADKAR). Do NOT list any "planned" service line. The agents/chatbots line is appended to `llms.txt` in Phase 2, once the new service page is live.
>
> **4. Tailwind coverage.** In `tailwind.config.js`, add these to the `content` array immediately after `"./terminos/**/*.{html,js}"`:
> ```
> "./sectores/**/*.{html,js}",
> "./colombia/**/*.{html,js}",
> "./peru/**/*.{html,js}",
> "./ecuador/**/*.{html,js}",
> "./preguntas-frecuentes/**/*.{html,js}",
> ```
> Then run `npm run build`. Report the byte-count of `dist/output.css` before and after (use `wc -c dist/output.css` before and after, or check `git diff --stat dist/output.css`).
>
> **5. Footer columns.** Add two new footer columns ("Servicios" and "Sectores") to every page's footer. Identify the footer via the copyright line signature: `© 2026 Growth Buddies SpA. Latinoamérica`. Insert both columns just before the existing "Recursos" column. Use exactly the HTML in Phase 0 task 7 of the plan document (with the two HTML `<!-- INSERTION POINT -->` comments preserved for future batches). Do NOT modify the top nav "Servicios" item; that change lands in Phase 2 together with the new services hub.
>
> **6. Commit and verify.**
> - Split into the 5 commits listed in Phase 0 commit list.
> - Run `node scripts/check-links.js` and `bash scripts/check-hreflang.sh`; both must exit 0.
> - Do NOT change any URL, title, H1, canonical, or JSON-LD `@type` on any page.
> - Do NOT deploy Firebase Functions or Firestore rules; that is Edmundo's step.

---

### Phase 1: Industrial cluster, batch 1

**Goal.** Ship the industrial pillar and its first supporting post. Zero cannibalization of homepage or `/servicios/automatizacion-inteligente`; leverages the Ingeglobal reference already on the homepage.

**Files touched.**
- **New**: `sectores/automatizacion-ia-industria-mineria/index.html`, `blog/automatizar-informes-tecnicos-ordenes-de-trabajo/index.html`.
- **Edited**: [docs/keyword-map.md](keyword-map.md) (append entries from §3), [sitemap.xml](../sitemap.xml) (add both URLs, priority 0.8 for pillar and 0.7 for post, `lastmod` = release date), [servicios/automatizacion-inteligente/index.html](../servicios/automatizacion-inteligente/index.html) (add link block to pillar), [index.html](../index.html) (link the Ingeglobal card in the "Empresas que Automatizaron con Nosotros" section to the pillar), footer `<!-- INSERTION POINT: new /sectores/ pillars -->` filled with a link to the pillar, `blog/cuanto-cuesta-automatizar-empresa-chile/index.html` (add related-posts card to the new post).

**Ordered tasks.**
1. Branch: `git checkout -b feat/seo-expansion-industrial`.
2. Register both entries in `docs/keyword-map.md` (paste-block from §3, industrial section).
3. Build **pillar page** `sectores/automatizacion-ia-industria-mineria/index.html` from the skeleton in [docs/cluster-template.md](cluster-template.md) (lines 24–133). Required sections:
   - **Head**: title `Automatización con IA para Empresas Industriales en Chile | Growth Buddies`; canonical `https://growthbuddies.cl/sectores/automatizacion-ia-industria-mineria`; JSON-LD `BreadcrumbList` (Inicio → Sectores → …), `WebPage` with `speakable` selector `["h1", ".speakable", "#answer-capsule"]`, and `FAQPage` mirroring the on-page FAQ verbatim.
   - **H1**: e.g. "Automatización con IA para empresas industriales en Chile" (sentence case, no invented promises).
   - **Answer capsule** immediately after hero: 2–3 sentences answering the primary query; mention Growth Buddies, the Diagnóstico, and one real data point (use Ingeglobal narrative: no invented metrics; if a metric is needed, use `[EDMUNDO: dato]`).
   - **Problem section**: 3 paragraphs: the pain of manual technical reports and work-order coordination in mining services, critical energy, industrial maintenance and distribution.
   - **Solutions grid (4 cards)**: informes técnicos automatizados, órdenes de trabajo con IA, monitoreo en tiempo real, control de gestión por contrato. Each links to `/servicios/automatizacion-inteligente` or a `/soluciones/*` example.
   - **Proof**: Ingeglobal narrative only ("una consultora de ingeniería minera que convirtió su operación de monitoreo en un producto monetizable"). Metrics use `[EDMUNDO: dato]` placeholders. Do **not** reference SPI Americas anywhere on this pillar; SPI belongs to the legal cluster.
   - **Cluster block**: link to `/blog/automatizar-informes-tecnicos-ordenes-de-trabajo`; leave `<!-- INSERTION POINT: batch 2 industrial posts -->` for the two planned posts.
   - **FAQ accordion (4 questions)**: e.g. "¿Qué tipos de empresas industriales pueden automatizar con IA?", "¿Cuánto demora un piloto?", "¿Se puede integrar con nuestro ERP y sistemas de terreno?", "¿Cómo se cobra?" Mirror JSON-LD.
   - **Final CTA**: "Agendar conversación con el director →" → Calendly.
4. Build **supporting post** `blog/automatizar-informes-tecnicos-ordenes-de-trabajo/index.html` from the skeleton (cluster-template lines 137–207). Required:
   - Title `Cómo automatizar informes técnicos y órdenes de trabajo con IA | Growth Buddies`.
   - Lead paragraph (1–2 sentences) that answers the query directly.
   - H3 sections: "¿Qué se puede automatizar en un informe técnico?", "Órdenes de trabajo: del formulario en papel a la asignación por IA", "Errores comunes al automatizar reportería técnica", "Cuándo empezar por reportería y cuándo por planificación".
   - Inline CTA box mid-article to Calendly.
   - Pillar link block: link to `/sectores/automatizacion-ia-industria-mineria` and `/servicios/automatizacion-inteligente`.
   - Do NOT reference SPI Americas anywhere; the case is not relevant to the industrial audience.
   - No invented metrics: use `[EDMUNDO: dato]` for any number that requires client data.
5. **Inbound wiring.** Edit `servicios/automatizacion-inteligente/index.html` to add a "Sectores donde aplicamos esto" block linking to the industrial pillar. In `index.html`, adjust the Ingeglobal card in the "Empresas que Automatizaron con Nosotros" section so its "Ver más" (or equivalent) link points to `/sectores/automatizacion-ia-industria-mineria`. Update the footer Sectores column insertion point.
6. **Sitemap.** Append both URLs to `sitemap.xml`. Do NOT touch `lastmod` on any existing entry (rule 7):
   ```xml
   <url><loc>https://growthbuddies.cl/sectores/automatizacion-ia-industria-mineria</loc><lastmod>YYYY-MM-DD</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
   <url><loc>https://growthbuddies.cl/blog/automatizar-informes-tecnicos-ordenes-de-trabajo</loc><lastmod>YYYY-MM-DD</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
   ```
7. Related-post card on `/blog/cuanto-cuesta-automatizar-empresa-chile` pointing to the new post.

**Verification checklist.**
- `node scripts/check-links.js` exits 0.
- `bash scripts/check-hreflang.sh` exits 0 (must not have added the new pages to the country cluster).
- Manual check: pillar has an `#answer-capsule` div with class `speakable`, and its FAQ accordion Qs/As match the FAQPage JSON-LD exactly.
- Lighthouse mobile Performance ≥90, SEO ≥95 on both new pages.
- Both pages linked from at least three inbound sources on `main`.
- No H1/title/canonical change on any protected page.
- `git diff sitemap.xml` shows added lines only; no `lastmod` change on any pre-existing entry (rule 7).

**Commit list.**
```
feat(seo-expansion): add /sectores/automatizacion-ia-industria-mineria pillar
feat(seo-expansion): add /blog/automatizar-informes-tecnicos-ordenes-de-trabajo
feat(seo-expansion): wire industrial cluster inbound links (services, homepage, footer)
chore(seo): register industrial cluster in keyword-map and sitemap
```

**Edmundo's manual steps.** Confirm the 2–3 Ingeglobal talking points that can appear on the pillar. Provide 1–2 numbers if he wants them baked in (replace the `[EDMUNDO: dato]` placeholders). No indexing request in this phase: bundled with Phase 2.

**Estimated effort.** 8–12 h (mostly copywriting).

**Claude Code prompt (self-contained).**

> Working in the Growth Buddies static site. All user-facing copy in formal Chilean Spanish ("usted"). No em dashes. Follow `docs/cluster-template.md` exactly.
>
> Branch: `feat/seo-expansion-industrial`.
>
> **1. Register in keyword-map.** Append to `docs/keyword-map.md` the four entries under the "Industrial" heading in the plan document section 3 (pillar + one live post + two planned posts, plus updated cannibalization rules).
>
> **2. Create `sectores/automatizacion-ia-industria-mineria/index.html`** using `docs/cluster-template.md` lines 24–133 as the exact skeleton. Requirements:
> - `<title>Automatización con IA para Empresas Industriales en Chile | Growth Buddies</title>`
> - `<link rel="canonical" href="https://growthbuddies.cl/sectores/automatizacion-ia-industria-mineria" />`
> - All three JSON-LD blocks (BreadcrumbList, WebPage with speakable, FAQPage): FAQPage must mirror the on-page FAQ verbatim.
> - `<h1>` in sentence case (e.g. "Automatización con IA para empresas industriales en Chile"). Must NOT use "diagnóstico de automatización" (homepage owns it).
> - `#answer-capsule` `.speakable` div immediately after the hero: 2–3 sentences answering the primary query. Mention Growth Buddies, the Diagnóstico entry step, and Ingeglobal (industrial engineering consultancy that turned its monitoring operation into a monetizable product). Use `[EDMUNDO: dato]` for any specific number.
> - Problem section: 3 paragraphs covering mining services, critical energy, industrial maintenance and distribution.
> - Solutions grid: 4 cards: technical reports, work orders, real-time monitoring, contract control. Each links to `/servicios/automatizacion-inteligente` or a `/soluciones/*` example.
> - Proof section: Ingeglobal narrative only. Do NOT mention SPI Americas anywhere on either page (pillar or supporting post): SPI belongs to the legal cluster and mixing it with the industrial cluster dilutes both.
> - Cluster block linking to `/blog/automatizar-informes-tecnicos-ordenes-de-trabajo`. Include HTML comment `<!-- INSERTION POINT: batch 2 industrial posts -->`.
> - FAQ accordion (4 items, questions from the plan phase-1 task list).
> - Final CTA: "Agendar conversación con el director →" → `https://calendly.com/espohr/conversemos`.
>
> **3. Create `blog/automatizar-informes-tecnicos-ordenes-de-trabajo/index.html`** using `docs/cluster-template.md` lines 137–207 skeleton. Requirements:
> - `<title>Cómo automatizar informes técnicos y órdenes de trabajo con IA | Growth Buddies</title>`
> - Canonical, BreadcrumbList and BlogPosting JSON-LD.
> - Lead paragraph, 4 H3 sections, mid-article Calendly CTA, pillar link block (both `/sectores/automatizacion-ia-industria-mineria` and `/servicios/automatizacion-inteligente`).
> - Any number that would require client data → `[EDMUNDO: dato]` placeholder.
>
> **4. Wire inbound links.**
> - In `servicios/automatizacion-inteligente/index.html`, add a "Sectores donde aplicamos esto" section linking to the industrial pillar.
> - In `index.html`, adjust the Ingeglobal card in the "Empresas que Automatizaron con Nosotros" section so its detail link points to `/sectores/automatizacion-ia-industria-mineria`.
> - In every page's footer, fill the `<!-- INSERTION POINT: new /sectores/ pillars -->` slot with a `<li><a href="/sectores/automatizacion-ia-industria-mineria" ...>Empresas industriales</a></li>`.
> - In `blog/cuanto-cuesta-automatizar-empresa-chile/index.html`, add a related-post card linking to the new industrial post.
>
> **5. Update sitemap.** Append both URLs to `sitemap.xml` (pillar priority 0.8, post 0.7, `lastmod` = today). Do NOT modify `lastmod` on any pre-existing sitemap entry: `git diff sitemap.xml` must show added lines only.
>
> **6. Verify.** Run `node scripts/check-links.js` and `bash scripts/check-hreflang.sh`: both must exit 0. Open both new pages in a browser at 375px and 1440px widths and confirm the answer capsule renders, FAQ accordion works, and the CTA opens Calendly. Do NOT modify any URL, title, H1, canonical, or JSON-LD `@type` on protected pages (`/`, `/equipo/edmundo-spohr`, `/servicios/legal-tech`, `/casos/spi-americas`, `/sectores/automatizacion-ia-estudios-juridicos`, all existing `/blog/*` posts).

---

### Phase 2: AI-agents cluster, batch 1

**Goal.** Ship a service page for agents and conversational assistants without cannibalizing `/servicios/ia-corporativa` (RAG/assistant) or `/blog/agentes-ia-para-empresas-chile` (informational). Ship a chatbot-pricing post that complements (does not replace) the existing broader-cost post.

**Files touched.**
- **New**: `servicios/agentes-ia-chatbots-empresas/index.html`, `blog/cuanto-cuesta-un-chatbot-con-ia-empresa-chile/index.html`, **`servicios/index.html`** (lightweight services hub).
- **Edited**: [docs/keyword-map.md](keyword-map.md) (agent entries from §3), [sitemap.xml](../sitemap.xml) (add the three new URLs: hub, service, blog post), [servicios/ia-corporativa/index.html](../servicios/ia-corporativa/index.html) (add "también puede interesarle" block), [blog/agentes-ia-para-empresas-chile/index.html](../blog/agentes-ia-para-empresas-chile/index.html) (inline link to new service, related-post card), [blog/cuanto-cuesta-automatizar-empresa-chile/index.html](../blog/cuanto-cuesta-automatizar-empresa-chile/index.html) (related-post card), footer Servicios column insertion point, every page's top nav "Servicios" item (`href="#como-trabajamos"` → `href="/servicios"`).

**Ordered tasks.**
1. Branch: `git checkout -b feat/seo-expansion-agents`.
2. Register both live entries + the reserved "diferencia entre chatbot y agente" in `docs/keyword-map.md`.
3. Build **`servicios/index.html`** (lightweight services hub). Requirements:
   - Title: `Servicios de Automatización con IA para Empresas | Growth Buddies`.
   - Canonical: `https://growthbuddies.cl/servicios`.
   - JSON-LD: BreadcrumbList (Inicio → Servicios) + WebPage (with speakable selector on `h1` and `.speakable`).
   - Content: page title, one short paragraph positioning Growth Buddies as a strategic diagnostic consultant, and a 4-card grid linking to `/servicios/legal-tech`, `/servicios/ia-corporativa`, `/servicios/gestion-del-cambio`, and the new `/servicios/agentes-ia-chatbots-empresas`. Each card: service name, one-line description, "Conocer el servicio →" link.
   - Closing block reiterating the Diagnóstico as the entry step, primary CTA "Agendar conversación con el director →" → Calendly.
4. **Repoint the nav "Servicios" item** on every page: `href="#como-trabajamos"` → `href="/servicios"`. Do not touch other `#como-trabajamos` anchors that are not the Servicios nav item.
5. Build **`servicios/agentes-ia-chatbots-empresas/index.html`**. This is a **service page**, not a pillar, but keeps the same schema stack. Copy requirements:
   - Title: `Chatbot Empresarial a Medida y Agentes Conversacionales con IA | Growth Buddies`.
   - H1 must qualify the reader from the first paragraph: aimed at companies **de 15 o más personas con operaciones documentales o administrativas**; the entry step is the Diagnóstico or a 30-minute conversation with the director. Must NOT read as "buy a WhatsApp bot" storefront.
   - Explicit differentiation block from `/servicios/ia-corporativa` (RAG/assistant with private data) and from `/blog/agentes-ia-para-empresas-chile` (informational post). Link both.
   - Sections: (a) qué automatiza un agente conversacional en la empresa. Inside this section, include **two paragraphs** covering the difference between chatbot, agente y asistente (no separate H2/H3 for that distinction), followed by an HTML comment `<!-- INSERTION POINT: link to /blog/diferencia-chatbot-y-agente-de-ia when published -->` where a future inline link will land. (b) integraciones típicas (CRM/ERP/WhatsApp Business, sin nombrar herramientas del cliente); (c) qué NO hacer con un agente (evitar reemplazar procesos que requieren decisión humana); (d) FAQ 4 items.
   - **Price display rule (strict)**: the service page **must NOT** show the tier table or the tier ranges. The **only** price-adjacent sentence on the page is inside the Diagnóstico block at the end, verbatim: **"Proyectos a medida desde USD 3.000, cotizados tras el diagnóstico."** Rationale: the service page qualifies the reader, the blog post educates on ranges. Link to `/blog/cuanto-cuesta-un-chatbot-con-ia-empresa-chile` from that same block for readers who want detail.
   - Diagnóstico block at the end (CLP $490.000 + IVA en Chile, USD 500 en el resto de LATAM, 10 a 15 días, 100% acreditable a 90 días, garantía de devolución) with primary CTA "Agendar conversación con el director →".
   - Secondary CTA line: "o converse por WhatsApp" → `+56 9 7599 1366`.
   - JSON-LD: BreadcrumbList + WebPage(speakable) + FAQPage + Service (schema.org Service with `provider` = Growth Buddies and `areaServed` = CL/CO/PE).
4. Build **`blog/cuanto-cuesta-un-chatbot-con-ia-empresa-chile/index.html`**. Angle: concrete, pragmatic. Confirmed pricing structure (do NOT use `[EDMUNDO: rango CLP]` placeholders here: the ranges are locked; only the exchange rate is a placeholder).

   **Currency and display rules.**
   - Ranges expressed in **USD**, with a CLP equivalent in parentheses computed at a rounded exchange rate declared **once** at the top of the post via an HTML comment: `<!-- TIPO DE CAMBIO REFERENCIAL: 1 USD = $[EDMUNDO: valor] CLP, revisar trimestralmente -->`.
   - CLP figures rounded to the nearest **$100.000**.
   - All figures **net of VAT**. Under the table, add the footnote verbatim: **"Valores referenciales sin IVA. Cada proyecto se cotiza tras el diagnóstico."**

   **Sections (in order).**
   - Lead paragraph (1–2 sentences) directly answering the query with the honest framing that "el rango va desde USD 30 al mes (SaaS no-code) hasta USD 25.000 o más para un agente multicanal con adopción; el costo depende de la complejidad, las integraciones y el volumen de uso".
   - H3 "¿Qué es un chatbot con IA y qué NO lo es?"
   - H3 "Cuatro niveles de complejidad y sus rangos de precio en Chile": render as a **table** followed by **one paragraph per tier**. Table columns: `Nivel | Qué es | Rango`. Tier rows (exact copy):

     | Nivel | Qué es | Rango |
     |---|---|---|
     | **0 · Herramientas no-code** (no lo hace Growth Buddies) | SaaS configurado por el propio equipo, un canal, sin integración con sistemas. Es la respuesta correcta para empresas pequeñas y consultas simples. | USD 30 a 300 al mes |
     | **1 · Asistente sobre documentos** | Responde consultas frecuentes o sobre la documentación de la empresa, un canal (web o WhatsApp), no ejecuta acciones. | USD 3.000 a 5.000 |
     | **2 · Agente con integración a sistemas** | Consulta y escribe en CRM, ERP o agenda, ejecuta acciones, WhatsApp Business API, reglas de negocio. | USD 6.000 a 12.000 |
     | **3 · Agente multicanal con derivación humana** | Varios canales, roles y permisos, derivación a personas con contexto, métricas de uso, programa de adopción del equipo. | USD 12.000 a 25.000 o más |

     Tier 0 must be presented **honestly** as a legitimate option that Growth Buddies does not build, so the reader self-selects. Tiers 1–3 are Growth Buddies' custom work.

   - H3 "Costos recurrentes que la mayoría olvida" (mandatory, immediately after the table):
     - **Mantención y mejoras**: 10% a 15% del valor del proyecto al año, o una mensualidad fija acordada.
     - **Consumo de modelo (tokens)**: en un agente de volumen medio, USD 20 a 200 al mes según canales y tráfico.
     - **Integraciones de terceros** (por ejemplo WhatsApp Business API): tienen costo propio del proveedor, fuera del proyecto.
   - H3 "Qué encarece un proyecto". Cover: número de integraciones, volumen de consultas, requisitos de compliance (para RAG con datos sensibles remitir a `/servicios/ia-corporativa`), multicanalidad, roles/permisos.
   - H3 "Cuándo un chatbot **no** es la respuesta correcta". Must include this idea in Spanish: **la mayoría de los proyectos fallidos no fallan por el bot, fallan porque nadie en el equipo lo adopta**. Link to `/servicios/gestion-del-cambio`.
   - **Credit mention (state exactly once, in a small block at the end before the CTA)**: "El Diagnóstico de Automatización Estratégica (CLP $490.000 + IVA en Chile, USD 500 en el resto de LATAM) es el paso previo a cualquiera de estos proyectos y su valor es 100% acreditable a la implementación dentro de 90 días." Frame as the required first step, **not as a discount**.
   - Inline CTA to Calendly mid-article (only one).
   - Pillar/service link block at the end: `/servicios/agentes-ia-chatbots-empresas` and `/blog/cuanto-cuesta-automatizar-empresa-chile`.

   **Invention rule.** Do NOT invent any figure beyond the tiers, recurring costs, and diagnostic price above. If any additional number is needed, use `[EDMUNDO: dato]`.
7. **Inbound wiring.**
   - `/servicios/ia-corporativa/index.html`: add a "También puede interesarle" block linking to the new service page. Explicit phrasing: "Si busca un agente conversacional para atención externa o flujos administrativos, revise nuestro servicio de agentes de IA y chatbots empresariales." This wording positions the two services as **complementary**, not competitive.
   - `/blog/agentes-ia-para-empresas-chile/index.html`: add an inline link where the post discusses implementation ("Para el proyecto concreto, revise `/servicios/agentes-ia-chatbots-empresas`") and a related-post card to the new pricing post.
   - Footer Servicios insertion point filled with `<li><a href="/servicios/agentes-ia-chatbots-empresas">Agentes de IA y Chatbots</a></li>`. The hub itself is reachable via the top nav; do NOT add a separate footer entry for `/servicios`.
8. **Sitemap.** Append the three new URLs (do NOT touch existing sitemap entries; `lastmod` on other URLs stays as it was):
   ```xml
   <url><loc>https://growthbuddies.cl/servicios</loc><lastmod>YYYY-MM-DD</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
   <url><loc>https://growthbuddies.cl/servicios/agentes-ia-chatbots-empresas</loc><lastmod>YYYY-MM-DD</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>
   <url><loc>https://growthbuddies.cl/blog/cuanto-cuesta-un-chatbot-con-ia-empresa-chile</loc><lastmod>YYYY-MM-DD</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
   ```
9. **llms.txt update.** Append "Agentes de IA y asistentes conversacionales para empresas" to the "Service lines" section in `llms.txt` (deferred from Phase 0 because that phase's rule is "list only what exists on the site at that moment"). No other change to `llms.txt`.

**Verification checklist.** Same as Phase 1. Additionally verify: (a) the new service page does NOT contain the phrase "asistente de IA para empresas" in the H1 or meta (owned by `/servicios/ia-corporativa`); (b) the pricing post links **to**, not from, `/blog/cuanto-cuesta-automatizar-empresa-chile`; (c) `/servicios/` renders with 4 cards and the top-nav "Servicios" item on every page navigates to `/servicios`; (d) no `lastmod` on any pre-existing sitemap entry has changed (git diff on `sitemap.xml` shows added lines only).

**Commit list.**
```
feat(seo-expansion): add /servicios hub page
feat(seo-expansion): repoint nav "Servicios" to /servicios
feat(seo-expansion): add /servicios/agentes-ia-chatbots-empresas
feat(seo-expansion): add /blog/cuanto-cuesta-un-chatbot-con-ia-empresa-chile
feat(seo-expansion): wire agents cluster inbound links
chore(seo): register agents cluster in keyword-map and sitemap
```

**Edmundo's manual steps.** Provide the **reference USD/CLP exchange rate** to substitute for `[EDMUNDO: valor]` in the top-of-file HTML comment (agree to review quarterly). After PR merge, submit both new URLs to Search Console (Request Indexing): **do this for all four Batch 1 URLs together in a single Search Console visit**.

**Estimated effort.** 10–14 h.

**Claude Code prompt (self-contained).**

> Working in the Growth Buddies static site. All user-facing copy in formal Chilean Spanish ("usted"). No em dashes. Follow `docs/cluster-template.md` structure.
>
> Branch: `feat/seo-expansion-agents`.
>
> **1. Register in keyword-map.** Append to `docs/keyword-map.md` the three entries under "Agents" in the plan document section 3 (service page + one live post + one reserved future post), plus the two new cannibalization rules.
>
> **2. Create `servicios/index.html`** (lightweight services hub):
> - Title `Servicios de Automatización con IA para Empresas | Growth Buddies`.
> - Canonical `https://growthbuddies.cl/servicios`.
> - JSON-LD: BreadcrumbList (Inicio, Servicios) and WebPage (speakable selector on `h1` and `.speakable`). Do NOT add any FAQPage or Service schema here; this is a hub, not a service.
> - One short paragraph positioning Growth Buddies as a strategic diagnostic consultant.
> - 4-card grid linking to `/servicios/legal-tech`, `/servicios/ia-corporativa`, `/servicios/gestion-del-cambio`, `/servicios/agentes-ia-chatbots-empresas`. Each card: service name, one-line description, "Conocer el servicio →" link.
> - Closing block: Diagnóstico is the entry step. Primary CTA "Agendar conversación con el director →" to `https://calendly.com/espohr/conversemos`.
>
> **3. Repoint nav "Servicios".** In every HTML file that contains the top nav, replace the "Servicios" nav item's `href="#como-trabajamos"` with `href="/servicios"`. Do not touch other `#como-trabajamos` anchors that are not the Servicios nav item.
>
> **4. Create `servicios/agentes-ia-chatbots-empresas/index.html`.**
> - Title `Chatbot Empresarial a Medida y Agentes Conversacionales con IA | Growth Buddies`.
> - Canonical, BreadcrumbList, WebPage with speakable, FAQPage, and Service JSON-LD.
> - H1 (sentence case). The first paragraph must **qualify the reader**: audience is empresas de 15+ personas con operaciones documentales o administrativas; entry step is the Diagnóstico o una conversación de 30 min con el director. Must NOT read as a "compre un bot de WhatsApp" storefront.
> - Include a differentiation block explicitly linking to and NOT competing with `/servicios/ia-corporativa` (asistente/RAG con datos privados) y `/blog/agentes-ia-para-empresas-chile` (post informativo).
> - Sections: (a) qué automatiza un agente conversacional. Within this section, add **two paragraphs** covering the difference between chatbot, agente y asistente (do NOT create a separate H2/H3 for that distinction), followed by the HTML comment `<!-- INSERTION POINT: link to /blog/diferencia-chatbot-y-agente-de-ia when published -->` so a future inline link has a marked home. (b) integraciones típicas (mencionar tipos, no herramientas de cliente). (c) qué NO hacer con un agente. (d) FAQ de 4 items.
> - **Price display rule (strict)**: do NOT show any tier table or price ranges on this page. The only price-adjacent line, verbatim, is inside the Diagnóstico block: **"Proyectos a medida desde USD 3.000, cotizados tras el diagnóstico."** From that block, link out to `/blog/cuanto-cuesta-un-chatbot-con-ia-empresa-chile` for detailed ranges.
> - End with a Diagnóstico block (CLP $490.000 + IVA en Chile / USD 500 en el resto de LATAM, 10 a 15 días, 100% acreditable a 90 días, garantía de devolución si no se identifican al menos 3 oportunidades con ROI positivo). Primary CTA: "Agendar conversación con el director →" → `https://calendly.com/espohr/conversemos`. Secondary CTA: WhatsApp text link to `+56 9 7599 1366`.
>
> **5. Create `blog/cuanto-cuesta-un-chatbot-con-ia-empresa-chile/index.html`.**
> - Title `¿Cuánto cuesta un chatbot con IA para una empresa en Chile? | Growth Buddies`.
> - Canonical, BreadcrumbList and BlogPosting JSON-LD.
> - **Currency and display rules**: prices in USD, with a CLP equivalent in parentheses computed at a rounded exchange rate declared **once** at the top of the file via an HTML comment: `<!-- TIPO DE CAMBIO REFERENCIAL: 1 USD = $[EDMUNDO: valor] CLP, revisar trimestralmente -->`. CLP figures rounded to the nearest $100.000. All figures net of VAT.
> - Lead paragraph directly answers the query with the framing: "el rango va desde USD 30 al mes (SaaS no-code) hasta USD 25.000 o más para un agente multicanal con adopción; el costo depende de la complejidad, las integraciones y el volumen de uso".
> - H3 "¿Qué es un chatbot con IA y qué NO lo es?"
> - H3 "Cuatro niveles de complejidad y sus rangos de precio en Chile": **table** with columns `Nivel | Qué es | Rango`, followed by one paragraph per tier. Tier rows exactly as follows:
>   - **0 · Herramientas no-code (no lo hace Growth Buddies)**: SaaS configurado por el propio equipo, un canal, sin integración con sistemas. Es la respuesta correcta para empresas pequeñas y consultas simples. **Rango:** USD 30 a 300 al mes.
>   - **1 · Asistente sobre documentos**: responde consultas frecuentes o sobre la documentación de la empresa, un canal (web o WhatsApp), no ejecuta acciones. **Rango:** USD 3.000 a 5.000.
>   - **2 · Agente con integración a sistemas**: consulta y escribe en CRM, ERP o agenda, ejecuta acciones, WhatsApp Business API, reglas de negocio. **Rango:** USD 6.000 a 12.000.
>   - **3 · Agente multicanal con derivación humana**: varios canales, roles y permisos, derivación a personas con contexto, métricas de uso, programa de adopción del equipo. **Rango:** USD 12.000 a 25.000 o más.
>   Tier 0 must be presented honestly as a legitimate option that Growth Buddies does not build, so the reader self-selects. Tiers 1–3 are Growth Buddies' custom work.
> - Under the table, footnote verbatim: **"Valores referenciales sin IVA. Cada proyecto se cotiza tras el diagnóstico."**
> - H3 "Costos recurrentes que la mayoría olvida". Three bullets: Mantención y mejoras 10% a 15% del valor del proyecto al año (o mensualidad fija acordada); Consumo de modelo (tokens) USD 20 a 200 al mes según canales y tráfico en un agente de volumen medio; Integraciones de terceros (por ejemplo WhatsApp Business API) con costo propio del proveedor, fuera del proyecto.
> - H3 "Qué encarece un proyecto". Cover: número de integraciones, volumen de consultas, compliance (RAG con datos sensibles → link a `/servicios/ia-corporativa`), multicanalidad, roles/permisos.
> - H3 "Cuándo un chatbot **no** es la respuesta correcta". Must include the idea (in Spanish): "la mayoría de los proyectos fallidos no fallan por el bot, fallan porque nadie en el equipo lo adopta"; link to `/servicios/gestion-del-cambio`.
> - Small block near the end (before final CTA), mentioned **exactly once**: "El Diagnóstico de Automatización Estratégica (CLP $490.000 + IVA en Chile, USD 500 en el resto de LATAM) es el paso previo a cualquiera de estos proyectos y su valor es 100% acreditable a la implementación dentro de 90 días." Frame as required first step, **not as discount**.
> - Inline CTA to Calendly mid-article (only one).
> - Pillar/service link block at the end: `/servicios/agentes-ia-chatbots-empresas` y `/blog/cuanto-cuesta-automatizar-empresa-chile`.
> - **Do NOT invent any other figure**. If any additional number is needed beyond the tiers, recurring costs, and diagnostic price, use `[EDMUNDO: dato]`.
>
> **6. Wire inbound links.**
> - In `servicios/ia-corporativa/index.html`, add a "También puede interesarle" block linking to `/servicios/agentes-ia-chatbots-empresas` with complementary phrasing (see plan Phase 2 task 7).
> - In `blog/agentes-ia-para-empresas-chile/index.html`, add an inline link to `/servicios/agentes-ia-chatbots-empresas` and a related-post card to the new pricing post.
> - In every page's footer, fill the `<!-- INSERTION POINT: new /servicios/ landings -->` slot with `<li><a href="/servicios/agentes-ia-chatbots-empresas">Agentes de IA y Chatbots</a></li>`. Do NOT add a separate footer entry for `/servicios` (the hub is reached via the top nav).
> - In `blog/cuanto-cuesta-automatizar-empresa-chile/index.html`, add a related-post card to the new pricing post.
>
> **7. Update sitemap.** Append the three new URLs (hub, service, blog post) to `sitemap.xml`. Do NOT edit `lastmod` on any existing entry: only add new lines.
>
> **8. Update llms.txt.** Append "Agentes de IA y asistentes conversacionales para empresas" to the "Service lines" section in `llms.txt`. No other change to that file.
>
> **9. Verify.** `node scripts/check-links.js` and `bash scripts/check-hreflang.sh` exit 0. Browser check at 375px and 1440px. **Assert**: the new service page does NOT contain "asistente de IA para empresas" in H1 or `<meta name="description">`; the nav "Servicios" item on every page navigates to `/servicios`; `git diff sitemap.xml` shows added lines only, no `lastmod` changes on pre-existing entries. Do NOT touch protected pages.

---

### Phase 3: Visual polish (Quiet Authority alignment)

**Goal.** Bring the homepage and shared components in line with `docs/design-system.md`, and update the design doc itself so it stops declaring things done that aren't (Lenis, hero video).

**Files touched.**
- [index.html](../index.html) (multiple sections listed below, including the homepage `VideoObject` JSON-LD block that must be removed together with the video: this is an explicit, approved exception to rule 1: a block is deleted, no `@type` on any surviving block is changed), [src/input.css](../src/input.css) (verify no `.noise-overlay` styles remain), [tailwind.config.js](../tailwind.config.js) (no change; `hero-static` already defined), [dist/output.css](../dist/output.css) (rebuild), [docs/design-system.md](design-system.md) (update "Kept" list to reflect Lenis and hero video removal).
- Delete: `vid/hero.mp4`, `js/lenis.min.js`.
- Update: [sitemap.xml](../sitemap.xml): remove the `<video:video>` block on the homepage entry (do NOT change `lastmod` on that URL or any other).
- Image conversion: `img/groddiesLogo.png`, `img/summer.png`, `img/logo.png` → WebP (or SVG for logos where source available).

**Ordered tasks.**
1. Branch: `git checkout -b refactor/phase-3-polish`.
2. **Remove `.noise-overlay`**: delete the `<div class="noise-overlay"></div>` at [index.html:457](../index.html#L457) and any matching CSS in `src/input.css`.
3. **Remove `.glass-nav` backdrop-filter**: on `<nav class="glass-nav">` at [index.html:459](../index.html#L459), replace with a solid `bg-[var(--bg)]/95` (95% opacity solid, no blur). Remove all `backdrop-blur-*` occurrences: mobile-menu at [index.html:541](../index.html#L541), sticky CTA bar at [index.html:640](../index.html#L640), review cards at [index.html:2538](../index.html#L2538), [:2576](../index.html#L2576), [:2700](../index.html#L2700), [:2823](../index.html#L2823). Substitute with solid background at appropriate opacity.
4. **Remove Lenis**: delete the `<script src="/js/lenis.min.js" defer>` at [index.html:417](../index.html#L417) and the init IIFE at [index.html:4463-4482](../index.html#L4463-L4482). Delete `js/lenis.min.js`. If any `<a href="#anchor">` relied on `lenis.scrollTo`, verify native `scroll-behavior: smooth` on `html` (already handled by CSS reset per `prefers-reduced-motion` block). Also strip Lenis from every other page (blog, sectores, etc.; the audit showed it loads on blog/index.html line 89 and on sectores/index.html at nav).
5. **Remove hero video**: replace the `<div class="video-background-container">…</div>` block at [index.html:752-769](../index.html#L752-L769) with `<div class="hero-static absolute inset-0"></div>` (using the Tailwind `hero-static` background image from `tailwind.config.js:57`). Delete `vid/hero.mp4`. **Also delete the `VideoObject` JSON-LD block on `index.html`** (grep for `"@type":\s*"VideoObject"` in `index.html`, remove the surrounding `<script type="application/ld+json">…</script>` wrapper). This is an approved exception to rule 1: the block is removed because its subject (the hero video) no longer exists; no `@type` on any surviving JSON-LD block changes. Also remove the `<video:video>` block from `sitemap.xml` (homepage entry, lines 13–20) without touching that URL's `lastmod`.
6. **Unify logo strip** at [index.html:815-869](../index.html#L815-L869):
   - Same height for all logos: `h-6` (with `md:h-7` if the design system permits).
   - Monochrome white at ~60% opacity: `class="grayscale brightness-0 invert opacity-60 hover:opacity-100"`. Remove `mix-blend-screen`: it interacts with the dark background inconsistently.
   - INGEGLOBAL and Dra. Corral as Geist wordmarks with identical treatment (same font size and color). Current uses `font-black` for INGEGLOBAL and `font-semibold` for Dra. Corral: unify to `font-semibold uppercase tracking-[0.15em] text-white/60`.
   - Propose SVG conversion for the three PNG logos: `img/groddiesLogo.png` (196 KB → target ~4 KB SVG), `img/summer.png` (142 KB → target ~4 KB SVG), `img/logo.png` (118 KB → target ~4 KB SVG). Total savings ~440 KB. If SVG sources are not available, convert to 40 KB WebP. Update all `<img src>` references.
7. **Reduce CTA variants above the fold** to one primary + one secondary. Below-the-fold CTA inventory (audit's list of ~11 CTA strings) collapses to a set of 3:
   - **Primary (hero + closing + comparison table)**: "Agendar conversación con el director →" → `https://calendly.com/espohr/conversemos`.
   - **Secondary (hero + closing)**: text link "o escríbanos por WhatsApp" → `wa.me/56975991366` with UTM.
   - **Reserved to price box + closing section only**: "Reservar mi cupo →" → `wa.me/56975991366` with reservation intent.
   - Nav CTA: keep "Agendar conversación" as the desktop button. Mobile nav CTA also "Agendar conversación".
   - Sticky CTA bar: primary = Calendly, secondary = WhatsApp text link. No "Reservar mi cupo" here.
   - Report every previous CTA string in the commit body.
8. **Replace emoji flags** at [index.html:866-868](../index.html#L866-L868) and every footer/mobile-menu occurrence with text chips: `CL · CO · PE · EC` (each linked). Grep for `🇨🇱|🇨🇴|🇵🇪|🇪🇨` across every HTML file and remove.
9. **Normalize headings** on `index.html`.
   - **First**, locate every "Step 1" / "Step 2" / "Step 3" / "Step 4" string in `index.html`: `grep -nE 'Step [1-4]' index.html`. For each hit, decide whether it is **visible copy** (heading text, button label, visible paragraph) or **assistive-tech only** (inside `aria-label`, `sr-only`, `aria-labelledby`, `alt`). The audit surfaced the four "Step N:" H3s at lines 1913, 1969, 2081, 2143, but the string can also be lurking in ARIA attributes. Translate wherever it appears, visible or not: "Step 1" → "Paso 1", "Step 2" → "Paso 2", etc. After this step, `grep -nE '\bStep [1-4]\b' index.html` must return 0.
   - **Then**, normalize to Spanish sentence case only in the specific visible headings listed below. Do NOT alter visible headings already in sentence-case Spanish.
     - Line 1251 "Empresas que Automatizaron con Nosotros" → "Empresas que automatizaron con nosotros".
     - Line 1856 "Cómo Trabajamos" → "Cómo trabajamos".
     - Line 3716 "Diagnóstico Rápido" → "Diagnóstico rápido".
     - Lines 1913, 1969, 2081, 2143 (once translated): "Paso 1: Conversación de 30 minutos" → "Paso 1: conversación de 30 minutos"; likewise "Paso 2: diagnóstico completo", "Paso 3: implementación", "Paso 4: adopción".
   - Brand names in H3 stay Title Case (proper nouns): SPI Americas, MundoSocios (CChC), Potenciarte Eventos, Fundación Katy Summer, INGEGLOBAL, Dra. Daniela Corral H., Edmundo Spohr, Felipe Soto Santibáñez.
10. **Restyle Google reviews module** at [index.html:2423-2690](../index.html#L2423-L2690):
    - Move 5.0 score and star row to the lead visual element (already at top; verify visual weight vs. the "Reseñas en Google" eyebrow: increase score font size or reduce eyebrow prominence).
    - Reviewer name: change from `text-white` to `text-[var(--fg-muted)]` (audit found `text-white` at line 2686–2688).
    - Remove initials avatars (line 2679-2682 `<div class="w-9 h-9 rounded-full ... bg-[var(--accent)]">DC</div>`). Replace with a small Google G icon (already present in each card) as the only visual metadata.
    - Remove decorative glow (`bg-[var(--accent)]/5 blur-[120px]` around line 2435).
    - Remove `backdrop-blur-sm` from card containers (already covered in task 3).
11. **Comparison table** at [index.html:3417-3626](../index.html#L3417-L3626):
    - Change ✕ from `text-zinc-600` (already muted, but not the design-system token) to `text-[var(--fg-muted)]`. Audit found this is already gray; the change is aligning to the token so future re-theming works.
    - Increase cell padding from `px-5 py-4` to `px-6 py-5` for breathing room.
    - Surrounding container: add `my-16` gap around the price box (`[index.html:2159-2227]`) and the comparison table so they don't feel visually crammed.
12. **Rebuild CSS**: `npm run build`. Report before/after byte-count.
13. **Update design system doc.** Edit [docs/design-system.md](design-system.md) so that:
    - `.noise-overlay`, `.glass-nav backdrop-filter`, `backdrop-blur-*`, Lenis, hero video, decorative glow on reviews are all listed as **removed** with date `2026-09-XX`.
    - The "Kept" section drops Lenis and hero video.
    - Add an entry: "Emoji flags replaced with `CL · CO · PE · EC` text chips."
    - Add an entry: "Reviewer names use `--fg-muted`; no initials avatars."
14. **Optional (separate PR, flag as "Edmundo decides")**: light "paper" theme for `/blog/*`, `/recursos/*`, `/sectores/*`. Background `#F7F7F5`, same type scale, dark text. **Estimated effort**: 6–8 h (touches ~15 files). **Risk**: medium: introduces a second visual system; increases QA surface. **Recommendation**: defer to Batch 2 unless Edmundo has a specific reason to ship now.

**Verification checklist.**
- `grep -rE "noise-overlay|backdrop-blur|glass-nav" --include="*.html" .`: only remaining hits, if any, should be from `.glass-nav` class references without `backdrop-filter` styling (verify via CSS).
- `grep -rE "lenis" --include="*.html" -i .` returns 0.
- `grep -rE "vid/hero\\.mp4" .` returns 0.
- `grep -E "VideoObject" index.html` returns 0.
- `grep -rE "🇨🇱|🇨🇴|🇵🇪|🇪🇨" --include="*.html" .` returns 0.
- Lighthouse mobile Performance ≥90 on `/` (removing 2.1 MB video and Lenis JS should improve LCP and TBT noticeably).
- Manual browser check at 375px and 1440px: hero renders correctly with static background; no jank on anchor scroll; sticky CTA bar still visible on scroll.
- No H1/title/canonical/JSON-LD `@type` change on any page.

**Commit list.**
```
refactor(polish): remove noise-overlay, glass-nav backdrop-filter, backdrop-blur-*
refactor(polish): remove Lenis smooth scroll (rely on native)
refactor(polish): replace hero video with hero-static background and remove VideoObject JSON-LD
refactor(polish): unify logo strip, replace PNG logos with WebP/SVG
refactor(polish): reduce above-the-fold CTA variants
refactor(polish): replace emoji flags with text chips
refactor(polish): normalize headings to sentence case, translate Step to Paso
refactor(polish): restyle Google reviews module (no avatars, muted names)
refactor(polish): comparison table token + padding pass
docs: update design-system.md with removed effects
chore(seo): drop video block from sitemap.xml homepage entry
```

**Edmundo's manual steps.** Approve the SVG vs. WebP tradeoff for the three logos. Decide on the optional paper theme (recommend defer). After merge, run one full Lighthouse pass on desktop and mobile and record scores in `docs/measurement.md`.

**Estimated effort.** 12–18 h.

**Claude Code prompt (self-contained).**

> Working in the Growth Buddies static site. Follow `docs/design-system.md` ("Quiet Authority"). All user-facing copy in formal Chilean Spanish ("usted"). No em dashes.
>
> Branch: `refactor/phase-3-polish`.
>
> Execute tasks 2 through 13 of Phase 3 in the plan document, in that order. Key concrete substitutions:
> - `index.html:457`: remove `<div class="noise-overlay"></div>`.
> - `index.html:459`: remove `backdrop-filter`-generating classes from `<nav class="glass-nav">`; replace with solid `bg-[var(--bg)]/95`.
> - `index.html:541, 640, 2538, 2576, 2700, 2823`: remove `backdrop-blur-*` and substitute with solid-color backgrounds at appropriate opacity.
> - `index.html:417` and `4463-4482`: remove Lenis script tag and init block. Delete `js/lenis.min.js`. Grep across all HTML files and remove any other Lenis references.
> - `index.html:752-769`: replace `<div class="video-background-container">…</div>` with `<div class="hero-static absolute inset-0"></div>`. Delete `vid/hero.mp4`. **Also grep `index.html` for `"@type":\s*"VideoObject"` and delete the entire enclosing `<script type="application/ld+json">…</script>` block.** This is an approved exception to rule 1 (a block is deleted because its subject no longer exists; no `@type` on any surviving block changes). Remove `<video:video>` block from `sitemap.xml` at lines 13–20 without changing that URL's `lastmod`. After this step, `grep -E "VideoObject" index.html` must return 0.
> - `index.html:815-869` (logo strip): apply the treatment in plan Phase 3 task 6. Convert `img/groddiesLogo.png`, `img/summer.png`, `img/logo.png` to WebP at ~40 KB max (if SVG sources exist, prefer SVG). Update all `<img src>` references sitewide.
> - CTAs: collapse to the three-string set in plan Phase 3 task 7. Log every previous CTA string in the commit body.
> - Emoji flags: grep `🇨🇱|🇨🇴|🇵🇪|🇪🇨` in every HTML file and replace with `CL · CO · PE · EC` linked text chips.
> - Headings on `index.html`: first, `grep -nE 'Step [1-4]' index.html` to enumerate every occurrence. For each hit, determine whether it is visible copy or in an ARIA / sr-only attribute; translate "Step N" → "Paso N" in both cases (assistive tech users deserve the same Spanish). After the translation, `grep -nE '\bStep [1-4]\b' index.html` must return 0. Then apply the sentence-case list in Phase 3 task 9 (only to the specific visible headings listed there; do NOT rewrite headings that are already Spanish sentence case).
> - Google reviews (`index.html:2423-2690`): remove initials avatars, apply `text-[var(--fg-muted)]` on reviewer names, remove decorative glow.
> - Comparison table (`index.html:3417-3626`): swap ✕ color to `text-[var(--fg-muted)]`, bump cell padding to `px-6 py-5`, add `my-16` around the price box and comparison table containers.
> - `npm run build`: rebuild `dist/output.css`; report before/after byte-count.
> - Edit `docs/design-system.md` to reflect the actually-removed effects (per plan Phase 3 task 13).
>
> Do NOT ship the optional paper theme (Phase 3 task 14). Do NOT modify any URL, title, H1, canonical, or JSON-LD `@type`. Verify with `node scripts/check-links.js`, `bash scripts/check-hreflang.sh`, and grep queries in the plan verification checklist.

---

### Phase 4: Measurement and post-deploy

**Goal.** Instrument every new page with the same analytics as the site, define what "the round is working" and what "the round is hurting the trend" look like, and give the next Claude Code session a checklist.

**Not a code phase per se; it runs continuously.**

**Required events on every new page.** All four are already fired sitewide via inline IIFEs:
- `calendly_click`: fired when any anchor with `href*="calendly.com/espohr"` is clicked.
- `whatsapp_click`: fired when any anchor with `href*="wa.me/56975991366"` is clicked (after Phase 0's phone swap; verify the site-wide event listener uses the new number).
- `quiz_lead` and `quiz_complete`: fired by the homepage quiz IIFE; not applicable to sector/blog/service pages unless the quiz is embedded (it isn't in this batch: flag if the pillar wants a mini-quiz in Batch 2).

**How to verify.** Open GA4 DebugView, open each new page in an incognito tab with `?_dbg=1`, click the primary and secondary CTAs, confirm both events register with the expected `page_location`.

**Search Console checklist for the Batch 1 release.**
- After Phases 1 and 2 are merged to `main` and Vercel deploys, in Google Search Console:
  1. Resubmit `sitemap.xml`.
  2. For each of the 4 new URLs, open URL Inspection → Request Indexing. (Batch quota is 12/day; well within limits.)
  3. In Coverage → Excluded, look for any regression on existing pages within 48 h.
  4. In Enhancements → Breadcrumbs and Enhancements → FAQ, wait for the two new pillar/service pages to appear (typical delay 3–10 days).

**Lighthouse targets** (mobile, incognito, 4G throttling):
- Performance ≥ 90 (Phase 3's video/Lenis removal should push `/` above this if it isn't already).
- SEO ≥ 95.
- Accessibility ≥ 95.
- Best Practices ≥ 95.

**6-week monitoring rubric.**
- **Weekly for 6 weeks**: track total non-brand impressions and clicks in GSC for (a) each of the 4 new URLs and (b) the 6 protected pages listed in rule 1.
- **Green**: total non-brand impressions across existing pages hold or grow, new pages start collecting impressions within 2 weeks and clicks within 4.
- **Yellow**: an individual existing page drops >20% in impressions for 2 consecutive weeks without a corresponding search-trend explanation. Diagnose: is a new page cannibalizing? Check GSC "Queries" filter per page.
- **Red / rollback trigger**: total impressions across the 6 protected pages drop >25% versus the prior 3-week rolling average, sustained for **2 consecutive weeks**; OR any protected page loses top-10 position on its primary query for 2 consecutive weeks. Rollback path: **add `<meta name="robots" content="noindex">` to each of the 4 new pages and remove those URLs from `sitemap.xml`.** Do NOT revert the merge and do NOT delete the pages: the URLs must keep returning 200 (no 404s, no broken external links). Once the trend recovers, decide whether to re-enable indexing or to keep the pages non-indexable. In the same rollback PR, do NOT touch `lastmod` on any pre-existing sitemap entry.

**How to add the next batch (checklist for a future Claude Code session).**
1. Read `docs/PLAN-SEO-EXPANSION-2026-09.md` and `docs/keyword-map.md` in full.
2. Confirm the target queries are the "reserved" entries in the keyword map, or add new ones with cannibalization notes.
3. For each new page:
   - Register in `docs/keyword-map.md` **before** writing the page.
   - Build from `docs/cluster-template.md` skeleton.
   - Add three inbound links (pillar/service, one high-authority existing page, footer INSERTION POINT).
   - Add to `sitemap.xml`.
   - Verify with `node scripts/check-links.js` and `bash scripts/check-hreflang.sh`.
4. One PR per batch, commit-prefix `feat(seo-expansion): …`.
5. Edmundo submits URLs to Search Console after merge.

---

## 6. Release sequence

- **Week 1**: Phase 0 lands (one PR, `main`). Vercel auto-deploys.
- **Week 2**: Phases 1 and 2 ship **as one bundle** (`feat/seo-expansion-batch-1` branch merges both feature branches via merge PR, or ship as two consecutive PRs merged the same day). Edmundo submits 4 URLs to Search Console the same day.
- **After indexing is confirmed for Batch 1** (typically 3–10 days after submission), Phase 3 ships. This ordering means the visual polish PR does not muddy the SEO signal for the new pages.
- **Phase 4** runs continuously from the moment Phase 0 is on `main`.

---

## 7. Open questions for Edmundo (grouped, with recommended defaults)

### 7.1 Phase 0 (hygiene)
- **Q1.** Approve the two neutral SPI-generic phrasings? (Default: yes: the audit already includes them.) The two are "una plataforma de gestión documental con IA a medida" (generic; preferred) and "una plataforma de automatización de registros de propiedad intelectual" (for legal-specific contexts).
- **Q2.** Scarcity-counter cadence? (Recommended default: fortnightly update on the 1st and 15th, editing `MONTHLY_SLOTS` in `index.html:4954`.)
- **Q3.** Redeploy Cloud Functions in the same week to pick up the new phone in email templates? (Recommended default: within 7 days of the Phase 0 merge.)

### 7.2 Phase 1 (industrial cluster)
- **Q4.** Can Edmundo provide 1–2 numbers for the Ingeglobal narrative on the pillar (e.g. "detección de X anomalías por mes")? (Default: ship with `[EDMUNDO: dato]` placeholders and add later; do not invent metrics.)

### 7.3 Phase 2 (agents cluster)
- **Q6.** Reference USD/CLP exchange rate for the top-of-file `<!-- TIPO DE CAMBIO REFERENCIAL -->` comment in the pricing post. (Recommended default: use the current Banco Central observed rate rounded to the nearest 10 pesos; review quarterly.) Pricing tiers and recurring-cost figures are **locked** per the amendment; only this FX constant remains open.
- **Q7.** Agents service page Diagnóstico block confirmed: full price + credit + guarantee + a single "Proyectos a medida desde USD 3.000, cotizados tras el diagnóstico" line, plus a link out to the pricing post. Confirmation only: no decision needed.

### 7.4 Phase 3 (visual polish)
- **Q8.** SVG vs. WebP for the three PNG logos? (Recommended default: SVG if Edmundo has source files; otherwise 40 KB WebP.)
- **Q9.** Ship the optional paper theme for `/blog`, `/recursos`, `/sectores`? (Recommended default: defer to Batch 2: reduces this round's risk surface.)
- **Q10.** Keep the "Reservar mi cupo →" CTA in the closing section (below-the-fold) after the CTA reduction? (Recommended default: yes: it belongs only to the price box and closing.)

### 7.5 Phase 4 (measurement and cadence)
- **Q11.** Weekly-tracking spreadsheet or GSC-only? (Recommended default: GSC + a lightweight `docs/measurement.md` weekly note during the 6-week monitoring window.)

---

## Surprising findings: what the audit turned up that changed how the plan reads

1. **The design system already declared "Quiet Authority" done, but 6 of the 8 things it listed as removed are still in the code.** `.noise-overlay`, three `backdrop-blur-*` variants, `glass-nav` backdrop-filter, and (per the design doc's own "Kept" list) Lenis and hero video are supposed to persist: but the new brief overrides those two. So Phase 3 is partly finishing a job that was declared done, and partly extending it: and the design doc itself has to be updated to stop lying.
2. **There are three phone numbers in the repo, not two.** `README.md:185` contains `+56 9 7599 1366`, a stray that matches neither the deployed number (`+56 9 7599 1366`) nor the target (`+56 9 7599 1366`). It never existed operationally; it looks like a stale copy-paste. The Phase 0 sweep fixes it.
3. **The homepage sitemap entry still declares a video.** `sitemap.xml:12-24` has a full `<video:video>` block pointing at `vid/hero.mp4`. Removing the video without also removing this block will produce a broken sitemap-video record in Search Console: a small but easy oversight.
4. **Nav "Servicios" is an on-page anchor, and there is no `/servicios/` hub page.** Existing services live only as three siblings under `/servicios/`. Phase 2 builds a lightweight `/servicios/index.html` hub (four cards linking to the three existing service pages plus the new agents page) and repoints the nav to `/servicios`. The nav change ships in the same PR as the new service page, so users never land on a stale link.
5. **The Ingeglobal case has no landing page at all.** It appears only as a card on the homepage's client-strip and one prose line. The new industrial pillar effectively **is** the Ingeglobal case study container until (or unless) a `/casos/ingeglobal/` page is spun up in a future batch. Anchoring the pillar's proof section to that Ingeglobal narrative: with `[EDMUNDO: dato]` placeholders where metrics belong: is the plan's key structural decision.
