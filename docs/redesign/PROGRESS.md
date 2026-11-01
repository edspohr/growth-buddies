# Rediseño growthbuddies.cl: progreso

Repo de trabajo: ~/dev/growth-buddies (fuera de iCloud). No usar ~/Documents/web-growth-buddies/growth-buddies.

## Estado de etapas
| Etapa | Estado |
|---|---|
| 0 Setup | Completa |
| 1 Hosting Firebase | Completa; falta certificado de www |
| 2 Correcciones | Completa; ver preguntas abiertas |
| 3 Sistema visual | Completa |
| 4 a 8 | Pendientes |

## Decisiones
- 2026-11-01. Git se colgaba porque iCloud evictó 2.344 archivos de .git, incluido el pack principal. Se clonó en ~/dev/growth-buddies. La carpeta original queda intacta porque conserva ramas locales que no están en GitHub.
- 2026-11-01. admin/ se publica: es el panel de leads, protegido por Firebase Auth, noindex y bloqueado en robots.txt.
- 2026-11-01. Las páginas origen de redirects siguen en public/. Firebase las redirige antes de servirlas, y mientras Vercel siga en producción no deben dar 404. Eliminarlas en Etapa 2.
- 2026-11-01. Destinos de redirect sin slash final para cumplir un solo salto. Se agregó /soluciones/catalogo porque cleanUrls lo genera.
- 2026-11-01. dist/output.css deja de versionarse. CSS se compila en public/dist/. npm run watch sigue escribiendo dist/ para desarrollo local.
- 2026-11-01. scripts/generate-sitemap.js no existe, aunque sitemap.xml lo cita. Crearlo antes de la Etapa 5.

## Preguntas abiertas
4. BrokerIA dice Cupos limitados con mayúscula: el control no lo detecta. Resolver en Etapa 4.
1. El PDF del informe no existe. El formulario envía la versión web. La página aún dice PDF en sus títulos.
2. From de correos sigue en edmundo@growthbuddies.cl (dominio verificado en Resend), con Reply-To edmundo@spohr.cl.
3. Desconectar Vercel cuando www esté verificado.

## Autorizaciones
- 2026-11-01. Edmundo autorizó el deploy live de Etapa 1 pese al control de textos prohibidos, que falla por contenido ya presente en producción. Vale solo para este deploy.

- 2026-11-01. Etapa 2: leads y calculator_leads quedan con create cerrado porque ningún formulario las escribe; Etapa 6 reabre leads.
- 2026-11-01. Se adelantó de Etapa 4 la eliminación de contadores (home y tres países) y de Fundación Katy Summer (logo, caso e imagen), para que el control pase sin excepción. El home queda con 5 casos.
- 2026-11-01. Fuentes con {{calendly}} y {{whatsapp}}: se rellenan desde src/cta.config.json en el build.

- 2026-11-01. Etapa 3: /admin no se migró, es interno y no usa output.css. Instrument Serif se mantiene en citas. Terracota aplicada a cifras de 24px o más con porcentaje o tiempo.

## Registro de deploys
| Fecha | Destino | Referencia |
|---|---|---|
| 2026-11-01 | Canal stage-1 (expira 2026-12-01) | https://growth-buddies--stage-1-wpiwpcyy.web.app |
| 2026-11-01 14:16 | Live growth-buddies.web.app | ded03de desde la rama. Release anterior: 2026-04-02 15:05. Rollback: Firebase Console, Hosting, historial de versiones, o redeploy del commit anterior |
| 2026-11-01 | Live vía GitHub Actions + functions y rules | bddb96b, run 41337759100 |
