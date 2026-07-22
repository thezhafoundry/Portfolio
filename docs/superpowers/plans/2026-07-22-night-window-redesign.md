# Night Window Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Flip the site from the honey-world to a light identity (white base, honey accents), add one dark "Night Window" Signal Path panel + proof band + win-route cards on home, and replace the typing-bubble logo with the North Node mark everywhere.

**Architecture:** Pure HTML/CSS restyle of a static Vite multi-page site. No new JS: new sections reuse the existing `.reveal` scroll system; all motion stays as-is (user parked motion). The constellation is absolutely-positioned divs inside a fixed-height zone that restacks to a flex column under 640px.

**Tech Stack:** Vite 5, vanilla HTML/CSS/ES modules, Vitest (existing suites must keep passing). No new dependencies.

**Spec:** `docs/superpowers/specs/2026-07-22-signal-path-redesign-design.md`

## Global Constraints

- Palette is ONLY: White `#FFFFFF`, Honey `#FFC21A`, Ink `#1E1B12`, Cream `#FFF3CC` — plus alpha tints of these (e.g. `rgba(30,27,18,.08)` hairline, `rgba(255,243,204,.13)` night dots, `rgba(255,194,26,.85)` glow). No fifth color.
- Fonts: Fraunces (display) and Inter (body) only. Radii: `18px` / fully-round / `4px` only.
- **Exactly one Night panel on the entire site** (home, mid-page). No other dark sections.
- **No new animation/JS behavior** — motion is parked. New sections may carry the existing `.reveal` class only.
- All stats verbatim from `linkedin-profile.md`: `7+ years`, `+35% lead → meeting`, `9.2/10 client satisfaction`, `200M+ companies mapped`, `8,331` followers. No invented numbers.
- After every task: `npm test` passes (2 suites) — the restyle must not touch `src/js/graph.js` or `src/js/motion.js`.
- Dev server for visual checks: `npm run dev` → http://localhost:5173/

---

### Task 1: Identity v3 — base flip to light

**Files:**
- Modify: `src/styles/identity.css` (body background, `.card` hairline)
- Modify: `src/styles/components.css` (`.cta-band`, `.nav-toggle`, mobile menu, mobile-menu contrast)
- Modify: `src/styles/story.css` (`.pivot` contrast fix)

**Interfaces:**
- Produces: `.card` now renders with a 1px hairline border on all pages — later tasks create new `.card` elements and rely on this.

- [ ] **Step 1: Flip the body background and add the card hairline**

In `src/styles/identity.css` change the `body` rule (line 31-38) and `.card` rule (line 67-71):

```css
body {
  margin: 0;
  background: var(--white);          /* identity v3: light world */
  color: var(--ink);
  font-family: var(--font-body);
  font-size: var(--fs-body);
  line-height: 1.65;
}
```

```css
/* white card on the light world — hairline keeps the edge readable */
.card {
  background: var(--white);
  border: 1px solid rgba(30, 27, 18, 0.08);
  border-radius: var(--r-card);
  position: relative;
}
```

- [ ] **Step 2: Fix white-on-white contrast losses in components.css**

The CTA band was a white interruption on the honey world; it becomes the honey band (spec §3.7). In `src/styles/components.css` change `.cta-band` (line 70):

```css
/* --- shared CTA band (used by home + results) --- */
.cta-band { background: var(--honey); margin-top: var(--space-7); }
```

The mobile nav menu and toggle were white pills on honey; give them cream + hairline so they read on white. In the `@media (max-width: 720px)` block change `.site-nav .links` and `.nav-toggle`:

```css
  .site-nav .links {
    display: none;
    position: absolute; right: 16px; top: 64px; z-index: 50;
    flex-direction: column; align-items: flex-start; gap: var(--space-3);
    background: var(--cream); padding: var(--space-4);
    border-radius: var(--r-card); border-bottom-right-radius: var(--r-tail);
  }
```

