/**
 * Professional Quiz Report PDF Generator
 *
 * Generates a 6-page PDF report sent to leads after they complete the diagnostic quiz.
 *
 * Pages:
 *   1. Cover (logo + title + lead info)
 *   2. Executive Summary (contextual diagnosis + ROI + 3 opportunity teasers)
 *   3-5. One page per opportunity (why, how, key data, risks)
 *   6. Next Steps (Diagnóstico Estratégico offer + guarantee + disqualification)
 */

const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

// ─── DESIGN TOKENS ─────────────────────────────────────────────────────────

const COLORS = {
  accent: "#0097B2",
  accentDark: "#006d80",
  text: "#1a1a1a",
  textSecondary: "#525252",
  textMuted: "#737373",
  border: "#e2e8f0",
  background: "#f8fafc",
  backgroundCard: "#ffffff",
  white: "#ffffff",
  warning: "#dc2626"
};

const FONTS = {
  serifRegular: path.join(__dirname, "fonts", "SourceSerif4-Regular.ttf"),
  serifBold: path.join(__dirname, "fonts", "SourceSerif4-Bold.ttf"),
  sansRegular: path.join(__dirname, "fonts", "Inter-Regular.ttf"),
  sansMedium: path.join(__dirname, "fonts", "Inter-Medium.ttf"),
  sansBold: path.join(__dirname, "fonts", "Inter-Bold.ttf")
};

const LOGO_PATH = path.join(__dirname, "..", "..", "img", "groddiesLogo.png");

const MARGIN = 50;
const PAGE_WIDTH = 612;  // LETTER width in points (8.5 inch)
const PAGE_HEIGHT = 792; // LETTER height in points (11 inch)
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;

// ─── HELPER FUNCTIONS ──────────────────────────────────────────────────────

function formatCurrency(num) {
  return "USD $" + num.toLocaleString("en-US");
}

function formatDate() {
  const date = new Date();
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
                  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
}

function getSectorLabel(sectorId) {
  const map = {
    "legal": "Estudios jurídicos",
    "industrial": "Industrial / Manufactura",
    "engineering": "Ingeniería / Construcción",
    "consulting": "Consultoría profesional",
    "logistics": "Logística / Distribución"
  };
  return map[sectorId] || sectorId;
}

function getSizeLabel(sizeId) {
  const map = {
    "1-5": "1 a 5 personas",
    "6-15": "6 a 15 personas",
    "15-30": "15 a 30 personas",
    "30-80": "30 a 80 personas",
    "80+": "Más de 80 personas"
  };
  return map[sizeId] || sizeId;
}

function getUrgencyLabel(urgencyId) {
  const map = {
    "now": "Necesitamos resolverlo este trimestre",
    "quarter": "En los próximos 3-6 meses",
    "year": "Este año, sin presión específica"
  };
  return map[urgencyId] || urgencyId;
}

function getPainLabel(painId) {
  const map = {
    "docs": "Manejo de documentos y contratos",
    "emails": "Procesamiento de correos y consultas",
    "reports": "Generación de reportes operacionales",
    "approvals": "Flujos de aprobación interna",
    "knowledge": "Búsqueda de información histórica",
    "billing": "Facturación y cobranzas",
    "sales": "Generación de propuestas comerciales",
    "incidents": "Gestión de incidencias",
    "quoting": "Cotizaciones y presupuestos",
    "downtime": "Mantención y paradas de equipos",
    "inventory": "Gestión de inventario",
    "routing": "Planificación de rutas",
    "coordination": "Coordinación entre equipos",
    "communication": "Comunicación con clientes"
  };
  return map[painId] || painId;
}

