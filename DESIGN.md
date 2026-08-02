---
name: Sampath Kumar Portfolio
description: A warm, ledger-precise editorial system built from ruled paper, a louvered shutter reveal, and a running conversation motif.
colors:
  ink-violet: "#2e1065"
  royal-violet: "#6b21a8"
  orchid: "#c084fc"
  pale-orchid: "#e9d5ff"
  whisper-lavender: "#f7f2ff"
  paper-white: "#fffaff"
  pure-white: "#ffffff"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(2.5rem, 6vw, 4.75rem)"
    fontWeight: 600
    lineHeight: 1.22
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(2rem, 4vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.22
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(1.5rem, 2.4vw, 2.125rem)"
    fontWeight: 600
    lineHeight: 1.22
    letterSpacing: "-0.025em"
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.97rem + 0.15vw, 1.125rem)"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.14em"
  signature:
    fontFamily: "Great Vibes, Cormorant Garamond, cursive"
    fontSize: "clamp(1.5rem, 2.4vw, 1.85rem)"
    fontWeight: 400
    lineHeight: 1
rounded:
  pill: "999px"
  media: "clamp(0.75rem, 1.5vw, 1.25rem)"
  flat: "0"
spacing:
  gutter: "clamp(1.25rem, 4vw, 4rem)"
  section: "clamp(3.5rem, 8vw, 8rem)"
components:
  button-primary:
    backgroundColor: "{colors.royal-violet}"
    textColor: "{colors.pure-white}"
    rounded: "{rounded.pill}"
    padding: "0.65rem 1.1rem"
  button-primary-hover:
    backgroundColor: "{colors.ink-violet}"
    textColor: "{colors.pure-white}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-violet}"
    rounded: "{rounded.pill}"
    padding: "0.65rem 1.1rem"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.royal-violet}"
    padding: "0"
  bubble-me:
    backgroundColor: "{colors.pale-orchid}"
    textColor: "{colors.ink-violet}"
    rounded: "{rounded.media}"
    padding: "1rem 1.25rem"
  bubble-reply:
    backgroundColor: "{colors.pure-white}"
    textColor: "{colors.ink-violet}"
    rounded: "{rounded.media}"
    padding: "1rem 1.25rem"
  badge-pill:
    backgroundColor: "{colors.pale-orchid}"
    textColor: "{colors.royal-violet}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.4rem 0.75rem"
---

# Design System: Sampath Kumar Portfolio

## Overview

**Creative North Star: "The Louvered Correspondence"**

The site opens as a sheet of ruled paper: a louvered shutter of paper slats hinged over a violet-ground portrait, parting under the pointer to reveal color and person beneath the page. Everything below the fold is set on that same ruled sheet — a fine 30px-pitch rule grid running the full body background, echoing the hero's own slat width, so the page reads as one idea told several times rather than a set of unrelated sections. Running through it is a second motif: conversation. The hero's greeting animates in like a reply arriving; the story page closes with a literal question-and-answer exchange rendered as chat bubbles with side-aware entrances; the results page calls its case-study sections a "Ledger." The voice is warm and conversational — intimate, hand-set, unhurried — but delivered inside a rigorously ruled, numbered editorial structure: offer items are numbered rows on a rule, not cards; method steps hang off a single line that draws itself in on scroll; outcome tags run in vertical type like a ledger's margin notes. Warmth in the voice, precision in the structure.

A fine SVG turbulence grain sits fixed over the whole page at low opacity, giving the flat violet-and-paper palette the tooth of printed stock rather than a flat digital gradient. Buttons, the floating video widget, and the custom cursor all respond physically — lift, press-squash, glow rings, radar ripples — so the interface feels tactile and confident, not just decorative.

**Key Characteristics:**
- Ruled-paper canvas: a repeating 1px/30px vertical rule runs the full body background, tying hero and post-hero sections to one grid.
- Louvered shutter hero: paper slats hinged on a rule, opening under the pointer to reveal a violet-to-ink gradient ground and a portrait.
- Conversation as motif: chat-bubble components (`.bubble`, `.bubble--me`, `.bubble--reply`) recur from the hero greeting through the story close.
- Numbered editorial rows over card grids: offer items and method steps are rule-hung rows/numbers, not boxed cards.
- Tactile interaction: pill buttons lift + press-squash + glow-ring focus; the floating video trigger pulses radar ripples; a custom lerping cursor ring/dot follows the pointer on fine-pointer devices.

## Colors

