# Identity, Dev Persona & Code Style

## Who is working on this
Solo dev (K Prem, org: thezhafoundry) building a freelance/agency portfolio
site for a client, Sampath Kumar (B2B SaaS lead-gen / pre-sales leader). Not
a personal portfolio for the repo owner. Deliberately built with vanilla
JS/CSS + Vite instead of a framework — small marketing site, no need for the
overhead. Heavy use of Claude Code with the `superpowers` skill set for
spec-first, TDD-driven feature work (see `docs/superpowers/` for the spec/plan
history behind the design).

## Response Conventions
- Terse. No unrequested summaries. See global `rules/web/*` (already loaded
  every session) for design-quality bar, performance budgets, and testing
  priorities — don't restate them here.
- Design changes are held to `rules/web/design-quality.md`'s anti-template
  policy: no generic hero/card-grid defaults, intentional hierarchy/motion/
  typography required.

## Code Style Rules
- ES modules only, no build-time TS. Keep pure logic (physics, math,
  formatting) in small dependency-free functions exported from otherwise
  DOM-driving files — this is what makes `motion.js`/`graph.js` unit-testable
  without a DOM (see `tests/*.test.js`). Follow that split for new logic.
- Motion/animation code must gate on `prefersReducedMotion()` from
  `src/js/motion.js` before animating anything — established repo-wide
  pattern, not optional per-feature.
- CSS: custom properties for tokens (see `identity.css`), animate only
  `transform`/`opacity` per the locked design spec and `rules/web/performance.md`.
