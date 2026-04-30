const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const { Resend } = require("resend");
const engine = require("./lib/opportunityEngine");
const { generateReportPDF } = require("./lib/pdfGenerator");

const resendApiKey = defineSecret("RESEND_API_KEY");

function generateEmailHTML({ company, opportunities, roi }) {
  const annualSavings = "USD $" + roi.annual.toLocaleString("en-US");

  return `
    <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #0097B2; margin-bottom: 8px;">Su reporte está listo${company ? ", " + company : ""}</h2>
      <p style="font-size: 15px; line-height: 1.6; color: #525252;">Adjunto encontrará el reporte personalizado de 6 páginas con las 3 oportunidades de automatización que identificamos en su operación, junto con el análisis de ROI proyectado.</p>

      <div style="background: #f8fafc; border-left: 3px solid #0097B2; padding: 16px 20px; margin: 24px 0; border-radius: 4px;">
        <p style="margin: 0; font-size: 13px; color: #737373; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Ahorro estimado anual</p>
        <p style="margin: 4px 0 0; font-size: 26px; font-weight: 700; color: #0097B2;">${annualSavings}</p>
      </div>

      <p style="font-size: 14px; color: #525252;"><strong style="color: #1a1a1a;">Las 3 oportunidades identificadas:</strong></p>
      <ol style="padding-left: 20px; color: #525252;">
        ${opportunities.map(o => `<li style="margin-bottom: 6px;">${o.title}</li>`).join("")}
      </ol>

      <p style="font-size: 14px; color: #525252; line-height: 1.6;">El reporte adjunto explica cada oportunidad en profundidad: por qué le aplica a su operación, cómo funcionaría técnicamente, tiempo estimado de implementación y riesgos de no hacerlo.</p>

      <p style="margin: 32px 0 16px; font-size: 14px; color: #1a1a1a;">Si quiere conversar sobre cómo abordar alguna de estas en su operación específica, puede agendar 30 minutos directamente con Edmundo Spohr (Director).</p>

      <p style="margin: 16px 0 8px;">
        <a href="https://calendly.com/espohr/conversemos" style="background: #0097B2; color: white; padding: 14px 28px; text-decoration: none; border-radius: 999px; font-weight: bold; display: inline-block;">Agendar conversación →</a>
      </p>

      <p style="font-size: 13px; color: #737373; margin-top: 16px;">Si prefiere WhatsApp: <a href="https://wa.me/56965863160" style="color: #0097B2;">+56 9 6586 3160</a></p>

      <hr style="margin: 40px 0; border: none; border-top: 1px solid #e2e8f0;" />

      <p style="font-size: 11px; color: #999; line-height: 1.5;">Recibió este correo porque completó el diagnóstico rápido en growthbuddies.cl. En 7 días le enviaremos UN solo correo de seguimiento opcional. No tiene nurturing agresivo. Puede responder este correo si quiere conversar directamente.</p>
    </div>
  `;
}