A near-white, faintly violet-tinted paper canvas carries one accent family — orchid through deep ink-violet — used with intention: pale tones for surfaces and washes, mid violet for interactive elements, and the darkest ink for text and full-bleed dark bands.

### Primary
- **Royal Violet** (`#6b21a8`): the interactive color — link text, primary button fill, focus-ring outer ring, active nav pill background. This is the color the site asks you to act on.

### Secondary
- **Orchid** (`#c084fc`): the decorative accent — the hero's underline sweep beneath the site signature, the highlight-sweep rule under scrolling record figures, the louver field's slat borders, the pip-widget's ripple and pulse dot. Never used for body text or primary CTAs; it marks motion and emphasis, not action.

### Neutral
- **Ink Violet** (`#2e1065`): the site's near-black — all heading and body text color, the full-bleed dark contact-card band, the skip-link and focus-ring inner ring. Functions as this system's "black."
- **Pale Orchid** (`#e9d5ff`): background highlight color for `.editorial-emphasis`/`.sweep` inline text marks, active nav-pill background, pill badges, and the `.bubble--me` chat bubble fill.
- **Whisper Lavender** (`#f7f2ff`): tinted section background (`.surface`, `.band--cream`), card backgrounds on results/schedule/story pages.
- **Paper White** (`#fffaff`): the page canvas itself — carries a hair of violet warmth rather than reading as clinical white.
- **Pure White** (`#ffffff`): explicit white surfaces — cards, the `.bubble--white`/`.bubble--reply` fill, button text on violet fills.

### Named Rules
**The One Accent Rule.** Only two colors ever carry action or emphasis: Royal Violet for anything actionable (links, primary buttons, active states), Orchid for anything decorative (sweeps, rules, ripples). Never swap their roles — an orchid button or a violet decorative sweep breaks the system's internal logic.

## Typography

**Display Font:** Cormorant Garamond (with Georgia, serif fallback)
**Body Font:** DM Sans (with system-ui, sans-serif fallback)
**Label/Mono Font:** DM Sans, same family as body, distinguished by uppercase + wide tracking rather than a separate face
**Signature Font:** Great Vibes (with Cormorant Garamond fallback) — reserved for the site's signature wordmark only

**Character:** A high-contrast serif/sans pairing: Cormorant Garamond's condensed, slightly compressed italic-capable serif carries all headings with editorial gravity, while DM Sans's even, confident geometric sans carries every line of running copy and UI chrome. The pairing reads as a magazine masthead over a clean interface, not a single typeface doing both jobs.

### Hierarchy
- **Display** (600, `clamp(2.5rem, 6vw, 4.75rem)`, 1.22): page-level `h1`s. The homepage hero overrides this locally to `clamp(3.35rem, 6.1vw, 6.25rem)` for maximum scale contrast against the shutter reveal.
- **Headline** (600, `clamp(2rem, 4vw, 3.5rem)`, 1.22): `h2`, section titles ("The Method," "The Offer," case-study role headers).
- **Title** (600, `clamp(1.5rem, 2.4vw, 2.125rem)`, 1.22): `h3`/`h4`, sub-section and card titles.
- **Body** (400, `clamp(1rem, 0.97rem + 0.15vw, 1.125rem)`, 1.65): all running copy; paragraphs cap at 72ch for readability.
- **Label** (700, 0.75rem, letter-spacing 0.14em, uppercase): eyebrows, pill badges, nav links, footer links — the system's small-caps voice for wayfinding and metadata.
- **Signature** (400, `clamp(1.5rem, 2.4vw, 1.85rem)`, italic-style cursive): the site brand mark only, underlined by a single orchid stroke.

### Named Rules
**The Serif-Speaks, Sans-Labels Rule.** Cormorant Garamond only ever sets a heading or a large numeral (offer/method numbers, story chapter years). DM Sans carries every other role — body copy, labels, buttons, navigation. A sans-serif heading or a serif label is a system violation.

## Layout

The site is a Vite multi-page build (one HTML entry per route, no client router). Content sits on a `.container` capped at `--content-max: 76rem` with a fluid `--gutter: clamp(1.25rem, 4vw, 4rem)`; full-bleed `.band`/`.band-inner` wrappers use a wider `--band-measure` (`--content-max + gutter*2`) so padded bands' text starts flush with `.container`'s left edge. Vertical rhythm runs on `--section-space: clamp(3.5rem, 8vw, 8rem)` between sections.

