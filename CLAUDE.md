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

**Current direction is "Editorial Orchid"** — all four pages converged on it (verified 2026-07-25). Each page loads `identity.css` + `components.css` + a page stylesheet, and a page entry script that composes the shared modules. The earlier glassmorphic/Font-Awesome homepage split is **resolved** — Font Awesome is gone, and `index.html` uses the shared `.nav-toggle` markup like every other page.

**⚠️ The LOCKED design spec is superseded on identity, not on motion.** `docs/superpowers/specs/2026-07-22-sampath-portfolio-design.md` §3 describes Honey `#FFC21A`/Ink/Cream + Fraunces/Inter. The live tokens in `identity.css` are violet/orchid (`--color-violet: #6b21a8`) + Cormorant Garamond/DM Sans/Great Vibes. Treat §3.1–3.2 (palette, type) as historical; **§4 motion constraints are still in force** — transform/opacity only, static under `prefers-reduced-motion`, headings stay real DOM text.

### Shared JS modules (`src/js/`)

- `motion.js` — pure, tested spring-physics core (`springStep`, `isSettled`), `prefersReducedMotion()` gate, `animateSpring` (rAF driver), `typeHeading` (progressive text reveal that preserves the real DOM text and sets `aria-label` for screen readers).
- `bubbles.js` — `initReveals()`, IntersectionObserver-based scroll reveals; respects reduced motion via `motion.js`.
- `nav.js` — `initNav()`, mobile nav toggle; expects `.nav-toggle` / `.site-nav .links` markup. Used by all four pages.
- `graph.js` — `renderFollowerCard` drives the spring count-up on `/results/` (`#follower-card`, `data-target="8331"`), called from `results.js`. **The counter is deliberately results-only**: `site-contract.test.js:77` asserts `index.html` has no `data-target`, and that guard is intentional — do not add a counter to the homepage without reopening it. Pure math (`buildGraphPath`, `countUpValue`, `easeOutCubic`) is exported and tested separately; the counter interpolates linearly because the spring already supplies the easing.
- `scheduler.js` — Cal.com embed wiring for `/schedule/`, with a designed fallback when no `data-cal-link` is set (it is currently empty, so the fallback is what ships).
- Motion tokens live in `identity.css` `:root`: `--ease-out`/`--ease-in-out` (strong curves; the CSS built-ins are too weak) and `--duration-press`/`--duration-hover`/`--duration-surface` (160/200/260ms). Use these instead of hardcoding, and never `transition: all`.
- Page entries: `main.js` (home), `story.js`, `results.js`, `schedule-page.js`.

### Tests

13 files / 140 tests. Beyond the pure-logic units (`motion.js`, `graph.js`), there are now **contract tests that read the HTML/CSS as text** — `site-contract.test.js` and `editorial-orchid-css.test.js` assert required classes exist and that certain things are *absent* (no `data-target` counter, no `contactForm`). A markup change can fail a test in a file that never imports it.

`.worktrees/` is excluded from the vitest glob in `vite.config.js`. Without it, a git worktree's copy of `tests/` gets collected and runs ~94 duplicate assertions against stale code.

### Content TODOs

No `TODO(spec` markers remain in any HTML. The live launch blocker is `data-cal-link=""` in `schedule/index.html` — until it is set, `/schedule/` renders the LinkedIn fallback rather than a calendar.

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
