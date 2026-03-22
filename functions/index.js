const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { setGlobalOptions } = require("firebase-functions/v2");
const { defineSecret } = require("firebase-functions/params");
const { Resend } = require("resend");

setGlobalOptions({ region: "us-central1" });

const resendApiKey = defineSecret("RESEND_API_KEY");

exports.notifyNewLead = onDocumentCreated(
  { document: "leads/{leadId}", secrets: [resendApiKey] },
  async (event) => {
    const lead = event.data.data();
    const leadId = event.params.leadId;

    const resend = new Resend(resendApiKey.value());

    // Build WhatsApp pre-filled link
    const waName = encodeURIComponent(lead.name || "");
    const waInterest = encodeURIComponent(lead.interest || "");
    const waMsg = `Hola ${lead.name || ""}! Vi tu consulta sobre ${lead.interest || "automatización IA"}. ¿Tienes 15 minutos esta semana para conversar?`;
    const whatsappLink = `https://wa.me/56965863160?text=${encodeURIComponent(waMsg)}`;

    // UTM attribution summary
    const attribution = [
      lead.utm_source && `Fuente: ${lead.utm_source}`,
      lead.utm_medium && `Medio: ${lead.utm_medium}`,
      lead.utm_campaign && `Campaña: ${lead.utm_campaign}`,
      lead.utm_term && `Keyword: ${lead.utm_term}`,
      lead.gclid && `Google Click ID: ${lead.gclid}`,
    ]
      .filter(Boolean)
      .join("<br>");

    const isPartial = lead.partial === true;
    const subject = isPartial
      ? `⚡ Lead parcial — ${lead.email} (interés: ${lead.interest || "?"})`
      : `🔥 Nuevo lead — ${lead.name || lead.email} (${lead.interest || "?"})`;

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: sans-serif; background: #0a0a0f; color: #e2e8f0; padding: 32px; margin: 0;">
  <div style="max-width: 560px; margin: 0 auto; background: #12121f; border-radius: 16px; border: 1px solid #1e2035; overflow: hidden;">

    <div style="background: ${isPartial ? "#1a1a2e" : "#00f6ff"}; padding: 24px 32px;">
      <p style="margin: 0; font-size: 13px; color: ${isPartial ? "#64748b" : "#050510"}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
        ${isPartial ? "Lead parcial (abandonó en paso 2)" : "🔥 Lead completo"}
      </p>
      <h1 style="margin: 8px 0 0; font-size: 22px; color: ${isPartial ? "#94a3b8" : "#050510"}; font-weight: 700;">
        ${lead.name || lead.email}
      </h1>
    </div>

    <div style="padding: 32px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #1e2035; color: #64748b; font-size: 13px; width: 130px;">Email</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #1e2035; font-weight: 600;">
            <a href="mailto:${lead.email}" style="color: #00f6ff; text-decoration: none;">${lead.email || "—"}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #1e2035; color: #64748b; font-size: 13px;">Interés</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #1e2035; font-weight: 600;">${lead.interest || "—"}</td>
        </tr>
        ${lead.message ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #1e2035; color: #64748b; font-size: 13px; vertical-align: top;">Mensaje</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #1e2035;">${lead.message}</td>
        </tr>` : ""}
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #1e2035; color: #64748b; font-size: 13px;">Dispositivo</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #1e2035;">${lead.device || "—"}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #1e2035; color: #64748b; font-size: 13px;">Página</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #1e2035; font-size: 12px; word-break: break-all;">${lead.landing_page || "—"}</td>
        </tr>
        ${attribution ? `
        <tr>
          <td style="padding: 10px 0; color: #64748b; font-size: 13px; vertical-align: top;">Google Ads</td>
          <td style="padding: 10px 0; font-size: 12px;">${attribution}</td>
        </tr>` : ""}
      </table>

      ${!isPartial ? `
      <a href="${whatsappLink}" target="_blank"
         style="display: block; margin-top: 28px; background: #25d366; color: #fff; font-weight: 700; font-size: 16px; text-align: center; padding: 16px 24px; border-radius: 12px; text-decoration: none;">
        💬 Responder por WhatsApp
      </a>` : `
      <p style="margin-top: 24px; padding: 16px; background: #1e2035; border-radius: 8px; font-size: 13px; color: #94a3b8;">
        Este lead completó solo el Paso 1. Considera un email de seguimiento a <strong>${lead.email}</strong>.
      </p>`}

      <p style="margin-top: 20px; font-size: 11px; color: #334155; text-align: center;">
        Lead ID: ${leadId} · Growth Buddies CRM
      </p>
    </div>
  </div>
</body>
</html>`;

    await resend.emails.send({
      from: "Growth Buddies CRM <crm@growthbuddies.cl>",
      to: ["edmundo@spohr.cl"],
      subject,
      html,
    });

    console.log(`Notification sent for lead ${leadId} (partial: ${isPartial})`);
  }
);
