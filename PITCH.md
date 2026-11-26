# KrishiBondhu: 2-minute pitch

**0:00 Problem.** Farmers in Bangladesh spot crop disease late, do not hear what is happening in the next village,
and lose produce on the way to market.

**0:20 Diagnose.** Speak or type in Bangla, add a photo. The app names the disease: organic first, chemical second,
always with the label and extension-officer warning.

**0:40 Outbreak map.** When four farms within 5 km report the same disease, the map lights up an alert.
(Most demo points are sample data.)

**1:00 Field to market.** Enter crop, distance and days: see expected loss and net income. Compare eight markets,
find the nearest collection point or cold store, and match with buyers.

**1:30 For everyone.** USSD, voice and SMS for button phones. The app still works offline.

**1:45 Close.** Catch disease early, lose less, sell at the right market.

## Demo checklist
1. Open the site, log in with the demo account.
2. Press **Tour** on the home page (about 40 s), or follow the steps above by hand.
3. Toggle night mode (top right) to show the scene change.
4. If asked about data: prices, markets, collection points and posts are sample data; the logic is real and unit-tested.

## Scorecard map
| Criterion | Where to look |
|---|---|
| Problem solving (25) | Outbreak map, Field to market |
| Functionality (25) | Diagnose, 16 working pages, offline PWA, optional Gemini function |
| UI/UX and accessibility (20) | Bangla/English, day/night, keyboard focus, skip link, reduced motion, voice input |
| Innovation (15) | 5 km / 4-farm alerts, disease risk feeding the market estimate, USSD/IVR/SMS |
| Code quality (10) | Split css/js/data, DOM-free logic module with tests, README |
| Demo (5) | media/demo.mp4, Tour button, this script |
