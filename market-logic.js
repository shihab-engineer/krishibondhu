/* Pure supply-chain logic (no DOM). Used by the app and by tests/market.test.js.
   All rates are illustrative assumptions, documented here so they are easy to change. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.MarketLogic = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const COLD_FACTOR = 0.35;          // cold store cuts daily spoilage to 35 %
  const ROAD_LOSS_PER_KM = 0.05;     // % lost per km of transport
  const MAX_LOSS = 70;               // cap, in %
  const TRANSPORT_BDT_PER_KG_KM = 0.02; // assumed freight cost
  const ROAD_FACTOR = 1.3;           // straight-line km -> road km

  const hav = (a, b, c, d) => {
    const r = 6371, p = Math.PI / 180;
    const x = Math.sin((c - a) * p / 2) ** 2 + Math.cos(a * p) * Math.cos(c * p) * Math.sin((d - b) * p / 2) ** 2;
    return 2 * r * Math.asin(Math.sqrt(x));
  };
  const roadKm = (a, b) => Math.round(hav(a.lat, a.lon, b.lat, b.lon) * ROAD_FACTOR);

  function lossPct(rate, days, km, cold) {
    const r = rate * (cold ? COLD_FACTOR : 1);
    return Math.min(MAX_LOSS, Math.max(0, r * days + km * ROAD_LOSS_PER_KM));
  }

  function route({ kg, price, rate, days, km, cold }) {
    const loss = lossPct(rate, days, km, cold);
    const kgOut = kg * (1 - loss / 100);
    const gross = kgOut * price;
    const transport = kg * km * TRANSPORT_BDT_PER_KG_KM;
    return { loss, kgOut, gross, transport, net: gross - transport };
  }

  /** Rank markets by net income for a farmer at `from`. priceOf(market) gives BDT/kg. */
  function rankMarkets({ from, markets, priceOf, kg, rate, days, cold }) {
    return markets.map(m => {
      const km = roadKm(from, m), price = priceOf(m);
      return { market: m, km, price, ...route({ kg, price, rate, days, km, cold }) };
    }).sort((a, b) => b.net - a.net);
  }

  function nearest(from, points, crop, limit = 5) {
    return points.filter(p => !crop || p.crops.includes(crop))
      .map(p => ({ point: p, km: roadKm(from, p) })).sort((a, b) => a.km - b.km).slice(0, limit);
  }

  /** Match a sell post with buy posts (or the reverse) for the same crop within maxKm. */
  function matchListings(item, all, maxKm = 80) {
    const want = item.type === "sell" ? "buy" : "sell";
    return all.filter(o => o.type === want && o.crop === item.crop && o.id !== item.id)
      .map(o => {
        const km = roadKm(item, o);
        const priceOk = item.type === "sell" ? o.price >= item.price * 0.9 : o.price <= item.price * 1.1;
        return { offer: o, km, qty: Math.min(item.kg, o.kg), priceOk };
      })
      .filter(x => x.km <= maxKm)
      .sort((a, b) => (b.priceOk - a.priceOk) || (a.km - b.km));
  }

  /** Deterministic pseudo price history so the demo looks the same on every device. */
  function series(seed, n, base) {
    let h = 0; for (const ch of String(seed)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const out = []; let v = base * 0.94;
    for (let i = 0; i < n; i++) {
      h = (h * 1664525 + 1013904223) >>> 0;
      v = v * (1 + (h / 4294967296 - 0.5) * 0.07) + (base - v) * 0.18;
      out.push(Math.round(v * 10) / 10);
    }
    return out;
  }

  return { COLD_FACTOR, ROAD_LOSS_PER_KM, TRANSPORT_BDT_PER_KG_KM, hav, roadKm, lossPct, route, rankMarkets, nearest, matchListings, series };
});
