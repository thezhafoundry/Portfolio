# Sampath Kumar — Portfolio ("Editorial Orchid")

Four-page static site. Vite + vanilla JS. Design spec:
`docs/superpowers/specs/2026-07-24-editorial-orchid-portfolio-design.md`
(motion rules in §13). Live design tokens are in `src/styles/identity.css`
`:root` — read them there rather than from any spec.

## Pages
- `/` — Home: hero, proof metrics, services, process, CTA
- `/story/` — career told as a conversation, with the engineer→sales pivot
- `/results/` — proof rail (incl. the animated follower count), editorial ledger of roles, Finquest as the anchor
- `/schedule/` — Cal.com booking (emails both parties) with a designed fallback

## Commands
- `npm install` — install dependencies
- `npm run dev` — dev server (http://localhost:5173)
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build
- `npm test` — unit tests (spring physics, graph math)

## Deploy
Netlify: connect the repo; `netlify.toml` handles build + publish dir.
(Vercel works too: framework preset "Vite", output `dist`.)

## Before launch — real-content TODOs

Verified 2026-07-25. The older list here named `TODO(spec` markers and CSS
hooks (`.hero-silhouette`, `.story-photo-slot`, `.pivot` placeholder,
testimonial comment blocks) that **no longer exist** — the redesign removed
them, and portraits are already in `assets/`. What actually remains:

1. **Cal.com link** → set `data-cal-link` in `schedule/index.html` (e.g.
   `sampath-kumar/30min`). It is empty today, so `/schedule/` renders the
   LinkedIn fallback rather than a calendar. **This is the only launch blocker.**
2. **CV PDF + public email** (optional) → no CV link or `cv.pdf` exists yet;
   add both if the recruiter path matters.
3. **Follower history curve** (nice-to-have) → `renderFollowerCard` will draw a
   real curve if given `data-points='[…]'` on `#follower-card` in
   `results/index.html`. Without it the card counts up the single real
   number (8,331) — honest by construction, no invented curve.

## Design system (do not drift)

Governed by `docs/superpowers/specs/2026-07-24-editorial-orchid-portfolio-design.md`.
**Read live values from `src/styles/identity.css` `:root`, not from this file.**

- Colors: violet/orchid — `--color-violet: #6b21a8`, `--color-deep-violet: #2e1065`,
  `--color-orchid`, `--color-canvas`, `--color-section`, `--color-highlight`.
- Type: Cormorant Garamond (display) + DM Sans (body) + Great Vibes (signature).
  Emphasis = `.sweep`.
- Motion (spec §13): `transform`/`opacity` only. Buttons and links 140–180ms,
  accordions 240–300ms, hero entrance 350–550ms. No `transition: all`. Hover
  motion is gated behind `(hover: hover) and (pointer: fine)`. Everything is
  static under `prefers-reduced-motion`. Tokens: `--ease-out`, `--ease-in-out`,
  `--duration-press` / `--duration-hover` / `--duration-surface`.