function generateContextualDiagnosis(answers, roi) {
  const sector = getSectorLabel(answers.sector);
  const size = getSizeLabel(answers.size);
  const pain = getPainLabel(answers.pain1);
  const annualSavings = formatCurrency(roi.annual);

  return `Una empresa del sector ${sector.toLowerCase()} con un equipo de ${size.toLowerCase()} suele perder entre ${roi.weeklyHours - 3} y ${roi.weeklyHours + 5} horas semanales por persona en tareas como "${pain.toLowerCase()}". En su caso específico, considerando un costo hora promedio del sector de ${formatCurrency(roi.hourlyRate)}, esto representa una pérdida estimada de ${annualSavings} anuales.\n\nLas 3 oportunidades que identificamos a continuación apuntan a recuperar la mayor parte de esas horas perdidas. La priorización está basada en el dolor declarado, el tamaño del equipo y los patrones que observamos en empresas similares de Latinoamérica.`;
}

// ─── DRAWING PRIMITIVES ────────────────────────────────────────────────────

function drawCard(doc, x, y, width, height, fillColor = COLORS.backgroundCard) {
  doc.save();
  doc.lineWidth(0.5);
  doc.strokeColor(COLORS.border);
  doc.fillColor(fillColor);
  doc.roundedRect(x, y, width, height, 8).fillAndStroke();
  doc.restore();
}

function drawHorizontalLine(doc, y, color = COLORS.border) {
  doc.save();
  doc.strokeColor(color);
  doc.lineWidth(0.5);
  doc.moveTo(MARGIN, y).lineTo(PAGE_WIDTH - MARGIN, y).stroke();
  doc.restore();
}

function drawAccentBar(doc, x, y, width = 40, height = 3) {
  doc.save();
  doc.fillColor(COLORS.accent);
  doc.rect(x, y, width, height).fill();
  doc.restore();
}

function drawPageFooter(doc, pageNum, totalPages) {
  // Must sit inside the bottom margin (PAGE_HEIGHT - MARGIN = 742) or pdfkit will
  // auto-page-break each text() call and silently emit spurious blank pages.
  const y = PAGE_HEIGHT - MARGIN - 15;
  doc.save();
  doc.font(FONTS.sansRegular).fontSize(8).fillColor(COLORS.textMuted);
  doc.text(`Growth Buddies · growthbuddies.cl`, MARGIN, y, {
    width: CONTENT_WIDTH / 2,
    align: "left",
    lineBreak: false
  });
  doc.text(`${pageNum} / ${totalPages}`, MARGIN + CONTENT_WIDTH / 2, y, {
    width: CONTENT_WIDTH / 2,
    align: "right",
    lineBreak: false
  });
  doc.restore();
}

// ─── PAGE BUILDERS ─────────────────────────────────────────────────────────