```css
  .nav-toggle {
    display: inline-flex; margin-left: auto; align-items: center; gap: 8px;
    background: var(--cream); color: var(--ink); border: 0; font: 600 var(--fs-small) var(--font-body);
    padding: 0.6em 1.1em; border-radius: var(--r-pill); cursor: pointer;
  }
```

- [ ] **Step 3: Fix the story pivot (white full-bleed on white would vanish)**

In `src/styles/story.css` change `.pivot` (line 16):

```css
/* full-bleed cream interruption carrying the ONE big pull-quote — grid-breaking move */
.pivot { background: var(--cream); margin-block: var(--space-7); }
```

- [ ] **Step 4: Verify**

Run: `npm test`
Expected: 2 test files pass (graph.test.js, motion.test.js), 0 failures.

Run dev server, check all four pages (`/`, `/story/`, `/results/`, `/schedule/`): white background everywhere, every card visibly edged by a hairline, CTA bands honey, story pivot cream, mobile menu (≤720px) cream. The old honey hero-shape and bubbles still read.

- [ ] **Step 5: Commit**

```bash
git add src/styles/identity.css src/styles/components.css src/styles/story.css
git commit -m "feat: identity v3 — light world (white base, honey accents, hairline cards)"
```

---

### Task 2: North Node logo (nav, footer, favicon)

**Files:**
- Modify: `public/favicon.svg` (full replace)
- Modify: `index.html:20-23` and `index.html:126` (nav brand, footer mark)
- Modify: `story/index.html:19`, `story/index.html:131` (same swap)
- Modify: `results/index.html:19`, `results/index.html:117` (same swap)
- Modify: `schedule/index.html:19`, `schedule/index.html:70` (same swap)
- Modify: `src/styles/components.css` (`.brand-mark` rule replaced by `.brand-node`)

**Interfaces:**
- Produces: `.brand-node` (nav-size mark, 18×18) and `.brand-node--footer` (cream orbit for dark bg). Menu-button and cal-loading typing dots are content-level and KEPT (spec §2.3).

- [ ] **Step 1: Replace the favicon**

Full content of `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#1E1B12"/>
  <circle cx="32" cy="32" r="20" fill="none" stroke="#FFF3CC" stroke-opacity=".4" stroke-width="2.5" stroke-dasharray="3.5 6.5"/>
  <circle cx="32" cy="32" r="8" fill="#FFC21A"/>
  <circle cx="49" cy="20" r="4" fill="#FFC21A"/>
</svg>
```

- [ ] **Step 2: Swap the nav brand mark in all four HTML files**

In each of `index.html`, `story/index.html`, `results/index.html`, `schedule/index.html`, replace the line

```html
      <span class="brand-mark" aria-hidden="true"><span class="typing-dots typing-dots--live"><i></i><i></i><i></i></span></span>
```

with

```html
      <svg class="brand-node" aria-hidden="true" viewBox="0 0 76 76" width="18" height="18"><circle cx="38" cy="38" r="26" fill="none" stroke="rgba(30,27,18,.35)" stroke-width="4" stroke-dasharray="5 9"/><circle cx="38" cy="38" r="10" fill="#FFC21A"/><circle cx="60" cy="22" r="5" fill="#FFC21A"/></svg>
```

(Do NOT touch the `.nav-toggle` typing dots on the next lines — the dots motif survives inside content.)

- [ ] **Step 3: Swap the footer mark in all four HTML files**

In each file, replace the footer line

```html
    <span class="typing-dots" aria-hidden="true" style="color:#FFC21A"><i></i><i></i><i></i></span>
```

with

```html
    <svg class="brand-node brand-node--footer" aria-hidden="true" viewBox="0 0 76 76" width="18" height="18"><circle cx="38" cy="38" r="26" fill="none" stroke="rgba(255,243,204,.4)" stroke-width="4" stroke-dasharray="5 9"/><circle cx="38" cy="38" r="10" fill="#FFC21A"/><circle cx="60" cy="22" r="5" fill="#FFC21A"/></svg>
```

