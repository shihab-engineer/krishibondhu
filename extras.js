/* KrishiBondhu extras: night/day scenes, animated login, guided tour, Field-to-Market hub, Pitch page.
   Loaded BEFORE app.js; talks to the core through window.AP (a small bridge exposed by app.js). */
(() => {
  "use strict";
  const A = () => window.AP, ML = window.MarketLogic, D = window.AP_DATA;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const tx = v => A().qe(v), nf = n => A().nf(n), esc = s => A().esc(s);
  const lg = o => (A().lang === "bn" ? o.bn : o.en);
  const root = document.documentElement;
  const reduceM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const money = n => "৳" + nf(Math.round(n));

  /* ------------------------------------------------------------ night / day */
  const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  const syncNight = () => root.classList.toggle("night", isDark());
  function revealTheme(next) {
    const apply = () => A().setTheme(next);
    if (!document.startViewTransition || reduceM) return apply();
    const r = $("#themeBtn").getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(apply).ready.then(() => root.animate(
      { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] },
      { duration: 800, easing: "ease-in-out", pseudoElement: "::view-transition-new(root)" }));
  }
  const BIRDS = [0, 1, 2].map(i => `<b style="top:${14 + i * 9}%;animation-delay:${-i * 9}s;animation-duration:${26 + i * 6}s"><svg viewBox="0 0 24 10" width="24" height="10"><path d="M1 8q5-9 11 0q6-9 11 0"/></svg></b>`).join("");
  const CLOUDS = [0, 1, 2, 3].map(i => `<u style="top:${5 + i * 14}%;animation-duration:${70 + i * 28}s;animation-delay:${-i * 23}s"></u>`).join("");
  const stars = n => Array.from({ length: n }, (_, i) => `<i style="left:${(i * 41) % 100}%;top:${(i * 47) % 58}%;animation-delay:${-(i % 8) * .5}s"></i>`).join("");
  const flies = n => Array.from({ length: n }, (_, i) => `<b style="left:${(i * 29 + 7) % 96}%;bottom:${6 + (i * 13) % 40}%;animation-delay:${-i * .9}s;animation-duration:${6 + (i % 5)}s"></b>`).join("");
  const rice = (n, step) => Array.from({ length: n }, (_, i) => `<path style="animation-delay:${-i * .12}s" d="M${i * step} 100q5 -28 0 -${48 + (i % 4) * 9}"/>`).join("");

  function decorateHome() {
    const h = $("#v-home .hero"); if (!h || h.querySelector(".sky")) return;
    h.insertAdjacentHTML("afterbegin", `<div class="sky" aria-hidden="true"><i class="tint"></i><span class="orb sun"></span><span class="orb moon"></span><div class="clouds">${CLOUDS}</div><div class="birds">${BIRDS}</div><div class="stars">${stars(46)}</div><div class="flies">${flies(14)}</div><svg class="rice" viewBox="0 0 1200 100" preserveAspectRatio="none">${rice(90, 13.4)}</svg></div>`);
  }
  function homeButtons() {
    const row = $("#v-home .hero .row"); if (!row) return;
    $$(".xbtn", row).forEach(b => b.remove());
    row.insertAdjacentHTML("beforeend", `<a class="btn onph xbtn" href="#market">🚚 ${tx(["ফসল থেকে বাজার", "Field to market"])}</a><button type="button" class="btn onph xbtn" id="tourBtn">▶ ${tx(["ট্যুর", "Tour"])}</button>`);
    $("#tourBtn").onclick = startTour;
  }
  function decorateAuth() {
    const g = $("#authGate"); if (!g) return;
    if (!g.querySelector(".ascene")) {
      g.insertAdjacentHTML("afterbegin", `<div class="sky ascene" aria-hidden="true"><i class="tint"></i><span class="orb sun"></span><span class="orb moon"></span><div class="stars">${stars(60)}</div><div class="clouds">${CLOUDS}</div><div class="birds">${BIRDS}</div><svg class="ahills" viewBox="0 0 1200 300" preserveAspectRatio="none"><path class="ah1" d="M0 120Q200 40 420 110T800 90T1200 60V300H0z"/><path class="ah2" d="M0 170Q250 100 520 160T1200 130V300H0z"/><path class="ah3" d="M0 220Q300 170 600 215T1200 190V300H0z"/></svg><svg class="rice" viewBox="0 0 1200 100" preserveAspectRatio="none">${rice(110, 11)}</svg><div class="flies">${flies(16)}</div></div><div class="atag"></div>`);
    }
    $(".auth-tag", g)?.remove();
    $(".auth-brand", g)?.insertAdjacentHTML("afterend", `<p class="auth-tag">${tx(["ফসল বাঁচান, আগেই।", "Protect your crop, early."])}</p>`);
    $(".atag", g).innerHTML = `<ul><li>🔒 ${tx(["তথ্য শুধু এই ব্রাউজারে", "Data stays in this browser"])}</li><li>📴 ${tx(["অফলাইনেও চলে", "Works offline"])}</li><li>🗣️ ${tx(["বাংলা ও English", "বাংলা & English"])}</li></ul>`;
  }
  function labelNav() {
    $$(".nav a,.tabs a").forEach(a => { const s = a.querySelector("span"); if (s) { a.title = s.textContent; a.setAttribute("aria-label", s.textContent); } });
  }

  /* ------------------------------------------------------------ guided tour (also used for the demo video) */
  let tourT = [];
  const stopTour = () => { tourT.forEach(clearTimeout); tourT = []; $("#tourCap")?.remove(); };
  function startTour() {
    stopTour();
    const STEP = 4200;
    const steps = [
      ["home", ["কৃষিবন্ধু: ফসলের রোগ, মহামারী আর বাজার, এক জায়গায়।", "KrishiBondhu: crop disease, outbreaks and markets in one place."]],
      ["diagnose", ["বাংলায় সমস্যা লিখলেই রোগ চিনে সমাধান দেয়।", "Describe the problem in Bangla, get the disease and remedy."], () => { $("#q").value = A().L(A().SAMPLES[0]); $("#dxForm").requestSubmit(); }],
      ["map", ["৬৪ জেলার মানচিত্রে মহামারীর আগাম সতর্কতা।", "Early outbreak warnings on a 64-district map."]],
      ["market", ["মাঠ থেকে বাজারে কত ক্ষতি, কোন পথে লাভ বেশি।", "How much is lost on the way, and which route pays most."]],
      ["market", ["কোন বাজারে বেচলে নিট আয় সবচেয়ে বেশি, দাম দেখে বেছে নিন।", "Which market gives the best net income, with price trends."], () => setTab("prices")],
      ["market", ["কাছের সংগ্রহ কেন্দ্র ও হিমাগার খুঁজুন।", "Find the nearest collection point or cold store."], () => setTab("collect")],
      ["market", ["ক্রেতা ও বিক্রেতার মিল, সরাসরি।", "Match sellers and buyers directly."], () => setTab("match")],
      ["channels", ["বাটন ফোনে USSD, ভয়েস ও SMS, ইন্টারনেট ছাড়াই।", "USSD, voice and SMS for button phones, no internet."]],
      ["pitch", ["বিচারক মানদণ্ডের সাথে মিলিয়ে দেখুন।", "See how it meets each judging criterion."]]
    ];
    const cap = document.createElement("div"); cap.id = "tourCap"; cap.className = "tourcap"; cap.setAttribute("role", "status");
    document.body.appendChild(cap);
    steps.forEach((s, i) => tourT.push(setTimeout(() => {
      A().go("#" + s[0]);
      cap.innerHTML = `<span>${i + 1}/${steps.length} · ${tx(s[1])}</span><button type="button" id="tourStop">${tx(["থামুন", "Stop"])}</button>`;
      $("#tourStop").onclick = stopTour; if (s[2]) tourT.push(setTimeout(s[2], 800));
    }, i * STEP)));
    tourT.push(setTimeout(() => { stopTour(); A().go("#home"); }, steps.length * STEP));
  }

  /* ------------------------------------------------------------ Field-to-Market hub */
  const mk = { tab: "loss", c: 0, kg: 500, km: 40, d: 3, p: D.crops[0].price, cold: false, dist: "Bogura", pk: {}, sent: {} };
  const crop = () => D.crops[mk.c];
  const from = () => { const d = A().DISTRICTS.find(x => x[0] === mk.dist) || A().DISTRICTS[0]; return { lat: d[2], lon: d[3] }; };
  const store = { get: (k, d) => A().store.get(k, d), set: (k, v) => A().store.set(k, v) };
  const distOptions = () => A().DISTRICTS.map(d => `<option value="${esc(d[0])}" ${d[0] === mk.dist ? "selected" : ""}>${esc(A().lang === "bn" ? d[1] : d[0])}</option>`).join("");
  const cropOptions = (all) => (all ? `<option value="">${tx(["সব ফসল", "All crops"])}</option>` : "") + D.crops.map((c, i) => `<option value="${all ? c.id : i}" ${!all && i === mk.c ? "selected" : ""}>${c.emoji} ${esc(lg(c))}</option>`).join("");
  const fld = (lab, id, v, ex = "") => `<label class="f"><span>${tx(lab)}</span><input id="${id}" type="number" inputmode="decimal" value="${v}" ${ex}></label>`;
  const TABS = [["loss", "📉", ["ক্ষতির হিসাব", "Loss estimator"]], ["prices", "💹", ["দাম ও সেরা বাজার", "Prices & best market"]], ["collect", "📦", ["সংগ্রহ কেন্দ্র", "Collection points"]], ["match", "🤝", ["ক্রেতা-বিক্রেতা মিল", "Match board"]]];
  const price7 = (m, c) => ML.series(m.id + c.id, 7, c.price * m.k);
  const spark = arr => {
    const lo = Math.min(...arr), hi = Math.max(...arr), w = 74, h = 22, rng = hi - lo || 1;
    const pts = arr.map((v, i) => `${(i / (arr.length - 1) * w).toFixed(1)},${(h - 2 - (v - lo) / rng * (h - 4)).toFixed(1)}`).join(" ");
    const up = arr[arr.length - 1] >= arr[0];
    return `<svg class="spark ${up ? "up" : "dn"}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${up ? tx(["দাম বাড়ছে", "price rising"]) : tx(["দাম কমছে", "price falling"])}"><polyline points="${pts}"/></svg>`;
  };
  const sampleNote = () => `<p class="muted small">⚠ ${tx(["নমুনা তথ্য: ডেমোর জন্য। বাস্তব ব্যবহারে বাজার-দরের উৎসের সাথে যুক্ত হবে। ভাড়া ও রাস্তার হার ধরে নেওয়া।", "Sample data for the demo; production would connect a market-price feed. Freight and road rates are assumptions."])}</p>`;

  function setTab(t) { mk.tab = t; renderMarket(); }
  function renderMarket() {
    const el = $("#v-market"); if (!el) return;
    const A_ = A();
    el.innerHTML = A_.pgHead("B", ["মাঠ থেকে বাজার", "Field to market"], ["ক্ষতি কমান, সেরা বাজার ও সংগ্রহ কেন্দ্র বেছে নিন, ক্রেতার সাথে মিলুন।", "Cut loss, pick the best market and collection point, and meet buyers."]) +
      `<div class="mtabs" role="tablist" aria-label="${tx(["বাজার বিভাগ", "Market sections"])}">${TABS.map(t => `<button role="tab" type="button" class="mtab" data-t="${t[0]}" aria-selected="${t[0] === mk.tab}">${t[1]} <span>${tx(t[2])}</span></button>`).join("")}</div><div id="mkBody" class="mkpanel" role="tabpanel"></div>`;
    $$(".mtab", el).forEach(b => b.onclick = () => setTab(b.dataset.t));
    ({ loss: bodyLoss, prices: bodyPrices, collect: bodyCollect, match: bodyMatch })[mk.tab]();
  }
  const bindNum = (id, k, upd) => { const e = $("#" + id); if (e) e.oninput = () => { mk[k] = Math.max(0, +e.value || 0); upd(); }; };
  const outbreakWarn = () => {
    const c = crop(), al = A().computeAlerts(A().seedReports().concat(A().localReports)).filter(a => a.disease_id.startsWith(c.disease));
    return al.length ? `<div class="mkwarn">⚠ ${tx(["এই ফসলে এখন মহামারী সতর্কতা আছে", "Active outbreak alert for this crop"])}: ${esc(A().L(al[0].name))} · ${nf(al[0].farms)} ${tx(["খামার", "farms"])}. ${tx(["মজুতের আগে ভালো করে বাছাই করুন।", "Sort carefully before storing."])}</div>` : "";
  };

  function bodyLoss() {
    $("#mkBody").innerHTML = `<div class="mk-grid"><form class="card stack" onsubmit="return false"><h2>${tx(["আপনার ফসল", "Your harvest"])}</h2>
      <label class="f"><span>${tx(["ফসল", "Crop"])}</span><select id="mkCrop">${cropOptions(false)}</select></label>
      ${fld(["ফলন (কেজি)", "Harvest (kg)"], "mkKg", mk.kg, 'min="10"')}${fld(["বাজারের দূরত্ব (কিমি)", "Distance to market (km)"], "mkKm", mk.km, 'min="1"')}
      ${fld(["বিক্রির আগে কত দিন", "Days before sale"], "mkD", mk.d, 'min="0" max="30"')}${fld(["দাম (৳/কেজি)", "Price (৳/kg)"], "mkP", mk.p, 'min="1"')}
      <label class="chkrow"><input type="checkbox" id="mkCold" ${mk.cold ? "checked" : ""}><span>${tx(["হিমাগার ব্যবহার করব", "I will use a cold store"])}</span></label></form>
      <div class="stack"><div class="card"><div class="mkchain" aria-hidden="true"><i class="truck">🚚</i><span><em>🌾</em>${tx(["মাঠ", "Farm"])}</span><span><em>📦</em>${tx(["সংগ্রহ", "Collection"])}</span><span><em>🏪</em>${tx(["বাজার", "Market"])}</span><span><em>🍽️</em>${tx(["ভোক্তা", "Table"])}</span></div></div><div id="mkOut" class="stack" aria-live="polite"></div></div></div>`;
    $("#mkCrop").onchange = e => { mk.c = +e.target.value; mk.p = crop().price; $("#mkP").value = mk.p; upd(); };
    bindNum("mkKg", "kg", upd); bindNum("mkKm", "km", upd); bindNum("mkD", "d", upd); bindNum("mkP", "p", upd);
    $("#mkCold").onchange = e => { mk.cold = e.target.checked; upd(); };
    function upd() {
      const c = crop(), base = { kg: mk.kg, price: mk.p, rate: c.rate, days: mk.d, km: mk.km, cold: mk.cold };
      const near = { ...base, km: Math.min(mk.km, 10), days: Math.max(0, mk.d - 1) };
      const r = ML.route(base), perfect = mk.kg * mk.p;
      const opts = [[["এভাবেই", "As planned"], r], [["কাছের সংগ্রহ কেন্দ্র (≤১০ কিমি, ১ দিন আগে)", "Nearby collection point (≤10 km, 1 day sooner)"], ML.route(near)],
        [["হিমাগার", "Cold store"], ML.route({ ...base, cold: true })], [["কাছের কেন্দ্র + হিমাগার", "Nearby point + cold store"], ML.route({ ...near, cold: true })]];
      const best = opts.reduce((a, b) => b[1].net > a[1].net ? b : a);
      $("#mkOut").innerHTML = `${outbreakWarn()}
        <div class="card stack"><div class="kpis"><div class="kpi"><b>${nf(+r.loss.toFixed(1))}%</b><span>${tx(["সম্ভাব্য ক্ষতি", "Expected loss"])}</span></div><div class="kpi"><b>${nf(Math.round(r.kgOut))}</b><span>${tx(["কেজি বাজারে পৌঁছাবে", "kg reach the buyer"])}</span></div><div class="kpi"><b>${money(perfect - r.gross)}</b><span>${tx(["হারানো আয়", "Income lost"])}</span></div></div></div>
        <div class="card stack"><h2>${tx(["কোন পথে লাভ বেশি?", "Which route pays most?"])}</h2><div class="mkhead"><span></span><span>${tx(["ক্ষতি", "Loss"])}</span><span>${tx(["কেজি", "kg"])}</span><span>${tx(["নিট আয়", "Net income"])}</span></div>
        ${opts.map(([n, x]) => `<div class="mkopt ${x === best[1] ? "best" : ""}"><span>${x === best[1] ? "★ " : ""}${tx(n)}</span><b>${nf(+x.loss.toFixed(1))}%</b><span>${nf(Math.round(x.kgOut))}</span><b>${money(x.net)}</b></div>`).join("")}
        <p class="muted small">${tx(["নিট আয় = বিক্রি − পরিবহন খরচ।", "Net income = sales minus freight."])}</p>${sampleNote()}</div>`;
    }
    upd();
  }

  function bodyPrices() {
    $("#mkBody").innerHTML = `<div class="mk-grid"><form class="card stack" onsubmit="return false"><h2>${tx(["আপনার তথ্য", "Your details"])}</h2>
      <label class="f"><span>${tx(["ফসল", "Crop"])}</span><select id="mkCrop">${cropOptions(false)}</select></label>
      <label class="f"><span>${tx(["আপনার জেলা", "Your district"])}</span><select id="mkDist">${distOptions()}</select></label>
      ${fld(["ফলন (কেজি)", "Harvest (kg)"], "mkKg", mk.kg, 'min="10"')}${fld(["বিক্রির আগে কত দিন", "Days before sale"], "mkD", mk.d, 'min="0" max="30"')}
      <label class="chkrow"><input type="checkbox" id="mkCold" ${mk.cold ? "checked" : ""}><span>${tx(["হিমাগার ব্যবহার করব", "I will use a cold store"])}</span></label></form>
      <div id="mkOut" class="stack" aria-live="polite"></div></div>`;
    $("#mkCrop").onchange = e => { mk.c = +e.target.value; mk.p = crop().price; upd(); };
    $("#mkDist").onchange = e => { mk.dist = e.target.value; upd(); };
    bindNum("mkKg", "kg", upd); bindNum("mkD", "d", upd);
    $("#mkCold").onchange = e => { mk.cold = e.target.checked; upd(); };
    function upd() {
      const c = crop(), series = new Map(D.markets.map(m => [m.id, price7(m, c)]));
      const rk = ML.rankMarkets({ from: from(), markets: D.markets, priceOf: m => series.get(m.id).at(-1), kg: mk.kg, rate: c.rate, days: mk.d, cold: mk.cold });
      const near = rk.reduce((a, b) => b.km < a.km ? b : a), top = rk[0], gain = top.net - near.net;
      $("#mkOut").innerHTML = `${outbreakWarn()}
        <div class="card stack"><div class="bestbox"><span class="muted small">${tx(["সেরা বাজার", "Best market"])}</span><b>★ ${esc(lg(top.market))}</b>
        <span>${top === near ? tx(["এটিই আপনার সবচেয়ে কাছের বাজার।", "It is also your nearest market."]) : `${tx(["কাছের বাজারের চেয়ে বেশি আয়", "More than the nearest market by"])} <b>${money(gain)}</b>`}</span></div>
        <div class="ptable" role="table"><div class="phead" role="row"><span>${tx(["বাজার", "Market"])}</span><span>${tx(["৳/কেজি", "৳/kg"])}</span><span class="tr">${tx(["৭ দিন", "7 days"])}</span><span>${tx(["কিমি", "km"])}</span><span>${tx(["নিট আয়", "Net"])}</span></div>
        ${rk.map((x, i) => `<div class="prow ${i === 0 ? "best" : ""}" role="row"><span>${i === 0 ? "★ " : ""}${esc(lg(x.market))}</span><b>${nf(x.price.toFixed(1))}</b><span class="tr">${spark(series.get(x.market.id))}</span><span>${nf(x.km)}</span><b>${money(x.net)}</b></div>`).join("")}</div>
        <p class="muted small">${tx(["নিট আয় = ক্ষতির পর বিক্রি − পরিবহন খরচ।", "Net = sales after spoilage minus freight."])}</p>${sampleNote()}</div>`;
    }
    upd();
  }

  function bodyCollect() {
    const pk = store.get("ap_pickups", []);
    $("#mkBody").innerHTML = `<div class="mk-grid"><form class="card stack" onsubmit="return false"><h2>${tx(["কোথায় দেবেন?", "Where to drop?"])}</h2>
      <label class="f"><span>${tx(["ফসল", "Crop"])}</span><select id="mkCrop">${cropOptions(false)}</select></label>
      <label class="f"><span>${tx(["আপনার জেলা", "Your district"])}</span><select id="mkDist">${distOptions()}</select></label>${fld(["ফলন (কেজি)", "Harvest (kg)"], "mkKg", mk.kg, 'min="10"')}
      <div class="card stack nested"><h3>${tx(["আমার পিকআপ অনুরোধ", "My pickup requests"])}</h3><div id="mkPk"></div></div></form>
      <div class="stack"><div id="mkOut" class="stack" aria-live="polite"></div>${sampleNote()}</div></div>`;
    $("#mkCrop").onchange = e => { mk.c = +e.target.value; upd(); }; $("#mkDist").onchange = e => { mk.dist = e.target.value; upd(); }; bindNum("mkKg", "kg", upd);
    const drawPk = () => { const l = store.get("ap_pickups", []); $("#mkPk").innerHTML = l.length ? l.map((p, i) => { const pt = D.collection.find(x => x.id === p.pid); return `<div class="pkrow"><span>${D.crops.find(c => c.id === p.crop).emoji} ${esc(lg(pt))} · ${nf(p.kg)} kg<br><small class="muted">${tx(["অনুরোধ করা হয়েছে (ডেমো)", "Requested (demo)"])}</small></span><button type="button" class="chip" data-i="${i}" aria-label="${tx(["মুছুন", "Remove"])}">✕</button></div>`; }).join("") : `<p class="muted small">${tx(["এখনো কোনো অনুরোধ নেই।", "No requests yet."])}</p>`;
      $$("#mkPk button").forEach(b => b.onclick = () => { const l2 = store.get("ap_pickups", []); l2.splice(+b.dataset.i, 1); store.set("ap_pickups", l2); drawPk(); }); };
    function upd() {
      const c = crop(), list = ML.nearest(from(), D.collection, c.id, 6);
      $("#mkOut").innerHTML = list.length ? list.map(({ point: p, km }, i) => `<div class="card cpt ${i === 0 ? "best" : ""}"><div><b>${i === 0 ? "★ " : ""}${esc(lg(p))}</b><div class="muted small">${nf(km)} ${tx(["কিমি", "km"])} · ${nf(p.capT)} ${tx(["টন ধারণক্ষমতা", "t capacity"])} · ${p.cold ? "❄️ " + tx(["হিমাগার আছে", "cold store"]) : tx(["হিমাগার নেই", "no cold store"])}</div><div>${p.crops.map(id => D.crops.find(x => x.id === id).emoji).join(" ")}</div></div>
        <button type="button" class="btn small" data-p="${p.id}">${tx(["পিকআপ চাই", "Request pickup"])}</button></div>`).join("") : `<div class="card"><p class="muted">${tx(["এই ফসলের জন্য কোনো কেন্দ্র পাওয়া যায়নি।", "No collection point found for this crop."])}</p></div>`;
      $$("#mkOut [data-p]").forEach(b => b.onclick = () => { const l = store.get("ap_pickups", []); l.unshift({ pid: b.dataset.p, crop: c.id, kg: mk.kg }); store.set("ap_pickups", l.slice(0, 20)); drawPk(); b.textContent = "✓ " + tx(["অনুরোধ হয়েছে", "Requested"]); });
    }
    upd(); drawPk();
  }

  function bodyMatch() {
    const mine = () => store.get("ap_listings", []);
    const all = () => D.listings.concat(mine());
    $("#mkBody").innerHTML = `<div class="mk-grid"><form class="card stack" id="lsForm"><h2>${tx(["নতুন পোস্ট", "New post"])}</h2>
      <div class="seg" role="radiogroup" aria-label="${tx(["ধরন", "Type"])}"><label><input type="radio" name="lt" value="sell" checked><span>${tx(["আমি বেচতে চাই", "I want to sell"])}</span></label><label><input type="radio" name="lt" value="buy"><span>${tx(["আমি কিনতে চাই", "I want to buy"])}</span></label></div>
      <label class="f"><span>${tx(["ফসল", "Crop"])}</span><select id="lsCrop">${cropOptions(false)}</select></label>
      <label class="f"><span>${tx(["জেলা", "District"])}</span><select id="lsDist">${distOptions()}</select></label>
      ${fld(["পরিমাণ (কেজি)", "Quantity (kg)"], "lsKg", 500, 'min="10"')}${fld(["দাম (৳/কেজি)", "Price (৳/kg)"], "lsP", crop().price, 'min="1"')}
      <label class="f"><span>${tx(["আপনার নাম/পরিচয়", "Your name / label"])}</span><input id="lsName" maxlength="40" placeholder="${tx(["যেমন: কৃষক, বগুড়া", "e.g. Farmer, Bogura"])}"></label>
      <button class="btn" type="submit">${tx(["পোস্ট করুন", "Post"])}</button><p class="muted small">${tx(["ডেমোতে পোস্ট শুধু এই ব্রাউজারে থাকে। ফোন নম্বর নেওয়া হয় না।", "In this demo posts stay in this browser. No phone numbers are collected."])}</p></form>
      <div class="stack"><div id="mkOut" class="stack" aria-live="polite"></div></div></div>`;
    $("#lsCrop").onchange = e => { $("#lsP").value = D.crops[+e.target.value].price; };
    $("#lsForm").onsubmit = e => {
      e.preventDefault(); const ci = +$("#lsCrop").value, ds = A().DISTRICTS.find(d => d[0] === $("#lsDist").value);
      const item = { id: "m" + Date.now(), type: $("input[name=lt]:checked").value, crop: D.crops[ci].id, kg: Math.max(10, +$("#lsKg").value || 0), price: Math.max(1, +$("#lsP").value || 0),
        name: $("#lsName").value.trim().slice(0, 40) || "Me", bn: $("#lsName").value.trim().slice(0, 40) || "আমি", lat: ds[2], lon: ds[3], district: ds[0], mine: 1 };
      store.set("ap_listings", [item, ...mine()].slice(0, 20)); draw(item.id);
    };
    function row(o, extra = "") {
      const c = D.crops.find(x => x.id === o.crop);
      return `<div class="lsrow ${o.type}"><span class="lstag">${o.type === "sell" ? tx(["বিক্রি", "SELL"]) : tx(["ক্রয়", "BUY"])}</span><div><b>${c.emoji} ${nf(o.kg)} kg · ${money(o.price)}/kg</b><div class="muted small">${esc(A().lang === "bn" ? o.bn : o.name)}${o.district ? " · " + esc(o.district) : ""}${o.sample ? ` · <i>${tx(["নমুনা", "sample"])}</i>` : ""}</div>${extra}</div></div>`;
    }
    function draw(focusId) {
      const my = mine(), tgt = my.find(x => x.id === focusId) || my[0];
      let h = "";
      if (tgt) {
        const ms = ML.matchListings(tgt, all(), 120);
        h += `<div class="card stack"><h2>${tx(["আপনার জন্য মিল", "Matches for your post"])}</h2>${row(tgt)}
          ${ms.length ? ms.map(m => { const sent = store.get("ap_sent", []).includes(m.offer.id);
            return `<div class="match ${m.priceOk ? "ok" : ""}">${row(m.offer, `<div class="small">${nf(m.km)} ${tx(["কিমি", "km"])} · ${tx(["সম্ভাব্য লেনদেন", "possible deal"])} ${nf(m.qty)} kg · ${m.priceOk ? "✅ " + tx(["দাম মেলে", "price fits"]) : "⚠ " + tx(["দামে ফারাক", "price gap"])}</div>`)}<button type="button" class="btn small" data-s="${esc(m.offer.id)}" ${sent ? "disabled" : ""}>${sent ? "✓ " + tx(["আগ্রহ জানানো হয়েছে", "Interest sent"]) : tx(["আগ্রহ জানান (ডেমো)", "Send interest (demo)"])}</button></div>`; }).join("")
          : `<p class="muted">${tx(["কাছে এখনো মিল নেই।", "No match nearby yet."])}</p>`}</div>`;
      }
      h += `<div class="card stack"><h2>${tx(["সব পোস্ট", "All posts"])}</h2><label class="f"><span>${tx(["ফসল ফিল্টার", "Filter by crop"])}</span><select id="lsFilter">${cropOptions(true)}</select></label><div id="lsAll"></div></div>`;
      $("#mkOut").innerHTML = h;
      const drawAll = () => { const f = $("#lsFilter").value; $("#lsAll").innerHTML = all().filter(o => !f || o.crop === f).map(o => row(o)).join("") || `<p class="muted">${tx(["কিছু নেই", "Nothing here"])}</p>`; };
      $("#lsFilter").onchange = drawAll; drawAll();
      $$("#mkOut [data-s]").forEach(b => b.onclick = () => { const s = store.get("ap_sent", []); s.push(b.dataset.s); store.set("ap_sent", s); b.disabled = true; b.textContent = "✓ " + tx(["আগ্রহ জানানো হয়েছে", "Interest sent"]); });
    }
    draw();
  }

  /* ------------------------------------------------------------ Pitch / judging page */
  function renderPitch() {
    const el = $("#v-pitch"); if (!el) return;
    const crit = [
      [25, ["সমস্যা সমাধান ও প্রাসঙ্গিকতা", "Problem solving & relevance"], ["কৃষক দেরিতে রোগ ধরেন, মহামারীর খবর ছড়ায় না, আর মাঠ থেকে বাজারে ফসল নষ্ট হয়। কৃষিবন্ধু তিনটিই ধরে।", "Farmers spot disease late, outbreak news does not travel, and produce spoils between field and market. KrishiBondhu tackles all three."], "map"],
      [25, ["কার্যকারিতা ও সম্পূর্ণতা", "Functionality & completeness"], ["১৬টি পেজ, ছবি/কণ্ঠ/লেখা থেকে রোগ নির্ণয়, ৬৪ জেলার মানচিত্র, বাজার-দর, সংগ্রহ কেন্দ্র, ক্রেতা-বিক্রেতা মিল। ইন্টারনেট ছাড়াও চলে।", "16 pages: diagnosis from photo, voice or text, a 64-district map, prices, collection points and buyer matching. Works offline as a PWA."], "diagnose"],
      [20, ["UI/UX ও অ্যাক্সেসিবিলিটি", "UI/UX & accessibility"], ["বাংলা/ইংরেজি, রাত/দিন মোড, কিবোর্ড ফোকাস, স্কিপ লিংক, কম-অ্যানিমেশন মোড, কণ্ঠে ইনপুট।", "Bangla/English, day/night, keyboard focus, skip link, reduced-motion support and voice input."], "home"],
      [15, ["উদ্ভাবন ও সৃজনশীলতা", "Innovation & creativity"], ["৫ কিমি/৪ খামারের মহামারী সতর্কতা; রোগের সতর্কতা সরাসরি বাজার-হিসাবে; বাটন ফোনে USSD, ভয়েস, SMS।", "5 km / 4 farm outbreak alerts; disease risk feeds the market estimate; USSD, voice and SMS for button phones."], "channels"],
      [10, ["কোডের মান", "Code quality & maintainability"], ["আলাদা css/js/data ফোল্ডার, DOM-মুক্ত লজিক মডিউল ও ৮টি টেস্ট (node tests/market.test.js), README।", "Separate css/js/data folders, a DOM-free logic module with 8 tests (node tests/market.test.js), and a README."], "about"],
      [5, ["ডেমো ও উপস্থাপনা", "Demo & presentation"], ["এই পেজের ভিডিও, ট্যুর বোতাম, ডেমো লগইন ও ২ মিনিটের স্ক্রিপ্ট।", "The video on this page, a tour button, a demo login and a 2-minute script."], "tour"]
    ];
    const script = [
      ["০:০০ সমস্যা", "0:00 Problem", ["বাংলাদেশের কৃষক ফসলের রোগ দেরিতে ধরেন, পাশের মাঠের খবর পান না, আর ফসল বাজারে যেতে যেতে নষ্ট হয়।", "Farmers in Bangladesh spot crop disease late, don't hear what is happening in the next village, and lose produce on the way to market."]],
      ["০:২০ রোগ নির্ণয়", "0:20 Diagnose", ["বাংলায় বলুন বা লিখুন, ছবি দিন। অ্যাপ রোগ চেনে, জৈব আগে ও রাসায়নিক পরে, লেবেল মানার সতর্কতাসহ বলে।", "Speak or type in Bangla, add a photo. The app names the disease: organic first, chemical second, always with the label warning."]],
      ["০:৪০ মহামারী মানচিত্র", "0:40 Outbreak map", ["৫ কিমির মধ্যে ৪টি খামারে একই রোগ হলে মানচিত্রে সতর্কতা জ্বলে ওঠে। ডেমোর বেশিরভাগ বিন্দু নমুনা তথ্য।", "When four farms within 5 km report the same disease, the map lights up an alert. Most demo points are sample data."]],
      ["১:০০ মাঠ থেকে বাজার", "1:00 Field to market", ["ফসল, দূরত্ব ও দিন দিলে ক্ষতি ও নিট আয় দেখায়। আটটি বাজারের মধ্যে সেরাটি, কাছের সংগ্রহ কেন্দ্র ও হিমাগার, এবং ক্রেতা-বিক্রেতার মিল।", "Enter crop, distance and days to see loss and net income, the best of eight markets, the nearest collection point or cold store, and matching buyers."]],
      ["১:৩০ সবার জন্য", "1:30 For everyone", ["বাটন ফোনে USSD, ভয়েস ও SMS। ইন্টারনেট না থাকলেও অ্যাপ চলে।", "USSD, voice and SMS for button phones, and the app still works offline."]],
      ["১:৪৫ সমাপ্তি", "1:45 Close", ["কৃষিবন্ধু: রোগ আগে ধরুন, ক্ষতি কমান, সঠিক বাজারে বিক্রি করুন।", "KrishiBondhu: catch disease early, lose less, sell at the right market."]]
    ];
    el.innerHTML = A().pgHead("A", ["উপস্থাপনা ও বিচারক মানদণ্ড", "Pitch & judging criteria"], ["এক পেজে সমস্যা, সমাধান, ডেমো ভিডিও আর কোন মানদণ্ডে কী দেখবেন।", "Problem, solution, demo video and where to look for each criterion, on one page."]) + `
    <div class="pitch-grid">
      <div class="card stack vidcard"><h2>${tx(["ডেমো ভিডিও", "Demo video"])}</h2>
        <video controls preload="metadata" playsinline poster="media/poster.jpg" aria-label="${tx(["অ্যাপের ডেমো ভিডিও", "App demo video"])}"><source src="media/demo.mp4" type="video/mp4"></video>
        <div class="row"><button class="btn" type="button" id="pTour">▶ ${tx(["লাইভ ট্যুর", "Live tour"])}</button><a class="btn ghost" href="#diagnose">${tx(["নিজে চেষ্টা করুন", "Try it yourself"])}</a></div>
        <p class="muted small">${tx(["ভিডিওটি অ্যাপের নিজস্ব ট্যুর স্ক্রিনে রেকর্ড করা।", "The video is a screen recording of the app's own tour."])}</p></div>
      <div class="stack">
        ${cardH2(["সমস্যা", "Problem"], ["দেরিতে রোগ চেনা, ছড়িয়ে পড়া রোগের খবর না পাওয়া, আর পথে ফসল নষ্ট।", "Late disease detection, no early warning from nearby farms, and spoilage on the way to market."], "⚠️")}
        ${cardH2(["সমাধান", "Solution"], ["বাংলায় রোগ নির্ণয় + এলাকার সতর্কতা + সেরা বাজার ও সংগ্রহ কেন্দ্র + ক্রেতার মিল।", "Bangla diagnosis + local alerts + best market and collection point + buyer matching."], "🌱")}
        ${cardH2(["কারা ব্যবহার করবেন", "Who it is for"], ["কৃষক, মাঠ-কর্মী, সংগ্রহ কেন্দ্র ও উপজেলা কৃষি অফিস। স্মার্টফোন না থাকলেও USSD।", "Farmers, field agents, collection points and upazila agriculture offices. USSD if there is no smartphone."], "👩‍🌾")}
      </div></div>
    <div class="card stack"><h2>${tx(["মানদণ্ড অনুযায়ী কী আছে", "What you get, per criterion"])}</h2>
      ${crit.map(c => `<div class="crit"><div class="critbar"><b>${nf(c[0])}%</b><i style="--w:${c[0] * 4}%"></i></div><div><b>${tx(c[1])}</b><p>${tx(c[2])}</p></div><button type="button" class="btn ghost small" data-go="${c[3]}">${tx(["দেখুন", "Open"])}</button></div>`).join("")}</div>
    <div class="card stack"><h2>${tx(["২ মিনিটের স্ক্রিপ্ট", "2-minute script"])}</h2>
      ${script.map(s => `<details><summary>${tx([s[0], s[1]])}</summary><p>${tx(s[2])}</p></details>`).join("")}</div>
    <div class="card stack"><h2>${tx(["তথ্যের সততা", "Honest about the data"])}</h2><ul class="muted"><li>${tx(["মানচিত্রের বেশিরভাগ বিন্দু, বাজার-দর, সংগ্রহ কেন্দ্র ও ক্রেতা-বিক্রেতা তালিকা নমুনা তথ্য।", "Most map points, market prices, collection points and listings are sample data."])}</li><li>${tx(["ক্ষতির হার ও ভাড়া ধরে নেওয়া, কোডে বদলানো যায়।", "Loss and freight rates are assumptions, editable in code."])}</li><li>${tx(["ডেমো মোডে রোগ নির্ণয় কীওয়ার্ড মিল; Gemini চালু করলে এআই।", "Demo mode diagnosis is keyword matching; set a Gemini key to enable AI."])}</li></ul></div>`;
    $$("[data-go]", el).forEach(b => b.onclick = () => b.dataset.go === "tour" ? startTour() : A().go("#" + b.dataset.go));
    $("#pTour", el).onclick = startTour;
  }
  const cardH2 = (t, b, icon) => `<div class="card stack"><h2>${icon} ${tx(t)}</h2><p>${tx(b)}</p></div>`;

  /* ------------------------------------------------------------ scroll reveal + boot */
  const rvIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); rvIO.unobserve(e.target); } }), { threshold: .06 });
  function armReveal() {
    if (reduceM) return;
    $$("main .tile, main .step, main .card, main .band, main .split, main .pgh, main .dy, main .kpi").forEach(el => { if (el.dataset.rv) return; el.dataset.rv = 1; el.classList.add("rv"); rvIO.observe(el); });
  }
  function boot() {
    syncNight(); matchMedia("(prefers-color-scheme: dark)").addEventListener("change", syncNight);
    let ff = ""; for (let i = 0; i < 16; i++) ff += `<b style="left:${(i * 47 + 5) % 98}%;top:${(i * 31 + 11) % 90}%;animation-delay:${-i * 1.3}s"></b>`;
    const fx = document.createElement("div"); fx.id = "fx"; fx.setAttribute("aria-hidden", "true"); fx.innerHTML = ff; document.body.appendChild(fx);
    new MutationObserver(() => requestAnimationFrame(armReveal)).observe($("main"), { childList: true, subtree: true });
    addEventListener("load", armReveal);
  }
  window.APX = { syncNight, revealTheme, setTab,
    render() { decorateHome(); homeButtons(); renderMarket(); renderPitch(); labelNav(); decorateAuth(); } };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
