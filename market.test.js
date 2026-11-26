// Run: node tests/market.test.js
const assert = require("assert");
const M = require("../js/market-logic.js");
let n = 0; const t = (name, fn) => { fn(); n++; console.log("ok -", name); };

t("cold store lowers loss", () => assert.ok(M.lossPct(3, 4, 40, true) < M.lossPct(3, 4, 40, false)));
t("loss is capped at 70%", () => assert.strictEqual(M.lossPct(3, 30, 900, false), 70));
t("loss never negative", () => assert.strictEqual(M.lossPct(0, 0, 0, false), 0));
t("route income math", () => {
  const r = M.route({ kg: 100, price: 10, rate: 0, days: 0, km: 20, cold: false });
  assert.strictEqual(+r.loss.toFixed(2), 1);
  assert.strictEqual(+r.kgOut.toFixed(2), 99);
  assert.strictEqual(+r.transport.toFixed(2), 40);
  assert.strictEqual(+r.net.toFixed(2), 950);
});
t("rankMarkets sorts by net income", () => {
  const from = { lat: 24.85, lon: 89.37 };
  const markets = [{ id: "a", lat: 24.9, lon: 89.4 }, { id: "b", lat: 23.7, lon: 90.4 }];
  const r = M.rankMarkets({ from, markets, priceOf: m => (m.id === "a" ? 30 : 31), kg: 500, rate: 3, days: 2, cold: false });
  assert.strictEqual(r[0].market.id, "a");
  assert.ok(r[0].net >= r[1].net);
});
t("nearest filters crop and sorts", () => {
  const pts = [{ id: 1, lat: 24, lon: 89, crops: ["rice"] }, { id: 2, lat: 24.8, lon: 89.3, crops: ["tomato"] }, { id: 3, lat: 25, lon: 89.5, crops: ["tomato"] }];
  const r = M.nearest({ lat: 24.85, lon: 89.37 }, pts, "tomato", 5);
  assert.deepStrictEqual(r.map(x => x.point.id), [2, 3]);
});
t("matchListings pairs sell with buy of same crop", () => {
  const sell = { id: "s", type: "sell", crop: "potato", kg: 500, price: 30, lat: 24.85, lon: 89.37 };
  const all = [sell, { id: "b1", type: "buy", crop: "potato", kg: 300, price: 32, lat: 24.9, lon: 89.4 },
    { id: "b2", type: "buy", crop: "tomato", kg: 300, price: 40, lat: 24.9, lon: 89.4 },
    { id: "b3", type: "buy", crop: "potato", kg: 300, price: 10, lat: 24.9, lon: 89.4 },
    { id: "b4", type: "buy", crop: "potato", kg: 300, price: 40, lat: 10, lon: 10 }];
  const m = M.matchListings(sell, all, 80);
  assert.deepStrictEqual(m.map(x => x.offer.id), ["b1", "b3"]);
  assert.strictEqual(m[0].priceOk, true); assert.strictEqual(m[1].priceOk, false); assert.strictEqual(m[0].qty, 300);
});
t("series is deterministic", () => {
  assert.deepStrictEqual(M.series("x", 7, 40), M.series("x", 7, 40));
  assert.strictEqual(M.series("x", 7, 40).length, 7);
});
console.log(n + " tests passed");
