/**
 * Opportunity Matching Engine for Growth Buddies Quiz
 *
 * Deterministic matching: given quiz answers, returns exactly 3 unique opportunities
 * tailored to the lead's sector, pain points, and team size.
 *
 * Used by:
 *   - Frontend (index.html quiz): shows opportunity titles in success state
 *   - Backend (functions/sendQuizReport.js): full opportunity data for PDF generation
 *
 * Module pattern: works in both Node.js (require) and browser (global window.OpportunityEngine).
 */

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.OpportunityEngine = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {

  // ─── SECTORS ─────────────────────────────────────────────────────────────
  // Each sector has: id, label (UI display), pool (array of opportunity IDs from library)

  const SECTORS = [
    {
      id: "legal",
      label: "Estudios jurídicos",
      hourlyRate: 35,
      pool: ["legal-validation", "legal-triage", "legal-contracts", "legal-knowledge", "legal-time-tracking"]
    },
    {
      id: "industrial",
      label: "Industrial / Manufactura",
      hourlyRate: 22,
      pool: ["ind-predictive", "ind-procurement", "ind-kpi-reports", "ind-maintenance-triage", "ind-traceability"]
    },
    {
      id: "engineering",
      label: "Ingeniería / Construcción",
      hourlyRate: 28,
      pool: ["eng-quotes", "eng-tech-docs", "eng-progress-reports", "eng-cross-validation", "eng-doc-management"]
    },
    {
      id: "consulting",
      label: "Consultoría profesional",
      hourlyRate: 32,
      pool: ["cons-proposals", "cons-rfp-triage", "cons-project-reports", "cons-knowledge-base", "cons-timesheet"]
    },
    {
      id: "logistics",
      label: "Logística / Distribución",
      hourlyRate: 20,
      pool: ["log-routing", "log-incident-triage", "log-demand-forecast", "log-reconciliation", "log-customer-comms"]
    }
  ];

  // ─── OPPORTUNITY LIBRARY ─────────────────────────────────────────────────
  // 25 opportunities total (5 per sector). Each has rich content for PDF generation.
  //
  // Fields:
  //   id: string identifier
  //   title: short display title (used in UI and as section header in PDF)
  //   sector: which sector this belongs to
  //   pains: array of pain IDs that boost this opportunity's priority
  //   why: 3-4 lines explaining why this applies to the lead's context (PDF page)
  //   how: 3-4 lines explaining technical implementation + tools (PDF page)
  //   timeline: estimated implementation timeline (e.g., "4-8 semanas")
  //   roiShare: percentage of total ROI assigned to this opportunity (0.5, 0.3, 0.2 by priority)
  //   risks: 1-2 lines about risk of NOT doing this
  //
  // CRITICAL: write the why/how/risks in formal Spanish "usted/su" form to match site voice.
  // Be specific to the sector — do NOT use generic phrases like "automate manual work".
  // Reference real tools where appropriate (Google Workspace, SAP, Procore, Microsoft 365, etc.)

  const OPPORTUNITY_LIBRARY = {
    // ─── LEGAL (5 opportunities) ─────────────────────────────────────────
    "legal-validation": {
      id: "legal-validation",
      title: "Validación documental contra playbook del estudio",
      sector: "legal",
      pains: ["docs", "compliance"],
      why: "Los estudios jurídicos pierden entre 8 y 12 horas semanales por abogado revisando contratos contra el playbook interno. La inconsistencia entre revisores genera riesgo legal y retrabajos. Una empresa de su tamaño suele detectar errores en revisión final que ya pasaron por dos revisores intermedios.",
      how: "Un agente IA entrenado con el playbook del estudio analiza cada contrato entrante y emite un informe de cumplimiento con desviaciones específicas. Se integra con Microsoft Word, Google Docs o el sistema documental que ya utilice (iManage, NetDocuments). El abogado revisa el informe en lugar de leer el contrato completo.",
      timeline: "6-10 semanas",
      roiShare: 0.5,
      risks: "Sin validación sistemática, los errores que pasan a firma generan disputas posteriores costosas. La inversión recurrente en revisión manual escala con cada nuevo abogado contratado."
    },
    "legal-triage": {
      id: "legal-triage",
      title: "Triaje automatizado de consultas entrantes",
      sector: "legal",
      pains: ["emails", "responsiveness"],
      why: "El 40-60% del tiempo de los socios se pierde clasificando consultas entrantes que no requieren su nivel de expertise. Un estudio de su tamaño recibe entre 200 y 500 consultas semanales por correo, formulario web y referidos.",
      how: "IA que clasifica cada consulta por materia legal, urgencia, tipo de cliente y derivación interna. Las consultas claramente fuera del foco del estudio reciben respuesta automática educada. Las relevantes llegan al socio correcto con resumen ejecutivo de 3 líneas y antecedentes pre-cargados.",
      timeline: "4-6 semanas",
      roiShare: 0.3,
      risks: "Sin triaje, los socios responden personalmente consultas que un asociado podría manejar, generando cuello de botella para clientes existentes y pérdida de oportunidades nuevas."
    },
    "legal-contracts": {
      id: "legal-contracts",
      title: "Generación asistida de contratos y minutas",
      sector: "legal",
      pains: ["docs", "repetitive"],
      why: "El 70% de los contratos de un estudio típico son variantes de 8-12 plantillas base. Sin embargo, generarlos manualmente toma 30-90 minutos cada uno por las personalizaciones específicas de cada caso. Su equipo probablemente reescribe las mismas cláusulas múltiples veces por semana.",
      how: "Un sistema que combina las plantillas base del estudio con un formulario inteligente que captura los datos específicos del caso (partes, montos, plazos, condiciones especiales). La IA aplica las cláusulas estándar, marca los puntos que requieren juicio profesional y genera el borrador en minutos. El abogado solo revisa y ajusta lo crítico.",
      timeline: "8-12 semanas",
      roiShare: 0.5,
      risks: "El tiempo de los abogados invertido en redacción mecánica es tiempo que no se factura como asesoría estratégica. El cliente tampoco percibe el valor diferenciado de un estudio premium si recibe el mismo contrato que cualquier otro."
    },
    "legal-knowledge": {
      id: "legal-knowledge",
      title: "Base de conocimientos con búsqueda por lenguaje natural",
      sector: "legal",
      pains: ["knowledge", "onboarding"],
      why: "Los precedentes, dictámenes y casos previos del estudio están dispersos entre carpetas de Drive, archivos personales de cada socio y la memoria colectiva. Un abogado nuevo toma entre 3 y 6 meses en alcanzar productividad efectiva por la curva de búsqueda interna.",
      how: "IA que indexa todo el repositorio documental del estudio (incluyendo PDFs escaneados con OCR) y permite búsquedas como 'casos donde defendimos a un cliente por incumplimiento contractual con cláusula de fuerza mayor invocada'. Devuelve los 3-5 documentos relevantes con extractos resaltados.",
      timeline: "6-8 semanas",
      roiShare: 0.3,
      risks: "El conocimiento crítico del estudio depende de qué socio esté disponible cuando surge una consulta. Si esa persona renuncia, el estudio pierde acceso operativo a años de experiencia acumulada."
    },
    "legal-time-tracking": {
      id: "legal-time-tracking",
      title: "Registro pasivo de horas trabajadas",
      sector: "legal",
      pains: ["billing", "admin"],
      why: "Los abogados subreportan entre 20% y 35% de las horas trabajadas porque el registro manual es tedioso y se pospone hasta el viernes. Esa subfacturación, en un equipo de su tamaño, suele significar pérdidas de USD 50.000 a USD 150.000 anuales.",
      how: "Un agente que captura automáticamente la actividad del abogado (correos enviados, archivos abiertos, llamadas en calendario) y genera el registro de horas pre-llenado por cliente y materia. El abogado revisa, ajusta si es necesario y aprueba en 5 minutos al final del día.",
      timeline: "4-6 semanas",
      roiShare: 0.2,
      risks: "Cada hora no facturada es ingreso perdido permanente. La cultura del estudio se acostumbra a que la subfacturación sea normal, lo cual destruye márgenes a largo plazo."
    },

    // ─── INDUSTRIAL / MANUFACTURA (5 opportunities) ──────────────────────
    "ind-predictive": {
      id: "ind-predictive",
      title: "Predicción de fallas en equipos por análisis de patrones",
      sector: "industrial",
      pains: ["downtime", "maintenance"],
      why: "El mantenimiento correctivo cuesta entre 3 y 9 veces más que el preventivo. Una planta de su tamaño suele tener entre 40 y 120 horas de paradas no planificadas al mes, cada una con costo directo (producción perdida) e indirecto (cumplimiento de plazos).",
      how: "IA que analiza datos históricos de los equipos (vibración, temperatura, consumo eléctrico, ciclos de operación) y emite alertas cuando los patrones desvían de la operación normal. Se integra con sistemas SCADA, sensores IoT existentes o se monta sobre la data que ya recolecta su CMMS (SAP PM, Maximo, Fracttal).",
      timeline: "10-16 semanas",
      roiShare: 0.5,
      risks: "Sin predicción, las fallas críticas se descubren en producción con costo total. Cada parada no planificada erosiona la confianza de clientes que dependen de plazos firmes."
    },
    "ind-procurement": {
      id: "ind-procurement",
      title: "Automatización de órdenes de compra y reposición",
      sector: "industrial",
      pains: ["procurement", "inventory"],
      why: "El equipo de compras gasta entre 60% y 70% de su tiempo en tareas repetitivas: cotizar a 3 proveedores, negociar precios marginales, generar OC, hacer seguimiento. El tiempo restante para análisis estratégico y gestión de proveedores críticos es mínimo.",
      how: "Sistema que monitorea niveles de inventario en tiempo real, dispara cotizaciones automáticas a proveedores aprobados cuando se alcanza punto de reorden, compara ofertas y propone OC pre-aprobada al jefe de compras. Para insumos estandarizados (consumibles, repuestos comunes), la OC se emite sin intervención humana.",
      timeline: "8-12 semanas",
      roiShare: 0.3,
      risks: "Los quiebres de stock generan paradas en producción. Sobrestoquear amarra capital de trabajo. El equilibrio manual es imposible de sostener con la cantidad de SKUs que maneja una planta industrial."
    },
    "ind-kpi-reports": {
      id: "ind-kpi-reports",
      title: "Reportería automatizada de KPIs operacionales",
      sector: "industrial",
      pains: ["reporting", "visibility"],
      why: "Los reportes operacionales (OEE, scrap rate, rendimiento por línea, eficiencia por turno) se generan manualmente cada semana o mes en Excel. El supervisor invierte entre 6 y 12 horas semanales en consolidar datos. Cuando llega a la gerencia, el dato ya tiene 5-10 días de antigüedad.",
      how: "Pipeline automático que ingiere datos de ERP, MES, sistemas de calidad y planillas de operadores. Genera dashboards en tiempo real (Power BI, Looker, Tableau) con drilldown por línea, turno, producto y operador. Alertas automáticas cuando un KPI sale del rango aceptable.",
      timeline: "6-10 semanas",
      roiShare: 0.5,
      risks: "Decidir con datos viejos significa actuar sobre problemas que ya escalaron. La gerencia opera con foto en lugar de película, lo cual impide intervenciones tempranas."
    },
    "ind-maintenance-triage": {
      id: "ind-maintenance-triage",
      title: "Triaje IA de tickets de mantención",
      sector: "industrial",
      pains: ["maintenance", "responsiveness"],
      why: "Los tickets de mantención llegan por WhatsApp, correo, planilla compartida o llamada. El jefe de mantención dedica 1-2 horas diarias a clasificar, priorizar y asignar. En el proceso, los tickets críticos quedan mezclados con solicitudes menores.",
      how: "IA que clasifica cada ticket entrante por urgencia, tipo de equipo, técnico calificado disponible y costo estimado. Asigna automáticamente al técnico correcto, agenda en su calendario y notifica al área solicitante con ETA. Los tickets críticos disparan alerta al jefe sin filtros.",
      timeline: "4-6 semanas",
      roiShare: 0.2,
      risks: "Sin triaje, las urgencias reales compiten con solicitudes rutinarias. El equipo de mantención reacciona en lugar de operar bajo plan, generando ineficiencia compuesta."
    },
    "ind-traceability": {
      id: "ind-traceability",
      title: "Trazabilidad de lotes y certificación documental",
      sector: "industrial",
      pains: ["compliance", "quality"],
      why: "La trazabilidad obligatoria en industria alimentaria, farmacéutica o automotriz requiere documentación exhaustiva por lote. Una auditoría de cliente o ente regulador puede paralizar la operación si los registros no están en orden. El armado manual del expediente toma días.",
      how: "Sistema que genera automáticamente el expediente completo de cada lote (materias primas, condiciones de proceso, controles de calidad, despacho) en formato PDF firmado digitalmente. Búsqueda inversa: 'dame todo lo relacionado al lote XYZ' devuelve el dossier completo en segundos.",
      timeline: "8-12 semanas",
      roiShare: 0.3,
      risks: "Una falla en trazabilidad puede generar retiros masivos de producto, multas regulatorias y pérdida de certificaciones. El costo de una sola crisis supera por mucho la inversión en automatización."
    },

    // ─── INGENIERÍA / CONSTRUCCIÓN (5 opportunities) ─────────────────────
    "eng-quotes": {
      id: "eng-quotes",
      title: "Generación automatizada de cubicaciones y presupuestos",
      sector: "engineering",
      pains: ["quoting", "repetitive"],
      why: "Cubicar un proyecto mediano toma entre 40 y 120 horas hombre. Los ingenieros más senior dedican parte significativa de su semana a esta tarea repetitiva, en lugar de diseño o gestión de obra. La velocidad de respuesta a licitaciones es un diferenciador competitivo crítico.",
      how: "IA que toma el set de planos y EETT del proyecto, identifica partidas, calcula cantidades por elemento (m² de muros, m³ de hormigón, ml de instalaciones), aplica precios unitarios actualizados de la base de datos de la empresa y emite presupuesto detallado. El ingeniero revisa, ajusta los puntos críticos y firma.",
      timeline: "10-16 semanas",
      roiShare: 0.5,
      risks: "Una empresa que tarda 2 semanas en cotizar pierde licitaciones contra otra que responde en 3 días. El ingeniero senior cubicando es talento técnico mal asignado."
    },
    "eng-tech-docs": {
      id: "eng-tech-docs",
      title: "Procesamiento automatizado de documentos técnicos",
      sector: "engineering",
      pains: ["docs", "knowledge"],
      why: "Los planos, EETT, BOM y especificaciones de un proyecto suman entre 200 y 1500 páginas. Buscar 'qué dice la EETT sobre la conexión X en el piso Y' significa abrir 5 documentos y leer manualmente. El tiempo desperdiciado se acumula en cada conversación de obra.",
      how: "Sistema que indexa todos los documentos del proyecto con OCR para planos escaneados y permite consultas en lenguaje natural: 'qué tipo de cañería va en el piso 3, eje 5'. Devuelve la respuesta con cita exacta del documento fuente y página.",
      timeline: "6-10 semanas",
      roiShare: 0.3,
      risks: "Las decisiones de obra se toman sin consulta al documento fuente porque revisarlo es lento. El resultado son no conformidades que se descubren tarde y cuestan rehacer."
    },
    "eng-progress-reports": {
      id: "eng-progress-reports",
      title: "Automatización de informes de avance de obra",
      sector: "engineering",
      pains: ["reporting", "admin"],
      why: "El informe semanal o mensual de avance de obra consolida datos de calidad, seguridad, productividad, partidas críticas y desviaciones de cronograma. Su preparación toma entre 8 y 16 horas del jefe de terreno. Tiempo que no está en obra resolviendo lo que importa.",
      how: "Pipeline que ingiere datos del software de gestión (Procore, Buildertrend, planillas de obra), del avance fotográfico, del sistema de calidad y del control de costos. Genera el informe completo en formato del cliente, con narrativa automática y comparativos contra programa.",
      timeline: "8-12 semanas",
      roiShare: 0.3,
      risks: "Informes preparados a las apuradas tienen errores que minan la confianza del mandante. El jefe de obra que pasa el viernes en oficina no está en obra resolviendo problemas."
    },
    "eng-cross-validation": {
      id: "eng-cross-validation",
      title: "Validación cruzada de cambios entre disciplinas",
      sector: "engineering",
      pains: ["coordination", "quality"],
      why: "Un cambio en planos de arquitectura debe reflejarse coordinadamente en estructuras, instalaciones eléctricas, sanitarias, climatización y especificaciones. Los olvidos en propagación generan interferencias que se descubren en obra con costo de cambio elevadísimo.",
      how: "IA que compara nuevas revisiones contra anteriores, identifica cambios y verifica que cada disciplina haya emitido su revisión correspondiente. Alerta cuando una disciplina no actualizó su entregable. Mantiene matriz de coherencia siempre al día.",
      timeline: "10-14 semanas",
      roiShare: 0.5,
      risks: "Una interferencia descubierta en obra puede paralizar un frente por semanas mientras se resuelve. El costo del cambio en obra es 10-50 veces el costo del cambio en oficina técnica."
    },
    "eng-doc-management": {
      id: "eng-doc-management",
      title: "Gestión documental con búsqueda natural",
      sector: "engineering",
      pains: ["knowledge", "onboarding"],
      why: "Los proyectos generan miles de documentos: ITOs, RDIs, no conformidades, actas de coordinación, oficios. Recuperar el historial de un tema específico para responder un reclamo del mandante puede tomar 1-2 días de un ingeniero buscando en correos y carpetas.",
      how: "Plataforma que ingiere todos los documentos del proyecto con clasificación automática por tipo, disciplina, partida y fecha. Búsqueda como 'todos los RDIs sobre la fundación del eje 5 en el último mes' devuelve los documentos relevantes con resumen ejecutivo.",
      timeline: "6-10 semanas",
      roiShare: 0.2,
      risks: "Sin gestión documental ágil, las controversias contractuales se ganan o pierden por velocidad de respuesta. La empresa con archivo desordenado siempre va a perder."
    },

    // ─── CONSULTORÍA PROFESIONAL (5 opportunities) ───────────────────────
    "cons-proposals": {
      id: "cons-proposals",
      title: "Generación automatizada de propuestas comerciales",
      sector: "consulting",
      pains: ["sales", "repetitive"],
      why: "Una propuesta comercial bien hecha toma entre 6 y 20 horas. Una consultora que cierra 1 de cada 4 propuestas dedica entre 24 y 80 horas por cierre solo en redacción. El tiempo del partner armando propuestas es tiempo que no factura ni cierra negocio nuevo.",
      how: "Sistema que combina las propuestas históricas exitosas, la base de casos del cliente, la metodología propietaria de la consultora y los datos específicos del prospecto (RFP, sector, tamaño). Genera el borrador completo en minutos. El partner refina los puntos diferenciadores.",
      timeline: "8-12 semanas",
      roiShare: 0.5,
      risks: "Una consultora que tarda 2 semanas en responder una RFP pierde frente a una que responde en 5 días con la misma calidad. La velocidad es ventaja competitiva real."
    },
    "cons-rfp-triage": {
      id: "cons-rfp-triage",
      title: "Triaje de RFPs y oportunidades comerciales",
      sector: "consulting",
      pains: ["sales", "responsiveness"],
      why: "Una consultora establecida recibe entre 50 y 200 RFPs y referidos por mes. Calificar cuál vale la pena perseguir consume tiempo del partner senior. Sin filtro robusto, se persiguen oportunidades con baja probabilidad de cierre y se descartan oportunidades que sí calzan.",
      how: "IA que evalúa cada RFP contra el perfil ideal de cliente (sector, tamaño, presupuesto, complejidad técnica), la capacidad disponible del equipo y el track record histórico de cierre en casos similares. Asigna probabilidad de cierre y recomienda 'go / no go' con justificación.",
      timeline: "4-6 semanas",
      roiShare: 0.2,
      risks: "Tiempo invertido en oportunidades de baja probabilidad es tiempo no invertido en oportunidades de alta probabilidad. La consultora opera reactivamente en lugar de seleccionar deliberadamente sus clientes."
    },
    "cons-project-reports": {
      id: "cons-project-reports",
      title: "Reportería automatizada de proyectos y rentabilidad",
      sector: "consulting",
      pains: ["reporting", "billing"],
      why: "El partner necesita visibilidad semanal de cada engagement: horas consumidas vs presupuestadas, hitos cumplidos, riesgos identificados, rentabilidad acumulada. Hoy esa visibilidad llega en reuniones de status que toman 2-4 horas semanales del consultor senior.",
      how: "Dashboard automático que ingiere datos del sistema de timesheets, del CRM (estado de hitos, tareas), del control financiero (margen real vs estimado) y de feedback del cliente. Genera reporte semanal por engagement listo para revisión del partner en 10 minutos.",
      timeline: "6-10 semanas",
      roiShare: 0.5,
      risks: "Un partner sin visibilidad real opera por anécdota. Los engagements en problema se descubren cuando ya escalaron. Los proyectos rentables se confunden con los que solo facturan mucho."
    },
    "cons-knowledge-base": {
      id: "cons-knowledge-base",
      title: "Base de conocimientos sobre proyectos previos",
      sector: "consulting",
      pains: ["knowledge", "onboarding"],
      why: "El conocimiento ganado en cada engagement (frameworks aplicados, hallazgos clave, lecciones aprendidas) suele quedarse en la cabeza del consultor que lo ejecutó. Cuando viene un caso similar, la consultora 'reinventa' o pide ayuda al consultor original interrumpiéndolo.",
      how: "IA que indexa entregables, presentaciones, notas internas y memos de cierre de cada engagement pasado. Permite consultas como 'casos donde aplicamos rediseño de procesos en empresas industriales medianas con sindicato fuerte'. Devuelve los 3-5 casos relevantes con resumen y consultor responsable.",
      timeline: "8-10 semanas",
      roiShare: 0.2,
      risks: "El conocimiento institucional vive en el cerebro de personas que pueden renunciar. Cada salida significativa reinicia parcialmente la curva de aprendizaje de la consultora."
    },
    "cons-timesheet": {
      id: "cons-timesheet",
      title: "Captura pasiva de timesheets y facturación",
      sector: "consulting",
      pains: ["billing", "admin"],
      why: "Los consultores subreportan o reportan tarde las horas trabajadas. La consultora típica recupera entre 75% y 85% de las horas reales. Esa pérdida, en una empresa de su tamaño, suele ser USD 80.000 a USD 200.000 anuales en facturación no realizada.",
      how: "Agente que captura automáticamente la actividad del consultor (correos por proyecto, archivos abiertos, calendario, llamadas grabadas) y genera el timesheet pre-llenado con asignación por engagement. El consultor revisa y aprueba en 5 minutos al final de la semana.",
      timeline: "6-8 semanas",
      roiShare: 0.3,
      risks: "Las horas no facturadas son ingreso perdido permanente. La cultura del subregistro es difícil de revertir manualmente y se vuelve estructural."
    },

    // ─── LOGÍSTICA / DISTRIBUCIÓN (5 opportunities) ──────────────────────
    "log-routing": {
      id: "log-routing",
      title: "Optimización automatizada de rutas y carga",
      sector: "logistics",
      pains: ["routing", "costs"],
      why: "La planificación manual de rutas para una flota mediana consume entre 4 y 8 horas diarias del despachador. Las rutas resultantes suelen tener entre 15% y 30% de ineficiencia respecto al óptimo, lo cual se traduce en kilómetros, combustible y horas hombre desperdiciados.",
      how: "Sistema que considera ventanas horarias de cada cliente, capacidad de cada vehículo, restricciones de zonas, tráfico en tiempo real y prioridades comerciales. Genera plan diario optimizado y ajusta dinámicamente cuando hay incidencias. Se integra con el TMS o WMS existente.",
      timeline: "10-14 semanas",
      roiShare: 0.5,
      risks: "Cada kilómetro innecesario es costo directo. La ineficiencia compuesta de rutas subóptimas se acumula a USD decenas o cientos de miles anuales en una flota mediana."
    },
    "log-incident-triage": {
      id: "log-incident-triage",
      title: "Triaje IA de incidencias de despacho",
      sector: "logistics",
      pains: ["incidents", "responsiveness"],
      why: "Las incidencias (vehículos descompuestos, clientes no presentes, productos dañados, reclamos) llegan por WhatsApp, llamadas y correos. El despachador queda saturado en pico de operación. Los reclamos de clientes premium se mezclan con incidencias rutinarias.",
      how: "IA que clasifica cada incidencia entrante por tipo, urgencia, cliente afectado y acción requerida. Asigna automáticamente al equipo adecuado, dispara comunicación al cliente y escala al despachador solo lo crítico. Mantiene log auditable de cada incidencia y tiempo de resolución.",
      timeline: "4-6 semanas",
      roiShare: 0.2,
      risks: "La saturación del despachador en pico hace que clientes premium no reciban atención diferenciada. La pérdida de un cliente clave por mala gestión de incidencia recurrente cuesta más que el sistema."
    },
    "log-demand-forecast": {
      id: "log-demand-forecast",
      title: "Predicción de demanda y rebalanceo de inventario",
      sector: "logistics",
      pains: ["inventory", "stockout"],
      why: "La asignación de inventario entre bodegas o puntos de venta se basa en históricos simples y experiencia. Los quiebres de stock en un punto coexisten con sobrestock en otro. El capital amarrado en inventario mal distribuido es costo financiero permanente.",
      how: "IA que predice demanda por SKU, punto y semana basándose en históricos, estacionalidad, eventos comerciales, clima y data del sector. Recomienda movimientos de inventario entre puntos con anticipación. Se integra con el ERP existente (SAP, Oracle, Bsale).",
      timeline: "10-16 semanas",
      roiShare: 0.5,
      risks: "Los quiebres en cliente final destruyen confianza. El sobrestock amarra capital. La gestión 'a ojo' es imposible de optimizar a escala."
    },
    "log-reconciliation": {
      id: "log-reconciliation",
      title: "Conciliación automática de guías de despacho con OC",
      sector: "logistics",
      pains: ["admin", "billing"],
      why: "El cierre de mes requiere conciliar miles de guías de despacho contra órdenes de compra, facturas emitidas y pagos recibidos. Equipos administrativos enteros dedican entre 5 y 15 días al mes a esta tarea. Las diferencias detectadas tarde son cobros perdidos o pagos duplicados.",
      how: "Sistema que cruza automáticamente guías, OC, facturas y pagos. Identifica diferencias en cantidad, precio, plazo y emite reporte de excepciones. Las conciliaciones limpias se cierran sin intervención humana. Solo las excepciones requieren revisión.",
      timeline: "6-10 semanas",
      roiShare: 0.3,
      risks: "El cierre lento del mes posterga decisiones financieras. Las diferencias no detectadas a tiempo prescriben o son imposibles de cobrar."
    },
    "log-customer-comms": {
      id: "log-customer-comms",
      title: "Comunicación automática con clientes (tracking, ETA, retrasos)",
      sector: "logistics",
      pains: ["communication", "responsiveness"],
      why: "Cada despacho genera entre 3 y 8 puntos de comunicación con el cliente: confirmación, salida, en ruta, llegada, retraso, entrega exitosa. Hacer esto manualmente en una operación de su tamaño es imposible. El resultado son clientes ansiosos que llaman para preguntar.",
      how: "Sistema que envía actualizaciones automáticas vía WhatsApp, SMS y correo en cada hito del despacho. Cuando hay retraso, comunica proactivamente con nueva ETA. El cliente recibe la información antes de que necesite preguntar.",
      timeline: "4-6 semanas",
      roiShare: 0.2,
      risks: "Los clientes ansiosos saturan el call center. El cliente que percibe falta de visibilidad eventualmente cambia de proveedor. La comunicación proactiva diferencia un servicio premium de uno commodity."
    }
  };

  // ─── PAIN MAPPING ─────────────────────────────────────────────────────
  // Quiz pain answers → opportunity pain tags
  // pain1 (main pain) and pain2 (hours wasted) feed into matching weight

  const PAIN_QUIZ_TO_TAG = {
    "docs": ["docs", "compliance"],
    "emails": ["emails", "responsiveness"],
    "reports": ["reporting", "admin"],
    "approvals": ["approvals", "responsiveness"],
    "knowledge": ["knowledge", "onboarding"],
    "billing": ["billing", "admin"],
    "sales": ["sales", "responsiveness"],
    "incidents": ["incidents", "responsiveness"],
    "quoting": ["quoting", "sales"],
    "downtime": ["downtime", "maintenance"],
    "inventory": ["inventory", "procurement"],
    "routing": ["routing", "costs"],
    "coordination": ["coordination", "quality"],
    "communication": ["communication", "responsiveness"]
  };

  // ─── SIZE / HOURS PARSING ────────────────────────────────────────────
  // Quiz size answer → estimated team size for ROI calculation

  const SIZE_TO_TEAM = {
    "1-5": 3,
    "6-15": 10,
    "15-30": 22,
    "30-80": 50,
    "80+": 120
  };

  // Quiz pain2 (hours wasted) → estimated weekly hours per person
  const HOURS_TO_WEEKLY = {
    "0-5": 3,
    "5-15": 10,
    "15-30": 22,
    "30+": 35
  };

  // ─── MATCHING ENGINE ─────────────────────────────────────────────────

  /**
   * Calculate 3 unique opportunities for a given quiz answer set.
   *
   * Algorithm (deterministic):
   * 1. Get sector pool (5 candidates)
   * 2. Score each candidate by pain match (pain1 → +3, pain2 → +1)
   * 3. Sort by score descending; ties broken by stable order in pool definition
   * 4. Pick top 3
   * 5. Assign roiShare 0.5, 0.3, 0.2 by priority
   *
   * @param {Object} answers - Quiz answers: { sector, size, pain1, pain2, tools, previous, urgency }
   * @returns {Array<Object>} - Exactly 3 opportunity objects with full content
   */
  function calculateOpportunities(answers) {
    const sector = SECTORS.find(s => s.id === answers.sector);
    if (!sector) {
      throw new Error(`Unknown sector: ${answers.sector}`);
    }

    // Get pain tags from user answers
    const pain1Tags = PAIN_QUIZ_TO_TAG[answers.pain1] || [];
    const pain2Tags = PAIN_QUIZ_TO_TAG[answers.pain2] || [];

    // Score each opportunity in this sector's pool
    const scored = sector.pool.map((oppId, index) => {
      const opp = OPPORTUNITY_LIBRARY[oppId];
      if (!opp) return null;

      let score = 0;
      // Pain 1 match = +3 points (more weight to declared main pain)
      if (opp.pains.some(p => pain1Tags.includes(p))) score += 3;
      // Pain 2 match = +1 point
      if (opp.pains.some(p => pain2Tags.includes(p))) score += 1;
      // Stable tiebreaker: original pool order
      const tieBreaker = -index * 0.001;

      return { opp, score: score + tieBreaker, originalIndex: index };
    }).filter(x => x !== null);

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    // Top 3 with priority-based ROI share
    const roiShares = [0.5, 0.3, 0.2];
    const top3 = scored.slice(0, 3).map((entry, idx) => ({
      ...entry.opp,
      priority: idx + 1,
      roiShare: roiShares[idx]
    }));

    return top3;
  }

  /**
   * Calculate ROI estimates for a lead based on team size, hours wasted, and sector hourly rate.
   *
   * @param {Object} answers - Quiz answers
   * @returns {Object} - { monthly, annual, threeYear, hourlyRate, teamSize, weeklyHours }
   */
  function calculateROI(answers) {
    const sector = SECTORS.find(s => s.id === answers.sector);
    const hourlyRate = sector ? sector.hourlyRate : 25;
    const teamSize = SIZE_TO_TEAM[answers.size] || 10;
    const weeklyHours = HOURS_TO_WEEKLY[answers.pain2] || 10;

    // Conservative: assume automation recovers 60% of wasted hours
    const recoveryFactor = 0.6;
    const monthlyHours = teamSize * weeklyHours * 4.3 * recoveryFactor;
    const monthly = Math.round(monthlyHours * hourlyRate);
    const annual = monthly * 12;
    const threeYear = annual * 3;

    return {
      monthly,
      annual,
      threeYear,
      hourlyRate,
      teamSize,
      weeklyHours
    };
  }

  // ─── EXPORTS ─────────────────────────────────────────────────────────

  return {
    SECTORS,
    OPPORTUNITY_LIBRARY,
    PAIN_QUIZ_TO_TAG,
    SIZE_TO_TEAM,
    HOURS_TO_WEEKLY,
    calculateOpportunities,
    calculateROI
  };
});