function drawCoverPage(doc, answers, leadInfo) {
  // Logo at top center
  if (fs.existsSync(LOGO_PATH)) {
    const logoSize = 80;
    doc.image(LOGO_PATH, (PAGE_WIDTH - logoSize) / 2, 80, { width: logoSize });
  }

  // Subtle accent bar
  drawAccentBar(doc, (PAGE_WIDTH - 60) / 2, 190, 60, 3);

  // Title block
  doc.font(FONTS.serifBold).fontSize(32).fillColor(COLORS.text);
  doc.text("Reporte de", MARGIN, 230, { width: CONTENT_WIDTH, align: "center" });
  doc.text("Oportunidades", MARGIN, 270, { width: CONTENT_WIDTH, align: "center" });
  doc.font(FONTS.serifRegular).fillColor(COLORS.accent);
  doc.text("de Automatización", MARGIN, 310, { width: CONTENT_WIDTH, align: "center" });

  // Subtitle
  doc.font(FONTS.sansRegular).fontSize(11).fillColor(COLORS.textSecondary);
  doc.text("Diagnóstico personalizado para", MARGIN, 380, { width: CONTENT_WIDTH, align: "center" });

  // Company name (large)
  doc.font(FONTS.serifBold).fontSize(22).fillColor(COLORS.text);
  doc.text(leadInfo.company || "su empresa", MARGIN, 400, { width: CONTENT_WIDTH, align: "center" });

  // Metadata block at bottom
  const metaY = 540;
  drawHorizontalLine(doc, metaY);

  doc.font(FONTS.sansMedium).fontSize(9).fillColor(COLORS.textMuted);
  doc.text("SECTOR", MARGIN, metaY + 20, { width: CONTENT_WIDTH / 3, align: "center" });
  doc.text("EQUIPO", MARGIN + CONTENT_WIDTH / 3, metaY + 20, { width: CONTENT_WIDTH / 3, align: "center" });
  doc.text("FECHA", MARGIN + 2 * CONTENT_WIDTH / 3, metaY + 20, { width: CONTENT_WIDTH / 3, align: "center" });

  doc.font(FONTS.sansMedium).fontSize(11).fillColor(COLORS.text);
  doc.text(getSectorLabel(answers.sector), MARGIN, metaY + 38, { width: CONTENT_WIDTH / 3, align: "center" });
  doc.text(getSizeLabel(answers.size), MARGIN + CONTENT_WIDTH / 3, metaY + 38, { width: CONTENT_WIDTH / 3, align: "center" });
  doc.text(formatDate(), MARGIN + 2 * CONTENT_WIDTH / 3, metaY + 38, { width: CONTENT_WIDTH / 3, align: "center" });

  drawHorizontalLine(doc, metaY + 70);

  // Bottom accent
  doc.font(FONTS.sansRegular).fontSize(9).fillColor(COLORS.textMuted);
  doc.text("Growth Buddies · Estrategia y delivery de IA aplicada", MARGIN, PAGE_HEIGHT - 80, {
    width: CONTENT_WIDTH, align: "center"
  });
  doc.fillColor(COLORS.accent).text("growthbuddies.cl", MARGIN, PAGE_HEIGHT - 65, {
    width: CONTENT_WIDTH, align: "center"
  });
}

function drawExecutiveSummaryPage(doc, answers, opportunities, roi, leadInfo) {
  // Page header
  doc.font(FONTS.sansMedium).fontSize(9).fillColor(COLORS.textMuted);
  doc.text("RESUMEN EJECUTIVO", MARGIN, MARGIN, { characterSpacing: 1.5 });
  drawAccentBar(doc, MARGIN, MARGIN + 18, 30, 2);

  // Section title
  doc.font(FONTS.serifBold).fontSize(24).fillColor(COLORS.text);
  doc.text("Diagnóstico contextual", MARGIN, MARGIN + 35);

  // Contextual diagnosis (auto-generated)
  const diagnosis = generateContextualDiagnosis(answers, roi);
  doc.font(FONTS.sansRegular).fontSize(11).fillColor(COLORS.textSecondary).lineGap(3);
  doc.text(diagnosis, MARGIN, MARGIN + 80, {
    width: CONTENT_WIDTH,
    align: "justify"
  });

  // ROI highlight box
  const roiY = doc.y + 30;
  drawCard(doc, MARGIN, roiY, CONTENT_WIDTH, 90, COLORS.accent);

  doc.font(FONTS.sansMedium).fontSize(10).fillColor(COLORS.white);
  doc.text("AHORRO ESTIMADO ANUAL", MARGIN + 25, roiY + 18, { characterSpacing: 1 });

  doc.font(FONTS.serifBold).fontSize(32).fillColor(COLORS.white);
  doc.text(formatCurrency(roi.annual), MARGIN + 25, roiY + 35);

  doc.font(FONTS.sansRegular).fontSize(9).fillColor(COLORS.white);
  doc.text(`Proyectado a 3 años: ${formatCurrency(roi.threeYear)}`, MARGIN + 25, roiY + 73);

  // 3 opportunities teaser list
  const teaserY = roiY + 120;
  doc.font(FONTS.sansMedium).fontSize(9).fillColor(COLORS.textMuted);
  doc.text("OPORTUNIDADES IDENTIFICADAS", MARGIN, teaserY, { characterSpacing: 1.5 });
  drawAccentBar(doc, MARGIN, teaserY + 18, 30, 2);

  let listY = teaserY + 40;
  opportunities.forEach((opp, idx) => {
    doc.font(FONTS.serifBold).fontSize(14).fillColor(COLORS.accent);
    doc.text(`${idx + 1}.`, MARGIN, listY, { width: 30 });
    doc.font(FONTS.serifBold).fontSize(13).fillColor(COLORS.text);
    doc.text(opp.title, MARGIN + 30, listY, { width: CONTENT_WIDTH - 30 });

    doc.font(FONTS.sansRegular).fontSize(9).fillColor(COLORS.textMuted);
    doc.text(`Tiempo estimado: ${opp.timeline}`, MARGIN + 30, listY + 22);

    listY += 50;
  });

  drawPageFooter(doc, 2, 6);
}

