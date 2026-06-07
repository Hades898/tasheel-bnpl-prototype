# Tasheel BNPL Checkout Validation

Date: 2026-06-07
Scope: first real-UI browser slice for `/checkout`

## Source

- Figma root flow: `1747:80160`
- Implemented Figma node: `1741:78002` — `6.0 — Extrastores Checkout`
- Figma screenshot captured by Hermes: `/Users/hadysoliman/.hermes/image_cache/img_e12834faa116.png`
- Live reference audited before work: `https://hades898.github.io/tasheel-bnpl-prototype/checkout`

## Implementation status

- `/checkout` now renders actual Expo / React Native / React Native Web primitives via `src/screens/CheckoutScreen.tsx`.
- Existing screenshot-based gallery flow was preserved separately in `src/PrototypeGallery.tsx` for non-checkout paths.
- `App.tsx` now routes web paths containing `checkout` to the real checkout UI; native defaults to the checkout UI.
- The real checkout frame is scaled to fit the browser viewport so all four payment options, selected Tasheel row, CTA, Safari bar, and home indicator remain visible in short desktop previews.

## Asset / fidelity notes

- The checkout screen no longer uses exported Figma frame screenshots as its primary rendered UI.
- The product thumbnail is still the phone emoji because the Figma node itself uses an emoji placeholder for that thumbnail. This is documented, not an invented replacement.
- Status and Safari controls are recreated with RN views/shapes rather than remote SVG assets; this is acceptable for the first slice but should be revisited if exact browser-chrome icon geometry matters.

## Commands run

```bash
npm run typecheck
npx expo-doctor
npm run export:web
```

Results:

- TypeScript: passed
- Expo Doctor: 21/21 checks passed
- Expo web export: passed; output written to `dist/`
- Browser QA: opened `http://127.0.0.1:4174/checkout?b=2`; 0 JavaScript errors

## Visual QA

Local rendered URL:

`http://127.0.0.1:4174/checkout?b=2`

Observed after Claude layout fix:

- Full checkout frame is visible in the browser viewport.
- Product card, payment section, all four options, selected Tasheel row, CTA, Safari search bar, and home indicator are visible.
- The screen is actual selectable UI: payment rows are accessibility radios and CTA is a button.

## Known remaining gaps for next Claude slice

1. Pixel tuning still needed against Figma screenshot:
   - Typography appears slightly heavier/smaller after scale-to-fit.
   - Product card and option row vertical spacing should be compared numerically.
   - Safari chrome icons are approximated with RN shapes.
2. No side-by-side pixel-diff script has been committed yet.
3. Only checkout node `1741:78002` has been converted to real UI; the rest of the flow remains screenshot-gallery/reference mode.

## Completion judgment

First Claude-owned real-UI slice is complete and verified locally. Next slice should ask Claude to either pixel-tune checkout against the Figma screenshot or convert the next flow screen (`1741:78634` Confirm Mobile Number) into actual Expo UI.
