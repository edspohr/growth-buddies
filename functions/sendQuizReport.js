const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const PDFDocument = require("pdfkit");
const { Resend } = require("resend");

const resendApiKey = defineSecret("RESEND_API_KEY");

const opportunityMap = {
  "Validación documental con IA": "Análisis automático de contratos contra el playbook del estudio. Reduce errores pre-firma y acelera revisiones.",
  "Triaje legal automático": "IA que filtra consultas entrantes y entrega solo leads calificados a los socios.",
  "Base de conocimientos pasiva": "Sistema que clasifica y archiva documentos automáticamente, con búsqueda por lenguaje natural.",
  "Automatización de correos de pólizas": "IA que clasifica, prioriza y responde correos de pólizas con tiempos de respuesta menores a 15 minutos.",
  "Reportería automatizada": "Automatización de la generación de reportes operativos que hoy se hacen manualmente.",
  "Registro pasivo de tiempos y gastos": "Captura automática de horas trabajadas y rendición de gastos por imagen.",
  "Integración entre sistemas": "Conexión de sus herramientas existentes (CRM, ERP, email) para eliminar trabajo duplicado.",
  "Rescate de implementación previa": "Diagnóstico de por qué su intento previo no funcionó y plan correctivo."
};

function generatePDF({ company, opportunities }) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50, size: "LETTER" });
    const chunks = [];
    doc.on("data", chunk => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    doc.fontSize(20).fillColor("#0097B2").text("Reporte de Oportunidades de Automatización", { align: "center" });
    doc.moveDown();
    if (company) {
      doc.fontSize(14).fillColor("#333").text(`Para: ${company}`, { align: "center" });
      doc.moveDown();
    }
    doc.fontSize(11).fillColor("#666").text("Basado en sus respuestas al diagnóstico rápido de Growth Buddies, identificamos las siguientes 3 oportunidades probables de automatización para su operación.");
    doc.moveDown(2);

    opportunities.forEach((opp, idx) => {
      doc.fontSize(14).fillColor("#0097B2").text(`${idx + 1}. ${opp.title}`);
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor("#333").text(opp.description);
      doc.moveDown(1.5);
    });

    doc.moveDown();
    doc.fontSize(13).fillColor("#000").text("Importante:");
    doc.fontSize(11).fillColor("#333").text("Este reporte es una estimación basada en patrones que hemos visto en empresas similares. La identificación precisa de oportunidades, su priorización por ROI, y la arquitectura técnica de cada una requieren un Diagnóstico de Automatización Estratégica (USD $3.000, 2 semanas).");
    doc.moveDown();
    doc.fontSize(11).fillColor("#0097B2").text("Agendar conversación con el director: https://calendly.com/espohr/conversemos", { link: "https://calendly.com/espohr/conversemos" });
    doc.end();
  });
}

function generateEmailHTML({ company, opportunities }) {
  return `
    <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #0097B2;">Su reporte está listo${company ? ", " + company : ""}</h2>
      <p>Adjunto encontrará el reporte personalizado con las 3 oportunidades de automatización que identificamos en base a sus respuestas.</p>
      <p><strong>Las 3 oportunidades:</strong></p>
      <ol>${opportunities.map(o => `<li>${o.title}</li>`).join("")}</ol>
      <p>Si quiere conversar sobre cómo abordar alguna de estas en su operación específica, puede agendar 30 minutos directamente con Edmundo Spohr (Director).</p>
      <p style="margin: 30px 0;"><a href="https://calendly.com/espohr/conversemos" style="background: #0097B2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 999px; font-weight: bold;">Agendar conversación →</a></p>
      <p style="font-size: 12px; color: #999;">Si prefiere WhatsApp: <a href="https://wa.me/56965863160">+56 9 6586 3160</a></p>
      <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 11px; color: #999;">Recibió este correo porque completó el diagnóstico rápido en growthbuddies.cl. En 7 días le enviaremos UN solo correo de seguimiento opcional. No tiene nurturing agresivo. Puede responder este correo si quiere conversar directamente.</p>
    </div>
  `;
}

exports.sendQuizReport = onDocumentCreated(
  { document: "quiz_leads/{leadId}", secrets: [resendApiKey] },
  async (event) => {
    const data = event.data.data();
    const { email, company, opportunities, answers } = data;

    if (!email || !opportunities || !Array.isArray(opportunities)) {
      console.error("[sendQuizReport] missing required fields", { email, opportunities });
      return;
    }

    const opportunitiesFull = opportunities.map(title => ({
      title,
      description: opportunityMap[title] || ""
    }));

    const pdfBuffer = await generatePDF({ company, opportunities: opportunitiesFull });
    const resend = new Resend(resendApiKey.value());

    // Email to lead
    await resend.emails.send({
      from: "Edmundo Spohr <edmundo@growthbuddies.cl>",
      to: email,
      subject: "Su reporte de oportunidades de automatización",
      html: generateEmailHTML({ company, opportunities: opportunitiesFull }),
      attachments: [{ filename: "reporte-oportunidades-growth-buddies.pdf", content: pdfBuffer }]
    });

    // CRM alert to Edmundo
    await resend.emails.send({
      from: "Growth Buddies CRM <crm@growthbuddies.cl>",
      to: "edmundo@spohr.cl",
      subject: `Nuevo lead del Quiz: ${company || email}`,
      html: `
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Empresa:</strong> ${company || "No proporcionada"}</p>
        <p><strong>Sector:</strong> ${answers?.sector || "—"}</p>
        <p><strong>Tamaño:</strong> ${answers?.size || "—"}</p>
        <p><strong>Urgencia:</strong> ${answers?.urgency || "—"}</p>
        <p><strong>Dolor principal:</strong> ${answers?.pain1 || "—"}</p>
        <p><strong>Horas/semana perdidas:</strong> ${answers?.pain2 || "—"}</p>
        <p><strong>3 oportunidades identificadas:</strong></p>
        <ul>${opportunities.map(o => `<li>${o}</li>`).join("")}</ul>
      `
    });

    console.log(`[sendQuizReport] sent for ${email}`);
  }
);
