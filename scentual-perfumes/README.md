# Scentual Perfumes

Storefront for **Scentual Perfumes** (Kuwait). Customers browse 650+ inspired fragrances and place orders. Orders and stock go through the shop's inventory system (TradeMax).

The repo is a small monorepo, so the upcoming iOS/Android apps can reuse the same catalog, pricing, and order logic:

```
packages/core   Platform-agnostic TypeScript: catalog, cart + bundle pricing, order building,
                Kuwait address/phone validation, EN/AR strings, TradeMax adapter.
                No DOM/React imports, so it can be reused by Expo / React Native.
apps/web        Vite + React + Framer Motion storefront with 5 design directions.
apps/api        Zero-dependency Node server. It sits between all apps and TradeMax
                (keeps the API key off devices, recomputes totals, queues orders if TradeMax is down).
scripts/        import_catalog.py: spreadsheet → packages/core/src/data/catalog.json
data/           Source perfume list (ARGEVILL / LUZI / SELUZ sheets)
```

## Run it

Requires Node 22.18 or newer (the API and tests run TypeScript natively).

```bash
npm install
npm run dev:api     # http://localhost:8787  (demo mode until TradeMax env vars are set)
npm run dev         # http://localhost:5173  (proxies /api to the API)
npm test            # core pricing / validation tests
npm run typecheck
```

Switch designs with the floating pill at the bottom, or with `?v=noir|majlis|atelier|prism|dunes`.

## The 5 designs

| # | Name | Feel | Signature animations |
|---|------|------|----------------------|
| 1 | **Noir Ember** | Cinematic dark luxury, gold on black | Ember particle canvas, parallax hero, scroll-pinned horizontal gallery, cursor-glow cards, magnetic CTA, counting offer |
| 2 | **Majlis** | Arabian heritage, navy, gold and smoke | Self-drawing 8-point star (from the SP logo), arched product cards with lattice, incense smoke on hover, 3D card rise |
| 3 | **Atelier** | Light editorial (Le Labo / Byredo feel) | Clip-path hero that opens on scroll, parallax editorial rows, note marquee, scroll progress bar |
| 4 | **Prism** | Fresh, playful, gen-Z bento | 3D tilt cards with sheen, morphing gradient blobs, floating bottles, animated scent-finder quiz |
| 5 | **Moods** | Immersive scroll story | Full-screen mood chapters with background colour morph, "shop this mood" filtering, flip cards |

All five share the same features:
- Search plus gender, family, and collection filters, with an animated grid and infinite load.
- Quick view with size choice.
- Bag drawer with a live **5 × 100ml = 20 KWD** meter.
- Checkout with Kuwait governorate, area, block, street, and house fields, and mobile number validation.
- Animated order confirmation with a WhatsApp hand-off.
- Full **English / Arabic (RTL)** toggle.
- Respects `prefers-reduced-motion`.

Products without a photo get a generated SVG bottle with an animated liquid level. The colour comes from the scent family, so 650 items don't look identical. The campaign photos are used for the products they show.

## Pricing (placeholder — confirm with the shop)

These values live in `packages/core/src/config.ts`:
- 100ml = 6 KWD, 200ml = 10 KWD
- Any 5 × 100ml = 20 KWD, with free delivery (the current campaign)
- Otherwise delivery is 2 KWD, and free from 20 KWD
- `whatsapp` number: **replace `96500000000`**

When TradeMax returns prices, they override these per SKU.

## TradeMax integration

```
web / iOS / Android ──► apps/api ──► TradeMax
                         │  GET  /api/stock    (cached 5 min, overlays stock + prices by SKU)
                         │  POST /api/orders   (validates, recomputes totals, submits)
                         └─ data/orders.json   (queue if TradeMax is unreachable, retried every 5 min)
```

To go live:
1. Copy `.env.example` to `.env` and set `TRADEMAX_BASE_URL`, `TRADEMAX_API_KEY`, and optionally `TRADEMAX_BRANCH_ID` and the endpoint paths.
2. Edit **only** `apps/api/src/trademax-mapping.ts` to match TradeMax's real field names. The current names (`ItemCode`, `QtyOnHand`, …) are placeholders.
3. Make catalog `sku`s match TradeMax item codes: either re-export the item list with codes and extend `scripts/import_catalog.py`, or add a lookup table in the mapping file.

Without credentials the API runs in **demo mode**: orders get a reference and the WhatsApp hand-off, but nothing is sent to TradeMax.

> We still need from the shop: TradeMax API docs (or an export format), credentials, item codes per perfume, real prices, the WhatsApp number, and confirmation of KNET / online payment (MyFatoorah / Tap can be added in `apps/api`).

## Updating the catalog

```bash
npm run catalog    # re-reads data/perfume_list.xlsx
```

Gender and scent family are inferred from the product names. Edit the regex lists in `scripts/import_catalog.py`, or add explicit columns to the sheet.

## Mobile apps (next)

Add `apps/mobile` (Expo) and import `@scentual/core`. The cart, totals, validation, and API contract are already shared. Send `channel: 'ios' | 'android'` with orders.