Breakpoints observed in the stylesheets: `32rem` (512px, tightest mobile grid collapse), `48rem`/`860px` (mobile nav + stacked layouts), `992px` (contact-card and outcomes-grid stacking), `1440px` (widens the Cal.com embed on schedule). Layout density stays generous — clamp()-driven fluid type and spacing throughout, no fixed pixel breakpint grid beyond these collapse points.

The homepage is the system's densest expression: hero, record (partner logos), note (a screened photo), offer, method, outcomes, and conversation (contact) sections, each with its own scroll-triggered "opening" (a rule that draws, a wash that wipes in), all running on the same 30px-pitch ruled background.

## Elevation & Depth

**Current state is a hybrid, and it is being consciously narrowed.** The homepage's below-hero narrative sections (offer rows, method track, outcomes grid, the Tools category groups, the full-bleed contact-card) are flat by design: zero border-radius, zero box-shadow, depth conveyed entirely through 1px rules, color tint, and hover-triggered "wash" sweeps — the ruled-sheet conceit extended into elevation itself. But the homepage isn't uniformly flat: its own Companies and Education sections, like results/schedule/story pages, still use soft shadow-and-radius cards (`var(--radius-media)`, `box-shadow` on hover) inherited from an earlier pass — the flagship page carries both languages side by side.

