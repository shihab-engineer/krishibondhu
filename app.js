
(() => {
"use strict";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get(k, d = null) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------------------------------------------------------------- i18n */
const T = {
  bn: {
    nav_home: "হোম", nav_wx: "আবহাওয়া", nav_crops: "ফসলের তথ্য", nav_help: "সহায়তা", nav_more: "আরও", nav_ins: "খামার ইনসাইট", nav_road: "রোডম্যাপ", nav_biz: "ব্যবসা মডেল",
    d_cam: "ক্যামেরা", d_snap: "ছবি তুলুন", d_camfail: "ক্যামেরা চালু করা যায়নি। ছবি বাছুন বা ফাইল আপলোড করুন।",
    nav_diag: "রোগ নির্ণয়", nav_map: "মহামারী মানচিত্র", nav_agent: "এজেন্ট ডেস্ক", nav_chan: "ফোন ও SMS", nav_about: "প্রজেক্ট",
    d_title: "পাতার ছবি তুলুন, অথবা সমস্যাটা বলুন", d_sub: "ছবি, বাংলা কণ্ঠ বা লেখা থেকে রোগ চিনে জৈব ও রাসায়নিক সমাধান দেয়।",
    d_drop: "পাতার ছবি তুলুন বা বেছে নিন", d_drop_sub: "আক্রান্ত পাতার কাছ থেকে, আলোতে তোলা স্পষ্ট ছবি ভালো",
    d_mic: "বলে জানান", d_text: "সমস্যার বর্ণনা", d_text_ph: "যেমন: ধানের পাতায় চোখের মতো দাগ, কিনারা বাদামি",
    d_district: "আপনার জেলা", d_save: "মহামারী মানচিত্রে যোগ করুন", d_agent: "এজেন্ট মোড (কৃষকের পক্ষে)",
    d_fname: "কৃষকের নাম", d_fphone: "ফোন নম্বর", d_go: "রোগ নির্ণয় করুন", d_busy: "বিশ্লেষণ চলছে…",
    d_empty: "ছবি, কণ্ঠ বা লেখার যেকোনো একটি দিন।", d_example: "উদাহরণ", d_conf: "আত্মবিশ্বাস", d_match: "কীওয়ার্ড মিল",
    d_sym: "লক্ষণ", d_org: "জৈব সমাধান", d_chem: "রাসায়নিক সমাধান", d_listen: "শুনুন", d_copy: "কপি", d_copied: "কপি হয়েছে",
    d_img_demo: "ডেমো মোডে ছবি পড়া হয় না, তাই এটি নমুনা ফলাফল। সার্ভারে Gemini কী যোগ করলে ছবি থেকে আসল নির্ণয় হবে।",
    d_voice: "আপনার কথা", d_alert: "সতর্কতা: আপনার ৫ কিমির মধ্যে {n}টি খামারে একই রোগ ধরা পড়েছে।",
    d_nocrop: "কোনো ছবি বা লেখা পাওয়া যায়নি।", d_fail: "সার্ভারে পাঠানো যায়নি: ",
    sev_high: "ঝুঁকি বেশি", sev_medium: "মাঝারি ঝুঁকি", sev_low: "কম ঝুঁকি",
    h_title: "আপনার সাম্প্রতিক নির্ণয়", h_empty: "এখনও কোনো নির্ণয় নেই। প্রথমটি করুন।",
    mic_stop: "থামান", mic_none: "এই ডিভাইসে মাইক্রোফোন বা ভয়েস সাপোর্ট নেই। লিখে জানান।", mic_heard: "শোনা গেছে",
    mic_ok: "রেকর্ড হয়েছে, নির্ণয় চাপুন",
    m_title: "মহামারী মানচিত্র", m_sub: "একই এলাকায় ৫ কিমির মধ্যে ৩টির বেশি খামারে একই রোগ ধরা পড়লে সতর্কতা তৈরি হয়।",
    m_high: "ঝুঁকি বেশি", m_med: "মাঝারি", m_ring: "সতর্কতা এলাকা (স্কেল নয়)", m_alerts: "সক্রিয় সতর্কতা", m_none: "এখন কোনো সতর্কতা নেই।",
    m_by: "রোগ অনুযায়ী ঘটনা (১৪ দিন)", m_reports: "ঘটনা", m_al: "সতর্কতা", m_dist: "জেলা",
    m_sample: "মানচিত্রের বেশিরভাগ বিন্দু নমুনা ডেটা, আসল রিপোর্ট নয়।", m_farms: "{n}টি খামার · ৫ কিমি", m_ago: "রিপোর্ট",
    a_title: "এজেন্ট ডেস্ক", a_sub: "সারের দোকান বা ডিজিটাল সেন্টারের উদ্যোক্তা কৃষকের হয়ে ছবি তুলে সমাধান দেন, সব সেবা এখানে জমা থাকে।",
    a_ledger: "আজকের সেবার খাতা", a_new: "নতুন কৃষক", a_csv: "CSV কপি", a_c1: "সময়", a_c2: "কৃষক", a_c3: "রোগ", a_c4: "জেলা",
    a_empty: "এখনও কোনো সেবা নেই। রোগ নির্ণয় পাতায় এজেন্ট মোড চালু করুন।", a_k1: "আজ সেবা", a_k2: "মোট সেবা", a_k3: "সবচেয়ে বেশি রোগ",
    c_title: "ইন্টারনেট ছাড়া কৃষকের কাছে", c_sub: "বাটন ফোনের কৃষক USSD, ভয়েস কল বা SMS দিয়ে একই জ্ঞানভান্ডার থেকে উত্তর পান।",
    c_send: "পাঠান", c_reset: "নতুন সেশন", c_ivr: "ভয়েস কল (IVR)", c_ivr_ph: "কৃষক যা বলবেন, লিখুন…", c_call: "কল করুন",
    c_sms: "SMS সতর্কতা", c_sms_btn: "নমুনা সতর্কতা দেখান", c_ivr_hi: "আপনার ফসলের সমস্যাটি বলুন।", c_nobn: "(এই ডিভাইসে বাংলা কণ্ঠ নেই, শুধু লেখা দেখানো হলো)",
    ab_title: "প্রজেক্ট ও আর্কিটেকচার", ab_sub: "ফ্রন্ট-এন্ড, AI ইঞ্জিন ও ডেটাবেজ: কোনটি এই বিল্ডে চালু, কোনটি পরিকল্পিত।",
    ab_run: "চালানোর নিয়ম", ab_api: "ব্যাকএন্ড URL (ঐচ্ছিক)", ab_save: "সংরক্ষণ", ab_priv: "সব লেখা ও ইতিহাস শুধু আপনার ব্রাউজারে থাকে, যতক্ষণ না আপনি সার্ভারে পাঠান।",
    mode_demo: "ডেমো মোড", mode_live: "লাইভ AI", st_now: "এই বিল্ডে", st_plan: "পরিকল্পিত",
    t1: "১. ফ্রন্ট-এন্ড ও চ্যানেল", t2: "২. ব্যাক-এন্ড ও AI", t3: "৩. ডেটা ও অ্যালার্ট",
    sev: "ঝুঁকি", disc: "পরামর্শ মাত্র। স্প্রে করার আগে উপজেলা কৃষি অফিসারের সাথে নিশ্চিত হন।", pick_t: "নির্বাচিত ঘটনা",
    d_dist_any: "জেলা বাছাই করুন",
    au_title: "অ্যাকাউন্টে প্রবেশ করুন", au_sub: "কৃষিবন্ধু ব্যবহার করতে লগইন করুন অথবা নতুন অ্যাকাউন্ট খুলুন।",
    au_login: "লগইন", au_register: "নতুন অ্যাকাউন্ট", au_logout: "লগআউট", au_name: "আপনার নাম", au_email: "ইমেইল", au_pass: "পাসওয়ার্ড", au_pass2: "পাসওয়ার্ড আবার দিন",
    au_show: "দেখান", au_hide: "লুকান", au_rule: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।",
    au_demo_t: "বিচারকদের জন্য ডেমো অ্যাকাউন্ট (Demo Guest User)", au_demo_btn: "ডেমো তথ্য বসান",
    au_note: "ডেমো বিল্ড: অ্যাকাউন্টের তথ্য শুধু এই ব্রাউজারে সংরক্ষিত থাকে।",
    au_e_empty: "ইমেইল ও পাসওয়ার্ড দিন।", au_e_bad: "ইমেইল বা পাসওয়ার্ড ভুল।", au_e_mail: "সঠিক ইমেইল দিন।", au_e_short: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।",
    au_e_match: "দুটি পাসওয়ার্ড মেলেনি।", au_e_dup: "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট আছে।", au_e_name: "নাম লিখুন।", au_e_lock: "অনেকবার ভুল হয়েছে। {n} সেকেন্ড পরে আবার চেষ্টা করুন।",
    au_hi: "স্বাগতম, {n}"
  },
  en: {
    nav_home: "Home", nav_wx: "Weather", nav_crops: "Crop guide", nav_help: "Help", nav_more: "More", nav_ins: "Farm insights", nav_road: "Roadmap", nav_biz: "Business model",
    d_cam: "Camera", d_snap: "Capture", d_camfail: "Could not start the camera. Choose a photo or upload a file.",
    nav_diag: "Diagnose", nav_map: "Outbreak map", nav_agent: "Agent desk", nav_chan: "Phone & SMS", nav_about: "Project",
    d_title: "Photograph the leaf, or describe the problem", d_sub: "Identifies the disease from a photo, Bangla voice or text and gives organic and chemical remedies.",
    d_drop: "Take or choose a leaf photo", d_drop_sub: "A sharp, well-lit close-up of the affected leaf works best",
    d_mic: "Speak", d_text: "Describe the problem", d_text_ph: "e.g. eye-shaped spots on rice leaves with brown edges",
    d_district: "Your district", d_save: "Add to outbreak map", d_agent: "Agent mode (on behalf of a farmer)",
    d_fname: "Farmer name", d_fphone: "Phone number", d_go: "Diagnose", d_busy: "Analysing…",
    d_empty: "Add a photo, a voice note or a description.", d_example: "Example", d_conf: "Confidence", d_match: "Keyword match",
    d_sym: "Symptoms", d_org: "Organic treatment", d_chem: "Chemical treatment", d_listen: "Listen", d_copy: "Copy", d_copied: "Copied",
    d_img_demo: "Demo mode cannot read photos, so this is a sample result. Add a Gemini key on the server for real image diagnosis.",
    d_voice: "You said", d_alert: "Alert: {n} farms within 5 km reported the same disease.",
    d_nocrop: "No photo or text was found.", d_fail: "Could not reach the server: ",
    sev_high: "High risk", sev_medium: "Medium risk", sev_low: "Low risk",
    h_title: "Your recent diagnoses", h_empty: "No diagnoses yet. Run your first one.",
    mic_stop: "Stop", mic_none: "No microphone or voice support on this device. Type instead.", mic_heard: "Heard",
    mic_ok: "Recorded. Press Diagnose",
    m_title: "Outbreak map", m_sub: "An alert is created when more than 3 farms within 5 km report the same disease.",
    m_high: "High risk", m_med: "Medium", m_ring: "Alert zone (not to scale)", m_alerts: "Active alerts", m_none: "No alerts right now.",
    m_by: "Cases by disease (14 days)", m_reports: "Cases", m_al: "Alerts", m_dist: "Districts",
    m_sample: "Most dots on this map are sample data, not real reports.", m_farms: "{n} farms · 5 km", m_ago: "Report",
    a_title: "Agent desk", a_sub: "A fertiliser-shop or digital-centre entrepreneur photographs the leaf for the farmer and gives the remedy. Every service is logged here.",
    a_ledger: "Service ledger", a_new: "New farmer", a_csv: "Copy CSV", a_c1: "Time", a_c2: "Farmer", a_c3: "Disease", a_c4: "District",
    a_empty: "No services yet. Turn on Agent mode on the Diagnose page.", a_k1: "Today", a_k2: "Total", a_k3: "Most common",
    c_title: "Reaching farmers without internet", c_sub: "Button-phone farmers get answers from the same knowledge base through USSD, a voice call or SMS.",
    c_send: "Send", c_reset: "New session", c_ivr: "Voice call (IVR)", c_ivr_ph: "Type what the farmer says…", c_call: "Call",
    c_sms: "SMS alert", c_sms_btn: "Show sample alert", c_ivr_hi: "Tell us about your crop problem.", c_nobn: "(No Bangla voice on this device, showing text only)",
    ab_title: "Project and architecture", ab_sub: "Front end, AI engine and data: what runs in this build and what is planned.",
    ab_run: "How to run", ab_api: "Backend URL (optional)", ab_save: "Save", ab_priv: "Text and history stay in your browser until you send them to a server.",
    mode_demo: "Demo mode", mode_live: "Live AI", st_now: "In this build", st_plan: "Planned",
    t1: "1. Front end and channels", t2: "2. Back end and AI", t3: "3. Data and alerts",
    sev: "Risk", disc: "Guidance only. Confirm with your upazila agriculture officer before spraying.", pick_t: "Selected report",
    d_dist_any: "Choose a district",
    au_title: "Sign in to your account", au_sub: "Log in to use KrishiBondhu, or create a new account.",
    au_login: "Log in", au_register: "Create account", au_logout: "Log out", au_name: "Your name", au_email: "Email", au_pass: "Password", au_pass2: "Confirm password",
    au_show: "Show", au_hide: "Hide", au_rule: "Password must be at least 8 characters.",
    au_demo_t: "Demo account for judges (Demo Guest User)", au_demo_btn: "Fill demo details",
    au_note: "Demo build: account details are stored in this browser only.",
    au_e_empty: "Enter your email and password.", au_e_bad: "Wrong email or password.", au_e_mail: "Enter a valid email.", au_e_short: "Password must be at least 8 characters.",
    au_e_match: "The two passwords do not match.", au_e_dup: "An account with this email already exists.", au_e_name: "Enter your name.", au_e_lock: "Too many attempts. Try again in {n} seconds.",
    au_hi: "Welcome, {n}"
  }
};
let lang = store.get("ap_lang", "bn");
const t = (k, p = {}) => String(T[lang][k] ?? T.en[k] ?? k).replace(/\{(\w+)\}/g, (_, x) => p[x]);
const num = n => Number(n).toLocaleString(lang === "bn" ? "bn-BD" : "en");
const L = o => (o && (o[lang] || o.en)) || "";

/* ---------------------------------------------------------------- data */
// Geography: 64 district outlines (MIT, "manchitro" package). FIT maps lat/lon to the outline's SVG space
// (least-squares + silhouette overlap against the Natural Earth border, within a few km).
const FIT = { ax: 330.8667, bx: -29126.6, ay: -370.5455, by: 9834.41 };
const px = (lat, lon) => [FIT.ax * lon + FIT.bx, FIT.ay * lat + FIT.by];
const DISTRICTS = GEO.map(g => [g.en, g.bn, (g.c[1] - FIT.by) / FIT.ay, (g.c[0] - FIT.bx) / FIT.ax]).sort((a, b) => a[0].localeCompare(b[0]));
const distName = en => { const d = DISTRICTS.find(x => x[0] === en); return d ? (lang === "bn" ? d[1] : d[0]) : (en || "-"); };
const HQ = ["Dhaka", "Chattogram", "Rajshahi", "Khulna", "Barishal", "Sylhet", "Rangpur", "Mymensingh"];
const DAY = 86400000;
const RADIUS_KM = 5, MIN_FARMS = 4, WINDOW = 14 * DAY;
const SEED = [
  ["s1","rice_blast","Rice",24.85,89.37,"Bogura","high"],["s2","rice_blast","Rice",24.87,89.40,"Bogura","high"],
  ["s3","rice_blast","Rice",24.83,89.35,"Bogura","high"],["s4","rice_blast","Rice",24.86,89.34,"Bogura","high"],
  ["s5","tomato_late_blight","Tomato",25.75,89.25,"Rangpur","high"],["s6","tomato_late_blight","Tomato",25.78,89.27,"Rangpur","high"],
  ["s7","potato_late_blight","Potato",25.63,88.64,"Dinajpur","high"],["s8","brinjal_shoot_borer","Brinjal",23.46,91.18,"Cumilla","medium"],
  ["s9","rice_brown_spot","Rice",22.82,89.55,"Khulna","medium"],["s10","maize_rust","Maize",24.37,88.60,"Rajshahi","medium"],
  ["s11","rice_bacterial_blight","Rice",24.90,91.87,"Sylhet","high"]
];
const seedReports = () => { const n = Date.now(); return SEED.map((r, i) => ({ farm_id: r[0], disease_id: r[1], crop: r[2], lat: r[3], lon: r[4], district: r[5], severity: r[6], ts: n - i * 9 * 3600000, sample: 1 })); };
const kbById = id => KB.find(d => d.id === id);
const hav = (a, b, c, d) => { const r = 6371, p = Math.PI / 180, x = Math.sin((c - a) * p / 2) ** 2 + Math.cos(a * p) * Math.cos(c * p) * Math.sin((d - b) * p / 2) ** 2; return 2 * r * Math.asin(Math.sqrt(x)); };

function computeAlerts(reports) {
  const now = Date.now(), alerts = [];
  const recent = reports.filter(r => now - r.ts <= WINDOW);
  for (const r of recent) {
    const near = new Set(recent.filter(o => o.disease_id === r.disease_id && hav(r.lat, r.lon, o.lat, o.lon) <= RADIUS_KM).map(o => o.farm_id));
    if (near.size < MIN_FARMS) continue;
    if (alerts.some(a => a.disease_id === r.disease_id && hav(a.lat, a.lon, r.lat, r.lon) <= RADIUS_KM)) continue;
    alerts.push({ disease_id: r.disease_id, lat: r.lat, lon: r.lon, farms: near.size, ts: r.ts, name: kbById(r.disease_id).name });
  }
  return alerts;
}

/* ---------------------------------------------------------------- API */
const api = { live: false, base: "", ai: "demo" };
async function detectApi() {
  const custom = store.get("ap_api", "");
  const bases = custom ? [custom.replace(/\/$/, "")] : (location.protocol.startsWith("http") ? [""] : []);
  for (const b of bases) {
    try {
      const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 2500);
      const r = await fetch(b + "/api/v1/health", { signal: ctl.signal }); clearTimeout(to);
      if (r.ok && (r.headers.get("content-type") || "").includes("json")) { const j = await r.json(); api.live = true; api.base = b; api.ai = j.ai; api.voice = j.voice; break; }
    } catch {}
  }
  renderMode();
}
function renderMode() {
  const m = $("#mode");
  m.textContent = api.live ? (api.ai === "gemini" ? t("mode_live") : t("mode_demo") + " · API") : t("mode_demo");
  m.classList.toggle("live", api.live && api.ai === "gemini");
}

/* ---------------------------------------------------------------- state */
const state = { file: null, audio: null, selected: null, mapData: null };
let history_ = store.get("ap_hist", []);
let localReports = store.get("ap_reports", []);
let ledger = store.get("ap_ledger", []);

/* ---------------------------------------------------------------- retrieval + demo diagnosis */
const tok = s => new Set((s.toLowerCase().match(/[\wঀ-৿]+/g)) || []);
function retrieve(q) {
  q = q.toLowerCase(); const qt = tok(q), out = [];
  for (const d of KB) {
    if (d.id === "healthy") continue;
    let s = 0;
    for (const kw of d.keywords) {
      const k = kw.toLowerCase();
      if (q.includes(k)) s += (k.includes(" ") || k.length > 4) ? 2 : 1;
      else if ([...tok(k)].some(x => qt.has(x))) s += .5;
    }
    if (s) out.push([s, d]);
  }
  return out.sort((a, b) => b[0] - a[0]).slice(0, 3);
}
function demoDiagnose(text, file) {
  const hits = retrieve(text);
  let id, conf, guess = false;
  if (hits.length) { id = hits[0][1].id; conf = Math.min(.55 + hits[0][0] * .05, .8); }
  else if (file) { const pool = KB.filter(d => d.id !== "healthy"); id = pool[(file.size + file.name.length) % pool.length].id; conf = .5; guess = true; }
  else { id = "healthy"; conf = .3; }
  return build(id, conf, "demo", null, guess);
}
function build(id, conf, mode, transcript, guess) {
  const d = kbById(id);
  return { mode, transcript, imageGuess: !!guess, diagnosis: { disease_id: id, crop: d.crop, name: d.name, severity: d.severity, confidence: conf, symptoms: d.symptoms, organic: d.organic, chemical: d.chemical }, outbreak: null };
}

/* ---------------------------------------------------------------- render: result */
function sevPill(s) { return `<span class="pill ${s}">${t("sev_" + s)}</span>`; }
function renderResult(res, opts = {}) {
  const el = $("#result"), d = res.diagnosis;
  const pct = Math.round(d.confidence * 100);
  const resultText = [L(d.name), "", t("d_sym") + ": " + L(d.symptoms), t("d_org") + ": " + L(d.organic), t("d_chem") + ": " + L(d.chemical)].join("\n");
  el.dataset.text = resultText;
  el.innerHTML = `
    <div class="res-top">
      <div class="stack" style="gap:6px">
        <span class="muted small">${esc(L(d.crop))}</span>
        <h2>${esc(L(d.name))}</h2>
      </div>
      <div class="row">${opts.example ? `<span class="eg">${t("d_example")}</span>` : ""}${sevPill(d.severity)}</div>
    </div>
    ${res.transcript ? `<div class="small muted">${t("d_voice")}: “${esc(res.transcript)}”</div>` : ""}
    <div class="row small muted" style="flex-wrap:nowrap"><span style="white-space:nowrap">${res.mode === "gemini" ? t("d_conf") : t("d_match")} ${num(pct)}%</span><div class="meter" style="flex:1"><span style="width:${pct}%"></span></div></div>
    ${res.imageGuess ? `<div class="note">${t("d_img_demo")}</div>` : ""}
    ${res.outbreak ? `<div class="alertbox"><svg class="i"><use href="#i-alert"/></svg> ${t("d_alert", { n: num(res.outbreak.farms) })}</div>` : ""}
    <div class="sec"><h3><svg class="i"><use href="#i-bug"/></svg>${t("d_sym")}</h3><p>${esc(L(d.symptoms))}</p></div>
    <div class="sec"><h3><svg class="i"><use href="#i-leaf"/></svg>${t("d_org")}</h3><p>${esc(L(d.organic))}</p></div>
    <div class="sec chem"><h3><svg class="i"><use href="#i-drop"/></svg>${t("d_chem")}</h3><p>${esc(L(d.chemical))}</p></div>
    <p class="small muted">${t("disc")}</p>
    <div class="row"><button class="btn alt sm" id="rListen" type="button"><svg class="i"><use href="#i-speaker"/></svg>${t("d_listen")}</button>
    <button class="btn alt sm" id="rCopy" type="button"><svg class="i"><use href="#i-copy"/></svg><span>${t("d_copy")}</span></button></div>`;
  $("#rListen").onclick = () => speak(L(d.name) + ". " + L(d.organic));
  $("#rCopy").onclick = async e => {
    const b = e.currentTarget.querySelector("span");
    try { await navigator.clipboard.writeText(el.dataset.text); b.textContent = t("d_copied"); setTimeout(() => b.textContent = t("d_copy"), 1500); }
    catch { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
  };
  state.lastResult = { res, opts };
}
function renderHistory() {
  const ul = $("#hist");
  if (!history_.length) { ul.innerHTML = `<li class="muted">${t("h_empty")}</li>`; return; }
  const rtf = new Intl.RelativeTimeFormat(lang === "bn" ? "bn" : "en", { numeric: "auto" });
  ul.innerHTML = history_.slice(0, 6).map(h => {
    const d = kbById(h.id); if (!d) return "";
    const days = Math.round((h.ts - Date.now()) / DAY), hrs = Math.round((h.ts - Date.now()) / 3600000);
    const when = Math.abs(hrs) < 24 ? rtf.format(hrs, "hour") : rtf.format(days, "day");
    return `<li><span><b>${esc(L(d.name))}</b> <span class="muted small">${esc(h.district ? distName(h.district) : "")}</span></span><span class="row">${sevPill(d.severity)}<span class="muted small">${when}</span></span></li>`;
  }).join("");
}

/* ---------------------------------------------------------------- diagnose submit */
async function onDiagnose(e) {
  e.preventDefault();
  const err = $("#formErr"); err.hidden = true;
  const text = $("#q").value.trim();
  if (!text && !state.file && !state.audio) { err.textContent = t("d_empty"); err.hidden = false; return; }
  const btn = $("#goBtn"); btn.disabled = true; $("span", btn).textContent = t("d_busy");
  const dist = DISTRICTS.find(d => d[0] === $("#district").value);
  const save = $("#saveMap").checked && !!dist;
  const agent = $("#agentMode").checked;
  try {
    let res;
    if (api.live) {
      const fd = new FormData();
      if (state.file) fd.append("image", state.file);
      if (state.audio) fd.append("audio", state.audio, "voice.webm");
      if (text) fd.append("text_query", text);
      if (dist) { fd.append("lat", dist[2] + (Math.random() - .5) * .04); fd.append("lon", dist[3] + (Math.random() - .5) * .04); fd.append("district", dist[0]); }
      fd.append("save", save);
      const r = await fetch(api.base + "/api/v1/diagnose-crop", { method: "POST", body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j.detail || r.status);
      res = { mode: j.mode, transcript: j.transcript, imageGuess: j.mode === "demo" && !!state.file && !text, diagnosis: j.diagnosis, outbreak: j.outbreak };
      if (j.warnings && j.warnings.length) { err.textContent = j.warnings.join(" · "); err.hidden = false; }
    } else {
      res = demoDiagnose(text, state.file);
      if (save && res.diagnosis.disease_id !== "healthy") {
        const farm = agent && $("#fname").value ? "a" + Date.now() : "u" + Date.now();
        const rep = { farm_id: farm, disease_id: res.diagnosis.disease_id, crop: res.diagnosis.crop.en, lat: dist[2] + (Math.random() - .5) * .04, lon: dist[3] + (Math.random() - .5) * .04, district: dist[0], severity: res.diagnosis.severity, ts: Date.now() };
        localReports.push(rep); store.set("ap_reports", localReports);
        const all = seedReports().concat(localReports);
        const near = new Set(all.filter(o => o.disease_id === rep.disease_id && Date.now() - o.ts <= WINDOW && hav(rep.lat, rep.lon, o.lat, o.lon) <= RADIUS_KM).map(o => o.farm_id));
        if (near.size >= MIN_FARMS) res.outbreak = { farms: near.size };
      }
    }
    renderResult(res);
    history_.unshift({ id: res.diagnosis.disease_id, ts: Date.now(), district: dist && dist[0] }); history_ = history_.slice(0, 20); store.set("ap_hist", history_); renderHistory();
    if (agent) {
      ledger.unshift({ ts: Date.now(), farmer: $("#fname").value.trim() || "-", phone: $("#fphone").value.trim(), id: res.diagnosis.disease_id, district: dist ? dist[0] : "" });
      store.set("ap_ledger", ledger.slice(0, 300)); renderAgent();
    }
    state.mapData = null;
    if (innerWidth < 860) $("#result").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (ex) {
    err.textContent = t("d_fail") + ex.message; err.hidden = false;
  } finally { btn.disabled = false; $("span", btn).textContent = t("d_go"); }
}

/* ---------------------------------------------------------------- image + voice input */
function setFile(f) {
  state.file = f || null;
  const prev = $("#prev");
  if (f) { prev.src = URL.createObjectURL(f); prev.hidden = false; $("#scanEmpty").hidden = true; }
  else { prev.hidden = true; $("#scanEmpty").hidden = false; }
}
let rec = null;
function micInfo(msg) { $("#micInfo").textContent = msg || ""; }
async function onMic() {
  const btn = $("#micBtn");
  if (rec) { rec.stop(); return; }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  try {
    if (api.live && api.voice === "whisper" && navigator.mediaDevices && window.MediaRecorder) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream), chunks = [];
      mr.ondataavailable = e => chunks.push(e.data);
      mr.onstop = () => { stream.getTracks().forEach(x => x.stop()); state.audio = new Blob(chunks, { type: mr.mimeType }); rec = null; btn.classList.remove("rec"); $("#micTxt").textContent = t("d_mic"); micInfo(t("mic_ok")); };
      mr.start(); rec = mr; btn.classList.add("rec"); $("#micTxt").textContent = t("mic_stop");
    } else if (SR) {
      const r = new SR(); r.lang = "bn-BD"; r.interimResults = false;
      r.onresult = e => { const s = e.results[0][0].transcript; $("#q").value = ($("#q").value + " " + s).trim(); micInfo(t("mic_heard") + ": " + s); };
      r.onerror = () => micInfo(t("mic_none"));
      r.onend = () => { rec = null; btn.classList.remove("rec"); $("#micTxt").textContent = t("d_mic"); };
      r.start(); rec = r; btn.classList.add("rec"); $("#micTxt").textContent = t("mic_stop");
    } else micInfo(t("mic_none"));
  } catch { rec = null; micInfo(t("mic_none")); }
}
function speak(text) {
  try {
    const u = new SpeechSynthesisUtterance(text); u.lang = "bn-BD";
    const v = speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith("bn"));
    if (v) u.voice = v;
    speechSynthesis.cancel(); speechSynthesis.speak(u); return !!v;
  } catch { return false; }
}

/* ---------------------------------------------------------------- map */
async function getMapData() {
  if (state.mapData) return state.mapData;
  let reports, alerts, sample = true;
  if (api.live) {
    try {
      const j = await (await fetch(api.base + "/api/v1/outbreaks")).json();
      reports = j.reports.map(r => ({ ...r, ts: r.ts * 1000 })); alerts = j.alerts.map(a => ({ ...a, ts: a.ts * 1000 }));
      sample = reports.some(r => r.sample);
    } catch {}
  }
  if (!reports) { reports = seedReports().concat(localReports); alerts = computeAlerts(reports); }
  return state.mapData = { reports, alerts, sample };
}
async function renderMap() {
  const { reports, alerts, sample } = await getMapData();
  const live = reports.filter(r => Date.now() - r.ts <= WINDOW);
  const svg = $("#mapSvg");
  const dc = {};
  live.forEach(r => { const dn = DISTRICTS.some(d => d[0] === r.district) ? r.district : nearestDistrict(r.lat, r.lon); r._d = dn; dc[dn] = (dc[dn] || 0) + 1; });
  let h = `<g>${GEO.map(g => `<path d="${g.d}" fill="var(--line)" stroke="var(--line)" stroke-width="9" stroke-linejoin="round"/>`).join("")}</g><g>`;
  for (const g of GEO) {
    const c = dc[g.en] || 0;
    const fill = c ? `style="fill:color-mix(in srgb, var(--crit) ${Math.min(60, 14 + c * 12)}%, var(--surface2))"` : "";
    h += `<path class="d" ${fill} d="${g.d}"><title>${esc(lang === "bn" ? g.bn : g.en)}${c ? " · " + num(c) : ""}</title></path>`;
  }
  h += "</g>";
  for (const g of GEO) if (dc[g.en] || HQ.includes(g.en)) h += `<text class="maplbl${dc[g.en] ? " on" : ""}" x="${g.c[0]}" y="${g.c[1] + 54}" text-anchor="middle">${esc(lang === "bn" ? g.bn : g.en)}</text>`;
  for (const a of alerts) { const [x, y] = px(a.lat, a.lon); h += `<circle class="ring" cx="${x}" cy="${y}" r="62"/>`; }
  live.forEach((r, i) => { const [x, y] = px(r.lat, r.lon); h += `<circle class="dot ${r.severity} ${state.selected === i ? "sel" : ""}" data-i="${i}" cx="${x}" cy="${y}" r="15" tabindex="0" role="button" aria-label="${esc(L(kbById(r.disease_id).name))}"/>`; });
  svg.innerHTML = h;
  $$(".dot", svg).forEach(c => { const f = () => { state.selected = +c.dataset.i; showPick(live[state.selected]); renderMap(); }; c.onclick = f; c.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); f(); } }; });

  const counts = {}; live.forEach(r => counts[r.disease_id] = (counts[r.disease_id] || 0) + 1);
  $("#kpis").innerHTML = [[live.length, t("m_reports")], [alerts.length, t("m_al")], [Object.keys(dc).length, t("m_dist")]].map(([n, l]) => `<div class="kpi"><b>${num(n)}</b><span>${l}</span></div>`).join("");
  const sn = $("#sampleNote"); sn.hidden = !sample; sn.textContent = t("m_sample");
  $("#alerts").innerHTML = alerts.length ? alerts.map(a => `<div class="alert-i"><b><svg class="i"><use href="#i-alert"/></svg> ${esc(L(a.name))}</b><span>${esc(distName(nearestDistrict(a.lat, a.lon)))} · ${t("m_farms", { n: num(a.farms) })}</span></div>`).join("") : `<p class="muted">${t("m_none")}</p>`;
  const max = Math.max(1, ...Object.values(counts));
  $("#bars").innerHTML = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([id, n]) => `<div class="bar-r"><span>${esc(L(kbById(id).name))}</span><div class="t"><span style="width:${n / max * 100}%"></span></div><em>${num(n)}</em></div>`).join("");
  if (state.selected != null && live[state.selected]) showPick(live[state.selected]); else $("#pick").hidden = true;
}
function nearestDistrict(la, lo) { return DISTRICTS.reduce((b, d) => hav(la, lo, d[2], d[3]) < hav(la, lo, b[2], b[3]) ? d : b)[0]; }
function showPick(r) {
  const d = kbById(r.disease_id), el = $("#pick"); el.hidden = false;
  const rtf = new Intl.RelativeTimeFormat(lang === "bn" ? "bn" : "en", { numeric: "auto" });
  el.innerHTML = `<h2>${t("pick_t")}</h2><div class="row">${sevPill(d.severity)}<b>${esc(L(d.name))}</b></div><p class="muted small">${esc(L(d.crop))} · ${esc(distName(r.district))} · ${rtf.format(Math.round((r.ts - Date.now()) / 3600000), "hour")}</p><p class="small">${esc(L(d.organic))}</p>`;
}

