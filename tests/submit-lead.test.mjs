import assert from "node:assert/strict";
import { test } from "node:test";

const URL = "http://127.0.0.1:5001/demo-growth-buddies/us-central1/submitLead";
const FIRESTORE = "http://127.0.0.1:18080/v1/projects/demo-growth-buddies/databases/(default)/documents";
const base = { nombre: "Ana Pérez", correo: "ana@empresa.cl", empresa: "Empresa", cargo: "Gerenta" };
const post = (body, ip) =>
  fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
const leads = async () => {
  const response = await fetch(`${FIRESTORE}/leads`, { headers: { Authorization: "Bearer owner" } });
  return (await response.json()).documents ?? [];
};

test("stores a valid lead per product, without unknown fields", async () => {
  const before = (await leads()).length;
  const response = await post(
    { ...base, producto: "expense-buddy", personas: "11 a 50", sin_senal: "Sí", herramienta: "Planilla", admin: true, utm_source: "demo" },
    "10.0.0.1"
  );
  assert.equal(response.status, 200);
  const all = await leads();
  assert.equal(all.length, before + 1);
  const { fields } = all.find((doc) => doc.fields.utm_source);
  assert.equal(fields.source.stringValue, "proposal_form");
  assert.equal(fields.interest.stringValue, "Expense Buddy");
  assert.equal(fields.admin, undefined);
  assert.equal(fields.partial, undefined);
  assert.equal(fields.details.mapValue.fields.personas.stringValue, "11 a 50");

  for (const body of [
    { producto: "docflow-buddy", casos_mes: "20 a 100", recepcion_documentos: "Por correo" },
    { producto: "agent-buddy", sitio_web: "empresa.cl", canales: "WhatsApp", interes: "Web" },
    { producto: "diagnostico", problema: "Mucho trabajo manual" },
  ]) {
    assert.equal((await post({ ...base, ...body }, "10.0.0.2")).status, 200);
  }
});

test("rejects invalid data", async () => {
  const product = { producto: "diagnostico", problema: "Texto" };
  assert.equal((await post({ ...base, ...product, correo: "malo" }, "10.0.0.3")).status, 400);
  assert.equal((await post({ ...base, ...product, nombre: "" }, "10.0.0.3")).status, 400);
  assert.equal((await post({ ...base, producto: "otro" }, "10.0.0.3")).status, 400);
  assert.equal((await post({ ...base, producto: "expense-buddy", personas: "9000" }, "10.0.0.3")).status, 400);
  assert.equal((await fetch(URL)).status, 405);
});

test("honeypot answers ok and stores nothing", async () => {
  const before = (await leads()).length;
  const response = await post({ ...base, producto: "diagnostico", problema: "x", fax: "spam" }, "10.0.0.4");
  assert.equal(response.status, 200);
  assert.equal((await leads()).length, before);
});

test("limits each address to five submissions per hour", async () => {
  const body = { ...base, producto: "diagnostico", problema: "Texto" };
  for (let i = 0; i < 5; i += 1) assert.equal((await post(body, "10.0.0.5")).status, 200);
  assert.equal((await post(body, "10.0.0.5")).status, 429);
  assert.equal((await post(body, "10.0.0.6")).status, 200);
});
