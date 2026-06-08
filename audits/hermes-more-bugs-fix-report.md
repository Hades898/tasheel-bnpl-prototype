# More bugs fix report

Claude was invoked for this pass, but the process produced no output for ~3 minutes and was killed. Hermes applied bounded static-artifact patches and will run Codex read-only review before deployment.

Changed so far:
- `checkout/home.html` and `checkout/details.html`: canonical alias redirects now preserve query/hash and run before Expo Router hydration.
- `checkout/dues.html` and bundled JS: My Dues content is closer to Figma: 4 selected, top amount 1,800, remaining 1,200, Jarir rows, and Pay selected 3,000.
- `checkout/purchases.html`: right close button retained from previous patch.

Known residual risk:
- Static artifact patching can create React hydration warnings if SSR HTML and bundled output are not perfectly rebuilt from source.
- `main` still does not reproduce the deployed semantic full-flow artifact; `gh-pages` remains the current source of truth for these bounded fixes.
