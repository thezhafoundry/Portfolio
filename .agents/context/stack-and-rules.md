# Invariants, Tech Stack & File Map

## Tech Stack
- Build: Vite 5, multi-page (`vite.config.js` `rollupOptions.input` lists
  every HTML entry: `index.html`, `story/index.html`, `results/index.html`,
  `schedule/index.html`, `policies/{terms,privacy,refunds}/index.html`,
  `404.html`). A new page must be added there or it's excluded from
  `npm run build`.
- No framework, no TypeScript. Plain ES modules under `src/js/`, organized by
  feature folder (see File Map below), plain CSS with custom properties under
  `src/styles/` (flat — one file per page plus `identity.css`/`components.css`
  shared foundations; low enough file count that a folder split wasn't worth
  the churn when `src/js/` was restructured on 2026-08-02).
- Tests: Vitest (`npm test`), unit-only, no DOM/integration layer — see
  `tests/*.test.js`.
- Fonts: Google Fonts CDN, Cormorant Garamond (display) + DM Sans (body) +
  Great Vibes (signature), loaded identically on every page. No icon font —
  Font Awesome was removed during the Editorial Orchid convergence; if you see
  a reference to it anywhere, that doc is stale.
- Booking: Cal.com embed (`src/js/schedule/scheduler.js`) on `/schedule/`,
  with a designed fallback when no `data-cal-link` is configured (currently
  empty — see the launch blocker in `active-backlog.md`).
- Payments: no live integration. `/schedule/` explicitly states a payment
  link will be added after the account holder's Razorpay approval; the three
  `/policies/*/` pages exist to satisfy that review. Do not add a Razorpay
  key, checkout script, or backend until a real approved link exists.
- Deploy: Netlify (`netlify.toml`: `npm run build` → publish `dist/`); Vercel
  also works (framework preset "Vite", output `dist`).
- No backend, no database, no auth — this is a static marketing site.

## Hard Invariants
- The governing spec is
  `docs/superpowers/specs/2026-07-24-editorial-orchid-portfolio-design.md`.
  The old "The Conversation" spec (Honey/Ink/Cream, Fraunces+Inter, LOCKED §3)
  was **deleted 2026-07-25** — superseded and actively misleading. Recover from
  git history if the rationale is needed. Several other pre-Editorial-Orchid
  design-iteration plans/specs (band-world, fullscreen, signal-path,
  visual-upgrade, night-window, hero-violet) and a stale verification report
  were deleted the same way on **2026-08-02** for the same reason.
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
  `prefersReducedMotion()` (`src/js/shared/motion.js`).
- Real numbers only: no invented data. e.g. the follower-count card counts up
  the one real number (8,331) honestly rather than faking a history curve
  until real `data-points` are supplied (see `active-backlog.md`).
- **Each page must load its own entry script**, not another page's. This is
  now a contract test (`tests/site-contract.test.js`, "Page entry-script
  wiring") — added 2026-08-02 after a bulk redesign silently swapped
  `results/index.html`'s script tag to `main.js`, orphaning the follower
  counter for over a week with no test catching it. See `subsystem-notes.md`.

## File Map
`src/js/` is organized by feature, not left flat:
- `src/js/shared/` — used by 2+ pages: `nav.js`, `motion.js`, `bubbles.js`
  (reveals), `magnetic.js`, `cursor.js`, `pip-video.js`.
- `src/js/home/` — `main.js` (entry) and its exclusive deps: `media.js`,
  `glow.js`, `greeting.js`, `louver.js`, `odometer.js`, `simulator.js`,
  `process-engine.js`, `ticker.js`, `youtube-modal.js`.
- `src/js/results/` — `results.js` (entry), `graph.js` (follower spring
  counter).
- `src/js/schedule/` — `schedule-page.js` (entry), `scheduler.js` (Cal.com).
- `src/js/story/` — `story.js` (entry).
- `src/js/notfound/` — `notfound.js` (entry, for `404.html`).

Full architecture description (page ↔ script ↔ stylesheet wiring, shared
module responsibilities) lives in the repo's `CLAUDE.md` — read that first,
this file adds invariants/gotchas it doesn't cover.
