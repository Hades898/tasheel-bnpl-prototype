**P0:** None found.

**P1:** None found.

**P2:**
- `checkout/dues.html` SSR summary and hydrated bundle now agree on the top summary/CTA: `4 Dues Selected`, `1,800`, `Remaining 1,200`, Pay selected `1,800`.
- Minor dues inconsistency remains: SSR markup still visually leaves the 4th due card unselected while the hydrated JS initializes all 4 as selected. Not a deploy blocker, but it can cause a small visual change during hydration.
- Dues checkbox taps are now no-op in the hydrated bundle. This avoids summary drift, but the controls still advertise checkbox semantics.
- Alias routes are redirect stubs, not full exports: `/checkout/home` -> `/checkout/app-home`, `/checkout/details` -> `/checkout/detail`. Acceptable for this patched gh-pages artifact.
- No fake Safari chrome found in the changed route HTML. The only Safari/chrome hits are runtime UA/font-loader code and unrelated copy in the bundle.

Route preservation looks intact. The route list still includes `checkout/app-home.html`, `checkout/detail.html`, `checkout/dues.html`, `checkout/purchases.html`, plus the new `checkout/home.html` and `checkout/details.html` aliases.

**Deploy verdict:** Go for deploying this patched gh-pages artifact. No P0/P1 blockers found in the changed files plus route list.