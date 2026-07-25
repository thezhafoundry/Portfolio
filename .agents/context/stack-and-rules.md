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
- The governing spec is
  `docs/superpowers/specs/2026-07-24-editorial-orchid-portfolio-design.md`.
  The old "The Conversation" spec (Honey/Ink/Cream, Fraunces+Inter, LOCKED §3)
  was **deleted 2026-07-25** — superseded and actively misleading. Recover from
  git history if the rationale is needed.
- Live tokens are in `src/styles/identity.css` `:root` — read them there, not
  from any spec: violet/orchid (`--color-violet: #6b21a8`), Cormorant Garamond
  / DM Sans / Great Vibes.
- **Motion is governed by §13** of the current spec: `transform`/`opacity` for
  most effects; buttons and links 140–180ms; accordions 240–300ms; hero
  entrance 350–550ms; no scroll hijacking, looping floats, long counter
  animations, or large parallax; reduced motion removes movement while
  preserving content and state. Shared tokens: `--ease-out`/`--ease-in-out`,
  `--duration-press` 160ms / `--duration-hover` 180ms / `--duration-surface`
  260ms. Never `transition: all`.
- Every scroll/reveal/typing animation must short-circuit via
  `prefersReducedMotion()` (`src/js/motion.js`).
- Real numbers only: no invented data. e.g. the follower-count card counts up
  the one real number (8,331) honestly rather than faking a history curve
  until real `data-points` are supplied (see `active-backlog.md`).

## File Map
Full architecture description (page ↔ script ↔ stylesheet wiring, shared
module responsibilities) lives in the repo's `CLAUDE.md` — read that first,
this file adds invariants/gotchas it doesn't cover.
