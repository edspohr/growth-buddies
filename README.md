# Growth Buddies

Sitio web de [growthbuddies.cl](https://growthbuddies.cl). Growth Buddies SpA es una empresa chilena que construye e implementa herramientas operativas con IA.

## Oferta

| Oferta | Para quién | URL |
|--------|-----------|-----|
| Expense Buddy | Rendición de gastos para equipos en terreno | `/expense-buddy` |
| DocFlow Buddy | Documentos y casos con IA | `/docflow-buddy` |
| Agent Buddy (Web y a medida) | Asistentes de IA para el sitio y los procesos | `/agent-buddy` |
| Diagnóstico de automatización | Empresas que no tienen claro por dónde empezar | `/diagnostico` |

El CTA principal es "Recibir propuesta en 24 horas", que lleva al formulario. En `/diagnostico` el CTA es "Solicitar diagnóstico".

El diagnóstico tiene un valor fijo de CLP 490.000 + IVA en Chile y se cotiza en moneda local en otros países. Se entrega en 10 a 15 días, con oportunidades priorizadas y una maqueta funcionando. El 100% se descuenta de la implementación o capacitación contratada dentro de 90 días.

## Stack

| Capa | Tecnología |
|------|------------|
| Sitio | HTML estático, sin framework |
| Estilos | Tailwind CSS v3 |
| Hosting | Firebase Hosting, publicado con GitHub Actions |
| Backend | Cloud Functions (Node.js 22, `us-central1`) y Firestore |
| Correo | Resend |
| Medición | Google Analytics 4, Microsoft Clarity, Google Ads |

## Desarrollo

Trabaje en `~/dev/growth-buddies`, no en una carpeta sincronizada con iCloud.

```bash
npm install
```

```bash
npm run build
```

`npm run build` genera `public/` desde una lista blanca (`scripts/build-public.mjs`). También reemplaza `{{calendly}}`, `{{whatsapp}}` y `{{form}}` con los valores de `src/cta.config.json`, e incluye `src/lead-form.html` y `src/products-strip.html`. Una carpeta nueva solo se publica si se agrega a esa lista.

Si agrega o elimina páginas, regenere el sitemap:

```bash
npm run build && npm run sitemap && npm run build
```

## Controles

```bash
npm run check -- <url>
```

```bash
node scripts/checks/mobile.mjs <url>
```

```bash
node scripts/checks/contrast.mjs <url>
```

```bash
node scripts/checks/lighthouse.mjs <url> /
```

Las pruebas de reglas y del formulario usan emuladores y requieren Java:

```bash
PATH="$(brew --prefix openjdk@21)/bin:$PATH" npm run test:rules
```

```bash
PATH="$(brew --prefix openjdk@21)/bin:$PATH" npm run test:lead
```

## Despliegue

- **Sitio:** un push a `main` publica en vivo con `hosting-live.yml`. Cada pull request crea una vista previa con `hosting-pr.yml`.
- **Funciones:** `firebase deploy --only functions --project growth-buddies`
- **Reglas:** `firebase deploy --only firestore:rules --project growth-buddies`

Si un cambio toca el formulario y el backend, publique primero las funciones. El CSS se cachea 24 horas, por eso su URL lleva un hash.

## Documentación

- `CLAUDE.md`: reglas del proyecto.
- `docs/design-system.md`: tokens y componentes.
- `docs/redesign/PROGRESS.md`: decisiones y despliegues.
- `docs/redesign/pendientes.md`: pendientes de Edmundo.

## Contacto

- Edmundo Spohr, director: [edmundo@spohr.cl](mailto:edmundo@spohr.cl)
- WhatsApp: [+56 9 7599 1366](https://wa.me/56975991366)
- LinkedIn: [linkedin.com/company/growth-buddies](https://www.linkedin.com/company/growth-buddies)
