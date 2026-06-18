# Growth Buddies — Design System
**Theme:** Quiet Authority · minimalist, executive, evidence-led  
**Established:** 2026-06-18 · branch `feat/quiet-authority-design`

---

## 1. Design Principles

1. **Impact from type and space, not effects.** No glows, grain, or animated gradients.
2. **One disciplined accent.** `#0097B2` turquoise — used sparingly for interactive elements and the diagnostic marker only.
3. **Evidence-led.** Numbers, case results, guarantees carry the page — not decoration.
4. **Accessibility non-negotiable.** WCAG AA contrast, `:focus-visible` ring, `prefers-reduced-motion`, skip links.

---

## 2. Color Tokens (Single Source of Truth)

Defined in `src/input.css :root` and mirrored in `tailwind.config.js`.

```css
:root {
  /* Surfaces */
  --bg:              #0B0B0F   /* page background — calmer than pure black */
  --surface:         #14141A   /* cards, sidebar sections */
  --line:            #232330   /* hairline borders, dividers */

  /* Typography */
  --fg:              #ECECEF   /* primary text (WCAG AA on --bg: ~13.5:1) */
  --fg-muted:        #A7A7B2   /* secondary text (WCAG AA on --bg: ~5.8:1) */

  /* Accent — one turquoise, used sparingly */
  --accent:          #0097B2   /* interactive elements, eyebrow marker */
  --accent-strong:   #00B5D6   /* hover state only — no glow */
}
```

**Deprecated / removed:**
- `#00f6ff` — neon cyan, fully replaced by `--accent`
- `--color-cta-glow` / `--color-accent-glow` — set to `transparent`, produce no visual effect
- Section accent colors: emerald, purple, amber decorative uses → unified to `--accent` + neutrals

### Usage rules
- Background regions: `--bg` for pages, `--surface` for cards/panels
- Borders and dividers: `--line` only (1px)
- Text: `--fg` for headings and primary copy; `--fg-muted` for secondary/captions
- Accent: buttons, eyebrow underlines, active/focus states, one stat highlight per section maximum

---

## 3. Typography

### Font Pairing

| Role | Font | Usage |
|---|---|---|
| Headings | **Geist** (variable, wt 100–900) | All `h1`–`h4`, `.font-heading` class |
| Body | **Inter** (variable, wt 400–900) | All body copy, UI labels, captions |
| Signature | **Instrument Serif** (wt 400) | Leadership pull-quotes ONLY — one moment per page |
| Legacy | Space Grotesk | `@font-face` kept, not actively assigned |

### Type Scale (Tailwind utility classes)

```
text-display  clamp(2.75rem, 5.5vw, 4rem)   line-height 1.05   tracking -0.025em
text-h1       clamp(2rem, 4vw, 3rem)         line-height 1.1    tracking -0.02em
text-h2       clamp(1.5rem, 3vw, 2.25rem)    line-height 1.15   tracking -0.015em
text-h3       clamp(1.125rem, 2vw, 1.5rem)   line-height 1.2    tracking -0.01em
text-body     1.0625rem                       line-height 1.6
text-body-sm  0.9375rem                       line-height 1.6
text-eyebrow  0.6875rem                       line-height 1.4    tracking 0.12em
text-caption  0.8125rem                       line-height 1.5
```

**Reading width cap:** `max-w-prose-cap` = `70ch` for article/prose blocks.

---

## 4. The Diagnostic Marker (Signature Accent Flourish)

The one decorative accent element — a 2px `--accent` underline beneath section eyebrows:

```html
<p class="eyebrow">Metodología</p>
```

```css
.eyebrow {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  border-bottom: 2px solid var(--accent);
  padding-bottom: 0.25rem;
  display: inline-block;
  margin-bottom: 1rem;
}
```

Use on section headings only. Do not add competing flourishes elsewhere.

---

## 5. Components

### Buttons

**Primary (`.btn-cta`)**
```html
<a href="..." class="btn-cta">Agendar conversación →</a>
```
- Solid `--accent` fill, white text
- Hover: `--accent-strong` (`#00B5D6`), `translateY(-1px)`
- **No** `box-shadow` glow
- `:focus-visible` ring: 2px white outline

