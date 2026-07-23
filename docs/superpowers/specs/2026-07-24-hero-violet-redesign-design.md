# Hero Section Redesign — Violet Gradient Card Layout

Date: 2026-07-24 · Status: approved (design discussed and confirmed by Sampath)

## Diagnosis

`index.html`'s current hero (`.hero-full-edge`, from commit 5a3081e) is a
full-bleed dark photo background with white text overlaid on the left and
glass-blur stat badges. Sampath supplied a reference mockup for a different
hero direction: a light violet-gradient background, a two-column layout with
a contained rounded photo card on the right (with a floating stat badge
overlapping it), two pill CTAs, and a flat-card stats row below. This spec
replaces the current hero entirely with that layout.

## Scope

Hero section only (`<section id="home">` and its children) plus the shared
color tokens it depends on. No changes to nav behavior/IDs, no changes to
sections below the hero (partners, about, services, etc.) beyond inheriting
the updated `--primary` tokens.

## Color tokens (`src/styles/main.css`, site-wide)

Update the existing palette to a deeper violet, since it's shared by buttons
and accents elsewhere on the homepage:

- `--primary: #5b21b6` (was `#6C5CE7`)
- `--primary-hover: #4c1d95`
- New `--primary-dark: #2e1065` — dark stop for the hero CTA/gradient
- `--primary-light`, `--primary-glow`, `--border-purple`, `--shadow-purple`
  recalculated off the new base (same alpha/lightness relationships as today,
  new hue)
- Hero background itself is NOT deep violet — it's a pale lavender/cream
  gradient wash (approximating the mockup), with the deep violet reserved for
  text accents, buttons, and the button gradient (`#2e1065 → #5b21b6`)

## Layout — replacing `.hero-full-edge`

**Nav** (`.hero-glass-nav`): keep the existing markup, IDs (`#navToggle`,
`#navLinks`), and classes so `main.js`'s toggle handler needs no changes.
Recolor only: light glass pill (white/translucent, blurred), dark text links,
solid violet-gradient "Book a Consultation" button.

**Two-column grid** replacing the single-column overlay:
- Left: eyebrow line (`LEAD GENERATION · PRE-SALES · B2B GROWTH`), existing
  headline copy ("Driving B2B Revenue. Scaling Global Pipeline.") with "Global
  Pipeline" styled in violet, existing subtext paragraph, two pill CTAs —
  filled violet-gradient "Request a Call" (existing `.btn-glass-pill` retired
  in favor of a new solid-fill pill) + a new outline-style secondary pill "See
  Results".
- Right: `/assets/hero_portrait.jpg` (already in the repo, unused elsewhere)
  in a white-framed rounded card with shadow. A small floating glass badge
  ("9.2/10 · Avg. client satisfaction") overlaps its bottom-left corner.

**Stats row**: rebuilt from icon glass badges (`.stat-glass-badge`) to flat
light-violet rounded cards — bold violet number, gray label, no icon, no
blur. Same 4 stats, same copy, same `data-target` values (7+, +35%, 200M+,
9.2/10) so `main.js`'s counter logic needs no changes.

## Bug fix (found in scope, fixed alongside)

`main.js` line 93 watches `document.querySelector('.hero-stats-bar')` via
`IntersectionObserver` to trigger the count-up animation, but no element
currently carries that class — the counters have never animated. The new
stats row container gets `.hero-stats-bar` added so this starts working.

## Responsive behavior (not shown in the mockup, designed to match existing breakpoints)

- `>992px`: two-column hero as described
- `≤992px`: photo card stacks below the text column; stats row wraps 2×2
- `≤768px`: stats row collapses to a single column, headline scales down
  (matching the existing `.hero-main-title` mobile override pattern)

## Testing

Per the project's web testing rules: Playwright screenshots at 320/768/1024/1440
before calling this done, plus a manual check that reduced-motion is
respected and the nav toggle still functions on the new markup.

## Out of scope

Sections below the hero (partners, about, services, process, etc.) keep
their current structure — only their inherited `--primary`-based colors
shift. No new photo assets beyond `hero_portrait.jpg`. No changes to
`story/`, `results/`, `schedule/` pages (they run the separate locked
identity system, untouched by this spec).