/* ---------------------------------------------------------------- agent */
function renderAgent() {
  const today = ledger.filter(l => new Date(l.ts).toDateString() === new Date().toDateString()).length;
  const cnt = {}; ledger.forEach(l => cnt[l.id] = (cnt[l.id] || 0) + 1);
  const top = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0];
  $("#aKpis").innerHTML = [[num(today), t("a_k1")], [num(ledger.length), t("a_k2")], [top ? esc(L(kbById(top[0]).name)) : "-", t("a_k3")]]
    .map(([n, l], i) => `<div class="kpi"><b style="${i === 2 ? "font-size:18px;line-height:1.4" : ""}">${n}</b><span>${l}</span></div>`).join("");
  const tf = new Intl.DateTimeFormat(lang === "bn" ? "bn-BD" : "en-GB", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" });
  $("#ledger").innerHTML = ledger.length ? ledger.slice(0, 40).map(l => `<tr><td>${tf.format(l.ts)}</td><td>${esc(l.farmer)}<br><span class="muted small">${esc(l.phone)}</span></td><td>${esc(L(kbById(l.id).name))}</td><td>${esc(distName(l.district))}</td></tr>`).join("")
    : `<tr><td colspan="4" class="muted">${t("a_empty")}</td></tr>`;
}

/* ---------------------------------------------------------------- channels */
const USSD_CROPS = [["ধান", "Rice"], ["টমেটো", "Tomato"], ["আলু", "Potato"], ["ভুট্টা", "Maize"], ["বেগুন", "Brinjal (eggplant)"]];
let ussdPath = "";
function ussdLocal(text) {
  const p = text.split("*").filter(Boolean);
  if (!p.length) return "CON কৃষিবন্ধু\n1. রোগ জানুন\n2. এলাকার সতর্কতা\n3. কৃষি অফিসার";
  if (p[0] === "2") { const n = computeAlerts(seedReports().concat(localReports)).length; return `END গত ৭ দিনে ${n}টি মহামারী সতর্কতা আছে। বিস্তারিত ওয়েবসাইটে দেখুন।`; }
  if (p[0] === "3") return "END আপনার উপজেলা কৃষি অফিসে যোগাযোগ করুন। কৃষক কল সেন্টার: ১৬১২৩";
  if (p[0] !== "1") return "END ভুল অপশন।";
  if (p.length === 1) return "CON ফসল বাছাই করুন\n" + USSD_CROPS.map((c, i) => `${i + 1}. ${c[0]}`).join("\n");
  const c = USSD_CROPS[+p[1] - 1]; if (!c) return "END ভুল অপশন।";
  const ds = KB.filter(d => d.crop.en === c[1]);
  if (p.length === 2) return "CON সমস্যা বাছাই করুন\n" + ds.map((d, i) => `${i + 1}. ${d.name.bn}`).join("\n");
  const d = ds[+p[2] - 1]; if (!d) return "END ভুল অপশন।";
  return `END ${d.name.bn}\nজৈব: ${d.organic.bn.split("।")[0]}।\nরাসায়নিকের আগে কৃষি অফিসারের পরামর্শ নিন।`;
}
async function ussdStep(input) {
  if (input !== null) ussdPath = ussdPath ? ussdPath + "*" + input : input;
  let out;
  if (api.live) { try { const fd = new URLSearchParams({ text: ussdPath }); out = await (await fetch(api.base + "/api/v1/ussd", { method: "POST", body: fd })).text(); } catch { out = ussdLocal(ussdPath); } }
  else out = ussdLocal(ussdPath);
  const end = out.startsWith("END");
  $("#ussdScreen").textContent = out.replace(/^(CON|END) ?/, "") + (end ? "\n\n— (session ended)" : "");
  $("#ussdIn").disabled = end; $("#ussdSend").disabled = end; $("#ussdIn").value = "";
}
function ivrReply(q) {
  const h = retrieve(q); const d = h.length ? h[0][1] : kbById("healthy");
  return `${d.name.bn}। ${d.organic.bn}`;
}
function ivrCall() {
  const q = $("#ivrIn").value.trim(); if (!q) return;
  const r = ivrReply(q);
  const ok = speak(r);
  $("#ivrScreen").textContent = `📞 ${t("c_ivr_hi")}\n\n🧑‍🌾 ${q}\n\n🔊 ${r}${ok ? "" : "\n\n" + t("c_nobn")}`;
}
let smsI = 0;
function smsShow() {
  const als = computeAlerts(seedReports().concat(localReports));
  const a = als[smsI++ % Math.max(1, als.length)];
  const body = a ? `কৃষিবন্ধু: ${a.name.bn} আপনার ৫ কিমির মধ্যে ছড়াচ্ছে। জমি পরীক্ষা করুন।` : t("m_none");
  $("#smsScreen").innerHTML = `<div class="sms" style="color:var(--ink)">${esc(body)}</div>`;
}

