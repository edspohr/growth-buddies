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
          subject: "¿Algo del reporte le hizo sentido?",
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
              <p>Hola${data.company ? ", " + data.company : ""},</p>
              <p>Hace una semana le enviamos el reporte de oportunidades de automatización basado en sus respuestas.</p>
              <p>Le escribo para preguntar algo concreto:</p>
              <p><strong>¿Alguna de las 3 oportunidades del reporte le hizo sentido para su operación?</strong></p>
              <p>Si la respuesta es sí, podemos conversar 30 minutos sobre cómo abordarla en su caso específico. Sin pitch de ventas, sin presentación. Solo una conversación honesta sobre si tiene sentido avanzar a un diagnóstico.</p>
              <p style="margin: 24px 0;"><a href="https://calendly.com/espohr/conversemos" style="background: #0097B2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 999px; font-weight: bold;">Agendar conversación →</a></p>
              <p style="font-size: 13px; color: #666;">WhatsApp: <a href="https://wa.me/56965863160">+56 9 6586 3160</a></p>
              <p>Si la respuesta es no, no hay problema. Este es el último correo automático que recibirá de Growth Buddies sobre este tema.</p>
              <p>Si quiere darme feedback sobre por qué el reporte no le hizo sentido, puede responder este correo directamente. Lo leo personalmente.</p>
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