(Footer line numbers: `index.html:126`, `story/index.html:131`, `results/index.html:117`, `schedule/index.html:70`. The schedule page's `cal-loading` dots at `schedule/index.html:43` stay.)

- [ ] **Step 4: Rename the nav CTA to "Say hello" in all four HTML files**

In each nav (`index.html:31`, and the equivalent line in `story/index.html`, `results/index.html`, `schedule/index.html`), change

```html
      <a class="btn btn--primary" href="/schedule/">Start a conversation</a>
```

to

```html
      <a class="btn btn--primary" href="/schedule/">Say hello</a>
```

(Only the nav link — the hero's "Start a conversation" button and CTA-band button keep their text.)

- [ ] **Step 5: Replace the `.brand-mark` CSS with `.brand-node`**

In `src/styles/components.css`, replace the `.brand-mark` rule (lines 87-91):

```css
.brand-node { display: inline-block; flex: none; }
```

- [ ] **Step 6: Verify**

Run: `npm test` — Expected: 2 suites pass.
Dev server: all four pages show the orbit-node mark in nav (ink dashed orbit) and footer (cream dashed orbit); nav button reads "Say hello" everywhere; browser tab shows the new favicon (hard-refresh). `grep -rn "brand-mark" index.html story results schedule src` returns nothing.

- [ ] **Step 7: Commit**

```bash
git add public/favicon.svg index.html story/index.html results/index.html schedule/index.html src/styles/components.css
git commit -m "feat: North Node logo — nav, footer, favicon on all pages"
```

---

### Task 3: Proof band under the hero (home)

**Files:**
- Modify: `index.html` (remove hero metric bubbles lines 58-59; insert proof band section after hero section's closing `</section>` at line 62)
- Modify: `src/styles/home.css` (remove `.hero-metric` rules lines 26-28 and their mobile overrides lines 50-51; add `.proof-band`)

**Interfaces:**
- Consumes: `.bubble` variants from `components.css` (Task 1 unchanged them), `.card` hairline from Task 1.
- Produces: the proof band carries the hero's old metric copy — Task 3 removes the floating `.hero-metric` bubbles so numbers appear exactly once.

- [ ] **Step 1: Remove the floating hero metrics from `index.html`**

Delete these two lines (58-59):

```html
          <div class="drift hero-metric hero-metric--a"><span class="bubble bubble--ink bubble--reply">+35% lead → meeting</span></div>
          <div class="drift--alt drift hero-metric hero-metric--b"><span class="bubble bubble--white bubble--reply">9.2/10 client satisfaction</span></div>
```

- [ ] **Step 2: Insert the proof band right after the hero section**

After the hero's closing `</section>` (the one wrapping `.card.hero`), insert:

```html
    <!-- ================= PROOF BAND (v3 spec §3.3) — real numbers, overlapping the hero edge ================= -->
    <section class="container" aria-label="Key results">
      <div class="proof-band">
        <span class="bubble bubble--ink bubble--reply">7+ years</span>
        <span class="bubble bubble--white bubble--reply">+35% lead → meeting</span>
        <span class="bubble bubble--me">9.2/10 client satisfaction</span>
        <span class="bubble bubble--white bubble--reply">200M+ companies mapped</span>
      </div>
    </section>
```

- [ ] **Step 3: Update `src/styles/home.css`**

Delete the `.hero-metric` rules (lines 26-28) and the two mobile `.hero-metric--a/--b` overrides inside `@media (max-width: 860px)` (lines 50-51). Add after the hero rules:

```css
/* ================= proof band — bubbles straddling the hero's bottom edge ================= */
.proof-band {
  display: flex; flex-wrap: wrap; gap: var(--space-2);
  justify-content: center;
  margin-top: calc(-1 * var(--space-3));
  position: relative; z-index: 3;
}
```

- [ ] **Step 4: Verify**

Run: `npm test` — Expected: 2 suites pass.
Dev server `/`: four bubbles in a row overlapping the hero card's bottom edge; no floating bubbles left inside the hero photo area; at 320px the band wraps without covering the headline; hero entrance animation still plays.

- [ ] **Step 5: Commit**

```bash
git add index.html src/styles/home.css
git commit -m "feat: proof band — four real stats overlapping hero edge"
```

---

### Task 4: The Night Window (replaces "How the work sounds" on home)

**Files:**
- Modify: `index.html` (replace the whole thread section, lines 80-105)
- Modify: `src/styles/home.css` (remove `.thread-heading`/`.thread` rules; add night panel + constellation)

**Interfaces:**
- Consumes: `.reveal` (existing scroll system from `src/js/bubbles.js` — no JS change), `.container`, `.section-gap`.
- Produces: the ONLY dark panel on the site: `.night` with `.signal-zone`, `.signal-node`, `.signal-line`, `.signal-chip`, `.night-caption`.

- [ ] **Step 1: Replace the thread section in `index.html`**

Replace the entire section from `<!-- ================= WHAT I DO — a thread, not feature cards (spec §6.1.3) ================= -->` through its closing `</section>` (lines 80-105) with:

```html
    <!-- ================= THE NIGHT WINDOW (v3 spec §3.4) — the one dark panel on the site ================= -->
    <section class="container section-gap" aria-labelledby="signal-h">
      <div class="night reveal">
        <h2 id="signal-h">How a cold name becomes a <em>meeting</em></h2>
        <div class="signal-zone" role="img" aria-label="Pipeline: research, outreach, qualified, meeting">
          <i class="signal-line signal-line--1" aria-hidden="true"></i>
          <i class="signal-line signal-line--2" aria-hidden="true"></i>
          <i class="signal-line signal-line--3" aria-hidden="true"></i>
          <i class="signal-node signal-node--1" aria-hidden="true"></i>
          <i class="signal-node signal-node--2" aria-hidden="true"></i>
          <i class="signal-node signal-node--3" aria-hidden="true"></i>
          <i class="signal-node signal-node--4" aria-hidden="true"></i>
          <span class="signal-chip signal-chip--1">Research</span>
          <span class="signal-chip signal-chip--2">Outreach</span>
          <span class="signal-chip signal-chip--3">Qualified</span>
          <span class="signal-chip signal-chip--4">Meeting ✓</span>
        </div>
        <p class="night-caption">200M+ companies filtered, outreach tuned per market, calendars filled — scored 9.2/10.</p>
      </div>
    </section>
```

- [ ] **Step 2: Update `src/styles/home.css`**

Delete the `.thread-heading` and `.thread` rules (lines 38-39). Add:

```css
/* ================= the Night Window — the site's single dark panel ================= */
.night {
  background: var(--ink);
  background-image: radial-gradient(rgba(255, 243, 204, 0.13) 1px, transparent 1px);
  background-size: 8px 8px;
  border: none;
  border-radius: var(--r-card);
  color: var(--white);
  padding: var(--space-5) var(--space-4) var(--space-5);
  overflow: hidden;
}
.night h2 { text-align: center; color: var(--white); }
.night h2 em { font-style: italic; color: var(--honey); }

.signal-zone { position: relative; height: 220px; margin-top: var(--space-4); }
.signal-node {
  position: absolute; border-radius: var(--r-pill); background: var(--honey);
  box-shadow: 0 0 14px rgba(255, 194, 26, 0.85);
}
.signal-node--1 { width: 8px;  height: 8px;  left: 12%; top: 58%; opacity: 0.7; }
.signal-node--2 { width: 12px; height: 12px; left: 37%; top: 34%; }
.signal-node--3 { width: 10px; height: 10px; left: 63%; top: 60%; }
.signal-node--4 { width: 16px; height: 16px; left: 87%; top: 42%; box-shadow: 0 0 22px rgba(255, 194, 26, 0.95); }
.signal-line {
  position: absolute; border-top: 1px dashed rgba(255, 194, 26, 0.45);
  transform-origin: left center;
}
.signal-line--1 { left: 13%; top: 60%; width: 25%; transform: rotate(-12deg); }
.signal-line--2 { left: 38%; top: 37%; width: 26%; transform: rotate(12deg); }
.signal-line--3 { left: 64%; top: 62%; width: 24%; transform: rotate(-10deg); }
.signal-chip {
  position: absolute;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 243, 204, 0.3);
  color: var(--cream);
  font: 600 var(--fs-label) var(--font-body);
  letter-spacing: 0.18em; text-transform: uppercase;
  border-radius: 12px 12px 12px var(--r-tail);
  padding: 0.55em 0.95em; white-space: nowrap;
}
.signal-chip--1 { left: 4%;  top: 72%; }
.signal-chip--2 { left: 28%; top: 12%; }
.signal-chip--3 { left: 55%; top: 74%; }
.signal-chip--4 { left: 78%; top: 16%; }
.night-caption {
  text-align: center; color: rgba(255, 243, 204, 0.75);
  font-size: var(--fs-small); max-width: 52ch;
  margin: var(--space-4) auto 0;
}

/* mobile: constellation restacks to a vertical path (spec §7) */
@media (max-width: 640px) {
  .signal-zone {
    height: auto; display: flex; flex-direction: column; align-items: center;
    gap: var(--space-3); padding-block: var(--space-2);
    background-image: linear-gradient(rgba(255, 194, 26, 0.45) 50%, transparent 50%);
    background-size: 1px 8px; background-repeat: repeat-y; background-position: center top;
  }
  .signal-node, .signal-line { display: none; }
  .signal-chip { position: static; background: var(--ink); }
}
```

- [ ] **Step 3: Verify**

Run: `npm test` — Expected: 2 suites pass.
Dev server `/`: one dark dotted panel mid-page; title with honey italic "meeting"; four glowing nodes left→right with dashed connectors and four labeled chips; caption beneath. It fades in on scroll (existing `.reveal`). Narrow the window under 640px: chips stack vertically on a dashed honey spine, no overlap. Confirm no other dark section exists anywhere on the site.

- [ ] **Step 4: Commit**

```bash
git add index.html src/styles/home.css
git commit -m "feat: the Night Window — dark Signal Path panel replaces home thread"
```

---

### Task 5: Win-route cards (home)

**Files:**
- Modify: `index.html` (insert new section directly after the Night Window section)
- Modify: `src/styles/home.css` (add `.routes` rules)

**Interfaces:**
- Consumes: `.card` hairline (Task 1), `.reveal`, `--font-display`.
- Produces: `.routes` grid of 4 `.route` link-cards → `/results/`.

- [ ] **Step 1: Insert the section after the Night Window's `</section>`**

```html
    <!-- ================= WIN ROUTES (v3 spec §3.5) — real Finquest outcomes ================= -->
    <section class="container section-gap" aria-labelledby="routes-h">
      <h2 id="routes-h" class="routes-heading">Where hellos have led</h2>
      <div class="routes">
        <a class="card route reveal" href="/results/">
          <span class="route-code">Cold <i aria-hidden="true"></i> Meeting</span>
          <span class="route-title">+35% conversion</span>
          <span class="route-sub">rewrote the outreach playbook</span>
        </a>
        <a class="card route reveal" href="/results/">
          <span class="route-code">Months <i aria-hidden="true"></i> Weeks</span>
          <span class="route-title">Full market mapped</span>
          <span class="route-sub">for a PE investment thesis</span>
        </a>
        <a class="card route reveal" href="/results/">
          <span class="route-code">Zero <i aria-hidden="true"></i> 200M+</span>
          <span class="route-title">Company atlas built</span>
          <span class="route-sub">buy-side &amp; sell-side coverage</span>
        </a>
        <a class="card route reveal" href="/results/">
          <span class="route-code">Hello <i aria-hidden="true"></i> 9.2/10</span>
          <span class="route-title">Clients keep replying</span>
          <span class="route-sub">satisfaction, measured</span>
        </a>
      </div>
    </section>
```

- [ ] **Step 2: Add the CSS to `src/styles/home.css`**

```css
/* ================= win routes — outcomes as flight legs ================= */
.routes-heading { text-align: center; margin-bottom: var(--space-4); }
.routes { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-3); }
.route {
  display: flex; flex-direction: column; gap: var(--space-1);
  padding: var(--space-4); text-decoration: none;
}
.route-code {
  display: flex; align-items: center; gap: 8px;
  font: 600 var(--fs-label) var(--font-body);
  letter-spacing: 0.18em; text-transform: uppercase; opacity: 0.55;
}
.route-code i { flex: 1; border-top: 1px dashed rgba(30, 27, 18, 0.35); }
.route-title { font-family: var(--font-display); font-weight: 600; font-size: 1.35rem; }
.route-sub { font-size: var(--fs-small); opacity: 0.65; }
.route:hover { border-color: rgba(30, 27, 18, 0.3); }

@media (max-width: 640px) {
  .routes { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Verify**

Run: `npm test` — Expected: 2 suites pass.
Dev server `/`: 2×2 grid of hairline cards, each with an uppercase code over a dashed leg line, Fraunces title, quiet sub-line; every card navigates to `/results/`; single column under 640px.

- [ ] **Step 4: Commit**

```bash
git add index.html src/styles/home.css
git commit -m "feat: win-route cards — four real outcomes linking to results"
```

---

### Task 6: Followers card — cream restyle + move below the routes

**Files:**
- Modify: `index.html` (move the follower section from its current spot — directly after the hero/proof band — to after the win-routes section)
- Modify: `src/styles/home.css` (`.followers` cream)

**Interfaces:**
- Consumes: `renderFollowerCard` from `src/js/graph.js` targets `#follower-card` — the element moves but keeps its id, `data-target="8331"`, and inner structure EXACTLY (tests cover graph.js; do not edit it).

- [ ] **Step 1: Move the section in `index.html`**

Cut the whole `<!-- ================= FOLLOWER COUNT … -->` section (the `<section class="container section-gap">` wrapping `#follower-card`, currently lines 64-78) and paste it unchanged between the win-routes section and the hidden testimonial comment block.

- [ ] **Step 2: Restyle in `src/styles/home.css`**

Change the `.followers` rule:

```css
.followers { padding: var(--space-5); text-align: center; background: var(--cream); border: none; }
```

- [ ] **Step 3: Verify**

Run: `npm test` — Expected: 2 suites pass (graph.test.js untouched).
Dev server `/`: page order is hero → proof band → Night Window → routes → cream followers card → honey CTA band; the 8,331 count-up still animates on scroll into view.

- [ ] **Step 4: Commit**

```bash
git add index.html src/styles/home.css
git commit -m "feat: followers card — cream quiet panel, moved below win routes"
```

---

### Task 7: Full-site verification pass

**Files:**
- Modify: none expected — fixes only if checks fail.

- [ ] **Step 1: Run the automated checks**

```bash
npm test && npm run build
```

Expected: 2 test suites pass; `vite build` completes with all four pages emitted to `dist/` and zero errors.

- [ ] **Step 2: Manual matrix (dev server)**

Check every cell; fix-and-recommit anything broken:

- `/`, `/story/`, `/results/`, `/schedule/` at 320px, 860px, desktop.
- `/` order: nav → hero → proof band → Night Window → routes → followers → CTA → footer.
- Exactly ONE dark panel site-wide; proof band never covers the headline at 320px.
- North Node mark in nav + footer on all four pages; new favicon in tab.
- Existing motion intact: typing headline, hero spring entrance, reveals, follower count-up; `prefers-reduced-motion` (emulate in devtools) shows everything static.
- No leftover honey-world artifacts: `grep -rn "hero-metric\|thread-heading\|brand-mark" index.html story results schedule src` returns nothing.

- [ ] **Step 3: Final commit (only if fixes were needed)**

```bash
git add -A && git commit -m "fix: night-window redesign verification fixes"
```
