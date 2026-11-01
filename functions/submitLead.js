const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");
const crypto = require("crypto");

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;

const PRODUCTS = {
  "expense-buddy": {
    label: "Expense Buddy",
    qualifiers: {
      personas: ["1 a 10", "11 a 50", "51 a 200", "Más de 200"],
      sin_senal: ["Sí", "No", "A veces"],
      herramienta: ["Ninguna", "Planilla", "Otra plataforma"],
    },
  },
  "docflow-buddy": {
    label: "DocFlow Buddy",
    qualifiers: {
      casos_mes: ["Menos de 20", "20 a 100", "101 a 500", "Más de 500"],
      recepcion_documentos: 500,
    },
  },
  "agent-buddy": {
    label: "Agent Buddy",
    qualifiers: {
      sitio_web: 300,
      canales: 300,
      interes: ["Web", "A medida"],
    },
  },
  "proyecto-a-medida": {
    label: "Proyecto a medida",
    qualifiers: { problema: 2000 },
  },
};

const TEXT_FIELDS = { nombre: 120, empresa: 160, cargo: 120 };
const OPTIONAL_FIELDS = {
  telefono: 40,
  landing_page: 2048,
  referrer: 2048,
  utm_source: 256,
  utm_medium: 256,
  utm_campaign: 256,
  utm_term: 256,
  utm_content: 256,
  gclid: 256,
};

function cleanText(value, max) {
  return typeof value === "string" && value.trim() && value.trim().length <= max ? value.trim() : null;
}

function validateLead(body = {}) {
  const product = PRODUCTS[body.producto];
  if (!product) return { error: "producto" };

  const email = cleanText(body.correo, 254);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "correo" };

  const lead = { email, product: body.producto, interest: product.label };
  for (const [field, max] of Object.entries(TEXT_FIELDS)) {
    lead[field] = cleanText(body[field], max);
    if (!lead[field]) return { error: field };
  }

  lead.details = {};
  for (const [field, rule] of Object.entries(product.qualifiers)) {
    const value = Array.isArray(rule)
      ? rule.includes(body[field]) && body[field]
      : cleanText(body[field], rule);
    if (!value) return { error: field };
    lead.details[field] = value;
  }

  for (const [field, max] of Object.entries(OPTIONAL_FIELDS)) {
    const value = cleanText(body[field], max);
    if (value) lead[field] = value;
  }
  return { lead };
}

async function isRateLimited(db, ip) {
  const key = crypto.createHash("sha256").update(ip).digest("hex");
  const ref = db.collection("lead_limits").doc(key);
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const now = Date.now();
    const current = snapshot.data();
    if (!current || now - current.window_start > RATE_WINDOW_MS) {
      transaction.set(ref, { window_start: now, count: 1 });
      return false;
    }
    if (current.count >= RATE_LIMIT) return true;
    transaction.update(ref, { count: current.count + 1 });
    return false;
  });
}

exports.validateLead = validateLead;
exports.PRODUCTS = PRODUCTS;

exports.submitLead = onRequest({ invoker: "public", maxInstances: 5 }, async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  const body = req.body || {};
  // Bots fill the hidden field; answer as if it worked and store nothing.
  if (body.fax) return res.json({ ok: true });

  const { lead, error } = validateLead(body);
  if (error) return res.status(400).json({ ok: false, error });

  const db = admin.firestore();
  const ip = req.get("fastly-client-ip") || (req.get("x-forwarded-for") || "").split(",")[0].trim() || req.ip || "unknown";
  if (await isRateLimited(db, ip)) return res.status(429).json({ ok: false, error: "limite" });

  await db.collection("leads").add({
    ...lead,
    name: lead.nombre,
    source: "proposal_form",
    timestamp: FieldValue.serverTimestamp(),
  });
  return res.json({ ok: true });
});
