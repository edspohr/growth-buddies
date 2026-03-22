const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { setGlobalOptions } = require("firebase-functions/v2");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const { Resend } = require("resend");

admin.initializeApp();
setGlobalOptions({ region: "us-central1" });

const resendApiKey = defineSecret("RESEND_API_KEY");
const db = admin.firestore();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resend() {
  return new Resend(resendApiKey.value());
}

function daysSince(timestamp) {
  if (!timestamp) return 999;
  const ms = Date.now() - timestamp.toDate().getTime();
  return ms / (1000 * 60 * 60 * 24);
}

function interestContent(interest = "") {
  const i = interest.toLowerCase();
  if (i.includes("broker")) {
    return {
      tag: "PropTech / Corretaje",
      caseStudyTitle: "Cómo una corredora con 15 agentes eliminó el 80% del papeleo con BrokerIA",
      caseStudyBody: "Antes de BrokerIA, sus agentes pasaban 3 horas diarias actualizando fichas, respondiendo consultas repetitivas y preparando contratos a mano. Hoy ese trabajo lo hace la IA en minutos. El equipo cerró un 40% más de operaciones en el primer trimestre.",
      caseStudyLink: "https://growthbuddies.cl/soluciones/brokeria/",
      roiLine: "Agentes inmobiliarios recuperan en promedio 12 horas semanales con BrokerIA.",
    };
  }
  if (i.includes("legal") || i.includes("email")) {
    return {
      tag: "Legal Tech",
      caseStudyTitle: "Cómo un estudio jurídico procesó 10.000+ documentos sin contratar más personal",
      caseStudyBody: "MLM Abogados tardaba semanas en revisar contratos de forma manual. Con nuestro agente de triaje legal, el 90% de los documentos se clasifican y resumen en segundos, liberando a los abogados para el trabajo de alto valor.",
      caseStudyLink: "https://growthbuddies.cl/blog/automatizacion-contratos-legales-2026/",
      roiLine: "Estudios jurídicos reducen el tiempo de revisión de contratos en un 70%.",
    };
  }
  if (i.includes("gasto") || i.includes("rendici")) {
    return {
      tag: "Finanzas / Gastos",
      caseStudyTitle: "Cómo una empresa de 30 personas cerró sus rendiciones de gastos en 1 día en vez de 2 semanas",
      caseStudyBody: "Con nuestro agente de rendición de gastos, los colaboradores fotografían sus boletas y el sistema categoriza, valida y genera el informe automáticamente. El equipo de finanzas pasó de perseguir recibos a revisar un dashboard.",
      caseStudyLink: "https://growthbuddies.cl/soluciones/rendicion-gastos-ia/",
      roiLine: "Las empresas recuperan 2 semanas al mes en procesos de rendición.",
    };
  }
  return {
    tag: "Automatización IA",
    caseStudyTitle: "Cómo empresas chilenas recuperan el 30% de su tiempo operativo con IA",
    caseStudyBody: "Empresas en servicios profesionales, retail y finanzas están usando automatización inteligente para eliminar trabajo manual repetitivo. El resultado promedio: 15-30 horas semanales recuperadas por equipo, con ROI visible en menos de 90 días.",
    caseStudyLink: "https://growthbuddies.cl/blog/casos-exito-transformacion-chile/",
    roiLine: "El ROI promedio de nuestros proyectos se alcanza antes de los 90 días.",
  };
}

