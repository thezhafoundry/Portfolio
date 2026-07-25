# Subsystem Notes & Load-Bearing Gotchas

<!-- One section per subsystem. Capture the WHY and the traps that are not obvious
     from reading the code — this is what the wiki/codebase cannot tell you.
     Use [[backlinks]] to cross-reference decisions/log.md or active-backlog.md entries. -->

## RESOLVED (2026-07-25): the homepage design-system split is closed

Superseded. The 2026-07-23 note here warned that `index.html` ran a
glassmorphic/Font-Awesome system while the other three pages ran the
spec-locked one. Verified closed on 2026-07-25: all four pages now load
`identity.css` + `components.css` + a page stylesheet, `index.html` carries no
Font Awesome (fonts are Cormorant Garamond / DM Sans / Great Vibes, matching
`identity.css`), and it uses the shared `.nav-toggle` markup — so `initNav()`
binds correctly everywhere. The direction is **Editorial Orchid**.

Consequence for the spec: the old "The Conversation" spec was **deleted
2026-07-25**. `docs/superpowers/specs/2026-07-24-editorial-orchid-portfolio-design.md`
governs; motion rules are its **§13**. Read live tokens from `identity.css`
`:root`, never from a spec file. Some code comments still cite "retired
Conversation spec §3.3" for the bubble/typing-dots motif — that is historical
attribution for where the motif came from, not a live pointer.

`src/js/home.js` was deleted 2026-07-25 (commit `8b8bf44`) — it was the last
referent of the old split. `src/styles/home.css` is **live**, loaded by
`index.html`; do not delete it on the strength of the old note.

## Motion system (2026-07-25)

Tokens live in `identity.css` `:root`: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`,
`--ease-in-out`, and `--duration-press: 160ms` / `--duration-hover: 200ms` /
`--duration-surface: 260ms`. Two traps:

- **Never `transition: all`.** Six rules in `components.css` had it; it animates
  properties you did not intend, off-GPU, including on class swaps.
- **A `:hover`/`:active` transform needs its `transition` on the *base* rule**,
  not the state rule. `.btn` had `translateY` on both states and no transition
  anywhere, so every button on the site snapped instantly.
- Hover motion is gated behind `@media (hover: hover) and (pointer: fine)` —
  touch devices fire `:hover` on tap and leave it stuck.

Reduced motion is handled by one global kill-switch at the bottom of
`identity.css` (`transition-duration: 0.01ms !important`), so per-component
reduced-motion blocks are usually unnecessary — but it also means a CSS
`@keyframes` loop stops at its *resting* declaration. Design the rest state to
be the meaningful one (see `.typing-dots`, whose dots rest at 100/55/25%).

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
