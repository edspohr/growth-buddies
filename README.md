# Growth Buddies — Sitio Web Corporativo

Sitio web de [growthbuddies.cl](https://growthbuddies.cl), consultora chilena especializada en automatización inteligente, IA corporativa y gestión del cambio para estudios jurídicos, corredoras de propiedades y empresas en transformación digital.

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Markup | HTML5 semántico (estático, sin framework) |
| Estilos | Tailwind CSS v3.4 + PostCSS |
| Tipografía | Inter (body) · Space Grotesk (display) via Google Fonts |
| Animaciones | Lenis (smooth scroll) · GSAP ScrollTrigger · CSS keyframes |
| Analytics | Microsoft Clarity |
| Agendamiento | Calendly (embed inline, desktop only) |
| Despliegue | Vercel (CDN, clean URLs, trailing-slash off) |

## Estructura del Proyecto

```
growth-buddies/
├── index.html                          # Homepage
├── sitemap.xml
├── robots.txt
├── 404.html
│
├── servicios/
│   ├── automatizacion-inteligente/     # Legal Tech & Ops
│   ├── ia-corporativa/                 # IA Corporativa
│   └── gestion-del-cambio/             # Gestión del Cambio
│
├── soluciones/
│   ├── catalogo.html                   # Catálogo completo de Mini Apps
│   ├── brokeria/                       # BrokerIA — Corretaje Inteligente ✦
│   ├── automatizacion-legal-emails/    # Triaje Legal (Email AI)
│   ├── gestion-documental-ip/          # Validación Documental
│   └── rendicion-gastos-ia/            # Rendición de Gastos IA
│
├── blog/
│   ├── index.html                      # Blog index
│   ├── automatizacion-contratos-legales-2026/
│   ├── roi-ia-estudios-juridicos/
│   ├── casos-exito-transformacion-chile/
│   └── ia-corretaje-propiedades-chile/
│
├── equipo/
│   ├── edmundo-spohr/
│   └── felipe-soto-santibanez/
│
├── metodologia/
│   ├── diagnostico/
│   ├── diseno/
│   ├── build/
│   └── adopcion/
│
├── src/
│   └── input.css                       # Tailwind source (directivas + custom CSS)
├── dist/
│   └── output.css                      # CSS compilado (no editar directamente)
│
├── img/                                # Imágenes en formato .webp
├── vid/                                # Videos hero en .mp4
├── tailwind.config.js
├── vercel.json
└── package.json
```

## Desarrollo Local

### Prerequisitos

- Node.js ≥ 18
- npm

### Instalación

```bash
npm install
```

### Compilar CSS

```bash
# Compilación única
npm run build

# Modo watch (recompila al guardar)
npm run watch
```

> **Importante:** `dist/output.css` es el CSS compilado. Toda modificación de estilos debe hacerse en `src/input.css` o en las clases Tailwind del HTML, y luego recompilar.

### Servidor local

Cualquier servidor estático sirve el proyecto. Con Python:

```bash
python3 -m http.server 8080
```

O con la extensión Live Server de VS Code apuntando a `index.html`.

## Despliegue

El sitio se despliega automáticamente en **Vercel** al hacer push a `main`.

Configuración relevante (`vercel.json`):
- **Clean URLs**: activo — `/servicios/ia-corporativa/` en lugar de `.html`
- **Trailing slash**: desactivado
- **Cache**: assets estáticos (webp, mp4, css, js) con `max-age=31536000, immutable`
- **Redirect**: `www.growthbuddies.cl` → `growthbuddies.cl` (301 permanente)
- **404**: ruta catch-all apunta a `404.html`

## Diseño & Convenciones

### Tema visual
- Fondo base: `#050510` (dark blueish)
- Acento principal: `#00f6ff` (cyan) — `var(--color-accent)`
- Acento PropTech/BrokerIA: `amber-400/500`
- Fuente display: Space Grotesk (headings, badges, nav)
- Glassmorphism en navbar: `backdrop-blur` + `bg-black/60`

### Accesibilidad (WCAG AA)
- Skip-to-content link en todas las páginas
- `id="main-content"` en `<main>` de todas las páginas
- `aria-label` en todos los links de solo icono
- `aria-expanded` en botón hamburger del nav móvil
- `:focus-visible` con outline cyan para navegación por teclado
- `prefers-reduced-motion`: animación de noise-overlay desactivada
- Contraste mínimo: `text-slate-400` sobre fondo oscuro (~9.5:1)

### Rendimiento
- Google Fonts con `<link rel="preload" as="style" crossorigin>` + `<link rel="stylesheet">`
- Scripts Lenis con `defer`
- Imágenes en `.webp`, videos en `.mp4`
- `will-change: transform` en `.noise-overlay`
- Assets servidos con CDN + cache inmutable desde Vercel

### Navegación estándar (todas las páginas)
```
Inicio | Servicios | Soluciones | Blog | Contacto
```
- Desktop: `hidden md:flex` con estado activo en `text-white`
- Mobile: menú hamburger con `aria-expanded`

### Footer canónico (4 columnas)
1. Marca + redes sociales
2. Servicios
3. Mini Apps (BrokerIA ✦ en amber como producto estrella)
4. Explora (Metodología, Equipo, Blog)

### Links internos
- Siempre root-relative con trailing slash: `/servicios/ia-corporativa/`
- Excepción: `catalogo.html` sin trailing slash (archivo `.html` explícito con anchors)
- Links externos: siempre `target="_blank" rel="noopener noreferrer"`

## Mini Apps — Catálogo

| Mini App | Sector | Ruta |
|----------|--------|------|
| **BrokerIA** ✦ | PropTech | `/soluciones/brokeria/` |
| Triaje Legal (Email AI) | Legal Tech | `/soluciones/automatizacion-legal-emails/` |
| Validación Documental | Legal Tech | `/soluciones/gestion-documental-ip/` |
| Rendición de Gastos IA | Finance Ops | `/soluciones/rendicion-gastos-ia/` |
| Auto Timesheet | Legal Tech | `/soluciones/catalogo.html#timesheet` |

## Funcionalidades del Homepage

- **Hero** con video de fondo (`vid/hero.mp4`) y CTA dual
- **ROI Calculator** con sliders interactivos y resultado animado
- **Tarjetas de clientes** con micro-testimoniales (6 clientes)
- **Formulario de contacto** con:
  - Dropdown "Tipo de consulta" (Auditoría / Demo / Consulta General / BrokerIA Piloto)
  - Validación inline en blur + submit
  - Spinner en botón durante envío
  - Envío a WhatsApp con mensaje pre-formateado
- **Calendly embed** (columna izquierda del contacto, solo desktop via `matchMedia`)
- **Sticky CTA bar** móvil (aparece al salir del hero, via IntersectionObserver)
- **Exit-intent popup** (mouseleave en `document`, guardado en `sessionStorage`)

## Contacto & Equipo

- **Edmundo Spöhr** — CEO & Co-founder — [edmundo@growthbuddies.cl](mailto:edmundo@growthbuddies.cl)
- **Felipe Soto Santibáñez** — Co-founder
- WhatsApp: [+56 9 6586 3160](https://wa.me/56965863160)
- LinkedIn: [linkedin.com/company/growth-buddies](https://www.linkedin.com/company/growth-buddies)
