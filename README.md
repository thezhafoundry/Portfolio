# Sampath Kumar — Portfolio ("The Conversation")

Four-page static site. Vite + vanilla JS. Identity spec:
`docs/superpowers/specs/2026-07-22-sampath-portfolio-design.md` (LOCKED §3).

## Pages
- `/` — Home: hero, follower count, "how the work sounds" thread, CTA
- `/story/` — career told as a conversation, with the engineer→sales pivot
- `/results/` — editorial ledger of roles, Finquest as the anchor
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

## Before launch — real-content TODOs (spec §8)
Search the codebase for `TODO(spec` — each marks where an asset lands:

1. **Portrait** cutout + casual photo → `public/assets/`, wire into the
   `index.html` hero (`.hero-silhouette`) and `story/index.html` (`.story-photo-slot`)
2. **Testimonials** (named, permitted) → uncomment blocks in `index.html`
   and `results/index.html`
3. **Follower history** points → add `data-points='[…]'` on `#follower-card`
   and remove `hidden` from its `<svg>`; without it the card honestly counts
   up the single real number (8,331), no invented curve
4. **Cal.com link** → set `data-cal-link` in `schedule/index.html` to Sampath's
   real link (e.g. `sampath-kumar/30min`); the fallback shows until then
5. **CV PDF + public email** → drop `cv.pdf` in `public/assets/` and uncomment
   the CV/email links in `schedule/index.html`
6. **Pivot pull-quote** (Sampath's own words) → replace the placeholder in
   `story/index.html` `.pivot`

## Design system (do not drift — spec §3)
- Colors: White `#FFFFFF`, Honey `#FFC21A`, Ink `#1E1B12`, Cream `#FFF3CC`. No others.
- Type: Fraunces (display) + Inter (body). Emphasis = italic Ink on a Honey sweep (`.sweep`).
- Motif: speech bubble with typing dots. Radii: 18px cards / full pills / 4px tails.
- Motion: `transform`/`opacity` only; static under `prefers-reduced-motion`.