function generateCRMHTML({ email, company, answers, opportunities, roi }) {
  return `
    <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #0097B2;">Nuevo lead del Quiz: ${company || email}</h2>

      <h3 style="color: #1a1a1a; margin-top: 24px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Datos del lead</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 6px 0; color: #737373; width: 140px;">Email</td><td><a href="mailto:${email}" style="color: #0097B2;">${email}</a></td></tr>
        <tr><td style="padding: 6px 0; color: #737373;">Empresa</td><td><strong>${company || "No proporcionada"}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #737373;">Sector</td><td>${answers?.sector || "—"}</td></tr>
        <tr><td style="padding: 6px 0; color: #737373;">Tamaño</td><td>${answers?.size || "—"} (${roi.teamSize} personas estimadas)</td></tr>
        <tr><td style="padding: 6px 0; color: #737373;">Urgencia</td><td><strong>${answers?.urgency || "—"}</strong></td></tr>
        <tr><td style="padding: 6px 0; color: #737373;">Dolor principal</td><td>${answers?.pain1 || "—"}</td></tr>
        <tr><td style="padding: 6px 0; color: #737373;">Horas perdidas/sem</td><td>${answers?.pain2 || "—"} (${roi.weeklyHours}h estimadas)</td></tr>
        <tr><td style="padding: 6px 0; color: #737373;">Herramientas actuales</td><td>${answers?.tools || "—"}</td></tr>
        <tr><td style="padding: 6px 0; color: #737373;">Intentos previos</td><td>${answers?.previous || "—"}</td></tr>
      </table>

      <h3 style="color: #1a1a1a; margin-top: 24px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">ROI estimado</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; background: #f8fafc; border-radius: 8px; padding: 12px;">
        <tr><td style="padding: 6px 12px; color: #737373; width: 140px;">Mensual</td><td><strong>USD $${roi.monthly.toLocaleString("en-US")}</strong></td></tr>
        <tr><td style="padding: 6px 12px; color: #737373;">Anual</td><td style="color: #0097B2;"><strong>USD $${roi.annual.toLocaleString("en-US")}</strong></td></tr>
        <tr><td style="padding: 6px 12px; color: #737373;">3 años</td><td><strong>USD $${roi.threeYear.toLocaleString("en-US")}</strong></td></tr>
      </table>

      <h3 style="color: #1a1a1a; margin-top: 24px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">3 oportunidades identificadas</h3>
      <ol style="padding-left: 20px; color: #525252; font-size: 14px;">
        ${opportunities.map((o, i) => `
          <li style="margin-bottom: 12px;">
            <strong style="color: #1a1a1a;">${o.title}</strong><br>
            <span style="color: #737373; font-size: 12px;">Tiempo: ${o.timeline} · Ahorro mensual asignado: USD $${Math.round(roi.monthly * o.roiShare).toLocaleString("en-US")}</span>
          </li>
        `).join("")}
      </ol>

      <p style="margin-top: 24px; font-size: 13px; color: #737373;">PDF adjunto enviado al lead. Buena suerte con la conversación 🎯</p>
    </div>
  `;
}

exports.sendQuizReport = onDocumentCreated(
  { document: "quiz_leads/{leadId}", secrets: [resendApiKey] },
  async (event) => {
    const data = event.data.data();
    const { email, company, answers } = data;

    if (!email || !answers || !answers.sector) {
      console.error("[sendQuizReport] missing required fields", { email, hasAnswers: !!answers });
      return;
    }

    // Compute opportunities and ROI server-side using the engine.
    // We deliberately ignore data.opportunities (sent by frontend) and recalculate here.
    // Backend is the source of truth.
    let opportunities, roi;
    try {
      opportunities = engine.calculateOpportunities(answers);
      roi = engine.calculateROI(answers);
    } catch (err) {
      console.error("[sendQuizReport] engine failed", err.message, { answers });
      return;
    }

    const leadInfo = { company, email };

    // Generate professional 6-page PDF
    let pdfBuffer;
    try {
      pdfBuffer = await generateReportPDF(answers, opportunities, roi, leadInfo);
    } catch (err) {
      console.error("[sendQuizReport] PDF generation failed", err);
      return;
    }

    const resend = new Resend(resendApiKey.value());

    // Email to lead with PDF attached
    try {
      await resend.emails.send({
        from: "Edmundo Spohr <edmundo@growthbuddies.cl>",
        to: email,
        subject: "Su reporte de oportunidades de automatización",
        html: generateEmailHTML({ company, opportunities, roi }),
        attachments: [{
          filename: "reporte-oportunidades-growth-buddies.pdf",
          content: pdfBuffer
        }]
      });
    } catch (err) {
      console.error("[sendQuizReport] failed to send email to lead", err);
    }

    // CRM alert to Edmundo with full lead context
    try {
      await resend.emails.send({
        from: "Growth Buddies CRM <crm@growthbuddies.cl>",
        to: "edmundo@spohr.cl",
        subject: `Nuevo lead del Quiz: ${company || email}`,
        html: generateCRMHTML({ email, company, answers, opportunities, roi })
      });
    } catch (err) {
      console.error("[sendQuizReport] failed to send CRM email", err);
    }

    console.log(`[sendQuizReport] sent for ${email} | sector=${answers.sector} | ROI annual=USD $${roi.annual.toLocaleString("en-US")}`);
  }
);
