const { onSchedule } = require("firebase-functions/v2/scheduler");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const { Resend } = require("resend");

const resendApiKey = defineSecret("RESEND_API_KEY");

exports.sendQuizFollowup = onSchedule(
  { schedule: "0 14 * * *", timeZone: "America/Santiago", secrets: [resendApiKey] },
  async () => {
    const db = admin.firestore();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const eightDaysAgo = new Date();
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

    const snapshot = await db.collection("quiz_leads")
      .where("timestamp", "<=", sevenDaysAgo)
      .where("timestamp", ">=", eightDaysAgo)
      .where("followup_sent", "==", false)
      .get();

    if (snapshot.empty) {
      console.log("[sendQuizFollowup] no leads to follow up today");
      return;
    }

    const resend = new Resend(resendApiKey.value());

    const promises = snapshot.docs.map(async (doc) => {
      const data = doc.data();
      try {
        await resend.emails.send({
          from: "Edmundo Spohr <edmundo@growthbuddies.cl>",
          to: data.email,
          subject: "¿Alguna de esas hipótesis le hizo sentido?",
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
              <p>Hola${data.company ? ", " + data.company : ""},</p>
              <p>Hace una semana le enviamos el reporte con 3 hipótesis iniciales de automatización basadas en su perfil.</p>
              <p>Le escribo para preguntar algo concreto:</p>
              <p><strong>¿Alguna de esas 3 hipótesis le hizo sentido para su operación?</strong></p>
              <p>Si la respuesta es sí, el siguiente paso natural es validarla con números reales y una maqueta funcionando sobre su operación. Eso es exactamente lo que hace el <strong>Diagnóstico de Automatización Estratégica</strong>: cuestionario previo, sesión de trabajo de 2 a 3 horas sobre sus procesos reales, y entrega en 10 a 15 días de 3 oportunidades priorizadas con ROI estimado en pesos más una maqueta funcionando de la más rápida.</p>
              <p style="font-size: 14px; color: #525252;">Inversión: <strong>$490.000 + IVA en Chile · USD 500 resto de LATAM</strong>. El pago reserva su cupo (solo abrimos 2 cupos al mes). El 100% del valor es acreditable a cualquier proyecto contratado dentro de 90 días. Si no identificamos al menos 3 oportunidades con ROI positivo, devolvemos el 100%.</p>
              <p style="margin: 24px 0;">
                <a href="https://wa.me/56965863160?text=Hola%20Edmundo%21%20Quiero%20reservar%20mi%20cupo%20del%20Diagn%C3%B3stico%20de%20Automatizaci%C3%B3n%20Estrat%C3%A9gica.%20%C2%BFC%C3%B3mo%20coordinamos%20el%20pago%3F" style="background: #0097B2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 999px; font-weight: bold; margin-right: 8px;">Reservar mi cupo →</a>
                <a href="https://calendly.com/espohr/conversemos" style="color: #0097B2; font-size: 14px; text-decoration: none;">o primero, agendar conversación</a>
              </p>
              <p style="font-size: 13px; color: #666;">WhatsApp: <a href="https://wa.me/56965863160">+56 9 6586 3160</a></p>
              <p>Si la respuesta es no, no hay problema. Este es el último correo automático que recibirá de Growth Buddies sobre este tema.</p>
              <p>Si quiere darme feedback sobre por qué las hipótesis no le hicieron sentido, puede responder este correo directamente. Lo leo personalmente.</p>
              <p style="margin-top: 32px;">Edmundo Spohr<br/>Director<br/>Growth Buddies</p>
            </div>
          `
        });
        await doc.ref.update({
          followup_sent: true,
          followup_sent_at: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`[sendQuizFollowup] sent to ${data.email}`);
      } catch (err) {
        console.error(`[sendQuizFollowup] failed to send to ${data.email}:`, err);
      }
    });

    await Promise.all(promises);
  }
);
