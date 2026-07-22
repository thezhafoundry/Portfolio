# Sampath Kumar Portfolio ("The Conversation") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the four-page static portfolio site for Sampath Kumar per the locked "Conversation" identity, with a Cal.com scheduling page that emails both parties.

**Architecture:** Vite multi-page app (4 HTML entries), plain HTML/CSS/JS. One `identity.css` holds all locked design tokens; small focused JS modules (`motion.js`, `bubbles.js`, `graph.js`, `scheduler.js`, `nav.js`) provide behavior; the spring step and graph math are pure, unit-tested functions. Only third-party runtime script is Cal.com's embed, loaded on /schedule/ only.

**Tech Stack:** Vite 5, Vitest, vanilla JS (ES modules), Google Fonts (Fraunces + Inter), Cal.com inline embed, Playwright browser tooling for visual verification, Netlify (or Vercel) static hosting.

**Spec:** `docs/superpowers/specs/2026-07-22-sampath-portfolio-design.md` — the identity sheet in §3 is LOCKED; when this plan and the spec disagree, the spec wins.

## Global Constraints

- Palette (only these): White `#FFFFFF`, Honey `#FFC21A`, Ink `#1E1B12`, Cream `#FFF3CC`. No other colors, no gradients, no glows.
- Emphasis = italic Ink on a Honey sweep (`.sweep`). Never colored text alone. Max one per screen.
- Typefaces: Fraunces (600, italic for emphasis; display only) + Inter (400/600 only; everything else). No third typeface.
- Radii (only these): `18px` cards, `999px` pills/dots, `4px` bubble tails and sweeps.
- Motif: speech bubble with typing dots (Ink → 55% → 25%). Sampath's bubbles tail bottom-right; others' replies tail bottom-left. No variants.
- Motion: `transform`/`opacity` only; everything fully static and composed under `prefers-reduced-motion: reduce`; headings stay real DOM text (typing effect presentational, `aria-label` on the heading).
- Voice: CTA is always "Start a conversation" (never "Submit"); scheduler language is "pick a time to talk."
- Truth-in-content: only real numbers (+35% lead→meeting, 9.2/10 CSAT, 200M+ companies, 8,331 followers, 12 markets, 7+ years). Missing assets (spec §8) get clearly-labeled neutral TODOs or stay hidden in HTML comments — never invented content, never a link to a file that doesn't exist.
- Exactly one `h1` per page. Zero horizontal overflow at 320px+. No console errors.
- Every page task ends with the screenshot verification loop at 320 / 768 / 1024 / 1440 (see Task 5, Step 8 for the exact procedure — repeat it verbatim in later page tasks).
- Commit after every green step group; commit messages end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` (use a `-F` message file on Windows PowerShell — inline `-m` with parentheses/quotes breaks argument passing).

---

## File Structure

```
Portfolio/
├── package.json              # scripts: dev, build, preview, test
├── vite.config.js            # MPA: 4 inputs
├── netlify.toml               # build command + publish dir (Task 10)
├── index.html                 # Home
├── story/index.html           # Story
├── results/index.html         # Results
├── schedule/index.html        # Schedule
├── public/
│   ├── favicon.svg            # bubble motif
│   └── assets/                # (empty; portrait/cv arrive per spec §8)
├── src/
│   ├── styles/
│   │   ├── identity.css       # LOCKED tokens + base/reset + type scale
│   │   └── components.css     # nav, footer, buttons, bubbles, cards, sweeps
│   └── js/
│       ├── motion.js          # springStep (pure), animateSpring, typeHeading, reveals
│       ├── bubbles.js         # reply-bubble reveal + drift wiring
│       ├── graph.js           # buildGraphPath, countUpValue (pure) + renderer
│       ├── scheduler.js       # Cal.com embed init + fallback
│       └── nav.js             # mobile bubble menu
└── tests/
    ├── motion.test.js
    └── graph.test.js
```

Rationale: tokens live in exactly one file (spec §7); each JS module has one responsibility; pages are plain HTML so copy stays greppable. Nav/footer markup is duplicated across the 4 pages deliberately (4 static pages; a template layer is YAGNI) — any nav change must be applied to all 4 files.

---

### Task 1: Project scaffold, tokens, favicon

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html` (minimal shell, finished in Task 5), `src/styles/identity.css`, `public/favicon.svg`
- Test: `npm run build` succeeds; dev server serves the shell.

**Interfaces:**
- Produces: CSS custom properties consumed by ALL later tasks: `--white --honey --ink --cream --r-card --r-pill --r-tail --font-display --font-body --space-1..--space-7`; classes `.sweep`, `.label`, `.card`, `.container`.

- [ ] **Step 1: Create package.json**

```json
{
  "name": "sampath-portfolio",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Create vite.config.js**

```js
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        story: resolve(__dirname, 'story/index.html'),
        results: resolve(__dirname, 'results/index.html'),
        schedule: resolve(__dirname, 'schedule/index.html'),
      },
    },
  },
});
```

Note: `story/`, `results/`, `schedule/` don't exist until Tasks 6–8. Until then, comment those three input lines out and uncomment each as its page task starts (otherwise `vite build` fails on missing files).

- [ ] **Step 3: Create src/styles/identity.css** (the locked constitution — spec §3)

```css
/* ============ THE CONVERSATION — locked identity tokens (spec §3) ============ */
:root {
  /* palette — the only four colors on the site */
  --white: #FFFFFF;
  --honey: #FFC21A;
  --ink: #1E1B12;
  --cream: #FFF3CC;
  --hairline: rgba(30, 27, 18, 0.12); /* 12% Ink, inside cards only */

  /* radii — the only three */
  --r-card: 18px;
  --r-pill: 999px;
  --r-tail: 4px;

  /* type */
  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Inter", system-ui, sans-serif;
  --fs-h1: clamp(2.1rem, 5.5vw, 3.6rem);
  --fs-h2: clamp(1.5rem, 3.5vw, 2.2rem);
  --fs-body: 1rem;
  --fs-small: 0.8125rem;
  --fs-label: 0.6875rem;

  /* spacing scale — rhythm comes from alternating these, not uniform padding */
  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 1rem;
  --space-4: 1.75rem; --space-5: 3rem; --space-6: 5rem; --space-7: 7.5rem;
}

*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  background: var(--honey);          /* the Honey world */
  color: var(--ink);
  font-family: var(--font-body);
  font-size: var(--fs-body);
  line-height: 1.65;
}
img, svg { max-width: 100%; display: block; }

h1, h2 { font-family: var(--font-display); font-weight: 600; line-height: 1.13; margin: 0; }
h1 { font-size: var(--fs-h1); }
h2 { font-size: var(--fs-h2); }
p { margin: 0 0 var(--space-3); }
a { color: var(--ink); }

/* emphasis — italic Ink on a Honey sweep. Max one per screen. */
.sweep {
  font-style: italic;
  background: var(--honey);
  padding: 0 0.18em;
  border-radius: var(--r-tail);
}

/* small uppercase label */
.label {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--fs-label);
  letter-spacing: 0.22em;
  text-transform: uppercase;
}
.label--pill { background: var(--cream); padding: 0.35em 0.8em; border-radius: var(--r-pill); }

/* white card on the Honey world */
.card {
  background: var(--white);
  border-radius: var(--r-card);
  position: relative;
}
.container { max-width: 1120px; margin-inline: auto; padding-inline: clamp(16px, 4vw, 40px); }