**The flat ruled-sheet treatment is the target for the whole site.** New work anywhere should move toward the flat, rule-and-tint language rather than extending the shadow-card pattern further. Existing shadow-carrying cards (results/schedule/story, plus the homepage's own `.company-card`/`.education-card`) are known debt, not a second permanent language — a 2026-08-02 pass aligned their radius to `var(--radius-media)` as a first step, but the `box-shadow` remains unaddressed. `home.css` also still carries a fully unused legacy card family (`.tools-grid`/`.tool-card`, `.stack-group`, `.award-card`, `.pipeline-card`, `.industries-cloud`) from an earlier design pass with the same shadow-and-radius shape — confirmed unreferenced by any current page and flagged in-file for a future dead-code pass, not yet removed.

### Shadow Vocabulary (legacy, being phased out)
- **Card lift** (`box-shadow: 0 0.9rem 1.8rem color-mix(in srgb, var(--color-deep-violet) 10%, transparent)`): hover state on `.outcome-block` (results page). Do not add this pattern to new components.
- **Contact band shadow** (`box-shadow: 0 30px 80px color-mix(in srgb, var(--color-deep-violet) 35%, transparent)`): the shared `.contact-card` base style in `components.css`. The homepage overrides this back to `box-shadow: none` — treat the override, not the base, as canon.
- **Card shadow** (`box-shadow: 0 4px 16px color-mix(in srgb, var(--color-deep-violet) 4%, transparent)`): rest state on `.company-card`/`.education-card` (homepage) and the unused legacy `.tool-card`/`.award-card`/`.pipeline-card` family. Do not add this pattern to new components.

### Named Rules
**The Flat-Ruled Target Rule.** Depth comes from a 1px rule, a color tint, or a hover "wash," never a drop shadow, on new work. Shadow-and-radius cards on results/schedule/story are inherited debt to migrate away from, not a pattern to extend.

## Shapes

Two deliberately different form languages coexist by role, not by accident:
- **Pill (`999px`)**: every interactive chrome element — buttons, nav links, badges, the pip-widget trigger. Interaction always reads as a pill.
- **Media radius (`--radius-media`, `clamp(0.75rem, 1.5vw, 1.25rem)`)**: photo containers, media dialogs, and (per the Elevation direction above) the legacy card surfaces on results/schedule/story that are being flattened over time.
- **Flat (`0`)**: the homepage's ruled-sheet sections and the target direction for future surfaces — square-edged rows, grids, and bands with no corner treatment at all.

Borders throughout use `color-mix(in srgb, var(--color-deep-violet) N%, transparent)` at low opacities (10–20%) rather than a flat gray — every hairline carries a trace of the ink color instead of a neutral gray.

## Components

Buttons, bubbles, and pills feel tactile and confident: real physical feedback (lift, press-squash, glow) on every actionable element, restrained everywhere copy is just being read.

### Buttons
- **Shape:** full pill (`border-radius: 999px`), `min-height: 2.75rem`.
- **Primary:** Royal Violet fill, white text; on hover/focus every variant (primary, ghost, honey, ghost-cream) converges to Ink Violet fill + white text — one consistent "activated" state regardless of resting style.
- **Hover / Focus:** fine-pointer devices get a `translateY(-1px)` lift on hover (gated behind `(hover: hover) and (pointer: fine)` so touch taps don't get stuck hover states); every press gets a `scale(0.97)` squash on `:active`; focus-visible shows the two-ring `--focus-ring` (white inner ring, Royal Violet outer ring) on every interactive element site-wide, not just buttons.
- **Secondary / Ghost / Text:** Ghost is an outlined Royal-Violet-border button on transparent background; Text is a plain underlined Royal Violet link-as-button; both converge to the same Ink Violet hover state as Primary.

### Bubbles (signature component)
- **Shape:** `var(--radius-media)` corners, with the speaking side's bottom corner sharpened to `0.25rem` (`.bubble--me` sharpens bottom-right, `.bubble--reply` sharpens bottom-left) — a literal speech-bubble tail cue without an actual tail shape.
- **Fill:** `.bubble--me` uses Pale Orchid, `.bubble--reply` and `.bubble--white` use Pure White, `.bubble--ink` uses Ink Violet with white text, `.bubble--honey` reuses Pale Orchid.
- **Entrance:** each bubble enters from the side its tail points to (`.bubble--me` slides in from the right, `.bubble--reply` from the left) — motion direction encodes who is "speaking."

### Cards / Containers (results, schedule, story — legacy language, see Elevation)
- **Corner Style:** `var(--radius-media)`.
- **Background:** Whisper Lavender or Pure White depending on context.
- **Shadow Strategy:** soft ambient shadow on hover only (`.outcome-block:hover`, `.story-chapter.is-active`); flat/no-shadow at rest.
- **Border:** 1px, `color-mix(in srgb, var(--color-deep-violet) 12%, transparent)`.
- **Internal Padding:** `1.25rem`–`2.5rem` depending on card size.

### Navigation
- **Style:** pill-shaped links, transparent at rest, Pale-Orchid-tinted wash on hover/focus, Pale Orchid solid fill + bold weight for the current page (`aria-current="page"`).
- **Typography:** Label role (DM Sans, 0.9rem, 700 weight) — slightly larger than the system's other label uses.
- **Signature CTA:** the "Schedule a Call" nav link is the one nav item styled as a filled Royal Violet pill with its own drop shadow — the single place navigation itself carries elevation, marking it as the primary conversion action.
- **Mobile:** collapses to a circular hamburger toggle; the nav becomes a frosted-glass (`backdrop-filter: blur(20px)`) floating panel anchored top-right, scale+fade transition in.

### Floating PiP Video Widget (signature component)
A fixed bottom-right trigger pill (Ink Violet fill, Orchid border) with two continuously expanding "radar ripple" rings and a pulsing dot — the site's one instance of persistent ambient motion, deliberately reserved for a single high-value CTA (the intro video) rather than used broadly. Expands into a compact vertical 9:16 video card on click; hidden entirely while the hero is in view so it never competes with the shutter reveal.

### Custom Cursor
A two-part lerped cursor (small solid dot + larger outlined ring, both Ink-Violet/Orchid) replaces the system cursor on fine-pointer devices, shifting to Orchid fill and Ink Violet ring border on hover over interactive elements. Disabled entirely on touch devices and under reduced motion.

## Do's and Don'ts

### Do:
- **Do** keep Royal Violet exclusively for action (links, primary buttons, active nav) and Orchid exclusively for decoration (sweeps, ripples, rules) — see The One Accent Rule.
- **Do** set every heading and large numeral in Cormorant Garamond and every other role in DM Sans — see The Serif-Speaks, Sans-Labels Rule.
- **Do** build new depth cues from a 1px `color-mix(..., var(--color-deep-violet) N%, transparent)` rule or a hover wash, not a `box-shadow` — see The Flat-Ruled Target Rule.
- **Do** gate hover lifts behind `(hover: hover) and (pointer: fine)` so touch taps never get a stuck `:hover` state (established pattern in `components.css`).
- **Do** gate all motion on `prefersReducedMotion()` / the global `prefers-reduced-motion` media query — every animated component in this system already does.

### Don't:
- **Don't** add new `border-radius` + `box-shadow` card components; that pattern is inherited debt on results/schedule/story, not the target language.
- **Don't** use Orchid on text meant to be read as an action (links, button labels) — it is reserved for decorative/motion roles only.
- **Don't** introduce a third font family; the system is strictly Cormorant Garamond (display) + DM Sans (body/label) + Great Vibes (signature mark only).
- **Don't** add persistent ambient motion (ripples, pulses, shimmer) to more than one component at a time — the PiP widget's radar ripple works because it is the only thing doing it; a page with several competing ambient animations would undercut the "one idea told several times" premise.
