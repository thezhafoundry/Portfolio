# Sampath Kumar — Portfolio ("Editorial Orchid")

Seven-page static site. Vite + vanilla JS. Design spec:
`docs/superpowers/specs/2026-07-24-editorial-orchid-portfolio-design.md`
(motion rules in §13). Live design tokens are in `src/styles/identity.css`
`:root` — read them there rather than from any spec.

## Pages
- `/` — Home: hero, proof metrics, services, process, CTA
- `/story/` — career told as a conversation, with the engineer→sales pivot
- `/results/` — proof rail (incl. the animated follower count), editorial ledger of roles, Finquest as the anchor
- `/schedule/` — the paid consulting offer (USD 350 / 60-min), Cal.com booking with a designed fallback, and a "payment link after approval" status
- `/policies/terms/`, `/policies/privacy/`, `/policies/refunds/` — public policy pages published for payment-gateway review (see `docs/superpowers/specs/2026-08-02-payment-readiness-pages-design.md`)
- `/404.html` — branded not-found page, served automatically by Netlify/Vercel

## Commands
- `npm install` — install dependencies
- `npm run dev` — dev server (http://localhost:5173)
- `npm run build` — production build to `dist/`
- `npm run preview` — preview the production build
- `npm test` — unit tests (spring physics, graph math, content contracts)

## Deploy
Netlify: connect the repo; `netlify.toml` handles build + publish dir.
(Vercel works too: framework preset "Vite", output `dist`.)

## Code structure
`src/js/` is split by feature, not left flat: `shared/` (nav, motion, reveals,
magnetic, cursor, pip-video — used by 2+ pages), `home/`, `results/`,
`schedule/`, `story/`, `notfound/` — one folder per page entry plus its
exclusive dependencies. Each page's `<script type="module" src="...">` must
point at its own entry; `tests/site-contract.test.js`'s "Page entry-script
wiring" block pins the exact path per page so a page can't silently end up
loading another page's script (this happened once — see
`.agents/context/subsystem-notes.md`).

## Before launch

Verified 2026-08-02 by grepping the live HTML — no `TODO(spec` markers or
placeholder content remain.

1. **Cal.com link** → set `data-cal-link` in `schedule/index.html`. It is
   empty today, so `/schedule/` renders the LinkedIn/phone fallback rather
   than a calendar. **This is the only remaining launch blocker.**
2. **Live Razorpay payment link** (not blocking launch) → `/schedule/` and
   the policy pages intentionally state a payment link is pending approval.
   Out of scope for this repo until the client's Razorpay account is
   approved for international payments.

Nice-to-haves: a real `data-points` history curve for the follower-count
card (currently counts up the one honest real number, 8,331); Playwright /
visual-regression coverage; lint/typecheck tooling (none configured — this
is a small vanilla-JS project with manual style review).

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
