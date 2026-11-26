# KrishiBondhu

Catch crop disease early and lose less on the way to market. Built for the hackathon theme
**Power Everyday Business → Agriculture & Local Supply Chains**.

- Diagnose a crop from a photo, Bangla voice or text (organic advice first, chemical advice always with a label warning)
- 64-district outbreak map: 4+ farms with the same disease within 5 km in 14 days raises an alert
- **Field to market**: loss estimator, best market by net income with 7-day price trends, nearest collection point or cold store, buyer-seller match board
- USSD, IVR and SMS demos for button phones, weather advice, crop guide, field-agent desk
- Bangla / English, day / night mode, installable offline PWA

## Deploy on Netlify (no build step)
1. Go to https://app.netlify.com/drop
2. Drag the **unzipped folder** (or this zip) onto the page.

Demo login: `judge@krishibondhu.app` / `DemoPass2026!`

## Real AI diagnosis (optional)
`netlify/functions/api.js` calls Gemini. Without a key the site runs in demo mode (keyword matching).
1. Netlify > Site settings > Environment variables: `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`)
2. Redeploy. The badge in the corner changes from "Demo mode" to "AI mode".

Netlify Drop may not deploy functions. If the badge stays on "Demo mode" after you set the key,
deploy with Git or the Netlify CLI (`netlify deploy --prod`) instead.

## Run locally
```bash
python3 -m http.server 8080      # then open http://localhost:8080
npm test                          # runs tests/market.test.js (needs Node 18+)
```

## Project structure
```
index.html                markup
css/app.css               core styles
css/extras.css            motion, night/day scenes, login, market hub, pitch page
js/app.js                 core app (routing, diagnosis, map, weather, USSD...)
js/extras.js              scenes, tour, Field-to-Market hub, pitch page
js/market-logic.js        pure supply-chain logic (no DOM, unit-tested)
js/data-geo-kb.js         district outlines and the disease knowledge base
data/market-data.js       SAMPLE prices, markets, collection points, listings
assets/                   fonts and photos
media/                    demo video and poster
netlify/functions/        optional Gemini function
tests/market.test.js      8 unit tests
```
`js/extras.js` talks to `js/app.js` only through the small `window.AP` bridge.

## Honest notes
- Most map points, market prices, collection points and buyer/seller posts are **sample data** and are labelled so in the UI.
- Loss rates, freight cost and the road-distance factor are assumptions (see top of `js/market-logic.js`).
- Posts and pickup requests live in the browser only (localStorage); no phone numbers are collected.
- The advice is guidance and does not replace an agriculture extension officer.
