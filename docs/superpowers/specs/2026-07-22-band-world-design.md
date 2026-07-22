# Band world (v7) — full screen without bigger fonts or dialog boxes

Date: 2026-07-22 · Status: approved (user chose "full-bleed color bands" over
edge-to-edge panels; explicitly reverted v6's font scaling)

## Correction to v6

"Full screen" meant the layout should fill the screen — not larger type, and
not floating card boxes. Reverted: fluid root font-size, raised h1/h2
ceilings, and the story-page clamp raises. Removed: the margin rails (bands
make gutter furniture redundant).

## The band system (identity.css)

`.band` sections stack edge-to-edge, each carrying a background color across
the full viewport; `.band-inner` (1200px) / `.band-inner--wide` (1500px)
keeps content in a readable centered column. Variants: `--white`, `--cream`,
`--honey`, `--ink` (ink carries the dot-grid and light text). Paper (default,
no variant class) shows the body's dotted ground. No two adjacent bands share
a color on any page.

## Page compositions

- **Home**: white (01 hero + ticker) → honey (stat row) → cream (clients) →
  paper (pull quote) → ink (02 signal path) → white (03 routes) → paper
  (04 conversation) → cream (05 followers) → paper (06) → dark close.
- **Story**: white (head + journey strip) → paper (chapters; honey panel
  still bleeds right at ≥1440px) → cream (close, honey photo slot) → footer.
- **Results**: white (head) → paper (Finquest anchor with bubbles) → white
  (earlier roles as a hairline ledger — no boxes) → dark close.
- **Schedule**: white (sched + cal embed) → paper (links) → footer.

De-carded: hero, stats, clients, night, convo, followers, story head/close,
results head, roles, sched. Secheads moved inside their bands (margins
0 0 space-4; `--solo` modifier for the 06 strip; light variant on ink bands).
Route tiles and speech bubbles keep their card/bubble chrome — they are
components, not containers.

## Kept from v5/v6

Paper ground + dot grid, sticky blurred nav aligned to the 1200px column,
28px brand mark in Fraunces, stat count-ups, journey strip, split-screen
chapters + ghost numeral, honey route hover, dark site-close.
