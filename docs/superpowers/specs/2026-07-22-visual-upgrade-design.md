# Visual Upgrade — "from clean to alive" (v5)

Date: 2026-07-22 · Status: approved (ideas board reviewed by Sampath, "do it")
Ideas board artifact: https://claude.ai/code/artifact/2a2f95f2-f04d-492b-a6b9-7985fd14ba86

## Diagnosis

The site read as empty/basic because: white cards sat on a pure-white body,
`.container` had no max-width, the hero used a placeholder silhouette, sections
were sparse with 5–7.5rem gaps and nothing structuring them, and all social
proof (employers, testimonials, chart) was hidden or absent.

## The moves (all within the locked identity — no new colors, radii, or faces)

1. **Warm the ground.** New token `--paper: #FBF6E8` on `body` with a faint
   ink dot-grid (the Night panel texture at ~4%, site-wide). Cards stay white
   and gain a soft warm shadow so they sit on the paper as objects.
2. **Hero works harder.** `--fs-h1` max raised to 4.5rem. A white reply-bubble
   badge (9.2/10) pins to the portrait. A slow marquee of the 12 markets runs
   along the hero card's bottom edge (aria-hidden, killed by reduced-motion).
   Real cutout portrait remains a content TODO (spec §8.1) — silhouette stays
   until the photo arrives.
3. **Cap the column.** `.container` max-width 1200px, centered. The Night
   section gets `.container--wide` (1400px) and the dark closing panel is
   full-bleed — contained column → wide → bleed is the page's width rhythm.
4. **Section thread.** Every sechead number gets a honey node; a 2px dashed
   honey line rises from each node up through the section gap, connecting
   01→06 as one signal path. Pure CSS, sits only in the empty gap.
5. **Credibility band.** Slim cream band after the stat row: "Teams I've
   filled calendars for" + seven employer wordmarks in italic Fraunces at
   ~65% opacity, honey-dot separated. No logo files needed.
6. **Stat row replaces proof bubbles.** The four hero-edge bubbles retire in
   favor of a white stat card slightly overlapping the hero's bottom edge:
   35% / 9.2 / 200M+ / 12 in display-scale Fraunces with count-up on scroll
   (tabular-nums; decimals supported for 9.2).
7. **A conversation on the home page.** New section 04 "How it sounds": a
   four-message anonymized client exchange in existing thread/bubble
   components, revealed on scroll, ending on live typing dots.
8. **Detail pass.** Sticky nav with paper-tinted blur backdrop. Route cards
   get a honey wash sweeping in from the left on hover.
9. **One dark ending.** `.cta-band` + `.site-footer` merge into a single
   full-bleed dark `.site-close` panel (display-scale headline, honey button,
   LinkedIn, fine print) on home and results. Story/schedule keep the plain
   dark footer. Dark now appears exactly twice: Night panel and the close.

Home section order becomes: 01 Hello (hero + stats + clients) · 02 The Signal
Path · 03 Where hellos have led · 04 How it sounds · 05 From zero · 06 Say
hello. All `of` counters update to /06.

## Out of scope

Follower curve stays hidden (no invented data, §8.3). Testimonials stay
commented out until real quotes arrive (§8.2). Real portrait pending photo.
