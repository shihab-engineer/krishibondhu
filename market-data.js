/* SAMPLE DATA for the demo. Replace with a real feed (e.g. a wholesale-market price API)
   and a registry of collection points. Everything here is flagged sample on screen. */
window.AP_DATA = {
  crops: [
    { id: "tomato",  emoji: "🍅", bn: "টমেটো",  en: "Tomato",  rate: 3,   price: 40, disease: "tomato_" },
    { id: "brinjal", emoji: "🍆", bn: "বেগুন",   en: "Brinjal", rate: 2.5, price: 50, disease: "brinjal_" },
    { id: "potato",  emoji: "🥔", bn: "আলু",     en: "Potato",  rate: 0.6, price: 30, disease: "potato_" },
    { id: "onion",   emoji: "🧅", bn: "পেঁয়াজ", en: "Onion",   rate: 0.8, price: 60, disease: "none_" },
    { id: "rice",    emoji: "🌾", bn: "ধান",     en: "Rice",    rate: 0.3, price: 28, disease: "rice_" },
    { id: "maize",   emoji: "🌽", bn: "ভুট্টা",  en: "Maize",   rate: 0.5, price: 25, disease: "maize_" }
  ],
  markets: [
    { id: "dhaka",  bn: "ঢাকা পাইকারি বাজার",     en: "Dhaka wholesale market",      lat: 23.78, lon: 90.40, k: 1.12 },
    { id: "ctg",    bn: "চট্টগ্রাম পাইকারি বাজার", en: "Chattogram wholesale market", lat: 22.34, lon: 91.83, k: 1.08 },
    { id: "sylhet", bn: "সিলেট বাজার",            en: "Sylhet market",               lat: 24.90, lon: 91.87, k: 1.10 },
    { id: "khulna", bn: "খুলনা বাজার",            en: "Khulna market",               lat: 22.82, lon: 89.55, k: 1.00 },
    { id: "mym",    bn: "ময়মনসিংহ বাজার",        en: "Mymensingh market",           lat: 24.75, lon: 90.40, k: 0.97 },
    { id: "raj",    bn: "রাজশাহী বাজার",          en: "Rajshahi market",             lat: 24.37, lon: 88.60, k: 0.95 },
    { id: "bogura", bn: "বগুড়া বাজার",           en: "Bogura market",               lat: 24.85, lon: 89.37, k: 0.90 },
    { id: "rangpur",bn: "রংপুর বাজার",            en: "Rangpur market",              lat: 25.75, lon: 89.25, k: 0.88 }
  ],
  collection: [
    { id: "c1", bn: "বগুড়া কৃষক সংগ্রহ কেন্দ্র",   en: "Bogura farmers' collection point",   lat: 24.84, lon: 89.38, cold: true,  capT: 40, crops: ["potato", "tomato", "rice", "maize"] },
    { id: "c2", bn: "শেরপুর সংগ্রহ কেন্দ্র",       en: "Sherpur collection point",            lat: 24.66, lon: 89.42, cold: false, capT: 15, crops: ["brinjal", "tomato", "onion"] },
    { id: "c3", bn: "রংপুর হিমাগার ও সংগ্রহ",      en: "Rangpur cold store & collection",     lat: 25.74, lon: 89.27, cold: true,  capT: 60, crops: ["potato", "tomato", "maize"] },
    { id: "c4", bn: "দিনাজপুর সংগ্রহ কেন্দ্র",     en: "Dinajpur collection point",           lat: 25.63, lon: 88.64, cold: false, capT: 20, crops: ["potato", "rice", "maize"] },
    { id: "c5", bn: "রাজশাহী সংগ্রহ কেন্দ্র",      en: "Rajshahi collection point",           lat: 24.38, lon: 88.61, cold: true,  capT: 35, crops: ["onion", "brinjal", "rice"] },
    { id: "c6", bn: "খুলনা সংগ্রহ কেন্দ্র",        en: "Khulna collection point",             lat: 22.81, lon: 89.56, cold: false, capT: 18, crops: ["tomato", "brinjal", "rice"] },
    { id: "c7", bn: "কুমিল্লা হিমাগার",            en: "Cumilla cold store",                  lat: 23.46, lon: 91.18, cold: true,  capT: 50, crops: ["potato", "tomato", "brinjal", "onion"] },
    { id: "c8", bn: "সিলেট সংগ্রহ কেন্দ্র",        en: "Sylhet collection point",             lat: 24.89, lon: 91.86, cold: false, capT: 12, crops: ["tomato", "brinjal", "rice"] },
    { id: "c9", bn: "ময়মনসিংহ সংগ্রহ কেন্দ্র",    en: "Mymensingh collection point",         lat: 24.75, lon: 90.41, cold: true,  capT: 30, crops: ["potato", "maize", "onion", "tomato"] }
  ],
  listings: [
    { id: "l1", type: "buy",  crop: "tomato",  kg: 800,  price: 42, name: "Dhaka retailer group", bn: "ঢাকার খুচরা বিক্রেতা দল", lat: 23.80, lon: 90.38, district: "Dhaka",   sample: 1 },
    { id: "l2", type: "buy",  crop: "potato",  kg: 2000, price: 31, name: "Cold-store buyer",     bn: "হিমাগার ক্রেতা",         lat: 24.90, lon: 89.40, district: "Bogura",  sample: 1 },
    { id: "l3", type: "buy",  crop: "rice",    kg: 1500, price: 29, name: "Rice mill",            bn: "চালকল",                 lat: 24.80, lon: 89.30, district: "Bogura",  sample: 1 },
    { id: "l4", type: "sell", crop: "brinjal", kg: 300,  price: 48, name: "Farmer, Sherpur",      bn: "কৃষক, শেরপুর",           lat: 24.66, lon: 89.42, district: "Bogura",  sample: 1 },
    { id: "l5", type: "sell", crop: "tomato",  kg: 600,  price: 38, name: "Farmer, Rangpur",      bn: "কৃষক, রংপুর",            lat: 25.75, lon: 89.25, district: "Rangpur", sample: 1 },
    { id: "l6", type: "buy",  crop: "maize",   kg: 3000, price: 26, name: "Feed mill",            bn: "ফিড মিল",               lat: 25.70, lon: 89.20, district: "Rangpur", sample: 1 },
    { id: "l7", type: "buy",  crop: "onion",   kg: 700,  price: 62, name: "Wholesaler",           bn: "আড়তদার",               lat: 24.40, lon: 88.62, district: "Rajshahi",sample: 1 }
  ]
};
