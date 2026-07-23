# Active Roadmap & Technical Debt

## Backlog
Real-content placeholders, each marked `TODO(spec §N.M)` inline — search the
codebase for `TODO(spec` before assuming a section is launch-ready:

| task | location | priority |
|---|---|---|
| Portrait cutout + casual photo | `public/assets/`, wired into `index.html` `.hero-silhouette` and `story/index.html` `.story-photo-slot` | blocks launch |
| Testimonials (named, permitted) | uncomment blocks in `index.html` and `results/index.html` | blocks launch |
| Follower history data points | add `data-points='[…]'` on `#follower-card`, unhide its `<svg>` (currently honestly counts up the single real number, 8,331, with no invented curve) | nice-to-have |
| Cal.com link | `data-cal-link` in `schedule/index.html` (e.g. `sampath-kumar/30min`) — fallback shows until set | blocks launch |
| CV PDF + public email | drop `cv.pdf` in `public/assets/`, uncomment CV/email links in `schedule/index.html` | blocks launch |
| Pivot pull-quote (Sampath's own words) | replace placeholder in `story/index.html` `.pivot` | blocks launch |

## Known Tech Debt
- **Homepage design-system divergence** — `index.html`/`main.js` no longer
  match the LOCKED design spec or the rest of the site. Needs a decision:
  revert homepage to the identity system, or update the spec/README to
  match the new direction and finish migrating it properly. See
  [[subsystem-notes]] for the full writeup.
- `src/js/home.js` and `src/styles/home.css` are orphaned — unreferenced by
  any current HTML entry point. Either delete them or re-wire the homepage
  to use them, once the divergence above is resolved.
- No lint or typecheck tooling configured (no ESLint config, no TS) — style
  consistency is currently manual-review-only.
