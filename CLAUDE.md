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

Seven-page static site (Vite multi-page build, vanilla JS/CSS, no framework). Entry points are declared explicitly in `vite.config.js`'s `rollupOptions.input`: `index.html`, `story/index.html`, `results/index.html`, `schedule/index.html`, `policies/terms/index.html`, `policies/privacy/index.html`, `policies/refunds/index.html`, `404.html`. If you add a new page, register it there or it won't be built.

**Current direction is "Editorial Orchid"** — all pages converged on it (verified 2026-07-25). Each page loads `identity.css` + `components.css` + a page stylesheet, and a page entry script that composes the shared modules. The earlier glassmorphic/Font-Awesome homepage split is **resolved** — Font Awesome is gone, and `index.html` uses the shared `.nav-toggle` markup like every other page.

**The governing spec is `docs/superpowers/specs/2026-07-24-editorial-orchid-portfolio-design.md`.** The older "The Conversation" spec (Honey/Ink/Cream, Fraunces+Inter, marked LOCKED §3) was deleted on 2026-07-25 — it had been superseded for a day and was actively misleading. Several other pre-Editorial-Orchid design-iteration docs (band-world, fullscreen, signal-path, visual-upgrade, night-window, hero-violet, plus a 2026-07-24 verification report) were deleted the same way on 2026-08-02, once they no longer reflected the live site. Recover any of them from git history if you need the rationale: `git log --diff-filter=D -- docs/`.

Motion rules live in **§13** of the current spec: transform/opacity for most effects; buttons and links 140–180ms; accordions 240–300ms; hero entrance 350–550ms; no scroll hijacking, looping floats, long counter animations, or large parallax; reduced motion removes movement while preserving content and state.

### JS modules (`src/js/`, organized by feature folder)

`src/js/` is split into `shared/` (used by 2+ pages) plus one folder per page (`home/`, `results/`, `schedule/`, `story/`, `notfound/`), each holding that page's entry script and its exclusive dependencies. Restructured 2026-08-02 from a flat 19-file layout — see `.agents/context/subsystem-notes.md` for why.

- `shared/motion.js` — pure, tested spring-physics core (`springStep`, `isSettled`), `prefersReducedMotion()` gate, `animateSpring` (rAF driver), `typeHeading` (progressive text reveal that preserves the real DOM text and sets `aria-label` for screen readers).
- `shared/bubbles.js` — `initReveals()`, IntersectionObserver-based scroll reveals; respects reduced motion via `motion.js`.
- `shared/nav.js` — `initNav()`, mobile nav toggle; expects `.nav-toggle` / `.site-nav .links` markup. Used by every page.
- `shared/magnetic.js`, `shared/cursor.js`, `shared/pip-video.js` — magnetic-pull button physics, custom cursor, and the floating picture-in-picture video, each used by more than one page's entry script.
- `results/graph.js` — `renderFollowerCard` drives the spring count-up on `/results/` (`#follower-card`, `data-target="8331"`), called from `results/results.js`. **The counter is deliberately results-only**: `site-contract.test.js` asserts `index.html` has no `data-target`, and that guard is intentional — do not add a counter to the homepage without reopening it. Pure math (`buildGraphPath`, `countUpValue`, `easeOutCubic`) is exported and tested separately; the counter interpolates linearly because the spring already supplies the easing.
- `schedule/scheduler.js` — Cal.com embed wiring for `/schedule/`, with a designed fallback when no `data-cal-link` is set (it is currently empty, so the fallback is what ships).
- `home/` — `main.js` (entry) plus its exclusive deps: `media.js`, `glow.js`, `greeting.js`, `louver.js`, `odometer.js`, `simulator.js`, `process-engine.js`, `ticker.js`, `youtube-modal.js`. None of these are used by any other page.
- Motion tokens live in `identity.css` `:root`: `--ease-out`/`--ease-in-out` (strong curves; the CSS built-ins are too weak) and `--duration-press`/`--duration-hover`/`--duration-surface` (160/200/260ms). Use these instead of hardcoding, and never `transition: all`.
- **Every page's `<script type="module" src="...">` must point at its own entry** — `home/main.js`, `story/story.js`, `results/results.js`, `schedule/schedule-page.js`, `notfound/notfound.js`. This is a contract test (`site-contract.test.js`, "Page entry-script wiring") added 2026-08-02 after a redesign silently pointed `results/index.html` at `main.js` for over a week, orphaning the follower counter — see `.agents/context/subsystem-notes.md` before touching any page's closing `<script>` tag.

### Tests

16 files / 180 tests. Beyond the pure-logic units (`motion.js`, `graph.js`), there are **contract tests that read the HTML/CSS as text** — `site-contract.test.js` and `editorial-orchid-css.test.js` assert required classes exist, that certain things are *absent* (no `data-target` counter, no `contactForm`), and that each page loads its own entry script. A markup change can fail a test in a file that never imports it.

`.worktrees/` is excluded from the vitest glob in `vite.config.js`. Without it, a git worktree's copy of `tests/` gets collected and runs duplicate assertions against stale code.

### Content TODOs

No `TODO(spec` markers remain in any HTML. The live launch blocker is `data-cal-link=""` in `schedule/index.html` — until it is set, `/schedule/` renders the LinkedIn/phone fallback rather than a calendar. A live Razorpay payment link is intentionally not wired up yet — see `docs/superpowers/specs/2026-08-02-payment-readiness-pages-design.md`.

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
    *   Read when: Editing a specific subsystem — holds the *why* and traps the code can't. **Read this before touching the homepage** (`index.html`/`src/js/home/main.js`) **or any page's closing `<script>` tag.**
