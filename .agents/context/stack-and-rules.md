# Invariants, Tech Stack & File Map

## Tech Stack
- Build: Vite 5, multi-page (`vite.config.js` `rollupOptions.input` lists
  every HTML entry: `index.html`, `story/index.html`, `results/index.html`,
  `schedule/index.html`). A new page must be added there or it's excluded
  from `npm run build`.
- No framework, no TypeScript. Plain ES modules under `src/js/`, plain CSS
  with custom properties under `src/styles/`.
- Tests: Vitest (`npm test`), unit-only, no DOM/integration layer — see
  `tests/*.test.js`.
- Fonts/icons: Google Fonts CDN (Fraunces + Inter on the identity-system
  pages; Inter + Plus Jakarta Sans on the current homepage — see divergence
  note in `subsystem-notes.md`); Font Awesome 6.5.1 via cdnjs (homepage only).
- Booking: Cal.com embed (`src/js/scheduler.js`) on `/schedule/`, with a
  designed fallback when no `data-cal-link` is configured.
- Deploy: Netlify (`netlify.toml`: `npm run build` → publish `dist/`); Vercel
  also works (framework preset "Vite", output `dist`).
- No backend, no database, no auth — this is a static marketing site.

## Hard Invariants
- `docs/superpowers/specs/2026-07-22-sampath-portfolio-design.md` §3 is
  marked **LOCKED**: colors White `#FFFFFF` / Honey `#FFC21A` / Ink `#1E1B12`
  / Cream `#FFF3CC` only, Fraunces (display) + Inter (body), bubble-with-
  typing-dots motif, `transform`/`opacity`-only motion, static under
  `prefers-reduced-motion`. **This is currently violated by `index.html`**
  — see `subsystem-notes.md` before touching the homepage.
- Every scroll/reveal/typing animation must short-circuit via
  `prefersReducedMotion()` (`src/js/motion.js`).
- Real numbers only: no invented data. e.g. the follower-count card counts up
  the one real number (8,331) honestly rather than faking a history curve
  until real `data-points` are supplied (see `active-backlog.md`).

## File Map
Full architecture description (page ↔ script ↔ stylesheet wiring, shared
module responsibilities) lives in the repo's `CLAUDE.md` — read that first,
this file adds invariants/gotchas it doesn't cover.
