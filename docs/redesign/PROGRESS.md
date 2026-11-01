# Rediseño growthbuddies.cl: progreso

Repo de trabajo: ~/dev/growth-buddies (fuera de iCloud). No usar ~/Documents/web-growth-buddies/growth-buddies.

## Estado de etapas
| Etapa | Estado |
|---|---|
| 0 Setup | Completa |
| 1 Hosting Firebase | Vista previa lista. Deploy live y merge a main detenidos: ver preguntas abiertas |
| 2 a 8 | Pendientes |

## Decisiones
- 2026-11-01. Git se colgaba porque iCloud evictó 2.344 archivos de .git, incluido el pack principal. Se clonó en ~/dev/growth-buddies. La carpeta original queda intacta porque conserva ramas locales que no están en GitHub.
- 2026-11-01. admin/ se publica: es el panel de leads, protegido por Firebase Auth, noindex y bloqueado en robots.txt.
- 2026-11-01. Las páginas origen de redirects siguen en public/. Firebase las redirige antes de servirlas, y mientras Vercel siga en producción no deben dar 404. Eliminarlas en Etapa 2.
- 2026-11-01. Destinos de redirect sin slash final para cumplir un solo salto. Se agregó /soluciones/catalogo porque cleanUrls lo genera.
- 2026-11-01. dist/output.css deja de versionarse. CSS se compila en public/dist/. npm run watch sigue escribiendo dist/ para desarrollo local.
- 2026-11-01. scripts/generate-sitemap.js no existe, aunque sitemap.xml lo cita. Crearlo antes de la Etapa 5.

## Preguntas abiertas
1. El control de textos prohibidos falla por 49 archivos con textos ya presentes en producción. Etapa 1 prohíbe cambiar copy, y la regla exige pasar todos los controles antes del deploy live.

## Registro de deploys
| Fecha | Destino | Referencia |
|---|---|---|
| 2026-11-01 | Canal stage-1 (expira 2026-12-01) | https://growth-buddies--stage-1-wpiwpcyy.web.app |