/* ---------------------------------------------------------------- about */
const TIERS = [
  ["t1", [["now", { bn: "PWA ওয়েব পোর্টাল (ভ্যানিলা JS, অফলাইন ক্যাশ)", en: "PWA web portal (vanilla JS, offline cache)" }], ["now", { bn: "ছবি আপলোড/ক্যামেরা, বাংলা ভয়েস ইনপুট", en: "Photo upload/camera, Bangla voice input" }], ["now", { bn: "USSD ও IVR (Twilio) ওয়েবহুক", en: "USSD and IVR (Twilio) webhooks" }], ["plan", { bn: "Next.js + Tailwind রিরাইট", en: "Next.js + Tailwind rewrite" }]]],
  ["t2", [["now", { bn: "FastAPI অ্যাসিঙ্ক API", en: "FastAPI async API" }], ["now", { bn: "Gemini মাল্টিমোডাল + Whisper STT (কী লাগে)", en: "Gemini multimodal + Whisper STT (keys needed)" }], ["now", { bn: "কীওয়ার্ড RAG জ্ঞানভান্ডার", en: "Keyword RAG knowledge base" }], ["plan", { bn: "YOLOv8-seg / MobileNetV3 ফাইন-টিউনিং", en: "YOLOv8-seg / MobileNetV3 fine-tuning" }], ["plan", { bn: "বাংলা TTS, LangGraph এজেন্ট", en: "Bangla TTS, LangGraph agents" }]]],
  ["t3", [["now", { bn: "SQLite + Haversine জিও-ফেন্সিং (৫ কিমি, >৩ খামার)", en: "SQLite + Haversine geo-fencing (5 km, >3 farms)" }], ["now", { bn: "SMS আউটবক্স (সিমুলেটেড)", en: "SMS outbox (simulated)" }], ["plan", { bn: "PostgreSQL + PostGIS, pgvector", en: "PostgreSQL + PostGIS, pgvector" }], ["plan", { bn: "Kafka, Prefect, Neo4j, Grafana", en: "Kafka, Prefect, Neo4j, Grafana" }], ["plan", { bn: "আসল SMS গেটওয়ে", en: "Real SMS gateway" }]]]
];
function renderTiers() {
  $("#tiers").innerHTML = TIERS.map(([k, items]) => `<div class="card tier"><h2>${t(k)}</h2><ul>${items.map(([s, o]) => `<li><span class="st ${s}">${t("st_" + s)}</span><span>${esc(L(o))}</span></li>`).join("")}</ul></div>`).join("");
}

