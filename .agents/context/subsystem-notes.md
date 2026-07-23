# Subsystem Notes & Load-Bearing Gotchas

<!-- One section per subsystem. Capture the WHY and the traps that are not obvious
     from reading the code — this is what the wiki/codebase cannot tell you.
     Use [[backlinks]] to cross-reference decisions/log.md or active-backlog.md entries. -->

## Homepage (`index.html`) runs a different design system than the rest of the site

Found 2026-07-23 while writing `CLAUDE.md`. The commit
`5a3081e "Redesign portfolio website from scratch with glassmorphic
edge-to-edge layout"` rewrote `index.html` to load `src/js/main.js`, Font
Awesome 6.5.1, and Inter/Plus Jakarta Sans — a plain-DOM-scripting page
(accordion, filter chips, manual counter loop, fake contact-form submit
handler) with **no dependency on the shared identity-system modules**.

Meanwhile `story/`, `results/`, and `schedule/` are untouched and still run
the original spec-locked system: `identity.css` + `components.css` +
Fraunces/Inter, built on `motion.js` (spring physics, reduced-motion gate),
`bubbles.js` (`initReveals`), `nav.js` (`initNav`, expects
`.nav-toggle`/`.site-nav .links`), per-page entry scripts.

Practical fallout:
- `src/js/home.js`, `src/styles/home.css`, and `src/styles/identity.css`'s
  usage by the homepage are **orphaned** — no HTML entry point references
  `home.js` anymore. `identity.css` is still live for the other 3 pages.
- `nav.js`'s `initNav()` won't do anything on the current homepage — it
  targets `.nav-toggle`, but `index.html` uses `#navToggle`/`#navLinks` with
  inline logic in `main.js` instead.
- The README and the LOCKED design spec (§3, Honey/Ink/Cream, Fraunces) still
  describe the *old* homepage design — they no longer match what's live at
  `/`. Don't trust the README's design-system claims for `index.html`
  specifically; they're still accurate for the other three pages.

**Before editing the homepage**: confirm with the user whether the
Font-Awesome/glassmorphic direction is the new intended direction (and the
spec/README need updating) or whether it was a wrong-branch/regression
commit that should be reverted toward the locked spec. Don't assume either
way. See [[active-backlog]] tech-debt entry and [[decisions-log]] migration
index for the commit history.

## Hero section (2026-07-24): violet gradient card layout replaced the dark full-bleed photo hero

Per `docs/superpowers/specs/2026-07-24-hero-violet-redesign-design.md` and
its paired plan doc. `index.html`'s `<section id="home">` changed class from
`.hero-full-edge` to `.hero`; the background is now a light lavender/cream
gradient (no photo background image), laid out as a two-column grid
(`.hero-grid` > `.hero-copy` + `.hero-visual`) instead of the old single-column
text-over-photo overlay. The photo moved into a contained card
(`.hero-photo-frame`) using `/assets/hero_portrait.jpg` (previously unused),
with a floating glass badge (`.hero-floating-badge`) overlapping its corner.
The 4-stat row went from icon glass badges (`.stat-glass-badge`) to flat cards
(`.hero-stat-card` inside `.hero-stats-bar`).

Site-wide `--primary` token in `src/styles/main.css` moved from `#6C5CE7` to
`#5b21b6` (deeper violet), plus a new `--primary-dark: #2e1065` token for
gradient stops — this affects every section on the homepage that uses
`var(--primary)` or the `.btn-purple`/`.highlight-purple` utility classes, not
just the hero.

**Bug fixed in passing**: `src/js/main.js`'s `IntersectionObserver` for the
stat count-up animation watches for a `.hero-stats-bar` class that never
existed on any element before this change — the counters had never actually
animated. The new stats row container now carries that class, so the count-up
fires correctly.

`#navToggle`/`#navLinks` IDs and `main.js`'s toggle logic are unchanged —
only colors were touched on the nav, not its markup or JS bindings.