function drawOpportunityPage(doc, opp, idx, roi, leadInfo) {
  const allocatedMonthly = Math.round(roi.monthly * opp.roiShare);
  const allocatedAnnual = Math.round(roi.annual * opp.roiShare);

  // Page header eyebrow
  doc.font(FONTS.sansMedium).fontSize(9).fillColor(COLORS.textMuted);
  doc.text(`OPORTUNIDAD ${idx + 1} DE 3`, MARGIN, MARGIN, { characterSpacing: 1.5 });
  drawAccentBar(doc, MARGIN, MARGIN + 18, 30, 2);

  // Number + title
  doc.font(FONTS.serifBold).fontSize(72).fillColor(COLORS.accent);
  doc.text(`0${idx + 1}`, MARGIN, MARGIN + 30);

  doc.font(FONTS.serifBold).fontSize(20).fillColor(COLORS.text);
  doc.text(opp.title, MARGIN + 100, MARGIN + 60, { width: CONTENT_WIDTH - 100 });

  let contentY = MARGIN + 145;

  // ¿Por qué le aplica?
  doc.font(FONTS.sansBold).fontSize(11).fillColor(COLORS.accent);
  doc.text(`¿Por qué esto le aplica a ${leadInfo.company || "su empresa"}?`, MARGIN, contentY);
  contentY += 22;

  doc.font(FONTS.sansRegular).fontSize(10.5).fillColor(COLORS.textSecondary).lineGap(3);
  doc.text(opp.why, MARGIN, contentY, { width: CONTENT_WIDTH, align: "justify" });
  contentY = doc.y + 22;

  // Cómo funcionaría
  doc.font(FONTS.sansBold).fontSize(11).fillColor(COLORS.accent);
  doc.text("Cómo funcionaría técnicamente", MARGIN, contentY);
  contentY += 22;

  doc.font(FONTS.sansRegular).fontSize(10.5).fillColor(COLORS.textSecondary).lineGap(3);
  doc.text(opp.how, MARGIN, contentY, { width: CONTENT_WIDTH, align: "justify" });
  contentY = doc.y + 25;

  // Key data card
  const cardHeight = 70;
  drawCard(doc, MARGIN, contentY, CONTENT_WIDTH, cardHeight, COLORS.background);

  const colWidth = CONTENT_WIDTH / 3;
  const cardCenterY = contentY + cardHeight / 2;

  // Column 1: Timeline
  doc.font(FONTS.sansMedium).fontSize(8).fillColor(COLORS.textMuted);
  doc.text("TIEMPO ESTIMADO", MARGIN + 15, contentY + 14, { width: colWidth - 20, characterSpacing: 1 });
  doc.font(FONTS.serifBold).fontSize(15).fillColor(COLORS.text);
  doc.text(opp.timeline, MARGIN + 15, contentY + 30, { width: colWidth - 20 });

  // Column 2: ROI mensual
  doc.font(FONTS.sansMedium).fontSize(8).fillColor(COLORS.textMuted);
  doc.text("AHORRO MENSUAL ESTIMADO", MARGIN + colWidth + 15, contentY + 14, { width: colWidth - 20, characterSpacing: 1 });
  doc.font(FONTS.serifBold).fontSize(15).fillColor(COLORS.accent);
  doc.text(formatCurrency(allocatedMonthly), MARGIN + colWidth + 15, contentY + 30, { width: colWidth - 20 });

  // Column 3: Prioridad
  doc.font(FONTS.sansMedium).fontSize(8).fillColor(COLORS.textMuted);
  doc.text("PRIORIDAD", MARGIN + 2 * colWidth + 15, contentY + 14, { width: colWidth - 20, characterSpacing: 1 });
  doc.font(FONTS.serifBold).fontSize(15).fillColor(COLORS.text);
  const priorityLabels = ["Alta", "Media", "Baja"];
  doc.text(priorityLabels[idx], MARGIN + 2 * colWidth + 15, contentY + 30, { width: colWidth - 20 });

  contentY += cardHeight + 25;

  // Riesgos
  doc.font(FONTS.sansBold).fontSize(11).fillColor(COLORS.warning);
  doc.text("Riesgos de no hacerlo", MARGIN, contentY);
  contentY += 22;

  doc.font(FONTS.sansRegular).fontSize(10.5).fillColor(COLORS.textSecondary).lineGap(3);
  doc.text(opp.risks, MARGIN, contentY, { width: CONTENT_WIDTH, align: "justify" });

  drawPageFooter(doc, idx + 3, 6);
}

