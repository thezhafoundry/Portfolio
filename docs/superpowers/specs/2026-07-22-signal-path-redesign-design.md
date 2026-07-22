# Signal Path Redesign — "The Night Window" Design Spec

**Date:** 2026-07-22
**Status:** Approved direction (user-selected via visual companion, 4 rounds)
**Amends:** `2026-07-22-sampath-portfolio-design.md` (identity v2 → v3)
**Motion:** Explicitly parked by user — keep existing motion, add none in this phase.

## 1. What the user asked for

The current site read as too empty and too simple. Through four mockup rounds the
user selected, in order:

1. Blend of "The DM" (chat energy) and "12 Markets Wide" (dark dot-grid world) —
   but structured as a portfolio page, **not** a chat interface.
2. Countries/map removed; replaced by **V1 "The Signal Path"** — the pipeline as
   a glowing constellation (RESEARCH → OUTREACH → QUALIFIED → MEETING ✓).
3. Logo: **"The North Node"** — one glowing honey node with a dashed orbit and a
   satellite dot.
4. Scope: the site stays **light** (white/cream base, honey accents). The dark
   theme appears in exactly **one place**, mid-page on the home page —
   composition **"1 — The Night Window"**.

## 2. Identity amendments (v3)

The v2 identity remains in force except where amended here.

### 2.1 Background flip

- Page base is now **White** (`#FFFFFF`) site-wide — no longer the full-Honey world.
- **Honey** (`#FFC21A`) is demoted from world-background to accent: the hero
  portrait shape, primary buttons, emphasis sweeps, proof bubble, CTA band.
- **Cream** (`#FFF3CC`) fills quiet panels (followers card, pills, hovers).
- White cards sitting on the white base gain a 1px hairline border
  (`rgba(30,27,18,.08)`) so edges still read.

### 2.2 The Night panel (new, used once)

- Background **Ink** (`#1E1B12`) with a dot-grid texture:
  `radial-gradient` dots of Cream at ~13% alpha, ~8px spacing.
- Glow effects use Honey at low alpha (box-shadow / SVG blur). These are tints
  of existing palette colors, not new colors.
- Text on the panel: White headings, Cream at ~75% for secondary text.
- **Constraint: exactly one Night panel exists on the site** (home, mid-page).
  No other section may go dark.

### 2.3 Logo — the North Node

Replaces the typing-bubble mark everywhere (nav on all 4 pages, favicon.svg,
loading states that used the bubble mark).

- Geometry: solid Honey node (glow at low alpha) + dashed orbit circle
  (Cream/Ink at low alpha depending on background) + one small Honey satellite
  dot on the orbit's upper right.
- Nav size ~15px; favicon renders node + orbit + satellite only (no glow).
- The typing-dots motif may survive *inside* content (thread bubbles on other
  pages) but is no longer the brand mark.

## 3. Home page composition (top to bottom)

1. **Nav** — North Node mark + "Sampath Kumar", links (Story / Results /
   Schedule), Ink pill button "Say hello". Light background.
2. **Hero** — white card, hairline border. Left: label pill, existing headline
   ("Every deal begins with *hello.* I say it 12 markets wide."), sub, CTAs.
   Right: existing Honey portrait shape + silhouette (unchanged, still awaiting
   real cutout per v2 §8.1).
3. **Proof band** — four real-stat bubbles overlapping the hero card's bottom
   edge, mixed styles: Ink "7+ yrs", White "+35% lead→meeting", Honey "9.2/10
   client satisfaction", White "200M+ companies mapped". Z-index above hero.
4. **The Night Window** — the single dark panel. Title (Fraunces, white):
   "How a cold name becomes a *meeting*" (em in Honey italic). Below, the
   Signal Path constellation: four nodes of increasing size/brightness
   connected by dashed Honey lines, chip labels RESEARCH → OUTREACH →
   QUALIFIED → MEETING ✓ (chips: white 7% fill, Cream 30% border, Cream text).
   Final node carries a check glyph. Pure SVG/CSS, no library. Static in this
   phase (motion parked).
   - This section **replaces** the old "How the work sounds" thread on home.
     A single caption line sits under the constellation: "200M+ companies
     filtered, outreach tuned per market, calendars filled — scored 9.2/10."
     Full thread copy lives on in /story/.
5. **Win routes** — 2×2 grid (stack on mobile) of white hairline cards, each a
   real Finquest outcome with a flight-code label over a dashed rule:
   - COLD → MEETING · "+35% conversion" · rewrote the outreach playbook
   - MONTHS → WEEKS · "Full market mapped" · for a PE investment thesis
   - ZERO → 200M+ · "Company atlas built" · buy-side & sell-side coverage
   - HELLO → 9.2/10 · "Clients keep replying" · satisfaction, measured
   Each card links to /results/.
6. **Followers card** — retained (real 8,331 figure, honest-fallback rules from
   v2 §8.3 unchanged), restyled as a quiet Cream panel.
7. **CTA band** — Honey band: "Your pipeline is one *hello* away." + Ink
   "Schedule" button.
8. **Footer** — unchanged structure; swap bubble mark for North Node.

## 4. Other pages (Story / Results / Schedule)

Token-level restyle only, for coherence — no recomposition:

- Background Honey → White; cards gain the hairline border; Cream panels where
  the honey world previously provided contrast.
- Nav/footer/favicon get the North Node mark.
- No Night panel on these pages (see §2.2 constraint).

## 5. Motion

Parked by explicit user instruction. Existing behaviors (typing headline,
scroll reveals, hero entrance springs, follower count-up) are kept as-is and
must keep working after the restyle. No new animation. The Night Window ships
static; animating the constellation is a candidate for a later phase.

## 6. Error handling / integrity

- All stats are real (source: `linkedin-profile.md`). No invented numbers.
- v2 honest-fallback rules stay: no fabricated follower curve, testimonial
  section stays hidden until real quotes exist.
- `prefers-reduced-motion` continues to disable existing motion.
- Night panel must pass WCAG AA: White/Cream text on Ink passes; chip text at
  small sizes uses Cream at full opacity.

## 7. Testing

- Existing vitest suites (`graph.test.js`, `motion.test.js`) must still pass —
  the restyle should not touch their modules.
- Manual verification at 320px / 860px / desktop: proof band doesn't cover the
  hero headline; constellation chips don't overlap illegibly on mobile
  (constellation may restack vertically under 640px).

## 8. Out of scope

- Night Window animation, ticker, notification toasts, ghost hellos (rejected
  or deferred during mockup rounds).
- Real portrait cutout and testimonials (still awaiting assets, v2 §8).
- Any fifth color or new typeface.
