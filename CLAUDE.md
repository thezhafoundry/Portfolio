# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # install dependencies
npm run dev       # dev server at http://localhost:5173
npm run build     # production build to dist/ (multi-page, see vite.config.js)
npm run preview   # preview the production build
npm test          # vitest run (unit tests: spring physics, graph math)
```

Run a single test file: `npx vitest run tests/graph.test.js`

There is no lint/typecheck script configured — this is a vanilla JS project, no TypeScript, no ESLint config present.

## Architecture

Four-page static site (Vite multi-page build, vanilla JS/CSS, no framework). Entry points are declared explicitly in `vite.config.js`'s `rollupOptions.input`: `index.html`, `story/index.html`, `results/index.html`, `schedule/index.html`. If you add a new page, register it there or it won't be built.

**⚠️ Important inconsistency to know before touching the homepage:** the repo currently contains *two divergent design systems*, split by the last commit ("Redesign portfolio website from scratch with glassmorphic edge-to-edge layout"):

- **`index.html` (home)** now loads `src/js/main.js` and pulls in Font Awesome + Inter/Plus Jakarta Sans from a CDN. It does NOT use the spec-locked identity system below — `src/js/home.js`, `src/styles/identity.css`, and `src/styles/home.css` are orphaned/unused by the current homepage (nothing references them from any HTML entry point). `main.js` is plain DOM scripting (accordion, filter chips, a manual counter animation, a fake contact-form submit handler) with no dependency on `motion.js`/`bubbles.js`/`nav.js`.
- **`story/`, `results/`, `schedule/` pages** still run the original locked identity system: `identity.css` + `components.css` + a page-specific stylesheet, Fraunces (display) + Inter (body) fonts, and JS built on the shared `motion.js` (spring physics + reduced-motion-aware typing animation), `bubbles.js` (`initReveals`, scroll-triggered fade-ins), `nav.js` (`initNav`, mobile nav toggle), and per-page entry scripts (`story.js`, `results.js`, `schedule-page.js`).

Before editing the homepage, confirm with the user which direction is current intent — the README and `docs/superpowers/specs/2026-07-22-sampath-portfolio-design.md` (marked LOCKED §3) describe the *second* system (Honey/Ink/Cream, no Font Awesome), but the live `index.html` no longer matches it.

### Shared JS modules (`src/js/`)

- `motion.js` — pure, tested spring-physics core (`springStep`, `isSettled`), `prefersReducedMotion()` gate, `animateSpring` (rAF driver), `typeHeading` (progressive text reveal that preserves the real DOM text and sets `aria-label` for screen readers).
- `bubbles.js` — `initReveals()`, IntersectionObserver-based scroll reveals; respects reduced motion via `motion.js`.
- `nav.js` — `initNav()`, mobile nav toggle; expects `.nav-toggle` / `.site-nav .links` markup (used by story/results/schedule, not by the current home markup, which uses `#navToggle`/`#navLinks` instead — see divergence note above).
- `graph.js` — pure, tested follower-count graph math (`countUpValue`, `easeOutCubic`, `buildGraphPath`) plus `renderFollowerCard`.
- `scheduler.js` — Cal.com embed wiring for `/schedule/`, with a designed fallback when no `data-cal-link` is set.
- Page entries (`story.js`, `results.js`, `schedule-page.js`, `home.js`) compose the shared modules above per page. `main.js` (used by current `index.html`) does not.

### Tests

`tests/*.test.js` cover the pure logic in `motion.js` and `graph.js` only (spring convergence, reduced-motion short-circuit, count-up math) — no DOM/integration tests. Keep new pure logic in similarly small, dependency-free functions so it stays unit-testable without a DOM.

### Content TODOs

Real-content placeholders are marked `TODO(spec §N.M)` inline in `schedule/index.html` and `story/index.html` (Cal.com link, CV/email, portrait photo, pivot quote). Search for `TODO(spec` before assuming a section is finished/production-ready.

### Deploy

Netlify (`netlify.toml`: `npm run build` → publish `dist/`). Vercel also works with framework preset "Vite", output `dist`.

## How to Work Efficiently (low context — this is the DEFAULT, no need to be told)
- The brain is **queried, not loaded**. Never read whole files or the whole `.agents/` tree "to get context."
- Lookup order for ANY task: (1) the ONE relevant `.agents/` file the task scope points to below, (2) at most 2–3 targeted reads. Full-file reads are the last resort.
- Pull ONLY the `.agents/` file the task scope points to — never preload all of them.
- This runs automatically for every task; the user does NOT have to say "use the second brain."

## Agent Routing Instructions
To prevent context dilution, general invariants and rules are split into modular guides. **Always read these files first based on the scope of your task:**

1.  **Identity, Dev Persona & Code Style Rules**:
    *   Location: `.agents/context/identity.md`
    *   Read when: Starting a new session or reviewing coding style, formatting, and response conventions.
2.  **Invariants, Tech Stack & File Map**:
    *   Location: `.agents/context/stack-and-rules.md`
    *   Read when: Touching the design-system tokens, build config, or the Cal.com booking integration.
3.  **Historical Decisions & Migrations**:
    *   Location: `.agents/decisions/log.md`
    *   Read when: Seeking context on why a design direction was built/dropped, or checking the design-iteration history.
4.  **Active Roadmap & Technical Debt**:
    *   Location: `.agents/projects/active-backlog.md`
    *   Read when: Checking current backlog tasks (launch-blocking content TODOs) or known tech debt.
5.  **Subsystem Notes & Load-Bearing Gotchas**:
    *   Location: `.agents/context/subsystem-notes.md`
    *   Read when: Editing a specific subsystem — holds the *why* and traps the code can't. **Read this before touching the homepage** (`index.html`/`main.js`).
