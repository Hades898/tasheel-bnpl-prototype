# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

## UI / Frontend Quality

For app UI, mobile flows, visual polish, frontend implementation, or responsive web output, consult `/Users/hadysoliman/.codex/refs/UI-EMPOWERMENT-PACK.md` before substantial changes.

Use a real reference first: Figma, Mobbin mobile patterns, a screenshot, or a relevant `DESIGN.md` from `/Users/hadysoliman/refs/awesome-design-md`. Load `design-taste-frontend`, `gpt-taste`, or `imagegen-frontend-mobile` when visual judgment matters.

Apply the pack's quality rules:

- Lead with user outcomes and task clarity, not decorative screens.
- Use clear hierarchy, semantic structure where the platform supports it, accessible labels, keyboard/screen-reader-friendly controls, and stable responsive dimensions.
- Include loading, empty, error, and success states for async flows.
- Avoid generic AI slop: purple gradients, decorative blobs, card-in-card layouts, one-note palettes, weak hierarchy, and text overflow.
- Use project/platform components first. For web-specific shadcn work, query shadcn MCP and follow composition trees; for Expo/React Native, use established project primitives and do not hand-roll generic controls without reason.
- For forms, keep validation logic separate from rendering, provide labels/errors, and keep the flow minimal.
- For significant UI work, run the app locally and verify desktop/mobile or device-sized screenshots, accessibility basics, text fit, interaction states, and performance-sensitive layout stability.
- In summaries, report component sources used: project primitives, Expo/React Native APIs, shadcn registry/MCP, Figma/Mobbin reference, Magic UI, or custom implementation with a reason.
