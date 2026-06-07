# Claude Task: Tasheel BNPL checkout real UI slice

You are Claude Code. The user explicitly said Claude should do the design, not Hermes. Treat this as a bounded implementation slice.

Project: `/Users/hadysoliman/tasheel-bnpl-browser-prototype`
Live reference: `https://hades898.github.io/tasheel-bnpl-prototype/checkout`
Figma source: `https://www.figma.com/design/geEFxJ11n2KySAZB6zsjEh/BNPL?node-id=1747-80160`
Checkout node: `1741:78002` (`6.0 — Extrastores Checkout`)
Figma MCP config: `claude-figma-mcp.json` points at `http://127.0.0.1:3845/mcp`.
Figma screenshot already captured by Hermes at `/Users/hadysoliman/.hermes/image_cache/img_e12834faa116.png`.

User requirements:
- Pick up work on the browser-based experience, especially `/checkout`.
- Build actual Expo / React Native / React Native Web UI, not screenshot-only frames.
- Preserve Figma exactly; do not redesign, add a dashboard, alter product scope, or invent a new design language.
- Keep Expo SDK 56.
- Use native-first Expo/RN primitives and web-compatible RN styles.
- Use real source assets when needed. No emoji substitutions if Figma has an asset; if the Figma source itself uses an emoji placeholder, document it rather than inventing replacement art.
- Screenshot exports may remain only as references, not as the primary rendered UI for the real checkout slice.

Important repo state:
- Local `main` is now synced to `origin/main`, but `App.tsx` still renders exported Figma screenshots in a phone mockup.
- Live `/checkout` currently renders a simple actual UI: Extrastores title, product card, payment method options, Tasheel selected, CTA. It looks like a real UI but may be coming from a compiled gh-pages artifact, not source on main.
- Your job is to make source code on main capable of rendering a real UI checkout slice, with routing or state sufficient for `/checkout` web usage.

Mandatory workflow:
1. Inspect `package.json`, `App.tsx`, `figma-extraction-notes.md`, `AGENTS.md`, and the live `/checkout` reference if you can via browser tooling or curl. Use Figma MCP design context/screenshot if available.
2. Implement only the first real UI slice: checkout screen `1741:78002` as actual React Native components. Do not attempt all 18 screens in this run.
3. Keep or add navigation scaffolding only if needed; do not break existing flow assets. Prefer minimal focused changes.
4. Add a validation artifact, e.g. `VALIDATION.md` or update `JOB_STATUS.md`, with: source node, what is real UI vs reference screenshot, commands run, known gaps.
5. Run `npm run typecheck` and `npx expo-doctor`. If web export is configured, run `npm run export:web` or `npm run build` if practical.
6. Do not push to GitHub in this slice. Leave changes local for Hermes to verify.

Design constraints from Figma node 1741:78002:
- Overall mobile frame roughly 390x848/414x860 white background.
- Header/status area: 9:41, title `Extrastores`, subtitle `Complete your purchase`.
- Product card: white, border `#dfe5e5`, radius 12, product thumbnail cell `#f7f7f7`, title `iPhone 16 Pro Max`, subtitle `256GB — Natural Titanium`, price `SAR 6,553.85`.
- Payment section title `Payment Method`.
- Option rows: white cards, border `#dfe5e5`, radius 12, 16px padding, radio circles.
- Selected Tasheel BNPL row: background `#f7f7f7`, border 2 `#121212`, radio selected, title `Tasheel BNPL`, subtitle `Split into 3–12 monthly installments`.
- CTA: black/dark `#121212`, rounded 14, text `Proceed with Tasheel BNPL`.
- Safari bottom tabs/search bar exists in the Figma checkout frame; include it if feasible in this slice, but prioritize the checkout UI fidelity above the browser chrome if time is constrained.

Return a concise final summary with changed files and command results.
