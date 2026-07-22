# Sampath Kumar Portfolio — "The Conversation" Design Spec

**Date:** 2026-07-22
**Status:** Approved direction; identity locked (v2); awaiting content assets (§8)
**Source content:** `linkedin-profile.md` (real profile data, captured 2026-07-22)

## 1. Purpose & audience

Personal brand site for Sampath Kumar — B2B lead-generation & pre-sales leader
(7+ years; most recently Senior Lead Generation Manager at Finquest).

Priority order (user-confirmed):

1. **Personal brand** — authority and memorability for his network and industry peers.
2. **Win clients** — founders/PE firms/sales leaders who might engage him; path ends in a booked meeting.
3. **Land a job** — recruiters; CV download available but not the lead action.

Primary conversion: **a scheduled meeting** (Cal.com embed, which emails both parties).

## 2. Design concept — "The Conversation"

Conversations are his product; the site performs them. The visitor is greeted,
shown proof as replies, and invited to say hello back. Chosen over 12 rejected
directions across 4 rounds; composition anatomy follows the user's reference
screenshot (white card on yellow world, greeting left, portrait right in a
yellow shape) with the meaningless blob replaced by the brand's speech bubble.

## 3. Identity sheet (LOCKED — v2)

Every downstream decision defers to this section.

### 3.1 Palette — four colors, no additions

| Name | Hex | Role |
|---|---|---|
| White | `#FFFFFF` | The card. All reading happens on white. |
| Honey | `#FFC21A` | The world behind cards; bubbles; primary buttons; emphasis sweeps. |
| Ink | `#1E1B12` | All text; dark reply-bubbles; footer. |
| Cream | `#FFF3CC` | Soft fills: typing pills, hovers, quiet panels. |

- **Amber was removed by user amendment.** No standalone accent color exists.
- **Emphasis rule:** emphasized words are *italic Ink on a Honey sweep*
  (highlight behind text). Never colored text alone. Max one per screen.
- Honey is never used for body text; Ink-on-Honey and Ink-on-White are the only
  text/background pairs (both pass WCAG AA for the sizes used).

### 3.2 Typography — two families, fixed roles

- **Fraunces** (weight 600; italic for emphasis) — display only: h1/h2, pull-quotes.
- **Inter** (weights 400/600 only) — body, buttons, labels, nav, metric numbers.
- Small labels: Inter 600, 11px, letter-spaced, uppercase, Ink (optionally on a Cream pill).
- No third typeface anywhere, including numbers.

### 3.3 Motif — the bubble with typing dots

One object at every scale: a speech bubble with three dots fading
Ink → 55% → 25%. Fixed geometry: three rounded corners + one sharp 4px corner
(the tail). Tail is bottom-right for Sampath's bubbles, bottom-left for
others' replies (testimonials, metrics presented as replies).

Uses: favicon, nav mark, section markers, loading states, mobile menu shape.
**No variants** (no outline-only, halftone, etc.).

### 3.4 Radius policy — exactly three radii site-wide

1. `18px` — structural cards.
2. Fully-round — pills, buttons, dots.
3. `4px` — bubble tail corners (and the emphasis sweep).

### 3.5 Layout language

White cards floating on a Honey world. Depth via **bubbles overlapping card
edges** (metric bubble straddling a boundary; portrait breaking its shape's top
line) — never shadow stacks. Hairlines only inside cards (1px, 12% Ink).
Rhythm alternates tight clusters and generous pauses, not uniform padding.
Mobile is a recomposition: Honey world becomes top/bottom bands, bubbles
restack, display type gets its own mobile scale; verify nothing covers the
headline at 320px.

### 3.6 Voice

Conversation-language everywhere: CTA is **"Start a conversation"** (never
"Submit"), metrics arrive as replies, testimonials are quote-bubbles from named
people, the scheduler is "pick a time to talk." Real numbers only: +35%
lead→meeting, 9.2/10 CSAT, 200M+ companies, 8,331 followers, 12 markets, 7+ years.

### 3.7 Guardrails (banned)

- Gradients, glows, blob shapes.
- Third typeface; colors beyond the four named.
- Honey/Cream as body-text color; any low-contrast text.
- Chat-widget look — bubbles are editorial: large, few, generous.
- Stock icon sets — the bubble mark or typographic indices only.
- Invented content of any kind (see §8).

## 4. Motion system (LOCKED — v2, "turned up" per user amendment)

| Moment | Behavior |
|---|---|
| Page load | Nav dots pulse once; h1 arrives as typing dots resolving into words (once); portrait bubble springs in, photo rises a beat later. |
| Scroll into view | Reply-bubbles spring in (mass + overshoot), then drift on slow 5–6s floats so pages never freeze. |
| Follower graph | Line draws 0 → 8,331 when visible, a small bubble riding the tip. |
| Buttons | Hover: lift + tail corner sharpens. Press: squash. |
| Cal embed load | Skeleton of Cream bubbles while the iframe initializes. |

Constraints (non-negotiable):

- `transform`/`opacity` only (compositor-friendly).
- `prefers-reduced-motion: reduce` → everything static and fully composed.
- Headings remain real DOM text — searchable, copy-pasteable; typing effect is
  presentational (aria: plain text exposed; decorative layers `aria-hidden`).
- The spring step is a **pure exported function** (testable without a browser).

## 5. Sitemap & navigation

| Page | Path | Job |
|---|---|---|
| Home | `/` | Hero + proof highlights + pull toward a conversation |
| Story | `/story/` | The person: engineer→sales journey, education, industries |
| Results | `/results/` | Career record: roles, achievements, testimonials |
| Schedule | `/schedule/` | Cal.com booking + contact + CV download |

