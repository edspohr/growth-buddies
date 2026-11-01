import { readFileSync } from "node:fs";
import { after, before, beforeEach, test } from "node:test";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";

let env;
const base = () => ({ email: "ana@empresa.cl", timestamp: serverTimestamp() });
const db = () => env.unauthenticatedContext().firestore();
const create = (name, data) => addDoc(collection(db(), name), data);

before(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-growth-buddies",
    firestore: { rules: readFileSync("firestore.rules", "utf8"), host: "127.0.0.1", port: 18080 },
  });
});
beforeEach(() => env.clearFirestore());
after(() => env.cleanup());

test("accepts the payloads the site sends", async () => {
  const attribution = {
    device: "mobile",
    landing_page: "https://growthbuddies.cl/",
    referrer: "direct",
    utm_source: "google",
    gclid: "abc",
  };
  await assertSucceeds(
    create("guide_leads", { ...base(), ...attribution, name: "Ana", industry: null, country: "CL" })
  );
  await assertSucceeds(
    create("report_leads", {
      ...base(),
      ...attribution,
      name: null,
      company: "Empresa",
      sector: "Legal",
      country: "CL",
      report: "informe-automatizacion-servicios-latam-2026",
    })
  );
  await assertSucceeds(
    create("quiz_leads", {
      ...base(),
      company: null,
      answers: { sector: "legal", size: "10" },
      source: "homepage_quiz",
      followup_sent: false,
      landing_page: "https://growthbuddies.cl/",
      referrer: "direct",
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
    })
  );
});

test("rejects unexpected fields, bad emails and oversized text", async () => {
  await assertFails(create("guide_leads", { ...base(), admin: true }));
  await assertFails(create("report_leads", { ...base(), email: "no-es-correo" }));
  await assertFails(create("report_leads", { ...base(), name: "x".repeat(121) }));
  await assertFails(create("quiz_leads", { ...base(), answers: "texto" }));
  await assertFails(create("quiz_leads", { ...base(), answers: {}, followup_sent: true }));
  await assertFails(create("guide_leads", { email: "ana@empresa.cl", timestamp: new Date(0) }));
});

test("keeps collections without a form closed", async () => {
  await assertFails(create("leads", base()));
  await assertFails(create("calculator_leads", base()));
  await assertFails(create("otra", base()));
});

test("limits reads to signed-in users", async () => {
  await assertFails(getDocs(collection(db(), "report_leads")));
  await assertSucceeds(getDocs(collection(env.authenticatedContext("admin").firestore(), "report_leads")));
});
