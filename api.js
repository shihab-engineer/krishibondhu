/* Netlify Function: real AI diagnosis with Gemini. Zero dependencies (Node 18+).
   GET  /api/v1/health          -> 200 {ok, ai:"gemini"} when GEMINI_API_KEY is set, else 503 (the site stays in demo mode)
   POST /api/v1/diagnose-crop   -> multipart: image, text_query  ->  same JSON shape the app already uses
   Env: GEMINI_API_KEY (required), GEMINI_MODEL (optional, default gemini-2.5-flash) */
const KB = require("./kb.json");
const BY_ID = Object.fromEntries(KB.map(d => [d.id, d]));
const json = (code, body) => ({ statusCode: code, headers: { "content-type": "application/json", "cache-control": "no-store" }, body: JSON.stringify(body) });

/** Minimal multipart parser: returns { fields: {name: string}, files: {name: {type, data: Buffer}} } */
function parseMultipart(event) {
  const ct = event.headers["content-type"] || event.headers["Content-Type"] || "";
  const m = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(ct);
  if (!m) return { fields: {}, files: {} };
  const boundary = Buffer.from("--" + (m[1] || m[2]));
  const body = Buffer.from(event.body || "", event.isBase64Encoded ? "base64" : "utf8");
  const fields = {}, files = {};
  let pos = body.indexOf(boundary);
  while (pos !== -1) {
    const next = body.indexOf(boundary, pos + boundary.length);
    if (next === -1) break;
    const part = body.subarray(pos + boundary.length + 2, next - 2);       // strip CRLF around the part
    const sep = part.indexOf("\r\n\r\n");
    if (sep > -1) {
      const head = part.subarray(0, sep).toString("utf8"), data = part.subarray(sep + 4);
      const name = /name="([^"]*)"/.exec(head)?.[1], fname = /filename="([^"]*)"/.exec(head);
      if (name) {
        if (fname) files[name] = { type: /content-type:\s*([^\r\n]+)/i.exec(head)?.[1] || "application/octet-stream", data };
        else fields[name] = data.toString("utf8");
      }
    }
    pos = next;
  }
  return { fields, files };
}

async function gemini(text, image) {
  const catalog = KB.map(d => `- ${d.id}: ${d.crop.en}, ${d.name.en}; ${d.symptoms.en}`).join("\n");
  const prompt = "You are a crop-disease assistant for Bangladeshi farmers. Pick the single best match from this list " +
    "(use 'healthy' if the plant looks fine or the input is unrelated):\n" + catalog +
    `\n\nThe farmer's description (may be Bangla or English): ${text || "(none)"}\n` +
    'Reply with JSON only: {"disease_id": string, "confidence": number between 0 and 1}';
  const parts = [{ text: prompt }];
  if (image) parts.push({ inline_data: { mime_type: image.type, data: image.data.toString("base64") } });
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
    body: JSON.stringify({ contents: [{ parts }], generationConfig: { responseMimeType: "application/json", temperature: 0.2 } })
  });
  if (!r.ok) throw new Error("Gemini HTTP " + r.status);
  const raw = (await r.json()).candidates[0].content.parts[0].text;
  const j = JSON.parse(raw.trim().replace(/^```(?:json)?|```$/g, "").trim());
  const id = BY_ID[j.disease_id] ? j.disease_id : "healthy";
  return { id, conf: Math.max(0, Math.min(1, Number(j.confidence) || 0.5)) };
}

exports.handler = async event => {
  if (!process.env.GEMINI_API_KEY) return json(503, { ok: false, detail: "GEMINI_API_KEY not set" });
  if (event.httpMethod === "GET") return json(200, { ok: true, ai: "gemini", voice: false });
  if (event.httpMethod !== "POST") return json(405, { detail: "Method not allowed" });
  try {
    const { fields, files } = parseMultipart(event);
    const text = (fields.text_query || "").trim(), image = files.image && files.image.data.length < 4.5e6 ? files.image : null;
    if (!text && !image) return json(400, { detail: "Provide text or an image." });
    const { id, conf } = await gemini(text, image), d = BY_ID[id];
    return json(200, { mode: "gemini", transcript: null, outbreak: null, warnings: [],
      diagnosis: { disease_id: id, crop: d.crop, name: d.name, severity: d.severity, confidence: conf, symptoms: d.symptoms, organic: d.organic, chemical: d.chemical } });
  } catch (e) {
    return json(502, { detail: "AI request failed: " + e.message });
  }
};