Nav (all pages): bubble mark + "Sampath Kumar" left; Story / Results / Schedule
right; Honey pill "Start a conversation" → `/schedule/`. Mobile: bubble mark +
menu opening as a large speech bubble.

Exactly one `h1` per page.

## 6. Page designs

### 6.1 Home

1. **Hero** (locked): white card on Honey; typed h1 "Every deal begins with
   *hello.* I say it 12 markets wide."; sub-paragraph (7+ years, SaaS/finance/
   private markets, US→APAC); buttons "Start a conversation" (Ink pill, Honey
   text) + "The results" (outline pill). Right: Honey brand-bubble shape
   bleeding to the card's top-right edge; portrait inside with head breaking
   the shape's top line (reference anatomy); two drifting metric reply-bubbles
   (+35% lead→meeting; 9.2/10 client satisfaction).
2. **Follower graph card** — line draws 0 → 8,331. Data honesty: see §8.3.
3. **"What I do" as a thread** — three bubbles staggered left/right like a real
   exchange: Research → Outreach → Meeting. (Replaces the banned
   three-feature-card row.)
4. **One real testimonial** as a large quote-bubble (named, permitted).
5. **CTA band** — full-width Honey: "Your pipeline is one *hello* away." →
   Schedule.

### 6.2 Story

Conversation thread down the center; chapters alternate sides; years as Cream
pills. Sequence (all real): Diploma in Mechanical Engineering (2013–16) → B.E.
(2017–20) → pivot into sales — Zinnov/Draup (2020–21) → Alore (2021–22) →
Ecosmob (2022–23) → Uplers/Mavlers (2023) → The Sales Group, Toronto remote
(2024) → Finquest (2024–25) → MBA, Amrita (2024–26, in progress).

Grid-breaking move: the engineer→sales pivot is a full-bleed Honey interruption
carrying the site's one big pull-quote. Ends with casual photo + short human
paragraph + link: "Here's what that journey produced →" (Results).

### 6.3 Results (most designed surface)

Editorial ledger, not a card grid. Each role = full-width entry: company + role
in Fraunces; dates as Cream pill; achievements as reply-bubbles springing in.
**Finquest is the anchor**: 200M+ database story, niche-vertical acquisition
find, PE market-map (months → weeks), +35%, 9.2/10. Real testimonials
punctuate between roles as named quote-bubbles. Ends with designed next step:
"Want results like these on your pipeline?" → Schedule. No dead end.

### 6.4 Schedule

White card: h1 "Pick a time. I'll say hello first." containing the **Cal.com
inline embed** (this is the user-required "page to schedule a meeting which
sends a mail" — Cal.com emails confirmations to both parties and issues
calendar invites). Embed themed via Cal's embed API: Honey accents, Ink text,
Inter. Alongside: direct email link, LinkedIn link, "Download CV" pill (real
PDF). **Fallback:** if the embed fails to load, a designed bubble appears with
the direct Cal.com booking URL and his email — the page never dead-ends.

## 7. Architecture

- **Stack:** Vite, plain HTML/CSS/JS. Multi-page build with four HTML entries.
  No framework; the only third-party runtime script is Cal.com's embed, loaded
  on `/schedule/` only.
- **Hosting:** Netlify or Vercel free tier. Git repo from first commit.
- **Modules (one clear purpose each):**
  - `src/styles/identity.css` — locked tokens: 4 colors, 3 radii, 2 families,
    spacing scale. Every page imports it; no page defines its own tokens.
  - `src/js/motion.js` — spring/typing engines; `springStep(state, dt)` is a
    pure exported function with unit tests; honors reduced-motion.
  - `src/js/bubbles.js` — the motif component (bubble geometry, typing dots,
    reply-bubble reveal behavior).
  - `src/js/graph.js` — follower-line renderer (SVG path draw + tip bubble).
  - `src/js/scheduler.js` — Cal.com embed init, theming, load-failure fallback.
- **Testing:** unit tests for `springStep` and graph path math; Playwright
  screenshot verification per surface (see §9).

## 8. Truth-in-content — required assets (TODO before/during build)

Never invented; clearly-labeled neutral TODO placeholders until supplied:

1. **Portrait photo** (hero; clean cutout or cuttable) + one casual photo (Story).
2. **Testimonials** — exact quotes, names, roles, publication permission.
3. **Follower history** — a few real counts (rough is fine). **If not supplied,
   the graph is replaced by an honest count-up of the single real number
   (8,331) — no invented curve.**
4. **Cal.com booking link** — Sampath creates the free account + availability.
5. **CV PDF** and the public contact email address.

## 9. Verification gates (per surface, before "done")

- Playwright screenshots at **320 / 768 / 1024 / 1440**, actually reviewed,
  defects listed and fixed before presenting.
- Zero horizontal overflow; exactly one h1; no console errors.
- Reduced-motion pass renders complete and static.
- No mid-word breaks in display type; headline unobstructed at 320px.
- Contrast: all text pairs pass WCAG AA.

## 10. Decisions log

| Decision | Choice | Rejected alternatives |
|---|---|---|
| Purpose priority | Brand > clients > job | — |
| Site shape | Multi-page (4 pages) | One-pager; one-pager+blog |
| Direction | M — The Conversation | 11 others across rounds 1–3 (Signal Ink, Editorial Ledger, Momentum Bloc, Quiet Compass, Highlight, Morning Signal, Spark Grid, Greenlight, You're the Lead, Cold Email, One in 200M, Always Morning Somewhere, Open Door, First Light) |
| Palette v2 | 4 colors, Amber removed | v1 five-color palette |
| Scheduler | Cal.com embed (auto-emails both parties) | Custom form→email; hybrid |
| Stack | Vite static, Netlify/Vercel | Next.js/React |