function drawNextStepsPage(doc, leadInfo) {
  // Page header
  doc.font(FONTS.sansMedium).fontSize(9).fillColor(COLORS.textMuted);
  doc.text("PRÓXIMOS PASOS", MARGIN, MARGIN, { characterSpacing: 1.5 });
  drawAccentBar(doc, MARGIN, MARGIN + 18, 30, 2);

  // Title
  doc.font(FONTS.serifBold).fontSize(26).fillColor(COLORS.text);
  doc.text("Diagnóstico de", MARGIN, MARGIN + 35);
  doc.fillColor(COLORS.accent).text("Automatización Estratégica", MARGIN, MARGIN + 65);

  // Intro
  doc.font(FONTS.sansRegular).fontSize(11).fillColor(COLORS.textSecondary).lineGap(3);
  doc.text(
    "Las 3 oportunidades identificadas en este reporte son una primera aproximación. El siguiente paso lógico es validarlas con datos específicos de su operación, priorizarlas por ROI real y diseñar la arquitectura técnica de cada una.",
    MARGIN, MARGIN + 110,
    { width: CONTENT_WIDTH, align: "justify" }
  );

  // Includes section
  let y = doc.y + 25;
  doc.font(FONTS.sansBold).fontSize(11).fillColor(COLORS.accent);
  doc.text("Qué incluye", MARGIN, y);
  y += 22;

  const includes = [
    "Entrevistas con 5-7 stakeholders clave de su operación",
    "Mapeo de procesos críticos y puntos de fricción",
    "Validación de cada oportunidad con datos reales de su empresa",
    "Cálculo de ROI específico por oportunidad (no estimaciones)",
    "Arquitectura técnica preliminar de las 3 oportunidades priorizadas"
  ];

  doc.font(FONTS.sansRegular).fontSize(10.5).fillColor(COLORS.textSecondary);
  includes.forEach(item => {
    doc.fillColor(COLORS.accent).text("•", MARGIN, y);
    doc.fillColor(COLORS.textSecondary).text(item, MARGIN + 15, y, { width: CONTENT_WIDTH - 15 });
    y += 18;
  });

  // Pricing card
  y += 15;
  const priceCardHeight = 95;
  drawCard(doc, MARGIN, y, CONTENT_WIDTH, priceCardHeight, COLORS.text);

  doc.font(FONTS.sansMedium).fontSize(9).fillColor(COLORS.accent);
  doc.text("INVERSIÓN", MARGIN + 25, y + 18, { characterSpacing: 1.5 });

  doc.font(FONTS.serifBold).fontSize(28).fillColor(COLORS.white);
  doc.text("USD $3.000", MARGIN + 25, y + 33);

  doc.font(FONTS.sansRegular).fontSize(10).fillColor("#a3a3a3");
  doc.text("más impuestos · 2 semanas de duración", MARGIN + 25, y + 70);

  y += priceCardHeight + 25;

  // Guarantee
  doc.font(FONTS.sansBold).fontSize(11).fillColor(COLORS.accent);
  doc.text("Garantía de devolución total", MARGIN, y);
  y += 22;

  doc.font(FONTS.sansRegular).fontSize(10.5).fillColor(COLORS.textSecondary).lineGap(3);
  doc.text(
    "Si en las dos semanas del diagnóstico no identificamos al menos 3 oportunidades de automatización con ROI positivo proyectado a 6 meses, le devolvemos el 100% de la inversión. Sin preguntas, sin condiciones.",
    MARGIN, y,
    { width: CONTENT_WIDTH, align: "justify" }
  );

  y = doc.y + 25;

  // Disqualification
  drawHorizontalLine(doc, y);
  y += 20;

  doc.font(FONTS.sansBold).fontSize(11).fillColor(COLORS.text);
  doc.text("Este servicio NO es para usted si...", MARGIN, y);
  y += 22;

  const disqualifiers = [
    "Su empresa tiene menos de 15 personas operativas",
    "No hay un dolor concreto identificado en sus procesos actuales",
    "No tiene presupuesto asignado para automatización en los próximos 6 meses",
    "El equipo directivo no está comprometido con cambios operativos"
  ];

  doc.font(FONTS.sansRegular).fontSize(10).fillColor(COLORS.textMuted);
  disqualifiers.forEach(item => {
    doc.text("• " + item, MARGIN, y, { width: CONTENT_WIDTH });
    y += 16;
  });

  // CTA at bottom
  y = PAGE_HEIGHT - 130;
  drawHorizontalLine(doc, y);
  y += 20;

  doc.font(FONTS.serifBold).fontSize(14).fillColor(COLORS.text);
  doc.text("Agendar conversación con el director", MARGIN, y, { width: CONTENT_WIDTH, align: "center" });
  y += 22;

  doc.font(FONTS.sansRegular).fontSize(10).fillColor(COLORS.accent);
  doc.text("calendly.com/espohr/conversemos", MARGIN, y, {
    width: CONTENT_WIDTH,
    align: "center",
    link: "https://calendly.com/espohr/conversemos"
  });
  y += 16;

  doc.fillColor(COLORS.textMuted).text("o WhatsApp directo: +56 9 6586 3160", MARGIN, y, {
    width: CONTENT_WIDTH,
    align: "center",
    link: "https://wa.me/56965863160"
  });

  drawPageFooter(doc, 6, 6);
}

// ─── MAIN EXPORT ───────────────────────────────────────────────────────────

function generateReportPDF(answers, opportunities, roi, leadInfo) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "LETTER",
        margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
        info: {
          Title: `Reporte de Oportunidades - ${leadInfo.company || ""}`,
          Author: "Growth Buddies",
          Subject: "Diagnóstico de Automatización",
          Keywords: "automatización, IA, diagnóstico"
        }
      });

      const chunks = [];
      doc.on("data", chunk => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Register fonts
      doc.registerFont("serifRegular", FONTS.serifRegular);
      doc.registerFont("serifBold", FONTS.serifBold);
      doc.registerFont("sansRegular", FONTS.sansRegular);
      doc.registerFont("sansMedium", FONTS.sansMedium);
      doc.registerFont("sansBold", FONTS.sansBold);

      // Build pages
      drawCoverPage(doc, answers, leadInfo);

      doc.addPage();
      drawExecutiveSummaryPage(doc, answers, opportunities, roi, leadInfo);

      opportunities.forEach((opp, idx) => {
        doc.addPage();
        drawOpportunityPage(doc, opp, idx, roi, leadInfo);
      });

      doc.addPage();
      drawNextStepsPage(doc, leadInfo);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = {
  generateReportPDF
};
