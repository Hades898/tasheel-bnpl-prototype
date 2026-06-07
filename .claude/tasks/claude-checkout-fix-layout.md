# Claude Follow-up: Fix checkout viewport fidelity

You implemented the first real Expo/RN checkout slice. Hermes verified it builds, but visual QA found a critical layout issue at `http://127.0.0.1:4174/checkout` in a 1280x579 browser viewport:

- It is actual RN UI now, not screenshot rendering. Good.
- But the checkout content is vertically cropped: Cash on Delivery / Tasheel row area is hidden under the fixed CTA/footer, so the Figma state with all four payment rows visible is not preserved.
- The footer/Safari bar is too tall for short browser heights and overlays content.
- Figma reference `1741:78002` shows the full payment method list, selected Tasheel row, CTA, and Safari bar in the frame.

Task:
1. Fix `src/screens/CheckoutScreen.tsx` so `/checkout` renders the full checkout content without hiding rows behind the footer in typical browser/device previews.
2. Preserve Figma tokens and real RN UI; do not revert to screenshot rendering.
3. Prefer a faithful 390x848 frame scaled-to-fit inside the browser viewport, or another robust layout that keeps the full Figma checkout frame visible. Do not redesign.
4. Add/update a validation artifact (`VALIDATION.md`) documenting:
   - Figma node `1741:78002`
   - Actual UI vs screenshot status
   - Commands run
   - Known remaining gaps
5. Run `npm run typecheck`, `npx expo-doctor`, and `npm run export:web`.
6. Do not push.

Keep this narrow; do not implement other screens in this run.
