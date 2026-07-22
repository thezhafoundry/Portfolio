# Full-screen treatment, site-wide (v6)

Date: 2026-07-22 · Status: approved ("not only the story page all the page i need it full screen")
Ideas board: https://claude.ai/code/artifact/75afaf07-8aa3-4b9b-9659-20c23e51ebe1

## Principle

Never stretch the reading column — spend the extra width on larger type,
furnished margins, and set-pieces that bleed toward the screen edge.
Breakpoint for the wide world: 1440px.

## Site-wide

- Fluid root: `html { font-size: clamp(16px, 0.55vw + 9.4px, 19px) }` —
  identical below 1200px, everything (type AND rem-based spacing) grows
  smoothly to ~119% by 1920px.
- Type ceilings raised: `--fs-h1` → 5rem, `--fs-h2` → 2.6rem; story figure
  numerals, chapter headings and panel years get taller clamps.
- `.container--wide` grows to 1500px. Default column stays 1200px.
- Nav contents align to the 1200px column via
  `padding-inline: max(gutter, calc((100% - 1200px) / 2))`; brand name set in
  Fraunces at 1.05rem; North Node mark 18px → 28px in the nav (footer stays).
- `.margin-rail` (new shared component, ≥1440px only): fixed in the left
  gutter — honey node, page label in vertical caps, dashed honey tail.
  One per page: Hello / The Story / Results / Schedule.
- On home, the per-sechead thread connectors hide at ≥1440px — the rail
  becomes the spine; connectors continue to serve 861–1439px.

## Per page

- **Home** — hero section joins `container--wide` (stat card stays 1200px and
  straddles the wider hero edge); Night section already wide.
- **Story** — chapters go true split-screen at ≥1440px: section un-caps,
  left list aligns with the column, honey panel spans 44vw and bleeds to the
  right viewport edge at 84vh (left corners rounded only). Panel gains a
  ghost chapter numeral (italic Fraunces, ~15rem, 10% ink) that story.js
  updates with the scroll-spy. Head card: bottom padding becomes a dashed
  honey timeline strip — 9 clickable nodes (scrollIntoView to the chapter),
  year labels on stops 1/3/5/7/9. Head + close cards ride `container--wide`;
  photo slot turns honey so it reads designed, not missing.
- **Results** — head card rides `container--wide`; role ledger stays 1200px
  for bubble readability.
- **Schedule** — sched card rides `container--wide`; cal embed min-height
  600px at ≥1440px.

## Out of scope

Real portrait/photo (§8.1), testimonials (§8.2), Cal.com link (§8.4) — all
still content-blocked.