/* ---------------------------------------------------------------- shell */
const SAMPLES = [
  { bn: "ধানের পাতায় চোখের মতো দাগ", en: "Eye-shaped spots on rice leaves" },
  { bn: "টমেটো পাতায় পানিভেজা কালো দাগ", en: "Water-soaked dark patches on tomato leaves" },
  { bn: "আলুর পাতা কুয়াশায় কালো হয়ে যাচ্ছে", en: "Potato leaves turning black in fog" },
  { bn: "বেগুনের ডগা ঢলে পড়ছে, ফলে ছিদ্র", en: "Brinjal shoots wilting, holes in fruit" }
];
function renderStatic() {
  document.documentElement.lang = lang;
  $$("[data-i18n]").forEach(e => e.textContent = t(e.dataset.i18n));
  $$("[data-i18n-ph]").forEach(e => e.placeholder = t(e.dataset.i18nPh));
  const sel = $("#district"), cur = sel.value;
  sel.innerHTML = `<option value="">${t("d_dist_any")}</option>` + DISTRICTS.map(d => `<option value="${d[0]}">${lang === "bn" ? d[1] : d[0]}</option>`).join("");
  sel.value = cur || "Bogura";
  $("#sample").innerHTML = SAMPLES.map(s => `<button type="button" class="chip">${esc(L(s))}</button>`).join("");
  $$("#sample .chip").forEach((c, i) => c.onclick = () => { $("#q").value = L(SAMPLES[i]); });
  renderMode(); renderHistory(); renderAgent(); renderTiers(); renderPages();
  $("#ussdIn").placeholder = "1"; 
  if (state.lastResult && !state.lastResult.opts.example) renderResult(state.lastResult.res, state.lastResult.opts);
  else renderResult(build("rice_blast", .72, "demo", null, false), { example: true });
  if (!$("#v-map").hidden) renderMap();
  if (ussdPath === "") ussdStep(null);
}
const ROUTES = ["market", "pitch", "home", "diagnose", "map", "weather", "crops", "help", "more", "insights", "loss", "agent", "channels", "roadmap", "business", "about"];
const MORE = ["market", "pitch", "insights", "loss", "agent", "channels", "roadmap", "business", "about"];
function route() {
  const v = (location.hash || "#home").slice(1);
  const id = ROUTES.includes(v) ? v : "home";
  stopCam();
  $$(".view").forEach(s => s.hidden = s.id !== "v-" + id);
  const grp = MORE.includes(id) ? "more" : id;
  $$("[data-v]").forEach(a => { if (a.dataset.v === grp) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
  if (id === "map") renderMap();
  if (id === "agent") renderAgent();
  scrollTo(0, 0);
}
function setTheme(m) {
  if (m) document.documentElement.dataset.theme = m; else delete document.documentElement.dataset.theme;
  window.APX && APX.syncNight();
}
/* ---------------------------------------------------------------- camera */
let camStream = null;
async function openCam() {
  const err = $("#camErr"); err.hidden = true;
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw 0;
    camStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    const v = $("#vid"); v.srcObject = camStream; v.hidden = false; $("#snapBtn").hidden = false;
  } catch { err.textContent = t("d_camfail"); err.hidden = false; }
}
function stopCam() {
  if (camStream) camStream.getTracks().forEach(x => x.stop());
  camStream = null; const v = $("#vid"); if (v) v.hidden = true; const s = $("#snapBtn"); if (s) s.hidden = true;
}
function snapCam() {
  const v = $("#vid"), c = document.createElement("canvas"); c.width = v.videoWidth; c.height = v.videoHeight;
  c.getContext("2d").drawImage(v, 0, 0);
  c.toBlob(b => { if (b) setFile(new File([b], "capture.jpg", { type: "image/jpeg" })); stopCam(); }, "image/jpeg", .85);
}
/* data adapted from the supplied "Amrai Gorbo Bangladesh" page */
var CROPS=[
[["বোরো ধান","Boro rice"],"🌾",["ডিসেম্বর–এপ্রিল/মে","Dec–Apr/May"],"140–155","5–7",["অনেক বেশি (নিয়মিত সেচ)","Very high (regular irrigation)"],["শীতে চারা ঠান্ডা, ফুল আসার সময় তাপ, ব্লাস্ট","Cold at seedling, heat at flowering, blast"]],
[["আমন ধান","Aman rice"],"🌾",["জুলাই–ডিসেম্বর","Jul–Dec"],"110–150","3.5–5",["বৃষ্টিনির্ভর, শুষ্ক সময়ে সম্পূরক সেচ","Rain-fed, supplemental irrigation in dry spells"],["বন্যা, বাদামি গাছফড়িং","Flood, brown planthopper"]],
[["আউশ ধান","Aus rice"],"🌾",["মার্চ–আগস্ট","Mar–Aug"],"100–120","2.5–4",["মাঝারি","Moderate"],["খরা, ব্লাস্ট","Drought, blast"]],
[["গম","Wheat"],"🌿",["নভেম্বর–মার্চ","Nov–Mar"],"100–110","3–4",["কম (২–৩ বার সেচ)","Low (2–3 irrigations)"],["দানা ভরার সময় তাপ, মরিচা রোগ, ব্লাস্ট","Heat at grain filling, rust, blast"]],
[["ভুট্টা","Maize"],"🌽",["নভেম্বর–এপ্রিল (রবি)","Nov–Apr (rabi)"],"130–150","8–10 (hybrid)",["মাঝারি","Moderate"],["ফল আর্মিওয়ার্ম, জলাবদ্ধতা","Fall armyworm, waterlogging"]],
[["পাট","Jute"],"🪢",["মার্চ–আগস্ট","Mar–Aug"],"120–150","2–3 (fibre)",["মাঝারি","Moderate"],["শুরুতে জলাবদ্ধতা, ঘুন পোকা","Early waterlogging, stem weevil"]],
[["আলু","Potato"],"🥔",["নভেম্বর–মার্চ","Nov–Mar"],"85–100","20–30",["মাঝারি (৩–৪ বার সেচ)","Moderate (3–4 irrigations)"],["লেট ব্লাইট (কুয়াশা ও আর্দ্রতায়)","Late blight (fog, humidity)"]],
[["টমেটো","Tomato"],"🍅",["অক্টোবর–মার্চ","Oct–Mar"],"90–120","40–60",["মাঝারি, নিয়মিত","Moderate, regular"],["ঢলে পড়া রোগ, তাপ","Bacterial wilt, heat"]],
[["সরিষা","Mustard"],"🌼",["নভেম্বর–ফেব্রুয়ারি","Nov–Feb"],"85–100","1–1.5",["কম","Low"],["জাব পোকা, কুয়াশা","Aphids, fog"]],
[["মসুর","Lentil"],"🫘",["নভেম্বর–মার্চ","Nov–Mar"],"100–110","1–1.5",["খুব কম","Very low"],["মরিচা, স্টেমফাইলিয়াম ব্লাইট","Rust, stemphylium blight"]],
[["বেগুন","Brinjal"],"🍆",["প্রায় সারা বছর","Nearly year-round"],"150+","25–35",["মাঝারি, নিয়মিত","Moderate, regular"],["ডগা ও ফল ছিদ্রকারী পোকা","Shoot & fruit borer"]],
[["আখ","Sugarcane"],"🎋",["নভেম্বর–মার্চ রোপণ","Plant Nov–Mar"],"300–360","60–80",["বেশি","High"],["মাজরা পোকা, খরা","Borers, drought"]]];
function cx(d,c,s){return [[["রোগ ও পোকা","Diseases & pests"],d],[["দমন / কীটনাশক","Control / pesticide"],c],[["বীজ / জাত","Seed / varieties"],s]]}
var CX=[
cx(["ব্লাস্ট, খোলপচা, বাদামি গাছফড়িং","Blast, sheath blight, brown planthopper"],["ব্লাস্টে ট্রাইসাইক্লাজল, খোলপচায় হেক্সাকোনাজল; আগে পার্চিং ও আলোর ফাঁদ","Tricyclazole (blast), hexaconazole (sheath blight); perching & light traps first"],["ব্রি ধান২৮, ২৯, ৫৮, ৮৯, ৯২","BRRI dhan28, 29, 58, 89, 92"]),
cx(["পাতা পোড়া, বাদামি গাছফড়িং, খোলপচা","Bacterial leaf blight, brown planthopper, sheath blight"],["অতিরিক্ত ইউরিয়া এড়ান; প্রয়োজনে DAE-সুপারিশকৃত কীটনাশক","Avoid excess urea; DAE-recommended insecticide only if needed"],["ব্রি ধান৪৯, ৫১ (বন্যা সহনশীল), ৫২, ৭১, ৭৫","BRRI dhan49, 51 (submergence), 52, 71, 75"]),
cx(["ব্লাস্ট, মাজরা পোকা","Blast, stem borer"],["ট্রাইসাইক্লাজল; আলোর ফাঁদ, ডিমের গাদা সংগ্রহ","Tricyclazole; light traps, collect egg masses"],["ব্রি ধান৪৮, ৫৫, ৬৫","BRRI dhan48, 55, 65"]),
cx(["পাতার ব্লাস্ট, মরিচা, পাতার দাগ","Wheat blast, rust, leaf spot"],["টেবুকোনাজোলভিত্তিক ছত্রাকনাশক (লেবেল দেখে); বীজ শোধন","Tebuconazole-based fungicide (per label); seed treatment"],["বারি গম ২৬, ২৮, ৩০, ৩৩ (ব্লাস্ট সহনশীল)","BARI Gom 26, 28, 30, 33 (blast-tolerant)"]),
cx(["ফল আর্মিওয়ার্ম, কাণ্ড পচা","Fall armyworm, stalk rot"],["ডিমের গাদা হাতে তুলুন; ইমামেকটিন বেনজোয়েট / স্পিনেটোরাম (লেবেল অনুযায়ী)","Hand-pick egg masses; emamectin benzoate / spinetoram (per label)"],["হাইব্রিড জাত (BADC ও নিবন্ধিত কোম্পানি)","Hybrids (BADC & registered companies)"]),
cx(["ঘুন পোকা, বিছা পোকা, কাণ্ড পচা","Stem weevil, hairy caterpillar, stem rot"],["আক্রান্ত অংশ সংগ্রহ ও ধ্বংস; DAE-সুপারিশকৃত কীটনাশক","Collect/destroy infested parts; DAE-recommended insecticide"],["বিজেআরআই জাত (যেমন ও-৯৮৯৭)","BJRI varieties (e.g., O-9897)"]),
cx(["লেট ব্লাইট, আর্লি ব্লাইট","Late blight, early blight"],["ম্যানকোজেব (প্রতিরোধে); আক্রমণে মেটালাক্সিল + ম্যানকোজেব","Mancozeb (preventive); metalaxyl + mancozeb if infected"],["বারি আলু ৭, ২৫, ২৮, ২৯, ৭২","BARI Alu 7, 25, 28, 29, 72"]),
cx(["ঢলে পড়া, পাতা কোঁকড়ানো ভাইরাস (সাদা মাছি)","Bacterial wilt, leaf curl virus (whitefly)"],["সাদা মাছি দমন ও ফাঁদ; রোগাক্রান্ত গাছ তুলে ফেলুন","Whitefly control, sticky traps; uproot infected plants"],["বারি টমেটো ১৪, ১৫, ১৬","BARI Tomato 14, 15, 16"]),
cx(["জাব পোকা, অল্টারনারিয়া ব্লাইট","Aphids, Alternaria blight"],["সাবান-পানি / নিম; ছত্রাকে আইপ্রোডিয়ন বা ম্যানকোজেব","Soap-water / neem; iprodione or mancozeb for blight"],["বারি সরিষা ১৪, ১৫, ১৭","BARI Sarisha 14, 15, 17"]),
cx(["মরিচা, স্টেমফাইলিয়াম ব্লাইট","Rust, stemphylium blight"],["বীজ শোধন; ম্যানকোজেব","Seed treatment; mancozeb"],["বারি মসুর ৫, ৬, ৭, ৮","BARI Masur 5, 6, 7, 8"]),
cx(["ডগা ও ফল ছিদ্রকারী পোকা, ঢলে পড়া","Shoot & fruit borer, bacterial wilt"],["আক্রান্ত ডগা কেটে ফেলুন, ফেরোমন ফাঁদ; পরে সুপারিশকৃত কীটনাশক","Cut infested shoots, pheromone traps; then recommended insecticide"],["বারি বেগুন ৮, ৯, ১০","BARI Begun 8, 9, 10"]),
cx(["লাল পচা, মাজরা পোকা","Red rot, borers"],["রোগমুক্ত সেট ও সেট শোধন; আক্রান্ত ঝাড় তুলে ফেলুন","Disease-free setts & treatment; uproot infected clumps"],["বিএসআরআই আখ ৪০, ৪১, ৪২","BSRI Akh 40, 41, 42"])];
var DV=[[["ঢাকা বিভাগ","Dhaka Division"],"Dhaka:ঢাকা;Gazipur:গাজীপুর;Narayanganj:নারায়ণগঞ্জ;Narsingdi:নরসিংদী;Manikganj:মানিকগঞ্জ;Munshiganj:মুন্সিগঞ্জ;Tangail:টাঙ্গাইল;Kishoreganj:কিশোরগঞ্জ;Faridpur:ফরিদপুর;Rajbari:রাজবাড়ী;Gopalganj:গোপালগঞ্জ;Madaripur:মাদারীপুর;Shariatpur:শরীয়তপুর"],
[["চট্টগ্রাম বিভাগ","Chattogram Division"],"Chattogram:চট্টগ্রাম;Cox’s Bazar:কক্সবাজার;Cumilla:কুমিল্লা;Brahmanbaria:ব্রাহ্মণবাড়িয়া;Chandpur:চাঁদপুর;Feni:ফেনী;Noakhali:নোয়াখালী;Lakshmipur:লক্ষ্মীপুর;Khagrachhari:খাগড়াছড়ি;Rangamati:রাঙামাটি;Bandarban:বান্দরবান"],
[["রাজশাহী বিভাগ","Rajshahi Division"],"Rajshahi:রাজশাহী;Bogura:বগুড়া;Joypurhat:জয়পুরহাট;Naogaon:নওগাঁ;Natore:নাটোর;Chapainawabganj:চাঁপাইনবাবগঞ্জ;Pabna:পাবনা;Sirajganj:সিরাজগঞ্জ"],
[["খুলনা বিভাগ","Khulna Division"],"Khulna:খুলনা;Bagerhat:বাগেরহাট;Satkhira:সাতক্ষীরা;Jashore:যশোর;Jhenaidah:ঝিনাইদহ;Magura:মাগুরা;Narail:নড়াইল;Kushtia:কুষ্টিয়া;Chuadanga:চুয়াডাঙ্গা;Meherpur:মেহেরপুর"],
[["বরিশাল বিভাগ","Barishal Division"],"Barishal:বরিশাল;Barguna:বরগুনা;Bhola:ভোলা;Jhalokathi:ঝালকাঠি;Patuakhali:পটুয়াখালী;Pirojpur:পিরোজপুর"],
[["সিলেট বিভাগ","Sylhet Division"],"Sylhet:সিলেট;Moulvibazar:মৌলভীবাজার;Habiganj:হবিগঞ্জ;Sunamganj:সুনামগঞ্জ"],
[["রংপুর বিভাগ","Rangpur Division"],"Rangpur:রংপুর;Dinajpur:দিনাজপুর;Gaibandha:গাইবান্ধা;Kurigram:কুড়িগ্রাম;Lalmonirhat:লালমনিরহাট;Nilphamari:নীলফামারী;Panchagarh:পঞ্চগড়;Thakurgaon:ঠাকুরগাঁও"],
[["ময়মনসিংহ বিভাগ","Mymensingh Division"],"Mymensingh:ময়মনসিংহ;Jamalpur:জামালপুর;Netrokona:নেত্রকোনা;Sherpur:শেরপুর"]];
var INST=[[["কৃষি সম্প্রসারণ অধিদপ্তর (DAE)","Dept. of Agricultural Extension (DAE)"],"খামারবাড়ি, ঢাকা|Khamarbari, Dhaka","dae.gov.bd"],[["বাংলাদেশ ধান গবেষণা ইনস্টিটিউট (ব্রি)","BRRI"],"গাজীপুর|Gazipur","brri.gov.bd"],[["বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউট (বারি)","BARI"],"গাজীপুর|Gazipur","bari.gov.bd"],[["বাংলাদেশ কৃষি উন্নয়ন কর্পোরেশন (BADC) – বীজ ও সার","BADC – seed & fertiliser"],"ঢাকা|Dhaka","badc.gov.bd"],[["বাংলাদেশ পরমাণু কৃষি গবেষণা ইনস্টিটিউট (বিনা)","BINA"],"ময়মনসিংহ|Mymensingh","bina.gov.bd"],[["বাংলাদেশ পাট গবেষণা ইনস্টিটিউট (বিজেআরআই)","BJRI"],"ঢাকা|Dhaka","bjri.gov.bd"],[["বাংলাদেশ সুগারক্রপ গবেষণা ইনস্টিটিউট (বিএসআরআই)","BSRI"],"ঈশ্বরদী, পাবনা|Ishwardi, Pabna","bsri.gov.bd"],[["মৃত্তিকা সম্পদ উন্নয়ন ইনস্টিটিউট (SRDI)","SRDI (soil)"],"ঢাকা|Dhaka","srdi.gov.bd"]];
var VID=[["ধান চাষ","Rice farming","ধান চাষ পদ্ধতি ব্রি"],["আলু চাষ","Potato farming","আলু চাষ পদ্ধতি বারি"],["গম ও ভুট্টা","Wheat & maize","গম ভুট্টা চাষ পদ্ধতি"],["সবজি (টমেটো, বেগুন)","Vegetables","টমেটো বেগুন চাষ পদ্ধতি"],["পাট ও সরিষা","Jute & mustard","পাট সরিষা চাষ পদ্ধতি"],["রোগ-পোকা দমন (IPM)","Pest management (IPM)","ফসলের রোগ পোকা দমন আইপিএম কৃষি সম্প্রসারণ"],["পানি সাশ্রয়ী সেচ (AWD)","Water-saving irrigation (AWD)","ধানে এডব্লিউডি সেচ পদ্ধতি"]];
var OFF={"Dhaka":"Biraj Chandra Sarkar|01783383586|1","Gazipur":"Md. Harunur Rashid Khan|01716048418|1","Munshiganj":"Mariam Akhter|01712590686|1","Kishoreganj":"Farzana Parveen|01711235466|1","Shariatpur":"K.M. Hossiar|01552495962|1","Gopalganj":"Muhammad Mizanur Rahman|01748218352|1","Narayanganj":"AKM Shahriar Reza|01711339296|1","Manikganj":"Aloka Prova Dey|01716319610|1","Faridpur":"Khan Mohammad Naim|01712013661|1","Narsingdi":"Muhammad Azizal Hoque|01714582896|0","Rajbari":"Md. Ataur Rahman|01711645041|1","Tangail":"Forida Yasmin|01915695243|1","Madaripur":"A.S.M Moinul Ahsan|01827137555|1","Mymensingh":"Md. Rokon Uddin Bhuiyan|01790832461|1","Sherpur":"Md. Johaer Ali Mia|01712192435|1","Jamalpur":"Md. Abdul Based|01869836188|1","Netrokona":"Md. Harun Aur Rashid|01712821992|1","Chattogram":"Prajesh Kumar Saha|01819806898|1","Cox’s Bazar":"Md. Abdul Kader|01930120571|1","Bandarban":"Saifuddin Mohammad Hasan Ali|01711204161|1","Cumilla":"Md. Shamsuzzaman|01780418262|1","Brahmanbaria":"Md. Amir Ali|01556401684|1","Chandpur":"Nur Mohammad|01799440424|1","Feni":"Md. Abu Jafor|01712450501|1","Lakshmipur":"Jashim Uddin Ahammad Khan|01712208723|1","Noakhali":"Md. Ishaq|01818257765|1","Rangamati":"Md. Mohang Shahajan|01715073655|1","Khagrachhari":"Md. Mizanur Rahman|01731571625|1","Khulna":"Md. Mostak Uddin|01732050150|1"};
var WX=[[["ময়মনসিংহ","Mymensingh"],87.3,0,[[91.3,73.1,0],[91.1,71.7,0],[91.1,71.6,0],[91.3,72.2,0],[90.2,72.2,0],[89.3,72.9,0],[87.6,74.2,15],[87.0,75.2,45]]],
[["ঢাকা","Dhaka"],88.0,0,[[92.1,74.2,0],[91.9,72.4,5],[90.9,72.8,0],[91.3,73.9,5],[90.5,74.4,0],[90.1,75.1,0],[86.8,75.5,50],[86.1,76.0,55]]],
[["চট্টগ্রাম","Chattogram"],87.4,0,[[92.2,77.7,5],[90.8,77.6,0],[90.6,77.9,0],[91.3,78.5,0],[90.8,78.3,0],[89.8,78.6,0],[87.2,77.8,65],[87.9,78.4,65]]],
[["রাজশাহী","Rajshahi"],86.1,0,[[90.7,73.3,10],[90.2,71.7,5],[90.1,71.6,0],[90.3,72.2,0],[89.0,71.7,0],[88.6,72.3,0],[86.8,73.2,0],[84.2,73.6,55]]],
[["খুলনা","Khulna"],87.5,1,[[92.1,75.1,10],[91.4,72.7,10],[90.2,73.0,0],[90.4,74.7,5],[90.0,74.4,0],[89.5,75.2,0],[85.6,75.1,55],[84.5,75.4,75]]],
[["বরিশাল","Barishal"],89.3,1,[[92.0,76.6,10],[91.5,73.8,10],[91.2,75.1,0],[91.3,76.2,0],[90.9,76.4,0],[89.3,76.4,0],[86.1,76.1,75],[85.8,76.9,75]]],
[["সিলেট","Sylhet"],85.3,0,[[90.8,72.1,0],[91.1,71.2,0],[91.2,71.2,0],[91.6,73.3,0],[90.3,74.0,0],[89.9,74.0,0],[87.7,75.5,40],[88.0,75.5,30]]],
[["রংপুর","Rangpur"],85.3,0,[[88.7,71.8,0],[89.5,70.9,0],[89.8,70.7,0],[89.9,70.3,0],[89.2,69.9,0],[88.4,69.7,0],[87.7,71.1,0],[85.0,72.5,30]]]];

/* ---------------------------------------------------------------- merged pages (home, weather, crops, help, insights, roadmap, business, more, about top) */
const q = v => typeof v === "string" ? v : (lang === "bn" ? v[0] : v[1]);
const qe = v => esc(q(v));
const kvH = (rows, raw) => `<div class="kv">${rows.map(r => `<div><span>${qe(r[0])}</span><b>${raw && r[2] ? q(r[1]) : qe(r[1])}</b></div>`).join("")}</div>`;
const cardH = (title, body, cls = "") => `<div class="card stack ${cls}"><h2>${qe(title)}</h2>${body}</div>`;
const pgHead = (cls, h, p) => `<div class="pgh ${cls}"><div class="in"><h1>${qe(h)}</h1><p>${qe(p)}</p></div></div><div class="sp"></div>`;
const Cc = f => Math.round((f - 32) * 5 / 9);
const nf = n => lang === "bn" ? Number(n).toLocaleString("bn-BD") : String(n);
const go = h => { location.hash = h; };
/* Bridge for js/extras.js (market hub, pitch page, scenes). Getters/lambdas keep it lazy. */
window.AP = { $, $$, qe, nf, esc, cardH, pgHead, go, setTheme, store, L,
  hav: (...a) => hav(...a), computeAlerts: r => computeAlerts(r), seedReports: () => seedReports(),
  get lang() { return lang; }, get localReports() { return localReports; },
  get DISTRICTS() { return DISTRICTS; }, get SAMPLES() { return SAMPLES; } };

/* ---- home */
function renderHome() {
  const dhaka = WX[1], rain = dhaka[3][0][2];
  const alerts = computeAlerts(seedReports().concat(localReports)).length;
  const tiles = [
    ["diagnose", "i-scan", ["রোগ নির্ণয়", "Diagnose a crop"], ["ছবি, কণ্ঠ বা লেখা থেকে রোগ চিনে সমাধান দেয়।", "Photo, voice or text in, remedy out."]],
    ["map", "i-map", ["মহামারী মানচিত্র", "Outbreak map"], ["৬৪ জেলার মানচিত্রে রোগের ছড়ানো ও সতর্কতা।", "Disease spread and alerts across 64 districts."]],
    ["weather", "i-cloud", ["আবহাওয়া ও পরামর্শ", "Weather and advice"], ["৮ বিভাগের ৮ দিনের পূর্বাভাস ও সেচ-সার পরামর্শ।", "8-day forecast for 8 divisions with irrigation and fertiliser advice."]],
    ["market", "i-store", ["ফসল থেকে বাজার", "Field to market"], ["ক্ষতি, সেরা বাজার, সংগ্রহ কেন্দ্র ও ক্রেতা মিল।", "Loss, best market, collection points and buyer matching."]],
    ["crops", "i-book", ["ফসলের তথ্য", "Crop guide"], ["১২টি ফসলের মৌসুম, ফলন, রোগ, দমন ও জাত।", "Season, yield, diseases, control and varieties for 12 crops."]],
    ["insights", "i-chart", ["খামার ইনসাইট", "Farm insights"], ["সহনশীলতা স্কোর, ঝুঁকির সময়রেখা ও আজকের পদক্ষেপ।", "Resilience score, risk timeline and today's action."]],
    ["agent", "i-store", ["এজেন্ট ডেস্ক", "Agent desk"], ["সারের দোকান বা ডিজিটাল সেন্টার কৃষকের পক্ষে সেবা দেয়।", "Fertiliser shops and digital centres serve farmers."]],
    ["channels", "i-phone", ["ফোন ও SMS", "Phone and SMS"], ["USSD, ভয়েস কল ও SMS, ইন্টারনেট ছাড়াই।", "USSD, voice call and SMS, no internet needed."]],
    ["help", "i-help", ["সহায়তা ও যোগাযোগ", "Help and contacts"], ["জেলা কৃষি অফিস, কৃষি কল সেন্টার ১৬১২৩ ও গবেষণা প্রতিষ্ঠান।", "District agriculture offices, call centre 16123 and research institutes."]]
  ];
  $("#v-home").innerHTML = `
    <div class="hero"><div class="hero-in">
      <div class="hero-txt">
        <h1>${qe(["ফসলের রোগ চিনুন, ঝুঁকি আগেই জানুন", "Spot crop disease early. Act before it spreads."])}</h1>
        <p class="lead">${qe(["পাতার ছবি, বাংলা কণ্ঠ বা লেখা থেকে রোগ নির্ণয়, এলাকার মহামারী সতর্কতা আর আবহাওয়াভিত্তিক পরামর্শ, সব এক জায়গায়।", "Diagnose from a leaf photo, Bangla voice or text. Get outbreak alerts for your area and weather-based advice in one place."])}</p>
        <p class="tag">${qe(["জানুন আপনার জমি। বুঝুন ঝুঁকি। নিন পরবর্তী সঠিক পদক্ষেপ।", "Know your field. Predict the risk. Make the next right move."])}</p>
        <div class="row"><a class="btn cta" href="#diagnose">${qe(["রোগ নির্ণয় করুন", "Diagnose a crop"])}</a><a class="btn onph" href="#map">${qe(["মহামারী মানচিত্র", "Outbreak map"])}</a></div>
      </div>
      <aside class="glass" aria-label="Today">
        <div><small>${qe(["আজ · ঢাকা", "Today · Dhaka"])}</small><div id="clk" style="font-weight:600"></div></div>
        <div class="row" style="flex-wrap:nowrap;gap:12px"><span class="t">${nf(Cc(dhaka[1]))}°</span><span style="font-size:34px">${rain >= 40 ? "🌧️" : rain >= 15 ? "⛅" : "☀️"}</span></div>
        <div class="line"><span>${qe(["সক্রিয় মহামারী সতর্কতা", "Active outbreak alerts"])}</span><b>${nf(alerts)}</b></div>
        <div class="line"><a href="#weather">${qe(["৮ দিনের পূর্বাভাস", "8-day forecast"])}</a><a href="#map">${qe(["সতর্কতা দেখুন", "View alerts"])}</a></div>
        <small>${qe(["আবহাওয়া ১৮ অক্টোবর ২০২৬-এ সংগৃহীত, লাইভ নয়।", "Weather captured 18 Oct 2026, not live."])}</small>
      </aside>
    </div></div>

    <div class="sh"><h2>${qe(["যা যা পাবেন", "What you can do"])}</h2></div>
    <div class="tiles">${tiles.map(([h, ic, ti, de]) => `<a class="tile" href="#${h}"><span class="ic"><svg class="i"><use href="#${ic}"/></svg></span><b>${qe(ti)}</b><span>${qe(de)}</span><span class="go">${qe(["খুলুন", "Open"])} <svg class="i"><use href="#i-arrow"/></svg></span></a>`).join("")}</div>

    <div class="sh"><h2>${qe(["কীভাবে কাজ করে", "How it works"])}</h2></div>
    <div class="steps">
      <div class="step"><i>${nf(1)}</i><b>${qe(["সমস্যাটা জানান", "Describe the problem"])}</b><span class="muted">${qe(["আক্রান্ত পাতার ছবি তুলুন, বাংলায় বলুন বা লিখুন।", "Photograph the leaf, speak in Bangla or type."])}</span></div>
      <div class="step"><i>${nf(2)}</i><b>${qe(["AI ও জ্ঞানভান্ডার মিলিয়ে দেখে", "AI checks it against the knowledge base"])}</b><span class="muted">${qe(["Gemini ও কৃষি জ্ঞানভান্ডার থেকে রোগ ও সমাধান বের করে।", "Gemini and a curated crop knowledge base find the disease and remedy."])}</span></div>
      <div class="step"><i>${nf(3)}</i><b>${qe(["সমাধান ও সতর্কতা পান", "Get a remedy and area alerts"])}</b><span class="muted">${qe(["জৈব ও রাসায়নিক সমাধান। একই রোগ ছড়ালে এলাকার সবাই জানতে পারে।", "Organic and chemical options. If the disease spreads, nearby farmers are warned."])}</span></div>
    </div>

    <div class="sh"></div>
    <div class="split"><div class="ph" role="img" aria-label=""></div><div class="tx">
      <h2>${qe(["সবার হাতে স্মার্টফোন না থাকলেও", "Even without a smartphone in every hand"])}</h2>
      <p class="muted">${qe(["গ্রামের সারের দোকানদার বা ডিজিটাল সেন্টারের উদ্যোক্তা এজেন্ট হয়ে কৃষকের পক্ষে ছবি তুলে সমাধান দেন। বাটন ফোনের কৃষক USSD বা ভয়েস কলে একই উত্তর পান।", "Fertiliser-shop owners and digital-centre entrepreneurs act as agents: they photograph the leaf for the farmer and explain the remedy. Button-phone farmers get the same answers by USSD or a voice call."])}</p>
      <div class="row"><a class="btn" href="#agent">${qe(["এজেন্ট ডেস্ক", "Agent desk"])}</a><a class="btn alt" href="#channels">${qe(["ফোন ও SMS", "Phone and SMS"])}</a></div>
    </div></div>

    <div class="band"><div class="in">
      <span class="name">${qe(["আমরাই গড়ব বাংলাদেশ", "Amrai Gorbo Bangladesh"])}</span>
      <h2>${qe(["কৃষকের আরেকটা আবহাওয়া অ্যাপ দরকার নেই।", "Farmers don't need another weather app."])}</h2>
      <p>${qe(["দরকার এমন এআই, যা জলবায়ুর অনিশ্চয়তাকে লাভজনক পদক্ষেপে বদলে দেয়।", "They need an AI that turns climate uncertainty into profitable action."])}</p>
      <div class="row"><a class="btn cta" href="#about">${qe(["আমাদের লক্ষ্য", "Our mission"])}</a><a class="btn onph" href="#roadmap">${qe(["রোডম্যাপ", "Roadmap"])}</a></div>
    </div></div>`;
  tickClock();
}
function tickClock() {
  const el = $("#clk"); if (!el) return;
  const lc = lang === "bn" ? "bn-BD" : "en-GB", n = new Date();
  el.textContent = n.toLocaleTimeString(lc, { timeZone: "Asia/Dhaka", hour12: false }) + " · " + n.toLocaleDateString(lc, { timeZone: "Asia/Dhaka", weekday: "short", day: "numeric", month: "short" });
}
setInterval(tickClock, 1000);

/* ---- weather */
let WSEL = store.get("ap_wsel", 1);
function renderWeather() {
  const w = WX[WSEL], lc = lang === "bn" ? "bn-BD" : "en-GB", ds = w[3];
  const base = new Date(2026, 9, 18);
  const day = i => new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
  const hot = ds.slice(0, 5).filter(d => Cc(d[0]) >= 32).length >= 3;
  const wet = ds.findIndex(d => d[2] >= 50);
  const adv = [];
  if (hot) adv.push([["💧 তাপ বেশি, বৃষ্টি নেই: ভোর ৫–৮টায় সেচ দিন।", "💧 Hot and dry: irrigate at 5–8 AM."], ["সকালের সেচে পানির অপচয় কম হয়।", "Morning irrigation wastes less water."]]);
  if (wet >= 0) { const wd = day(wet).toLocaleDateString(lc, { day: "numeric", month: "long" }); adv.push([["🧪 " + wd + " নাগাদ বৃষ্টির সম্ভাবনা, ইউরিয়া পিছিয়ে দিন।", "🧪 Rain likely around " + wd + ": delay urea."], ["পানি নিষ্কাশনের প্রস্তুতি নিন।", "Prepare field drainage."]]); }
  if (!adv.length) adv.push([["✅ আগামী ৭ দিন উল্লেখযোগ্য ঝুঁকি নেই।", "✅ No major risk in the next 7 days."], ["নিয়মিত জমি পর্যবেক্ষণ করুন।", "Keep scouting the field."]]);
  $("#v-weather").innerHTML = pgHead("B", ["আবহাওয়া ও কৃষি পরামর্শ", "Weather and farm advice"], ["বিভাগ বেছে নিয়ে ৮ দিনের পূর্বাভাস ও সেচ-সারের পরামর্শ দেখুন।", "Pick a division for its 8-day forecast and irrigation and fertiliser advice."]) + `
    <div class="chipsx" id="wchips">${WX.map((x, i) => `<button type="button" aria-pressed="${i === WSEL}" data-w="${i}">${qe(x[0])}</button>`).join("")}</div>
    <div class="wxgrid">
      <div class="stack">${cardH(["এখন", "Now"], `<div class="wcur"><span class="t">${nf(Cc(w[1]))}°C</span><div><b style="font-size:19px">${qe(w[0])}</b><div class="muted">${qe(w[2] ? ["প্রায় রৌদ্রোজ্জ্বল", "Mostly sunny"] : ["রৌদ্রোজ্জ্বল", "Sunny"])}</div></div></div>`)}
      ${cardH(["কৃষকের জন্য পরামর্শ", "Farm advice"], adv.map((r, i) => `<div class="rec"><i>${nf(i + 1)}</i><div>${qe(r[0])}<small>${qe(r[1])}</small></div></div>`).join("") + `<p class="muted small">${qe(["পূর্বাভাস ১৮ অক্টোবর ২০২৬-এ সংগৃহীত, লাইভ নয়। নতুন করে প্রকাশ না করলে আপডেট হয় না।", "Forecast captured on 18 Oct 2026, not live. It updates only when the page is republished."])}</p>`)}</div>
      ${cardH(["৮ দিনের পূর্বাভাস", "8-day forecast"], `<div class="dys">${ds.map((d, i) => `<div class="dy"><small>${day(i).toLocaleDateString(lc, { weekday: "short" })}<br>${day(i).toLocaleDateString(lc, { day: "numeric" })}</small><span class="e">${d[2] >= 40 ? "🌧️" : d[2] >= 15 ? "⛅" : "☀️"}</span><b>${nf(Cc(d[0]))}°</b><small>${nf(Cc(d[1]))}°</small><small>💧${nf(d[2])}%</small></div>`).join("")}</div>`)}
    </div>`;
  $$("#wchips button").forEach(b => b.onclick = () => { WSEL = +b.dataset.w; store.set("ap_wsel", WSEL); renderWeather(); });
}

/* ---- crops */
let cropQ = "";
const kbCrop = en => /rice/i.test(en) ? "Rice" : /Brinjal/i.test(en) ? "Brinjal (eggplant)" : en;
function renderCrops() {
  const items = CROPS.map((c, i) => ({ c, i })).filter(({ c }) => !cropQ || (q(c[0]) + " " + c[0][0] + " " + c[0][1]).toLowerCase().includes(cropQ.toLowerCase()));
  $("#v-crops").innerHTML = pgHead("A", ["ফসলের তথ্য", "Crop guide"], ["১২টি প্রধান ফসলের মৌসুম, ফলন, পানি, রোগ-পোকা, দমন ও জাত।", "Season, yield, water, pests, control and varieties for 12 major crops."]) + `
    <div class="find"><input type="text" id="cropQ" value="${esc(cropQ)}" placeholder="${esc(q(["ফসল খুঁজুন…", "Search a crop…"]))}" aria-label="${esc(q(["ফসল খুঁজুন", "Search a crop"]))}"></div>
    <div class="cropgrid">${items.map(({ c, i }) => {
      const kbs = KB.filter(d => d.crop.en === kbCrop(c[0][1]) && d.id !== "healthy");
      return `<details class="crop"><summary><span class="em">${c[1]}</span><span>${qe(c[0])}<small>${qe(c[2])}</small></span></summary><div class="bd">
        ${kvH([[["মৌসুম", "Season"], c[2]], [["সময়কাল (দিন)", "Duration (days)"], c[3]], [["ফলন (t/ha)", "Yield (t/ha)"], c[4]], [["পানি", "Water"], c[5]], [["মূল ঝুঁকি", "Main risks"], c[6]]].concat(CX[i]))}
        ${kbs.length ? `<div><b class="small">${qe(["এই ফসলে নির্ণয় করুন", "Diagnose for this crop"])}</b><div class="chips" style="margin-top:6px">${kbs.map(d => `<button type="button" class="chip" data-kb="${d.id}">${esc(L(d.name))}</button>`).join("")}</div></div>` : ""}
      </div></details>`;
    }).join("") || `<p class="muted">${qe(["কোনো ফসল পাওয়া যায়নি।", "No crop found."])}</p>`}</div>
    <p class="muted small" style="margin-top:16px">${qe(["তথ্য আনুমানিক। স্থানীয় কৃষি কর্মকর্তার পরামর্শ নিন। কীটনাশক সবসময় লেবেল ও কৃষি কর্মকর্তার পরামর্শ মেনে ব্যবহার করুন।", "Indicative figures. Confirm with a local agronomist. Always follow pesticide labels and DAE advice."])}</p>`;
  const inp = $("#cropQ");
  inp.oninput = () => { cropQ = inp.value; const pos = inp.selectionStart; renderCrops(); const n = $("#cropQ"); n.focus(); n.setSelectionRange(pos, pos); };
  $$("#v-crops [data-kb]").forEach(b => b.onclick = () => { const d = kbById(b.dataset.kb); $("#q").value = L(d.name); go("diagnose"); });
}

/* ---- help */
let DSEL = store.get("ap_dsel", "Dhaka");
const offRow = en => {
  const o = OFF[en];
  if (!o) return [["উপপরিচালক", "Deputy Director"], [["নাম-নম্বর অফিসিয়াল সাইটে দেখুন", "See the official site for name and number"]]];
  const p = o.split("|");
  const note = p[2] === "1" ? ["২০২১ সালের সরকারি তালিকা, বদলে থাকতে পারে", "From a 2021 government list; may have changed"] : ["জেলার সরকারি সাইট থেকে", "From the district's official site"];
  return [["উপপরিচালক (DD)", "Deputy Director"], `${esc(p[0])} <a href="tel:${esc(p[1])}">${esc(p[1])}</a><br><small class="muted">${qe(note)}</small>`, 1];
};
function renderHelp() {
  let cur = null;
  const opts = DV.map(d => `<optgroup label="${qe(d[0])}">${d[1].split(";").map(s => { const p = s.split(":"); if (p[0] === DSEL) cur = p; return `<option value="${esc(p[0])}"${p[0] === DSEL ? " selected" : ""}>${esc(lang === "bn" ? p[1] : p[0])}</option>`; }).join("")}</optgroup>`).join("");
  if (!cur) { DSEL = "Dhaka"; cur = ["Dhaka", "ঢাকা"]; }
  const en = cur[0], nm = lang === "bn" ? cur[1] : cur[0], E = encodeURIComponent;
  const ofr = offRow(en);
  const rows = [[["জেলা", "District"], nm], [["অফিস", "Office"], ["জেলা কৃষি সম্প্রসারণ অফিস (উপপরিচালক)", "District DAE office (Deputy Director)"]], ofr.length === 3 ? ofr : [ofr[0], ofr[1][0]], [["মাঠ পর্যায়", "Field level"], ["উপজেলা কৃষি অফিস; প্রতি ইউনিয়নে ৩ জন উপ-সহকারী কৃষি কর্মকর্তা", "Upazila agriculture office; 3 sub-assistant agriculture officers per union"]], [["বীজ কোথায় পাবেন", "Where to get seed"], ["BADC বীজ ডিলার ও নিবন্ধিত ডিলার; উপজেলা কৃষি অফিসে জানুন", "BADC and registered seed dealers; ask the upazila agriculture office"]]];
  $("#v-help").innerHTML = pgHead("C", ["সহায়তা ও যোগাযোগ", "Help and contacts"], ["জেলা কৃষি অফিস, জাতীয় হেল্পলাইন ও গবেষণা প্রতিষ্ঠান।", "District agriculture offices, national helplines and research institutes."]) + `
    <div class="helpgrid"><div class="stack">
      ${cardH(["📍 জেলা বেছে নিন (৬৪ জেলা)", "📍 Choose a district (64)"], `<select id="dsel" aria-label="District">${opts}</select>${kvH(rows.map(r => r[2] ? [r[0], r[1], 1] : r), true)}
        <div class="btns"><a href="https://www.google.com/maps/search/?api=1&query=${E("District Agriculture Extension Office " + en)}" target="_blank" rel="noopener">🗺️ ${qe(["মানচিত্রে অফিস", "Office on map"])}</a><a href="https://www.google.com/search?q=${E("Department of Agricultural Extension " + en + " Deputy Director dae.gov.bd")}" target="_blank" rel="noopener">🔎 ${qe(["কর্মকর্তার নাম ও মোবাইল", "Officer name and mobile"])}</a></div>
        <p class="muted small">${qe(["কর্মকর্তাদের নাম ও নম্বর বদলির সাথে বদলায়। সর্বশেষ নম্বর জেলার সরকারি পাতায় দেখুন।", "Officers' names and numbers change with transfers. Check the district's official page for the latest."])}</p>`)}
      ${cardH(["🏛️ প্রধান কৃষি প্রতিষ্ঠান", "🏛️ Major agriculture institutions"], INST.map(x => `<div class="rec"><div><b>${qe(x[0])}</b><small>${esc(q(x[1].split("|")))}</small><a href="https://${esc(x[2])}" target="_blank" rel="noopener">${esc(x[2])}</a></div></div>`).join(""))}
    </div><div class="stack">
      ${cardH(["☎️ জাতীয় সহায়তা", "☎️ National help"], kvH([[["কৃষি কল সেন্টার", "Krishi Call Center"], `<a class="hl" href="tel:16123">16123</a>`, 1], [["সময়", "Hours"], ["সকাল ৯টা–বিকাল ৫টা (শুক্রবার ও সরকারি ছুটি বাদে)", "9 am to 5 pm (not Fridays or public holidays)"]], [["কৃষক বন্ধু সেবা", "Krishak Bandhu Seva"], `<a class="hl" href="tel:3331">3331</a>`, 1]], true) + `<p class="muted small">${qe(["ফসলের রোগ, কীটনাশক, সার ও আবহাওয়া নিয়ে সরাসরি বিশেষজ্ঞের পরামর্শ।", "Direct expert advice on crop disease, pesticide, fertiliser and weather."])}</p>`)}
      ${cardH(["🎬 কৃষি ভিডিও", "🎬 Agriculture videos"], `<div class="btns">${VID.map(v => `<a href="https://www.youtube.com/results?search_query=${E(v[2])}" target="_blank" rel="noopener">▶ ${esc(q(v))}</a>`).join("")}</div>`)}
    </div></div>`;
  $("#dsel").onchange = e => { DSEL = e.target.value; store.set("ap_dsel", DSEL); renderHelp(); };
}

/* ---- more */
function renderMore() {
  const items = [
    ["market", "i-store", ["ফসল থেকে বাজার", "Field to market"], ["ক্ষতি, সেরা বাজার, সংগ্রহ কেন্দ্র ও ক্রেতা মিল।", "Loss, best market, collection points and buyer matching."]],
    ["pitch", "i-chart", ["উপস্থাপনা ও মানদণ্ড", "Pitch & criteria"], ["ডেমো ভিডিও ও বিচারক মানদণ্ড।", "Demo video and judging criteria."]],
    ["insights", "i-chart", ["খামার ইনসাইট", "Farm insights"], ["নমুনা খামারের ঝুঁকি, সুপারিশ ও বাংলা সহকারী।", "Sample farm risk, recommendations and a Bangla assistant."]],
    ["loss", "i-leaf", ["মাঠে ক্ষতি কমানো", "Field-level loss reduction"], ["ভিশন মডেল, সতর্কতা ও স্থানীয় ভাষার UX।", "Vision models, alerts and local-language UX."]],
    ["agent", "i-store", ["এজেন্ট ডেস্ক", "Agent desk"], ["কৃষকের পক্ষে সেবা দিয়ে খাতায় লিখে রাখুন।", "Serve farmers and keep a ledger."]],
    ["channels", "i-phone", ["ফোন ও SMS", "Phone and SMS"], ["USSD, ভয়েস কল ও SMS সিমুলেটর।", "USSD, voice call and SMS simulators."]],
    ["roadmap", "i-road", ["রোডম্যাপ", "Roadmap"], ["ছোট শুরু, প্রভাব প্রমাণ, তারপর বিস্তার।", "Start narrow, prove impact, then scale."]],
    ["business", "i-coin", ["ব্যবসা মডেল", "Business model"], ["কৃষকের জন্য বিনামূল্যে, বুদ্ধিমত্তার জন্য পেইড।", "Free for farmers, paid intelligence."]],
    ["about", "i-info", ["প্রজেক্ট ও লক্ষ্য", "Project and mission"], ["আর্কিটেকচার, চালানোর নিয়ম ও আমাদের লক্ষ্য।", "Architecture, how to run, and our mission."]]
  ];
  $("#v-more").innerHTML = pgHead("C", ["আরও", "More"], ["অ্যাপের বাকি সব অংশ।", "The rest of the app."]) + `<div class="tiles">${items.map(([h, ic, ti, de]) => `<a class="tile" href="#${h}"><span class="ic"><svg class="i"><use href="#${ic}"/></svg></span><b>${qe(ti)}</b><span>${qe(de)}</span><span class="go">${qe(["খুলুন", "Open"])} <svg class="i"><use href="#i-arrow"/></svg></span></a>`).join("")}</div>`;
}

/* ---- farm insights (sample) */
let chatLog = [];
function botAnswer(text) {
  const h = retrieve(text);
  if (h.length) { const d = h[0][1]; return `${L(d.name)}\n\n🔎 ${L(d.symptoms)}\n🌿 ${L(d.organic)}`; }
  return q(["এই প্রশ্নের জন্য আমার জ্ঞানভান্ডারে নির্দিষ্ট উত্তর নেই। রোগ নির্ণয় পাতায় ছবি দিন, অথবা কৃষি কল সেন্টারে ১৬১২৩ নম্বরে ফোন করুন।", "I have no specific answer for that in my knowledge base. Add a photo on the Diagnose page or call the Krishi Call Center on 16123."]);
}
function renderInsights() {
  const demoQ = q(["আগামী ৭ দিনে আমার ধানের কী সমস্যা হতে পারে?", "What problems might my rice face in the next 7 days?"]);
  const demoA = q(["আগামী ৭ দিনে তাপমাত্রা বেশি থাকার কারণে পানির ঘাটতির ঝুঁকি আছে।\n\n💧 ২১ অক্টোবর সকালে সেচ দিন।\n🧪 আজ ইউরিয়া প্রয়োগ না করাই ভালো।\n🔎 ২৩ অক্টোবর পাতায় দাগ বা শুকিয়ে যাওয়া আছে কি না দেখুন।", "Higher temperatures bring a risk of water stress over the next 7 days.\n\n💧 Irrigate on the morning of 21 Oct.\n🧪 Better not to apply urea today.\n🔎 Check leaves for spots or drying on 23 Oct."]);
  $("#v-insights").innerHTML = pgHead("A", ["খামার ইনসাইট", "Farm insights"], ["একটি নমুনা খামার দিয়ে দেখানো হলো কৃষিবন্ধু কীভাবে ঝুঁকি থেকে পদক্ষেপে যায়। সব সংখ্যা উদাহরণ।", "A sample farm showing how KrishiBondhu moves from risk to action. All figures are examples."]) + `
    <div class="grid2">
      <div class="stack">
        ${cardH(["খামার প্রোফাইল (নমুনা)", "Farm profile (sample)"], kvH([[["অবস্থান", "Location"], ["ময়মনসিংহ", "Mymensingh"]], [["ফসল", "Crop"], ["বোরো ধান", "Boro rice"]], [["জাত", "Variety"], "BRRI dhan-89"], [["রোপণ", "Planted"], ["০২ অক্টোবর", "02 Oct"]], [["আয়তন", "Size"], ["১.২ হেক্টর", "1.2 ha"]], [["সেচ", "Irrigation"], ["আছে", "Available"]], [["মাটি", "Soil"], ["দোআঁশ", "Loam"]]]))}
        ${cardH(["আজকের সুপারিশ (নমুনা)", "Today's recommendation (sample)"], [[["আগামীকাল ভোর ৫–৮টায় সেচ দিন", "Irrigate tomorrow, 5–8 AM"], ["ফলনে সুবিধা: +৮–১২%", "Expected yield benefit: +8–12%"]], [["ইউরিয়া প্রয়োগ পিছিয়ে দিন", "Delay urea application"], ["বৃষ্টির আগে সার নষ্ট এড়ান", "Avoid nutrient loss before rainfall"]], [["২৩ অক্টোবর পাতা দেখুন", "Inspect leaves on 23 Oct"], ["রোগের অনুকূল পরিবেশ বাড়তে পারে", "Disease-friendly conditions may rise"]]].map((r, i) => `<div class="rec"><i>${nf(i + 1)}</i><div>${qe(r[0])}<small>${qe(r[1])}</small></div></div>`).join("") + kvH([[["খরচ", "Action cost"], "৳1,200 / ha"], [["অতিরিক্ত ফলন", "Expected yield"], "+0.4 t / ha"], [["অতিরিক্ত আয়", "Added revenue"], "৳8,400 / ha"]]))}
      </div>
      <div class="stack">
        ${cardH(["খামার ড্যাশবোর্ড (নমুনা)", "Farm dashboard (sample)"], `<div class="k2"><div><small>${qe(["সহনশীলতা স্কোর", "Resilience score"])}</small><b>${nf(72)} / ${nf(100)}</b></div><div><small>${qe(["প্রত্যাশিত ফলন", "Expected yield"])}</small><b>4.4 t/ha</b></div><div><small>${qe(["৭ দিনের বৃষ্টি", "7-day rain"])}</small><b>18 mm</b></div><div class="w"><small>${qe(["প্রধান ঝুঁকি", "Main risk"])}</small><b>${qe(["তাপ + পানির ঘাটতি", "Heat + water stress"])}</b></div></div>
          <ul class="tl"><li>${qe(["আজ: স্বাভাবিক", "Today: normal"])}</li><li class="o">${qe(["২১ অক্টো: পানির চাপ বাড়ছে", "21 Oct: water stress rising"])}</li><li class="o">${qe(["২৩ অক্টো: তাপের চূড়া", "23 Oct: heat stress peak"])}</li><li>${qe(["২৫ অক্টো: বৃষ্টিতে ঝুঁকি কমবে", "25 Oct: rain eases the risk"])}</li></ul>`)}
        ${cardH(["বাংলা সহকারী", "Bangla assistant"], `<div class="chat" id="chat"><div class="bub f">${esc(demoQ)}</div><div class="bub a">${esc(demoA)}</div>${chatLog.map(m => `<div class="bub ${m[0]}">${esc(m[1])}</div>`).join("")}</div>
          <form class="chatin" id="chatForm"><input type="text" id="chatQ" aria-label="${esc(q(["প্রশ্ন", "Question"]))}" placeholder="${esc(q(["যেমন: ধানে ব্লাস্ট হলে কী করব?", "e.g. What if my rice has blast?"]))}"><button class="btn sm" type="submit">${qe(["জিজ্ঞাসা", "Ask"])}</button></form>
          <p class="muted small">${qe(["উত্তর আমাদের কৃষি জ্ঞানভান্ডার থেকে আসে।", "Answers come from our crop knowledge base."])}</p>`)}
      </div>
    </div>`;
  $("#chatForm").onsubmit = e => { e.preventDefault(); const v = $("#chatQ").value.trim(); if (!v) return; chatLog.push(["f", v], ["a", botAnswer(v)]); chatLog = chatLog.slice(-8); renderInsights(); $("#chatQ").focus(); };
}

/* ---- loss reduction at the field level */
function renderLoss() {
  const st = (k, x) => `<li><span class="st ${k}">${t("st_" + k)}</span><span>${qe(x)}</span></li>`;
  const tier = (title, items) => `<div class="card tier"><h2>${qe(title)}</h2><ul>${items.map(i => st(i[0], i[1])).join("")}</ul></div>`;
  const prompts = [
    ["PlantVillage ডেটাসেটে প্রশিক্ষিত একটি বিশেষায়িত ভিশন ট্রান্সফরমার (ViT) মডেল তৈরি করুন, যা কন্দ ফসলে ব্লাইটের প্রাথমিক ধাপ শনাক্ত করবে।", "Develop a specialized vision transformer (ViT) model trained on the PlantVillage dataset to detect early-stage blight in tubers."],
    ["একটি ফেডারেটেড লার্নিং কাঠামো তৈরি করুন, যাতে স্থানীয় মডেল কৃষকের অবস্থানের সংবেদনশীল তথ্য প্রকাশ না করেই নতুন আঞ্চলিক পোকা সম্পর্কে শিখতে পারে।", "Create a federated learning framework that allows localized models to learn from new regional pests without exposing sensitive farmer location data."],
    ["Sentinel-2 স্যাটেলাইট ছবির সাথে মাঠের ছবি মিলিয়ে 'হট জোন' চিহ্নিত করুন, যেখানে আর্দ্রতা ও তাপমাত্রা ছত্রাকের বৃদ্ধির অনুকূল।", "Integrate Sentinel-2 satellite imagery with ground-level photos to identify 'hot zones' where humidity and temperature favor fungal growth."],
    ["একটি বহুভাষিক LLM এজেন্ট তৈরি করুন, যা জটিল উদ্ভিদ-রোগের রিপোর্টকে অ-কারিগরি কৃষকের জন্য সহজ ও করণীয়-ভিত্তিক পরামর্শে বদলে দেবে।", "Build a multilingual LLM agent that translates complex botanical diagnostic reports into simplified, actionable advice for non-technical farmers."],
    ["কম ব্যান্ডউইথের জন্য একটি সিঙ্ক প্রোটোকল ডিজাইন করুন, যা রোগের সিগনেচার ডিভাইসে ক্যাশ করে রাখবে, যাতে প্রত্যন্ত কৃষি এলাকায় অফলাইনে রোগ চেনা যায়।", "Design a low-bandwidth synchronization protocol that caches disease signatures on-device for offline identification in remote agricultural zones."]
  ];
  const sources = [
    ["PlantVillage Dataset", ["সুস্থ ও রোগাক্রান্ত ফসলের পাতার উচ্চমানের লেবেলযুক্ত ছবি, মডেল প্রশিক্ষণের জন্য।", "High-quality labeled images of healthy and diseased crop leaves for model training."]],
    ["Sentinel-2 Hub", ["মাঠ পর্যায়ে গাছের স্বাস্থ্য পর্যবেক্ষণের জন্য উন্মুক্ত মাল্টিস্পেকট্রাল স্যাটেলাইট ছবি।", "Open-access multispectral satellite imagery for monitoring field-level vegetation health."]],
    ["Global Biodiversity Information Facility (GBIF)", ["পোকা ও আগ্রাসী উদ্ভিদ প্রজাতির উপস্থিতির সমৃদ্ধ স্থানিক তথ্য।", "Rich spatial data on the occurrence of pests and invasive plant species."]],
    ["NASA POWER API", ["রোগের অনুকূল পরিবেশ পূর্বাভাসের জন্য সৌর ও আবহাওয়ার রিয়েল-টাইম তথ্য।", "Real-time solar and meteorological data used to predict environmental conditions conducive to disease."]],
    ["FAO EMPRES-i", ["সীমান্তপারের উদ্ভিদ-পোকা ও বৈশ্বিক রোগ ট্র্যাকিংয়ের অনুসন্ধানমূলক তথ্য ও আর্কাইভ।", "Investigative data on transboundary plant pests and global disease tracking archives."]]
  ];
  const examples = [
    ["Plantix", ["ছবি শনাক্তকরণ দিয়ে গাছের রোগ নির্ণয় ও চিকিৎসার পরামর্শ দেওয়া জনপ্রিয় মোবাইল অ্যাপ।", "A popular mobile app that uses image recognition to diagnose plant diseases and suggest treatments."]],
    ["Blue River Technology", ["নির্ভুল কৃষির জন্য 'See & Spray' কম্পিউটার ভিশন প্রযুক্তির পথিকৃৎ।", "Pioneers in 'See & Spray' computer vision technology for precision agriculture."]],
    ["Prospera", ["বিভিন্ন সেন্সরের তথ্য বিশ্লেষণ করে ফসলের স্বাস্থ্য ও ফলন বাড়ানোর এআই প্ল্যাটফর্ম।", "An AI platform that analyzes data from various sensors to optimize crop health and yield."]],
    ["AeroFarms", ["উচ্চপ্রযুক্তির ভার্টিক্যাল ফার্মে গাছের স্বাস্থ্য পর্যবেক্ষণে ভিশন সিস্টেম ব্যবহার করে।", "Utilizing vision systems to monitor plant health in high-tech vertical farming environments."]],
    ["NatureDots", ["জলাশয়ের ডিজিটাল টুইন তৈরি করে জলজ চাষের স্বাস্থ্য ও ঝুঁকি ব্যবস্থাপনার প্ল্যাটফর্ম।", "A platform building digital twins of water bodies to manage health and risks for aquaculture."]]
  ];
  $("#v-loss").innerHTML = pgHead("A", ["মাঠ পর্যায়ে ক্ষতি কমানো", "Loss reduction at the field level"], ["ভিশন মডেল + সতর্কতা + স্থানীয় ভাষার UX। কোনটা এখন আছে আর কোনটা পরিকল্পনায়, স্পষ্ট দেখানো হলো।", "Vision models + alerts + local-language UX. What exists today and what is planned is marked clearly."]) + `
    <div class="sh"><h2>${qe(["বিস্তারিত", "Details"])}</h2></div>
    <div class="tiers">
      ${tier(["ভিশন মডেল", "Vision models"], [
        ["now", ["ছবি থেকে রোগ নির্ণয় (Gemini ও কৃষি জ্ঞানভান্ডার)", "Photo diagnosis (Gemini and a crop knowledge base)"]],
        ["plan", ["YOLOv8-seg / MobileNetV3 ফাইন-টিউনিং", "YOLOv8-seg / MobileNetV3 fine-tuning"]],
        ["plan", ["PlantVillage-এ প্রশিক্ষিত ViT, আলুর ব্লাইটের প্রাথমিক ধাপের জন্য", "ViT trained on PlantVillage for early-stage potato blight"]],
        ["plan", ["ফেডারেটেড লার্নিং, কৃষকের অবস্থান গোপন রেখে", "Federated learning that keeps farmer locations private"]]
      ])}
      ${tier(["সতর্কতা", "Alerts"], [
        ["now", ["এলাকাভিত্তিক মহামারী সতর্কতা (৫ কিমি, ৩টির বেশি খামার)", "Area-based outbreak alerts (5 km, more than 3 farms)"]],
        ["plan", ["Sentinel-2 ও মাঠের ছবি মিলিয়ে হট জোন", "Hot zones from Sentinel-2 plus ground photos"]],
        ["plan", ["NASA POWER দিয়ে আবহাওয়া-ঝুঁকি পূর্বাভাস", "Weather-risk forecast using NASA POWER"]],
        ["plan", ["আসল SMS গেটওয়ে", "Real SMS gateway"]]
      ])}
      ${tier(["স্থানীয় ভাষার UX", "Local-language UX"], [
        ["now", ["বাংলা ভয়েস, লেখা ও ছবির ইনপুট", "Bangla voice, text and photo input"]],
        ["now", ["বাটন ফোনের জন্য USSD ও ভয়েস কল", "USSD and voice call for button phones"]],
        ["now", ["অফলাইন ক্যাশ (PWA)", "Offline cache (PWA)"]],
        ["plan", ["জটিল রিপোর্ট সহজ বাংলা পরামর্শে বদলানো (বহুভাষিক LLM এজেন্ট)", "Multilingual LLM agent that turns complex reports into simple advice"]],
        ["plan", ["ডিভাইসে রোগের সিগনেচার ক্যাশ, কম ব্যান্ডউইথ সিঙ্ক", "On-device disease-signature cache with low-bandwidth sync"]]
      ])}
    </div>

    <div class="sh"><h2>${qe(["উদাহরণ প্রম্পট", "Example prompts"])}</h2></div>
    <div class="card stack">${prompts.map((r, i) => `<div class="rec"><i>${nf(i + 1)}</i><div>${qe(r)}</div></div>`).join("")}</div>

    <div class="sh"><h2>${qe(["ডেটা সোর্স", "Data sources"])}</h2><p>${qe(["এগুলো পরিকল্পিত সোর্স। বর্তমান অ্যাপ Gemini ও নিজস্ব জ্ঞানভান্ডার ব্যবহার করে।", "These are planned sources. The current app uses Gemini and its own knowledge base."])}</p></div>
    <div class="card stack">${kvH(sources)}</div>

    <div class="sh"><h2>${qe(["উদাহরণ", "Examples"])}</h2><p>${qe(["তুলনার জন্য রেফারেন্স পণ্য। এরা কৃষিবন্ধু-এর অংশীদার নয়।", "Reference products for comparison. They are not KrishiBondhu partners."])}</p></div>
    <div class="card stack">${kvH(examples)}</div>`;
}

/* ---- roadmap + business */
function renderRoadmap() {
  const li = a => `<ul>${a.map(x => `<li>${qe(x)}</li>`).join("")}</ul>`;
  const st = (k, x) => `<li><span class="st ${k}">${t("st_" + k)}</span> ${qe(x)}</li>`;
  $("#v-roadmap").innerHTML = pgHead("B", ["বিল্ড রোডম্যাপ", "Build roadmap"], ["ছোট শুরু। প্রভাব প্রমাণ। বিশ্বজুড়ে বিস্তার।", "Start narrow. Prove impact. Scale globally."]) + `
    <div class="phases">
      <div class="phase"><small>${qe(["ধাপ ১: MVP", "PHASE 1: MVP"])}</small><h3>${qe(["বাংলাদেশে ধান", "Rice in Bangladesh"])}</h3><ul style="list-style:none;padding:0">
        ${st("now", ["ছবি, কণ্ঠ ও লেখা থেকে রোগ নির্ণয়", "Diagnosis from photo, voice and text"])}
        ${st("now", ["এলাকাভিত্তিক মহামারী সতর্কতা", "Area-based outbreak alerts"])}
        ${st("now", ["বাংলা সহকারী (জ্ঞানভান্ডারভিত্তিক)", "Bangla assistant (knowledge-base driven)"])}
        ${st("plan", ["আবহাওয়া ঝুঁকি (লাইভ ডেটা)", "Weather risk (live data)"])}
        ${st("plan", ["স্যাটেলাইট স্বাস্থ্য ও ফলন পূর্বাভাস", "Satellite health and yield forecast"])}</ul></div>
      <div class="phase"><small>${qe(["ধাপ ২: পাইলট", "PHASE 2: PILOT"])}</small><h3>${qe(["৫০০–১,০০০ খামার", "500–1,000 farms"])}</h3>${li([["ফলন", "Yield"], ["পানির ব্যবহার", "Water use"], ["উপকরণ খরচ", "Input cost"], ["কৃষকের আয়", "Farmer income"], ["কৃষিবিদ দ্বারা যাচাই", "Human agronomist validation"]])}</div>
      <div class="phase"><small>${qe(["ধাপ ৩: বিস্তার", "PHASE 3: SCALE"])}</small><h3>${qe(["একাধিক ফসল ও অঞ্চল", "Multiple crops and regions"])}</h3>${li([["এগ্রিবিজনেস", "Agribusiness"], ["ব্যাংক", "Banks"], ["বিমা কোম্পানি", "Insurers"], ["সরকার", "Government"]])}</div>
    </div>
    <div class="band" style="margin-top:28px"><div class="in"><h2>${qe(["জলবায়ু-সহনশীল কৃষি প্ল্যাটফর্ম", "A climate-resilient agriculture platform"])}</h2></div></div>`;
}
function renderBusiness() {
  const col = (ic, t1, items) => `<div class="card col"><h3>${ic} ${qe(t1)}</h3><ul>${items.map(x => `<li>${qe(x)}</li>`).join("")}</ul></div>`;
  $("#v-business").innerHTML = pgHead("C", ["ব্যবসা মডেল", "Business model"], ["কৃষকের জন্য বিনামূল্যে, বুদ্ধিমত্তার জন্য পেইড। (প্রস্তাবিত মডেল)", "Free farmer access, paid intelligence. (Proposed model)"]) + `
    <div class="biz">
      ${col("🌾", ["কৃষক", "Farmers"], [["বিনামূল্যে মৌলিক পরামর্শ", "Free basic advisory"], ["প্রিমিয়াম: ৳৯৯–১৯৯/মাস", "Premium: ৳99–199/month"], ["ভয়েস + উন্নত পূর্বাভাস", "Voice + advanced forecasts"], ["খামারের ইতিহাস", "Farm history"], ["বিস্তারিত সুপারিশ", "Detailed recommendations"]])}
      <div class="flow">→ ৳</div>
      ${col("🏢", ["এগ্রিবিজনেস", "Agribusiness"], [["B2B SaaS", "B2B SaaS"], ["হাজার হাজার খামার পর্যবেক্ষণ", "Monitor thousands of farms"], ["ফসলের ঝুঁকি বিশ্লেষণ", "Crop risk analytics"], ["চাহিদা পূর্বাভাস", "Demand forecasting"], ["মাঠ-পর্যায়ের তথ্য", "Field intelligence"]])}
      <div class="flow">→ ৳</div>
      ${col("🏦", ["ফাইন্যান্স / বিমা", "Finance / Insurance"], [["জলবায়ু-ঝুঁকি স্কোর", "Climate-risk scoring"], ["ফলন বুদ্ধিমত্তা", "Yield intelligence"], ["আগাম সতর্কতা", "Early-warning signals"], ["আন্ডাররাইটিং ও ঋণ ইনসাইট", "Potential underwriting and credit insights"]])}
    </div>`;
}

/* ---- about: mission + pledge (no payment details are collected) */
let pledgeAmt = 500;
function renderMission() {
  const saved = store.get("ap_pledge", null);
  $("#mission").innerHTML = `<div class="band" style="margin-top:0"><div class="in"><span class="name">${qe(["আমরাই গড়ব বাংলাদেশ", "Amrai Gorbo Bangladesh"])}</span><h2>${qe(["আসুন, একসাথে গড়ি", "Let's build it together"])}</h2><p>${qe(["আপনার সহায়তায় জলবায়ু-সহনশীল কৃষি ও গ্রামীণ উন্নয়ন।", "Your support powers climate-smart farming and rural growth."])}</p></div></div>
    <div class="card stack pledge"><h2>${qe(["সহায়তার প্রতিশ্রুতি", "Pledge your support"])}</h2>
      <div class="chips" id="pChips">${[100, 500, 1000, 5000].map(v => `<button type="button" class="chip" aria-pressed="${pledgeAmt === v}" data-a="${v}">৳${num(v)}</button>`).join("")}</div>
      <div class="row"><input type="text" id="pName" style="max-width:280px" aria-label="${esc(q(["আপনার নাম", "Your name"]))}" placeholder="${esc(q(["আপনার নাম (ঐচ্ছিক)", "Your name (optional)"]))}"><button class="btn" id="pGo" type="button">${qe(["প্রতিশ্রুতি লিখে রাখুন", "Record my pledge"])}</button></div>
      <p class="muted small">${qe(["এই পাতায় কোনো টাকা, পিন বা কার্ডের তথ্য নেওয়া হয় না। প্রতিশ্রুতি শুধু এই ডিভাইসে লেখা থাকে। সত্যিকারের সহায়তার জন্য প্রকল্পের অফিসিয়াল যোগাযোগ মাধ্যম ব্যবহার করুন।", "No money, PIN or card details are collected on this page. The pledge is only noted on this device. To support for real, use the project's official contact channels."])}</p>
      <div id="pOut" class="note" ${saved ? "" : "hidden"}>${saved ? esc(q(["ধন্যবাদ! আপনার ৳" + saved.a + " প্রতিশ্রুতি এই ডিভাইসে লেখা আছে।", "Thank you! Your ৳" + saved.a + " pledge is noted on this device."])) : ""}</div></div>`;
  $$("#pChips .chip").forEach(b => b.onclick = () => { pledgeAmt = +b.dataset.a; $$("#pChips .chip").forEach(x => x.setAttribute("aria-pressed", String(x === b))); });
  $("#pGo").onclick = () => { store.set("ap_pledge", { a: pledgeAmt, n: $("#pName").value.trim(), ts: Date.now() }); renderMission(); };
}
function renderFoot() {
  $("#foot").innerHTML = `<div><b>KrishiBondhu</b> · ${qe(["আমরাই গড়ব বাংলাদেশ", "Amrai Gorbo Bangladesh"])}</div><div>${qe(["পরামর্শ মাত্র। রাসায়নিক স্প্রের আগে উপজেলা কৃষি কর্মকর্তার পরামর্শ নিন। কৃষি কল সেন্টার: ১৬১২৩", "Guidance only. Confirm with your upazila agriculture officer before spraying. Krishi Call Center: 16123"])}</div>`;
}
function renderPages() {
  renderHome(); renderWeather(); window.APX && APX.render(); renderCrops(); renderHelp(); renderMore(); renderInsights(); renderLoss(); renderRoadmap(); renderBusiness(); renderMission(); renderFoot();
}

/* ---------------------------------------------------------------- auth (client-side demo) */
const DEMO = { name: "Demo Guest User", email: "judge@krishibondhu.app", pass: "DemoPass2026!" };
const normEmail = e => String(e || "").trim().toLowerCase();
const fnv = str => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16); };
async function hashPw(pw, salt) {
  const data = salt + "|" + pw;
  try {
    if (window.crypto && crypto.subtle) {
      const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveBits"]);
      const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: new TextEncoder().encode(salt), iterations: 100000, hash: "SHA-256" }, key, 256);
      return "p2:" + [...new Uint8Array(bits)].map(b => b.toString(16).padStart(2, "0")).join("");
    }
  } catch {}
  return "f1:" + fnv(data) + fnv(data.split("").reverse().join(""));
}
const newSalt = () => { try { return [...crypto.getRandomValues(new Uint8Array(12))].map(b => b.toString(16).padStart(2, "0")).join(""); } catch { return String(Date.now()) + Math.random().toString(16).slice(2); } };
const getUsers = () => store.get("ap_users", {});
async function ensureDemo() {
  const users = getUsers(), salt = "krishibondhu-demo";
  const hash = await hashPw(DEMO.pass, salt);
  if (!users[DEMO.email] || users[DEMO.email].hash !== hash) {
    users[DEMO.email] = { name: DEMO.name, email: DEMO.email, salt, hash, demo: true, created: users[DEMO.email]?.created || Date.now() };
    store.set("ap_users", users);
  }
}
const session = () => { const s = store.get("ap_session", null); return s && s.email && getUsers()[s.email] ? s : null; };
function showAuthErr(id, key, p) { const e = $(id); e.textContent = t(key, p); e.hidden = false; }
function enterApp(u) {
  store.set("ap_session", { email: u.email, name: u.name, ts: Date.now() });
  document.documentElement.classList.remove("locked");
  const c = $("#userChip"); c.textContent = u.name; c.title = u.email; c.hidden = false;
  $("#logoutBtn").hidden = false;
  $("#lPass").value = ""; $("#rPass").value = ""; $("#rPass2").value = "";
  renderStatic(); route();
}
function leaveApp() {
  try { localStorage.removeItem("ap_session"); } catch {}
  stopCam();
  document.documentElement.classList.add("locked");
  $("#userChip").hidden = true; $("#logoutBtn").hidden = true;
  $("#lErr").hidden = true; $("#rErr").hidden = true;
  authTab("login"); scrollTo(0, 0);
}
function authTab(which) {
  const login = which === "login";
  $("#loginForm").hidden = !login; $("#regForm").hidden = login;
  $("#tabLogin").setAttribute("aria-selected", String(login)); $("#tabReg").setAttribute("aria-selected", String(!login));
  setTimeout(() => $(login ? "#lEmail" : "#rName").focus(), 0);
}
let failN = 0, lockUntil = 0;
async function onLogin(e) {
  e.preventDefault(); $("#lErr").hidden = true;
  const left = Math.ceil((lockUntil - Date.now()) / 1000);
  if (left > 0) return showAuthErr("#lErr", "au_e_lock", { n: left });
  const email = normEmail($("#lEmail").value), pw = $("#lPass").value.trim();
  if (!email || !pw) return showAuthErr("#lErr", "au_e_empty");
  const u = getUsers()[email];
  const ok = u && (await hashPw(pw, u.salt)) === u.hash;
  if (!ok) { if (++failN >= 5) { failN = 0; lockUntil = Date.now() + 30000; return showAuthErr("#lErr", "au_e_lock", { n: 30 }); } return showAuthErr("#lErr", "au_e_bad"); }
  failN = 0; enterApp(u);
}
async function onRegister(e) {
  e.preventDefault(); $("#rErr").hidden = true;
  const name = $("#rName").value.trim(), email = normEmail($("#rEmail").value), p1 = $("#rPass").value, p2 = $("#rPass2").value;
  if (!name) return showAuthErr("#rErr", "au_e_name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showAuthErr("#rErr", "au_e_mail");
  if (p1.length < 8) return showAuthErr("#rErr", "au_e_short");
  if (p1 !== p2) return showAuthErr("#rErr", "au_e_match");
  const users = getUsers();
  if (users[email]) return showAuthErr("#rErr", "au_e_dup");
  const salt = newSalt();
  users[email] = { name, email, salt, hash: await hashPw(p1, salt), created: Date.now() };
  store.set("ap_users", users); enterApp(users[email]);
}
async function initAuth() {
  await ensureDemo();
  $("#loginForm").addEventListener("submit", onLogin);
  $("#regForm").addEventListener("submit", onRegister);
  $("#tabLogin").onclick = () => authTab("login"); $("#tabReg").onclick = () => authTab("register");
  $("#logoutBtn").onclick = leaveApp;
  $("#authLang").onclick = () => $("#langBtn").click();
  $("#authTheme").onclick = () => $("#themeBtn").click();
  $("#demoFill").onclick = () => { $("#lEmail").value = DEMO.email; $("#lPass").value = DEMO.pass; $("#lErr").hidden = true; $("#lGo").focus(); };
  $$("[data-showpw]").forEach(b => b.onclick = () => {
    const i = $("#" + b.dataset.showpw), show = i.type === "password"; i.type = show ? "text" : "password";
    b.textContent = t(show ? "au_hide" : "au_show");
  });
  const s = session();
  if (s) { const u = getUsers()[s.email]; const c = $("#userChip"); c.textContent = u.name; c.title = u.email; c.hidden = false; $("#logoutBtn").hidden = false; document.documentElement.classList.remove("locked"); }
  else { document.documentElement.classList.add("locked"); try { localStorage.removeItem("ap_session"); } catch {} }
}

function init() {
  const saved = store.get("ap_theme"); if (saved) setTheme(saved);
  $("#themeBtn").onclick = () => {
    const dark = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    const next = dark ? "light" : "dark"; window.APX ? APX.revealTheme(next) : setTheme(next); store.set("ap_theme", next);
  };
  $("#langBtn").onclick = () => { lang = lang === "bn" ? "en" : "bn"; store.set("ap_lang", lang); renderStatic(); };
  $("#dxForm").addEventListener("submit", onDiagnose);
  const scan = $("#scan");
  $("#imgIn").onchange = e => setFile(e.target.files[0]);
  ["dragover", "dragenter"].forEach(ev => scan.addEventListener(ev, e => { e.preventDefault(); scan.classList.add("drag"); }));
  ["dragleave", "drop"].forEach(ev => scan.addEventListener(ev, e => { e.preventDefault(); scan.classList.remove("drag"); }));
  scan.addEventListener("drop", e => { const f = e.dataTransfer.files[0]; if (f && f.type.startsWith("image/")) setFile(f); });
  scan.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); $("#imgIn").click(); } });
  $("#micBtn").onclick = onMic;
  $("#camBtn").onclick = openCam; $("#snapBtn").onclick = snapCam;
  $("#agentMode").checked = store.get("ap_agent", false);
  $("#agentFields").hidden = !$("#agentMode").checked;
  $("#agentMode").onchange = e => { $("#agentFields").hidden = !e.target.checked; store.set("ap_agent", e.target.checked); };
  $("#ussdSend").onclick = () => { const v = $("#ussdIn").value.trim(); if (v) ussdStep(v); };
  $("#ussdIn").onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); $("#ussdSend").click(); } };
  $("#ussdReset").onclick = () => { ussdPath = ""; ussdStep(null); };
  $("#ivrCall").onclick = ivrCall;
  $("#ivrScreen").textContent = "📞 " + "…";
  $("#smsNew").onclick = smsShow;
  $("#aCopy").onclick = async () => {
    const csv = "time,farmer,phone,disease,district\n" + ledger.map(l => [new Date(l.ts).toISOString(), l.farmer, l.phone, kbById(l.id).name.en, l.district].map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    try { await navigator.clipboard.writeText(csv); } catch {}
  };
  $("#apiUrl").value = store.get("ap_api", "");
  $("#apiSave").onclick = async () => { store.set("ap_api", $("#apiUrl").value.trim()); state.mapData = null; await detectApi(); };
  addEventListener("hashchange", route);
  renderStatic(); route(); smsShow();
  initAuth();
  $("#ivrScreen").textContent = "📞 " + t("c_ivr_hi");
  detectApi().then(() => { state.mapData = null; if (!$("#v-map").hidden) renderMap(); });
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
}
init();
})();