function emailWrapper(headerBg, headerColor, badge, title, body) {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:32px 16px;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#e2e8f0;">
<div style="max-width:560px;margin:0 auto;background:#12121f;border-radius:16px;border:1px solid #1e2035;overflow:hidden;">
  <div style="background:${headerBg};padding:24px 32px;">
    <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${headerColor}80;">${badge}</p>
    <h1 style="margin:0;font-size:22px;font-weight:700;line-height:1.3;color:${headerColor};">${title}</h1>
  </div>
  <div style="padding:32px;">${body}
    <p style="margin-top:36px;font-size:11px;color:#334155;text-align:center;border-top:1px solid #1e2035;padding-top:16px;">
      Growth Buddies · <a href="https://growthbuddies.cl" style="color:#00f6ff;text-decoration:none;">growthbuddies.cl</a><br>
      Si no quieres recibir más correos, <a href="mailto:hola@growthbuddies.cl?subject=Unsubscribe" style="color:#334155;">haz clic aquí</a>.
    </p>
  </div>
</div>
</body></html>`;
}

function ctaButton(href, label, bg = "#00f6ff", color = "#050510") {
  return `<a href="${href}" style="display:block;margin-top:24px;background:${bg};color:${color};font-weight:700;font-size:15px;text-align:center;padding:16px 24px;border-radius:12px;text-decoration:none;">${label}</a>`;
}

// ─── 1. Notify Edmundo on every new lead ────────────────────────────────────

exports.notifyNewLead = onDocumentCreated(
  { document: "leads/{leadId}", secrets: [resendApiKey] },
  async (event) => {
    const lead = event.data.data();
    const leadId = event.params.leadId;

    const waMsg = `Hola ${lead.name || ""}! Vi tu consulta sobre ${lead.interest || "automatización IA"}. ¿Tienes 15 minutos esta semana para conversar?`;
    const whatsappLink = `https://wa.me/56965863160?text=${encodeURIComponent(waMsg)}`;

    const attribution = [
      lead.utm_source && `Fuente: ${lead.utm_source}`,
      lead.utm_medium && `Medio: ${lead.utm_medium}`,
      lead.utm_campaign && `Campaña: ${lead.utm_campaign}`,
      lead.utm_term && `Keyword: ${lead.utm_term}`,
      lead.gclid && `Google Click ID: ${lead.gclid}`,
    ].filter(Boolean).join("<br>");

    const isPartial = lead.partial === true;
    const subject = isPartial
      ? `⚡ Lead parcial — ${lead.email} (${lead.interest || "?"})`
      : `🔥 Nuevo lead — ${lead.name || lead.email} (${lead.interest || "?"})`;

    const rows = [
      ["Email", `<a href="mailto:${lead.email}" style="color:#00f6ff;text-decoration:none;">${lead.email || "—"}</a>`],
      ["Interés", `<strong>${lead.interest || "—"}</strong>`],
      lead.message && ["Mensaje", lead.message],
      ["Dispositivo", lead.device || "—"],
      ["Página", `<span style="font-size:12px;word-break:break-all;">${lead.landing_page || "—"}</span>`],
      attribution && ["Google Ads", `<span style="font-size:12px;">${attribution}</span>`],
    ].filter(Boolean);

    const tableHtml = rows.map(([label, val]) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #1e2035;color:#64748b;font-size:13px;width:130px;">${label}</td>
        <td style="padding:10px 0;border-bottom:1px solid #1e2035;">${val}</td>
      </tr>`).join("");

    const body = `
      <table style="width:100%;border-collapse:collapse;">${tableHtml}</table>
      ${!isPartial
        ? ctaButton(whatsappLink, "💬 Responder por WhatsApp", "#25d366", "#fff")
        : `<p style="margin-top:24px;padding:16px;background:#1e2035;border-radius:8px;font-size:13px;color:#94a3b8;">Lead parcial — solo completó el Paso 1. Interés declarado: <strong>${lead.interest || "?"}</strong>. Email guardado en Firestore.</p>`
      }
      <p style="margin-top:16px;font-size:11px;color:#334155;text-align:center;">Lead ID: ${leadId}</p>`;

    await resend().emails.send({
      from: "Growth Buddies CRM <crm@growthbuddies.cl>",
      to: ["edmundo@spohr.cl"],
      subject,
      html: emailWrapper(isPartial ? "#1a1a2e" : "#00f6ff", isPartial ? "#94a3b8" : "#050510", isPartial ? "Lead parcial" : "Lead completo", lead.name || lead.email, body),
    });

    console.log(`[notifyNewLead] sent for ${leadId} partial=${isPartial}`);
  }
);

// ─── 2. Day 0 — Confirmation email to lead when Step 2 completes ────────────

exports.sendDay0Confirmation = onDocumentUpdated(
  { document: "leads/{leadId}", secrets: [resendApiKey] },
  async (event) => {
    const before = event.data.before.data();
    const after = event.data.after.data();
    const leadId = event.params.leadId;

    // Only fire when partial flips from true → false
    if (before.partial !== true || after.partial !== false) return;
    if (after.followup_day0_sent) return;

    const { caseStudyTitle, caseStudyBody, caseStudyLink } = interestContent(after.interest);

    const body = `
      <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Hola <strong>${after.name}</strong>, recibimos tu consulta sobre <strong>${after.interest}</strong>. 👋</p>
      <p style="font-size:15px;line-height:1.7;color:#94a3b8;margin:0 0 24px;">Uno de nuestros especialistas te contactará <strong style="color:#e2e8f0;">en menos de 2 horas</strong>. Mientras tanto, si prefieres agendar directo:</p>
      ${ctaButton("https://calendly.com/espohr/conversemos", "📅 Agendar 30 minutos ahora")}
      <div style="margin-top:32px;padding:24px;background:#0d0d1a;border-radius:12px;border-left:3px solid #00f6ff;">
        <p style="margin:0 0 8px;font-size:12px;color:#00f6ff;font-weight:700;text-transform:uppercase;letter-spacing:.06em;">Caso de éxito relevante</p>
        <p style="margin:0 0 12px;font-size:15px;font-weight:700;color:#e2e8f0;">${caseStudyTitle}</p>
        <p style="margin:0 0 16px;font-size:14px;color:#94a3b8;line-height:1.6;">${caseStudyBody}</p>
        <a href="${caseStudyLink}" style="font-size:13px;color:#00f6ff;text-decoration:none;font-weight:600;">Leer más →</a>
      </div>`;

    await resend().emails.send({
      from: "Edmundo — Growth Buddies <edmundo@growthbuddies.cl>",
      to: [after.email],
      subject: `${after.name}, recibimos tu consulta ✓`,
      html: emailWrapper("#050510", "#00f6ff", "Confirmación", `Hola ${after.name} 👋`, body),
    });

    await db.collection("leads").doc(leadId).update({ followup_day0_sent: true });
    console.log(`[day0] sent to ${after.email}`);
  }
);

// ─── 3. Scheduled follow-up sequence: Days 1, 3, 7 ─────────────────────────
// Runs every day at 9am Santiago time (UTC-4 in summer, UTC-3 in winter)

exports.sendFollowupSequence = onSchedule(
  { schedule: "0 13 * * *", timeZone: "America/Santiago", secrets: [resendApiKey] },
  async () => {
    const snapshot = await db.collection("leads")
      .where("partial", "==", false)
      .get();

    for (const doc of snapshot.docs) {
      const lead = doc.data();
      const id = doc.id;
      if (!lead.email) continue;

      const days = daysSince(lead.timestamp);
      const content = interestContent(lead.interest);

      // Day 1 — Case study
      if (days >= 1 && days < 2 && !lead.followup_day1_sent) {
        const body = `
          <p style="font-size:15px;line-height:1.7;color:#94a3b8;margin:0 0 24px;">Hola <strong style="color:#e2e8f0;">${lead.name || ""}${lead.name ? "," : ""}</strong> mientras coordinamos nuestra llamada, quería compartirte algo que puede ser relevante para ti.</p>
          <div style="padding:24px;background:#0d0d1a;border-radius:12px;border-left:3px solid #00f6ff;margin-bottom:24px;">
            <p style="margin:0 0 8px;font-size:12px;color:#00f6ff;font-weight:700;text-transform:uppercase;letter-spacing:.06em;">${content.tag}</p>
            <p style="margin:0 0 12px;font-size:16px;font-weight:700;color:#e2e8f0;">${content.caseStudyTitle}</p>
            <p style="margin:0;font-size:14px;color:#94a3b8;line-height:1.6;">${content.caseStudyBody}</p>
          </div>
          <p style="font-size:14px;color:#94a3b8;margin:0 0 8px;">${content.roiLine}</p>
          <p style="font-size:14px;color:#94a3b8;margin:0 0 24px;">¿Tiene sentido conversar esta semana?</p>
          ${ctaButton("https://calendly.com/espohr/conversemos", "📅 Sí, agendemos")}`;

        await resend().emails.send({
          from: "Edmundo — Growth Buddies <edmundo@growthbuddies.cl>",
          replyTo: "edmundo@spohr.cl",
          to: [lead.email],
          subject: content.caseStudyTitle,
          html: emailWrapper("#050510", "#00f6ff", "Caso de éxito", content.caseStudyTitle, body),
        });

        await db.collection("leads").doc(id).update({ followup_day1_sent: true });
        console.log(`[day1] sent to ${lead.email}`);
      }

      // Day 3 — ROI framing
      else if (days >= 3 && days < 4 && !lead.followup_day3_sent) {
        const body = `
          <p style="font-size:15px;line-height:1.7;color:#94a3b8;margin:0 0 16px;">Hola <strong style="color:#e2e8f0;">${lead.name || ""}${lead.name ? "," : ""}</strong> quería hacerte una pregunta directa:</p>
          <p style="font-size:20px;font-weight:700;color:#e2e8f0;margin:0 0 16px;line-height:1.4;">¿Cuántas horas a la semana pierde tu equipo en trabajo manual repetitivo?</p>
          <p style="font-size:14px;color:#94a3b8;margin:0 0 8px;line-height:1.6;">En empresas similares a la tuya, la respuesta suele ser entre 15 y 40 horas semanales. Eso equivale a <strong style="color:#e2e8f0;">1-2 personas de sueldo completo</strong> haciendo trabajo que una IA puede hacer en segundos.</p>
          <p style="font-size:14px;color:#94a3b8;margin:0 0 24px;line-height:1.6;">${content.roiLine}</p>
          <div style="background:#0d0d1a;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
            <p style="margin:0 0 4px;font-size:13px;color:#64748b;">Calcula tu ROI estimado en 2 minutos</p>
            <p style="margin:0 0 16px;font-size:22px;font-weight:700;color:#00f6ff;">Calculadora de ROI gratuita →</p>
            ${ctaButton("https://growthbuddies.cl/#roi", "Calcular mi ROI ahora")}
          </div>
          <p style="font-size:13px;color:#64748b;margin:0;">O si prefieres que hagamos el cálculo juntos en una llamada de 30 minutos:</p>
          ${ctaButton("https://calendly.com/espohr/conversemos", "📅 Agendar llamada de ROI", "#1e2035", "#e2e8f0")}`;

        await resend().emails.send({
          from: "Edmundo — Growth Buddies <edmundo@growthbuddies.cl>",
          replyTo: "edmundo@spohr.cl",
          to: [lead.email],
          subject: `${lead.name ? lead.name + ", ¿" : "¿"}cuánto cuesta el trabajo manual en tu empresa?`,
          html: emailWrapper("#050510", "#00f6ff", "ROI Analysis", "El costo oculto del trabajo manual", body),
        });

        await db.collection("leads").doc(id).update({ followup_day3_sent: true });
        console.log(`[day3] sent to ${lead.email}`);
      }

      // Day 7 — Last chance + scarcity
      else if (days >= 7 && days < 8 && !lead.followup_day7_sent) {
        const body = `
          <p style="font-size:15px;line-height:1.7;color:#94a3b8;margin:0 0 16px;">Hola <strong style="color:#e2e8f0;">${lead.name || ""}${lead.name ? "," : ""}</strong> este es mi último correo, lo prometo. 😊</p>
          <p style="font-size:15px;line-height:1.7;color:#94a3b8;margin:0 0 24px;">Sé que el tiempo es escaso. Por eso quiero ser directo:</p>
          <div style="background:#0d0d1a;border-radius:12px;padding:24px;margin-bottom:24px;border:1px solid #1e2035;">
            <p style="margin:0 0 8px;font-size:13px;color:#00f6ff;font-weight:700;text-transform:uppercase;">Solo tomamos 3 nuevos proyectos por mes</p>
            <p style="margin:0;font-size:15px;color:#94a3b8;line-height:1.6;">Para mantener la calidad de implementación y garantizar la adopción, limitamos los proyectos que iniciamos cada mes. <strong style="color:#e2e8f0;">Tu auditoría gratuita sigue reservada hasta el viernes.</strong></p>
          </div>
          <p style="font-size:14px;color:#94a3b8;margin:0 0 24px;">30 minutos. Sin compromiso. Sin tarjeta de crédito. Solo una conversación honesta sobre si podemos ayudarte.</p>
          ${ctaButton("https://calendly.com/espohr/conversemos", "📅 Agendar antes del viernes")}
          <p style="margin-top:16px;text-align:center;font-size:14px;color:#64748b;">¿Prefieres WhatsApp? <a href="https://wa.me/56965863160?text=${encodeURIComponent(`Hola Edmundo, soy ${lead.name || "un interesado"}, quiero coordinar la auditoría.`)}" style="color:#25d366;text-decoration:none;">Escríbeme directo →</a></p>`;

        await resend().emails.send({
          from: "Edmundo — Growth Buddies <edmundo@growthbuddies.cl>",
          replyTo: "edmundo@spohr.cl",
          to: [lead.email],
          subject: `${lead.name ? lead.name + ", última" : "Última"} oportunidad — tu auditoría gratuita`,
          html: emailWrapper("#050510", "#00f6ff", "Último aviso", "Tu auditoría gratuita sigue disponible", body),
        });

        await db.collection("leads").doc(id).update({ followup_day7_sent: true });
        console.log(`[day7] sent to ${lead.email}`);
      }
    }
  }
);