:focus-visible { outline: 3px solid var(--ink); outline-offset: 2px; border-radius: var(--r-tail); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 4: Create public/favicon.svg** (the motif at its smallest scale)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <path fill="#FFC21A" d="M8 22C8 14.3 14.3 8 22 8h20c7.7 0 14 6.3 14 14v16c0 7.7-6.3 14-14 14H11c-1.7 0-3-1.3-3-3V22Z"/>
  <circle cx="22" cy="30" r="4.5" fill="#1E1B12"/>
  <circle cx="32" cy="30" r="4.5" fill="#1E1B12" opacity=".55"/>
  <circle cx="42" cy="30" r="4.5" fill="#1E1B12" opacity=".25"/>
</svg>
```

- [ ] **Step 5: Create minimal index.html shell** (replaced by the real Home in Task 5)

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sampath Kumar — Lead Generation &amp; Pre-Sales</title>
  <meta name="description" content="Sampath Kumar — B2B lead generation and pre-sales leader. 7+ years turning cold prospects into booked meetings across 12 markets.">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,400;1,9..144,600&family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/src/styles/identity.css">
</head>
<body>
  <main class="container">
    <h1>Every deal begins with <em class="sweep">hello.</em></h1>
  </main>
</body>
</html>
```

- [ ] **Step 6: Install and verify**

Run: `npm install` then `npm run build`
Expected: build succeeds, `dist/` contains `index.html`. (Keep the three missing MPA inputs commented per Step 2 note.)
Then `npm run dev`, open `http://localhost:5173/` — Honey background, Fraunces headline with Honey sweep on white… wait, the sweep is invisible on the Honey body background here; that's expected until the hero card exists in Task 5. Confirm fonts load (serif headline) and favicon shows the bubble.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -F <msgfile>   # "feat: scaffold Vite site with locked identity tokens and bubble favicon"
```

---

### Task 2: Spring physics — pure, tested (TDD)

**Files:**
- Create: `src/js/motion.js` (springStep, isSettled, prefersReducedMotion, animateSpring)
- Test: `tests/motion.test.js`

**Interfaces:**
- Produces:
  - `springStep(state, dt, params?) -> state` where `state = { value:number, velocity:number, target:number }`, `params = { stiffness=170, damping=14, mass=1 }`
  - `isSettled(state, epsilon=0.001) -> boolean`
  - `prefersReducedMotion() -> boolean`
  - `animateSpring({ from, to, params, onFrame, onDone }) -> cancelFn` (rAF loop; calls `onFrame(value)`; respects reduced motion by jumping straight to `to`)

- [ ] **Step 1: Write the failing tests** — `tests/motion.test.js`

```js
import { describe, it, expect } from 'vitest';
import { springStep, isSettled } from '../src/js/motion.js';

const run = (params, steps = 600) => {
  let s = { value: 0, velocity: 0, target: 100 };
  const trace = [];
  for (let i = 0; i < steps; i++) { s = springStep(s, 1 / 60, params); trace.push(s.value); }
  return { s, trace };
};

describe('springStep', () => {
  it('converges to the target', () => {
    const { s } = run({ stiffness: 170, damping: 26 });
    expect(s.value).toBeCloseTo(100, 1);
    expect(isSettled(s, 0.01)).toBe(true);
  });

  it('overshoots the target when underdamped (the brand spring)', () => {
    const { trace } = run({ stiffness: 170, damping: 10 });
    expect(Math.max(...trace)).toBeGreaterThan(100.5);
  });

  it('is pure — does not mutate the input state', () => {
    const input = { value: 0, velocity: 0, target: 100 };
    springStep(input, 1 / 60);
    expect(input).toEqual({ value: 0, velocity: 0, target: 100 });
  });

  it('stays put when already at rest on target', () => {
    const s = springStep({ value: 100, velocity: 0, target: 100 }, 1 / 60);
    expect(s.value).toBeCloseTo(100, 5);
    expect(s.velocity).toBeCloseTo(0, 5);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module '../src/js/motion.js'` (or missing exports).

- [ ] **Step 3: Implement src/js/motion.js (spring core only)**

```js
/* Spring physics core — pure and testable (spec §4). */
export function springStep(state, dt, { stiffness = 170, damping = 14, mass = 1 } = {}) {
  const displacement = state.value - state.target;
  const springForce = -stiffness * displacement;
  const dampingForce = -damping * state.velocity;
  const acceleration = (springForce + dampingForce) / mass;
  const velocity = state.velocity + acceleration * dt;
  const value = state.value + velocity * dt;
  return { value, velocity, target: state.target };
}

export function isSettled(state, epsilon = 0.001) {
  return Math.abs(state.value - state.target) < epsilon && Math.abs(state.velocity) < epsilon;
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* rAF driver. Returns a cancel function. */
export function animateSpring({ from, to, params, onFrame, onDone }) {
  if (prefersReducedMotion()) { onFrame(to); onDone?.(); return () => {}; }
  let state = { value: from, velocity: 0, target: to };
  let raf = 0;
  let last = performance.now();
  const tick = (now) => {
    const dt = Math.min((now - last) / 1000, 1 / 30); // clamp long frames
    last = now;
    state = springStep(state, dt, params);
    if (isSettled(state, 0.01)) { onFrame(to); onDone?.(); return; }
    onFrame(state.value);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add tests/motion.test.js src/js/motion.js
git commit -F <msgfile>   # "feat: pure spring physics core with tests"
```

---### Task 3: Graph math — pure, tested (TDD)

**Files:**
- Create: `src/js/graph.js`
- Test: `tests/graph.test.js`

**Interfaces:**
- Consumes: `animateSpring`? No — graph uses its own easing. Consumes nothing.
- Produces:
  - `easeOutCubic(t:number) -> number`
  - `countUpValue(from:number, to:number, progress:number) -> integer`
  - `buildGraphPath(points, width, height, pad=8) -> string` where `points = [{ t:number, v:number }]` sorted by `t`; returns an SVG path (`M x y L x y …`)
  - `renderFollowerCard(el)` — DOM renderer used by Task 5: if `el.dataset.points` (JSON) exists draws the line, else runs an honest count-up to `Number(el.dataset.target)` (spec §8.3 fallback).

- [ ] **Step 1: Write the failing tests** — `tests/graph.test.js`

```js
import { describe, it, expect } from 'vitest';
import { easeOutCubic, countUpValue, buildGraphPath } from '../src/js/graph.js';

describe('countUpValue', () => {
  it('returns endpoints at progress 0 and 1', () => {
    expect(countUpValue(0, 8331, 0)).toBe(0);
    expect(countUpValue(0, 8331, 1)).toBe(8331);
  });
  it('is monotonic for the real follower count', () => {
    let prev = -1;
    for (let p = 0; p <= 1.0001; p += 0.05) {
      const v = countUpValue(0, 8331, Math.min(p, 1));
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });
});

describe('easeOutCubic', () => {
  it('maps 0→0 and 1→1 and decelerates', () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
  });
});

describe('buildGraphPath', () => {
  const pts = [{ t: 2020, v: 0 }, { t: 2023, v: 4000 }, { t: 2026, v: 8331 }];
  it('starts with M at the left pad and ends at the right pad', () => {
    const d = buildGraphPath(pts, 400, 160, 8);
    expect(d.startsWith('M8')).toBe(true);
    const last = d.split(' L').at(-1);
    expect(Number(last.split(' ')[0])).toBeCloseTo(392, 0);
  });
  it('puts the max value at the top pad', () => {
    const d = buildGraphPath(pts, 400, 160, 8);
    const lastY = Number(d.split(' L').at(-1).split(' ')[1]);
    expect(lastY).toBeCloseTo(8, 0);
  });
  it('throws on fewer than 2 points', () => {
    expect(() => buildGraphPath([{ t: 1, v: 1 }], 400, 160)).toThrow();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — module/exports missing. (motion tests still pass.)

- [ ] **Step 3: Implement src/js/graph.js**

```js
import { prefersReducedMotion } from './motion.js';

export function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

export function countUpValue(from, to, progress) {
  return Math.round(from + (to - from) * easeOutCubic(progress));
}

export function buildGraphPath(points, width, height, pad = 8) {
  if (!points || points.length < 2) throw new Error('buildGraphPath needs >= 2 points');
  const ts = points.map(p => p.t);
  const vs = points.map(p => p.v);
  const minT = Math.min(...ts), maxT = Math.max(...ts);
  const maxV = Math.max(...vs);
  const sx = t => pad + ((t - minT) / (maxT - minT)) * (width - 2 * pad);
  const sy = v => (height - pad) - (v / maxV) * (height - 2 * pad);
  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(p.t).toFixed(1)} ${sy(p.v).toFixed(1)}`)
    .join(' ');
}

/* DOM renderer. Honest by construction (spec §8.3):
   - data-points present  -> draw the real curve, bubble riding the tip
   - data-points absent   -> count up the single real number, no curve   */
export function renderFollowerCard(el) {
  const target = Number(el.dataset.target); // 8331 — real number
  const numberEl = el.querySelector('[data-count]');
  const raw = el.dataset.points;

  const finish = () => { numberEl.textContent = target.toLocaleString('en-IN'); };
  if (prefersReducedMotion()) { finish(); drawStatic(); return; }

  const DURATION = 1800;
  let start;
  const tickCount = (now) => {
    start ??= now;
    const p = Math.min((now - start) / DURATION, 1);
    numberEl.textContent = countUpValue(0, target, p).toLocaleString('en-IN');
    if (raw) advanceLine(p);
    if (p < 1) requestAnimationFrame(tickCount);
  };

  let path, tip, totalLen;
  function drawStatic() {
    if (!raw) return;
    setupLine();
    path.style.strokeDashoffset = '0';
    const end = path.getPointAtLength(totalLen);
    tip.setAttribute('transform', `translate(${end.x} ${end.y})`);
  }
  function setupLine() {
    const points = JSON.parse(raw);
    const svg = el.querySelector('svg');
    const w = svg.viewBox.baseVal.width, h = svg.viewBox.baseVal.height;
    path = svg.querySelector('[data-line]');
    tip = svg.querySelector('[data-tip]');
    path.setAttribute('d', buildGraphPath(points, w, h));
    totalLen = path.getTotalLength();
    path.style.strokeDasharray = String(totalLen);
    path.style.strokeDashoffset = String(totalLen);
  }
  function advanceLine(p) {
    if (!path) setupLine();
    const eased = easeOutCubic(p);
    path.style.strokeDashoffset = String(totalLen * (1 - eased));
    const pt = path.getPointAtLength(totalLen * eased);
    tip.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
  }

  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { io.disconnect(); requestAnimationFrame(tickCount); }
  }, { threshold: 0.4 });
  io.observe(el);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: all motion + graph tests pass (10 total).

- [ ] **Step 5: Commit**

```bash
git add tests/graph.test.js src/js/graph.js
git commit -F <msgfile>   # "feat: follower graph math (pure, tested) with honest count-up fallback"
```

---

### Task 4: Components — bubbles, buttons, nav, footer, typing

**Files:**
- Create: `src/styles/components.css`, `src/js/bubbles.js`, `src/js/nav.js`
- Modify: `src/js/motion.js` (append `typeHeading`)
- Test: `npm run build`; behavior verified visually in Task 5's screenshot loop.

**Interfaces:**
- Consumes: tokens from `identity.css`; `prefersReducedMotion` from `motion.js`.
- Produces:
  - CSS classes: `.bubble` (+ `.bubble--me` tail bottom-right, `.bubble--reply` tail bottom-left, `.bubble--ink`, `.bubble--cream`, `.bubble--honey`), `.typing-dots`, `.btn`, `.btn--primary`, `.btn--ghost`, `.site-nav`, `.site-footer`, `.reveal`, `.drift`, `.drift--alt`
  - `initReveals(root=document)` from `bubbles.js` — springs `.reveal` elements in on scroll.
  - `initNav()` from `nav.js` — mobile bubble menu, `aria-expanded` handling.
  - `typeHeading(el, {unitDelay=90})` from `motion.js` — heading types itself; real DOM text preserved; `aria-label` set.

- [ ] **Step 1: Create src/styles/components.css**

```css
/* ============ components (all geometry from identity tokens) ============ */

/* --- the motif: speech bubble --- */
.bubble {
  display: inline-block;
  padding: 0.7em 1.1em;
  background: var(--honey);
  color: var(--ink);
  border-radius: var(--r-card);
  font-weight: 600;
  font-size: var(--fs-small);
  line-height: 1.5;
}
.bubble--me    { border-bottom-right-radius: var(--r-tail); }  /* Sampath speaks */
.bubble--reply { border-bottom-left-radius: var(--r-tail); }   /* the world replies */
.bubble--ink   { background: var(--ink);  color: var(--honey); }
.bubble--cream { background: var(--cream); color: var(--ink); }
.bubble--white { background: var(--white); color: var(--ink); border: 1.5px solid var(--ink); }

/* typing dots — Ink fading 100/55/25 */
.typing-dots { display: inline-flex; gap: 4px; align-items: center; }
.typing-dots i { width: 6px; height: 6px; border-radius: var(--r-pill); background: currentColor; }
.typing-dots i:nth-child(2) { opacity: 0.55; }
.typing-dots i:nth-child(3) { opacity: 0.25; }
@keyframes dot-pulse { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-3px); } }
.typing-dots--live i { animation: dot-pulse 1.2s infinite; }
.typing-dots--live i:nth-child(2) { animation-delay: 0.15s; }
.typing-dots--live i:nth-child(3) { animation-delay: 0.3s; }

/* --- buttons: physical (hover lift + tail sharpen, press squash) --- */
.btn {
  display: inline-block;
  font: 600 var(--fs-small) var(--font-body);
  padding: 0.85em 1.6em;
  border-radius: var(--r-pill);
  text-decoration: none;
  transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1), border-radius 0.18s;
  will-change: transform;
}
.btn--primary { background: var(--ink); color: var(--honey); }
.btn--ghost   { border: 1.5px solid var(--ink); color: var(--ink); }
.btn:hover  { transform: translateY(-2px); border-bottom-right-radius: var(--r-tail); }
.btn:active { transform: translateY(0) scale(0.97, 0.94); }

/* --- reveal + drift (spec §4) --- */
.reveal { opacity: 0; transform: translateY(18px) scale(0.96); }
.reveal.on {
  opacity: 1; transform: none;
  transition: opacity 0.45s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes drift { from { transform: translateY(0); } to { transform: translateY(-9px); } }
.drift      { animation: drift 5.5s ease-in-out infinite alternate; }
.drift--alt { animation: drift 6.5s ease-in-out infinite alternate-reverse; }
/* reveal+drift compose: drift is applied to a WRAPPER so transforms don't clash */

/* --- typing headline units --- */
.type-unit { opacity: 0; transform: translateY(0.3em); display: inline-block; }
.type-unit.on { opacity: 1; transform: none; transition: opacity 0.22s ease, transform 0.3s ease; }

/* --- nav --- */
.site-nav {
  display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-3) clamp(16px, 4vw, 40px);
}
.site-nav .brand {
  display: inline-flex; align-items: center; gap: 10px;
  font-weight: 600; text-decoration: none; font-size: var(--fs-small);
}
.brand-mark {
  width: 34px; height: 27px; background: var(--white); color: var(--ink);
  border-radius: 9px 9px var(--r-tail) 9px;
  display: inline-flex; align-items: center; justify-content: center;
}
.site-nav .links { margin-left: auto; display: flex; align-items: center; gap: var(--space-4); }
.site-nav .links a:not(.btn) {
  text-decoration: none; font-weight: 600; font-size: var(--fs-small);
  border-bottom: 2px solid transparent;
}
.site-nav .links a:not(.btn):hover,
.site-nav .links a[aria-current="page"] { border-bottom-color: var(--ink); }
.nav-toggle { display: none; }

@media (max-width: 720px) {
  .site-nav .links {
    display: none;
    position: absolute; right: 16px; top: 64px; z-index: 50;
    flex-direction: column; align-items: flex-start; gap: var(--space-3);
    background: var(--white); padding: var(--space-4);
    border-radius: var(--r-card); border-bottom-right-radius: var(--r-tail);
  }
  .site-nav .links.open { display: flex; }
  .nav-toggle {
    display: inline-flex; margin-left: auto; align-items: center; gap: 8px;
    background: var(--white); color: var(--ink); border: 0; font: 600 var(--fs-small) var(--font-body);
    padding: 0.6em 1.1em; border-radius: var(--r-pill); cursor: pointer;
  }
}

/* --- footer --- */
.site-footer {
  background: var(--ink); color: var(--white);
  margin-top: var(--space-6);
  padding: var(--space-5) clamp(16px, 4vw, 40px);
  display: flex; flex-wrap: wrap; gap: var(--space-4); align-items: center;
}
.site-footer a { color: var(--honey); font-weight: 600; font-size: var(--fs-small); }
.site-footer .fine { opacity: 0.7; font-size: var(--fs-small); margin-left: auto; }
```

- [ ] **Step 2: Append typeHeading to src/js/motion.js**

```js
/* Typing headline (spec §4): heading keeps its real DOM text; we wrap
   words/inline elements in .type-unit spans and reveal them in sequence.
   Screen readers get the full text via aria-label on the heading. */
export function typeHeading(el, { unitDelay = 90 } = {}) {
  const fullText = el.textContent.replace(/\s+/g, ' ').trim();
  el.setAttribute('aria-label', fullText);
  if (prefersReducedMotion()) return;

  const units = [];
  [...el.childNodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        const s = document.createElement('span');
        s.className = 'type-unit';
        s.textContent = part;
        frag.appendChild(s);
        units.push(s);
      });
      node.replaceWith(frag);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      node.classList.add('type-unit');
      units.push(node);
    }
  });

  units.forEach((u, i) => setTimeout(() => u.classList.add('on'), 350 + i * unitDelay));
}
```

- [ ] **Step 3: Create src/js/bubbles.js**

```js
import { prefersReducedMotion } from './motion.js';

/* Spring .reveal elements in when they enter the viewport. */
export function initReveals(root = document) {
  const els = [...root.querySelectorAll('.reveal')];
  if (prefersReducedMotion()) { els.forEach(el => el.classList.add('on')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('on'), (i % 3) * 120); // gentle stagger
      io.unobserve(entry.target);
    });
  }, { threshold: 0.25 });
  els.forEach(el => io.observe(el));
}
```

- [ ] **Step 4: Create src/js/nav.js**

```js
export function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.site-nav .links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if (!links.classList.contains('open')) return;
    if (!e.target.closest('.site-nav')) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}
```

- [ ] **Step 5: Build check and commit**

Run: `npm run build` — Expected: success. `npm test` — Expected: still 10 passed.

```bash
git add src/styles/components.css src/js/bubbles.js src/js/nav.js src/js/motion.js
git commit -F <msgfile>   # "feat: bubble/button/nav components and typing headline"
```

---

### Task 5: Home page

**Files:**
- Modify: `index.html` (replace the Task 1 shell entirely)
- Create: `src/styles/home.css`, `src/js/home.js`

**Interfaces:**
- Consumes: everything from Tasks 1–4: tokens, `.bubble* .btn* .reveal .drift .label .sweep .card`, `typeHeading`, `initReveals`, `initNav`, `renderFollowerCard`, `animateSpring`.
- Produces: the shared nav/footer markup pattern that Tasks 6–8 copy verbatim (changing only `aria-current`).

- [ ] **Step 1: Write index.html**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sampath Kumar — Lead Generation &amp; Pre-Sales</title>
  <meta name="description" content="Sampath Kumar — B2B lead generation and pre-sales leader. 7+ years turning cold prospects into booked meetings across 12 markets.">
  <meta property="og:title" content="Sampath Kumar — Every deal begins with hello.">
  <meta property="og:description" content="Lead generation & pre-sales. +35% lead-to-meeting conversions, 9.2/10 client satisfaction, 200M+ companies mapped.">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,600;1,9..144,400;1,9..144,600&family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/src/styles/identity.css">
  <link rel="stylesheet" href="/src/styles/components.css">
  <link rel="stylesheet" href="/src/styles/home.css">
</head>
<body>
  <header class="site-nav">
    <a class="brand" href="/">
      <span class="brand-mark" aria-hidden="true"><span class="typing-dots typing-dots--live"><i></i><i></i><i></i></span></span>
      Sampath Kumar
    </a>
    <button class="nav-toggle" aria-expanded="false" aria-controls="site-links">Menu
      <span class="typing-dots" aria-hidden="true"><i></i><i></i><i></i></span>
    </button>
    <nav id="site-links" class="links" aria-label="Main">
      <a href="/story/">Story</a>
      <a href="/results/">Results</a>
      <a href="/schedule/">Schedule</a>
      <a class="btn btn--primary" href="/schedule/">Start a conversation</a>
    </nav>
  </header>

  <main>
    <!-- ================= HERO (spec §6.1.1, locked composition) ================= -->
    <section class="container">
      <div class="card hero">
        <div class="hero-copy">
          <span class="label label--pill">Lead Generation · Pre-Sales</span>
          <h1 data-type>Every deal begins with <em class="sweep">hello.</em> I say it 12 markets wide.</h1>
          <p class="hero-sub">7+ years turning cold prospects into booked meetings — for SaaS, finance and private-markets teams from the US to APAC.</p>
          <div class="hero-actions">
            <a class="btn btn--primary" href="/schedule/">Start a conversation</a>
            <a class="btn btn--ghost" href="/results/">The results</a>
          </div>
        </div>
        <div class="hero-photo" aria-hidden="true">
          <div class="hero-shape">
            <!-- TODO(spec §8.1): replace silhouette with Sampath's real cutout portrait -->
            <svg class="hero-silhouette" viewBox="0 0 100 120" preserveAspectRatio="xMidYMax meet">
              <g fill="#D8A400">
                <circle cx="50" cy="26" r="19"/>
                <path d="M14 120 C14 78 32 62 50 62 C68 62 86 78 86 120 Z"/>
              </g>
            </svg>
          </div>
          <div class="drift hero-metric hero-metric--a"><span class="bubble bubble--ink bubble--reply">+35% lead → meeting</span></div>
          <div class="drift--alt drift hero-metric hero-metric--b"><span class="bubble bubble--white bubble--reply">9.2/10 client satisfaction</span></div>
        </div>
      </div>
    </section>

    <!-- ================= FOLLOWER COUNT (spec §6.1.2, honest fallback §8.3) ================= -->
    <section class="container section-gap">
      <div class="card followers reveal" id="follower-card" data-target="8331">
        <!-- TODO(spec §8.3): when real history arrives, add
             data-points='[{"t":2019,"v":0}, …, {"t":2026,"v":8331}]'
             and unhide the svg below. No invented curves. -->
        <svg viewBox="0 0 640 180" hidden aria-hidden="true">
          <path data-line fill="none" stroke="#1E1B12" stroke-width="3"/>
          <g data-tip><circle r="7" fill="#FFC21A" stroke="#1E1B12" stroke-width="2.5"/></g>
        </svg>
        <p class="label">LinkedIn, from zero</p>
        <p class="followers-number"><span data-count>0</span> followers</p>
        <p class="followers-note">Built one conversation at a time.</p>
      </div>
    </section>

    <!-- ================= WHAT I DO — a thread, not feature cards (spec §6.1.3) ================= -->
    <section class="container section-gap" aria-labelledby="thread-h">
      <h2 id="thread-h" class="thread-heading">How the work sounds</h2>
      <div class="thread">
        <div class="thread-row thread-row--left reveal">
          <div class="bubble bubble--cream bubble--reply thread-bubble">
            <span class="label">Research</span>
            <p>It starts with the map — 200M+ private companies, filtered by geography, size, industry and live signals until only the right ones remain.</p>
          </div>
        </div>
        <div class="thread-row thread-row--right reveal">
          <div class="bubble bubble--honey bubble--me thread-bubble">
            <span class="label">Outreach</span>
            <p>Then the hello — email and LinkedIn campaigns tuned to each market and time zone. Rewriting the playbook this way lifted lead-to-meeting conversions 35%.</p>
          </div>
        </div>
        <div class="thread-row thread-row--left reveal">
          <div class="bubble bubble--ink bubble--reply thread-bubble">
            <span class="label">Meeting</span>
            <p>Then the calendar fills — qualified conversations, a clean CRM pipeline, and clients who scored the work 9.2/10.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= TESTIMONIAL (spec §6.1.4) — hidden until real quotes arrive (§8.2)
    <section class="container section-gap">
      <figure class="card testimonial reveal">
        <blockquote class="bubble bubble--cream bubble--reply">QUOTE TEXT</blockquote>
        <figcaption>NAME — ROLE, COMPANY</figcaption>
      </figure>
    </section>
    ================= -->

    <!-- ================= CTA BAND (spec §6.1.5) ================= -->
    <section class="cta-band">
      <div class="container cta-inner">
        <h2>Your pipeline is one <em class="sweep sweep--on-honey">hello</em> away.</h2>
        <a class="btn btn--primary" href="/schedule/">Start a conversation</a>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <span class="typing-dots" aria-hidden="true" style="color:#FFC21A"><i></i><i></i><i></i></span>
    <span>Every deal begins with hello.</span>
    <a href="https://www.linkedin.com/in/sampath-kumar-tn66sk9699/" rel="noopener" target="_blank">LinkedIn</a>
    <a href="/schedule/">Schedule</a>
    <span class="fine">© 2026 Sampath Kumar</span>
  </footer>

  <script type="module" src="/src/js/home.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create src/styles/home.css**

```css
/* ================= hero — white card on Honey, photo right in brand bubble ================= */
.hero {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  min-height: 520px;
  margin-top: var(--space-3);
  overflow: visible;
}
.hero-copy { padding: var(--space-6) var(--space-3) var(--space-6) var(--space-5); }
.hero-copy h1 { margin: var(--space-4) 0 0; max-width: 13ch; }
.hero-sub { margin-top: var(--space-3); max-width: 42ch; color: var(--ink); opacity: 0.72; }
.hero-actions { margin-top: var(--space-4); display: flex; gap: var(--space-2); flex-wrap: wrap; }

.hero-photo { position: relative; }
.hero-shape {
  position: absolute; inset: -1px -1px -1px 24px;
  background: var(--honey);
  border-radius: 120px var(--r-card) var(--r-card) var(--r-tail);
  overflow: visible;
}
.hero-silhouette {
  position: absolute; left: 12%; right: 10%; bottom: 0;
  height: 108%;   /* head breaks the shape's top line (reference anatomy) */
}
.hero-metric { position: absolute; z-index: 2; }
.hero-metric--a { left: -18px; top: 18%; }
.hero-metric--b { left: 2px; bottom: 16%; }

/* ================= sections ================= */
.section-gap { margin-top: var(--space-6); }

.followers { padding: var(--space-5); text-align: center; }
.followers-number { font-family: var(--font-display); font-weight: 600; font-size: var(--fs-h2); margin: var(--space-2) 0 0; }
.followers-note { opacity: 0.65; font-size: var(--fs-small); }
.followers svg { width: min(640px, 100%); margin-inline: auto; }

.thread-heading { text-align: center; margin-bottom: var(--space-5); }
.thread { display: flex; flex-direction: column; gap: var(--space-4); max-width: 720px; margin-inline: auto; }
.thread-row { display: flex; }
.thread-row--right { justify-content: flex-end; }
.thread-bubble { max-width: 30rem; padding: var(--space-4); font-weight: 400; }
.thread-bubble .label { display: block; margin-bottom: var(--space-2); }
.thread-bubble p { margin: 0; }
.bubble--ink .label { color: var(--honey); }

.cta-band { background: var(--white); margin-top: var(--space-7); }
.cta-inner { padding-block: var(--space-6); display: flex; align-items: center; gap: var(--space-4); flex-wrap: wrap; justify-content: space-between; }
/* the sweep sits on a WHITE band here, so Honey still reads (identity: emphasis = Ink italic on Honey) */

/* ================= mobile recomposition (spec §3.5) ================= */
@media (max-width: 860px) {
  .hero { grid-template-columns: 1fr; min-height: 0; }
  .hero-copy { padding: var(--space-5) var(--space-4) var(--space-3); }
  .hero-photo { min-height: 340px; margin-top: var(--space-3); }
  .hero-shape { inset: 0 -1px -1px -1px; border-radius: 120px var(--r-card) var(--r-tail) var(--r-card); }
  .hero-metric--a { left: 8px; top: 6%; }
  .hero-metric--b { left: auto; right: 8px; bottom: 8%; }
}
@media (max-width: 380px) {
  .hero-copy h1 { font-size: 1.9rem; }
}
```

- [ ] **Step 3: Create src/js/home.js**

```js
import { typeHeading, animateSpring, prefersReducedMotion } from './motion.js';
import { initReveals } from './bubbles.js';
import { initNav } from './nav.js';
import { renderFollowerCard } from './graph.js';

initNav();
initReveals();
typeHeading(document.querySelector('[data-type]'));
renderFollowerCard(document.getElementById('follower-card'));

/* Hero entrance (spec §4): portrait bubble springs in, photo rises a beat later. */
const shape = document.querySelector('.hero-shape');
const photo = document.querySelector('.hero-silhouette');
if (shape && photo && !prefersReducedMotion()) {
  shape.style.transform = 'scale(0.6)';
  shape.style.transformOrigin = 'top right';
  photo.style.transform = 'translateY(30%)';
  photo.style.opacity = '0';
  animateSpring({
    from: 0.6, to: 1, params: { stiffness: 170, damping: 12 },
    onFrame: v => { shape.style.transform = `scale(${v})`; },
  });
  setTimeout(() => {
    photo.style.opacity = '1';
    animateSpring({
      from: 30, to: 0, params: { stiffness: 150, damping: 16 },
      onFrame: v => { photo.style.transform = `translateY(${v}%)`; },
    });
  }, 260);
}
```

- [ ] **Step 4: Manual smoke check**

Run: `npm run dev`, open `http://localhost:5173/`.
Expected: typing headline resolves; metrics drift; follower count counts to 8,331 when scrolled into view; no console errors.

- [ ] **Step 5: Unit tests still green**

Run: `npm test` — Expected: 10 passed.

- [ ] **Step 6: Screenshot verification loop (THE GATE — spec §9; repeat verbatim for every page task)**

Using Playwright browser tooling against the dev server, for each width **320, 768, 1024, 1440**:

1. `browser_resize` to `{width, 900}`; `browser_navigate` to the page URL.
2. `browser_take_screenshot` — then actually LOOK at it and list defects (overlap, cramped spacing, broken composition, text covering the headline) BEFORE continuing.
3. `browser_evaluate`:
```js
() => ({
  h1Count: document.querySelectorAll('h1').length,               // must be 1
  overflowPx: document.documentElement.scrollWidth - document.documentElement.clientWidth, // must be 0
  fontsLoaded: document.fonts.status,                            // "loaded"
})
```
4. `browser_console_messages` — must contain no errors.
5. Reduced-motion pass: browser emulation isn't available in this toolset, so the gate is twofold — (a) code review: every animated element must have a complete static end state and every JS animation must early-exit via `prefersReducedMotion()`; (b) after scrolling to the bottom, `browser_evaluate` `() => document.querySelectorAll('.reveal:not(.on)').length` — must be 0.

Fix every defect found, re-shoot, repeat until clean.

- [ ] **Step 7: Commit**

```bash
git add index.html src/styles/home.css src/js/home.js
git commit -F <msgfile>   # "feat: home page — hero, follower count, thread, CTA band"
```

---

### Task 6: Story page

**Files:**
- Create: `story/index.html`, `src/styles/story.css`, `src/js/story.js`
- Modify: `vite.config.js` (uncomment the `story` input)

**Interfaces:**
- Consumes: Task 1–4 outputs; nav/footer markup copied from Task 5's `index.html` with `aria-current="page"` on the Story link and asset paths unchanged (they're absolute).
- Produces: nothing new.

- [ ] **Step 1: Create story/index.html**

Head: identical to Home's `<head>` except:
`<title>Story — Sampath Kumar</title>`, description "Engineer turned sales leader — Sampath Kumar's journey from a mechanical-engineering diploma in Coimbatore to leading global lead generation.", stylesheet `story.css` instead of `home.css`, script `/src/js/story.js`.

Body: nav + footer copied verbatim from Home (add `aria-current="page"` to the Story link). Main content:

```html
<main>
  <section class="container">
    <div class="card story-head">
      <span class="label label--pill">The Story</span>
      <h1>From machine shop to <em class="sweep">hello.</em></h1>
      <p class="story-intro">Engineer-turned-sales leader. This is how a mechanical-engineering student from Coimbatore ended up opening doors in twelve markets.</p>
    </div>
  </section>

  <section class="container section-gap" aria-label="Career timeline">
    <ol class="story-thread">
      <li class="thread-row thread-row--left reveal">
        <div class="bubble bubble--cream bubble--reply thread-bubble">
          <span class="label--pill label">2013 – 2016</span>
          <p>Diploma in Mechanical Engineering, Sree Narayana Guru Polytechnic. Learning how machines fit together.</p>
        </div>
      </li>
      <li class="thread-row thread-row--right reveal">
        <div class="bubble bubble--honey bubble--me thread-bubble">
          <span class="label--pill label">2017 – 2020</span>
          <p>B.E. at Sri Krishna College of Technology. The engineering mindset sticks: systems, inputs, outputs.</p>
        </div>
      </li>
    </ol>
  </section>

  <!-- grid-breaking pivot interruption (spec §6.2) -->
  <section class="pivot" aria-label="The pivot">
    <div class="container">
      <!-- TODO(spec §8.6): replace with Sampath's own words about the engineer→sales pivot.
           Neutral placeholder below; approved copy required before launch. -->
      <p class="pivot-quote">2020: the pivot from engineering to sales.<br><span class="pivot-todo">[ Pull-quote in Sampath's own words — to be supplied ]</span></p>
    </div>
  </section>

  <section class="container section-gap" aria-label="Career timeline continued">
    <ol class="story-thread">
      <li class="thread-row thread-row--left reveal">
        <div class="bubble bubble--cream bubble--reply thread-bubble">
          <span class="label--pill label">2020 – 2021 · Zinnov / Draup</span>
          <p>Pre-sales lead: solution consulting, demos, proposals — learning to translate products into conversations.</p>
        </div>
      </li>
      <li class="thread-row thread-row--right reveal">
        <div class="bubble bubble--honey bubble--me thread-bubble">
          <span class="label--pill label">2021 – 2022 · Alore</span>
          <p>Lead generation specialist: outbound campaigns across the US, UK and Australia; research, QA and reporting discipline.</p>
        </div>
      </li>
      <li class="thread-row thread-row--left reveal">
        <div class="bubble bubble--cream bubble--reply thread-bubble">
          <span class="label--pill label">2022 – 2023 · Ecosmob</span>
          <p>Lead generation manager: leading a team, territory allocation across US, UK, MENA and APAC, campaign analytics.</p>
        </div>
      </li>
      <li class="thread-row thread-row--right reveal">
        <div class="bubble bubble--honey bubble--me thread-bubble">
          <span class="label--pill label">2023 · Uplers / Mavlers</span>
          <p>Business development manager: global campaigns, Salesforce hygiene, investor and partner research.</p>
        </div>
      </li>
      <li class="thread-row thread-row--left reveal">
        <div class="bubble bubble--cream bubble--reply thread-bubble">
          <span class="label--pill label">2024 · The Sales Group, Toronto (remote)</span>
          <p>Lead generation manager for North American clients — custom outbound strategies, fractional sales support.</p>
        </div>
      </li>
      <li class="thread-row thread-row--right reveal">
        <div class="bubble bubble--ink bubble--me thread-bubble">
          <span class="label">2024 – 2025 · Finquest, Bengaluru</span>
          <p>Senior Lead Generation Manager: proprietary mid-market M&amp;A sourcing across North America, Europe and APAC. The numbers on the Results page happened here.</p>
        </div>
      </li>
      <li class="thread-row thread-row--left reveal">
        <div class="bubble bubble--cream bubble--reply thread-bubble">
          <span class="label--pill label">2024 – 2026 · MBA, Amrita</span>
          <p>Marketing management, in progress — sharpening the theory under seven years of practice.</p>
        </div>
      </li>
    </ol>
  </section>

  <section class="container section-gap">
    <div class="card story-close">
      <div class="story-photo" aria-hidden="true">
        <!-- TODO(spec §8.1): casual photo of Sampath goes here -->
        <div class="story-photo-slot"><span class="label">Photo — to be added</span></div>
      </div>
      <div>
        <h2>The short version</h2>
        <p>An engineer's head, a salesperson's calendar. Based in Greater Coimbatore, working on everyone's time zones.</p>
        <a class="btn btn--ghost" href="/results/">Here's what that journey produced →</a>
      </div>
    </div>
  </section>
</main>
```

- [ ] **Step 2: Create src/styles/story.css**

```css
.story-head { padding: var(--space-6) var(--space-5); margin-top: var(--space-3); }
.story-head h1 { margin-top: var(--space-4); max-width: 16ch; }
.story-intro { margin-top: var(--space-3); max-width: 48ch; opacity: 0.72; }

.story-thread { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--space-4); max-width: 720px; margin-inline: auto; }
.thread-row { display: flex; }
.thread-row--right { justify-content: flex-end; }
.thread-bubble { max-width: 30rem; padding: var(--space-4); font-weight: 400; }
.thread-bubble .label { display: inline-block; margin-bottom: var(--space-2); }
.thread-bubble p { margin: 0; }
.bubble--ink .label { color: var(--honey); }
.section-gap { margin-top: var(--space-6); }

/* full-bleed Honey interruption — the ONE grid-breaking move on this page */
.pivot { background: var(--white); margin-block: var(--space-7); }
.pivot .container { padding-block: var(--space-6); }
.pivot-quote { font-family: var(--font-display); font-weight: 600; font-size: var(--fs-h2); line-height: 1.25; max-width: 26ch; margin: 0; }
.pivot-todo { font-size: var(--fs-small); font-family: var(--font-body); font-weight: 600; opacity: 0.5; }

.story-close { display: grid; grid-template-columns: 280px 1fr; gap: var(--space-5); padding: var(--space-5); align-items: center; }
.story-photo-slot {
  aspect-ratio: 4 / 5; background: var(--cream);
  border-radius: var(--r-card) var(--r-card) var(--r-card) var(--r-tail);
  display: grid; place-items: center;
}
@media (max-width: 720px) {
  .story-close { grid-template-columns: 1fr; }
  .thread-bubble { max-width: 100%; }
}
```

(Note: `.thread-row` / `.thread-bubble` are duplicated from `home.css`. Move those shared rules INTO `components.css` now and delete from `home.css` — one definition, both pages use it.)

- [ ] **Step 3: Create src/js/story.js**

```js
import { initReveals } from './bubbles.js';
import { initNav } from './nav.js';
initNav();
initReveals();
```

- [ ] **Step 4: Enable the MPA input and verify**

Uncomment `story` in `vite.config.js`. Run `npm run build` — Expected: success with both entries. Dev-server the page at `http://localhost:5173/story/`.

- [ ] **Step 5: Screenshot verification loop** — repeat Task 5 Step 6 verbatim for `/story/`. Extra check at 320: timeline bubbles stack full-width, dates don't wrap mid-word.

- [ ] **Step 6: Commit**

```bash
git add story/ src/styles/story.css src/styles/home.css src/styles/components.css src/js/story.js vite.config.js
git commit -F <msgfile>   # "feat: story page — career thread with pivot interruption"
```

---

### Task 7: Results page

**Files:**
- Create: `results/index.html`, `src/styles/results.css`, `src/js/results.js`
- Modify: `vite.config.js` (uncomment `results` input)

**Interfaces:**
- Consumes: shared components (thread bubbles now in `components.css`), nav/footer pattern.
- Produces: nothing new.

- [ ] **Step 1: Create results/index.html**

Head: as Home but `<title>Results — Sampath Kumar</title>`, description "Seven years of B2B lead generation results: +35% lead-to-meeting conversions, 9.2/10 client satisfaction, 200M+ companies mapped.", stylesheets `results.css`, script `/src/js/results.js`. Nav/footer verbatim with `aria-current="page"` on Results.

Main — editorial ledger, Finquest as anchor (spec §6.3). All achievements below are real (source: `linkedin-profile.md`):

```html
<main>
  <section class="container">
    <div class="card results-head">
      <span class="label label--pill">The Results</span>
      <h1>Conversations that turned into <em class="sweep">outcomes.</em></h1>
    </div>
  </section>

  <!-- ============ FINQUEST — the anchor entry ============ -->
  <section class="container section-gap" aria-labelledby="finquest-h">
    <article class="card role role--anchor">
      <header class="role-head">
        <h2 id="finquest-h">Finquest — Senior Lead Generation Manager</h2>
        <span class="label label--pill">Jul 2024 – Sep 2025 · Bengaluru</span>
      </header>
      <p class="role-context">Outbound strategy for proprietary mid-market M&amp;A sourcing across North America, Europe and APAC — private-markets intelligence for PE and corporate buyers.</p>
      <div class="role-replies">
        <p class="bubble bubble--honey bubble--me reveal">Built proprietary databases of <strong>200M+ private companies</strong> for buy-side and sell-side engagements.</p>
        <p class="bubble bubble--cream bubble--reply reveal">Found a bolt-on acquisition in a niche vertical competitors ignored — introduction made, deal closed.</p>
        <p class="bubble bubble--ink bubble--reply reveal">Mapped an entire market segment for a PE client — sourcing time cut from months to weeks.</p>
        <p class="bubble bubble--honey bubble--me reveal">Revamped messaging with industry-specific value propositions: <strong>+35% lead-to-meeting conversions</strong>.</p>
        <p class="bubble bubble--cream bubble--reply reveal">Average client satisfaction <strong>9.2/10</strong> for responsiveness, lead quality and market coverage.</p>
      </div>
    </article>
  </section>

  <!-- ============ EARLIER ROLES — ledger entries ============ -->
  <section class="container section-gap" aria-label="Earlier roles">
    <article class="card role reveal">
      <header class="role-head">
        <h2>The Sales Group — Lead Generation Manager</h2>
        <span class="label label--pill">Jan – Jun 2024 · Toronto, remote</span>
      </header>
      <p class="role-context">Custom outbound strategies for North American clients — part-time BDR programs, fractional sales leadership, measurable pipeline per client ICP.</p>
    </article>

    <article class="card role reveal">
      <header class="role-head">
        <h2>Uplers / Mavlers — Business Development Manager</h2>
        <span class="label label--pill">May – Dec 2023 · Ahmedabad</span>
      </header>
      <p class="role-context">Global email + LinkedIn campaigns across US, UK, Africa and Asia; Salesforce data QA; investor and partner research; cross-time-zone lead routing.</p>
    </article>

    <article class="card role reveal">
      <header class="role-head">
        <h2>Ecosmob Technologies — Lead Generation Manager</h2>
        <span class="label label--pill">Jun 2022 – Apr 2023 · Ahmedabad</span>
      </header>
      <p class="role-context">Led the lead-gen team: territory allocation across US, UK, MENA, APAC; automated inbound/outbound campaigns; monthly conversion analytics.</p>
    </article>

    <article class="card role reveal">
      <header class="role-head">
        <h2>Alore — Lead Generation Specialist</h2>
        <span class="label label--pill">Apr 2021 – May 2022 · Bengaluru</span>
      </header>
      <p class="role-context">Prospect research and qualification; targeted outbound across US, UK, Australia; lead assignment and QA across research, outreach and sales.</p>
    </article>

    <article class="card role reveal">
      <header class="role-head">
        <h2>Zinnov / Draup — Pre-sales Lead</h2>
        <span class="label label--pill">Jul 2020 – Mar 2021 · Coimbatore</span>
      </header>
      <p class="role-context">Solution consulting across the Digital &amp; Analytics portfolio: demos, commercial and technical proposals, deal-complexity analysis.</p>
    </article>
  </section>

  <!-- TESTIMONIALS between roles (spec §6.3) — hidden until §8.2 assets arrive
  <section class="container section-gap">
    <figure class="testimonial">…named quote-bubble…</figure>
  </section> -->

  <!-- designed next step — never a dead end (spec §6.3) -->
  <section class="cta-band">
    <div class="container cta-inner">
      <h2>Want results like these on your pipeline?</h2>
      <a class="btn btn--primary" href="/schedule/">Start a conversation</a>
    </div>
  </section>
</main>
```

- [ ] **Step 2: Create src/styles/results.css**

```css
.results-head { padding: var(--space-6) var(--space-5); margin-top: var(--space-3); }
.results-head h1 { margin-top: var(--space-4); max-width: 18ch; }
.section-gap { margin-top: var(--space-5); }

.role { padding: var(--space-5); }
.role-head { display: flex; align-items: baseline; gap: var(--space-3); flex-wrap: wrap; justify-content: space-between; border-bottom: 1px solid var(--hairline); padding-bottom: var(--space-3); }
.role-context { margin-top: var(--space-3); max-width: 60ch; opacity: 0.8; }

.role--anchor { border-bottom-right-radius: var(--r-tail); }
.role-replies { display: flex; flex-direction: column; gap: var(--space-3); margin-top: var(--space-4); align-items: flex-start; }
.role-replies .bubble { max-width: 34rem; font-weight: 400; padding: var(--space-3) var(--space-4); }
.role-replies .bubble--me { align-self: flex-end; }
.role-replies strong { font-weight: 600; }

.cta-band { background: var(--white); margin-top: var(--space-7); }
.cta-inner { padding-block: var(--space-6); display: flex; align-items: center; gap: var(--space-4); flex-wrap: wrap; justify-content: space-between; }
```

(`.cta-band`/`.cta-inner` now appear on two pages — move them from `home.css` into `components.css` and delete both page copies.)

- [ ] **Step 3: Create src/js/results.js**

```js
import { initReveals } from './bubbles.js';
import { initNav } from './nav.js';
initNav();
initReveals();
```

- [ ] **Step 4: Enable MPA input, build, verify**

Uncomment `results` in `vite.config.js`; `npm run build`; dev-check `/results/`.

- [ ] **Step 5: Screenshot verification loop** — Task 5 Step 6 verbatim for `/results/`. Extra check: h2-per-role (h1 only in the head card); anchor bubbles alternate left/right cleanly at 320.

- [ ] **Step 6: Commit**

```bash
git add results/ src/styles/results.css src/styles/components.css src/styles/home.css src/js/results.js vite.config.js
git commit -F <msgfile>   # "feat: results page — editorial ledger with Finquest anchor"
```

---

### Task 8: Schedule page (Cal.com embed + fallback)

**Files:**
- Create: `schedule/index.html`, `src/styles/schedule.css`, `src/js/scheduler.js`, `src/js/schedule-page.js`
- Modify: `vite.config.js` (uncomment `schedule` input)

**Interfaces:**
- Consumes: shared components; nav/footer pattern.
- Produces: `initScheduler({ calLink, container, fallback, timeoutMs }) -> void` (exported for potential reuse; used only here).

- [ ] **Step 1: Create src/js/scheduler.js**

```js
/* Cal.com inline embed with a designed fallback (spec §6.4).
   Cal.com sends confirmation emails to BOTH parties and calendar invites —
   this satisfies the "schedule a meeting which sends a mail" requirement. */

const CAL_ORIGIN = 'https://cal.com';
const EMBED_SRC = 'https://app.cal.com/embed/embed.js';

export function initScheduler({ calLink, container, fallback, timeoutMs = 8000 }) {
  // No real link yet (spec §8.4) -> show the designed fallback immediately.
  if (!calLink || calLink.startsWith('TODO')) { showFallback(); return; }

  let settled = false;
  const timer = setTimeout(showFallback, timeoutMs);

  function showFallback() {
    if (settled) return;
    settled = true;
    container.hidden = true;
    fallback.hidden = false;
  }
  function markReady() {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
  }

  try {
    /* Official Cal.com embed snippet (loader) */
    (function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal; let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {}; cal.q = cal.q || [];
          d.head.appendChild(d.createElement('script')).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar); p(cal, ['initNamespace', namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, EMBED_SRC, 'init');

    window.Cal('init', { origin: CAL_ORIGIN });
    window.Cal('inline', {
      elementOrSelector: container,
      calLink,
      config: { theme: 'light' },
    });
    window.Cal('ui', {
      cssVarsPerTheme: { light: { 'cal-brand': '#1E1B12' } },
      hideEventTypeDetails: false,
    });
    window.Cal('on', { action: 'linkReady', callback: markReady });
    window.Cal('on', { action: 'linkFailed', callback: showFallback });
  } catch {
    showFallback();
  }
}
```

- [ ] **Step 2: Create schedule/index.html**

Head: as Home but `<title>Schedule — Sampath Kumar</title>`, description "Pick a time to talk with Sampath Kumar — lead generation and pre-sales.", stylesheet `schedule.css`, script `/src/js/schedule-page.js`. Nav/footer verbatim, `aria-current="page"` on Schedule.

```html
<main>
  <section class="container">
    <div class="card sched">
      <span class="label label--pill">Schedule</span>
      <h1>Pick a time. I'll say <em class="sweep">hello</em> first.</h1>
      <p class="sched-sub">Thirty minutes, your time zone — Cal.com confirms by email to both of us and puts it on our calendars.</p>

      <!-- Cal.com inline embed mounts here.
           TODO(spec §8.4): set data-cal-link to Sampath's real Cal.com link, e.g. "sampath-kumar/30min" -->
      <div id="cal-embed" data-cal-link="TODO" class="cal-embed">
        <p class="cal-loading"><span class="typing-dots typing-dots--live" aria-hidden="true"><i></i><i></i><i></i></span> Loading the calendar…</p>
      </div>

      <!-- designed fallback — the page never dead-ends (spec §6.4) -->
      <div id="cal-fallback" hidden class="bubble bubble--cream bubble--reply cal-fallback">
        <p><strong>The calendar is warming up.</strong> Reach me directly instead:</p>
        <ul class="cal-fallback-list">
          <li><a href="https://www.linkedin.com/in/sampath-kumar-tn66sk9699/" rel="noopener" target="_blank">Message me on LinkedIn</a></li>
          <!-- TODO(spec §8.5): add public email as <li><a href="mailto:…">…</a></li> when supplied -->
          <!-- TODO(spec §8.4): add direct booking URL <li><a href="https://cal.com/…">Book on Cal.com</a></li> when account exists -->
        </ul>
      </div>
    </div>
  </section>

  <section class="container section-gap">
    <div class="sched-links">
      <a class="bubble bubble--white bubble--me sched-link" href="https://www.linkedin.com/in/sampath-kumar-tn66sk9699/" rel="noopener" target="_blank">LinkedIn — 8,331 followers</a>
      <!-- TODO(spec §8.5): uncomment when cv.pdf exists in public/assets/
      <a class="bubble bubble--ink bubble--me sched-link" href="/assets/cv.pdf" download>Download CV</a> -->
      <!-- TODO(spec §8.5): uncomment when public email confirmed
      <a class="bubble bubble--honey bubble--me sched-link" href="mailto:EMAIL">EMAIL</a> -->
    </div>
  </section>
</main>
```

- [ ] **Step 3: Create src/js/schedule-page.js**

```js
import { initNav } from './nav.js';
import { initReveals } from './bubbles.js';
import { initScheduler } from './scheduler.js';

initNav();
initReveals();

const container = document.getElementById('cal-embed');
initScheduler({
  calLink: container.dataset.calLink,
  container,
  fallback: document.getElementById('cal-fallback'),
});
```

- [ ] **Step 4: Create src/styles/schedule.css**

```css
.sched { padding: var(--space-6) var(--space-5); margin-top: var(--space-3); }
.sched h1 { margin-top: var(--space-4); max-width: 16ch; }
.sched-sub { margin-top: var(--space-3); max-width: 46ch; opacity: 0.72; }

.cal-embed { margin-top: var(--space-5); min-height: 480px; }
.cal-loading { display: flex; gap: 10px; align-items: center; opacity: 0.6; font-size: var(--fs-small); font-weight: 600; }

.cal-fallback { margin-top: var(--space-5); max-width: 34rem; font-weight: 400; padding: var(--space-4); }
.cal-fallback-list { margin: var(--space-2) 0 0; padding-left: 1.1em; }

.section-gap { margin-top: var(--space-5); }
.sched-links { display: flex; gap: var(--space-3); flex-wrap: wrap; }
.sched-link { text-decoration: none; }
```

- [ ] **Step 5: Enable MPA input, build, verify fallback behavior**

Uncomment `schedule` in `vite.config.js`; `npm run build`.
Dev-check `/schedule/`: because `data-cal-link="TODO"`, the embed container hides and the designed fallback bubble shows immediately — correct per spec §8.4. Confirm no console errors.

- [ ] **Step 6: Screenshot verification loop** — Task 5 Step 6 verbatim for `/schedule/`.

- [ ] **Step 7: Commit**

```bash
git add schedule/ src/styles/schedule.css src/js/scheduler.js src/js/schedule-page.js vite.config.js
git commit -F <msgfile>   # "feat: schedule page — Cal.com embed with designed fallback"
```

---

### Task 9: Site-wide verification sweep

**Files:**
- Modify: whatever the sweep flags (expect small CSS fixes).

**Interfaces:** none new.

- [ ] **Step 1: Full-gate pass on every page**

For each of `/`, `/story/`, `/results/`, `/schedule/` run the complete Task 5 Step 6 loop again (all four widths). All gates: 1 h1, 0 overflow px, fonts loaded, console clean, every `.reveal` ends `.on` after scroll, no mid-word breaks in display type (inspect screenshots), headline unobstructed at 320.

- [ ] **Step 2: Cross-page consistency check**

`browser_evaluate` on each page:
```js
() => ({
  navLinks: [...document.querySelectorAll('.site-nav .links a')].map(a => a.getAttribute('href')),
  ctaText: [...document.querySelectorAll('.btn--primary')].map(b => b.textContent.trim()),
})
```
Expected: identical nav on all pages; every primary CTA reads exactly "Start a conversation".

- [ ] **Step 3: Accessibility spot checks**

- Tab through each page: focus visible (Ink outline) on every link/button; mobile menu operable by keyboard, `aria-expanded` toggles.
- `h1` has `aria-label` equal to its visible text on Home (typeHeading sets it).
- All `aria-hidden` decorations (silhouette, dots) verified present.

- [ ] **Step 4: Fix everything found, re-shoot, commit**

```bash
git add -A
git commit -F <msgfile>   # "fix: site-wide verification sweep findings"
```

---

### Task 10: Deploy configuration + README

**Files:**
- Create: `netlify.toml`, `README.md`

**Interfaces:** none.

- [ ] **Step 1: Create netlify.toml**

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

- [ ] **Step 2: Create README.md**

```markdown
# Sampath Kumar — Portfolio ("The Conversation")

Four-page static site. Vite + vanilla JS. Identity spec:
`docs/superpowers/specs/2026-07-22-sampath-portfolio-design.md` (LOCKED §3).

## Commands
- `npm run dev` — dev server
- `npm run build` — production build to `dist/`
- `npm test` — unit tests (spring physics, graph math)

## Deploy
Netlify: connect the repo; `netlify.toml` handles the rest.
(Vercel works too: framework preset "Vite", output `dist`.)

## Before launch — real-content TODOs (spec §8)
Search the codebase for `TODO(spec` — each site marks where an asset lands:
1. Portrait cutout + casual photo → `public/assets/`, wire into `index.html` hero and `story/index.html`
2. Testimonials (named, permitted) → uncomment blocks in `index.html`, `results/index.html`
3. Follower history points → `data-points` on `#follower-card`, unhide the svg
4. Cal.com link → `data-cal-link` in `schedule/index.html`
5. CV PDF + public email → uncomment links in `schedule/index.html`
6. Pivot pull-quote (Sampath's words) → `story/index.html` `.pivot`
```

- [ ] **Step 3: Final build + test + commit**

Run: `npm run build && npm test` — Expected: clean build, all tests pass.

```bash
git add netlify.toml README.md
git commit -F <msgfile>   # "chore: deploy config and README with launch TODO checklist"
```

---

## Plan Self-Review Notes (already applied)

- Spec coverage: §3 tokens→Task 1; §4 motion→Tasks 2/4; §5 nav→Tasks 4/5; §6.1→Task 5; §6.2→Task 6; §6.3→Task 7; §6.4→Task 8; §7 architecture→file structure + Tasks 1–3; §8 truth→TODO(spec §8.x) markers + README checklist; §9 gates→Tasks 5–9; §10 honored throughout.
- Shared-rule consolidation (thread bubbles, cta-band) is folded into Tasks 6 and 7 as explicit steps rather than a separate refactor task.
- Reduced-motion has no browser-emulation step available in the toolset; the plan compensates with the `identity.css` global kill switch + JS `prefersReducedMotion()` early-exits + Task 9 code-review check. Acceptable.