**Secondary (`.btn-outline`)**
```html
<a href="..." class="btn-outline">Conocer el servicio</a>
```
- Transparent bg, `--line` border, `--fg-muted` text
- Hover: border → `--accent`, text → `--fg`
- No fill on hover

### Cards

```html
<div class="card-dark p-8">...</div>
<!-- or -->
<div class="glass-card p-8">...</div>
```

Both classes now resolve identically:
- Background: `--surface`
- Border: 1px `--line`
- Border-radius: 10px
- Hover: border → `--accent`, `translateY(-1px)`
- **No** `backdrop-filter`, no `box-shadow` glow, no noise pseudo-element

### Navigation (`.glass-nav`)
- Background: `rgba(11,11,15,0.88)` + `blur(8px)`
- Border-bottom: 1px `--line`
- On scroll (`.scrolled`): background → `rgba(11,11,15,0.97)`

### Section Dividers
```html
<hr class="border-t border-[var(--line)]" />
<!-- or structural div -->
<div class="section-divider my-16"></div>
```

---

## 6. Removed Effects

| Effect | Removal |
|---|---|
| `.noise-overlay` grain animation | `display: none` in CSS |
| `.hero-gradient-bg` mesh-drift animation | Static radial only, no `background-size` or `animation` |
| `.hero-grain` | `display: none` |
| `.glow-blob` mouse-tracking glow | `display: none` |
| `.glow-card` box-shadow glow | Replaced with `border-color` hover only |
| `.step-glow` box-shadow | Removed |
| `.glass-card::before` noise texture | `display: none` |
| `backdrop-filter` on cards | Removed |
| `.animated-gradient-text` animation | Rendered as solid `--fg` |
| `.magnetic-btn` JS (3D magnetic) | Script block removed from `index.html` |
| `.type-tilt` JS (3D tilt) | Script block removed from `index.html` |
| Decorative emerald/purple/amber classes | Replaced with `--accent` + neutral equivalents |
| Oversized display stats (10rem) | Capped to `clamp(3.5rem,8vw,6rem)` |
| `box-shadow` glow on `.btn-cta` | Removed; `--color-cta-glow: transparent` |

**Kept:**
- Hero video (opacity reduced 0.3 → 0.12 for quieter presence)
- Single calm scroll-reveal (`.reveal` fade + 14px translate, 0.5s)
- FAQ accordion slide-down
- Sticky CTA bar animation
- Lenis smooth scroll
- `prefers-reduced-motion` override

---

## 7. Spacing Rhythm

8px base unit. Section vertical padding: `py-20` (80px) to `py-28` (112px).  
Use `gap-8` (32px) for card grids, `gap-4` (16px) for tight lists.  
Paragraph max-width: `max-w-prose-cap` (70ch).

---

## 8. Accessibility

- Skip link: first element in `<body>` — `<a href="#main-content" class="sr-only ...">Saltar al contenido</a>`
- `:focus-visible` ring: 2px `--accent`, offset 3px (white on dark buttons)
- `prefers-reduced-motion`: all animations/transitions → 0.01ms, `.reveal` opacity forced to 1
- Minimum touch target: 44px height on all interactive elements
- Contrast ratios: `--fg` on `--bg` ≈ 13.5:1 ✅; `--fg-muted` on `--bg` ≈ 5.8:1 ✅; `--accent` on `--bg` ≈ 3.8:1 (large text / UI only) ✅

---

## 9. File Locations

| File | Purpose |
|---|---|
| `src/input.css` | All `:root` tokens, component classes, global base styles |
| `tailwind.config.js` | Token aliases for Tailwind utilities, type scale, keyframes |
| `dist/output.css` | Compiled output — **do not edit** |

---

## 10. How to Add a New Page

1. Use `--bg` as `<body>` background (set by CSS, no class needed)
2. Include `<link href="/dist/output.css" rel="stylesheet">` (relative path varies by depth)
3. Add skip link as first `<body>` child
4. Use `.btn-cta` for primary CTAs, `.btn-outline` for secondary
5. Use `.card-dark` or `.glass-card` for content cards — they're identical
6. Use `.eyebrow` class for section labels; this produces the diagnostic marker underline
7. Use `.reveal` on sections for scroll-triggered fade-in
